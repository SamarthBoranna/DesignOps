# Backend services for component operations
import json
import os
from pathlib import Path

class ComponentService:
    _components_cache = None
    
    @staticmethod
    def _load_components():
        """Load components from JSON file"""
        if ComponentService._components_cache is None:
            # Get the path to the frontend data directory
            backend_dir = Path(__file__).parent.parent.parent
            project_root = backend_dir.parent
            components_file = project_root / "frontend" / "src" / "data" / "components" / "aws.json"
            
            if components_file.exists():
                with open(components_file, 'r') as f:
                    ComponentService._components_cache = json.load(f)
            else:
                ComponentService._components_cache = []
        
        return ComponentService._components_cache
    
    @staticmethod
    def get_all_components():
        """Retrieve all available components"""
        return ComponentService._load_components()
    
    @staticmethod
    def get_component_by_id(component_id: str):
        """Retrieve a specific component by ID"""
        components = ComponentService._load_components()
        return next((c for c in components if c.get("id") == component_id), None)
    
    @staticmethod
    def search_components(query: str, category: str = None):
        """Search components by name or filter by category"""
        components = ComponentService._load_components()
        
        filtered = components
        if query:
            query_lower = query.lower()
            filtered = [c for c in filtered if query_lower in c.get("name", "").lower() or 
                       query_lower in c.get("description", "").lower()]
        
        if category:
            filtered = [c for c in filtered if c.get("category") == category]
        
        return filtered
