import React, { useEffect, useState } from 'react'
import { Bell, CheckCircle2, TriangleAlert } from 'lucide-react'
import { useLanguage } from '../i18n'
import './Auth.jsx'

const DAY_MS = 1000 * 60 * 60 * 24

export function Notifications() {
  const { t } = useLanguage()
  const [days, setDays] = useState(null)

  useEffect(() => {
    // SoilHealth.jsx inaandika tarehe hii baada ya kila diagnosis iliyofanikiwa
    const saved = localStorage.getItem('agrisense_last_soil_check')
    const time = saved ? new Date(saved).getTime() : NaN

    // Tarehe mbovu inatibiwa kama "hajawahi kuchunguza" (si "NaN siku")
    setDays(Number.isNaN(time) ? null : Math.max(0, Math.floor((Date.now() - time) / DAY_MS)))
  }, [])

  const reminder = (() => {
    if (days === null) {
      return {
        icon: TriangleAlert,
        color: 'amber',
        title: t('soilNeverTitle'),
        desc: t('soilNeverDesc'),
      }
    }

    if (days >= 7) {
      return {
        icon: TriangleAlert,
        color: 'red',
        title: t('soilOverdueTitle'),
        desc: t('soilOverdueDesc').replace('{days}', days),
      }
    }

    return {
      icon: CheckCircle2,
      color: 'green',
      title: t('soilOkTitle'),
      desc: t('soilOkDesc').replace('{days}', days),
    }
  })()

  const items = [
    { id: 'reminder', title: reminder.title, desc: reminder.desc, icon: reminder.icon, color: reminder.color },
    { id: 'sensor', title: t('sensorReady'), desc: t('sensorReadyDesc'), icon: Bell, color: 'green' },
  ]

  // Neumorphic icon badges: same raised surface, tinted icon color per severity.
  const severityColor = {
    red: 'text-red-500 dark:text-red-300',
    amber: 'text-amber-500 dark:text-amber-300',
    green: 'text-[color:var(--neu-accent)]',
  }

  return (
    <main className="neu-surface mx-auto max-w-4xl px-4 py-7 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('updates')}</p>
      <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">{t('notifications')}</h1>

      <div className="mt-8 space-y-3">
        {items.map(({ id, title, desc, icon: I, color }) => (
          <div className="neu-raised flex gap-4 rounded-2xl p-5" key={id}>
            <span className={`neu-raised-sm grid h-11 w-11 shrink-0 place-items-center rounded-xl ${severityColor[color]}`}>
              <I size={19} />
            </span>
            <div>
              <h2 className="font-extrabold text-[color:var(--neu-text)]">{title}</h2>
              <p className="mt-1 text-sm text-[color:var(--neu-muted)]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Notifications