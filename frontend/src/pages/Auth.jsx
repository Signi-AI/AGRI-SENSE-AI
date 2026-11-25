import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  UserRound,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

import { useLanguage } from '../i18n'
import { useAuth } from '../context/AuthContext'

// =====================================================================
// NEUMORPHIC GREEN STYLES
// =====================================================================

const neuCss = `
@layer components {
  :root {
    --neu-bg: #e4eadc;
    --neu-light: #fbfef7;
    --neu-dark: #bcc6b1;
    --neu-text: #1e2a16;
    --neu-muted: #5b6852;
    --neu-accent: #3b6d11;
    --neu-accent-dark: #2f5a0d;
  }

  .dark {
    --neu-bg: #1c231a;
    --neu-light: #262f23;
    --neu-dark: #12170f;
    --neu-text: #e8f0e0;
    --neu-muted: #a3b298;
    --neu-accent: #4f8f1f;
    --neu-accent-dark: #a9dd6b;
  }

  .neu-surface {
    background-color: var(--neu-bg);
    color: var(--neu-text);
  }

  .neu-raised {
    background-color: var(--neu-bg);
    box-shadow:
      10px 10px 20px var(--neu-dark),
      -10px -10px 20px var(--neu-light);
  }

  .neu-raised-sm {
    background-color: var(--neu-bg);
    box-shadow:
      5px 5px 10px var(--neu-dark),
      -5px -5px 10px var(--neu-light);
  }

  .neu-inset {
    background-color: var(--neu-bg);
    box-shadow:
      inset 5px 5px 10px var(--neu-dark),
      inset -5px -5px 10px var(--neu-light);
  }

  input.neu-inset:focus-visible {
    box-shadow:
      inset 5px 5px 10px var(--neu-dark),
      inset -5px -5px 10px var(--neu-light),
      0 0 0 2px var(--neu-accent);
  }

  .neu-tab-active {
    background-color: var(--neu-bg);
    color: var(--neu-accent-dark);
    box-shadow:
      4px 4px 8px var(--neu-dark),
      -4px -4px 8px var(--neu-light);
  }

  .neu-pressable {
    transition:
      box-shadow .15s ease,
      transform .15s ease;
  }

  button.neu-pressable:not(:disabled),
  a.neu-pressable {
    cursor: pointer;
  }

  .neu-raised-sm.neu-pressable:hover:not(:disabled) {
    box-shadow:
      7px 7px 14px var(--neu-dark),
      -7px -7px 14px var(--neu-light);
  }

  .neu-raised.neu-pressable:hover:not(:disabled) {
    box-shadow:
      13px 13px 26px var(--neu-dark),
      -13px -13px 26px var(--neu-light);
  }

  .neu-raised-sm.neu-pressable:active:not(:disabled),
  .neu-raised.neu-pressable:active:not(:disabled) {
    box-shadow:
      inset 4px 4px 8px var(--neu-dark),
      inset -4px -4px 8px var(--neu-light);
  }

  .neu-pressable:focus-visible {
    outline: 2px solid var(--neu-accent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .neu-pressable {
      transition: none;
    }
  }
}
`

if (typeof document !== 'undefined') {
  const STYLE_ID = 'agrisense-neu-styles'
  let styleEl = document.getElementById(STYLE_ID)

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_ID
    document.head.appendChild(styleEl)
  }

  styleEl.textContent = neuCss
}

// =====================================================================
// GOOGLE ICON
// =====================================================================

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.7-.06-1.37-.18-2.02H12v3.83h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.2Z"
      />
      <path
        fill="#34A853"
        d="M12 21.8c2.64 0 4.86-.87 6.48-2.37l-3.14-2.45c-.87.58-1.98.93-3.34.93-2.56 0-4.73-1.73-5.51-4.06H3.24v2.53A9.79 9.79 0 0 0 12 21.8Z"
      />
      <path
        fill="#FBBC05"
        d="M6.49 13.85A5.88 5.88 0 0 1 6.18 12c0-.64.11-1.26.31-1.85V7.62H3.24A9.8 9.8 0 0 0 2.2 12c0 1.58.38 3.07 1.04 4.38l3.25-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.09c1.44 0 2.73.5 3.75 1.48l2.81-2.81C16.86 3.16 14.64 2.2 12 2.2a9.79 9.79 0 0 0-8.76 5.42l3.25 2.53C7.27 7.82 9.44 6.09 12 6.09Z"
      />
    </svg>
  )
}

// =====================================================================
// FORM STYLES
// =====================================================================

