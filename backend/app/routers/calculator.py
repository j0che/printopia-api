from fastapi import APIRouter, HTTPException
from app.core.cura import process_3d_model
from app.models.request_models import SliceRequest

router = APIRouter(prefix="/calculator", tags=["Calculator"])

@router.post("/slice/")
def slice_model(request: SliceRequest):
    result = process_3d_model(request.model_path, request.settings)
    if result:
        return {"message": "Slicing completed", "output": result}
    raise HTTPException(status_code=400, detail="Slicing failed")
