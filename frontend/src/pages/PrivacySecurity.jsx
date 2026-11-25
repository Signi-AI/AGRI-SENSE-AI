import React from 'react'
import {
  CheckCircle2,
  Database,
  Globe2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
} from 'lucide-react'
import { useLanguage } from '../i18n'
import './Auth.jsx'

/* =====================================================================
   CONTENT (Kiswahili + English)
===================================================================== */
const EN = {
  pageTitle: 'Privacy & Security',
  pageDesc:
    'Learn how AgriSense AI handles your information, how we protect your account, and the controls you have over your data.',
  sections: [
    {
      icon: Database,
      title: 'Information we handle',
      intro: 'AgriSense AI only works with the information needed to give you farming insights.',
      items: [
        ['Account details', 'Your name and email address, and your profile photo if you sign in with Google.'],
        ['Farm information', 'Farm profiles and soil details you enter, such as soil type and soil texture.'],
        ['Location', 'Your device location, only when you allow it, so we can show weather for your area.'],
        ['AI questions', 'The questions you ask the AI Advisor, so it can prepare an answer for you.'],
        ['Voice input', 'If you use the microphone, your browser turns speech into text. AgriSense AI does not record or save your audio.'],
      ],
    },
    {
      icon: Sprout,
      title: 'How we use your information',
      items: [
        ['Soil and crop guidance', 'To give soil health insights and crop recommendations for your farm.'],
        ['Weather', 'To show current weather and alerts for your location.'],
        ['AI Advisor', 'To answer your questions about crops, soil, weather and farming practices.'],
        ['Staying signed in', 'To keep you signed in on this device until you log out.'],
      ],
    },
    {
      icon: Globe2,
      title: 'Services that help us run AgriSense AI',
      items: [
        ['Firebase Authentication (Google)', 'Handles Google Sign-In. Your Google password is never shared with AgriSense AI.'],
        ['AgriSense AI server', 'Your coordinates and AI questions are sent to our server so it can return weather and answers for you.'],
        ['Browser speech service', 'Speech-to-text is handled by your browser and follows your browser vendor\'s own privacy policy.'],
      ],
    },
    {
      icon: SlidersHorizontal,
      title: 'Your controls',
      items: [
        ['Log out', 'You can log out at any time from Settings to end your session on this device.'],
        ['Location and microphone', 'You can deny or turn off these permissions anytime in your browser\'s site settings.'],
        ['AI chat messages', 'Delete any message with the trash icon. Chat messages are also cleared when you refresh the page.'],
        ['Saved data on this device', 'Clear your browser\'s site data to remove sign-in details saved on this device.'],
      ],
    },
  ],
  securityTitle: 'How we protect your account',
  securityIntro: 'The protections that keep your account and information safe.',
  security: [
    [ShieldCheck, 'Google Sign-In with Firebase', 'Google account sign-in is handled by Firebase Authentication, so your Google password is never shared with AgriSense AI.'],
    [LockKeyhole, 'Session on your device', 'You stay signed in on this device until you log out. Logging out ends your session.'],
    [MapPin, 'Permission-based access', 'Location and microphone are used only after you allow them in your browser, and you can turn them off at any time.'],
  ],
}

