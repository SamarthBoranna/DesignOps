# Backend routes for authentication
from fastapi import APIRouter, Depends
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/me")
async def get_current_user_info(user: dict = Depends(get_current_user)):
    """Get the currently authenticated user's information"""
    return {
        "id": user["id"],
        "email": user.get("email"),
        "role": user.get("role")
    }
