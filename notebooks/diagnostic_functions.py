"""
Diagnostic Functions - Model B
Kazi hizi zinatumika kutathmini hali ya udongo na maji ya umwagiliaji
kwa zao maalum lililopandwa, na kutoa ushauri wa marekebisho.

Jinsi ya kutumia (kwa backend):
    from diagnostic_functions import toa_ripoti_kamili, pakua_jedwali_la_viwango
    jedwali = pakua_jedwali_la_viwango('viwango_vya_mazao.json')
    ripoti = toa_ripoti_kamili(zao, usomaji_wa_sasa, jedwali, aina_ya_udongo, ph_ya_maji)
"""

import json


def pakua_jedwali_la_viwango(path_ya_json='viwango_vya_mazao.json'):
    """Inapakua JSON na kuirudisha kama dictionary rahisi."""
    with open(path_ya_json) as faili:
        return json.load(faili)


def angalia_hali_ya_udongo(zao, usomaji_wa_sasa, jedwali_la_viwango):
    matatizo = []
    if zao not in jedwali_la_viwango:
        return [f"Samahani, zao '{zao}' halipo kwenye database yetu."]

    for kigezo in ['N', 'P', 'K', 'temperature', 'humidity', 'ph']:
        thamani_ya_sasa = usomaji_wa_sasa[kigezo]
        kiwango_cha_chini = jedwali_la_viwango[zao][kigezo]['min']
        kiwango_cha_juu = jedwali_la_viwango[zao][kigezo]['max']

        if thamani_ya_sasa < kiwango_cha_chini:
            matatizo.append({
                'kigezo': kigezo, 'hali': 'chini_ya_kiwango',
                'thamani_ya_sasa': thamani_ya_sasa,
                'kiwango_kinachohitajika': kiwango_cha_chini,
                'tofauti': round(kiwango_cha_chini - thamani_ya_sasa, 2)
            })
        elif thamani_ya_sasa > kiwango_cha_juu:
            matatizo.append({
                'kigezo': kigezo, 'hali': 'juu_ya_kiwango',
                'thamani_ya_sasa': thamani_ya_sasa,
                'kiwango_kinachohitajika': kiwango_cha_juu,
                'tofauti': round(thamani_ya_sasa - kiwango_cha_juu, 2)
            })
    return matatizo


def hesabu_marekebisho_ya_ph(ph_ya_sasa, ph_lengwa, aina_ya_udongo='tifutifu'):
    buffer_factor = {'mchanga': 1.75, 'tifutifu': 3.5, 'mfinyanzi': 6.5}
    sulfur_factor = {'mchanga': 280, 'tifutifu': 420, 'mfinyanzi': 560}
    tofauti_ya_ph = round(ph_lengwa - ph_ya_sasa, 2)

    if abs(tofauti_ya_ph) < 0.1:
        return {'hatua_inahitajika': False, 'ujumbe': 'pH iko karibu kabisa na kiwango kinachohitajika.'}
    if tofauti_ya_ph > 0:
        kiasi = round(tofauti_ya_ph * buffer_factor[aina_ya_udongo], 2)
        return {'hatua_inahitajika': True, 'aina_ya_marekebisho': 'chokaa (agricultural lime)',
                'kiasi': kiasi, 'kipimo': 'tani kwa hekta',
                'sababu': 'Udongo una asidi nyingi kuliko inavyohitajika kwa zao hili.'}
    else:
        kiasi = round(abs(tofauti_ya_ph) * sulfur_factor[aina_ya_udongo], 2)
        return {'hatua_inahitajika': True, 'aina_ya_marekebisho': 'sulfuri (elemental sulfur)',
                'kiasi': kiasi, 'kipimo': 'kg kwa hekta',
                'sababu': 'Udongo una alkali nyingi kuliko inavyohitajika kwa zao hili.'}


def hesabu_marekebisho_ya_npk(kigezo, thamani_ya_sasa, thamani_lengwa):
    factor = {'N': 2.5, 'P': 2.5, 'K': 2.0}
    majina_kamili = {'N': 'Nitrogen', 'P': 'Phosphorus', 'K': 'Potassium'}
    tofauti = round(thamani_lengwa - thamani_ya_sasa, 2)

    if abs(tofauti) < 2:
        return {'hatua_inahitajika': False,
                'ujumbe': f'{majina_kamili[kigezo]} iko karibu na kiwango kinachohitajika.'}
    if tofauti > 0:
        kiasi = round(tofauti * factor[kigezo], 2)
        return {'hatua_inahitajika': True, 'kigezo': majina_kamili[kigezo], 'hali': 'upungufu',
                'kiasi': kiasi, 'kipimo': 'kg kwa hekta (nutrient safi)',
                'sababu': f'{majina_kamili[kigezo]} imepungua kuliko inavyohitajika kwa zao hili.'}
    else:
        kiasi = round(tofauti * factor[kigezo], 2)
        return {'hatua_inahitajika': True, 'kigezo': majina_kamili[kigezo], 'hali': 'uzidi',
                'kiasi': abs(kiasi), 'kipimo': 'kg kwa hekta (punguza kwa kiasi hiki)',
                'sababu': f'{majina_kamili[kigezo]} imezidi kuliko inavyohitajika kwa zao hili.'}


