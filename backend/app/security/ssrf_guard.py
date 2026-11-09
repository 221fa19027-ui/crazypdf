import socket
import ipaddress
from urllib.parse import urlparse
from fastapi import HTTPException

# Disallowed IP networks
BLOCKED_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),       # Link-local & Cloud metadata
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("224.0.0.0/4"),         # Multicast
    ipaddress.ip_network("240.0.0.0/4"),         # Reserved
    ipaddress.ip_network("::1/128"),             # IPv6 Loopback
    ipaddress.ip_network("fc00::/7"),            # IPv6 Private
    ipaddress.ip_network("fe80::/10"),           # IPv6 Link-local
]

def is_ip_blocked(ip_str: str) -> bool:
    try:
        ip = ipaddress.ip_address(ip_str)
        for net in BLOCKED_NETWORKS:
            if ip in net:
                return True
        return False
    except ValueError:
        return True

def validate_safe_url(url: str) -> str:
    """
    Validates URL to prevent Server-Side Request Forgery (SSRF).
    Only allows HTTP/HTTPS and prevents internal/private addresses.
    """
    if not url or not isinstance(url, str):
        raise HTTPException(status_code=400, detail="Invalid URL specified.")

    parsed = urlparse(url.strip())
    if parsed.scheme.lower() not in ("http", "https"):
        raise HTTPException(
            status_code=400,
            detail="Only HTTP and HTTPS protocols are supported for security."
        )

    hostname = parsed.hostname
    if not hostname:
        raise HTTPException(status_code=400, detail="Invalid host in URL.")

    # Block common local hostnames
    if hostname.lower() in ("localhost", "127.0.0.1", "0.0.0.0", "internal", "local", "metadata.google.internal"):
        raise HTTPException(status_code=403, detail="Access to local or internal hosts is strictly forbidden.")

    # Resolve DNS to check resulting IP addresses
    try:
        addr_info = socket.getaddrinfo(hostname, None)
        for item in addr_info:
            ip_str = item[4][0]
            if is_ip_blocked(ip_str):
                raise HTTPException(
                    status_code=403,
                    detail=f"Access to private or restricted network address ({ip_str}) is prohibited."
                )
    except socket.gaierror:
        raise HTTPException(status_code=400, detail=f"Could not resolve hostname: {hostname}")

    return url
