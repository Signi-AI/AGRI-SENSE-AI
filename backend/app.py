"""
KILIMO AI — Backend (Flask)
============================
Hii ndiyo backend halisi itakayotumia faili zenu tatu za ML:
  - crop_recommendation_model.pkl  (Model A)
  - viwango_vya_mazao.json         (data ya Model B)
  - diagnostic_functions.py        (functions za Model B)

JINSI YA KUENDESHA:
  1. Nakili faili tatu hapo juu ndani ya folder hii hii (backend/)
  2. pip install -r requirements.txt
  3. python app.py
  4. Fungua frontend (index.html) na weka API URL: http://localhost:5000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

from diagnostic_functions import pakua_jedwali_la_viwango, toa_ripoti_kamili

app = Flask(__name__)
CORS(app)  # Inaruhusu frontend (kwenye domain/faili tofauti) kuita API hii

# ---------------------------------------------------------------
# Pakua model na jedwali MARA MOJA tu wakati server inaanza
# (siyo kwa kila ombi - hii ndiyo sababu ya utendaji mzuri)
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


@app.route("/api/health", methods=["GET"])
def health():
    """Angalia kama backend iko tayari - frontend inaweza kuita hii kwanza."""
    return jsonify({
        "status": "sawa",
        "model_A_ipo": model is not None,
        "jedwali_B_lipo": jedwali_la_viwango is not None,
        "idadi_ya_mazao": len(jedwali_la_viwango) if jedwali_la_viwango else 0
    })


def hakiki_data_ya_model_a(data):
    """
    Geti la uhakiki upande wa SERVER - hii ni MUHIMU hata kama frontend
    tayari inahakiki, kwa sababu mtu anaweza kutuma ombi moja kwa moja
    kwenye API (mfano kupitia Postman) bila kupitia frontend kabisa.
    Kanuni: kamwe usiamini data ya frontend pekee - server lazima ijilinde yenyewe.
    """
    makosa = []
    for k in ['N', 'P', 'K']:
        if data.get(k, 0) < 0:
            makosa.append(f"{k} haiwezi kuwa hasi.")
    ph = data.get('ph')
    if ph is not None and not (0 <= ph <= 14):
        makosa.append("pH lazima iwe kati ya 0 na 14.")
    humidity = data.get('humidity')
    if humidity is not None and not (0 <= humidity <= 100):
        makosa.append("Unyevu lazima uwe kati ya 0 na 100%.")
    temperature = data.get('temperature')
    if temperature is not None and not (-10 <= temperature <= 55):
        makosa.append("Joto liko nje ya wigo unaowezekana (-10 hadi 55°C).")
    if data.get('rainfall', 0) < 0:
        makosa.append("Mvua haiwezi kuwa hasi.")
    return makosa


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    MODEL A — Crop Recommendation
    Input (JSON): {N, P, K, temperature, humidity, ph, rainfall}
    Output (JSON): {zao: "..."}
    """
    if model is None:
        return jsonify({"hitilafu": "Model A haijapakuliwa upande wa server."}), 500

    data = request.get_json(force=True)
    try:
        vigezo = [
            data["N"], data["P"], data["K"],
            data["temperature"], data["humidity"],
            data["ph"], data["rainfall"]
        ]
    except KeyError as e:
        return jsonify({"hitilafu": f"Kigezo kinachokosekana: {e}"}), 400

    # GETI LA UHAKIKI - kabla ya kuhesabu chochote
    makosa = hakiki_data_ya_model_a(data)
    if makosa:
        return jsonify({"hitilafu": "Data uliyoingiza si sahihi kimantiki:", "makosa": makosa}), 400

    utabiri = model.predict([vigezo])
    zao = str(utabiri[0])

    # Hiari: ongeza uwezekano (probability) wa kila zao la juu kama model inaunga mkono
    matokeo = {"zao": zao}
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba([vigezo])[0]
        top3_idx = proba.argsort()[-3:][::-1]
        matokeo["top3"] = [
            {"zao": model.classes_[i], "uwezekano": round(float(proba[i]), 4)}
            for i in top3_idx
        ]

    return jsonify(matokeo)


@app.route("/api/diagnose", methods=["POST"])
def diagnose():
    """
    MODEL B — Diagnostic & Correction Tool
    Input (JSON): {
        zao, aina_ya_udongo,
        usomaji_wa_sasa: {N, P, K, temperature, humidity, ph},
        ph_ya_maji (hiari)
    }
    Output (JSON): ripoti kamili kutoka toa_ripoti_kamili()
    """
    if jedwali_la_viwango is None:
        return jsonify({"hitilafu": "Jedwali la Model B halijapakuliwa upande wa server."}), 500

    data = request.get_json(force=True)
    try:
        zao = data["zao"]
        usomaji = data["usomaji_wa_sasa"]
        aina_ya_udongo = data.get("aina_ya_udongo", "tifutifu")
        ph_ya_maji = data.get("ph_ya_maji", None)
    except KeyError as e:
        return jsonify({"hitilafu": f"Kigezo kinachokosekana: {e}"}), 400

    ripoti = toa_ripoti_kamili(
        zao=zao,
        usomaji_wa_sasa=usomaji,
        jedwali_la_viwango=jedwali_la_viwango,
        aina_ya_udongo=aina_ya_udongo,
        ph_ya_maji=ph_ya_maji
    )
    return jsonify(ripoti)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
