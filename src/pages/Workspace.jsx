import React from 'react'
import { BriefcaseBusiness, Bell, Database, FileText, Settings, ShieldCheck, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

export function Workspace(){
  const {t}=useLanguage()
  const cards=[
    [Sprout,t('farms'),'Manage farms and farm profiles.','/farms'],
    [Database,t('intelligence'),'Keep your monitoring workflow ready for sensor data.','/soil-health'],
    [FileText,t('updates'),'Review recommendations and system updates.','/notifications'],
    [Bell,t('notifications'),'Control important farm alerts.','/notifications']
  ]
  return <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">
    <p className="section-kicker">{t('workspace')}</p>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-3xl font-extrabold sm:text-4xl">{t('workspaceTitle')}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{t('workspaceDesc')}</p></div>
      <Link to="/settings" className="btn-primary shrink-0"><Settings size={17}/>{t('settings')}</Link>
    </div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([Icon,title,desc,to])=><Link to={to} key={title} className="card p-5 transition hover:-translate-y-0.5 hover:border-leaf/40"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-leaf dark:bg-green-950/40"><Icon size={19}/></span><h2 className="mt-5 font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-leaf">Open →</span></Link>)}</div>
    <section className="card mt-5 p-6"><div className="flex gap-3"><ShieldCheck className="shrink-0 text-leaf"/><div><h2 className="font-extrabold">{t('workspaceSettings')}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{t('workspaceSettingsDesc')}</p><div className="mt-5 flex flex-wrap gap-3"><Link to="/settings" className="btn-primary">{t('settings')}</Link><Link to="/privacy-security" className="btn border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">{t('privacy')}</Link></div></div></div></section>
  </main>
}
