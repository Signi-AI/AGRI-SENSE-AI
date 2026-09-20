# AgriSense AI — Competition Frontend

A polished responsive React + Vite + Tailwind CSS frontend for an AI-powered precision agriculture platform.

## Stack
- React 18
- Vite
- Tailwind CSS
- JavaScript ES6+
- React Router DOM
- Lucide React

## Included
- Home / About / Our Solution / Contact flow
- Login, Register and Forgot Password UI
- Continue with Google as the second authentication option
- Dashboard with N, P, K, soil pH, water pH, humidity, temperature and rainfall
- Farm registration with browser GPS capture
- Soil Diagnosis including **Water pH**
- Crop Recommendation using **Soil pH, N, P, K, Humidity and Temperature only**
- No Soil Moisture field is used in the frontend
- AI Advisor demo chat
- Weather dashboard
- Notifications
- Profile picture upload with 5 MB validation
- Settings with working **System / Light / Dark** theme persistence
- Global **English ↔ Kiswahili** language switching with persistence
- Responsive mobile / tablet / laptop / desktop navigation

## Run
```bash
npm install
npm run dev
```

## Important production integration
This is a frontend-ready architecture. Connect real authentication, AI/ML APIs, weather APIs, database services and multi-sensor IoT through your backend before production.

Do not use demo AI/fertilizer values as real agronomic prescriptions. Production fertilizer/application rates should come from a validated agronomic model/ruleset and the required crop, soil, product and concentration context.
# Mfumo wa Uchunguzi wa Udongo/Maji — System Architecture

Mfumo wa AI unaomsaidia mkulima kuingiza matokeo ya kipimo cha udongo/maji na kupata: (1) zao linalopendekezwa, (2) hali ya udongo kwa zao hilo, na (3) suluhisho sahihi kwa **kilo/hekari** — bila kusubiri afisa ugani.

---

## 1. Muhtasari wa Mfumo

```
Frontend (React)
      |
      v
Backend (FastAPI)
   |        |
   v        v
Model A   Model B        <-- ML Component
   |        |
   v        v
Backend (inaunganisha majibu)
      |
      v
Database (PostgreSQL) -- inahifadhi historia
      |
      v
Frontend (inaonyesha matokeo)
```

**Mtiririko wa ombi moja:**
1. Mkulima anaingiza N, P, K, joto, unyevu, pH, mvua, na zao analolima kwenye fomu ya Frontend
2. Backend inapokea data, inaithibitisha (validation)
3. Backend inaita **Model A** kupata zao linalopendekezwa
4. Backend inaita **Model B** kupata ripoti ya utambuzi + suluhisho kwa zao hilo
5. Backend inaunganisha majibu yote mawili, inahifadhi kwenye Database, inarudisha kwa Frontend
6. Frontend inaonyesha: zao bora + hali ya udongo + suluhisho kwa kilo/hekari

---

## 2. Majukumu ya Kila Mwanachama

### ML Developer
- Anajenga na kufundisha Model A (Random Forest Classifier)
- Anajenga Model B (jedwali la min/max + formula za marekebisho)
- Anatoa faili: `crop_recommendation_model.pkl`, `viwango_vya_mazao.json`, `diagnostic_functions.py`

### Backend Developer
- Anajenga REST API (FastAPI) inayounganisha Model A na Model B
- Anasimamia Database (PostgreSQL) ya historia ya watumiaji
- Anahakikisha uthibitishaji wa data (validation) kabla ya kuipitisha kwa models

### Frontend Developer
- Anajenga fomu ya kuingiza data na dashboard ya kuonyesha matokeo
- Anaunganisha na Backend API kupitia HTTP requests (fetch/axios)
- Anahakikisha muundo ni rahisi, wa simu (mobile-first), kwa lugha rahisi

---

## 3. Tech Stack

| Sehemu | Teknolojia |
|---|---|
| Frontend | React, Tailwind CSS, Axios |
| Backend | Python, FastAPI, Uvicorn |
| Database | PostgreSQL, SQLAlchemy/SQLModel, Alembic |
| ML | Python, Scikit-learn, Pandas, Joblib |
| Deployment | Docker, CI/CD, Render/Railway/AWS |

---

## 4. Faili Anazozitoa ML Developer kwa Backend

