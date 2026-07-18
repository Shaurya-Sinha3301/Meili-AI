import os
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Any, Dict

from app.services.demo_provision_service import DemoProvisionService
from app.services.user_service import UserService
from app.core.security import create_access_token

router = APIRouter()

DEMO_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "demo_data")

@router.post("/reset", summary="Reset Demo Database")
async def reset_demo_data() -> Dict[str, Any]:
    """
    Reset and re-provision the demo database.
    """
    try:
        DemoProvisionService.reset_demo()
        return {"status": "SUCCESS", "message": "Demo database reset and provisioned successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting demo database: {e}")

@router.post("/load/{persona}", summary="Load Demo Persona Session")
async def load_demo_data(persona: str) -> Dict[str, Any]:
    """
    Load demo persona information and return an authentication token.
    Does not mutate the database, just loads the session.
    """
    file_path = os.path.join(DEMO_DIR, f"{persona}_trip.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Demo data for persona '{persona}' not found.")
        
    try:
        # Load user to generate token
        email = f"{persona.lower()}@demo.merydian.com"
        user = UserService.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="Demo user not provisioned. Run provisioning first.")
            
        access_token = create_access_token(subject=str(user.id))
        
        with open(file_path, "r") as f:
            data = json.load(f)
            return {
                "status": "SUCCESS",
                "message": f"Demo session for {persona} loaded successfully.",
                "data": data,
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading demo session: {e}")