const FIELD =
  'neu-inset neu-pressable h-14 w-full rounded-2xl border-0 pl-11 pr-4 text-sm font-medium outline-none text-[color:var(--neu-text)] placeholder:text-[color:var(--neu-muted)]'

const LABEL =
  'mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]'

// =====================================================================
// CURRENT USER HELPERS
// (zinatumiwa na kurasa zingine, kwa hiyo zinabaki kusafirishwa)
// =====================================================================

export function getCurrentUser() {
  try {
    const user = localStorage.getItem('agrisense-user')

    if (!user) {
      return null
    }

    const parsedUser = JSON.parse(user)

    return {
      ...parsedUser,
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      provider: parsedUser.provider || 'password',
    }
  } catch (error) {
    console.error('Unable to read current user:', error)

    return null
  }
}

// =====================================================================
// SAVE USER NAME
// =====================================================================

export function saveUserName(name) {
  const cleanName = String(name || '').trim()

  if (!cleanName) {
    return false
  }

  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return false
    }

    const updatedUser = {
      ...currentUser,
      name: cleanName,
    }

    localStorage.setItem('agrisense-user', JSON.stringify(updatedUser))
    localStorage.setItem('agrisense-user-name', cleanName)

    if (currentUser.provider === 'google.com') {
      const googleUser = localStorage.getItem('agrisense-google-user')

      if (googleUser) {
        try {
          const parsedGoogleUser = JSON.parse(googleUser)

          localStorage.setItem(
            'agrisense-google-user',
            JSON.stringify({
              ...parsedGoogleUser,
              name: cleanName,
            })
          )
        } catch (error) {
          console.error('Unable to update Google user:', error)
        }
      }
    }

    return true
  } catch (error) {
    console.error('Unable to save username:', error)

    return false
  }
}

// =====================================================================
// CHANGE USER PASSWORD
// Nenosiri halihifadhiwi tena kwenye localStorage (si salama).
// Kubadilisha nenosiri sasa kunafanyika kupitia changePassword() ya AuthContext.
// =====================================================================

export function changeUserPassword(currentPassword, newPassword) {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    return {
      success: false,
      message: 'No signed-in user was found.',
    }
  }

  if (currentUser.provider === 'google.com') {
    return {
      success: false,
      message: 'Google accounts manage passwords through Google.',
    }
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      message: 'New password must be at least 6 characters.',
    }
  }

  return {
    success: false,
    message: 'Use changePassword() from AuthContext to change the password.',
  }
}

// Inahakikisha kuna rekodi ya mtumiaji kwenye localStorage kwa ajili ya Settings na Profile.
// Rekodi ya mtu mwingine (barua pepe tofauti) inabadilishwa.
export function ensureLocalUser(backendUser) {
  const local = getCurrentUser()

  if (!backendUser) return local
  if (local && local.email === backendUser.email) return local

  const fullName = (backendUser.name || '').trim()
  const [firstName = '', ...rest] = fullName.split(/\s+/)

  const created = {
    name: firstName || (backendUser.email || '').split('@')[0] || 'User',
    fullName,
    firstName,
    lastName: rest.join(' '),
    email: backendUser.email || '',
    provider: 'password',
  }

  localStorage.setItem('agrisense-user', JSON.stringify(created))
  localStorage.setItem('agrisense-user-name', created.name)

  return created
}

// =====================================================================
// AUTH COMPONENT
// =====================================================================

