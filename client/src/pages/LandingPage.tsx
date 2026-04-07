import { Link } from 'react-router-dom'
import { Zap, Phone, Sparkles, Send, Star, Check, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { APP_NAME } from '@/lib/branding'

/* ------------------------------------------------------------------ */
/*  Navbar                                                              */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading text-lg font-bold text-navy">{APP_NAME}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#como-funciona" className="font-body text-sm text-gray-600 hover:text-navy transition-colors">
            Cómo Funciona
          </a>
          <a href="#precios" className="font-body text-sm text-gray-600 hover:text-navy transition-colors">
            Precios
          </a>
          <a href="#" className="font-body text-xs text-gray-400 hover:text-gray-600 transition-colors">
            English
          </a>
          <Link
            to="/signup"
            className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Empieza Gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          <a href="#como-funciona" className="font-body text-sm text-gray-700" onClick={() => setOpen(false)}>
            Cómo Funciona
          </a>
          <a href="#precios" className="font-body text-sm text-gray-700" onClick={() => setOpen(false)}>
            Precios
          </a>
          <a href="#" className="font-body text-xs text-gray-400">English</a>
          <Link
            to="/signup"
            className="rounded-lg bg-accent px-4 py-3 text-center font-body text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Empieza Gratis
          </Link>
        </div>
      )}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useScrollReveal()

  return (
    <section className="bg-navy text-white">
      <div ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
        {/* Copy */}
        <div className="fade-in-up">
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Manda propuestas profesionales en 60 segundos.
          </h1>
          <p className="mt-3 font-body text-lg text-white/50">
            Send professional proposals in 60 seconds.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="rounded-xl bg-accent px-8 py-4 font-heading text-base font-bold text-white hover:bg-accent/90 transition-colors text-center"
            >
              Empieza Gratis — Start Free
            </Link>
          </div>

          <p className="mt-4 font-body text-sm text-white/40">
            Sin tarjeta. Sin contratos.{' '}
            <span className="text-white/25">No card. No contracts.</span>
          </p>

          {/* Trust row */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                  alt="Contractor"
                  className="h-8 w-8 rounded-full border-2 border-navy object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-body text-xs text-white/60 mt-0.5">2,000+ contratistas</p>
            </div>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="fade-in-up mt-12 lg:mt-0 flex justify-center">
          <div className="relative w-56 sm:w-64">
            <div className="rounded-[2.5rem] border-4 border-white/20 bg-white/10 backdrop-blur shadow-2xl overflow-hidden aspect-[9/19]">
              <div className="h-full bg-white/5 p-4 flex flex-col gap-2">
                <div className="h-2 w-16 rounded bg-white/20" />
                <div className="flex-1 rounded-xl bg-white/10 p-3 flex flex-col gap-2">
                  <div className="h-3 w-3/4 rounded bg-white/30" />
                  <div className="h-2 w-full rounded bg-white/20" />
                  <div className="h-2 w-5/6 rounded bg-white/20" />
                  <div className="h-2 w-full rounded bg-white/20" />
                  <div className="h-2 w-2/3 rounded bg-white/20" />
                  <div className="mt-2 h-2 w-full rounded bg-white/20" />
                  <div className="h-2 w-4/5 rounded bg-white/20" />
                  <div className="mt-auto rounded-lg bg-accent py-2 text-center">
                    <div className="h-2 w-12 rounded bg-white/60 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-accent/20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: Phone,
    es: 'Describe el trabajo',
    en: 'Describe the job',
    detail: 'Escribe o habla en español. No importa la gramática.',
    detailEn: "Write or speak in Spanish. Grammar doesn't matter.",
  },
  {
    icon: Sparkles,
    es: 'Hecho AI escribe la propuesta',
    en: 'AI writes the proposal',
    detail: 'Propuesta profesional en inglés en 60 segundos.',
    detailEn: 'Professional proposal in English in 60 seconds.',
  },
  {
    icon: Send,
    es: 'Mándala al cliente',
    en: 'Send it to the client',
    detail: 'WhatsApp, email, o link directo.',
    detailEn: 'WhatsApp, email, or direct link.',
  },
]

