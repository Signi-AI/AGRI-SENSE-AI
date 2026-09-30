import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  FlaskConical,
  Gauge,
  Leaf,
  Thermometer,
  Waves,
  Droplets,
  CloudRain,
  Pencil,
  Check,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import './Auth.jsx'

// Default readings shown until the farmer enters real numbers, or a
// sensor/API integration later fills this same shape automatically.
const DEFAULT_METRICS = {
  soilPh: { value: '6.5', status: 'optimal' },
  nitrogen: { value: '38kg', status: 'attention' },
  phosphorus: { value: '52 kg', status: 'good' },
  potassium: { value: '41 kg', status: 'attention' },
  humidity: { value: '67%', status: 'normal' },
  temperature: { value: '24°C', status: 'normal' },
  waterPh: { value: '7.1', status: 'good' },
  rainfall: { value: '18 mm', status: 'good' },
}
const METRIC_META = [
  ['soilPh', FlaskConical],
  ['nitrogen', Leaf],
  ['phosphorus', Gauge],
  ['potassium', Waves],
  ['humidity', Droplets],
  ['temperature', Thermometer],
  ['waterPh', Waves],
  ['rainfall', CloudRain],
]
const STATUS_OPTIONS = ['optimal', 'good', 'normal', 'attention']
const STORE_KEY = 'agrisense-metrics'

export function Dashboard() {
  const { t } = useLanguage()

  const savedUser = JSON.parse(localStorage.getItem('agrisense-user') || 'null')
  const userName = savedUser?.name?.trim()?.split(' ')[0] || 'Farmer'

  const [metrics, setMetrics] = useState(DEFAULT_METRICS)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(DEFAULT_METRICS)

  // Load whatever the farmer saved last time (or a future integration wrote).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY))
      if (saved) { setMetrics(saved); setDraft(saved) }
    } catch { /* ignore malformed storage */ }
  }, [])

  const startEdit = () => { setDraft(metrics); setEditing(true) }
  const cancelEdit = () => { setDraft(metrics); setEditing(false) }
  const updateDraft = (key, field, val) => setDraft(d => ({ ...d, [key]: { ...d[key], [field]: val } }))
  const saveEdit = () => {
    setMetrics(draft)
    localStorage.setItem(STORE_KEY, JSON.stringify(draft))
    setEditing(false)
  }

  const shown = editing ? draft : metrics

  return (
    <main className="neu-surface mx-auto max-w-7xl px-4 py-7 sm:px-8">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
            {t('overview')}
          </p>
          <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
            Welcome, {userName}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--neu-muted)]">
            {t('today')}
          </p>
        </div>
        <Link
          to="/crop-recommendation"
          className="neu-raised-sm neu-pressable inline-flex items-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white"
        >
          {t('crop')}
          <ArrowRight size={17} />
        </Link>
      </div>

      {/* METRICS */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
            Farm readings
          </p>
          {!editing ? (
            <button
              type="button"
              onClick={startEdit}
              className="neu-raised-sm neu-pressable flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[color:var(--neu-accent-dark)]"
            >
              <Pencil size={14} /> Update readings
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="neu-raised-sm neu-pressable flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[color:var(--neu-muted)]"
              >
                <X size={14} /> Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="neu-raised-sm neu-pressable flex items-center gap-2 rounded-xl bg-[color:var(--neu-accent)] px-3 py-2 text-xs font-bold text-white"
              >
                <Check size={14} /> Save
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRIC_META.map(([key, Icon]) => {
            const m = shown[key]
            return (
              <div className="neu-raised rounded-2xl p-5" key={key}>
                <div className="flex items-center justify-between">
                  <span className="neu-raised-sm grid h-10 w-10 place-items-center rounded-xl text-[color:var(--neu-accent)]">
                    <Icon size={18} />
                  </span>

                  {editing ? (
                    <select
                      value={m.status}
                      onChange={e => updateDraft(key, 'status', e.target.value)}
                      className="neu-inset rounded-full border-0 px-2 py-1 text-xs font-bold text-[color:var(--neu-text)]"
                      aria-label={`${t(key)} status`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{t(s)}</option>)}
                    </select>
                  ) : (
                    <span
                      className={`neu-inset rounded-full px-3 py-1 text-xs font-bold ${
                        m.status === 'attention' ? 'text-red-500 dark:text-red-300' : 'text-[color:var(--neu-accent-dark)]'
                      }`}
                    >
                      {t(m.status)}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-xs font-bold text-[color:var(--neu-muted)]">
                  {t(key)}
                </p>

                {editing ? (
                  <input
                    value={m.value}
                    onChange={e => updateDraft(key, 'value', e.target.value)}
                    className="neu-inset neu-pressable mt-1 h-10 w-full rounded-xl border-0 px-3 text-lg font-bold text-[color:var(--neu-text)] outline-none"
                    aria-label={`${t(key)} value`}
                    placeholder="e.g. 38kg"
                  />
                ) : (
                  <strong className="mt-1 block text-2xl text-[color:var(--neu-text)]">
                    {m.value}
                  </strong>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* MONITORING + FARM HEALTH */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_.8fr]">

        {/* FARM MONITORING */}
        <section className="neu-raised rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
                Farm monitoring
              </p>
              <h2 className="text-xl font-extrabold text-[color:var(--neu-text)]">
                Soil parameters trend
              </h2>
            </div>
            <span className="neu-inset rounded-full px-3 py-1 text-xs font-bold text-[color:var(--neu-accent-dark)]">
              Live-ready
            </span>
          </div>

          <div className="neu-inset mt-7 h-56 rounded-2xl p-5">
            <div className="grid h-full grid-cols-7 items-end gap-2">
              {[38, 52, 44, 66, 57, 72, 64].map((v, i) => (
                <div key={i} className="flex h-full flex-col justify-end gap-2">
                  <div className="neu-raised-sm rounded-t-xl bg-[color:var(--neu-accent)]" style={{ height: `${v}%` }} />
                  <span className="text-center text-[10px] text-[color:var(--neu-muted)]">D{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FARM HEALTH */}
        <section className="neu-raised rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
            {t('farmHealth')}
          </p>

          <div className="mt-3 flex items-end gap-2">
            <strong className="text-5xl text-[color:var(--neu-text)]">82%</strong>
            <span className="mb-2 text-xs font-bold text-[color:var(--neu-accent-dark)]">{t('healthy')}</span>
          </div>

          <div className="neu-inset mt-6 h-3 rounded-full">
            <div className="h-full w-[82%] rounded-full bg-[color:var(--neu-accent)]" />
          </div>

          <p className="mt-5 text-sm leading-6 text-[color:var(--neu-muted)]">
            Keep monitoring nutrient balance and current farm readings.
          </p>

          <Link
            to="/soil-health"
            className="neu-raised-sm neu-pressable mt-5 flex w-full items-center justify-center rounded-2xl py-3 text-sm font-bold text-[color:var(--neu-text)]"
          >
            {t('openSoil')}
          </Link>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
