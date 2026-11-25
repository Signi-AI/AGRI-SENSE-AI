# Machine Learning — AgriSense AI

Hii ndiyo **chanzo (source of truth)** cha vipengele vya ML. Backend inatumia
nakala ya runtime iliyo kwenye `../backend/app/ml/`.

## Muundo

```
machine-learning/
├── data/          # data ya mafunzo (Crop_recommendation, viwango kamili)
├── models/        # crop_recommendation_model.pkl (Model A)
├── notebooks/     # uchunguzi wa data
├── src/           # diagnostic_functions.py (Model B), data_generation.py, train_model.py, predict.py
├── archive/       # nakala za zamani zilizotofautiana — kumbukumbu tu, sizitumike
├── scripts/       # sync_to_backend.sh
├── requirements.txt
└── viwango_vya_mazao.json   # jedwali la viwango (Model B)
```

## Baada ya kutrain au kurekebisha ML

Kusawazisha nakala ya runtime inayotumika na API:

```bash
./scripts/sync_to_backend.sh
```

Hii inanakili:
- `src/diagnostic_functions.py` → `../backend/app/ml/diagnostic_functions.py`
- `models/crop_recommendation_model.pkl` → `../backend/app/ml/crop_recommendation_model.pkl`
- `viwango_vya_mazao.json` → `../backend/app/ml/viwango_vya_mazao.json`

Kumbuka: `backend/app/ml/diagnostic_functions.py` ndiyo toleo jipya lenye mistari 283
na `MAJINA_MBADALA` (label aliasing). Nakala ya zamani ya mistari 163 iko `archive/`
kwa kumbukumbu tu — **isitumiwe kwa API**.

## Kujaribu

```bash
cd ../backend
source .venv/bin/activate
python -c "from app.ml.diagnostic_functions import tafsiri_jina_la_zao; print(tafsiri_jina_la_zao('mchicha'))"
```
