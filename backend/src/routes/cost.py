# Backend routes for cost calculations
# This will contain FastAPI route handlers for cost-related endpoints

from fastapi import APIRouter

router = APIRouter(prefix="/api/cost", tags=["cost"])

@router.post("/calculate")
async def calculate_cost():
    """Calculate cost for a given architecture"""
    return {"total_cost": 0, "breakdown": []}
