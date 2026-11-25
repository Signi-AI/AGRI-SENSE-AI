import React, { useState } from 'react'
import {
  Activity,
  Droplets,
  FlaskConical,
  Leaf,
  Thermometer,
  CloudRain,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BrainCircuit,
  Layers,
} from 'lucide-react'
import { useLanguage } from '../i18n'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL

// Kila chaguo lina id ya kipekee — value (Swahili) ndiyo inayotumwa backend.
// Hii inazuia dropdown kurudi kwenye chaguo la kwanza (mfano Sandy Loam → Sandy).
const SOIL_TYPES = [
  { id: 'loamy',      value: 'tifutifu',  key: 'soiltype_loamy' },
  { id: 'sandy',      value: 'mchanga',   key: 'soiltype_sandy' },
  { id: 'sandy_loam', value: 'mchanga',   key: 'soiltype_sandy_loam' },
  { id: 'clay',       value: 'mfinyanzi', key: 'soiltype_clay' },
  { id: 'clay_loam',  value: 'mfinyanzi', key: 'soiltype_clay_loam' },
  { id: 'silty',      value: 'tifutifu',  key: 'soiltype_silty' },
]

const DEFAULT_SOIL_DATA = {
  nitrogen: 38,
  phosphorus: 52,
  potassium: 41,
  temperature: 24,
  humidity: 67,
  ph: 6.5,
  waterPh: 7.1,
  rainfall: 18,
}

const INPUT_CONFIG = [
  { key: 'ph', labelKey: 'soilPh', unit: 'pH', icon: FlaskConical, step: '0.1', min: 0, max: 14 },
  { key: 'nitrogen', labelKey: 'nitrogen', unit: 'kg', icon: Leaf, step: '1', min: 0, max: 1000 },
  { key: 'phosphorus', labelKey: 'phosphorus', unit: 'kg', icon: Sprout, step: '1', min: 0, max: 1000 },
  { key: 'potassium', labelKey: 'potassium', unit: 'kg', icon: Activity, step: '1', min: 0, max: 1000 },
  { key: 'humidity', labelKey: 'humidity', unit: '%', icon: Droplets, step: '1', min: 0, max: 100 },
  { key: 'temperature', labelKey: 'temperature', unit: '°C', icon: Thermometer, step: '0.1', min: -20, max: 80 },
  { key: 'rainfall', labelKey: 'rainfall', unit: 'mm', icon: CloudRain, step: '0.1', min: 0, max: 1000 },
  { key: 'waterPh', labelKey: 'waterPh', unit: 'pH', icon: Droplets, step: '0.1', min: 0, max: 14 },
]

const CROP_OPTIONS = [
  { value: 'bamia', label: 'Bamia' },
  { value: 'kitunguu_maji', label: 'Kitunguu maji' },
  { value: 'maharagwe', label: 'Maharagwe' },
  { value: 'karoti', label: 'Karoti' },
  { value: 'mihogo', label: 'Mihogo' },
  { value: 'pilipili_hoho', label: 'Pilipili hoho' },
  { value: 'pilipili_kali', label: 'Pilipili kali' },
  { value: 'kitunguu_swaumu', label: 'Kitunguu swaumu' },
  { value: 'tangawizi', label: 'Tangawizi' },
  { value: 'mboga_za_majani', label: 'Mboga za majani' },
  { value: 'magimbi', label: 'Magimbi' },
  { value: 'nyanya', label: 'Nyanya' },
  { value: 'pilipili_mbuzi', label: 'Pilipili mbuzi' },
  { value: 'pilipili_kichaa', label: 'Pilipili kichaa' },
  { value: 'pilipili_mwendokasi', label: 'Pilipili mwendokasi' },
  { value: 'pilipili_manga', label: 'Pilipili manga' },
  { value: 'mchicha', label: 'Mchicha' },
  { value: 'chainizi', label: 'Chainizi' },
  { value: 'sukuma_wiki', label: 'Sukuma wiki' },
  { value: 'kisamvu', label: 'Kisamvu' },
  { value: 'kabichi', label: 'Kabichi' },
  { value: 'tembele', label: 'Tembele' },
  { value: 'mnafu', label: 'Mnafu' },
  { value: 'nyanya_chungu', label: 'Nyanya chungu' },
  { value: 'biringanya', label: 'Biringanya' },
  { value: 'maboga', label: 'Maboga' },
  { value: 'limao', label: 'Limao' },
  { value: 'kunde', label: 'Kunde' },
  { value: 'rice', label: 'Rice' },
  { value: 'maize', label: 'Maize' },
  { value: 'chickpea', label: 'Chickpea' },
  { value: 'kidneybeans', label: 'Kidneybeans' },
  { value: 'pigeonpeas', label: 'Pigeonpeas' },
  { value: 'mothbeans', label: 'Mothbeans' },
  { value: 'mungbean', label: 'Mungbean' },
  { value: 'blackgram', label: 'Blackgram' },
  { value: 'lentil', label: 'Lentil' },
  { value: 'pomegranate', label: 'Pomegranate' },
  { value: 'banana', label: 'Banana' },
  { value: 'mango', label: 'Mango' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'muskmelon', label: 'Muskmelon' },
  { value: 'apple', label: 'Apple' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'jute', label: 'Jute' },
  { value: 'coffee', label: 'Coffee' },
]

