# Backend routes for components
# This will contain FastAPI route handlers for component-related endpoints

from fastapi import APIRouter

router = APIRouter(prefix="/api/components", tags=["components"])

@router.get("/")
async def list_components():
    """List all available cloud components"""
    return {"components": []}

@router.get("/{component_id}")
async def get_component(component_id: str):
    """Get details for a specific component"""
    return {"id": component_id}
