"""
ML Router - Model A (Crop Recommendation), Model B (Diagnostic Tool),
Weather (OpenWeather), na AI Advisor (Groq).
Hii ni endpoints zilizohamishwa kutoka backend/app.py ya awali, sasa
zikiwa sehemu ya muundo mpya wa app/ package.
"""

import math
import os
from pathlib import Path
from typing import Optional, Dict

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
import joblib
import requests

from app.core.dependencies import get_current_user
from app.models.user import User
from app.ml.diagnostic_functions import pakua_jedwali_la_viwango, toa_ripoti_kamili

router = APIRouter(tags=["ML & Weather & Chat"])

# ---------------------------------------------------------------
# Njia (path) - artifacts za ML za runtime ziko backend/app/ml/.
# Faili hii iko backend/app/api/router/, hivyo parents[2] ni backend/app/.
# Nakala ya chanzo iko ../machine-learning/ (angalia README yake).
# ---------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2] / "ml"
MODEL_PATH = BASE_DIR / "crop_recommendation_model.pkl"
JSON_PATH = BASE_DIR / "viwango_vya_mazao.json"

model = None
jedwali_la_viwango = None

if MODEL_PATH.exists():
    model = joblib.load(MODEL_PATH)
    print("Model A imepakuliwa.")
else:
    print(f"crop_recommendation_model.pkl haipo — {MODEL_PATH}")

if JSON_PATH.exists():
    jedwali_la_viwango = pakua_jedwali_la_viwango(str(JSON_PATH))
    print(f"Jedwali la viwango limepakuliwa ({len(jedwali_la_viwango)} mazao).")
else:
    print(f"viwango_vya_mazao.json haipo — {JSON_PATH}")

# ---------------------------------------------------------------
# Weather API
# ---------------------------------------------------------------
OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
if OPENWEATHER_API_KEY:
    print("Weather API key imepatikana.")
else:
    print("OPENWEATHER_API_KEY haijawekwa - /api/weather haitafanya kazi.")

# ---------------------------------------------------------------
# Groq API (AI Advisor)
# Jina la model linaweza kubadilishwa bila kugusa code: weka
# GROQ_MODEL kwenye .env / Render Environment. Groq huzima models
# za zamani mara kwa mara (mfano llama-3.3-70b-versatile ilizimwa
# Agosti 2026), kwa hiyo usiliandike moja kwa moja ndani ya function.
# ---------------------------------------------------------------
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")

if GROQ_API_KEY:
    print(f"Groq AI imepatikana - AI Advisor iko tayari (model: {GROQ_MODEL}).")
else:
    print("GROQ_API_KEY haijawekwa - /api/chat haitafanya kazi.")

MFUMO_WA_AI = """
Wewe ni AgriSense AI - mshauri wa kilimo mwenye ujuzi kwa wakulima wa Tanzania.
Jibu maswali kwa ufupi, kwa lugha rahisi, ukizingatia mazingira ya kilimo Afrika Mashariki.
Kama swali halihusiani na kilimo, eleza kwa upole kuwa unaweza kusaidia tu na mada za kilimo.

MUHIMU KUHUSU LUGHA: Daima jibu kwa LUGHA ILE ILE aliyotumia mtumiaji kuuliza swali.
Kama ameuliza kwa Kiingereza, jibu kwa Kiingereza. Kama ameuliza kwa Kiswahili, jibu
kwa Kiswahili. Usibadilishe lugha ya mtumiaji kwenda lugha nyingine kamwe.
"""


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

    @field_validator("zao", "aina_ya_udongo")
    @classmethod
    def short_text(cls, v: str) -> str:
        v = v.strip()
        if not v or len(v) > 100:
            raise ValueError("Text must be between 1 and 100 characters")
        return v

    @field_validator("usomaji_wa_sasa")
    @classmethod
    def limit_readings(cls, v: Dict[str, float]) -> Dict[str, float]:
        if len(v) > 20:
            raise ValueError("Too many readings (maximum 20)")
        for key, value in v.items():
            if len(key) > 50 or not math.isfinite(value) or abs(value) > 1_000_000:
                raise ValueError("Invalid reading value")
        return v


class UjumbeWaChat(BaseModel):
    ujumbe: str

    @field_validator("ujumbe")
    @classmethod
    def limit_message(cls, v: str) -> str:
        v = v.strip()
        if not v or len(v) > 2000:
            raise ValueError("Message must be between 1 and 2000 characters")
        return v


