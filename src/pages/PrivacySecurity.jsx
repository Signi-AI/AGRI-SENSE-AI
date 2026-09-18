import React from 'react'
import { CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, UserRound, Database } from 'lucide-react'
import { useLanguage } from '../i18n'

export function PrivacySecurity(){
  const {t}=useLanguage()
  const items=[[KeyRound,t('twoFactor'),'Protect sign-in with an additional verification step.'],[UserRound,t('sessionManagement'),'Review and control active account sessions.'],[Database,t('dataPrivacy'),'Control what farm information is shared with connected services.'],[ShieldCheck,t('privacyTitle'),'Privacy controls should be defined before production deployment.']]
  return <main className="mx-auto max-w-4xl px-4 py-7 sm:px-8">
    <p className="section-kicker">{t('privacy')}</p><h1 className="text-3xl font-extrabold sm:text-4xl">{t('privacyPageTitle')}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{t('privacyPageDesc')}</p>
    <div className="mt-8 space-y-4">{items.map(([Icon,title,desc])=><section className="card flex gap-4 p-5" key={title}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint text-leaf dark:bg-green-950/40"><Icon size={19}/></span><div><h2 className="font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></div><CheckCircle2 className="ml-auto shrink-0 text-leaf" size={18}/></section>)}</div>
    <section className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/20"><div className="flex gap-3"><LockKeyhole className="shrink-0 text-amber-600"/><div><h2 className="font-extrabold">{t('privacyTitle')}</h2><p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t('privacyText')}</p></div></div></section>
  </main>
}
