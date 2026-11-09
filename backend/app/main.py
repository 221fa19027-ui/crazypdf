import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router
from app.services.cleanup_service import cleanup_service

# Background task for periodic cleanup
async def periodic_cleanup_task():
    while True:
        try:
            await cleanup_service.cleanup_expired_jobs()
        except Exception:
            pass
        await asyncio.sleep(300)  # Scan every 5 minutes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Startup: initialize database tables
    await init_db()
    # 2. Cleanup any abandoned temporary storage from previous sessions
    cleanup_service.startup_cleanup()
    # 3. Launch background periodic cleanup
    cleanup_bg = asyncio.create_task(periodic_cleanup_task())
    yield
    # Shutdown
    cleanup_bg.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CrazyPDF — All Your PDF Tools. One Crazy-Simple Workspace. High-performance, privacy-first PDF processing platform.",
    lifespan=lifespan
)

# Custom Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Strict CORS Allowlist
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Root API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "storage_mode": "Zero Permanent Storage (Active)",
        "file_expiration_minutes": settings.FILE_EXPIRATION_MINUTES
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to CrazyPDF API. Explore available endpoints at /docs.",
        "tagline": "All Your PDF Tools. One Crazy-Simple Workspace.",
        "version": settings.VERSION
    }
