import React, { useEffect, useState } from 'react'
import { CloudRain, Droplets, Sun, MapPin } from 'lucide-react'
import { useLanguage } from '../i18n'

const API_URL = import.meta.env.VITE_API_URL

export function Weather() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Kifaa chako hakiruhusu GPS.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
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

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">
        <p className="section-kicker">{t('climate')}</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t('weather')}</h1>
        <p className="mt-8 text-slate-500">Inapakia hali ya hewa...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">
        <p className="section-kicker">{t('climate')}</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t('weather')}</h1>
        <p className="mt-8 text-red-500">{error}</p>
      </main>
    )
  }

  const items = [
    [t('humidity'), `${data.humidity}%`, Droplets],
    [t('temperature'), `${data.temperature}°C`, Sun],
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">
      <p className="section-kicker">{t('climate')}</p>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t('weather')}</h1>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="card bg-forest p-7 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1 text-sm text-green-100">
                <MapPin size={14} /> {data.mahali}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">{t('current')}</h2>
            </div>
            <Sun size={44} />
          </div>
          <div className="mt-10 flex items-end gap-3">
            <strong className="text-6xl">{data.temperature}°</strong>
          </div>
        </section>

        <section className="card grid grid-cols-2 gap-4 p-6">
          {items.map(([a, b, I]) => (
            <div key={a} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <I size={19} className="text-leaf" />
              <p className="mt-3 text-xs text-slate-500">{a}</p>
              <strong className="text-lg">{b}</strong>
            </div>
          ))}
          {data.ujumbe && (
            <div className="col-span-2 rounded-2xl bg-amber-50 p-4 text-xs text-amber-700 dark:bg-amber-900/20">
              <CloudRain size={16} className="mb-1" />
              {data.ujumbe}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}