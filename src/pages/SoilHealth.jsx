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
  const [soilType, setSoilType] = useState('Loamy')
  const [diagnosis, setDiagnosis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateValue = (key, value) => {
    setSoilData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const runDiagnosis = async () => {
    setError('')
    setDiagnosis(null)

    if (!API_URL) {
      setError(
        t('Api URL  is Missing') ||
          'API URL is not configured. Please set VITE_API_URL.'
      )
      return
    }

    const values = Object.values(soilData)

    if (
      values.some(
        (value) =>
          value === '' ||
          value === null ||
          value === undefined
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

  const renderDiagnosisValue = (value) => {
    if (value === null || value === undefined) {
      return null
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number'
    ) {
      return (
        <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
          {String(value)}
        </p>
      )
    }

    return (
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  return (
    <section className="min-h-screen bg-[#f5f8f5] px-4 py-6 dark:bg-[#08120c] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <BrainCircuit size={14} />

              {t('SOIL INTELLIGENCE') || 'SOIL INTELLIGENCE'}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {t('soilHealth') || 'Soil Health'}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t(' SOIL HEALTHY Desc') ||
                'Enter your soil and environmental measurements for intelligent field analysis.'}
            </p>
          </div>

          {/* SOIL TYPE */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Leaf size={18} />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('soilType') || 'Soil Type'}
              </label>

              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 outline-none dark:text-white"
              >
                <option value="Loamy">Loamy</option>
                <option value="Sandy">Sandy</option>
                <option value="Sandy loam">Sandy loam</option>
                <option value="Clay">Clay</option>
                <option value="Clay loam">Clay loam</option>
                <option value="Silty">Silty</option>
              </select>
            </div>
          </div>
        </div>

        {/* EDITABLE SOIL CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INPUT_CONFIG.map((field) => {
            const Icon = field.icon

            return (
              <div
                key={field.key}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-emerald-800/20
                  bg-[#0d4b2b]
                  p-5
                  shadow-md
                  shadow-emerald-950/10
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:bg-[#0a3d23]
                  hover:shadow-xl
                  dark:bg-[#0b3d24]
                "
              >
                {/* SOFT BACKGROUND EFFECT */}
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl" />

                <div className="relative">

                  {/* CARD HEADER */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100">
                      <Icon size={19} />
                    </div>

                    <label
                      htmlFor={`soil-${field.key}`}
                      className="text-sm font-bold text-white"
                    >
                      {field.label}
                    </label>
                  </div>

                  {/* EDITABLE VALUE */}
                  <div className="mt-5 flex items-end gap-3">
                    <input
                      id={`soil-${field.key}`}
                      type="number"
                      inputMode="decimal"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={soilData[field.key]}
                      onChange={(e) =>
                        updateValue(
                          field.key,
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        min-w-0
                        border-b-2
                        border-white/20
                        bg-transparent
                        pb-2
                        text-3xl
                        font-bold
                        tracking-tight
                        text-white
                        outline-none
                        transition
                        focus:border-emerald-300
                      "
                    />

                    <span className="mb-2 shrink-0 text-xs font-bold text-emerald-200">
                      {field.unit}
                    </span>
                  </div>

                  <div className="mt-3 h-px bg-white/10" />
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
            className="
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2.5
              rounded-2xl
              bg-[#0d4b2b]
              px-7
              py-3.5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-emerald-950/20
              transition
              hover:bg-[#0a3d23]
              focus:outline-none
              focus:ring-4
              focus:ring-emerald-600/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                {t('diagnosing') || 'Analyzing Soil...'}
              </>
            ) : (
              <>
                <BrainCircuit size={18} />

                {t('runDiagnosis') ||
                  'Run Soil Diagnosis'}
              </>
            )}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                {t('diagnosisFailed') ||
                  'Diagnosis failed'}
              </p>

              <p className="mt-1 text-sm leading-6">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* AI DIAGNOSIS */}
        {diagnosis && (
          <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/40 dark:bg-white/[0.04]">

            {/* RESULT HEADER */}
            <div className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-5 dark:border-emerald-900/30 dark:bg-emerald-950/20 sm:px-6">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d4b2b] text-white shadow-sm">
                  <BrainCircuit size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    {t('diagnosisResult') ||
                      'AI Soil Assessment'}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t('diagnosisCompleted') ||
                      'Your soil measurements have been analyzed.'}
                  </p>
                </div>

                <CheckCircle2
                  className="ml-auto text-emerald-600 dark:text-emerald-400"
                  size={22}
                />
              </div>
            </div>

            {/* RESULT CONTENT */}
            <div className="p-5 sm:p-6">
              {typeof diagnosis === 'object' &&
              !Array.isArray(diagnosis) ? (
                <div className="space-y-4">
                  {Object.entries(diagnosis).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="
                          rounded-2xl
                          border
                          border-slate-100
                          bg-slate-50/70
                          p-4
                          dark:border-white/10
                          dark:bg-white/[0.025]
                        "
                      >
                        <p className="mb-2 text-sm font-bold capitalize text-slate-800 dark:text-slate-100">
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