import React, { useEffect, useState } from 'react'
import { Bell, CheckCircle2, TriangleAlert, Clock } from 'lucide-react'
import { useLanguage } from '../i18n'
import './Auth.jsx'

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

  // Neumorphic icon badges: same raised surface, tinted icon color per severity.
  const rangiMuundo = {
    red: 'text-red-500 dark:text-red-300',
    amber: 'text-amber-500 dark:text-amber-300',
    green: 'text-[color:var(--neu-accent)]',
  }

  return (
    <main className="neu-surface mx-auto max-w-4xl px-4 py-7 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('updates')}</p>
      <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">{t('notifications')}</h1>

      <div className="mt-8 space-y-3">
        {items.map(([a, b, I, c]) => (
          <div className="neu-raised flex gap-4 rounded-2xl p-5" key={a}>
            <span className={`neu-raised-sm grid h-11 w-11 shrink-0 place-items-center rounded-xl ${rangiMuundo[c]}`}>
              <I size={19} />
            </span>
            <div>
              <h2 className="font-extrabold text-[color:var(--neu-text)]">{a}</h2>
              <p className="mt-1 text-sm text-[color:var(--neu-muted)]">{b}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Notifications