import os
import json
from fastapi import APIRouter, HTTPException
from typing import Any, Dict

router = APIRouter()

DEMO_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "demo_data")

@router.post("/load/{persona}", summary="Load Demo Persona Data")
async def load_demo_data(persona: str) -> Dict[str, Any]:
    """
    Load pre-calculated deterministic demo data for a persona.
    Available personas: Family_Vacation, Luxury_Couple, Budget_Backpacker
    """
    file_path = os.path.join(DEMO_DIR, f"{persona}_trip.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Demo data for persona '{persona}' not found.")
        
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
            return {
                "status": "SUCCESS",
                "message": f"Demo data for {persona} loaded successfully.",
                "data": data
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading demo data: {e}")
