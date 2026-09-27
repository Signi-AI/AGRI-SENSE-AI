from pydantic import BaseModel
from typing import Optional,Dict

class ModelAInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class DiagnoseInput(BaseModel):
    zao: str
    usomaji_wa_sasa: Dict[str, float]
    aina_ya_udongo: str = "tifutifu"
    ph_ya_maji: Optional[float] = None
    ujazo_wa_lita: Optional[float] = 100


class UjumbeWaChat(BaseModel):
    ujumbe: str