def hakiki_data_ya_model_a(data: ModelAInput):
    makosa = []
    for jina, thamani in [("N", data.N), ("P", data.P), ("K", data.K)]:
        if thamani < 0:
            makosa.append(f"{jina} haiwezi kuwa hasi.")
        elif thamani > 300:
            makosa.append(f"{jina} ({thamani}) ni kubwa mno — wigo unaowezekana ni 0 hadi 300.")
    if not (0 <= data.ph <= 14):
        makosa.append("pH lazima iwe kati ya 0 na 14.")
    if not (0 <= data.humidity <= 100):
        makosa.append("Unyevu lazima uwe kati ya 0 na 100%.")
    if not (-10 <= data.temperature <= 55):
        makosa.append("Joto liko nje ya wigo unaowezekana (-10 hadi 55°C).")
    if data.rainfall < 0:
        makosa.append("Mvua haiwezi kuwa hasi.")
    return makosa


def _hali_ya_ml():
    return {
        "model_A_ipo": model is not None,
        "jedwali_B_lipo": jedwali_la_viwango is not None,
        "idadi_ya_mazao": len(jedwali_la_viwango) if jedwali_la_viwango else 0,
        "weather_ipo": OPENWEATHER_API_KEY is not None,
        "ai_advisor_ipo": GROQ_API_KEY is not None,
    }


@router.get("/api/ml-status")
def ml_status():
    return _hali_ya_ml()


# /api/health - jina la awali ambalo frontend inaweza kuwa inaliita.
# Kama main.py tayari ina /api/health yake, futa hii moja ili zisirudie.
@router.get("/api/health")
def health():
    return {"status": "sawa", **_hali_ya_ml()}


@router.get("/api/weather")
def weather(lat: float, lon: float, _user: User = Depends(get_current_user)):
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENWEATHER_API_KEY haijawekwa upande wa server.")
    try:
        res = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"},
            timeout=8,
        )
        res.raise_for_status()
        data = res.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Imeshindwa kufikia Weather API: {e}")

    return {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "mahali": data.get("name", ""),
        "ujumbe": "Mvua (rainfall) haijajazwa kiotomatiki - tafadhali ijaze mwenyewe (wastani wa mm/mwaka).",
    }


@router.post("/api/predict")
def predict(payload: ModelAInput, _user: User = Depends(get_current_user)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model A haijapakuliwa upande wa server.")

    makosa = hakiki_data_ya_model_a(payload)
    if makosa:
        raise HTTPException(status_code=400, detail={"hitilafu": "Data si sahihi:", "makosa": makosa})

    vigezo = [payload.N, payload.P, payload.K, payload.temperature,
              payload.humidity, payload.ph, payload.rainfall]

    utabiri = model.predict([vigezo])
    matokeo = {"zao": str(utabiri[0])}

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba([vigezo])[0]
        top3_idx = proba.argsort()[-3:][::-1]
        matokeo["top3"] = [
            {"zao": model.classes_[i], "uwezekano": round(float(proba[i]), 4)}
            for i in top3_idx
        ]
    return matokeo


@router.post("/api/diagnose")
def diagnose(payload: DiagnoseInput, _user: User = Depends(get_current_user)):
    if jedwali_la_viwango is None:
        raise HTTPException(status_code=500, detail="Jedwali la Model B halijapakuliwa.")

    return toa_ripoti_kamili(
        zao=payload.zao,
        usomaji_wa_sasa=payload.usomaji_wa_sasa,
        jedwali_la_viwango=jedwali_la_viwango,
        aina_ya_udongo=payload.aina_ya_udongo,
        ph_ya_maji=payload.ph_ya_maji,
        ujazo_wa_lita=payload.ujazo_wa_lita or 100,
    )


@router.post("/api/chat")
def chat(payload: UjumbeWaChat, _user: User = Depends(get_current_user)):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY haijawekwa upande wa server.")
    if not payload.ujumbe or not payload.ujumbe.strip():
        raise HTTPException(status_code=400, detail="Tafadhali andika swali kabla ya kutuma.")

    try:
        res = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,   # SI jina lililoandikwa kwa mkono - linatoka juu
                "messages": [
                    {"role": "system", "content": MFUMO_WA_AI},
                    {"role": "user", "content": payload.ujumbe},
                ],
            },
            timeout=15,
        )
        res.raise_for_status()
        data = res.json()
        jibu = data["choices"][0]["message"]["content"]
        return {"jibu": jibu}
    except requests.exceptions.HTTPError as e:
        # Groq hutuma sababu halisi kwenye body (mfano model_not_found).
        # Tuiweke kwenye ujumbe ili tusilazimike kubahatisha tena.
        sababu = e.response.text[:300] if e.response is not None else str(e)
        raise HTTPException(status_code=502, detail=f"Groq imekataa ombi: {sababu}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Imeshindwa kupata jibu kutoka Groq: {e}")
    except (KeyError, IndexError):
        raise HTTPException(status_code=502, detail="Groq imerudisha muundo usiotegemewa.")