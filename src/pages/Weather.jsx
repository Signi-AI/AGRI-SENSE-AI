import React, { useEffect, useState } from 'react'
import { CloudRain, Droplets, Sun, MapPin } from 'lucide-react'
import { useLanguage } from '../i18n'
import './Auth.jsx'

const API_URL = import.meta.env.VITE_API_URL

export function Weather() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gpsBanner, setGpsBanner] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Kifaa chako hakiruhusu GPS.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        setGpsBanner(true)
        setTimeout(() => setGpsBanner(false), 4000)

        try {
          const res = await fetch(`${API_URL}/api/weather?lat=${latitude}&lon=${longitude}`)
          if (!res.ok) throw new Error('Server error')
          const json = await res.json()
          setData(json)
        } catch (err) {
          setError('Imeshindikana kupata hali ya hewa. Jaribu tena baadaye.')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Umekataa ruhusa ya GPS. Ruhusu eneo ili tuonyeshe hali ya hewa ya shamba lako.')
        setLoading(false)
      }
    )
  }, [])

  const banner = gpsBanner ? (
    <div
      role="status"
      className="neu-raised-sm fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-[color:var(--neu-accent)] px-4 py-2 text-sm font-bold text-white"
    >
      📍 GPS imepatikana — tunapakia hali ya hewa ya eneo lako
    </div>
  ) : null

  const header = (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
        {t('climate')}
      </p>
      <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
        {t('weather')}
      </h1>
    </>
  )

  if (loading) {
    return (
      <main className="neu-surface mx-auto max-w-7xl px-4 py-7 sm:px-8">
        {banner}
        {header}
        <section className="neu-raised mt-8 rounded-2xl p-6">
          <p className="text-sm text-[color:var(--neu-muted)]">Inapakia hali ya hewa...</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="neu-surface mx-auto max-w-7xl px-4 py-7 sm:px-8">
        {header}
        <section className="neu-raised mt-8 rounded-2xl p-6">
          <p role="alert" className="text-sm font-bold text-red-500 dark:text-red-300">
            {error}
          </p>
        </section>
      </main>
    )
  }

  const items = [
    [t('humidity'), `${data.humidity}%`, Droplets],
    [t('temperature'), `${data.temperature}°C`, Sun]
  ]

  return (
    <main className="neu-surface mx-auto max-w-7xl px-4 py-7 sm:px-8">
      {banner}
      {header}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        {/* Current weather */}
        <section className="neu-raised rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1 text-sm text-[color:var(--neu-muted)]">
                <MapPin size={14} /> {data.mahali}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-[color:var(--neu-text)]">
                {t('current')}
              </h2>
            </div>

            <span className="neu-inset grid h-16 w-16 place-items-center rounded-full text-[color:var(--neu-accent)]">
              <Sun size={34} />
            </span>
          </div>

          <div className="mt-10 flex items-end gap-3">
            <strong className="text-6xl text-[color:var(--neu-accent)]">{data.temperature}°</strong>
          </div>
        </section>

        {/* Details */}
        <section className="neu-raised grid grid-cols-2 gap-4 rounded-3xl p-6">
          {items.map(([a, b, I]) => (
            <div key={a} className="neu-inset rounded-2xl p-4">
              <I size={19} className="text-[color:var(--neu-accent)]" />
              <p className="mt-3 text-xs text-[color:var(--neu-muted)]">{a}</p>
              <strong className="text-lg text-[color:var(--neu-text)]">{b}</strong>
            </div>
          ))}

          {data.ujumbe && (
            <div className="neu-inset col-span-2 rounded-2xl p-4 text-xs text-[color:var(--neu-muted)]">
              <CloudRain size={16} className="mb-1 text-amber-500" />
              {data.ujumbe}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Weather