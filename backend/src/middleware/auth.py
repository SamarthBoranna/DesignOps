# Authentication middleware using Supabase client for JWT verification
from typing import Optional
from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..services.supabaseService import SupabaseService

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify JWT token using Supabase client.
    Returns the user payload from the verified token.
    """
    token = credentials.credentials
    
    try:
        # Use Supabase client to verify the token and get user
        supabase = SupabaseService.get_client()
        response = supabase.auth.get_user(token)
        
        if response.user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )
        
        user = response.user
        return {
            "id": user.id,
            "email": user.email,
            "role": user.role or "authenticated",
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[AUTH] Authentication error: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )

async def get_optional_user(request: Request) -> Optional[dict]:
    """
    Optional authentication - returns user if token present and valid, None otherwise.
    Useful for endpoints that work with or without authentication.
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    try:
        token = auth_header.split(" ")[1]
        supabase = SupabaseService.get_client()
        response = supabase.auth.get_user(token)
        
        if response.user is None:
            return None
        
        return {
            "id": response.user.id,
            "email": response.user.email,
            "role": response.user.role or "authenticated"
        }
    except:
        return None
