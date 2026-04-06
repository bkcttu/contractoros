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
  BarChart3,
  Bell,
  Search,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Navigation                                                        */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold text-navy">
            ContractorOS
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="font-body text-sm font-medium text-gray-600 transition hover:text-navy"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="font-body text-sm font-medium text-gray-600 transition hover:text-navy"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="font-body text-sm font-medium text-gray-600 transition hover:text-navy"
          >
            Testimonials
          </a>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/sign-in"
            className="font-body text-sm font-medium text-gray-600 transition hover:text-navy"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-navy" />
          ) : (
            <Menu className="h-6 w-6 text-navy" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm font-medium text-gray-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm font-medium text-gray-600"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm font-medium text-gray-600"
            >
              Testimonials
            </a>
            <hr className="border-gray-100" />
            <Link
              to="/sign-in"
              className="font-body text-sm font-medium text-gray-600"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-heading text-sm font-semibold text-white"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F9FA] via-white to-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-20 h-72 w-72 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5">
            <Zap className="h-4 w-4 text-accent" />
            <span className="font-body text-xs font-semibold tracking-wide text-accent-700">
              AI-POWERED CONTRACTOR PLATFORM
            </span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-6xl">
            The Only Business Tool a Contractor Will Ever Need
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-gray-600 sm:text-xl">
            AI-powered proposals, smart scheduling, one-click invoicing, and
            automated follow-ups.{' '}
            <span className="font-semibold text-navy">
              From first call to five-star review — on autopilot.
            </span>
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-base font-bold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-600 hover:shadow-xl hover:shadow-accent/30"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-navy-200 px-8 py-4 font-heading text-base font-bold text-navy transition hover:border-navy hover:bg-navy-50"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl shadow-navy/10">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-4 font-mono text-xs text-gray-400">
                app.contractoros.com/dashboard
              </span>
            </div>

            <div className="flex min-h-[340px] sm:min-h-[400px]">
              {/* Sidebar */}
              <div className="hidden w-52 shrink-0 border-r border-gray-100 bg-navy p-4 sm:block">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-heading text-sm font-bold text-white">
                    ContractorOS
                  </span>
                </div>
                {[
                  { icon: BarChart3, label: 'Dashboard', active: true },
                  { icon: FileText, label: 'Proposals' },
                  { icon: Calendar, label: 'Schedule' },
                  { icon: DollarSign, label: 'Invoices' },
                  { icon: Users, label: 'Clients' },
                  { icon: Star, label: 'Reviews' },
                ].map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={cn(
                      'mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
                      active
                        ? 'bg-white/10 font-semibold text-white'
                        : 'text-navy-200'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-body">{label}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 sm:p-6">
                {/* Top bar */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-navy">
                      Dashboard
                    </h3>
                    <p className="font-body text-xs text-gray-400">
                      Welcome back, Mike
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:flex">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="font-body text-xs text-gray-400">
                        Search...
                      </span>
                    </div>
                    <div className="relative">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                        3
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    {
                      label: 'Active Proposals',
                      value: '12',
                      change: '+3 this week',
                    },
                    {
                      label: 'Revenue (MTD)',
                      value: '$24,850',
                      change: '+18%',
                    },
                    {
                      label: 'Win Rate',
                      value: '68%',
                      change: '+5%',
                    },
                    {
                      label: 'Avg. Rating',
                      value: '4.9',
                      change: '142 reviews',
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-gray-100 bg-white p-3"
                    >
                      <p className="font-body text-[10px] font-medium text-gray-400">
                        {stat.label}
                      </p>
                      <p className="font-heading text-xl font-bold text-navy">
                        {stat.value}
                      </p>
                      <p className="font-body text-[10px] text-emerald-500">
                        {stat.change}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recent proposals */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-heading text-sm font-semibold text-navy">
                      Recent Proposals
                    </h4>
                    <div className="flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-[10px] font-semibold text-white">
                      <Plus className="h-3 w-3" /> New
                    </div>
                  </div>
                  {[
                    {
                      client: 'Johnson Residence',
                      type: 'HVAC Install',
                      amount: '$4,200',
                      status: 'Sent',
                    },
                    {
                      client: 'Oak Street Office',
                      type: 'Roof Repair',
                      amount: '$8,750',
                      status: 'Viewed',
                    },
                    {
                      client: 'Pine Valley HOA',
                      type: 'Landscaping',
                      amount: '$3,100',
                      status: 'Signed',
                    },
                  ].map((row) => (
                    <div
                      key={row.client}
                      className="flex items-center justify-between border-t border-gray-50 py-2"
                    >
                      <div>
                        <p className="font-body text-xs font-medium text-navy">
                          {row.client}
                        </p>
                        <p className="font-body text-[10px] text-gray-400">
                          {row.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-navy">
                          {row.amount}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            row.status === 'Signed'
                              ? 'bg-emerald-50 text-emerald-600'
                              : row.status === 'Viewed'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-500'
                          )}
                        >
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Glow under mockup */}
          <div className="pointer-events-none absolute -bottom-8 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Social proof / logos bar                                          */
/* ------------------------------------------------------------------ */

function SocialProof() {
  const trades = [
    { icon: Wrench, label: 'Plumbing' },
    { icon: Hammer, label: 'Roofing' },
    { icon: Zap, label: 'Electrical' },
    { icon: Paintbrush, label: 'Painting' },
    { icon: Leaf, label: 'Landscaping' },
    { icon: Home, label: 'General' },
  ]

  return (
    <section className="border-y border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-body text-sm font-medium tracking-wide text-gray-400">
          TRUSTED BY 2,000+ CONTRACTORS ACROSS THE COUNTRY
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {trades.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-gray-300">
              <Icon className="h-7 w-7" />
              <span className="font-heading text-base font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Features                                                          */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: FileText,
    title: 'AI Proposal Generator',
    description:
      'Write winning proposals in 60 seconds. Just answer a few questions and our AI crafts a professional, branded proposal ready to send.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description:
      'Let clients book online and sync with Google Calendar. No more phone tag or double bookings — ever.',
  },
  {
    icon: DollarSign,
    title: 'One-Click Invoicing',
    description:
      'Convert accepted proposals to invoices instantly. Accept credit cards, ACH, and checks in one place.',
  },
  {
    icon: Users,
    title: 'Client Portal',
    description:
      'Clients view, sign, and pay — no login needed. A beautiful, professional experience for every customer.',
  },
  {
    icon: MessageSquare,
    title: 'AI Follow-Ups',
    description:
      'Never lose a job to silence again. Smart follow-up sequences nudge prospects at exactly the right time.',
  },
  {
    icon: Star,
    title: 'Review Automation',
    description:
      'Get 5-star reviews on autopilot. Automatically request reviews after every completed job.',
  },
]

function Features() {
  return (
    <section id="features" className="bg-[#F8F9FA] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-body text-sm font-semibold tracking-wide text-accent">
            EVERYTHING YOU NEED
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            One platform to run your entire business
          </h2>
          <p className="mt-4 font-body text-lg text-gray-500">
            Stop juggling five different apps. ContractorOS replaces them all.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-lg hover:shadow-navy/5"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy">
                {title}
              </h3>
              <p className="mt-2 font-body leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                      */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Fill out a simple form',
      description:
        'Answer a few quick questions about the job — scope, materials, timeline. Takes less than two minutes.',
    },
    {
      num: '2',
      title: 'AI writes your proposal',
      description:
        'Our AI instantly generates a professional, branded proposal tailored to the job and your business.',
    },
    {
      num: '3',
      title: 'Send, track, get paid',
      description:
        'Send it with one click. Track when it is opened, get e-signatures, and collect payment — all in one flow.',
    },
  ]

  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-body text-sm font-semibold tracking-wide text-accent">
            SIMPLE AS 1-2-3
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
        </div>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden md:block">
            <div className="mx-auto h-0.5 w-2/3 bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20" />
          </div>

          {steps.map(({ num, title, description }) => (
            <div key={num} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-accent-100 bg-accent font-heading text-2xl font-extrabold text-white shadow-lg shadow-accent/20">
                {num}
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold text-navy">
                {title}
              </h3>
              <p className="mt-2 font-body leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                           */
/* ------------------------------------------------------------------ */

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'For solo contractors just getting started.',
    features: [
      '5 proposals per month',
      'Basic scheduling',
      '1 user',
      'Client portal',
      'Email support',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mo',
    description: 'Everything you need to grow your business.',
    badge: 'Most Popular',
    features: [
      'Unlimited proposals',
      'Smart scheduling + Google Calendar',
      'One-click invoicing',
      'AI follow-ups',
      'Review automation',
      'Website builder',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$149',
    period: '/mo',
    description: 'For growing teams that need more power.',
    features: [
      'Everything in Pro',
      'Up to 5 users',
      'Team scheduling',
      'Advanced reporting',
      'Dedicated account manager',
      'Custom branding',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
]

function Pricing() {
  return (
    <section id="pricing" className="bg-[#F8F9FA] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-body text-sm font-semibold tracking-wide text-accent">
            TRANSPARENT PRICING
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Plans that grow with your business
          </h2>
          <p className="mt-4 font-body text-lg text-gray-500">
            14-day free trial on all paid plans. No credit card required.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition',
                plan.highlighted
                  ? 'scale-[1.02] border-accent shadow-xl shadow-accent/10 lg:scale-105'
                  : 'border-gray-100 hover:shadow-md'
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 font-heading text-xs font-bold text-white">
                  {plan.badge}
                </span>
              )}

              <h3 className="font-heading text-xl font-bold text-navy">
                {plan.name}
              </h3>
              <p className="mt-1 font-body text-sm text-gray-500">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="font-heading text-5xl font-extrabold text-navy">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="font-body text-base text-gray-400">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="font-body text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/sign-up"
                className={cn(
                  'mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-heading text-sm font-bold transition',
                  plan.highlighted
                    ? 'bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-600'
                    : 'border-2 border-navy-200 text-navy hover:border-navy hover:bg-navy-50'
                )}
              >
                {plan.cta}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                      */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    quote:
      "ContractorOS cut my proposal time from 2 hours to 5 minutes. I closed $40K in new jobs my first month just because I could actually respond fast enough. It's a no-brainer.",
    name: 'Mike R.',
    trade: 'HVAC Contractor, Phoenix AZ',
    stars: 5,
  },
  {
    quote:
      "I used to lose half my leads because I couldn't follow up fast enough. Now the AI handles it for me and my close rate went from 30% to 62%. Best money I've ever spent on my business.",
    name: 'Sarah T.',
    trade: 'Roofing Contractor, Dallas TX',
    stars: 5,
  },
  {
    quote:
      'We went from 12 Google reviews to 87 in three months without lifting a finger. The automated review requests are pure gold. Our phone rings twice as much now.',
    name: 'Carlos M.',
    trade: 'General Contractor, Miami FL',
    stars: 5,
  },
]

function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-body text-sm font-semibold tracking-wide text-accent">
            REAL RESULTS
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Contractors love ContractorOS
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-gray-100 bg-[#F8F9FA] p-8"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="flex-1 font-body leading-relaxed text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="font-heading text-sm font-bold text-navy">
                  {t.name}
                </p>
                <p className="font-body text-xs text-gray-400">{t.trade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                         */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 sm:py-28">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Run Your Business on Autopilot?
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-body text-lg text-navy-200">
          Join 2,000+ contractors who are winning more jobs, getting paid
          faster, and earning five-star reviews — without the busywork.
        </p>
        <div className="mt-10">
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-4 font-heading text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-600 hover:shadow-xl"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <p className="mt-4 font-body text-sm text-navy-300">
          14 days free. No credit card required.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
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
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-bold text-navy">
                ContractorOS
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-gray-500">
              The AI-powered business platform built specifically for trade
              contractors. From first call to five-star review — on autopilot.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-sm font-bold text-navy">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-body text-sm text-gray-500 transition hover:text-navy"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8 text-center">
          <p className="font-body text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ContractorOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white font-body">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  )
}
