from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.tabpfn_service import TabPFNService
from app.llm_service import LLMDeconstructorService

app = FastAPI(
    title="Kaizen API",
    description="Backend AI microservices powering the Kaizen Habit & Focus Companion (TabPFN + Open-Weight LLMs)",
    version="1.0.0"
)

# Enable CORS for Next.js development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize TabPFN service on startup
tabpfn_service = TabPFNService()

# ------------------------------------------------------------------------------
# Request / Response Schemas
# ------------------------------------------------------------------------------

class DeconstructRequest(BaseModel):
    task: str = Field(..., example="Write the 10-page computer networks lab report")
    emotional_state: str = Field(default="Task Paralysis", example="Task Paralysis")
    friend_name: str = Field(default="Alex", example="Alex")
    provider: Optional[str] = Field(default="auto")
    api_key: Optional[str] = None

class ForecastRequest(BaseModel):
    sleep_hours: float = Field(default=7.0, ge=0.0, le=24.0)
    screen_time_hours: float = Field(default=4.0, ge=0.0, le=24.0)
    water_liters: float = Field(default=2.0, ge=0.0, le=10.0)
    caffeine_cups: int = Field(default=2, ge=0, le=20)
    stress_level: int = Field(default=2, ge=1, le=5)
    morning_walk_mins: int = Field(default=15, ge=0, le=300)

# ------------------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    status = tabpfn_service.get_status()
    return {
        "status": "healthy",
        "service": "Kaizen AI Backend",
        "tabpfn": status
    }

@app.get("/api/history")
def get_habit_history():
    return tabpfn_service.get_history()

@app.post("/api/forecast")
def forecast_rhythm(req: ForecastRequest):
    try:
        metrics = req.model_dump()
        result = tabpfn_service.forecast(metrics)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/deconstruct")
def deconstruct_task(req: DeconstructRequest):
    try:
        result = LLMDeconstructorService.deconstruct(
            task=req.task,
            emotional_state=req.emotional_state,
            friend_name=req.friend_name,
            provider=req.provider,
            api_key=req.api_key
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
