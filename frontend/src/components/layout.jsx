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
import { useAuth } from '../context/AuthContext'

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-900 dark:text-white"
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
        className="pointer-events-none absolute left-3 text-slate-500 dark:text-slate-400"
      />

      <select
        aria-label={t('language')}
        value={lang}
        onChange={e => setLang(e.target.value)}
        className={`appearance-none rounded-xl border border-emerald-900/10 bg-[#edf2ee] py-2 pl-9 pr-8 text-xs font-bold text-slate-800 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] dark:border-white/15 dark:bg-[#0b1710] dark:text-slate-200 dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.04)] focus:outline-none ${
          compact ? 'w-full' : ''
        }`}
      >
        <option value="EN" className="bg-[#edf2ee] dark:bg-[#0b1710]">English</option>
        <option value="SW" className="bg-[#edf2ee] dark:bg-[#0b1710]">Kiswahili</option>
      </select>

      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2.5 text-slate-500 dark:text-slate-400"
      />
    </label>
  )
}

export function Navbar({ app = false, onMenu }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#edf2ee]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1710]/90">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-8">

        {!app ? (
          <Logo />
        ) : (
          <div className="lg:hidden">
            <Logo />
          </div>
        )}

        {!app && (
          <nav className="ml-auto hidden items-center gap-3 text-sm font-semibold text-slate-700 lg:flex dark:text-slate-300">
            {publicLinks.map(([to, key]) => (
              <Link
                key={to}
                to={to}
                className="rounded-xl px-4 py-2 bg-[#edf2ee] shadow-[3px_3px_6px_rgba(0,0,0,0.05),-2px_-2px_6px_rgba(255,255,255,0.8)] transition hover:text-leaf dark:bg-[#0b1710] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-2px_-2px_5px_rgba(255,255,255,0.03)]"
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
              className="btn-primary hidden sm:inline-flex shadow-[4px_4px_10px_rgba(0,0,0,0.08),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.1)]"
            >
              {t('create')}
            </button>
          )}

          {app && (
            <Link
              aria-label={t('notifications')}
              to="/notifications"
              className="rounded-xl p-2.5 bg-[#edf2ee] text-slate-700 shadow-[4px_4px_8px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.9)] transition hover:text-leaf dark:bg-[#0b1710] dark:text-slate-300 dark:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.05)]"
            >
              <Bell size={19} />
            </Link>
          )}

          <button
            aria-label={app ? 'Open navigation menu' : 'Menu'}
            onClick={() => app ? onMenu?.() : undefined}
            className={`${app ? '' : 'lg:hidden'} rounded-xl p-2 bg-[#edf2ee] text-slate-700 shadow-[4px_4px_8px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.9)] transition hover:text-leaf dark:bg-[#0b1710] dark:text-slate-300 dark:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.05)]`}
          >
            <Menu size={23} />
          </button>
        </div>
      </div>

      {!app && (
        <div className="hidden border-t border-emerald-900/10 bg-[#edf2ee] px-5 py-4 lg:hidden dark:border-white/10 dark:bg-[#0b1710]">
          {publicLinks.map(([to, key]) => (
            <Link
              key={to}
              to={to}
              className="block rounded-lg px-3 py-3 my-1 font-semibold text-slate-700 bg-[#edf2ee] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:bg-[#0b1710] dark:text-slate-200 dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]"
            >
              {t(key)}
            </Link>
          ))}

          <Link
            to="/auth"
            className="btn-primary mt-2 w-full text-center"
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
  const { logout } = useAuth()

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogoutClick = () => {
    onClose?.()
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = async () => {
    setLoggingOut(true)
    setShowLogoutConfirm(false)
    navigate('/', { replace: true })
    await logout()
    setLoggingOut(false)
  }

  const navigation = (
    <nav className="space-y-1.5">
      {sideLinks.map(([id, key, Icon]) => (
        <NavLink
          key={id}
          to={'/' + id}
          onClick={() => onClose?.()}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              isActive
                ? 'bg-[#edf2ee] text-leaf shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] border border-emerald-900/10 dark:bg-[#0b1710] dark:text-leaf dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.04)] dark:border-white/10'
                : 'text-slate-700 hover:bg-[#e4eae5] hover:text-slate-900 dark:text-slate-300 dark:hover:bg-[#0b1710]/50 dark:hover:text-white'
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
          className="rounded-xl p-2 bg-[#edf2ee] text-slate-700 shadow-[4px_4px_8px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.9)] hover:text-slate-900 lg:hidden dark:bg-[#0b1710] dark:text-slate-300 dark:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.05)] dark:hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      <div className="mt-7 mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-500 dark:text-slate-400">
        {t('workspace')}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {navigation}
      </div>

      <div className="mt-4 rounded-2xl bg-forest p-4 text-white shadow-[6px_6px_14px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.03)] dark:border dark:border-white/10">
        <p className="text-xs font-bold">
          Farm Intelligence
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-green-100">
          <span className="h-2 w-2 shrink-0 rounded-full bg-lime-300 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
          AgriSense AI is active
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogoutClick}
        disabled={loggingOut}
        className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-red-950/20 dark:hover:text-red-400"
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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-emerald-900/10 bg-[#edf2ee] shadow-[6px_0_20px_rgba(0,0,0,0.05)] lg:flex dark:border-white/10 dark:bg-[#0b1710] dark:shadow-[6px_0_25px_rgba(0,0,0,0.5)]">
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(86vw,320px)] flex-col border-r border-emerald-900/10 bg-[#edf2ee] shadow-2xl transition-transform duration-300 lg:hidden dark:border-white/10 dark:bg-[#0b1710] ${
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
            className="w-full max-w-md rounded-3xl bg-[#edf2ee] p-6 shadow-2xl dark:bg-[#0b1710] dark:border dark:border-white/10 dark:shadow-[8px_8px_20px_rgba(0,0,0,0.6),-4px_-4px_16px_rgba(255,255,255,0.03)]"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                <LogOut size={22} />
              </div>

              <button
                type="button"
                aria-label="Close logout dialog"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full p-2 text-slate-600 transition hover:bg-emerald-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>

            </div>

            <h2
              id="logout-title"
              className="mt-5 text-xl font-extrabold text-slate-900 dark:text-slate-100"
            >
              Are you sure you want to logout?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              You will be signed out of your AgriSense AI account
              and returned to the home page.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-xl border border-emerald-900/10 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-emerald-900/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 shadow-[3px_3px_8px_rgba(220,38,38,0.3)]"
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