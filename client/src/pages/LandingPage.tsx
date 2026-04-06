import { Link } from 'react-router-dom'
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Leaf,
  Home,
  FileText,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Play,
  Shield,
  Clock,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Droplets,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/useScrollReveal'

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-lg shadow-orange-500/25">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold text-navy">
            ContractorOS
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="font-body text-sm font-medium text-gray-600 transition hover:text-navy">
            Features
          </a>
          <a href="#pricing" className="font-body text-sm font-medium text-gray-600 transition hover:text-navy">
            Pricing
          </a>
          <a href="#testimonials" className="font-body text-sm font-medium text-gray-600 transition hover:text-navy">
            Testimonials
          </a>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/sign-in" className="font-body text-sm font-medium text-gray-600 transition hover:text-navy">
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="btn-press inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6 text-navy" /> : <Menu className="h-6 w-6 text-navy" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" className="font-body text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#pricing" className="font-body text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Pricing</a>
            <a href="#testimonials" className="font-body text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Testimonials</a>
            <hr className="border-gray-200" />
            <Link to="/sign-in" className="font-body text-sm font-medium text-gray-700">Sign In</Link>
            <Link to="/sign-up" className="btn-press inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-heading text-sm font-semibold text-white">
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  const scrollRef = useScrollReveal()

  return (
    <section ref={scrollRef} className="relative overflow-hidden bg-navy">
      {/* Background photo overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80&auto=format"
          alt=""
          className="h-full w-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy */}
          <div className="stagger-children">
            <div className="fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-300">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Business Platform
            </div>

            <h1 className="fade-in-up font-heading text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              The Only Business Tool You&apos;ll{' '}
              <span className="gradient-text">Ever Need</span>
            </h1>

            <p className="fade-in-up mt-6 max-w-lg font-body text-lg leading-relaxed text-gray-300">
              Proposals, scheduling, invoicing, reviews, and follow-ups — all powered by AI.
              Built exclusively for trade contractors who want to grow.
            </p>

            <div className="fade-in-up mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/sign-up"
                className="btn-press inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-heading text-base font-semibold text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="btn-press inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 font-heading text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </a>
            </div>

            {/* Trust row */}
            <div className="fade-in-up mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[12, 22, 32, 44, 55].map((id) => (
                  <img
                    key={id}
                    src={`https://randomuser.me/api/portraits/men/${id}.jpg`}
                    alt="User"
                    className="h-9 w-9 rounded-full border-2 border-navy object-cover"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-white">2,000+</span> contractors already growing
              </div>
            </div>
          </div>

          {/* Right — hero visual (desktop) */}
          <div className="relative hidden lg:block">
            <div className="fade-in-up relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80&auto=format"
                alt="Contractor using ContractorOS"
                className="h-[520px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </div>

            {/* Floating card — proposal */}
            <div className="float-subtle absolute -left-8 top-16 z-10 glass rounded-xl px-5 py-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-white">Proposal Accepted!</p>
                  <p className="font-mono text-lg font-bold text-green-400">+$8,750</p>
                </div>
              </div>
            </div>

            {/* Floating card — review */}
            <div className="float-slow absolute -right-4 bottom-24 z-10 glass rounded-xl px-5 py-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                  <p className="font-heading text-sm font-bold text-white">New Review!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Social Proof Bar                                                   */
/* ------------------------------------------------------------------ */

function SocialProofBar() {
  const scrollRef = useScrollReveal()
  const trades = [
    { icon: Wrench, label: 'Plumbing' },
    { icon: Zap, label: 'Electrical' },
    { icon: Hammer, label: 'Carpentry' },
    { icon: Paintbrush, label: 'Painting' },
    { icon: Leaf, label: 'Landscaping' },
    { icon: Home, label: 'Roofing' },
    { icon: Droplets, label: 'HVAC' },
    { icon: Shield, label: 'General' },
  ]

  return (
    <section ref={scrollRef} className="relative overflow-hidden border-y border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="fade-in-up mb-8 text-center font-body text-sm font-medium uppercase tracking-widest text-gray-400">
          Trusted by 2,000+ contractors across every trade
        </p>
        {/* Marquee scroll */}
        <div className="relative">
          <div className="flex animate-[marquee_30s_linear_infinite] gap-12">
            {[...trades, ...trades].map((t, i) => {
              const Icon = t.icon
              return (
                <div key={i} className="flex shrink-0 items-center gap-2 text-gray-400">
                  <Icon className="h-5 w-5" />
                  <span className="font-heading text-sm font-semibold whitespace-nowrap">{t.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* Inline marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Video Section                                                      */
/* ------------------------------------------------------------------ */

function VideoSection() {
  const scrollRef = useScrollReveal()
  const [playing, setPlaying] = useState(false)

  return (
    <section ref={scrollRef} id="demo" className="bg-[#F8F9FA] py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="fade-in-up font-heading text-3xl font-extrabold text-navy sm:text-4xl">
          See ContractorOS <span className="gradient-text">in Action</span>
        </h2>
        <p className="fade-in-up mx-auto mt-4 max-w-2xl font-body text-lg text-gray-500">
          Watch how real contractors are closing more jobs and spending less time on paperwork.
        </p>

        {/* Video */}
        <div className="scale-in mx-auto mt-12 max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy shadow-2xl">
            {playing ? (
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                title="ContractorOS Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group relative h-full w-full"
              >
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80&auto=format"
                  alt="Demo thumbnail"
                  className="h-full w-full object-cover opacity-50 transition duration-500 group-hover:opacity-60 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="btn-press flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-2xl shadow-orange-500/40 transition group-hover:scale-110">
                    <Play className="h-8 w-8 ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 to-transparent p-6">
                  <p className="font-heading text-sm font-semibold text-white/80">2:34 min</p>
                </div>
              </button>
            )}
          </div>
        </div>

        <p className="fade-in-up mt-6 font-body text-sm text-gray-500">
          Watch how Mike closes <span className="font-semibold text-navy">$40K/month</span> using ContractorOS
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Features                                                           */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: FileText,
    title: 'AI Proposal Generator',
    description: 'Create stunning, branded proposals in 60 seconds flat. Our AI writes, formats, and sends — you just approve.',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Clients book directly into your calendar. No back-and-forth texts, automatic reminders, zero no-shows.',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: DollarSign,
    title: 'One-Click Invoicing',
    description: 'Convert any proposal to an invoice instantly. Accept cards, ACH, or checks — get paid the same day.',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    icon: Users,
    title: 'Client Portal',
    description: 'A branded portal where clients view proposals, approve work, pay invoices, and leave reviews.',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    icon: MessageSquare,
    title: 'AI Follow-Ups',
    description: 'Never lose a lead again. Smart sequences follow up at the perfect time to close more deals.',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    icon: Star,
    title: 'Review Automation',
    description: 'Automatically request 5-star reviews after every job. Build your reputation on autopilot.',
    color: 'bg-yellow-500/10 text-yellow-600',
  },
]

function Features() {
  const scrollRef = useScrollReveal()

  return (
    <section ref={scrollRef} id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="fade-in-up font-body text-sm font-semibold uppercase tracking-widest text-accent">
            Powerful Features
          </p>
          <h2 className="fade-in-up mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">
            Everything You Need
          </h2>
          <p className="fade-in-up mt-4 font-body text-lg text-gray-500">
            Six AI-powered tools that replace your entire software stack.
          </p>
        </div>

        <div className="stagger-children mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <a
                key={f.title}
                href="#pricing"
                className="card-hover group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition block"
              >
                <div className={cn('mb-5 flex h-12 w-12 items-center justify-center rounded-xl', f.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-navy">{f.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-gray-500">{f.description}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition group-hover:opacity-100">
                  Get started <ChevronRight className="h-4 w-4" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Showcase Section                                                   */
/* ------------------------------------------------------------------ */

function Showcase() {
  const scrollRef = useScrollReveal()

  return (
    <section ref={scrollRef} className="bg-[#F8F9FA] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Row 1 — image left, copy right */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="fade-in-left relative">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80&auto=format"
              alt="Contractor on tablet"
              className="rounded-2xl shadow-2xl"
            />
            {/* Floating stat card */}
            <div className="float-subtle glass absolute -bottom-6 -right-6 rounded-xl px-5 py-3 shadow-xl">
              <p className="font-mono text-2xl font-bold text-accent">60s</p>
              <p className="text-xs font-medium text-gray-500">Avg. proposal time</p>
            </div>
          </div>

          <div className="fade-in-right">
            <p className="font-body text-sm font-semibold uppercase tracking-widest text-accent">
              Proposals on the Go
            </p>
            <h3 className="mt-3 font-heading text-3xl font-extrabold text-navy">
              Write proposals from your truck
            </h3>
            <p className="mt-4 font-body text-lg text-gray-500">
              Snap a photo of the job, and our AI drafts a professional proposal in seconds.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'AI writes scope of work from photos',
                'Branded PDF sent to client instantly',
                'Digital signature & approval built in',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-body text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 2 — copy left, image right */}
        <div className="mt-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-20 sm:mt-32">
          <div className="fade-in-left order-2 lg:order-1">
            <p className="font-body text-sm font-semibold uppercase tracking-widest text-accent">
              End-to-End Workflow
            </p>
            <h3 className="mt-3 font-heading text-3xl font-extrabold text-navy">
              From proposal to payment in one flow
            </h3>
            <p className="mt-4 font-body text-lg text-gray-500">
              No more juggling five different apps. Everything happens in one place.
            </p>
            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { num: '$2.1M+', label: 'Proposals Sent' },
                { num: '68%', label: 'Close Rate' },
                { num: '4.9/5', label: 'Avg Rating' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-mono text-2xl font-bold text-navy">{s.num}</p>
                  <p className="mt-1 text-xs font-medium text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in-right relative order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format"
              alt="Happy homeowner"
              className="rounded-2xl shadow-2xl"
            />
            {/* Floating notification */}
            <div className="float-slow glass absolute -left-6 top-12 rounded-xl px-5 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Payment received</p>
                  <p className="font-mono text-sm font-bold text-white">$4,250.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */

const STEPS = [
  { icon: Send, title: 'Sign Up in 60 Seconds', description: 'Create your free account. No credit card needed. Import your contacts or start fresh.' },
  { icon: FileText, title: 'Send Your First Proposal', description: 'Use AI to build a proposal from scratch or a photo. Your client gets a branded, signable document.' },
  { icon: DollarSign, title: 'Get Paid & Get Reviews', description: 'Clients pay online instantly. After the job, automated review requests boost your reputation.' },
]

function HowItWorks() {
  const scrollRef = useScrollReveal()

  return (
    <section ref={scrollRef} className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="fade-in-up font-body text-sm font-semibold uppercase tracking-widest text-accent">Simple Setup</p>
          <h2 className="fade-in-up mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">
            How It Works
          </h2>
        </div>

        <div className="stagger-children relative mt-16 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent lg:block" />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="fade-in-up relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-orange-500/25 ring-4 ring-white relative z-10">
                  <span className="font-heading text-xl font-bold">{i + 1}</span>
                </div>
                <div className="mb-3 flex justify-center">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-bold text-navy">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs font-body text-sm text-gray-500">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started',
    features: ['5 proposals/month', 'Basic scheduling', 'Email support', 'Client portal', '1 user'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$79',
    description: 'Everything you need to grow',
    features: ['Unlimited proposals', 'AI follow-ups', 'One-click invoicing', 'Review automation', 'Priority support', 'Custom branding'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$149',
    description: 'For growing teams',
    features: ['Everything in Pro', 'Up to 10 users', 'Team scheduling', 'Advanced analytics', 'API access', 'Dedicated account manager'],
    cta: 'Contact Sales',
    popular: false,
  },
]

function Pricing() {
  const scrollRef = useScrollReveal()

  return (
    <section ref={scrollRef} id="pricing" className="bg-[#F8F9FA] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="fade-in-up font-body text-sm font-semibold uppercase tracking-widest text-accent">
            Pricing
          </p>
          <h2 className="fade-in-up mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="fade-in-up mt-4 font-body text-lg text-gray-500">
            Start free, upgrade when you&apos;re ready. No contracts, cancel anytime.
          </p>
        </div>

        <div className="stagger-children mt-16 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'card-hover relative rounded-2xl bg-white p-8 shadow-sm transition',
                plan.popular
                  ? 'border-2 border-accent shadow-xl shadow-orange-500/10 lg:scale-105'
                  : 'border border-gray-100',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}
              <h3 className="font-heading text-lg font-bold text-navy">{plan.name}</h3>
              <p className="mt-1 font-body text-sm text-gray-500">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-extrabold text-navy">{plan.price}</span>
                {plan.price !== 'Free' && (
                  <span className="font-body text-sm text-gray-400">/month</span>
                )}
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/sign-up"
                className={cn(
                  'btn-press mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-heading text-sm font-semibold transition',
                  plan.popular
                    ? 'bg-accent text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600'
                    : 'border border-gray-200 text-navy hover:border-gray-300 hover:bg-gray-50',
                )}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote: 'I went from spending 3 hours on proposals to 60 seconds. Last month I closed $42K in new work — all from my phone.',
    name: 'Mike Reynolds',
    trade: 'Plumbing Contractor',
    location: 'Denver, CO',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    quote: 'The automated review requests are a game changer. I went from 12 Google reviews to 87 in four months. My phone rings nonstop now.',
    name: 'Sarah Chen',
    trade: 'General Contractor',
    location: 'Austin, TX',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    quote: 'My close rate jumped from 35% to 68% once I started using the AI proposals. Clients say they look more professional than the big companies.',
    name: 'James Okafor',
    trade: 'Electrical Contractor',
    location: 'Atlanta, GA',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
]

function Testimonials() {
  const scrollRef = useScrollReveal()

  return (
    <section ref={scrollRef} id="testimonials" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="fade-in-up font-body text-sm font-semibold uppercase tracking-widest text-accent">
            Testimonials
          </p>
          <h2 className="fade-in-up mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">
            Loved by Contractors Everywhere
          </h2>
        </div>

        <div className="stagger-children mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card-hover rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-4 flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" />
                ))}
              </div>
              <p className="font-body text-gray-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="font-heading text-sm font-bold text-navy">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.trade} &middot; {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Stats Bar                                                          */
/* ------------------------------------------------------------------ */

function StatsBar() {
  const scrollRef = useScrollReveal()
  const stats = [
    { num: '2,000+', label: 'Contractors' },
    { num: '60 seconds', label: 'Avg Proposal Time' },
    { num: '$2.1M+', label: 'In Proposals Sent' },
    { num: '4.9/5', label: 'Average Rating' },
  ]

  return (
    <section ref={scrollRef} className="relative bg-navy py-20 sm:py-24">
      <div className="noise-overlay absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="stagger-children grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="fade-in text-center">
              <p className="font-mono text-3xl font-extrabold text-white sm:text-4xl">{s.num}</p>
              <p className="mt-2 font-body text-sm font-medium text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  const scrollRef = useScrollReveal()

  return (
    <section ref={scrollRef} className="relative overflow-hidden bg-navy py-24 sm:py-32">
      <div className="noise-overlay absolute inset-0 opacity-20" />
      {/* Gradient glows */}
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-orange-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="fade-in-up font-heading text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Ready to Run Your Business on{' '}
          <span className="gradient-text">Autopilot</span>?
        </h2>
        <p className="fade-in-up mx-auto mt-6 max-w-xl font-body text-lg text-gray-300">
          Join 2,000+ contractors who are closing more jobs, getting paid faster, and growing their reputation — all with one platform.
        </p>
        <div className="fade-in-up mt-10">
          <Link
            to="/sign-up"
            className="btn-press inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-base font-semibold text-white shadow-2xl shadow-orange-500/30 transition hover:bg-orange-600"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-4 font-body text-sm text-gray-400">
            14 days free &middot; No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Integrations', href: '#' },
        { label: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ]

  return (
    <footer className="border-t border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-bold text-navy">ContractorOS</span>
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm text-gray-400">
              The AI-powered business platform built exclusively for trade contractors.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-gray-400 transition hover:text-navy" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition hover:text-navy" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition hover:text-navy" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-sm font-bold text-navy">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-body text-sm text-gray-400 transition hover:text-navy">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8 text-center">
          <p className="font-body text-sm text-gray-400">
            Built with &#10084;&#65039; for contractors &middot; &copy; {new Date().getFullYear()} ContractorOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  Landing Page                                                       */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SocialProofBar />
      {/* VideoSection — add back when a real demo video is recorded */}
      <Features />
      <Showcase />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <StatsBar />
      <FinalCTA />
      <Footer />
    </div>
  )
}