def angalia_ph_ya_maji(ph_ya_maji, wigo_wa_chini=6.0, wigo_wa_juu=7.5, ujazo_wa_lita=100):
    FACTOR_ML_KWA_UNIT = 20
    if ph_ya_maji < wigo_wa_chini:
        tofauti = round(wigo_wa_chini - ph_ya_maji, 2)
        kiasi_ml = round(tofauti * FACTOR_ML_KWA_UNIT * (ujazo_wa_lita / 100), 2)
        return {'kigezo': 'pH ya Maji', 'hatua_inahitajika': True, 'hali': 'asidi_nyingi',
                'thamani_ya_sasa': ph_ya_maji, 'wigo_unaofaa': f'{wigo_wa_chini}-{wigo_wa_juu}',
                'aina_ya_marekebisho': 'Potassium Bicarbonate (au Sodium Bicarbonate)',
                'kiasi': kiasi_ml, 'kipimo': f'ml kwa kila lita {ujazo_wa_lita} za maji',
                'ujumbe': 'Maji yana asidi nyingi. Hii inaweza kufanya Calcium na Magnesium visipatikane vizuri.'}
    elif ph_ya_maji > wigo_wa_juu:
        tofauti = round(ph_ya_maji - wigo_wa_juu, 2)
        kiasi_ml = round(tofauti * FACTOR_ML_KWA_UNIT * (ujazo_wa_lita / 100), 2)
        return {'kigezo': 'pH ya Maji', 'hatua_inahitajika': True, 'hali': 'alkali_nyingi',
                'thamani_ya_sasa': ph_ya_maji, 'wigo_unaofaa': f'{wigo_wa_chini}-{wigo_wa_juu}',
                'aina_ya_marekebisho': 'Phosphoric Acid (au Citric Acid - salama zaidi)',
                'kiasi': kiasi_ml, 'kipimo': f'ml kwa kila lita {ujazo_wa_lita} za maji',
                'ujumbe': 'Maji yana alkali nyingi. Hii inaweza kufanya Iron, Manganese, Zinc visipatikane vizuri.'}
    else:
        return {'kigezo': 'pH ya Maji', 'hatua_inahitajika': False,
                'ujumbe': 'pH ya maji ya umwagiliaji iko ndani ya wigo unaofaa.'}


def toa_ripoti_kamili(zao, usomaji_wa_sasa, jedwali_la_viwango, aina_ya_udongo='tifutifu', ph_ya_maji=None):
    if zao not in jedwali_la_viwango:
        return {'hitilafu': f"Zao '{zao}' halipo kwenye database yetu."}

    matatizo = angalia_hali_ya_udongo(zao, usomaji_wa_sasa, jedwali_la_viwango)
    marekebisho_yote = []

    for tatizo in matatizo:
        kigezo = tatizo['kigezo']
        if kigezo == 'ph':
            ph_lengwa = jedwali_la_viwango[zao]['ph']['mean']
            marekebisho = hesabu_marekebisho_ya_ph(usomaji_wa_sasa['ph'], ph_lengwa, aina_ya_udongo)
            marekebisho['kigezo'] = 'pH ya Udongo'
            marekebisho_yote.append(marekebisho)
        elif kigezo in ['N', 'P', 'K']:
            thamani_lengwa = jedwali_la_viwango[zao][kigezo]['mean']
            marekebisho = hesabu_marekebisho_ya_npk(kigezo, usomaji_wa_sasa[kigezo], thamani_lengwa)
            marekebisho_yote.append(marekebisho)
        else:
            marekebisho_yote.append({
                'kigezo': kigezo, 'hatua_inahitajika': None,
                'ujumbe': f'{kigezo} iko nje ya wigo unaofaa, lakini haiwezi kurekebishwa moja kwa moja shambani.'
            })

    if ph_ya_maji is not None:
        tathmini_ya_maji = angalia_ph_ya_maji(ph_ya_maji)
        if tathmini_ya_maji['hatua_inahitajika']:
            marekebisho_yote.append(tathmini_ya_maji)

    if len(marekebisho_yote) == 0:
        return {
            'zao': zao, 'hali_ya_jumla': 'Nzuri',
            'ujumbe': f'Hali ya udongo (na maji, kama yalitolewa) inafaa kwa {zao}. Hakuna marekebisho yanayohitajika.',
            'marekebisho': []
        }

    return {
        'zao': zao, 'hali_ya_jumla': 'Kuna matatizo yanayohitaji hatua',
        'idadi_ya_matatizo': len(marekebisho_yote),
        'marekebisho': marekebisho_yote
    }


def pakua_jedwali_la_viwango(path_ya_json='viwango_vya_mazao.json'):
    """
    Inapakua faili la JSON na kuligeuza kuwa muundo rahisi wa dictionary
    (SIYO pandas DataFrame - hii inaepuka utata wa multi-level columns).

    Inarudisha: dictionary yenye muundo:
        {zao: {kigezo: {'min': ..., 'max': ..., 'mean': ...}}}
    """
    import json
    with open(path_ya_json) as faili:
        return json.load(faili)
