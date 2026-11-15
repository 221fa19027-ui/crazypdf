import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from app.core.config import settings

class SlidingWindowRateLimiter:
    def __init__(self):
        # ip_action -> list of timestamps
        self.requests = defaultdict(list)

    def check_rate_limit(self, key: str, max_requests: int, window_seconds: int = 60) -> bool:
        now = time.time()
        window_start = now - window_seconds
        
        # Clean timestamps older than window
        timestamps = [t for t in self.requests[key] if t > window_start]
        self.requests[key] = timestamps
        
        if len(timestamps) >= max_requests:
            return False
            
        self.requests[key].append(now)
        return True

limiter = SlidingWindowRateLimiter()

def get_client_ip(request: Request) -> str:
    # 1. Cloudflare connecting IP (unspoofable when proxied by Cloudflare)
    cf_ip = request.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()

    # 2. Render proxy client IP
    render_ip = request.headers.get("Render-Proxy-Client-IP")
    if render_ip:
        return render_ip.strip()

    # 3. Standard X-Forwarded-For header
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()

    return request.client.host if request.client else "127.0.0.1"

async def rate_limit_upload(request: Request):
    ip = get_client_ip(request)
    key = f"upload:{ip}"
    if not limiter.check_rate_limit(key, settings.RATE_LIMIT_UPLOAD_PER_MIN, 60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Upload rate limit exceeded. Please wait a minute before uploading more documents."
        )

async def rate_limit_conversion(request: Request):
    ip = get_client_ip(request)
    key = f"conv:{ip}"
    if not limiter.check_rate_limit(key, settings.RATE_LIMIT_CONVERSION_PER_MIN, 60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Conversion rate limit exceeded (max 5 jobs/min). Please wait a moment."
        )

async def rate_limit_auth(request: Request):
    ip = get_client_ip(request)
    key = f"auth:{ip}"
    if not limiter.check_rate_limit(key, settings.RATE_LIMIT_AUTH_PER_MIN, 60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Auth rate limit exceeded. Please wait before retrying."
        )