function extractDiagnosis(data) {
  if (!data) return null
  return data.result || data.diagnosis || data.uchambuzi || data.data || data
}

function extractErrorMessage(json, fallback) {
  const detail = json?.detail
  if (typeof detail === 'string') return detail
  if (detail?.hitilafu) {
    const makosa = Array.isArray(detail.makosa) ? detail.makosa.join(' ') : ''
    return `${detail.hitilafu} ${makosa}`.trim()
  }
  return json?.message || json?.error || fallback
}

function getStatusMeta(item, t) {
  if (item.hali === 'upungufu' || item.hali === 'asidi_nyingi') {
    return { label: t('statusLow') || 'CHINI YA KIWANGO', tone: 'red' }
  }
  if (item.hali === 'uzidi' || item.hali === 'alkali_nyingi') {
    return { label: t('statusHigh') || 'JUU YA KIWANGO', tone: 'amber' }
  }
  if (item.aina_ya_marekebisho === 'chokaa (agricultural lime)') {
    return { label: t('statusLow') || 'CHINI YA KIWANGO', tone: 'red' }
  }
  if (item.aina_ya_marekebisho === 'sulfuri (elemental sulfur)') {
    return { label: t('statusHigh') || 'JUU YA KIWANGO', tone: 'amber' }
  }
  if (item.hatua_inahitajika === false) {
    return { label: t('statusOk') || 'SAWA', tone: 'green' }
  }
  return { label: t('statusOutOfRange') || 'NJE YA WIGO', tone: 'amber' }
}

const TONE_BADGE = {
  red: 'text-red-500 dark:text-red-300',
  amber: 'text-amber-500 dark:text-amber-300',
  green: 'text-[color:var(--neu-accent)]',
}

const TONE_BAR = {
  red: { fill: 'bg-red-400', width: '30%' },
  amber: { fill: 'bg-amber-400', width: '55%' },
  green: { fill: 'bg-[color:var(--neu-accent)]', width: '90%' },
}

