import React, { useState } from 'react'

import {
  Bell,
  Check,
  Eye,
  EyeOff,
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
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n'

import {
  getCurrentUser,
  saveUserName,
  changeUserPassword,
} from './Auth.jsx'


const TEXT = {
  EN: {
    profileTitle: 'Your name',
    profileDesc:
      'This name is shown across AgriSense AI. It starts from your first name and you can change it anytime.',

    nameLabel: 'Display name',

    save: 'Save',

    saved: 'Name updated.',

    securityTitle:
      'Password & Security',

    securityDesc:
      'Manage your account password and security settings.',

    currentPassword:
      'Current password',

    newPassword:
      'New password',

    confirmPassword:
      'Confirm new password',

    changePassword:
      'Change password',

    passwordChanged:
      'Password updated successfully.',

    passwordMismatch:
      'New passwords do not match.',

    passwordShort:
      'Password must be at least 6 characters.',

    currentPasswordRequired:
      'Please enter your current password.',

    googlePassword:
      'You signed in with Google. Your password is managed through your Google account.',

    preferencesTitle:
      'Preferences',
  },

  SW: {
    profileTitle:
      'Jina lako',

    profileDesc:
      'Jina hili linaonekana kwenye AgriSense AI. Linaanza kutoka kwenye jina lako la kwanza na unaweza kulibadilisha wakati wowote.',

    nameLabel:
      'Jina la kuonyesha',

    save:
      'Hifadhi',

    saved:
      'Jina limebadilishwa.',

    securityTitle:
      'Nenosiri na Usalama',

    securityDesc:
      'Simamia nenosiri na usalama wa akaunti yako.',

    currentPassword:
      'Nenosiri la sasa',

    newPassword:
      'Nenosiri jipya',

    confirmPassword:
      'Thibitisha nenosiri jipya',

    changePassword:
      'Badilisha nenosiri',

    passwordChanged:
      'Nenosiri limebadilishwa kikamilifu.',

    passwordMismatch:
      'Nenosiri jipya halifanani.',

    passwordShort:
      'Nenosiri lazima liwe na angalau herufi 6.',

    currentPasswordRequired:
      'Tafadhali weka nenosiri lako la sasa.',

    googlePassword:
      'Umeingia kwa Google. Nenosiri lako linasimamiwa kupitia akaunti yako ya Google.',

    preferencesTitle:
      'Mapendeleo',
  },
}


const LABEL =
  'mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]'

const INPUT =
  'neu-inset h-14 w-full rounded-2xl border-0 bg-transparent px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none placeholder:text-[color:var(--neu-muted)]'

const PASSWORD_INPUT =
  'neu-inset h-14 w-full rounded-2xl border-0 bg-transparent px-4 pr-12 text-sm font-medium text-[color:var(--neu-text)] outline-none placeholder:text-[color:var(--neu-muted)]'


export function Settings({ theme, setTheme }) {

  const nav = useNavigate()

  const { t, lang } =
    useLanguage()

  const c =
    String(lang).toUpperCase() === 'SW'
      ? TEXT.SW
      : TEXT.EN


  const currentUser =
    getCurrentUser()


  const [notifications, setNotifications] =
    useState(true)


  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false)


  /*
    USER NAME
  */

  const [name, setName] =
    useState(
      currentUser?.name ||
      currentUser?.firstName ||
      currentUser?.email?.split('@')[0] ||
      ''
    )


  const [email] =
    useState(
      currentUser?.email || ''
    )


  const [nameSaved, setNameSaved] =
    useState(false)


  /*
    PASSWORD
  */

  const [currentPassword, setCurrentPassword] =
    useState('')


  const [newPassword, setNewPassword] =
    useState('')


  const [confirmPassword, setConfirmPassword] =
    useState('')


  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false)


  const [showNewPassword, setShowNewPassword] =
    useState(false)


  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)


  const [passwordMessage, setPasswordMessage] =
    useState('')


  const [passwordError, setPasswordError] =
    useState('')


  const [passwordChanged, setPasswordChanged] =
    useState(false)


  const isGoogleAccount =
    currentUser?.provider === 'google.com'


  /* ================================================================
     SAVE USER NAME
  ================================================================ */

  const handleSaveName = e => {

    e.preventDefault()

    const cleanName =
      name.trim()

    if (!cleanName) {
      return
    }

    const saved =
      saveUserName(cleanName)

    if (saved) {

      setName(cleanName)

      setNameSaved(true)

      /*
        Tell other components that the
        current user has changed.
      */

      window.dispatchEvent(
        new CustomEvent(
          'agrisense-user-updated'
        )
      )

      setTimeout(() => {
        setNameSaved(false)
      }, 3000)
    }
  }


  /* ================================================================
     CHANGE PASSWORD
  ================================================================ */

  const handleChangePassword = e => {

    e.preventDefault()

    setPasswordError('')
    setPasswordMessage('')
    setPasswordChanged(false)


    if (isGoogleAccount) {

      setPasswordError(
        c.googlePassword
      )

      return
    }


    if (!currentPassword) {

      setPasswordError(
        c.currentPasswordRequired
      )

      return
    }


    if (newPassword.length < 6) {

      setPasswordError(
        c.passwordShort
      )

      return
    }


    if (
      newPassword !==
      confirmPassword
    ) {

      setPasswordError(
        c.passwordMismatch
      )

      return
    }


    const result =
      changeUserPassword(
        currentPassword,
        newPassword
      )


    if (!result.success) {

      setPasswordError(
        result.message
      )

      return
    }


    setPasswordMessage(
      c.passwordChanged
    )

    setPasswordChanged(true)


    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')


    setTimeout(() => {
      setPasswordChanged(false)
    }, 4000)
  }


  /* ================================================================
     LOGOUT
  ================================================================ */

  const handleLogout = () => {

    localStorage.removeItem(
      'agrisense-auth'
    )

    localStorage.removeItem(
      'agrisense-user'
    )

    localStorage.removeItem(
      'agrisense-google-user'
    )

    localStorage.removeItem(
      'agrisense-user-name'
    )

    localStorage.removeItem(
      'agrisense-user-email'
    )

    localStorage.removeItem(
      'agrisense-user-password'
    )


    setShowLogoutConfirm(false)

    nav('/')
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


        {/* ============================================================
            PROFILE NAME
        ============================================================ */}

        <section className="neu-raised mt-8 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <span className="neu-raised-sm grid h-10 w-10 place-items-center rounded-xl text-[color:var(--neu-accent)]">

              <UserRound size={19} />

            </span>


            <div>

              <h2 className="font-extrabold text-[color:var(--neu-text)]">
                {c.profileTitle}
              </h2>

              <p className="text-xs text-[color:var(--neu-muted)]">
                {c.profileDesc}
              </p>

            </div>

          </div>


          <form
            onSubmit={handleSaveName}
            className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"
          >

            <div>

              <label
                htmlFor="display-name"
                className={LABEL}
              >
                {c.nameLabel}
              </label>


              <input
                id="display-name"
                value={name}
                onChange={e =>
                  setName(e.target.value)
                }
                maxLength={40}
                className={INPUT}
                placeholder="Your name"
              />


              {email && (

                <p className="mt-2 text-xs text-[color:var(--neu-muted)]">
                  {email}
                </p>

              )}

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

            <p
              role="status"
              className="mt-3 flex items-center gap-2 text-sm font-bold text-[color:var(--neu-accent-dark)]"
            >

              <CheckCircle2 size={17} />

              {c.saved}

            </p>

          )}

        </section>


        {/* ============================================================
            PASSWORD & SECURITY
        ============================================================ */}

        <section className="neu-raised mt-5 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <span className="neu-raised-sm grid h-10 w-10 place-items-center rounded-xl text-[color:var(--neu-accent)]">

              <KeyRound size={19} />

            </span>


            <div>

              <h2 className="font-extrabold text-[color:var(--neu-text)]">
                {c.securityTitle}
              </h2>

              <p className="text-xs text-[color:var(--neu-muted)]">
                {c.securityDesc}
              </p>

            </div>

          </div>


          {isGoogleAccount ? (

            <div className="neu-inset mt-5 flex gap-3 rounded-2xl p-4">

              <Shield
                size={19}
                className="mt-0.5 shrink-0 text-[color:var(--neu-accent)]"
              />

              <p className="text-sm leading-6 text-[color:var(--neu-muted)]">
                {c.googlePassword}
              </p>

            </div>

          ) : (

            <form
              onSubmit={
                handleChangePassword
              }
              className="mt-5 space-y-4"
            >

              {/* CURRENT PASSWORD */}

              <div>

                <label
                  htmlFor="current-password"
                  className={LABEL}
                >
                  {c.currentPassword}
                </label>


                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                  />


                  <input
                    id="current-password"
                    type={
                      showCurrentPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      currentPassword
                    }
                    onChange={e =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    className={`${PASSWORD_INPUT} pl-11`}
                    minLength={6}
                    required
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        v => !v
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                  >

                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* NEW PASSWORD */}

              <div>

                <label
                  htmlFor="new-password"
                  className={LABEL}
                >
                  {c.newPassword}
                </label>


                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                  />


                  <input
                    id="new-password"
                    type={
                      showNewPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      newPassword
                    }
                    onChange={e =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    className={`${PASSWORD_INPUT} pl-11`}
                    minLength={6}
                    required
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        v => !v
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                  >

                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div>

                <label
                  htmlFor="confirm-password"
                  className={LABEL}
                >
                  {c.confirmPassword}
                </label>


                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                  />


                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      confirmPassword
                    }
                    onChange={e =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className={`${PASSWORD_INPUT} pl-11`}
                    minLength={6}
                    required
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        v => !v
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* ERROR */}

              {passwordError && (

                <div
                  role="alert"
                  className="neu-inset flex gap-3 rounded-2xl p-4 text-red-600 dark:text-red-300"
                >

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-sm leading-6">
                    {passwordError}
                  </p>

                </div>

              )}


              {/* SUCCESS */}

              {passwordMessage && (

                <div
                  role="status"
                  className="neu-inset flex gap-3 rounded-2xl p-4 text-[color:var(--neu-accent-dark)]"
                >

                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-sm leading-6">
                    {passwordMessage}
                  </p>

                </div>

              )}


              <button
                type="submit"
                className="neu-raised-sm neu-pressable inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-6 text-sm font-bold text-white sm:w-auto"
              >

                <KeyRound size={17} />

                {c.changePassword}

              </button>

            </form>

          )}

        </section>


        {/* ============================================================
            APPEARANCE
        ============================================================ */}

        <section className="neu-raised mt-5 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <span className="neu-raised-sm grid h-10 w-10 place-items-center rounded-xl text-[color:var(--neu-accent)]">

              <Monitor size={19} />

            </span>


            <div>

              <h2 className="font-extrabold text-[color:var(--neu-text)]">
                {t('appearance')}
              </h2>

              <p className="text-xs text-[color:var(--neu-muted)]">
                {t('appearanceDesc')}
              </p>

            </div>

          </div>


          <div className="mt-5 grid gap-3 sm:grid-cols-3">

            {[
              ['system', t('system'), Monitor],
              ['light', t('light'), Sun],
              ['dark', t('dark'), Moon],
            ].map(
              ([id, label, I]) => (

                <button
                  type="button"
                  key={id}
                  onClick={() =>
                    setTheme(id)
                  }
                  className={`neu-pressable rounded-2xl p-5 text-left transition ${
                    theme === id
                      ? 'neu-inset'
                      : 'neu-raised-sm'
                  }`}
                >

                  <I
                    size={19}
                    className={
                      theme === id
                        ? 'text-[color:var(--neu-accent-dark)]'
                        : 'text-[color:var(--neu-text)]'
                    }
                  />


                  <span className="mt-3 block text-sm font-bold text-[color:var(--neu-text)]">
                    {label}
                  </span>


                  {theme === id && (

                    <Check
                      size={16}
                      className="mt-2 text-[color:var(--neu-accent-dark)]"
                    />

                  )}

                </button>

              )
            )}

          </div>

        </section>


        {/* ============================================================
            PREFERENCES
        ============================================================ */}

        <section className="neu-raised mt-5 divide-y divide-[color:var(--neu-dark)] rounded-2xl">

          {/* NOTIFICATIONS */}

          <div className="flex items-center justify-between p-5">

            <div className="flex gap-3">

              <Bell
                size={19}
                className="text-[color:var(--neu-text)]"
              />


              <div>

                <b className="text-sm text-[color:var(--neu-text)]">
                  {t('notifications')}
                </b>

                <p className="text-xs text-[color:var(--neu-muted)]">
                  {t('notificationsDesc')}
                </p>

              </div>

            </div>


            <button
              type="button"
              aria-pressed={
                notifications
              }
              onClick={() =>
                setNotifications(
                  v => !v
                )
              }
              className={`neu-pressable relative h-6 w-11 rounded-full transition ${
                notifications
                  ? 'bg-[color:var(--neu-accent)]'
                  : 'neu-inset'
              }`}
            >

              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                  notifications
                    ? 'left-6'
                    : 'left-1'
                }`}
              />

            </button>

          </div>


          {/* LANGUAGE */}

          <div className="flex items-center gap-3 p-5">

            <Globe2
              size={19}
              className="text-[color:var(--neu-text)]"
            />


            <div>

              <b className="text-sm text-[color:var(--neu-text)]">
                {t('language')}
              </b>

              <p className="text-xs text-[color:var(--neu-muted)]">
                English ↔ Kiswahili is available from the top bar.
              </p>

            </div>

          </div>


          {/* PRIVACY */}

          <div className="flex items-center gap-3 p-5">

            <Shield
              size={19}
              className="text-[color:var(--neu-text)]"
            />


            <div>

              <b className="text-sm text-[color:var(--neu-text)]">
                {t('privacy')}
              </b>

              <p className="text-xs text-[color:var(--neu-muted)]">
                {t('privacyDesc')}
              </p>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            onClick={() =>
              setShowLogoutConfirm(
                true
              )
            }
            className="neu-pressable flex w-full items-center gap-3 p-5 text-left text-sm font-bold text-red-500 dark:text-red-300"
          >

            <LogOut size={19} />

            {t('logout')}

          </button>

        </section>

      </main>


      {/* ================================================================
          LOGOUT CONFIRMATION MODAL
      ================================================================ */}

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
                onClick={() =>
                  setShowLogoutConfirm(
                    false
                  )
                }
                className="neu-raised-sm neu-pressable rounded-full p-2 text-[color:var(--neu-muted)]"
                aria-label="Close"
              >

                <X size={20} />

              </button>

            </div>


            <h2
              id="logout-title"
              className="mt-5 text-xl font-extrabold text-[color:var(--neu-text)]"
            >
              Are you sure you want to logout?
            </h2>


            <p className="mt-2 text-sm leading-6 text-[color:var(--neu-muted)]">
              You will be signed out of your AgriSense AI account and returned to the home page.
            </p>


            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowLogoutConfirm(
                    false
                  )
                }
                className="neu-raised-sm neu-pressable rounded-xl px-5 py-3 text-sm font-bold text-[color:var(--neu-text)]"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="neu-raised-sm neu-pressable rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
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


export default Settings

