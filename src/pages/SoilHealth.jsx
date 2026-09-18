import React, { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Droplets,
  FlaskConical,
  Thermometer,
  BrainCircuit,
  CloudRain,
} from 'lucide-react'
import { useLanguage } from '../i18n'

export function SoilHealth() {
  const { t } = useLanguage()

  const defaultData = {
    soilPh: 6.5,
    waterPh: 7.1,
    nitrogen: 38,
    phosphorus: 52,
    potassium: 41,
    humidity: 67,
    temperature: 24,
    rainfall: 18,
  }

  const [soilData, setSoilData] = useState(defaultData)
  const [diagnosis, setDiagnosis] = useState(null)

  const metrics = [
    {
      key: 'soilPh',
      label: 'Soil pH',
      unit: 'pH',
      icon: FlaskConical,
      step: '0.1',
    },
    {
      key: 'waterPh',
      label: 'Water pH',
      unit: 'pH',
      icon: Droplets,
      step: '0.1',
    },
    {
      key: 'nitrogen',
      label: 'Nitrogen',
      unit: 'kg',
      icon: FlaskConical,
      step: '1',
    },
    {
      key: 'phosphorus',
      label: 'Phosphorus',
      unit: 'kg',
      icon: FlaskConical,
      step: '1',
    },
    {
      key: 'potassium',
      label: 'Potassium',
      unit: 'kg',
      icon: FlaskConical,
      step: '1',
    },
    {
      key: 'humidity',
      label: 'Humidity',
      unit: '%',
      icon: Droplets,
      step: '1',
    },
    {
      key: 'temperature',
      label: 'Temperature',
      unit: '°C',
      icon: Thermometer,
      step: '0.1',
    },
    {
      key: 'rainfall',
      label: 'Rainfall',
      unit: 'mm',
      icon: CloudRain,
      step: '0.1',
    },
  ]

  const handleChange = (key, value) => {
    setSoilData((previous) => ({
      ...previous,
      [key]: value === '' ? '' : Number(value),
    }))

    setDiagnosis(null)
  }

  const diagnoseSoil = () => {
    const {
      soilPh,
      waterPh,
      nitrogen,
      phosphorus,
      potassium,
      humidity,
      temperature,
      rainfall,
    } = soilData

    const values = [
      soilPh,
      waterPh,
      nitrogen,
      phosphorus,
      potassium,
      humidity,
      temperature,
      rainfall,
    ]

    const hasEmptyValue = values.some(
      (value) =>
        value === '' ||
        value === null ||
        value === undefined
    )

    if (hasEmptyValue) {
      setDiagnosis({
        status: 'error',
        issues: [
          'Some soil parameters are missing.',
        ],
        recommendations: [
          'Please enter values for Soil pH, Water pH, Nitrogen, Phosphorus, Potassium, Humidity, Temperature and Rainfall.',
        ],
      })

      return
    }

    const issues = []
    const recommendations = []

    // SOIL pH
    if (soilPh < 5.5) {
      issues.push(
        'Soil pH is strongly acidic.'
      )

      recommendations.push(
        'Consider agricultural lime to gradually increase soil pH based on soil test results.'
      )
    } else if (soilPh < 6.0) {
      issues.push(
        'Soil pH is slightly acidic.'
      )

      recommendations.push(
        'Monitor soil acidity and consider lime application based on soil testing.'
      )
    } else if (soilPh > 7.5) {
      issues.push(
        'Soil pH is alkaline.'
      )

      recommendations.push(
        'Use suitable soil management practices to improve nutrient availability.'
      )
    } else {
      recommendations.push(
        'Soil pH is within a generally suitable range for many crops.'
      )
    }

    // WATER pH
    if (waterPh < 6.0) {
      issues.push(
        'Water pH is acidic.'
      )

      recommendations.push(
        'Check the irrigation water source and consider appropriate water treatment if necessary.'
      )
    } else if (waterPh > 8.5) {
      issues.push(
        'Water pH is alkaline.'
      )

      recommendations.push(
        'Check irrigation water quality before using it extensively.'
      )
    } else {
      recommendations.push(
        'Water pH is within a generally acceptable irrigation range.'
      )
    }

    // NITROGEN
    if (nitrogen < 20) {
      issues.push(
        'Nitrogen level is low.'
      )

      recommendations.push(
        'Consider adding an appropriate nitrogen source or organic matter.'
      )
    } else if (nitrogen > 80) {
      issues.push(
        'Nitrogen level is high.'
      )

      recommendations.push(
        'Avoid excessive nitrogen fertilizer and monitor crop growth.'
      )
    } else {
      recommendations.push(
        'Nitrogen level is within the current target range.'
      )
    }

    // PHOSPHORUS
    if (phosphorus < 15) {
      issues.push(
        'Phosphorus level is low.'
      )

      recommendations.push(
        'Consider a suitable phosphorus fertilizer based on soil testing.'
      )
    } else if (phosphorus > 70) {
      issues.push(
        'Phosphorus level is high.'
      )

      recommendations.push(
        'Avoid unnecessary phosphorus application to prevent nutrient buildup.'
      )
    } else {
      recommendations.push(
        'Phosphorus level is within the current target range.'
      )
    }

    // POTASSIUM
    if (potassium < 20) {
      issues.push(
        'Potassium level is low.'
      )

      recommendations.push(
        'Consider an appropriate potassium fertilizer or potassium-rich organic inputs.'
      )
    } else if (potassium > 80) {
      issues.push(
        'Potassium level is high.'
      )

      recommendations.push(
        'Avoid excessive potassium application and continue monitoring soil nutrients.'
      )
    } else {
      recommendations.push(
        'Potassium level is within the current target range.'
      )
    }

    // HUMIDITY
    if (humidity < 30) {
      issues.push(
        'Humidity is low.'
      )

      recommendations.push(
        'Monitor irrigation and soil moisture to reduce water stress.'
      )
    } else if (humidity > 85) {
      issues.push(
        'Humidity is high.'
      )

      recommendations.push(
        'Monitor fungal disease risk and improve field ventilation where possible.'
      )
    } else {
      recommendations.push(
        'Humidity is within the current monitoring range.'
      )
    }

    // TEMPERATURE
    if (temperature < 10) {
      issues.push(
        'Temperature is low.'
      )

      recommendations.push(
        'Monitor crops for cold stress.'
      )
    } else if (temperature > 35) {
      issues.push(
        'Temperature is high.'
      )

      recommendations.push(
        'Monitor crops for heat stress and maintain adequate water availability.'
      )
    } else {
      recommendations.push(
        'Temperature is within a generally suitable range for many crops.'
      )
    }

    // RAINFALL
    if (rainfall < 5) {
      issues.push(
        'Rainfall is very low.'
      )

      recommendations.push(
        'Monitor soil moisture and consider irrigation where necessary.'
      )
    } else if (rainfall > 100) {
      issues.push(
        'Rainfall is high.'
      )

      recommendations.push(
        'Monitor waterlogging, drainage and possible nutrient leaching.'
      )
    } else {
      recommendations.push(
        'Rainfall is within the current monitoring range.'
      )
    }

    setDiagnosis({
      status:
        issues.length === 0
          ? 'good'
          : 'attention',
      issues,
      recommendations,
    })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

      {/* PAGE HEADER */}
      <div>
        <p className="section-kicker">
          {t('diagnosis')}
        </p>

        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {t('soil')}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          {t('diagnosisDesc')}
        </p>
      </div>

      {/* PARAMETERS */}
      <section className="mt-8">

        <div className="mb-5">
          <h2 className="text-xl font-extrabold">
            Soil Parameters
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter or edit your soil data before running diagnosis.
          </p>
        </div>

        {/* INPUT CARDS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {metrics.map(
            ({
              key,
              label,
              unit,
              icon: Icon,
              step,
            }) => (
              <div
                key={key}
                className="card rounded-2xl p-4"
              >

                <div className="flex items-center justify-between">

                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint text-leaf">
                    <Icon size={17} />
                  </span>

                  <span className="text-xs font-semibold text-slate-400">
                    {unit}
                  </span>

                </div>

                <label
                  htmlFor={key}
                  className="mt-3 block text-sm font-bold"
                >
                  {label}
                </label>

                <div className="mt-2 flex items-center gap-2">

                  <input
                    id={key}
                    type="number"
                    min="0"
                    step={step}
                    value={soilData[key]}
                    onChange={(event) =>
                      handleChange(
                        key,
                        event.target.value
                      )
                    }
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-lg font-extrabold outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20 dark:border-slate-700 dark:bg-slate-900"
                  />

                  <span className="shrink-0 text-xs font-bold text-slate-500">
                    {unit}
                  </span>

                </div>

              </div>
            )
          )}

        </div>

        {/* ONLY ONE BUTTON */}
        <div className="mt-5">
          <button
            type="button"
            onClick={diagnoseSoil}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf px-6 py-3 font-extrabold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
          >
            <BrainCircuit size={19} />
            Run Diagnosis
          </button>
        </div>

      </section>

      {/* DIAGNOSIS RESULT */}
      {diagnosis && (
        <section className="mt-8">

          <div
            className={`rounded-3xl border p-6 ${
              diagnosis.status === 'good'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20'
                : diagnosis.status === 'error'
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
                  : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20'
            }`}
          >

            {/* RESULT HEADER */}
            <div className="flex gap-3">

              {diagnosis.status === 'good' ? (
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-emerald-600"
                  size={24}
                />
              ) : diagnosis.status === 'error' ? (
                <AlertTriangle
                  className="mt-0.5 shrink-0 text-red-600"
                  size={24}
                />
              ) : (
                <AlertTriangle
                  className="mt-0.5 shrink-0 text-amber-600"
                  size={24}
                />
              )}

              <div className="min-w-0">

                <h2 className="text-xl font-extrabold">
                  {diagnosis.status === 'good'
                    ? 'Soil Condition Looks Good'
                    : diagnosis.status === 'error'
                      ? 'Incomplete Soil Data'
                      : 'Soil Needs Attention'}
                </h2>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Diagnosis is based on the values you entered.
                </p>

              </div>

            </div>

            {/* ISSUES */}
            {diagnosis.issues.length > 0 && (
              <div className="mt-6">

                <h3 className="font-extrabold">
                  Detected Issues
                </h3>

                <div className="mt-3 space-y-2">

                  {diagnosis.issues.map(
                    (issue, index) => (
                      <div
                        key={`${issue}-${index}`}
                        className="flex gap-2 rounded-xl bg-white/70 p-3 text-sm dark:bg-slate-900/40"
                      >

                        <AlertTriangle
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />

                        <span>
                          {issue}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* RECOMMENDATIONS */}
            <div className="mt-6">

              <h3 className="font-extrabold">
                Soil Recommendations
              </h3>

              <div className="mt-3 space-y-2">

                {diagnosis.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={`${recommendation}-${index}`}
                      className="flex gap-2 rounded-xl bg-white/70 p-3 text-sm dark:bg-slate-900/40"
                    >

                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-leaf"
                      />

                      <span>
                        {recommendation}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </section>
      )}

      {/* INFORMATION BOX */}
      <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/20">

        <div className="flex gap-3">

          <Info className="mt-0.5 shrink-0 text-amber-600" />

          <div>

            <h2 className="font-extrabold">
              {t('exactTitle')}
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t('exactDesc')}
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}

export default SoilHealth