"""
AGRI-SENSE AI — Backend (FastAPI)
==============================
Toleo la FastAPI la backend hii inatumia faili tatu
zile zile za ML:
  - crop_recommendation_model.pkl  
  - viwango_vya_mazao.json         
  - diagnostic_functions.py        
"""

import os
from typing import Optional, Dict

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import requests

from diagnostic_functions import pakua_jedwali_la_viwango, toa_ripoti_kamili

app = FastAPI(title="AGRI-SENSE")

# ---------------------------------------------------------------
# Weather API - "API key" inasomwa kutoka environment variable,
# KAMWE isiandikwe moja kwa moja ndani ya code (usalama). Pata key
# ya bure kwenye https://openweathermap.org/api kisha weka kwenye
# faili ya .env (localhost) au Render Environment Variables
# (production) kama: OPENWEATHER_API_KEY=key_yako_hapa
# ---------------------------------------------------------------
OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
if OPENWEATHER_API_KEY:
    print("Weather API key imepatikana - kipengele cha GPS/hali ya hewa kiko tayari.")
else:
    print("OPENWEATHER_API_KEY haijawekwa - /api/weather haitafanya kazi mpaka uiweke.")

# ---------------------------------------------------------------
# Groq API - kwa ajili ya "AI Advisor" (chat). Groq inafuata muundo
# wa OpenAI (chat/completions), na uthibitisho (auth) unapitia
# "header" (Authorization: Bearer ...), siyo kwenye URL kama Gemini.
# Pata key ya bure kwenye https://console.groq.com/keys kisha weka
# kwenye .env (localhost) au Render Environment Variables
# (production) kama: GROQ_API_KEY=key_yako_hapa
# ---------------------------------------------------------------
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "openai/gpt-oss-120b"   # model imara, ya bure, yenye uwezo mzuri

if GROQ_API_KEY:
    print("Groq AI imepatikana - AI Advisor iko tayari.")
else:
    print("GROQ_API_KEY haijawekwa - /api/chat haitafanya kazi mpaka uiweke.")

MFUMO_WA_AI = """
Wewe ni AgriSense AI - mshauri wa kilimo mwenye ujuzi kwa wakulima wa Tanzania.
Jibu maswali kwa ufupi, kwa lugha rahisi, ukizingatia mazingira ya kilimo Afrika Mashariki.
Kama swali halihusiani na kilimo, eleza kwa upole kuwa unaweza kusaidia tu na mada za kilimo.

MUHIMU KUHUSU LUGHA: Daima jibu kwa LUGHA ILE ILE aliyotumia mtumiaji kuuliza swali.
Kama ameuliza kwa Kiingereza, jibu kwa Kiingereza. Kama ameuliza kwa Kiswahili, jibu
kwa Kiswahili. Usibadilishe lugha ya mtumiaji kwenda lugha nyingine kamwe.
"""

# Inaruhusu frontend (index.html - domain/faili tofauti) kuita API hii
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

# ---------------------------------------------------------------
# Pakua model na jedwali MARA MOJA tu wakati server inaanza
# ---------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "crop_recommendation_model.pkl")
JSON_PATH = os.path.join(BASE_DIR, "viwango_vya_mazao.json")

model = None
jedwali_la_viwango = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Model A imepakuliwa.")
else:
    print("crop_recommendation_model.pkl haipo — weka faili hii kwenye backend/")

if os.path.exists(JSON_PATH):
    jedwali_la_viwango = pakua_jedwali_la_viwango(JSON_PATH)
    print(f"Jedwali la viwango limepakuliwa ({len(jedwali_la_viwango)} mazao).")
else:
    print("viwango_vya_mazao.json haipo — weka faili hii kwenye backend/")


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


def hakiki_data_ya_model_a(data: ModelAInput):
    makosa = []
    for jina, thamani in [("N", data.N), ("P", data.P), ("K", data.K)]:
        if thamani < 0:
            makosa.append(f"{jina} haiwezi kuwa hasi.")
        elif thamani > 300:
            makosa.append(f"{jina} ({thamani}) ni kubwa mno kuwa na maana kikemikali — wigo unaowezekana ni 0 hadi 300.")
    if not (0 <= data.ph <= 14):
        makosa.append("pH lazima iwe kati ya 0 na 14.")
    if not (0 <= data.humidity <= 100):
        makosa.append("Unyevu lazima uwe kati ya 0 na 100%.")
    if not (-10 <= data.temperature <= 55):
        makosa.append("Joto liko nje ya wigo unaowezekana (-10 hadi 55°C).")
    if data.rainfall < 0:
        makosa.append("Mvua haiwezi kuwa hasi.")
    return makosa


@app.get("/api/health")
def health():
    """Angalia kama backend iko tayari - frontend inaweza kuita hii kwanza."""
    return {
        "status": "sawa",
        "model_A_ipo": model is not None,
        "jedwali_B_lipo": jedwali_la_viwango is not None,
        "idadi_ya_mazao": len(jedwali_la_viwango) if jedwali_la_viwango else 0,
        "ai_advisor_ipo": GROQ_API_KEY is not None,
    }


@app.get("/api/weather")
def weather(lat: float, lon: float):
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


@app.post("/api/predict")
def predict(payload: ModelAInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model A haijapakuliwa upande wa server.")

    makosa = hakiki_data_ya_model_a(payload)
    if makosa:
        raise HTTPException(status_code=400, detail={"hitilafu": "Data uliyoingiza si sahihi kimantiki:", "makosa": makosa})

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


@app.post("/api/diagnose")
def diagnose(payload: DiagnoseInput):
    if jedwali_la_viwango is None:
        raise HTTPException(status_code=500, detail="Jedwali la Model B halijapakuliwa upande wa server.")

    ripoti = toa_ripoti_kamili(
        zao=payload.zao,
        usomaji_wa_sasa=payload.usomaji_wa_sasa,
        jedwali_la_viwango=jedwali_la_viwango,
        aina_ya_udongo=payload.aina_ya_udongo,
        ph_ya_maji=payload.ph_ya_maji,
        ujazo_wa_lita=payload.ujazo_wa_lita or 100,
    )
    return ripoti


@app.post("/api/chat")
def chat(payload: UjumbeWaChat):
    """
    AI Advisor - Chatbot inayotumia Groq (muundo wa OpenAI chat/completions)
    kumjibu mkulima maswali ya wazi kuhusu kilimo.
    """
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
                "model": GROQ_MODEL,
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
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Imeshindwa kupata jibu kutoka Groq: {e}")
    except (KeyError, IndexError):
        raise HTTPException(status_code=502, detail="Groq imerudisha muundo usiotegemewa wa jibu.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)