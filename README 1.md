# ML Component — Mwongozo wa Kuunganisha (Kwa Backend Teammate)

## Faili Ulizopokea
1. `crop_recommendation_model.pkl` — Model A (inapendekeza zao)
2. `viwango_vya_mazao.json` — Wigo wa N/P/K/temp/humidity/pH kwa kila zao
3. `diagnostic_functions.py` — Model B (kutambua na kurekebisha matatizo ya udongo/maji)

## Maktaba Zinazohitajika
(Model B / diagnostic_functions.py HAIHITAJI pandas - ni "standalone")

---

## MODEL A — Crop Recommendation

```python
import joblib
model = joblib.load('crop_recommendation_model.pkl')

# Input LAZIMA iwe kwa mpangilio huu: N, P, K, temperature, humidity, ph, rainfall
utabiri = model.predict([[90, 42, 43, 20.8, 82.0, 6.5, 202.9]])
zao_linalopendekezwa = utabiri[0]   # mfano: 'rice'
```

---

## MODEL B — Diagnostic & Correction Tool

```python
from diagnostic_functions import pakua_jedwali_la_viwango, toa_ripoti_kamili

# Fanya hii MARA MOJA tu wakati server inaanza (siyo kwa kila ombi)
jedwali_la_viwango = pakua_jedwali_la_viwango('viwango_vya_mazao.json')

# Kwa kila ombi la mtumiaji:
usomaji_wa_sensor = {
    'N': 40, 'P': 30, 'K': 20,
    'temperature': 30, 'humidity': 65, 'ph': 5.0
}

ripoti = toa_ripoti_kamili(
    zao='maize',                          # zao alilochagua mkulima
    usomaji_wa_sasa=usomaji_wa_sensor,    # kutoka sensor
    jedwali_la_viwango=jedwali_la_viwango,
    aina_ya_udongo='tifutifu',            # 'mchanga' / 'tifutifu' / 'mfinyanzi'
    ph_ya_maji=None                       # HIARI - namba kama mtumiaji ana kipimo cha maji
)
```

## Kutuma Kama JSON Response
`ripoti` ni dictionary ya kawaida ya Python (siyo pandas), tayari kwa `json.dumps()` moja kwa moja - hakuna tatizo la numpy.

---

## Muundo wa Majibu (Response) - Kesi Mbili

### Kama hakuna tatizo:
```json
{"zao": "maize", "hali_ya_jumla": "Nzuri", "ujumbe": "...", "marekebisho": []}
```

### Kama kuna matatizo (angalia mfano halisi tuliopata):
```json
{
  "zao": "maize",
  "hali_ya_jumla": "Kuna matatizo yanayohitaji hatua",
  "idadi_ya_matatizo": 5,
  "marekebisho": [
    {"kigezo": "Nitrogen", "hali": "upungufu", "kiasi": 94.4, "kipimo": "kg kwa hekta", ...},
    {"kigezo": "pH ya Udongo", "aina_ya_marekebisho": "chokaa", "kiasi": 4.38, ...}
  ]
}
```

## Maswali? Wasiliana na: [EVANCE D KOMBA]