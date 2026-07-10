from typing import Any
import uuid
from fastapi import APIRouter, HTTPException, Depends
from app.services.event_service import EventService
from app.schemas.frontend_dto import JobDTO
from app.core.dependencies import get_current_user
from app.schemas.auth import TokenPayload

router = APIRouter()

@router.get("/{job_id}", response_model=JobDTO)
async def get_job_status(
    job_id: str,
    current_user: TokenPayload = Depends(get_current_user)
) -> Any:
    """
    Poll the status of an async optimization job.
    """
    try:
        job_uuid = uuid.UUID(job_id)
        event = EventService.get_event(job_uuid)
        
        if not event:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Determine stages and percentages based on event status and payload
        # EventStatus: QUEUED, PROCESSING, COMPLETED, FAILED
        stage_mapping = {
            "QUEUED": ("PENDING", 0),
            "PROCESSING": ("OPTIMIZING", 50),
            "COMPLETED": ("COMPLETED", 100),
            "FAILED": ("FAILED", 100)
        }
        
        event_status_str = event.status.value if hasattr(event.status, 'value') else str(event.status)
        current_stage, progress_percentage = stage_mapping.get(event_status_str, ("UNKNOWN", 0))
        
        # If detailed progress is in processing_result, override
        if event.processing_result:
            current_stage = event.processing_result.get("stage", current_stage)
            progress_percentage = event.processing_result.get("progress_percentage", progress_percentage)
            
        description = "Processing job..."
        if current_stage == "PENDING":
            description = "Job is queued and waiting for an agent."
        elif current_stage == "UNDERSTANDING_FEEDBACK":
            description = "Agent is parsing your feedback."
        elif current_stage == "GENERATING_CONSTRAINTS":
            description = "Generating mathematical constraints."
        elif current_stage == "OPTIMIZING":
            description = "Running ML Optimizer."
        elif current_stage == "GENERATING_EXPLANATION":
            description = "Generating explainability payload."
        elif current_stage == "COMPLETED":
            description = "Job completed successfully."
        elif current_stage == "FAILED":
            description = event.error_message or "Job failed during processing."
            
        return JobDTO(
            job_id=str(event.id),
            status=event_status_str,
            current_stage=current_stage,
            progress_percentage=progress_percentage,
            description=description,
            created_at=event.created_at.isoformat() if event.created_at else "",
            updated_at=event.processed_at.isoformat() if event.processed_at else (event.created_at.isoformat() if event.created_at else ""),
            estimated_remaining_seconds=None,
            result_available=event_status_str == "COMPLETED"
        )
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job ID format")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail=f"Error fetching job: {str(e)}")
