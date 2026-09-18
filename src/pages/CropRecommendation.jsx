import React, { useState } from 'react'
import { ArrowRight, BrainCircuit, LoaderCircle, CloudRain } from 'lucide-react'
import { useLanguage } from '../i18n'

export function CropRecommendation() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const { t } = useLanguage()

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setDone(false)

    setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 900)
  }

  const fields = [
    ['soilPh', 'Soil pH', '6.5'],
    ['nitrogen', 'Nitrogen (N)', '38'],
    ['phosphorus', 'Phosphorus (P)', '52'],
    ['potassium', 'Potassium (K)', '41'],
    ['humidity', 'Humidity (%)', '67'],
    ['temperature', 'Temperature (°C)', '24'],
    ['rainfall', 'Rainfall (mm)', '18'],
  ]

  return (
    <main className="mx-auto max-w-5xl px-4 py-7 sm:px-8">
      <p className="section-kicker">{t('aiEngine')}</p>

      <h1 className="text-3xl font-extrabold sm:text-4xl">
        {t('crop')}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        {t('cropDesc')}
      </p>

      <form
        onSubmit={submit}
        className="card mt-8 p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {fields.map(([key, label, value]) => (
            <div key={key}>
              <label className="label">
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
                  name={key}
                  defaultValue={value}
                  type="number"
                  step="any"
                  min="0"
                  className={`input ${
                    key === 'rainfall' ? 'pl-10' : ''
                  }`}
                  placeholder={label}
                />
              </div>
            </div>
          ))}

        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full sm:w-auto"
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

      {done && (
        <section className="mt-6 rounded-3xl bg-mint p-6 dark:bg-green-950/30">
          <div className="flex gap-4">

            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-leaf">
              <BrainCircuit />
            </span>

            <div>
              <p className="section-kicker">
                {t('demoResult')}
              </p>

              <h2 className="text-2xl font-extrabold">
                🌽 Maize — 92% {t('suitability')}
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {t('modelNote')}
              </p>
            </div>

          </div>
        </section>
      )}
    </main>
  )
}