function HowItWorks() {
  const ref = useScrollReveal()

  return (
    <section id="como-funciona" className="bg-[#f8f9fa] py-16 sm:py-24">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="fade-in-up text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
            Así funciona
          </h2>
          <p className="mt-2 font-body text-base text-gray-400">How it works</p>
        </div>

        <div className="stagger-children grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={i}
                className="fade-in-up card-hover rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div className="mb-1 font-mono text-xs font-bold text-accent/60 uppercase tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-heading text-lg font-bold text-navy">{step.es}</h3>
                <p className="font-body text-xs text-gray-400 mb-2">{step.en}</p>
                <p className="font-body text-sm text-gray-600">{step.detail}</p>
                <p className="font-body text-xs text-gray-400 mt-1">{step.detailEn}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Social Proof                                                        */
/* ------------------------------------------------------------------ */

function SocialProof() {
  const ref = useScrollReveal()

  return (
    <section className="bg-white py-16 sm:py-20">
      <div ref={ref} className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="fade-in-up rounded-2xl border border-gray-100 bg-[#f8f9fa] p-8 shadow-sm">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-accent text-accent" />
            ))}
          </div>
          <blockquote className="font-heading text-xl font-semibold text-navy leading-snug">
            "Gané un trabajo de $8,000 con mi primera propuesta."
          </blockquote>
          <p className="mt-2 font-body text-sm text-gray-400 italic">
            "I won an $8,000 job with my first proposal."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="Carlos R."
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="font-body text-sm font-semibold text-navy">Carlos R.</p>
              <p className="font-body text-xs text-gray-500">HVAC Contractor, Houston TX</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                             */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    name: 'Gratis',
    nameEn: 'Free',
    price: '$0',
    period: '',
    features: ['3 propuestas / mes', 'Marca de agua', 'Básico'],
    featuresEn: ['3 proposals / month', 'Watermark', 'Basic'],
    popular: false,
    cta: 'Empieza Gratis',
  },
  {
    name: 'Pro',
    nameEn: 'Pro',
    price: '$79',
    period: '/mes',
    features: [
      'Propuestas ilimitadas',
      'Sin marca de agua',
      'WhatsApp + email',
      'Español ↔ Inglés',
      'Firma electrónica',
    ],
    featuresEn: [
      'Unlimited proposals',
      'No watermark',
      'WhatsApp + email',
      'Spanish ↔ English',
      'E-signature',
    ],
    popular: true,
    cta: 'Empieza Gratis',
  },
  {
    name: 'Equipo',
    nameEn: 'Team',
    price: '$149',
    period: '/mes',
    features: ['5 usuarios', 'Todo en Pro', 'Gestión de cuadrilla'],
    featuresEn: ['5 users', 'Everything in Pro', 'Crew management'],
    popular: false,
    cta: 'Empieza Gratis',
  },
]

function Pricing() {
  const ref = useScrollReveal()

  return (
    <section id="precios" className="bg-[#f8f9fa] py-16 sm:py-24">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="fade-in-up text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">Precios</h2>
          <p className="mt-2 font-body text-base text-gray-400">Simple pricing</p>
        </div>

        <div className="stagger-children grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'fade-in-up card-hover relative rounded-2xl border p-6 flex flex-col',
                plan.popular
                  ? 'border-accent bg-navy text-white shadow-xl shadow-navy/30'
                  : 'border-gray-100 bg-white shadow-sm'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-3 py-1 font-body text-xs font-bold text-white">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className={cn('font-heading text-xl font-bold', plan.popular ? 'text-white' : 'text-navy')}>
                  {plan.name}
                </h3>
                <p className={cn('font-body text-xs', plan.popular ? 'text-white/50' : 'text-gray-400')}>
                  {plan.nameEn}
                </p>
              </div>

              <div className="mb-6">
                <span className={cn('font-heading text-4xl font-bold', plan.popular ? 'text-white' : 'text-navy')}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={cn('font-body text-sm', plan.popular ? 'text-white/60' : 'text-gray-400')}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className={cn('mt-0.5 h-4 w-4 shrink-0', plan.popular ? 'text-accent' : 'text-accent')} />
                    <div>
                      <span className={cn('font-body text-sm', plan.popular ? 'text-white' : 'text-gray-700')}>
                        {f}
                      </span>
                      <span className={cn('block font-body text-xs', plan.popular ? 'text-white/40' : 'text-gray-400')}>
                        {plan.featuresEn[i]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={cn(
                  'rounded-xl py-3 text-center font-heading text-sm font-bold transition-colors',
                  plan.popular
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-navy text-white hover:bg-navy/90'
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-body text-sm text-gray-400">
          Sin contratos. Cancela cuando quieras.{' '}
          <span className="text-gray-300">No contracts. Cancel anytime.</span>
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  const ref = useScrollReveal()

  return (
    <section className="bg-navy py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <div className="fade-in-up">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
            Tu trabajo habla por ti. Ahora tus propuestas también.
          </h2>
          <p className="mt-3 font-body text-base text-white/40">
            Your work speaks for itself. Now your proposals will too.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-block rounded-xl bg-accent px-10 py-4 font-heading text-base font-bold text-white hover:bg-accent/90 transition-colors"
          >
            Empieza Gratis — Start Free
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-heading text-base font-bold text-navy">{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-5">
          <a href="#precios" className="font-body text-sm text-gray-500 hover:text-navy transition-colors">
            Precios
          </a>
          <a href="#" className="font-body text-xs text-gray-400 hover:text-gray-600 transition-colors">
            English
          </a>
        </div>

        <p className="font-body text-xs text-gray-400">
          © 2026 Hecho AI. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}
