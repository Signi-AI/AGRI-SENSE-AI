import React, { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Droplets,
  FlaskConical,
  Thermometer,
  BrainCircuit,
  LoaderCircle,
} from 'lucide-react'
import { useLanguage } from '../i18n'

const API_URL = import.meta.env.VITE_API_URL

const MAZAO = [
  'maize', 'rice', 'bamia', 'nyanya', 'kitunguu_maji', 'maharagwe',
  'karoti', 'mihogo', 'pilipili_hoho', 'pilipili_kali', 'kitunguu_swaumu',
  'tangawizi', 'mboga_za_majani', 'magimbi', 'pilipili_manga',
  'kisamvu', 'kabichi', 'maboga', 'limao', 'kunde', 'biringanya',
]

const AINA_YA_UDONGO = ['mchanga', 'tifutifu', 'mfinyanzi']

export function SoilHealth() {
  const { t } = useLanguage()

  const [zao, setZao] = useState('maize')
  const [udongo, setUdongo] = useState('tifutifu')
  const [soilData, setSoilData] = useState({
    ph: 6.5,
    ph_ya_maji: 7.1,
    N: 38,
    P: 52,
    K: 41,
    humidity: 67,
    temperature: 24,
    ujazo_wa_lita: 100,
  })

  const [loading, setLoading] = useState(false)
  const [diagnosis, setDiagnosis] = useState(null)
  const [error, setError] = useState(null)

  const metrics = [
    { key: 'ph', label: 'Soil pH', unit: 'pH', icon: FlaskConical, step: '0.1' },
    { key: 'ph_ya_maji', label: 'Water pH', unit: 'pH', icon: Droplets, step: '0.1' },
    { key: 'N', label: 'Nitrogen', unit: 'kg', icon: FlaskConical, step: '1' },
    { key: 'P', label: 'Phosphorus', unit: 'kg', icon: FlaskConical, step: '1' },
    { key: 'K', label: 'Potassium', unit: 'kg', icon: FlaskConical, step: '1' },
    { key: 'humidity', label: 'Humidity', unit: '%', icon: Droplets, step: '1' },
    { key: 'temperature', label: 'Temperature', unit: '°C', icon: Thermometer, step: '0.1' },
    { key: 'ujazo_wa_lita', label: 'Water Volume', unit: 'L', icon: Droplets, step: '1' },
  ]

  const handleChange = (key, value) => {
    setSoilData((prev) => ({ ...prev, [key]: value === '' ? '' : Number(value) }))
    setDiagnosis(null)
  }

  const diagnoseSoil = async () => {
    setLoading(true)
    setDiagnosis(null)
    setError(null)

    const payload = {
      zao,
      usomaji_wa_sasa: {
        N: soilData.N,
        P: soilData.P,
        K: soilData.K,
        temperature: soilData.temperature,
        humidity: soilData.humidity,
        ph: soilData.ph,
      },
      aina_ya_udongo: udongo,
      ph_ya_maji: soilData.ph_ya_maji,
      ujazo_wa_lita: soilData.ujazo_wa_lita,
    }

    try {
      const res = await fetch(`${API_URL}/api/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.hitilafu || 'Server error')
      }

      setDiagnosis(json)
    } catch (err) {
      setError(err.message || 'Imeshindikana kupata uchunguzi. Jaribu tena.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

      <div>
        <p className="section-kicker">{t('diagnosis')}</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t('soil')}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          {t('diagnosisDesc')}
        </p>
      </div>

      <section className="mt-8">

        {/* ZAO NA UDONGO */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Zao</label>
            <select
              value={zao}
              onChange={(e) => setZao(e.target.value)}
              className="input capitalize"
            >
              {MAZAO.map((z) => (
                <option key={z} value={z} className="capitalize">{z.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Aina ya Udongo</label>
            <select
              value={udongo}
              onChange={(e) => setUdongo(e.target.value)}
              className="input capitalize"
            >
              {AINA_YA_UDONGO.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-extrabold">Soil Parameters</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter or edit your soil data before running diagnosis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ key, label, unit, icon: Icon, step }) => (
            <div key={key} className="card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint text-leaf">
                  <Icon size={17} />
                </span>
                <span className="text-xs font-semibold text-slate-400">{unit}</span>
              </div>
              <label htmlFor={key} className="mt-3 block text-sm font-bold">{label}</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id={key}
                  type="number"
                  min="0"
                  step={step}
                  value={soilData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-lg font-extrabold outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20 dark:border-slate-700 dark:bg-slate-900"
                />
                <span className="shrink-0 text-xs font-bold text-slate-500">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={diagnoseSoil}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf px-6 py-3 font-extrabold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
          >
            {loading ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Inachunguza...
              </>
            ) : (
              <>
                <BrainCircuit size={19} />
                Run Diagnosis
              </>
            )}
          </button>
        </div>

      </section>

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

      {diagnosis && (
        <section className="mt-8">
          <div
            className={`rounded-3xl border p-6 ${
              diagnosis.hali_ya_jumla === 'Nzuri'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20'
                : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20'
            }`}
          >
            <div className="flex gap-3">
              {diagnosis.hali_ya_jumla === 'Nzuri' ? (
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={24} />
              ) : (
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={24} />
              )}
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold capitalize">
                  {diagnosis.zao} — {diagnosis.hali_ya_jumla}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {diagnosis.ujumbe || `Matatizo yaliyogundulika: ${diagnosis.idadi_ya_matatizo || 0}`}
                </p>
              </div>
            </div>

            {diagnosis.marekebisho && diagnosis.marekebisho.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-extrabold">Marekebisho Yanayopendekezwa</h3>
                {diagnosis.marekebisho.map((m, i) => (
                  <div key={i} className="rounded-xl bg-white/70 p-4 text-sm dark:bg-slate-900/40">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-600" />
                      <div>
                        <p className="font-bold">{m.kigezo}</p>
                        {m.kiasi !== undefined && (
                          <p className="mt-1">
                            {m.mbolea_inayopendekezwa || m.aina_ya_marekebisho}: <strong>{m.kiasi} {m.kipimo}</strong>
                          </p>
                        )}
                        {(m.sababu || m.ujumbe) && (
                          <p className="mt-1 text-slate-600 dark:text-slate-300">{m.sababu || m.ujumbe}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/20">
        <div className="flex gap-3">
          <Info className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <h2 className="font-extrabold">{t('exactTitle')}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t('exactDesc')}</p>
          </div>
        </div>
      </section>

    </main>
  )
}

export default SoilHealth