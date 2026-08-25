# KILIMO AI — Web App (Frontend + Backend)

Mfumo wa wavuti wenye vipande viwili, ukiendana na Model A (Crop Recommendation)
na Model B (Diagnostic & Correction Tool) tulizozijenga kwenye notebook ya ML.

```
kilimo-ai/
├── index.html              ← FRONTEND (fungua moja kwa moja kwenye browser)
├── backend/
│   ├── app.py               ← BACKEND (Flask API)
│   ├── requirements.txt
│   ├── crop_recommendation_model.pkl   ← WEKA FAILI LAKO HAPA
│   ├── viwango_vya_mazao.json          ← WEKA FAILI LAKO HAPA
│   └── diagnostic_functions.py         ← WEKA FAILI LAKO HAPA
└── README.md
```

## Njia 1: Jaribu Frontend Peke Yake (Bila Backend)

Fungua tu `index.html` kwenye browser (double-click, au "Open with" browser yako).

- **Chunguza Tatizo (Model B)** itafanya kazi KIKAMILIFU mara moja — logic yote ya
  Python imetafsiriwa moja kwa moja kwenda JavaScript ndani ya `index.html`.
- **Pendekeza Zao (Model A)** itatumia *makadirio ya haraka ya kivinjari* (kulinganisha
  na wastani wa kila zao), SIYO Random Forest halisi — hii ni njia ya kujaribu UI
  bila kuhitaji server.
- Data ya mazao ni **DEMO (mazao 5 tu)**. Bofya "Pakia data yako" chini ya ukurasa
  na uchague `viwango_vya_mazao.json` ulioutengeneza kwenye notebook — mazao yote
  22 yataonekana papo hapo, bila kuhitaji kubadilisha code.

## Njia 2: Ungania na Backend Halisi (Usahihi Kamili wa Model A)

1. Nakili faili tatu za ML zilizotengenezwa kwenye notebook:
   - `crop_recommendation_model.pkl`
   - `viwango_vya_mazao.json`
   - `diagnostic_functions.py`

   ndani ya folder ya `backend/`.

2. Fungua terminal ndani ya `backend/`:
   ```bash
   python3 -m pip install -r requirements.txt
   uvicorn app:app --reload --port 5000
   ```
   Utaona ujumbe: `✅ Model A imepakuliwa.` na `✅ Jedwali la viwango limepakuliwa.`
   Server itafanya kazi kwenye `http://localhost:5000`.

   Njia mbadala (bila `--reload`): `python3 app.py`

   Fungua `http://localhost:5000/docs` kuona API docs zinazojitengeneza
   wenyewe (Swagger UI) — hapa unaweza kujaribu `/api/predict` na
   `/api/diagnose` moja kwa moja bila hata kufungua frontend.

3. Fungua `index.html`, nenda sehemu ya "Chanzo cha Data" chini ya ukurasa, weka:
   ```
   http://localhost:5000
   ```
   kwenye kisanduku cha "API URL". Sasa kitufe cha "Pata Pendekezo la Zao"
   kitatumia Random Forest yenu halisi (kupitia `/api/predict`).

## API Endpoints (kwa Backend Teammate)

| Endpoint | Method | Kazi |
|---|---|---|
| `/api/health` | GET | Angalia kama model/jedwali zimepakuliwa |
| `/api/predict` | POST | Model A — `{N,P,K,temperature,humidity,ph,rainfall}` → `{zao}` |
| `/api/diagnose` | POST | Model B — `{zao, usomaji_wa_sasa, aina_ya_udongo, ph_ya_maji}` → ripoti kamili |

## Kwa Frontend Teammate

`index.html` ni faili moja tu (HTML+CSS+JS) — inaweza kuwa msingi wa React
component au ukaendelea kuiongeza vipengele bila kuhitaji build tools. Muundo
wa design (rangi, fonti, "soil horizon" motif) upo kwenye `<style>` sehemu ya
juu ya faili — badilisha CSS variables (`:root { ... }`) kubadilisha mwonekano
mzima kwa haraka.

## Vidokezo vya Kiuaminifu (Muhimu kwa Ripoti Yenu)

- Data ya crop stats ndani ya `index.html` (kabla ya kupakia faili lako) ni
  **makadirio ya mfano tu**, siyo data halisi ya mafunzo — daima tumia
  `viwango_vya_mazao.json` halisi kwa matokeo sahihi.
- Formula za marekebisho ya pH ya maji zinatumia makadirio ya jumla ya
  kilimo cha hydroponics (siyo kipimo cha alkalinity cha kimaabara) — kama
  ilivyokubaliwa kwenye mazungumzo ya awali na ML teammate.