function MarekebishoCard({ item, t }) {
  const { label, tone } = getStatusMeta(item, t)
  const bar = TONE_BAR[tone]
  const description = item.sababu || item.ujumbe || ''

  const hasAmount = item.kiasi !== undefined && item.kiasi !== null
  const hasNutrientOnly = !hasAmount && item.kiasi_nutrient_safi !== undefined

  return (
    <div className="neu-raised rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-extrabold text-[color:var(--neu-text)]">
          {item.kigezo}
        </h3>
        <span className={`neu-inset shrink-0 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${TONE_BADGE[tone]}`}>
          {label}
        </span>
      </div>

      {description && (
        <p className="mt-2 text-sm leading-6 text-[color:var(--neu-muted)]">
          {description}
        </p>
      )}

      <div className="neu-inset mt-4 h-2 rounded-full">
        <div className={`h-full rounded-full ${bar.fill}`} style={{ width: bar.width }} />
      </div>

      {hasAmount && (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <strong className={`text-lg ${TONE_BADGE[tone]}`}>{item.kiasi}</strong>
          <span className="text-xs text-[color:var(--neu-muted)]">{item.kipimo}</span>
          {(item.mbolea_inayopendekezwa || item.aina_ya_marekebisho) && (
            <span className="text-xs text-[color:var(--neu-muted)]">
              — {item.mbolea_inayopendekezwa || item.aina_ya_marekebisho}
            </span>
          )}
        </div>
      )}

      {hasNutrientOnly && (
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="text-lg text-[color:var(--neu-text)]">{item.kiasi_nutrient_safi}</strong>
          <span className="text-xs text-[color:var(--neu-muted)]">{item.kipimo_nutrient}</span>
        </div>
      )}
    </div>
  )
}

