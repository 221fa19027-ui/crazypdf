from datetime import datetime
from typing import Optional, Dict, Any
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.core.config import settings
from app.models.user import User
from app.core.security import create_access_token

class AuthService:
    @staticmethod
    async def verify_google_token(credential: str) -> Dict[str, Any]:
        """
        Validates Google OpenID Connect ID token using Google's public certs.
        """
        # If client ID is configured, strictly verify with Google certs
        if settings.GOOGLE_CLIENT_ID:
            try:
                id_info = id_token.verify_oauth2_token(
                    credential,
                    google_requests.Request(),
                    settings.GOOGLE_CLIENT_ID
                )
                if id_info["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
                    raise ValueError("Wrong issuer in Google token.")
                return id_info
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Google token verification failed: {str(e)}"
                )
        else:
            # Development fallback when credentials are not yet set in .env
            # Allows testing the exact Google OAuth session pipeline
            if credential == "demo_google_token" or credential.startswith("google_mock_"):
                return {
                    "sub": "google-demo-user-1029384756",
                    "email": "alex.demo@example.com",
                    "name": "Alex Demo",
                    "picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexDemo",
                    "email_verified": True
                }
            # Or attempt jwt decode if client sent mock token
            try:
                from jose import jwt
                unverified = jwt.get_unverified_claims(credential)
                if "email" in unverified and "sub" in unverified:
                    return unverified
            except Exception:
                pass
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google OAuth Client ID is not configured on the server. Please add GOOGLE_CLIENT_ID in .env or use the demo login."
            )

    @staticmethod
    async def authenticate_or_register(db: AsyncSession, google_info: Dict[str, Any]) -> Dict[str, Any]:
        google_sub = google_info["sub"]
        email = google_info.get("email", "")
        name = google_info.get("name", email.split("@")[0] if email else "CrazyPDF User")
        picture = google_info.get("picture", "")

        stmt = select(User).where(User.google_sub == google_sub)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        now = datetime.utcnow()
        if not user:
            # First time login - create user
            user = User(
                google_sub=google_sub,
                name=name,
                email=email,
                profile_picture=picture,
                created_at=now,
                last_login=now
            )
            db.add(user)
        else:
            # Update last login & profile details
            user.last_login = now
            if name:
                user.name = name
            if picture:
                user.profile_picture = picture

        await db.commit()
        await db.refresh(user)

        # Generate JWT session token
        token = create_access_token(data={"sub": user.id, "email": user.email, "name": user.name})

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "profile_picture": user.profile_picture,
                "created_at": user.created_at.isoformat(),
                "last_login": user.last_login.isoformat(),
            }
        }

auth_service = AuthService()
