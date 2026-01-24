# Backend routes for workspaces
# This will contain FastAPI route handlers for workspace-related endpoints

from fastapi import APIRouter

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])

@router.get("/")
async def list_workspaces():
    """List all workspaces"""
    return {"workspaces": []}

@router.post("/")
async def create_workspace():
    """Create a new workspace"""
    return {"id": "new-workspace"}

@router.get("/{workspace_id}")
async def get_workspace(workspace_id: str):
    """Get a specific workspace"""
    return {"id": workspace_id}