1. **`crop_recommendation_model.pkl`** — Model A iliyofundishwa (Random Forest)
2. **`viwango_vya_mazao.json`** — Wigo (min/max/mean) wa N, P, K, pH kwa kila zao
3. **`diagnostic_functions.py`** — Model B: function za utambuzi na hesabu za marekebisho (kilo/hekari)

### Maktaba Zinazohitajika (Backend)

```
pip install scikit-learn joblib fastapi uvicorn
```

---

## 5. API Contract

### Endpoint: `POST /predict`

**Input (Frontend → Backend):**

```json
{
  "N": 40,
  "P": 30,
  "K": 20,
  "temperature": 30,
  "humidity": 65,
  "ph": 5.0,
  "rainfall": 120,
  "zao": "maize",
  "aina_ya_udongo": "tifutifu"
}
```

**Output (Backend → Frontend):**

```json
{
  "zao_linalopendekezwa": "maize",
  "confidence": 0.94,
  "hali_ya_jumla": "Kuna matatizo yanayohitaji hatua",
  "idadi_ya_matatizo": 2,
  "marekebisho": [
    {
      "kigezo": "Nitrogen",
      "hali": "upungufu",
      "kiasi": 94.4,
      "kipimo": "kg kwa hekta",
      "maelezo": "Ongeza mbolea yenye Nitrogen"
    },
    {
      "kigezo": "pH ya Udongo",
      "aina_ya_marekebisho": "chokaa",
      "kiasi": 4.38,
      "kipimo": "kg kwa hekta",
      "maelezo": "Ongeza chokaa cha kilimo"
    }
  ]
}
```

**Sheria za Ziada:**
- `confidence` chini ya `0.5` → Frontend ionyeshe: "Matokeo si ya uhakika, tafadhali pima tena"
- `marekebisho` inaweza kuwa orodha tupu `[]` ikiwa hakuna tatizo (`hali_ya_jumla: "Nzuri"`)
- Vipimo vyote vya kiasi ni kwa **kilo/hekari**, si gramu/mita za mraba

---

## 6. Muundo wa Folder (ML Component)

```
mfumo-wa-kilimo-ml/
├── data/
│   ├── crop_recommendation.csv
│   └── viwango_vya_mazao.csv
├── models/
│   └── crop_recommendation_model.pkl
├── notebooks/
│   └── chunguza_data.ipynb
├── src/
│   ├── data_generation.py
│   ├── train_model.py
│   ├── predict.py
│   └── diagnostic_functions.py
├── requirements.txt
└── README.md
```

---

## 7. Hatua Zinazofuata

- [ ] Kamilisha Model B (`diagnostic_functions.py`) na formula za kilo/hekari
- [ ] Kubaliana na Backend juu ya API contract hii (thibitisha majina ya fields)
- [ ] Backend: jenga endpoint `/predict` inayounganisha Model A na Model B
- [ ] Frontend: jenga fomu inayolingana na input fields hapo juu
- [ ] Jaribu mfumo mzima kwa "end-to-end" test moja kabla ya deployment

---

*Mradi wa: [andika majina ya wanachama wa timu hapa]*

AGRISENSE AI — HIGH QUALITY FRONTEND
====================================

1) Extract the folder.
2) Open the AgriSense-AI folder in VS Code.
3) Open VS Code Terminal (PowerShell).
4) Run:
   npm install
5) Then run:
   npm run dev
6) Open the Local URL shown by Vite (normally http://localhost:5173/).

IMPORTANT FEATURES IN THIS VERSION
-----------------------------------
- System / Light / Dark appearance with localStorage persistence.
- English <-> Kiswahili language selection across the app.
- Continue with Google is the second authentication option.
- Home has 10 agricultural hero images and changes automatically every 3 seconds.
- Soil Diagnosis includes Soil pH + Water pH + N/P/K + Humidity + Temperature.
- Crop Recommendation includes Soil pH + N/P/K + Humidity + Temperature only.
- Soil Moisture is NOT included.
- Workspace page with quick access to settings.
- Privacy & Security page.
- Responsive layouts for mobile, tablet, laptop and desktop.
- Farm registration + GPS UI.
- Profile picture max 5 MB UI validation.

NEXT INTEGRATION STAGE
----------------------
Frontend is now the UI foundation. Next stage can connect:
Multi-sensor IoT -> Backend/API -> AI/ML model -> AgriSense AI.

Demo values are placeholders and should not be treated as real agronomic prescriptions.
