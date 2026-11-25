import React, { useEffect, useState } from 'react'
import {
  Bell,
  Check,
  KeyRound,
  LogOut,
  Moon,
  Monitor,
  Save,
  Shield,
  Sun,
  Globe2,
  UserRound,
  X,
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useLanguage } from '../i18n'
import { useAuth } from '../context/AuthContext'
import { saveUserName, ensureLocalUser } from './Auth.jsx'

const TEXT = {
  EN: {
    profileTitle: 'Your name',
    profileDesc: 'This name is shown across AgriSense AI. It starts from your first name and you can change it anytime.',
    nameLabel: 'Display name',
    namePlaceholder: 'Your name',
    save: 'Save',
    saved: 'Name updated.',
    securityTitle: 'Password & Security',
    securityDesc: 'Manage your account password and security settings.',
    googlePassword: 'You signed in with Google. Your password is managed through your Google account.',
    passwordUnavailable: 'Changing your password from here is not available yet.',
    currentPassword: 'Current password',
    newPassword: 'New password',
    passwordChanged: 'Password changed. Please sign in again.',
    signOutEverywhere: 'Sign out of all devices',
    signOutEverywhereDesc: 'Revokes all active sessions. You will need to sign in again.',
    appearanceDesc: 'Choose how AgriSense AI looks on this device.',
    notificationsDesc: 'Receive important farm alerts.',
    languageHint: 'English ↔ Kiswahili is available from the top bar.',
  },
  SW: {
    profileTitle: 'Jina lako',
    profileDesc: 'Jina hili linaonekana kwenye AgriSense AI. Linaanza kutoka kwenye jina lako la kwanza na unaweza kulibadilisha wakati wowote.',
    nameLabel: 'Jina la kuonyesha',
    namePlaceholder: 'Jina lako',
    save: 'Hifadhi',
    saved: 'Jina limebadilishwa.',
    securityTitle: 'Nenosiri na Usalama',
    securityDesc: 'Simamia nenosiri na usalama wa akaunti yako.',
    googlePassword: 'Umeingia kwa Google. Nenosiri lako linasimamiwa kupitia akaunti yako ya Google.',
    passwordUnavailable: 'Kubadilisha nenosiri kutoka hapa bado hakupatikani.',
    currentPassword: 'Nenosiri la sasa',
    newPassword: 'Nenosiri jipya',
    passwordChanged: 'Nenosiri limebadilishwa. Tafadhali ingia tena.',
    signOutEverywhere: 'Funga kikao kwenye vifaa vyote',
    signOutEverywhereDesc: 'Inafuta vikao vyote. Utahitaji kuingia tena.',
    appearanceDesc: 'Chagua mwonekano wa AgriSense AI kwenye kifaa hiki.',
    notificationsDesc: 'Pokea tahadhari muhimu za shamba.',
    languageHint: 'Kiingereza ↔ Kiswahili kinapatikana kwenye upau wa juu.',
  },
}

const LABEL = 'mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]'
const INPUT =
  'neu-inset h-14 w-full rounded-2xl border-0 bg-transparent px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none placeholder:text-[color:var(--neu-muted)]'
const ICON_BOX =
  'neu-raised-sm grid h-10 w-10 place-items-center rounded-xl text-[color:var(--neu-accent)]'

const LOCAL_KEYS = [
  'agrisense-auth',
  'agrisense-user',
  'agrisense-google-user',
  'agrisense-user-name',
  'agrisense-user-email',
  'agrisense-user-password',
]

