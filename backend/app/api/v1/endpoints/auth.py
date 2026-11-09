from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.rate_limit import rate_limit_auth
from app.services.auth_service import auth_service
from app.models.user import User

router = APIRouter()

class GoogleAuthPayload(BaseModel):
    credential: str

@router.post("/google", dependencies=[Depends(rate_limit_auth)])
async def google_login(payload: GoogleAuthPayload, db: AsyncSession = Depends(get_db)):
    """
    Validates Google OpenID Connect token, logs in or registers user, and returns JWT session.
    """
    google_info = await auth_service.verify_google_token(payload.credential)
    result = await auth_service.authenticate_or_register(db, google_info)
    return result

@router.get("/me")
async def get_current_user_profile(user: User = Depends(get_current_user)):
    """Returns verified profile for the active Google session."""
    return {
        "id": user.id,
        "google_sub": user.google_sub,
        "name": user.name,
        "email": user.email,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at.isoformat(),
        "last_login": user.last_login.isoformat(),
    }

@router.post("/logout")
async def logout(user: User = Depends(get_current_user)):
    """Logs out and revokes active session."""
    return {"message": "Successfully logged out."}