export function Auth() {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  })

  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { login, register, loginWithGoogle, verifyEmail, forgotPassword, resetPassword } = useAuth()

  const forgot = params.get('forgot') === 'true'
  const verifyToken = params.get('verify') === 'true' ? params.get('token') : null
  const resetToken = params.get('reset') === 'true' ? params.get('token') : null
  const recovery = forgot || !!resetToken || !!verifyToken

  // Email verification link from the backend.
  useEffect(() => {
    if (!verifyToken) return
    let active = true
    setSubmitting(true)
    verifyEmail(verifyToken)
      .then((data) => {
        if (active) setNotice(data?.message || 'Email verified. You can now sign in.')
      })
      .catch((err) => {
        if (active) setError(err?.message || 'This verification link is invalid or has expired.')
      })
      .finally(() => {
        if (active) setSubmitting(false)
      })
    return () => { active = false }
  }, [verifyToken, verifyEmail])

  const field = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.value,
    }))

  const switchMode = (next) => {
    setMode(next)
    setError('')

    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
    })
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      const data = await forgotPassword(form.email)
      setNotice(data?.message || 'If this email is registered, a reset link has been sent.')
      setForm((f) => ({ ...f, email: '' }))
    } catch (err) {
      setError(err?.message || 'Could not send the reset link.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    if (!resetToken) {
      setError('This reset link is invalid. Please request a new one.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match. Please re-enter them.')
      return
    }
    setSubmitting(true)
    try {
      const data = await resetPassword(resetToken, form.password)
      setNotice(data?.message || 'Password updated. Please sign in.')
      setForm((f) => ({ ...f, password: '', confirm: '' }))
    } catch (err) {
      setError(err?.message || 'Could not reset your password.')
    } finally {
      setSubmitting(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

    // Sheria za nenosiri ni za register tu (watumiaji wa zamani waweze kuingia)
    if (mode === 'register') {
      if (form.password !== form.confirm) {
        setError('Passwords do not match. Please re-enter them.')
        return
      }

      if (
        form.password.length < 8 ||
        !/[A-Za-z]/.test(form.password) ||
        !/\d/.test(form.password)
      ) {
        setError('Password must be at least 8 characters and include a letter and a number.')
        return
      }
    }

    setSubmitting(true)

    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const email = form.email.trim()
    let registered = false

    try {
      if (mode === 'register') {
        const fullName = `${firstName} ${lastName}`.trim()

        // 1. Fungua akaunti kwenye backend
        await register({ name: fullName, email, password: form.password })
        registered = true

        // 2. Ingia ili kupata token
        await login({ email, password: form.password })

        sessionStorage.setItem('agrisense_new_user', '1')

        // Kurasa zingine (mf. Profile) bado zinasoma localStorage.
        // Nenosiri HALIHIFADHIWI hapa.
        const accountName = firstName || email.split('@')[0] || 'User'

        localStorage.setItem(
          'agrisense-user',
          JSON.stringify({
            name: accountName,
            fullName,
            firstName,
            lastName,
            email: email.toLowerCase(),
            provider: 'password',
          })
        )
        localStorage.setItem('agrisense-user-name', accountName)
      } else {
        await login({ email, password: form.password })
        sessionStorage.removeItem('agrisense_new_user')
      }

      navigate('/dashboard')
    } catch (err) {
      if (registered) {
        // Akaunti imeundwa, kwa hiyo mpeleke kwenye login
        setMode('login')
        setForm((f) => ({ ...f, password: '', confirm: '' }))
        setError('Account created, but automatic sign-in failed. Please log in.')
      } else {
        setError(err?.message || t('somethingWentWrong'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError('')
      setGoogleLoading(true)

      const { isNewUser, firebaseUser: user } = await loginWithGoogle()

      const googleFullName = user.displayName || ''

      const googleFirstName =
        googleFullName.trim().split(/\s+/)[0] ||
        user.email?.split('@')[0] ||
        'User'

      const googleUser = {
        uid: user.uid,
        name: googleFirstName,
        fullName: googleFullName,
        firstName: googleFirstName,
        email: user.email || '',
        photo: user.photoURL || '',
        emailVerified: Boolean(user.emailVerified),
        provider: 'google.com',
      }

      localStorage.setItem('agrisense-auth', 'true')
      localStorage.setItem('agrisense-user', JSON.stringify(googleUser))
      localStorage.setItem('agrisense-google-user', JSON.stringify(googleUser))
      localStorage.setItem('agrisense-user-name', googleFirstName)

      if (isNewUser) sessionStorage.setItem('agrisense_new_user', '1')
      else sessionStorage.removeItem('agrisense_new_user')

      navigate('/dashboard')
    } catch (err) {
      console.error('Google Sign-In Error:', err)

      let message =
        err?.message || 'Unable to sign in with Google. Please try again.'

      switch (err?.code) {
        case 'auth/popup-closed-by-user':
          message =
            'Google sign-in was cancelled. Please choose a Google account to continue.'
          break

        case 'auth/popup-blocked':
          message =
            'Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.'
          break

        case 'auth/cancelled-popup-request':
          message =
            'Another Google sign-in request is already open. Please complete it first.'
          break

        case 'auth/account-exists-with-different-credential':
          message =
            'An account already exists with this email using a different sign-in method.'
          break

        case 'auth/unauthorized-domain':
          message =
            'This website domain is not authorized for Google authentication in Firebase.'
          break

        case 'auth/operation-not-allowed':
          message = 'Google Sign-In is not enabled in Firebase Authentication.'
          break

        case 'auth/network-request-failed':
          message =
            'Network error. Please check your internet connection and try again.'
          break

        default:
          break
      }

      setError(message)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <main className="neu-surface relative min-h-[calc(100vh-72px)] overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-136px)] max-w-6xl items-center justify-center">
        <div className="neu-raised grid w-full overflow-hidden rounded-[32px] lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT BRAND PANEL */}
          <section className="relative hidden flex-col justify-between p-10 lg:flex lg:min-h-[720px] xl:p-14">
            <div>
              <div className="flex items-center gap-3">
                <div className="neu-raised-sm grid h-12 w-12 place-items-center rounded-2xl text-[color:var(--neu-accent)]">
                  <Leaf className="h-6 w-6" />
                </div>

                <div>
                  <div className="text-lg font-extrabold tracking-tight text-[color:var(--neu-text)]">
                    AgriSense AI
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--neu-muted)]">
                    Precision Agriculture
                  </div>
                </div>
              </div>

              <div className="mt-24 max-w-md">
                <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-[color:var(--neu-text)] xl:text-6xl">
                  Grow smarter.
                  <br />
                  <span className="text-[color:var(--neu-accent)]">
                    Farm better.
                  </span>
                </h1>

                <p className="mt-7 max-w-sm text-sm leading-7 text-[color:var(--neu-muted)]">
                  Make better farming decisions with intelligent soil insights, weather intelligence, crop recommendations and AI-powered agricultural guidance.
                </p>

                <div className="mt-9 space-y-4">
                  {[
                    'Smart farm monitoring',
                    'AI-powered recommendations',
                    'Data-driven agriculture',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="neu-raised-sm grid h-9 w-9 place-items-center rounded-xl text-[color:var(--neu-accent)]">
                        <CheckCircle2 size={17} />
                      </div>

                      <span className="text-sm text-[color:var(--neu-text)]">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 text-[color:var(--neu-muted)]">
              <p className="text-xs">{t('smartFarming')}</p>

              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck size={14} />
                Secure access
              </div>
            </div>
          </section>

          {/* RIGHT AUTH PANEL */}
          <section className="relative flex min-h-[680px] flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-14">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="neu-raised-sm grid h-11 w-11 place-items-center rounded-2xl text-[color:var(--neu-accent)]">
                <Leaf size={22} />
              </div>

              <div>
                <div className="font-extrabold text-[color:var(--neu-text)]">
                  AgriSense AI
                </div>

                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--neu-muted)]">
                  Precision Agriculture
                </div>
              </div>
            </div>

            {!recovery && (
              <div className="neu-inset mb-8 rounded-2xl p-1.5">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                      mode === 'login'
                        ? 'neu-tab-active'
                        : 'text-[color:var(--neu-muted)] hover:text-[color:var(--neu-text)]'
                    }`}
                  >
                    {t('login')}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                      mode === 'register'
                        ? 'neu-tab-active'
                        : 'text-[color:var(--neu-muted)] hover:text-[color:var(--neu-text)]'
                    }`}
                  >
                    {t('create')}
                  </button>
                </div>
              </div>
            )}

            <div className="mb-7">
              <div className="neu-raised-sm mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--neu-accent)]">
                {recovery ? (
                  <Mail size={19} />
                ) : mode === 'login' ? (
                  <Leaf size={19} />
                ) : (
                  <UserRound size={19} />
                )}
              </div>

              <h2 className="text-3xl font-black tracking-tight text-[color:var(--neu-text)] sm:text-4xl">
                {recovery
                  ? t('forgot')
                  : mode === 'login'
                    ? t('welcome')
                    : t('createYourAccount')}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[color:var(--neu-muted)]">
                {recovery
                  ? t('forgotDesc')
                  : mode === 'login'
                    ? t('continueDashboard')
                    : t('startProfile')}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="neu-inset mb-5 flex gap-3 rounded-2xl p-4 text-red-600 dark:text-red-300"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <p className="text-sm leading-6">{error}</p>
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="neu-inset mb-5 flex gap-3 rounded-2xl p-4 text-[color:var(--neu-accent-dark)]"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm leading-6">{notice}</p>
              </div>
            )}

            {resetToken ? (
              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div>
                  <label htmlFor="new-password" className={LABEL}>
                    {t('password')}
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                      size={18}
                    />
                    <input
                      id="new-password"
                      type="password"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={field('password')}
                      className={`${FIELD} pl-11`}
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[color:var(--neu-muted)]">
                    At least 8 characters, with a letter and a number.
                  </p>
                </div>

                <div>
                  <label htmlFor="new-confirm" className={LABEL}>
                    {t('confirmPassword')}
                  </label>
                  <input
                    id="new-confirm"
                    type="password"
                    required
                    minLength={8}
                    value={form.confirm}
                    onChange={field('confirm')}
                    className="neu-inset neu-pressable h-14 w-full rounded-2xl border-0 px-4 text-sm outline-none text-[color:var(--neu-text)]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="neu-raised-sm neu-pressable group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={17} className="animate-spin" /> : t('sendReset')}
                  {!submitting && <ArrowRight size={17} />}
                </button>

                <Link
                  to="/auth"
                  className="block text-center text-sm font-bold text-[color:var(--neu-accent-dark)] hover:underline"
                >
                  ← {t('backToLogin')}
                </Link>
              </form>
            ) : forgot ? (
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reset-email" className={LABEL}>
                    {t('email')}
                  </label>

                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                      size={18}
                    />

                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={field('email')}
                      className={FIELD}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="neu-raised-sm neu-pressable group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={17} className="animate-spin" /> : t('sendReset')}
                  {!submitting && (
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  )}
                </button>

                <Link
                  to="/auth"
                  className="block text-center text-sm font-bold text-[color:var(--neu-accent-dark)] hover:underline"
                >
                  ← {t('backToLogin')}
                </Link>
              </form>
            ) : (
              <>
                <form onSubmit={submit} className="space-y-4">
                  {mode === 'register' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className={LABEL}>
                          {t('firstName')}
                        </label>

                        <div className="relative">
                          <UserRound
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                            size={17}
                          />

                          <input
                            id="firstName"
                            required
                            value={form.firstName}
                            onChange={field('firstName')}
                            className={FIELD}
                            placeholder={t('firstName')}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="lastName" className={LABEL}>
                          {t('lastName')}
                        </label>

                        <input
                          id="lastName"
                          required
                          value={form.lastName}
                          onChange={field('lastName')}
                          className="neu-inset neu-pressable h-14 w-full rounded-2xl border-0 px-4 text-sm font-medium outline-none text-[color:var(--neu-text)] placeholder:text-[color:var(--neu-muted)]"
                          placeholder={t('lastName')}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className={LABEL}>
                      {t('email')}
                    </label>

                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                        size={18}
                      />

                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={field('email')}
                        className={FIELD}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]"
                      >
                        {t('password')}
                      </label>

                      {mode === 'login' && (
                        <Link
                          to="/auth?forgot=true"
                          className="text-xs font-bold text-[color:var(--neu-accent-dark)] hover:underline"
                        >
                          {t('forgot')}
                        </Link>
                      )}
                    </div>

                    <div className="relative">
                      <LockKeyhole
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                        size={18}
                      />

                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={mode === 'register' ? 8 : undefined}
                        value={form.password}
                        onChange={field('password')}
                        className={`${FIELD} pr-12`}
                        placeholder="••••••••"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)] hover:text-[color:var(--neu-accent-dark)]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {mode === 'register' && (
                      <p className="mt-2 text-[11px] text-[color:var(--neu-muted)]">
                        At least 8 characters, with a letter and a number.
                      </p>
                    )}
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label htmlFor="confirm" className={LABEL}>
                        {t('confirmPassword')}
                      </label>

                      <div className="relative">
                        <LockKeyhole
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]"
                          size={18}
                        />

                        <input
                          id="confirm"
                          type={showConfirm ? 'text' : 'password'}
                          required
                          minLength={8}
                          value={form.confirm}
                          onChange={field('confirm')}
                          className={`${FIELD} pr-12`}
                          placeholder="••••••••"
                        />

                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)] hover:text-[color:var(--neu-accent-dark)]"
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === 'register' && (
                    <label className="flex gap-3 pt-1 text-xs leading-5 text-[color:var(--neu-muted)]">
                      <input
                        required
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-0 accent-[color:var(--neu-accent)]"
                      />

                      <span>
                        {t('agree')}{' '}
                        <Link
                          to="/contact"
                          className="font-bold text-[color:var(--neu-accent-dark)] hover:underline"
                        >
                          {t('privacyPolicy')}
                        </Link>
                        .
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="neu-raised-sm neu-pressable group mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : mode === 'login' ? (
                      t('access')
                    ) : (
                      t('create')
                    )}

                    {!submitting && (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[color:var(--neu-dark)]" />

                  <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--neu-muted)]">
                    {t('or')}
                  </span>

                  <span className="h-px flex-1 bg-[color:var(--neu-dark)]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="neu-raised-sm neu-pressable flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-sm font-bold text-[color:var(--neu-text)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      <span>{t('loading')}</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>{t('google')}</span>
                    </>
                  )}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[color:var(--neu-muted)]">
                  <ShieldCheck size={14} />
                  Secure authentication
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-[color:var(--neu-muted)]">
                  {t('byContinuing')} {t('terms')}
                </p>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default Auth