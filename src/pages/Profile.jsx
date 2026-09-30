import React, { useState } from 'react'
import { Camera, Mail, UserRound } from 'lucide-react'
import { useLanguage } from '../i18n'
import { useAuth } from '../context/AuthContext' // CHANGED

export function Profile() {
  const { t } = useLanguage()
  const { user } = useAuth() // CHANGED: real logged-in user
  const [img, setImg] = useState(null)

  // CHANGED: backend stores one "name", the form shows two fields.
  // "John Peter Doe" -> first: "John", last: "Peter Doe"
  const [firstName = '', ...rest] = (user?.name || '').split(' ')
  const lastName = rest.join(' ')

  const upload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) {
      alert('Profile picture must be 5 MB or smaller.')
      return
    }
    setImg(URL.createObjectURL(f))
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-7 sm:px-8">
      <p className="section-kicker">{t('account')}</p>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t('profile')}</h1>

      <section className="card mt-8 p-6 sm:p-7">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative">
            <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-mint text-leaf">
              {img ? (
                <img src={img} className="h-full w-full object-cover" alt="Profile preview" />
              ) : (
                <UserRound size={42} />
              )}
            </div>
            <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-forest text-white">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={upload} className="hidden" />
            </label>
          </div>

          <div>
            <h2 className="text-xl font-extrabold">{user?.name || t('farmerProfile')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('uploadPhoto')}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">{t('firstName')}</label>
            <input className="input" value={firstName} readOnly />
          </div>

          <div>
            <label className="label">{t('lastName')}</label>
            <input className="input" value={lastName} readOnly />
          </div>

          <div className="sm:col-span-2">
            <label className="label">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={17} />
              <input className="input pl-10" value={user?.email || ''} readOnly />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}