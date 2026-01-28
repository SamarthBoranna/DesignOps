# Backend services for workspace operations using Supabase
from datetime import datetime
from .supabaseService import SupabaseService

class WorkspaceService:
    
    @staticmethod
    def get_all_workspaces(user_id: str):
        """Retrieve all workspaces for a specific user"""
        client = SupabaseService.get_client()
        
        response = client.table("workspaces").select("*").eq("user_id", user_id).order("updated_at", desc=True).execute()
        
        workspaces = []
        for workspace in response.data:
            # Get nodes for each workspace
            nodes_response = client.table("nodes").select("*").eq("workspace_id", workspace["id"]).execute()
            
            workspaces.append({
                "id": workspace["id"],
                "name": workspace["name"],
                "createdAt": workspace["created_at"],
                "updatedAt": workspace["updated_at"],
                "nodes": [
                    {
                        "nodeId": node["node_id"],
                        "componentId": node["component_id"],
                        "componentName": node["component_name"],
                        "position": node["position"],
                        "configOverrides": node["config_overrides"]
                    }
                    for node in nodes_response.data
                ]
            })
        
        return workspaces
    
    @staticmethod
    def create_workspace(name: str, user_id: str):
        """Create a new workspace for a user"""
        client = SupabaseService.get_client()
        
        response = client.table("workspaces").insert({
            "name": name,
            "user_id": user_id
        }).execute()
        
        workspace = response.data[0]
        
        return {
            "id": workspace["id"],
            "name": workspace["name"],
            "createdAt": workspace["created_at"],
            "updatedAt": workspace["updated_at"],
            "nodes": []
        }
    
    @staticmethod
    def get_workspace_by_id(workspace_id: str, user_id: str):
        """Retrieve a specific workspace by ID for a user"""
        client = SupabaseService.get_client()
        
        response = client.table("workspaces").select("*").eq("id", workspace_id).eq("user_id", user_id).execute()
        
        if not response.data:
            return None
        
        workspace = response.data[0]
        
        # Get nodes for this workspace
        nodes_response = client.table("nodes").select("*").eq("workspace_id", workspace_id).execute()
        
        return {
            "id": workspace["id"],
            "name": workspace["name"],
            "createdAt": workspace["created_at"],
            "updatedAt": workspace["updated_at"],
            "nodes": [
                {
                    "nodeId": node["node_id"],
                    "componentId": node["component_id"],
                    "componentName": node["component_name"],
                    "position": node["position"],
                    "configOverrides": node["config_overrides"]
                }
                for node in nodes_response.data
            ]
        }
    
    @staticmethod
    def update_workspace(workspace_id: str, user_id: str, updates: dict):
        """Update a workspace"""
        client = SupabaseService.get_client()
        
        # First verify the workspace belongs to the user
        existing = client.table("workspaces").select("*").eq("id", workspace_id).eq("user_id", user_id).execute()
        
        if not existing.data:
            return None
        
        # Update workspace name if provided
        if "name" in updates:
            client.table("workspaces").update({
                "name": updates["name"]
            }).eq("id", workspace_id).execute()
        
        # Update nodes if provided
        if "nodes" in updates:
            # Delete existing nodes
            client.table("nodes").delete().eq("workspace_id", workspace_id).execute()
            
            # Insert new nodes
            for node in updates["nodes"]:
                client.table("nodes").insert({
                    "workspace_id": workspace_id,
                    "node_id": node.get("nodeId"),
                    "component_id": node.get("componentId"),
                    "component_name": node.get("componentName"),
                    "position": node.get("position", {"x": 0, "y": 0}),
                    "config_overrides": node.get("configOverrides", {})
                }).execute()
        
        # Touch updated_at (trigger handles this, but let's be explicit)
        client.table("workspaces").update({
            "updated_at": datetime.utcnow().isoformat() + "Z"
        }).eq("id", workspace_id).execute()
        
        # Return updated workspace
        return WorkspaceService.get_workspace_by_id(workspace_id, user_id)
    
    @staticmethod
    def delete_workspace(workspace_id: str, user_id: str):
        """Delete a workspace"""
        client = SupabaseService.get_client()
        
        # First verify the workspace belongs to the user
        existing = client.table("workspaces").select("*").eq("id", workspace_id).eq("user_id", user_id).execute()
        
        if not existing.data:
            return False
        
        # Delete workspace (nodes will be cascade deleted)
        client.table("workspaces").delete().eq("id", workspace_id).execute()
        
        return True
