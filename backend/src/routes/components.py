# Backend routes for components
from fastapi import APIRouter, Query
from ..services import componentService

router = APIRouter(prefix="/api/components", tags=["components"])

@router.get("/")
async def list_components(
    search: str = Query(None, description="Search query"),
    category: str = Query(None, description="Filter by category")
):
    """List all available cloud components"""
    if search or category:
        components = componentService.ComponentService.search_components(search or "", category)
    else:
        components = componentService.ComponentService.get_all_components()
    return {"components": components}

@router.get("/{component_id}")
async def get_component(component_id: str):
    """Get details for a specific component"""
    component = componentService.ComponentService.get_component_by_id(component_id)
    if not component:
        return {"error": "Component not found"}, 404
    return component
