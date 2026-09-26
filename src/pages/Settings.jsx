import React, { useState } from 'react'
import {
  Bell,
  Check,
  LogOut,
  Moon,
  Monitor,
  Shield,
  Sun,
  Globe2,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n'

export function Settings({ theme, setTheme }) {
  const nav = useNavigate()
  const { t } = useLanguage()

  const [notifications, setNotifications] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('agrisense-auth')
    localStorage.removeItem('agrisense-user-name')
    localStorage.removeItem('agrisense-user-email')

    setShowLogoutConfirm(false)
    nav('/')
  }

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-7 sm:px-8">
        <p className="section-kicker">{t('preferences')}</p>

        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {t('settings')}
        </h1>

        {/* Appearance */}
        <section className="card mt-8 p-6">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-leaf" />

            <div>
              <h2 className="font-extrabold">
                {t('appearance')}
              </h2>

              <p className="text-xs text-slate-500">
                {t('appearanceDesc')}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['system', t('system'), Monitor],
              ['light', t('light'), Sun],
              ['dark', t('dark'), Moon]
            ].map(([id, label, I]) => (
              <button
                type="button"
                key={id}
                onClick={() => setTheme(id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  theme === id
                    ? 'border-leaf bg-mint dark:bg-green-950/30'
                    : 'border-slate-200 hover:border-leaf/50 dark:border-white/10'
                }`}
              >
                <I size={19} />

                <span className="mt-3 block text-sm font-bold">
                  {label}
                </span>

                {theme === id && (
                  <Check size={16} className="mt-2 text-leaf" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Preferences */}
        <section className="card mt-5 divide-y dark:divide-white/10">

          {/* Notifications */}
          <div className="flex items-center justify-between p-5">
            <div className="flex gap-3">
              <Bell size={19} />

              <div>
                <b className="text-sm">
                  {t('notifications')}
                </b>

                <p className="text-xs text-slate-500">
                  {t('notificationsDesc')}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-pressed={notifications}
              onClick={() => setNotifications(v => !v)}
              className={`relative h-6 w-11 rounded-full transition ${
                notifications
                  ? 'bg-leaf'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center gap-3 p-5">
            <Globe2 size={19} />

            <div>
              <b className="text-sm">
                {t('language')}
              </b>

              <p className="text-xs text-slate-500">
                English ↔ Kiswahili is available from the top bar.
              </p>
            </div>
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-3 p-5">
            <Shield size={19} />

            <div>
              <b className="text-sm">
                {t('privacy')}
              </b>

              <p className="text-xs text-slate-500">
                {t('privacyDesc')}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 p-5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut size={19} />
            {t('logout')}
          </button>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40">
                <LogOut size={22} />
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="logout-title"
              className="mt-5 text-xl font-extrabold"
            >
              Are you sure you want to logout?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You will be signed out of your AgriSense AI account and
              returned to the home page.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

