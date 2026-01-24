# Backend services for workspace operations
import json
import uuid
from datetime import datetime
from pathlib import Path

class WorkspaceService:
    _workspaces_file = None
    
    @staticmethod
    def _get_workspaces_file():
        """Get path to workspaces storage file"""
        if WorkspaceService._workspaces_file is None:
            backend_dir = Path(__file__).parent.parent.parent
            project_root = backend_dir.parent
            WorkspaceService._workspaces_file = project_root / "frontend" / "src" / "data" / "mockWorkspaces.json"
        return WorkspaceService._workspaces_file
    
    @staticmethod
    def _load_workspaces():
        """Load workspaces from JSON file"""
        workspaces_file = WorkspaceService._get_workspaces_file()
        if workspaces_file.exists():
            with open(workspaces_file, 'r') as f:
                return json.load(f)
        return []
    
    @staticmethod
    def _save_workspaces(workspaces):
        """Save workspaces to JSON file"""
        workspaces_file = WorkspaceService._get_workspaces_file()
        with open(workspaces_file, 'w') as f:
            json.dump(workspaces, f, indent=2)
    
    @staticmethod
    def get_all_workspaces():
        """Retrieve all workspaces"""
        return WorkspaceService._load_workspaces()
    
    @staticmethod
    def create_workspace(name: str):
        """Create a new workspace"""
        workspaces = WorkspaceService._load_workspaces()
        new_workspace = {
            "id": f"workspace-{uuid.uuid4().hex[:8]}",
            "name": name,
            "createdAt": datetime.utcnow().isoformat() + "Z",
            "updatedAt": datetime.utcnow().isoformat() + "Z",
            "nodes": []
        }
        workspaces.append(new_workspace)
        WorkspaceService._save_workspaces(workspaces)
        return new_workspace
    
    @staticmethod
    def get_workspace_by_id(workspace_id: str):
        """Retrieve a specific workspace by ID"""
        workspaces = WorkspaceService._load_workspaces()
        return next((w for w in workspaces if w.get("id") == workspace_id), None)
    
    @staticmethod
    def update_workspace(workspace_id: str, updates: dict):
        """Update a workspace"""
        workspaces = WorkspaceService._load_workspaces()
        for i, workspace in enumerate(workspaces):
            if workspace.get("id") == workspace_id:
                workspaces[i].update(updates)
                workspaces[i]["updatedAt"] = datetime.utcnow().isoformat() + "Z"
                WorkspaceService._save_workspaces(workspaces)
                return workspaces[i]
        return None
    
    @staticmethod
    def delete_workspace(workspace_id: str):
        """Delete a workspace"""
        workspaces = WorkspaceService._load_workspaces()
        workspaces = [w for w in workspaces if w.get("id") != workspace_id]
        WorkspaceService._save_workspaces(workspaces)
        return True
