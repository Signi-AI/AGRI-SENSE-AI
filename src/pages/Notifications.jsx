import React, { useEffect, useState } from 'react'
import { Bell, CheckCircle2, TriangleAlert, Clock } from 'lucide-react'
import { useLanguage } from '../i18n'

export function Notifications() {
  const { t } = useLanguage()
  const [siku, setSiku] = useState(null)

  useEffect(() => {
    const tareheIliyohifadhiwa = localStorage.getItem('agrisense_last_soil_check')

    if (tareheIliyohifadhiwa) {
      const tofauti = Date.now() - new Date(tareheIliyohifadhiwa).getTime()
      const sikuZilizopita = Math.floor(tofauti / (1000 * 60 * 60 * 24))
      setSiku(sikuZilizopita)
    } else {
      setSiku(null)
    }
  }, [])

  const arifaYaKumbusho = (() => {
    if (siku === null) {
      return {
        icon: TriangleAlert,
        color: 'amber',
        title: 'Bado Hujachunguza Udongo Wako',
        desc: 'Nenda kwenye "Soil Health" kuingiza data ya udongo na kupata ushauri wa kwanza.',
      }
    }
    if (siku >= 7) {
      return {
        icon: TriangleAlert,
        color: 'red',
        title: 'Muda Mrefu Umepita Bila Kufuatilia Shamba',
        desc: `Imepita siku ${siku} tangu mara ya mwisho ulichunguza udongo wako. Fanya uchunguzi mpya ili kupata ushauri wa hivi karibuni.`,
      }
    }
    return {
      icon: CheckCircle2,
      color: 'green',
      title: 'Ufuatiliaji Uko Sawa',
      desc: `Ulichunguza udongo wako siku ${siku} zilizopita. Endelea kufuatilia mara kwa mara.`,
    }
  })()

  const items = [
    [arifaYaKumbusho.title, arifaYaKumbusho.desc, arifaYaKumbusho.icon, arifaYaKumbusho.color],
    [t('sensorReady'), t('sensorReadyDesc'), Bell, 'green'],
  ]

  const rangiMuundo = {
    red: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
    green: 'bg-mint text-leaf',
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-7 sm:px-8">
      <p className="section-kicker">{t('updates')}</p>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t('notifications')}</h1>

      <div className="mt-8 space-y-3">
        {items.map(([a, b, I, c]) => (
          <div className="card flex gap-4 p-5" key={a}>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${rangiMuundo[c]}`}>
              <I size={19} />
            </span>
            <div>
              <h2 className="font-extrabold">{a}</h2>
              <p className="mt-1 text-sm text-slate-500">{b}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Notifications