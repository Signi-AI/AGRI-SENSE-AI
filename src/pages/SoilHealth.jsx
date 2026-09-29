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
} from 'lucide-react'
import { useLanguage } from '../i18n'

const API_URL = import.meta.env.VITE_API_URL

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
  {
    key: 'ph',
    label: 'Soil pH',
    unit: 'pH',
    icon: FlaskConical,
    step: '0.1',
    min: 0,
    max: 14,
  },
  {
    key: 'nitrogen',
    label: 'Nitrogen',
    unit: 'kg',
    icon: Leaf,
    step: '1',
    min: 0,
    max: 1000,
  },
  {
    key: 'phosphorus',
    label: 'Phosphorus',
    unit: 'kg',
    icon: Sprout,
    step: '1',
    min: 0,
    max: 1000,
  },
  {
    key: 'potassium',
    label: 'Potassium',
    unit: 'kg',
    icon: Activity,
    step: '1',
    min: 0,
    max: 1000,
  },
  {
    key: 'humidity',
    label: 'Humidity',
    unit: '%',
    icon: Droplets,
    step: '1',
    min: 0,
    max: 100,
  },
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    step: '0.1',
    min: -20,
    max: 80,
  },
  {
    key: 'rainfall',
    label: 'Rainfall',
    unit: 'mm',
    icon: CloudRain,
    step: '0.1',
    min: 0,
    max: 1000,
  },
  {
    key: 'waterPh',
    label: 'Water pH',
    unit: 'pH',
    icon: Droplets,
    step: '0.1',
    min: 0,
    max: 14,
  },
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

  // English / ML crop options
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

  return (
    data.result ||
    data.diagnosis ||
    data.uchambuzi ||
    data.data ||
    data
  )
}

export function SoilHealth() {
  const { t } = useLanguage()

  const [soilData, setSoilData] = useState(DEFAULT_SOIL_DATA)
  const [soilType, setSoilType] = useState('bamia')
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
      setError(
        t('Api URL is Missing') ||
          'API URL is not configured. Please set VITE_API_URL.'
      )
      return
    }

    const values = Object.values(soilData)

    if (
      values.some(
        value => value === '' || value === null || value === undefined
      )
    ) {
      setError(
        t('completeAllFields') ||
          'Please complete all soil and environmental measurements.'
      )
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zao: soilType,

          usomaji_wa_sasa: {
            N: Number(soilData.nitrogen),
            P: Number(soilData.phosphorus),
            K: Number(soilData.potassium),
            temp: Number(soilData.temperature),
            humidity: Number(soilData.humidity),
            ph: Number(soilData.ph),
          },

          aina_ya_udongo: soilType,

          ph_ya_maji: Number(soilData.waterPh),

          rainfall: Number(soilData.rainfall),
        }),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(
          json?.message ||
            json?.error ||
            t('diagnosisFailed') ||
            'Unable to complete soil diagnosis.'
        )
      }

      const result = extractDiagnosis(json)

      if (!result) {
        throw new Error(
          t('diagnosisFailed') ||
            'The diagnosis service returned an empty response.'
        )
      }

      setDiagnosis(result)
    } catch (err) {
      setError(
        err?.message ||
          t('diagnosisFailed') ||
          'Unable to complete soil diagnosis.'
      )
    } finally {
      setLoading(false)
    }
  }

  const renderDiagnosisValue = value => {
    if (value === null || value === undefined) {
      return null
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <p className="whitespace-pre-line text-sm leading-7 text-[color:var(--neu-muted)]">
          {String(value)}
        </p>
      )
    }

    return (
      <pre className="neu-inset overflow-x-auto whitespace-pre-wrap rounded-2xl p-4 text-sm leading-6 text-[color:var(--neu-muted)]">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  return (
    <section className="neu-surface min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="neu-inset mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--neu-accent-dark)]">
              <BrainCircuit size={14} />

              {t('SOIL INTELLIGENCE') || 'SOIL INTELLIGENCE'}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[color:var(--neu-text)] sm:text-3xl">
              {t('soilHealth') || 'Soil Health'}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--neu-muted)]">
              {t('SOIL HEALTHY Desc') ||
                'Enter your soil and environmental measurements for intelligent field analysis.'}
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
                {t('crop') || 'Crop'}
              </label>

              {/* 
                IMPORTANT:
                All crop options are rendered here.
                The select is allowed to use the available width
                so options such as Rice, Maize and Coffee remain accessible.
              */}
              <select
                id="crop-select"
                value={soilType}
                onChange={e => setSoilType(e.target.value)}
                className="w-full min-w-[180px] bg-transparent text-sm font-bold text-[color:var(--neu-text)] outline-none"
              >
                {CROP_OPTIONS.map(crop => (
                  <option
                    key={crop.value}
                    value={crop.value}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {crop.label}
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
                    {field.label}
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
                {t('diagnosing') || 'Analyzing Soil...'}
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                {t('runDiagnosis') || 'Run Soil Diagnosis'}
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
                {t('diagnosisFailed') || 'Diagnosis failed'}
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
                  {t('diagnosisResult') || 'AI Soil Assessment'}
                </h2>

                <p className="mt-1 text-xs text-[color:var(--neu-muted)]">
                  {t('diagnosisCompleted') ||
                    'Your soil measurements have been analyzed.'}
                </p>
              </div>

              <CheckCircle2
                className="ml-auto text-[color:var(--neu-accent)]"
                size={22}
              />
            </div>

            <div className="p-5 sm:p-6">

              {typeof diagnosis === 'object' &&
              !Array.isArray(diagnosis) ? (
                <div className="space-y-4">

                  {Object.entries(diagnosis).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="neu-inset rounded-2xl p-4"
                      >
                        <p className="mb-2 text-sm font-bold capitalize text-[color:var(--neu-text)]">
                          {key.replaceAll('_', ' ')}
                        </p>

                        {renderDiagnosisValue(value)}
                      </div>
                    )
                  )}
                </div>
              ) : (
                renderDiagnosisValue(diagnosis)
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SoilHealth
