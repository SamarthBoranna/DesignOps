# Backend routes for cost calculations
from fastapi import APIRouter
from pydantic import BaseModel
from ..services import costService

router = APIRouter(prefix="/api/cost", tags=["cost"])

class CostCalculationRequest(BaseModel):
    nodes: list

@router.post("/calculate")
async def calculate_cost(request: CostCalculationRequest):
    """Calculate cost for a given architecture"""
    result = costService.CostService.calculate_total_cost(request.nodes)
    return result
