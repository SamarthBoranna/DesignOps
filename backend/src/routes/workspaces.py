# Backend routes for workspaces
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services import workspaceService

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])

class WorkspaceCreate(BaseModel):
    name: str

class WorkspaceUpdate(BaseModel):
    name: str = None
    nodes: list = None

@router.get("/")
async def list_workspaces():
    """List all workspaces"""
    workspaces = workspaceService.WorkspaceService.get_all_workspaces()
    return {"workspaces": workspaces}

@router.post("/")
async def create_workspace(workspace: WorkspaceCreate):
    """Create a new workspace"""
    new_workspace = workspaceService.WorkspaceService.create_workspace(workspace.name)
    return new_workspace

@router.get("/{workspace_id}")
async def get_workspace(workspace_id: str):
    """Get a specific workspace"""
    workspace = workspaceService.WorkspaceService.get_workspace_by_id(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.put("/{workspace_id}")
async def update_workspace(workspace_id: str, updates: WorkspaceUpdate):
    """Update a workspace"""
    update_dict = updates.dict(exclude_unset=True)
    workspace = workspaceService.WorkspaceService.update_workspace(workspace_id, update_dict)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.delete("/{workspace_id}")
async def delete_workspace(workspace_id: str):
    """Delete a workspace"""
    success = workspaceService.WorkspaceService.delete_workspace(workspace_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"success": True}
