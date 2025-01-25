from pydantic import BaseModel
import os

# Define base temp directory
TEMP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp")

class SliceRequest(BaseModel):
    model_path: str
    settings: dict

    def get_temp_dir(self):
        # Create temp directory if it doesn't exist
        if not os.path.exists(TEMP_DIR):
            os.makedirs(TEMP_DIR)
        return TEMP_DIR