export function Settings({ theme, setTheme }) {
  const nav = useNavigate()
  const { t, lang } = useLanguage()
  const { user, logout, logoutAll, changePassword } = useAuth()
  const c = String(lang).toUpperCase() === 'SW' ? TEXT.SW : TEXT.EN

  // Mtu aliyeingia kwa login pia anapata rekodi ya localStorage
  const [currentUser] = useState(() => ensureLocalUser(user))
  const isGoogleAccount = currentUser?.provider === 'google.com'

  const [notifications, setNotifications] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', new: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordDone, setPasswordDone] = useState('')
  const [passwordBusy, setPasswordBusy] = useState(false)

  const [name, setName] = useState(
    currentUser?.name || currentUser?.firstName || currentUser?.email?.split('@')[0] || ''
  )
  const email = currentUser?.email || ''
  const [nameSaved, setNameSaved] = useState(false)

  // Ujumbe wa "saved" unaisha wenyewe, na timer inasafishwa ukurasa ukifungwa
  useEffect(() => {
    if (!nameSaved) return
    const id = setTimeout(() => setNameSaved(false), 3000)
    return () => clearTimeout(id)
  }, [nameSaved])

  const handleSaveName = (e) => {
    e.preventDefault()

    const cleanName = name.trim()
    if (!cleanName) return

    if (saveUserName(cleanName)) {
      setName(cleanName)
      setNameSaved(true)
      window.dispatchEvent(new CustomEvent('agrisense-user-updated'))
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordDone('')
    if (
      passwords.new.length < 8 ||
      !/[A-Za-z]/.test(passwords.new) ||
      !/\d/.test(passwords.new)
    ) {
      setPasswordError('Use at least 8 characters with a letter and a number.')
      return
    }
    setPasswordBusy(true)
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      })
      setPasswords({ current: '', new: '' })
      setPasswordDone(c.passwordChanged)
      nav('/auth')
    } catch (err) {
      setPasswordError(err?.message || 'Could not change password.')
    } finally {
      setPasswordBusy(false)
    }
  }

  const handleLogoutAll = async () => {
    setLoggingOut(true)
    try {
      await logoutAll()
      LOCAL_KEYS.forEach((k) => localStorage.removeItem(k))
      nav('/auth')
    } catch (err) {
      setPasswordError(err?.message || 'Could not sign out of all devices.')
    } finally {
      setLoggingOut(false)
    }
  }

  // CHANGED: inaiita logout() ya AuthContext (inafuta token), kisha inasafisha data ya kifaa
  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      await logout()
      await signOut(auth).catch(() => {}) // kikao cha Firebase (Google)
    } finally {
      LOCAL_KEYS.forEach((k) => localStorage.removeItem(k))
      setLoggingOut(false)
      setShowLogoutConfirm(false)
      nav('/')
    }
  }

  return (
    <>
      <main className="neu-surface mx-auto max-w-3xl px-4 py-7 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
          {t('preferences')}
        </p>

        <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
          {t('settings')}
        </h1>

        {/* PROFILE NAME */}
        <section className="neu-raised mt-8 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className={ICON_BOX}>
              <UserRound size={19} />
            </span>

            <div>
              <h2 className="font-extrabold text-[color:var(--neu-text)]">{c.profileTitle}</h2>
              <p className="text-xs text-[color:var(--neu-muted)]">{c.profileDesc}</p>
            </div>
          </div>

          <form onSubmit={handleSaveName} className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label htmlFor="display-name" className={LABEL}>{c.nameLabel}</label>

              <input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className={INPUT}
                placeholder={c.namePlaceholder}
              />

              {email && <p className="mt-2 text-xs text-[color:var(--neu-muted)]">{email}</p>}
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="neu-raised-sm neu-pressable inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-6 text-sm font-bold text-white disabled:opacity-60"
            >
              <Save size={17} />
              {c.save}
            </button>
          </form>

          {nameSaved && (
            <p role="status" className="mt-3 flex items-center gap-2 text-sm font-bold text-[color:var(--neu-accent-dark)]">
              <CheckCircle2 size={17} />
              {c.saved}
            </p>
          )}
        </section>

        {/* PASSWORD & SECURITY
            Fomu ya nenosiri imeondolewa kwa sasa: nenosiri halihifadhiwi tena kwenye kifaa,
            na kulibadilisha kunahitaji endpoint ya backend. */}
        <section className="neu-raised mt-5 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className={ICON_BOX}>
              <KeyRound size={19} />
            </span>

            <div>
              <h2 className="font-extrabold text-[color:var(--neu-text)]">{c.securityTitle}</h2>
              <p className="text-xs text-[color:var(--neu-muted)]">{c.securityDesc}</p>
            </div>
          </div>

          <div className="neu-inset mt-5 flex gap-3 rounded-2xl p-4">
            <Shield size={19} className="mt-0.5 shrink-0 text-[color:var(--neu-accent)]" />
            <p className="text-sm leading-6 text-[color:var(--neu-muted)]">
              {isGoogleAccount ? c.googlePassword : c.passwordUnavailable}
            </p>
          </div>

          {!isGoogleAccount && (
            <form onSubmit={handleChangePassword} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="current-password" className={LABEL}>{c.currentPassword}</label>
                <input
                  id="current-password"
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className={INPUT}
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label htmlFor="new-password-settings" className={LABEL}>{c.newPassword}</label>
                <input
                  id="new-password-settings"
                  type="password"
                  required
                  minLength={8}
                  value={passwords.new}
                  onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                  className={INPUT}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={passwordBusy}
                className="neu-raised-sm neu-pressable inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-[color:var(--neu-text)] disabled:opacity-60"
              >
                <KeyRound size={17} />
                {t('changePassword')}
              </button>
            </form>
          )}

          {passwordError && <p role="alert" className="mt-3 text-sm text-red-500">{passwordError}</p>}
          {passwordDone && <p role="status" className="mt-3 text-sm font-bold text-[color:var(--neu-accent-dark)]">{passwordDone}</p>}

          <button
            type="button"
            onClick={handleLogoutAll}
            disabled={loggingOut}
            className="neu-raised-sm neu-pressable mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-[color:var(--neu-text)] disabled:opacity-60"
          >
            <LogOut size={17} />
            {c.signOutEverywhere}
          </button>
          <p className="mt-2 text-xs text-[color:var(--neu-muted)]">{c.signOutEverywhereDesc}</p>
        </section>

        {/* APPEARANCE */}
        <section className="neu-raised mt-5 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className={ICON_BOX}>
              <Monitor size={19} />
            </span>

            <div>
              <h2 className="font-extrabold text-[color:var(--neu-text)]">{t('appearance')}</h2>
              <p className="text-xs text-[color:var(--neu-muted)]">{c.appearanceDesc}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['system', t('system'), Monitor],
              ['light', t('light'), Sun],
              ['dark', t('dark'), Moon],
            ].map(([id, label, I]) => (
              <button
                type="button"
                key={id}
                onClick={() => setTheme(id)}
                className={`neu-pressable rounded-2xl p-5 text-left transition ${
                  theme === id ? 'neu-inset' : 'neu-raised-sm'
                }`}
              >
                <I
                  size={19}
                  className={theme === id ? 'text-[color:var(--neu-accent-dark)]' : 'text-[color:var(--neu-text)]'}
                />

                <span className="mt-3 block text-sm font-bold text-[color:var(--neu-text)]">{label}</span>

                {theme === id && <Check size={16} className="mt-2 text-[color:var(--neu-accent-dark)]" />}
              </button>
            ))}
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="neu-raised mt-5 divide-y divide-[color:var(--neu-dark)] rounded-2xl">
          <div className="flex items-center justify-between p-5">
            <div className="flex gap-3">
              <Bell size={19} className="text-[color:var(--neu-text)]" />

              <div>
                <b className="text-sm text-[color:var(--neu-text)]">{t('notifications')}</b>
                <p className="text-xs text-[color:var(--neu-muted)]">{c.notificationsDesc}</p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              aria-label={t('notifications')}
              onClick={() => setNotifications((v) => !v)}
              className={`neu-pressable relative h-6 w-11 rounded-full transition ${
                notifications ? 'bg-[color:var(--neu-accent)]' : 'neu-inset'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                  notifications ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3 p-5">
            <Globe2 size={19} className="text-[color:var(--neu-text)]" />

            <div>
              <b className="text-sm text-[color:var(--neu-text)]">{t('language')}</b>
              <p className="text-xs text-[color:var(--neu-muted)]">{c.languageHint}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <Shield size={19} className="text-[color:var(--neu-text)]" />

            <div>
              <b className="text-sm text-[color:var(--neu-text)]">{t('privacy')}</b>
              <p className="text-xs text-[color:var(--neu-muted)]">{t('privacyDesc')}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="neu-pressable flex w-full items-center gap-3 p-5 text-left text-sm font-bold text-red-500 dark:text-red-300"
          >
            <LogOut size={19} />
            {t('logout')}
          </button>
        </section>
      </main>

      {/* LOGOUT CONFIRMATION */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div
            className="neu-raised w-full max-w-md rounded-3xl p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div className="flex items-start justify-between">
              <div className="neu-inset flex h-12 w-12 items-center justify-center rounded-2xl text-red-500 dark:text-red-300">
                <LogOut size={22} />
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="neu-raised-sm neu-pressable rounded-full p-2 text-[color:var(--neu-muted)]"
                aria-label={t('close')}
              >
                <X size={20} />
              </button>
            </div>

            <h2 id="logout-title" className="mt-5 text-xl font-extrabold text-[color:var(--neu-text)]">
              {t('logoutConfirmTitle')}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[color:var(--neu-muted)]">{t('logoutConfirmDesc')}</p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="neu-raised-sm neu-pressable rounded-xl px-5 py-3 text-sm font-bold text-[color:var(--neu-text)]"
              >
                {t('cancelLogout')}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="neu-raised-sm neu-pressable rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {t('confirmLogout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Settings