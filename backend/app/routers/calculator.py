import os
import json
import logging
from fastapi import APIRouter, HTTPException
from app.core.cura import process_3d_model
from app.models.request_models import SliceRequest, TEMP_DIR

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/calculator", tags=["Calculator"])

@router.post("/slice/")
def slice_model(request: SliceRequest):
    # Log the temp directory location
    logger.info(f"Using temp directory: {TEMP_DIR}")
    
    # Create a new folder for this job
    job_folder = os.path.join(TEMP_DIR, os.urandom(8).hex())
    os.makedirs(job_folder, exist_ok=True)
    logger.info(f"Created job folder: {job_folder}")
    
    # Save settings to JSON
    settings_path = os.path.join(job_folder, "settings.json")
    with open(settings_path, "w") as f:
        json.dump(request.settings, f)
    logger.info(f"Saved settings to: {settings_path}")
    
    # Process the model
    result = process_3d_model(request.model_path, request.settings)
    if result:
        # Save price to JSON
        price_path = os.path.join(job_folder, "price.json")
        with open(price_path, "w") as f:
            json.dump({"cost": result.get("cost", 0), "currency": "USD"}, f)
        logger.info(f"Saved price to: {price_path}")
        
        return {
            "message": "Slicing completed",
            "output": result,
            "temp_folder": job_folder
        }
    raise HTTPException(status_code=400, detail="Slicing failed")