export function SoilHealth() {
  const { t } = useLanguage()
  const { authFetch } = useAuth()

  const [soilData, setSoilData] = useState(DEFAULT_SOIL_DATA)
  const [crop, setCrop] = useState('bamia')
  const [soilTypeId, setSoilTypeId] = useState('loamy') // id ya kipekee; value ya backend inatafutwa wakati wa kutuma
  const [diagnosis, setDiagnosis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateValue = (key, value) => {
    setSoilData(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const runDiagnosis = async () => {
    setError('')
    setDiagnosis(null)

    if (!API_URL) {
      setError(t('apiUrlMissing')) // CHANGED: proper translation key
      return
    }

    const values = Object.values(soilData)

    if (
      values.some(
        value => value === '' || value === null || value === undefined
      )
    ) {
      setError(t('completeAllFields')) // CHANGED: key now exists, no "||" fallback needed
      return
    }

    setLoading(true)

    try {
      const response = await authFetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zao: crop,

          usomaji_wa_sasa: {
            N: Number(soilData.nitrogen),
            P: Number(soilData.phosphorus),
            K: Number(soilData.potassium),
            temperature: Number(soilData.temperature),
            humidity: Number(soilData.humidity),
            ph: Number(soilData.ph),
          },

          // id ya kipekee → value ya Swahili inayokubaliwa na backend
          aina_ya_udongo:
            SOIL_TYPES.find(s => s.id === soilTypeId)?.value ?? 'tifutifu',
          ph_ya_maji: Number(soilData.waterPh),
        }),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(extractErrorMessage(json, t('diagnosisError') || 'Diagnosis failed.'))
      }

      const result = extractDiagnosis(json)

      if (!result) {
        throw new Error(t('diagnosisEmpty') || 'No diagnosis returned.')
      }

      if (result.hitilafu) {
        const makosa = Array.isArray(result.makosa) ? result.makosa.join(' ') : ''
        throw new Error(`${result.hitilafu} ${makosa}`.trim())
      }

      setDiagnosis(result)
    } catch (err) {
      setError(err?.message || t('diagnosisError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="neu-surface min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="neu-inset mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--neu-accent-dark)]">
              <BrainCircuit size={14} />
              {t('soilIntelligence')}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[color:var(--neu-text)] sm:text-3xl">
              {t('soilHealth')}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--neu-muted)]">
              {t('soilHealthDesc')} {/* CHANGED: was t('SOIL HEALTHY Desc') || '...' (fallback never worked) */}
            </p>
          </div>

          {/* CROP SELECTOR */}
          <div className="neu-raised-sm flex w-full items-center gap-3 rounded-2xl px-4 py-3 sm:w-auto">

            <div className="neu-inset flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[color:var(--neu-accent)]">
              <Leaf size={18} />
            </div>

            <div className="min-w-0 flex-1 sm:flex-none">
              <label
                htmlFor="crop-select"
                className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-muted)]"
              >
                {t('cropType')} {/* CHANGED: was t('crop') = "Crop Recommendation" */}
              </label>

              <select
                id="crop-select"
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full min-w-[180px] bg-transparent text-sm font-bold text-[color:var(--neu-text)] outline-none"
              >
                {CROP_OPTIONS.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* EDITABLE SOIL CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INPUT_CONFIG.map(field => {
            const Icon = field.icon

            return (
              <div
                key={field.key}
                className="neu-raised rounded-2xl p-4"
              >
                <div className="flex items-center gap-2">

                  <span className="neu-raised-sm grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[color:var(--neu-accent)]">
                    <Icon size={16} />
                  </span>

                  <label
                    htmlFor={`soil-${field.key}`}
                    className="text-xs font-bold text-[color:var(--neu-text)]"
                  >
                    {t(field.labelKey)}
                  </label>
                </div>

                <div className="mt-3 flex items-center gap-2">

                  <input
                    id={`soil-${field.key}`}
                    type="number"
                    inputMode="decimal"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={soilData[field.key]}
                    onChange={e =>
                      updateValue(field.key, e.target.value)
                    }
                    className="neu-inset neu-pressable h-10 w-full min-w-0 rounded-xl border-0 px-3 text-sm font-bold text-[color:var(--neu-text)] outline-none"
                  />

                  <span className="shrink-0 text-xs font-bold text-[color:var(--neu-accent-dark)]">
                    {field.unit}
                  </span>
                </div>
              </div>
            )
          })}

          {/* SOIL TYPE CARD - NEUMORPHISM KAMILI + kila chaguo lina id ya kipekee */}
          <div className="neu-raised rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="neu-raised-sm grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[color:var(--neu-accent)]">
                <Layers size={16} />
              </span>

              <label
                htmlFor="soil-type"
                className="text-xs font-bold text-[color:var(--neu-text)]"
              >
                {t('soilType') || 'Soil Type'}
              </label>
            </div>

            <div className="mt-3">
              <select
                id="soil-type"
                value={soilTypeId}
                onChange={(e) => setSoilTypeId(e.target.value)}
                className="neu-inset neu-pressable h-10 w-full rounded-xl border-0 px-3 text-sm font-bold text-[color:var(--neu-text)] outline-none bg-transparent"
              >
                {SOIL_TYPES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    {t(s.key)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DIAGNOSIS BUTTON */}
        <div className="mb-7 flex justify-center">
          <button
            type="button"
            onClick={runDiagnosis}
            disabled={loading}
            className="neu-raised-sm neu-pressable inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-[color:var(--neu-accent)] px-7 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t('diagnosing')}
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                {t('runDiagnosis')}
              </>
            )}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="neu-inset mb-6 flex gap-3 rounded-2xl p-4 text-red-600 dark:text-red-300"
          >
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                {t('diagnosisFailed')}
              </p>

              <p className="mt-1 text-sm leading-6">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* AI DIAGNOSIS */}
        {diagnosis && (
          <div className="neu-raised overflow-hidden rounded-3xl">

            <div className="neu-inset flex items-center gap-3 px-5 py-5 sm:px-6">

              <div className="neu-raised-sm flex h-11 w-11 items-center justify-center rounded-2xl text-[color:var(--neu-accent)]">
                <BrainCircuit size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[color:var(--neu-text)]">
                  {t('diagnosisResult')}
                </h2>

                <p className="mt-1 text-xs text-[color:var(--neu-muted)]">
                  {diagnosis.hali_ya_jumla === 'Nzuri'
                    ? (t('diagnosisGood') || 'Your soil is in good condition for this crop.')
                    : (t('diagnosisCompleted') || 'Your soil measurements have been analyzed.')}
                </p>
              </div>

              <CheckCircle2
                className="ml-auto text-[color:var(--neu-accent)]"
                size={22}
              />
            </div>

            <div className="p-5 sm:p-6">
              {Array.isArray(diagnosis.marekebisho) && diagnosis.marekebisho.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {diagnosis.marekebisho.map((item, i) => (
                    <MarekebishoCard key={`${item.kigezo}-${i}`} item={item} t={t} />
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-[color:var(--neu-muted)]">
                  {t('diagnosisGood') || 'Your soil is in good condition for this crop. No corrections needed.'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SoilHealth