from fastapi import FastAPI
from app.routers import calculator

app = FastAPI(title="3D Printing Calculator API")

# Include the calculator router
app.include_router(calculator.router)

@app.get("/")
def read_root():
    return {"message": "3D Printing Calculator API is running"}
