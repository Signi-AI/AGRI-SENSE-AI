import React from 'react'
import { ArrowRight, FlaskConical, Gauge, Leaf, Thermometer, Waves, Droplets, CloudRain } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { useAuth } from '../context/AuthContext'

const metrics = [
  ['soilPh', '6.5', 'optimal', FlaskConical],
  ['nitrogen', '38kg', 'attention', Leaf],
  ['phosphorus', '52 kg', 'good', Gauge],
  ['potassium', '41 kg', 'attention', Waves],
  ['humidity', '67%', 'normal', Droplets],
  ['temperature', '24°C', 'normal', Thermometer],
  ['waterPh', '7.1', 'good', Waves],
  ['rainfall', '18 mm', 'good', CloudRain],
]

export function Dashboard() {
  const { t } = useLanguage() // CHANGED: `lang` no longer needed
  const { user } = useAuth()
  const firstName = (user?.name || '').split(' ')[0]
  const isNew = sessionStorage.getItem('agrisense_new_user') === '1'

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">{t('overview')}</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            {isNew ? t('dashWelcomeNew') : t('dashWelcomeBack')} {firstName} {/* CHANGED: uses the new translation keys */}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t('today')}</p>
        </div>

        <Link to="/crop-recommendation" className="btn-primary">
          {t('crop')} <ArrowRight size={17} />
        </Link>
      </div>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([key, value, status, Icon]) => (
          <div className="card p-5" key={key}>
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-leaf">
                <Icon size={18} />
              </span>
              <span className={`status-pill ${status === 'attention' ? 'status-danger' : 'status-good'}`}>
                {t(status)}
              </span>
            </div>
            <p className="mt-5 text-xs font-bold text-slate-500">{t(key)}</p>
            <strong className="mt-1 block text-2xl">{value}</strong>
          </div>
        ))}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Farm monitoring</p>
              <h2 className="text-xl font-extrabold">Soil parameters trend</h2>
            </div>
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-leaf">Live-ready</span>
          </div>

          <div className="mt-7 h-56 rounded-2xl bg-gradient-to-b from-mint/70 to-white p-5 dark:from-green-950/30 dark:to-slate-900">
            <div className="grid h-full grid-cols-7 items-end gap-2">
              {[38, 52, 44, 66, 57, 72, 64].map((v, i) => (
                <div key={i} className="flex h-full flex-col justify-end gap-2">
                  <div className="rounded-t-xl bg-leaf/80" style={{ height: `${v}%` }} />
                  <span className="text-center text-[10px] text-slate-400">D{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card p-6">
          <p className="section-kicker">{t('farmHealth')}</p>
          <div className="mt-3 flex items-end gap-2">
            <strong className="text-5xl">82%</strong>
            <span className="mb-2 text-xs font-bold text-leaf">{t('healthy')}</span>
          </div>

          <div className="mt-6 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-[82%] rounded-full bg-leaf" />
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Keep monitoring nutrient balance and current farm readings.
          </p>

          <Link to="/soil-health" className="btn-soft mt-5 w-full">
            {t('openSoil')}
          </Link>
        </section>
      </div>
    </main>
  )
}