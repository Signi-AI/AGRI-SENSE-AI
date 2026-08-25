"""
KILIMO AI — Backend (FastAPI)
==============================
Toleo la FastAPI la backend hii (badala ya Flask). Inatumia faili tatu
zile zile za ML:
  - crop_recommendation_model.pkl  (Model A)
  - viwango_vya_mazao.json         (data ya Model B)
  - diagnostic_functions.py        (functions za Model B)

JINSI YA KUENDESHA:
  1. Nakili faili tatu hapo juu ndani ya folder hii hii (backend/)
  2. python3 -m pip install -r requirements.txt
  3. uvicorn app:app --reload --port 5000
     (au: python3 app.py — zote mbili zinafanya kazi, lakini uvicorn
      inatoa --reload ya kuchunguza mabadiliko ya code moja kwa moja)
  4. Fungua http://127.0.0.1:5000/docs kuona API docs zinazojitengeneza wenyewe
  5. Fungua frontend (index.html) na weka API URL: http://127.0.0.1:5000
"""

import os
from typing import Optional, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

from diagnostic_functions import pakua_jedwali_la_viwango, toa_ripoti_kamili

app = FastAPI(title="KILIMO AI Backend")

# Inaruhusu frontend (index.html - domain/faili tofauti) kuita API hii
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
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
    print("✅ Model A imepakuliwa.")
else:
    print("⚠️  crop_recommendation_model.pkl haipo — weka faili hii kwenye backend/")

if os.path.exists(JSON_PATH):
    jedwali_la_viwango = pakua_jedwali_la_viwango(JSON_PATH)
    print(f"✅ Jedwali la viwango limepakuliwa ({len(jedwali_la_viwango)} mazao).")
else:
    print("⚠️  viwango_vya_mazao.json haipo — weka faili hii kwenye backend/")


# ---------------------------------------------------------------
# PYDANTIC MODELS — FastAPI inatumia hizi kuhakiki "sura" ya data
# (aina sahihi za namba/maandishi) MOJA KWA MOJA, bila sisi kuandika
# kwa mkono. Bado tunahitaji kuongeza uhakiki wa KIKEMIKALI wenyewe
# (mfano pH 0-14) - Pydantic haiwezi kujua hilo peke yake.
# ---------------------------------------------------------------
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


# ---------------------------------------------------------------
# GETI LA UHAKIKI WA KIKEMIKALI (sawa na Flask - Pydantic haifanyi hii)
# ---------------------------------------------------------------
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
    }


@app.post("/api/predict")
def predict(payload: ModelAInput):
    """
    MODEL A — Crop Recommendation
    Input (JSON): {N, P, K, temperature, humidity, ph, rainfall}
    Output (JSON): {zao: "...", top3: [...]}
    """
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
    """
    MODEL B — Diagnostic & Correction Tool
    Input (JSON): {zao, usomaji_wa_sasa, aina_ya_udongo, ph_ya_maji, ujazo_wa_lita}
    Output (JSON): ripoti kamili kutoka toa_ripoti_kamili()
    (Uhakiki wa kikemikali - pH 0-14, N/P/K 0-300, n.k. - unafanywa
    NDANI ya toa_ripoti_kamili/hakiki_usomaji, kwenye diagnostic_functions.py)
    """
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
