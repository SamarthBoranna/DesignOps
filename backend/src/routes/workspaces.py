# Backend routes for workspaces with authentication
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..services import workspaceService
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])

class WorkspaceCreate(BaseModel):
    name: str

class WorkspaceUpdate(BaseModel):
    name: str = None
    nodes: list = None

@router.get("")
async def list_workspaces(user: dict = Depends(get_current_user)):
    """List all workspaces for the authenticated user"""
    workspaces = workspaceService.WorkspaceService.get_all_workspaces(user["id"])
    return {"workspaces": workspaces}

@router.post("")
async def create_workspace(workspace: WorkspaceCreate, user: dict = Depends(get_current_user)):
    """Create a new workspace for the authenticated user"""
    new_workspace = workspaceService.WorkspaceService.create_workspace(workspace.name, user["id"])
    return new_workspace

@router.get("/{workspace_id}")
async def get_workspace(workspace_id: str, user: dict = Depends(get_current_user)):
    """Get a specific workspace for the authenticated user"""
    workspace = workspaceService.WorkspaceService.get_workspace_by_id(workspace_id, user["id"])
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.put("/{workspace_id}")
async def update_workspace(workspace_id: str, updates: WorkspaceUpdate, user: dict = Depends(get_current_user)):
    """Update a workspace for the authenticated user"""
    update_dict = updates.model_dump(exclude_unset=True)
    workspace = workspaceService.WorkspaceService.update_workspace(workspace_id, user["id"], update_dict)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.delete("/{workspace_id}")
async def delete_workspace(workspace_id: str, user: dict = Depends(get_current_user)):
    """Delete a workspace for the authenticated user"""
    success = workspaceService.WorkspaceService.delete_workspace(workspace_id, user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"success": True}
