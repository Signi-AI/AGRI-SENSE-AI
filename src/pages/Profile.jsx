import React, { useState } from 'react'
import { Camera, Mail, Save, UserRound } from 'lucide-react'
import { useLanguage } from '../i18n'
import './Auth.jsx'

export function Profile() {
  const { t } = useLanguage()
  const [img, setImg] = useState(null)
  const [saved, setSaved] = useState(false)

  const upload = e => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) {
      alert('Profile picture must be 5 MB or smaller.')
      return
    }
    setImg(URL.createObjectURL(f))
    setSaved(false)
  }

  return (
    <main className="neu-surface mx-auto max-w-3xl px-4 py-7 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('account')}</p>
      <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">{t('profile')}</h1>

      <section className="neu-raised mt-8 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative">
            <div className="neu-inset grid h-28 w-28 place-items-center overflow-hidden rounded-full text-[color:var(--neu-accent)]">
              {img ? (
                <img src={img} className="h-full w-full object-cover" alt="Profile preview" />
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
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('firstName')}</label>
            <input className="neu-inset neu-pressable h-12 w-full rounded-xl border-0 px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none" defaultValue="Farmer" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('lastName')}</label>
            <input className="neu-inset neu-pressable h-12 w-full rounded-xl border-0 px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none" defaultValue="User" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--neu-muted)]" size={17} />
              <input className="neu-inset neu-pressable h-12 w-full rounded-xl border-0 pl-11 pr-4 text-sm font-medium text-[color:var(--neu-text)] outline-none" defaultValue="farmer@example.com" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setSaved(true)}
          className="neu-raised-sm neu-pressable mt-6 flex items-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white"
        >
          <Save size={17} />
          {saved ? t('saved') : t('saveProfile')}
        </button>
      </section>
    </main>
  )
}

export default Profile