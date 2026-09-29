import React, { useState } from 'react'
import {
  ArrowRight,
  BrainCircuit,
  LoaderCircle,
  CloudRain,
} from 'lucide-react'
import { useLanguage } from '../i18n'
import './Auth.jsx'

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
    <main className="neu-surface mx-auto max-w-5xl px-4 py-7 sm:px-8">
      {/* HEADER */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
          {t('aiCropIntelligence')}
        </p>

        <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
          {t('crop')}
        </h1>

        <p className="mt-2 text-sm text-[color:var(--neu-muted)]">
          {t('cropDesc')}
        </p>
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={submit}
        className="neu-raised mt-8 rounded-3xl p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(([key, label, value]) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]"
              >
                {t(key) || label}
              </label>

              <div className="relative">
                {key === 'rainfall' && (
                  <CloudRain
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
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
                  className={`neu-inset neu-pressable h-12 w-full rounded-2xl border-0 px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none ${
                    key === 'rainfall' ? 'pl-10' : ''
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
          className="neu-raised-sm neu-pressable mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
        <div role="alert" className="neu-inset mt-4 rounded-2xl px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <section className="neu-raised mt-6 rounded-3xl p-6">
          <div className="flex gap-4">
            {/* ICON */}
            <span className="neu-raised-sm grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[color:var(--neu-accent)]">
              <BrainCircuit size={23} />
            </span>

            <div className="min-w-0 flex-1">
              {/* RESULT LABEL */}
              <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
                {t('recommendationResult')}
              </p>

              {/* TOP CROP */}
              <h2 className="text-2xl font-extrabold capitalize text-[color:var(--neu-text)]">
                {result.zao} —{' '}
                {Math.round(
                  result.top3[0].uwezekano * 100
                )}
                % {t('suitability')}
              </h2>

              {/* INSIGHT */}
              <p className="mt-2 text-sm leading-7 text-[color:var(--neu-muted)]">
                {t('recommendationInsight')}
              </p>

              {/* TOP 3 */}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {result.top3.map((item, i) => (
                  <div
                    key={`${item.zao}-${i}`}
                    className="neu-inset rounded-2xl p-3 text-center"
                  >
                    <p className="text-xs text-[color:var(--neu-muted)]">
                      #{i + 1}
                    </p>

                    <p className="font-bold capitalize text-[color:var(--neu-text)]">
                      {item.zao}
                    </p>

                    <p className="text-sm font-bold text-[color:var(--neu-accent-dark)]">
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