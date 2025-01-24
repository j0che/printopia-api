from pydantic import BaseModel

class SliceRequest(BaseModel):
    model_path: str
    settings: dict
