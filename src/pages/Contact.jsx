import React, { useState } from 'react'
import { Facebook, Mail, Phone, Youtube, MessageCircle, Send, Twitter, Instagram, LockKeyhole } from 'lucide-react'
import { contact } from '../data'
import { useLanguage } from '../i18n'
import './Auth.jsx'

const TEXT = {
  EN: {
    call: 'Call',
    profile: 'Official profile',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    note: 'Your email app will open with your message ready to send.',
    subject: 'Message from',
  },
  SW: {
    call: 'Piga simu',
    profile: 'Wasifu rasmi',
    name: 'Jina',
    email: 'Barua pepe',
    message: 'Ujumbe',
    note: 'App yako ya barua pepe itafunguka ikiwa na ujumbe wako tayari kutumwa.',
    subject: 'Ujumbe kutoka kwa',
  },
}

const INPUT =
  'neu-inset w-full rounded-2xl border-0 bg-transparent px-4 text-sm font-medium text-[color:var(--neu-text)] outline-none placeholder:text-[color:var(--neu-muted)]'
const LABEL =
  'mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]'

export function Contact() {
  const { t, lang } = useLanguage()
  const c = TEXT[String(lang).toUpperCase() === 'SW' ? 'SW' : 'EN']

  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const field = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()

    const subject = `${c.subject} ${form.name}`
    const body = `${form.message}\n\n— ${form.name} (${form.email})`

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  const links = [
    ['Email', contact.email, Mail, `mailto:${contact.email}`],
    ['WhatsApp', t('chatWhatsapp'), MessageCircle, contact.whatsapp],
    [c.call, contact.phone, Phone, `tel:${contact.phone}`],
    ['YouTube', t('officialChannel'), Youtube, contact.youtube],
    ['Facebook', t('officialPage'), Facebook, contact.facebook],
    ['Twitter', c.profile, Twitter, contact.twitter],
    ['Instagram', c.profile, Instagram, contact.instagram],
  ]

  return (
    <main className="neu-surface mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
          {t('contact')}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--neu-text)] sm:text-5xl">
          {t('contactTitle')}
        </h1>
        <p className="mt-5 leading-8 text-[color:var(--neu-muted)]">{t('contactDesc')}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        {/* Contact links */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {links.map(([title, sub, Icon, href]) => (
            <a
              key={title}
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="neu-raised neu-pressable flex items-center gap-4 rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <span className="neu-inset grid h-12 w-12 shrink-0 place-items-center rounded-full text-[color:var(--neu-accent)]">
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <h2 className="font-extrabold text-[color:var(--neu-text)]">{title}</h2>
                <p className="mt-1 break-words text-sm text-[color:var(--neu-muted)]">{sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="neu-raised rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
            {t('sendMessage')}
          </p>
          <h2 className="text-2xl font-extrabold text-[color:var(--neu-text)]">{t('helpTitle')}</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className={LABEL}>{c.name}</label>
              <input
                id="contact-name"
                required
                value={form.name}
                onChange={field('name')}
                className={`${INPUT} h-14`}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className={LABEL}>{c.email}</label>
              <input
                id="contact-email"
                required
                type="email"
                value={form.email}
                onChange={field('email')}
                className={`${INPUT} h-14`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className={LABEL}>{c.message}</label>
              <textarea
                id="contact-message"
                required
                rows="6"
                value={form.message}
                onChange={field('message')}
                className={`${INPUT} resize-none py-4`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="neu-raised-sm neu-pressable mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-7 text-sm font-bold text-white"
          >
            {sent ? t('messageReady') : t('sendMessage')}
            <Send size={17} />
          </button>

          <p className="mt-4 text-xs text-[color:var(--neu-muted)]">{c.note}</p>
        </form>
      </div>

      {/* Privacy notice */}
      <section className="neu-raised mt-10 rounded-3xl p-6">
        <div className="flex gap-3">
          <span className="neu-inset grid h-11 w-11 shrink-0 place-items-center rounded-xl text-amber-500">
            <LockKeyhole size={19} />
          </span>

          <div>
            <h2 className="font-extrabold text-[color:var(--neu-text)]">{t('privacyTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--neu-muted)]">
              {t('privacyText')}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact