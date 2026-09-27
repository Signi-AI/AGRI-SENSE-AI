from fastapi import APIRouter
from app.schemas.predection import ModelAInput,DiagnoseInput,UjumbeWaChat
from app.services.predection import PredictionSevices

router=APIRouter(tags=["Predection"])


@router.get("/api/health")
def health():
    return PredictionSevices.health()

@router.get("/api/weather")
def weather(lat: float, lon: float):
    return PredictionSevices.weather(lat,lon)
 
@router.post("/api/predict")
def predict(payload: ModelAInput):
    return PredictionSevices.predict(payload)

@router.post("/api/diagnose")
def diagnose(payload: DiagnoseInput):
    return PredictionSevices.diagnose(payload)

@router.post("/api/chat")
def chat(payload: UjumbeWaChat):
    return PredictionSevices.chat(payload)