const SW = {
  pageTitle: 'Faragha na Usalama',
  pageDesc:
    'Jifunze jinsi AgriSense AI inavyoshughulikia taarifa zako, inavyolinda akaunti yako, na udhibiti ulio nao juu ya data yako.',
  sections: [
    {
      icon: Database,
      title: 'Taarifa tunazoshughulikia',
      intro: 'AgriSense AI hutumia taarifa zinazohitajika tu kukupa ushauri wa kilimo.',
      items: [
        ['Taarifa za akaunti', 'Jina lako na barua pepe, pamoja na picha ya wasifu ukiingia kwa Google.'],
        ['Taarifa za shamba', 'Wasifu wa mashamba na maelezo ya udongo unayoweka, kama aina na umbile la udongo.'],
        ['Eneo lako', 'Eneo la kifaa chako, pale unaporuhusu tu, ili tuonyeshe hali ya hewa ya eneo lako.'],
        ['Maswali ya AI', 'Maswali unayouliza AI Advisor, ili iandae jibu kwa ajili yako.'],
        ['Sauti', 'Ukitumia maikrofoni, browser yako hubadilisha sauti kuwa maandishi. AgriSense AI hairekodi wala kuhifadhi sauti yako.'],
      ],
    },
    {
      icon: Sprout,
      title: 'Jinsi tunavyotumia taarifa zako',
      items: [
        ['Ushauri wa udongo na mazao', 'Kukupa uchambuzi wa afya ya udongo na mapendekezo ya mazao kwa shamba lako.'],
        ['Hali ya hewa', 'Kuonyesha hali ya hewa ya sasa na tahadhari kwa eneo lako.'],
        ['AI Advisor', 'Kujibu maswali yako kuhusu mazao, udongo, hali ya hewa na mbinu za kilimo.'],
        ['Kubaki umeingia', 'Kukuweka umeingia kwenye kifaa hiki hadi utakapotoka.'],
      ],
    },
    {
      icon: Globe2,
      title: 'Huduma zinazotusaidia kuendesha AgriSense AI',
      items: [
        ['Firebase Authentication (Google)', 'Inashughulikia kuingia kwa Google. Nenosiri lako la Google halishirikiwi kamwe na AgriSense AI.'],
        ['Seva ya AgriSense AI', 'Viwianishi vya eneo lako na maswali yako ya AI hutumwa kwenye seva yetu ili irudishe hali ya hewa na majibu kwa ajili yako.'],
        ['Huduma ya sauti ya browser', 'Kubadilisha sauti kuwa maandishi kunafanywa na browser yako, na kunafuata sera ya faragha ya mtengenezaji wa browser.'],
      ],
    },
    {
      icon: SlidersHorizontal,
      title: 'Udhibiti wako',
      items: [
        ['Kutoka (Log out)', 'Unaweza kutoka wakati wowote kupitia Settings ili kumaliza kikao chako kwenye kifaa hiki.'],
        ['Eneo na maikrofoni', 'Unaweza kukataa au kuzima ruhusa hizi wakati wowote kwenye mipangilio ya tovuti ya browser yako.'],
        ['Ujumbe wa AI chat', 'Futa ujumbe wowote kwa alama ya pipa la taka. Ujumbe wa chat pia hufutika ukirefresh ukurasa.'],
        ['Data iliyohifadhiwa kwenye kifaa', 'Futa data ya tovuti kwenye browser yako ili kuondoa taarifa za kuingia zilizohifadhiwa kwenye kifaa hiki.'],
      ],
    },
  ],
  securityTitle: 'Jinsi tunavyolinda akaunti yako',
  securityIntro: 'Hatua za ulinzi zinazoweka akaunti na taarifa zako salama.',
  security: [
    [ShieldCheck, 'Kuingia kwa Google kupitia Firebase', 'Kuingia kwa akaunti ya Google kunashughulikiwa na Firebase Authentication, kwa hiyo nenosiri lako la Google halishirikiwi kamwe na AgriSense AI.'],
    [LockKeyhole, 'Kikao kwenye kifaa chako', 'Unabaki umeingia kwenye kifaa hiki hadi utakapotoka. Ukitoka, kikao chako kinaisha.'],
    [MapPin, 'Ufikiaji kwa ruhusa yako', 'Eneo na maikrofoni hutumika baada ya wewe kuruhusu kwenye browser yako, na unaweza kuvizima wakati wowote.'],
  ],
}

/* =====================================================================
   SMALL PARTS
===================================================================== */
function InfoCard({ icon: Icon, title, intro, items }) {
  return (
    <section className="neu-raised rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="neu-inset grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[color:var(--neu-accent)]">
          <Icon size={19} />
        </span>
        <h2 className="text-lg font-extrabold text-[color:var(--neu-text)]">{title}</h2>
      </div>

      {intro && (
        <p className="mt-3 text-sm leading-6 text-[color:var(--neu-muted)]">{intro}</p>
      )}

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(([label, text]) => (
          <li key={label} className="neu-inset rounded-2xl p-4">
            <p className="text-sm font-extrabold text-[color:var(--neu-text)]">{label}</p>
            <p className="mt-1.5 text-sm leading-6 text-[color:var(--neu-muted)]">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* =====================================================================
   PAGE
===================================================================== */
export function PrivacySecurity() {
  const { t, lang } = useLanguage()
  const c = String(lang).toUpperCase() === 'SW' ? SW : EN

  return (
    <main className="neu-surface mx-auto max-w-4xl px-4 py-7 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
        {t('privacy')}
      </p>

      <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
        {c.pageTitle}
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--neu-muted)]">
        {c.pageDesc}
      </p>

      <div className="mt-8 space-y-6">
        {c.sections.map((s) => (
          <InfoCard key={s.title} {...s} />
        ))}

        {/* Account protection */}
        <section className="neu-raised rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="neu-inset grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[color:var(--neu-accent)]">
              <ShieldCheck size={19} />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[color:var(--neu-text)]">{c.securityTitle}</h2>
              <p className="text-xs text-[color:var(--neu-muted)]">{c.securityIntro}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {c.security.map(([Icon, title, desc]) => (
              <div key={title} className="neu-inset flex items-start gap-4 rounded-2xl p-4">
                <Icon size={19} className="mt-0.5 shrink-0 text-[color:var(--neu-accent)]" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold text-[color:var(--neu-text)]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--neu-muted)]">{desc}</p>
                </div>
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[color:var(--neu-accent-dark)]" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Notice */}
      <section className="neu-raised mt-6 rounded-3xl p-6">
        <div className="flex gap-3">
          <span className="neu-inset grid h-11 w-11 shrink-0 place-items-center rounded-xl text-amber-500">
            <LockKeyhole size={19} />
          </span>

          <div>
            <h2 className="font-extrabold text-[color:var(--neu-text)]">{t('privacyTitle')}</h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--neu-muted)]">
              {t('privacyText')}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PrivacySecurity