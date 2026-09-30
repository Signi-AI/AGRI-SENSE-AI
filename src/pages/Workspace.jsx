import React from 'react'
import { Bell, Database, FileText, Settings, ShieldCheck, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import './Auth.jsx'

export function Workspace() {
  const { t } = useLanguage()

  const cards = [
    [Sprout, t('farms'), 'Manage farms and farm profiles.', '/farms'],
    [Database, t('intelligence'), 'Keep your monitoring workflow ready for sensor data.', '/soil-health'],
    [FileText, t('updates'), 'Review recommendations and system updates.', '/notifications'],
    [Bell, t('notifications'), 'Control important farm alerts.', '/notifications']
  ]

  return (
    <main className="neu-surface mx-auto max-w-7xl px-4 py-7 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
        {t('workspace')}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
            {t('workspaceTitle')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--neu-muted)]">
            {t('workspaceDesc')}
          </p>
        </div>

        <Link
          to="/settings"
          className="neu-raised-sm neu-pressable inline-flex shrink-0 items-center gap-2 rounded-xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white"
        >
          <Settings size={17} />
          {t('settings')}
        </Link>
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([Icon, title, desc, to]) => (
          <Link
            to={to}
            key={title}
            className="neu-raised neu-pressable block rounded-2xl p-5 transition hover:-translate-y-0.5"
          >
            <span className="neu-inset grid h-11 w-11 place-items-center rounded-xl text-[color:var(--neu-accent)]">
              <Icon size={19} />
            </span>

            <h2 className="mt-5 font-extrabold text-[color:var(--neu-text)]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--neu-muted)]">{desc}</p>

            <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[color:var(--neu-accent)]">
              Open →
            </span>
          </Link>
        ))}
      </div>

      {/* Workspace settings */}
      <section className="neu-raised mt-6 rounded-2xl p-6">
        <div className="flex gap-3">
          <span className="neu-inset grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[color:var(--neu-accent)]">
            <ShieldCheck size={19} />
          </span>

          <div>
            <h2 className="font-extrabold text-[color:var(--neu-text)]">{t('workspaceSettings')}</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--neu-muted)]">
              {t('workspaceSettingsDesc')}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/settings"
                className="neu-raised-sm neu-pressable rounded-xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white"
              >
                {t('settings')}
              </Link>

              <Link
                to="/privacy-security"
                className="neu-raised-sm neu-pressable rounded-xl px-5 py-3 text-sm font-bold text-[color:var(--neu-text)]"
              >
                {t('privacy')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Workspace