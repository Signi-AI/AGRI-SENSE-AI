import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  Facebook,
  Instagram,
  Leaf,
  Mail,
  Phone,
  PlayCircle,
  Sprout,
  Tractor,
  Twitter,
  Wheat,
  Youtube,
  ShieldCheck,
  Cpu,
  MessageCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { heroImages, contact } from '../data'
import { Logo } from '../components/layout'
import ThemeSelector from '../components/ThemeSelector'
import { useLanguage } from '../i18n'

export function Home({ theme, setTheme }) {
  const [index, setIndex] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((v) => (v + 1) % heroImages.length)
    }, 3000)

    return () => clearInterval(id)
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === index
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#062414]/85 via-[#0b3b20]/65 to-[#0b3b20]/20" />

        {/* THEME SELECTOR */}
        <div className="absolute right-4 top-4 z-50 sm:right-6 sm:top-6">
          <ThemeSelector
            theme={theme}
            setTheme={setTheme}
          />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-5 py-20 sm:px-8">
          <div className="max-w-3xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
              <Leaf size={15} />
              AI-powered precision agriculture
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {t('heroTitle')}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
              {t('heroDesc')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/auth"
                className="btn bg-white text-forest hover:bg-green-50"
              >
                {t('getStarted')}
                <ArrowRight size={18} />
              </Link>

              <a
                href="#solution"
                className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <PlayCircle size={18} />
                {t('watch')}
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-6">
              <div>
                <strong className="text-2xl sm:text-3xl">
                  +80%
                </strong>

                <p className="mt-1 text-xs text-green-100/70">
                  Health visibility
                </p>
              </div>

              <div>
                <strong className="text-2xl sm:text-3xl">
                  +60%
                </strong>

                <p className="mt-1 text-xs text-green-100/70">
                  Better decisions
                </p>
              </div>

              <div>
                <strong className="text-2xl sm:text-3xl">
                  100%
                </strong>

                <p className="mt-1 text-xs text-green-100/70">
                  Traceable workflow
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="section-space"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-kicker">
              {t('about')}
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t('aboutTitle')}
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-500">
              {t('aboutText')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <Sprout className="text-leaf" />

              <h3 className="mt-5 font-extrabold">
                {t('offer')}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                AI-powered farm intelligence and recommendations.
              </p>
            </div>

            <div className="card p-6">
              <Cpu className="text-leaf" />

              <h3 className="mt-5 font-extrabold">
                {t('serve')}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Farmers, cooperatives and agriculture teams.
              </p>
            </div>

            <div className="card p-6 sm:col-span-2">
              <ShieldCheck className="text-leaf" />

              <h3 className="mt-5 font-extrabold">
                {t('solution')}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A clear workflow for sensor readings, AI analysis and practical farm action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section
        id="solution"
        className="section-space bg-slate-50 dark:bg-[#0e1c13]"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="section-kicker">
              {t('solution')}
            </p>

            <h2 className="text-4xl font-extrabold">
              {t('solutionTitle')}
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              {t('solutionText')}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              [Tractor, 'Multi-sensor IoT'],
              [Wheat, 'Soil intelligence'],
              [Cpu, 'AI analysis'],
              [Leaf, 'Farm action'],
            ].map(([I, label], i) => (
              <div
                key={label}
                className="card p-5"
              >
                <div className="flex items-center justify-between">
                  <I className="text-leaf" />

                  <span className="text-xs font-black text-slate-300">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-8 font-extrabold">
                  {label}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {
                    [
                      'Collect readings',
                      'Understand soil',
                      'Generate insights',
                      'Act with confidence',
                    ][i]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section-space">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="section-kicker">
            {t('impact')}
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              [
                Sprout,
                t('productivity'),
                t('productivityText'),
              ],
              [
                Leaf,
                t('sustainability'),
                t('sustainabilityText'),
              ],
              [
                Wheat,
                t('food'),
                t('foodText'),
              ],
            ].map(([I, title, desc]) => (
              <div
                key={title}
                className="card p-7"
              >
                <I className="text-leaf" />

                <h3 className="mt-6 text-xl font-extrabold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-lime-300">
              {t('ready')}
            </p>

            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              {t('readyTitle')}
            </h2>
          </div>

          <Link
            to="/auth"
            className="btn bg-white text-forest"
          >
            {t('create')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer
        id="contact"
        className="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-slate-950"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-3">
          <div>
            <Logo />

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              AI-powered precision agriculture and soil health monitoring.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
              {t('contact')}
            </p>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-leaf"
              >
                <Mail size={16} />
                {contact.email}
              </a>

              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 hover:text-leaf"
              >
                <Phone size={16} />
                {contact.phone}
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Social
            </p>

            <div className="flex gap-2">
              <a
                href={contact.youtube}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border p-3 hover:bg-slate-50 dark:border-white/10"
              >
                <Youtube size={18} />
              </a>

              <a
                href={contact.facebook}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border p-3 hover:bg-slate-50 dark:border-white/10"
              >
                <Facebook size={18} />
              </a>

              <a
                href={contact.twitter}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border p-3 hover:bg-slate-50 dark:border-white/10"
              >
                <Twitter size={18} />
              </a>

              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border p-3 hover:bg-slate-50 dark:border-white/10"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 px-5 pt-6 text-xs text-slate-400 dark:border-white/10 sm:px-8">
          © {new Date().getFullYear()} AgriSense AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}