import React, { useState } from 'react'
import { Camera, Mail, Save, UserRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '../i18n'
import { useAuth } from '../context/AuthContext'
import { getCurrentUser, saveUserName, ensureLocalUser } from './Auth.jsx'

const LABEL = 'mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]'
const FIELD =
  'neu-inset neu-pressable h-12 w-full rounded-xl border-0 px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none'

export function Profile() {
  const { t } = useLanguage()
  const { user, updateProfile } = useAuth()

  // Watumiaji wa Google hawana akaunti ya backend, kwa hiyo wanahifadhi ndani ya browser tu
  const isBackendUser = !!user && user.provider !== 'google'

  // Data halisi ya mtumiaji (si ya bandia)
  const [current] = useState(() => ensureLocalUser(user))
  const photoKey = `agrisense-photo-${current?.email || 'guest'}`

  const [firstName, setFirstName] = useState(current?.firstName || current?.name || '')
  const [lastName, setLastName] = useState(
    current?.lastName || (current?.fullName || '').split(/\s+/).slice(1).join(' ')
  )
  const email = current?.email || ''

  const [img, setImg] = useState(() => {
    try {
      return localStorage.getItem(photoKey) || current?.photo || null
    } catch {
      return current?.photo || null
    }
  })
  const [photoChanged, setPhotoChanged] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const upload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return

    setError('')

    if (f.size > 5 * 1024 * 1024) {
      setError(t('photoTooLarge'))
      return
    }

    // Data URL inabaki baada ya kurefresh (blob URL inapotea)
    const reader = new FileReader()
    reader.onload = () => {
      setImg(String(reader.result))
      setPhotoChanged(true)
      setSaved(false)
    }
    reader.readAsDataURL(f)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')

    const first = firstName.trim()
    const last = lastName.trim()
    const fullName = `${first} ${last}`.trim()

    if (!first) return

    if (fullName.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }

    setSaving(true)

    try {
      // 1. Hifadhi jina kwenye backend kwanza (kwa akaunti ya email/password)
      if (isBackendUser) {
        await updateProfile({ name: fullName })
      }

      // 2. Hifadhi picha ndani ya browser
      if (photoChanged && img) {
        try {
          localStorage.setItem(photoKey, img)
        } catch {
          // Hifadhi ya browser imejaa: picha kubwa haikuingia
          setError(t('photoStorageFull'))
          return
        }
      }

      // 3. Sasisha rekodi ya ndani ambayo kurasa zingine zinasoma
      saveUserName(first)

      const cu = getCurrentUser()
      if (cu) {
        localStorage.setItem(
          'agrisense-user',
          JSON.stringify({ ...cu, firstName: first, lastName: last, fullName })
        )
      }

      window.dispatchEvent(new CustomEvent('agrisense-user-updated'))

      setPhotoChanged(false)
      setSaved(true)
    } catch (err) {
      setError(err?.message || 'Could not save your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="neu-surface mx-auto max-w-3xl px-4 py-7 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('account')}</p>
      <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">{t('profile')}</h1>

      <form onSubmit={handleSave} className="neu-raised mt-8 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative">
            <div className="neu-inset grid h-28 w-28 place-items-center overflow-hidden rounded-full text-[color:var(--neu-accent)]">
              {img ? (
                <img src={img} className="h-full w-full object-cover" alt="" />
              ) : (
                <UserRound size={42} />
              )}
            </div>

            <label className="neu-raised-sm neu-pressable absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-[color:var(--neu-accent-dark)]">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={upload} className="hidden" />
            </label>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-[color:var(--neu-text)]">{t('farmerProfile')}</h2>
            <p className="mt-1 text-sm text-[color:var(--neu-muted)]">{t('uploadPhoto')}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className={LABEL}>{t('firstName')}</label>
            <input
              id="first-name"
              required
              maxLength={40}
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setSaved(false) }}
              className={FIELD}
            />
          </div>

          <div>
            <label htmlFor="last-name" className={LABEL}>{t('lastName')}</label>
            <input
              id="last-name"
              maxLength={40}
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setSaved(false) }}
              className={FIELD}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profile-email" className={LABEL}>{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]" size={17} />
              <input
                id="profile-email"
                readOnly
                value={email}
                className={`${FIELD} pl-11 opacity-70`}
              />
            </div>
            <p className="mt-2 text-xs text-[color:var(--neu-muted)]">{t('emailReadonly')}</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="neu-inset mt-5 flex gap-3 rounded-2xl p-4 text-red-600 dark:text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm leading-6">{error}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!firstName.trim() || saving}
            className="neu-raised-sm neu-pressable flex items-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {t('saveProfile')}
          </button>

          {saved && (
            <p role="status" className="flex items-center gap-2 text-sm font-bold text-[color:var(--neu-accent-dark)]">
              <CheckCircle2 size={17} />
              {t('saved')}
            </p>
          )}
        </div>
      </form>
    </main>
  )
}

export default Profile