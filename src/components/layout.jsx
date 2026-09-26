import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  Globe2,
  Leaf,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Sprout,
  FlaskConical,
  CloudSun,
  Bot,
  Wheat,
  UserRound,
  LockKeyhole,
  BriefcaseBusiness,
  Settings
} from 'lucide-react'
import { useLanguage } from '../i18n'

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 font-extrabold tracking-tight"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-forest text-white shadow-lg shadow-green-900/10">
        <Leaf size={21} />
      </span>

      <span className="text-lg whitespace-nowrap">
        AgriSense <span className="text-leaf">AI</span>
      </span>
    </Link>
  )
}

const publicLinks = [
  ['/', 'home'],
  ['/#about', 'about'],
  ['/#solution', 'solution'],
  ['/contact', 'contact']
]

export function LanguageButton({ compact = false }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <label
      className={`relative flex items-center ${
        compact ? 'w-full' : ''
      }`}
    >
      <Globe2
        size={15}
        className="pointer-events-none absolute left-3 text-slate-400"
      />

      <select
        aria-label={t('language')}
        value={lang}
        onChange={e => setLang(e.target.value)}
        className={`appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-bold dark:border-white/10 dark:bg-slate-800 ${
          compact ? 'w-full' : ''
        }`}
      >
        <option value="EN">English</option>
        <option value="SW">Kiswahili</option>
      </select>

      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2.5 text-slate-400"
      />
    </label>
  )
}

export function Navbar({ app = false, onMenu }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1710]/90">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-8">

        {!app ? (
          <Logo />
        ) : (
          <div className="lg:hidden">
            <Logo />
          </div>
        )}

        {!app && (
          <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex dark:text-slate-300">
            {publicLinks.map(([to, key]) => (
              <Link
                key={to}
                to={to}
                className="transition hover:text-leaf"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">

          <div className="hidden sm:block">
            <LanguageButton />
          </div>

          {!app && (
            <button
              onClick={() => navigate('/auth')}
              className="btn-primary hidden sm:inline-flex"
            >
              {t('create')}
            </button>
          )}

          {app && (
            <Link
              aria-label={t('notifications')}
              to="/notifications"
              className="rounded-xl p-2.5 hover:bg-mint dark:hover:bg-slate-800"
            >
              <Bell size={19} />
            </Link>
          )}

          <button
            aria-label={app ? 'Open navigation menu' : 'Menu'}
            onClick={() => app ? onMenu?.() : undefined}
            className={`${app ? '' : 'lg:hidden'} rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800`}
          >
            <Menu size={23} />
          </button>
        </div>
      </div>

      {!app && (
        <div className="hidden border-t border-slate-100 px-5 py-4 lg:hidden dark:border-white/10">
          {publicLinks.map(([to, key]) => (
            <Link
              key={to}
              to={to}
              className="block rounded-lg px-3 py-3 font-semibold hover:bg-mint"
            >
              {t(key)}
            </Link>
          ))}

          <Link
            to="/auth"
            className="btn-primary mt-2 w-full"
          >
            {t('create')}
          </Link>
        </div>
      )}
    </header>
  )
}

const sideLinks = [
  ['dashboard', 'overview', LayoutDashboard],
  ['workspace', 'workspace', BriefcaseBusiness],
  ['farms', 'farms', Sprout],
  ['soil-health', 'soil', FlaskConical],
  ['weather', 'weather', CloudSun],
  ['ai-advisor', 'advisor', Bot],
  ['crop-recommendation', 'crop', Wheat],
  ['notifications', 'notifications', Bell],
  ['profile', 'profile', UserRound],
  ['settings', 'settings', Settings],
  ['privacy-security', 'privacy', LockKeyhole]
]

export function Sidebar({ mobileOpen = false, onClose }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    onClose?.()
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = () => {
    localStorage.removeItem('agrisense-auth')
    localStorage.removeItem('agrisense-user-name')
    localStorage.removeItem('agrisense-user-email')

    setShowLogoutConfirm(false)
    navigate('/')
  }

  const navigation = (
    <nav className="space-y-1">
      {sideLinks.map(([id, key, Icon]) => (
        <NavLink
          key={id}
          to={'/' + id}
          onClick={() => onClose?.()}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              isActive
                ? 'bg-mint text-leaf dark:bg-green-950/60'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            }`
          }
        >
          <Icon size={18} className="shrink-0" />
          <span>{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  )

  const content = (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-5">

      <div className="flex items-center justify-between">
        <Logo />

        <button
          aria-label="Close navigation menu"
          onClick={() => onClose?.()}
          className="rounded-xl p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        >
          <X size={22} />
        </button>
      </div>

      <div className="mt-7 mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400">
        {t('workspace')}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {navigation}
      </div>

      <div className="mt-4 rounded-2xl bg-forest p-4 text-white">
        <p className="text-xs font-bold">
          Farm Intelligence
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-green-100">
          <span className="h-2 w-2 shrink-0 rounded-full bg-lime-300" />
          AgriSense AI is active
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogoutClick}
        className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/20 dark:hover:text-red-400"
      >
        <LogOut size={18} />
        {t('logout')}
      </button>

      <div className="mt-3 lg:hidden">
        <LanguageButton compact />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex dark:border-white/10 dark:bg-[#0e1c13]">
        {content}
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => onClose?.()}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(86vw,320px)] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0e1c13] ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {content}
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40">
                <LogOut size={22} />
              </div>

              <button
                type="button"
                aria-label="Close logout dialog"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
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

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              You will be signed out of your AgriSense AI account
              and returned to the home page.
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
                onClick={handleConfirmLogout}
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

