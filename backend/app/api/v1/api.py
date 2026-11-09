from fastapi import APIRouter
from app.api.v1.endpoints import auth, tools, jobs, user

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(tools.router, prefix="/tools", tags=["PDF Toolkit"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["Processing Jobs"])
api_router.include_router(user.router, prefix="/user", tags=["User Dashboard"])
