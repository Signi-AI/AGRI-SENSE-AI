import React, { useState } from 'react'
import {
  ArrowRight,
  BrainCircuit,
  LoaderCircle,
  CloudRain,
} from 'lucide-react'
import { useLanguage } from '../i18n'

const API_URL = import.meta.env.VITE_API_URL

export function CropRecommendation() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const { t } = useLanguage()

  const fields = [
    ['ph', 'Soil pH', '6.5'],
    ['N', 'Nitrogen (N)', '38'],
    ['P', 'Phosphorus (P)', '52'],
    ['K', 'Potassium (K)', '41'],
    ['humidity', 'Humidity (%)', '67'],
    ['temperature', 'Temperature (°C)', '24'],
    ['rainfall', 'Rainfall (mm)', '18'],
  ]

  const submit = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setResult(null)
    setError(null)

    const formData = new FormData(e.target)
    const payload = {}

    fields.forEach(([key]) => {
      payload[key] = parseFloat(formData.get(key))
    })

    try {
      const res = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      let json = {}

      try {
        json = await res.json()
      } catch {
        json = {}
      }

      if (!res.ok) {
        const serverMessage =
          json?.detail?.[0]?.msg ||
          json?.detail ||
          json?.message ||
          'Server error'

        throw new Error(serverMessage)
      }

      if (
        !json?.top3 ||
        !Array.isArray(json.top3) ||
        !json.top3.length
      ) {
        throw new Error('Invalid recommendation response')
      }

      setResult(json)
    } catch (err) {
      console.error('Crop recommendation error:', err)

      setError(
        'Imeshindikana kupata pendekezo la zao. Angalia taarifa ulizoingiza kisha jaribu tena.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-7 sm:px-8">
      {/* HEADER */}
      <div>
        <p className="section-kicker">
          {t('aiCropIntelligence')}
        </p>

        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {t('crop')}
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('cropDesc')}
        </p>
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={submit}
        className="card mt-8 p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(([key, label, value]) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="label"
              >
                {t(key) || label}
              </label>

              <div className="relative">
                {key === 'rainfall' && (
                  <CloudRain
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                )}

                <input
                  id={key}
                  name={key}
                  defaultValue={value}
                  type="number"
                  step="any"
                  min="0"
                  required
                  className={`input ${
                    key === 'rainfall'
                      ? 'pl-10'
                      : ''
                  }`}
                  placeholder={label}
                />
              </div>
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4b2b] px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-950/20 transition hover:bg-[#0a3d23] focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />

              {t('analyzing')}
            </>
          ) : (
            <>
              {t('analyze')}
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      {/* ERROR */}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <section className="mt-6 rounded-3xl bg-mint p-6 dark:bg-green-950/30">
          <div className="flex gap-4">
            {/* ICON */}
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-leaf dark:bg-slate-800">
              <BrainCircuit size={23} />
            </span>

            <div className="min-w-0 flex-1">
              {/* RESULT LABEL */}
              <p className="section-kicker">
                {t('recommendationResult')}
              </p>

              {/* TOP CROP */}
              <h2 className="text-2xl font-extrabold capitalize">
                {result.zao} —{' '}
                {Math.round(
                  result.top3[0].uwezekano * 100
                )}
                % {t('suitability')}
              </h2>

              {/* INSIGHT */}
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {t('recommendationInsight')}
              </p>

              {/* TOP 3 */}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {result.top3.map((item, i) => (
                  <div
                    key={`${item.zao}-${i}`}
                    className="rounded-2xl bg-white p-3 text-center dark:bg-slate-800"
                  >
                    <p className="text-xs text-slate-500">
                      #{i + 1}
                    </p>

                    <p className="font-bold capitalize">
                      {item.zao}
                    </p>

                    <p className="text-sm font-bold text-leaf">
                      {Math.round(
                        item.uwezekano * 100
                      )}
                      %
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default CropRecommendation