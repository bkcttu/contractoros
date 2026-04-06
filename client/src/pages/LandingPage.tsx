import { Link } from 'react-router-dom'
import {
  Zap,
  FileText,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  Star,
  Check,
  ArrowRight,
  Wrench,
  Hammer,
  Paintbrush,
  Leaf,
  Home,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Feature data
// ---------------------------------------------------------------------------
const features = [
  {
    icon: FileText,
    title: 'AI Proposal Generator',
    desc: 'Write winning proposals in 60 seconds. Just describe the job — AI does the rest.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    desc: 'Let clients book online. Syncs with Google Calendar automatically.',
  },
  {
    icon: DollarSign,
    title: 'One-Click Invoicing',
    desc: 'Convert accepted proposals into invoices instantly. Get paid faster.',
  },
  {
    icon: Users,
    title: 'Client Portal',
    desc: 'Clients view, sign, and pay — no login required. Professional and simple.',
  },
  {
    icon: MessageSquare,
    title: 'AI Follow-Ups',
    desc: 'Automatic follow-up messages when clients go quiet. Never lose a job to silence.',
  },
  {
    icon: Star,
    title: 'Review Automation',
    desc: 'Automatically ask happy clients for Google reviews after every job.',
  },
]

const steps = [
  { num: '1', title: 'Fill out a simple form', desc: 'Enter the job details — don\'t worry about grammar or formatting.' },
  { num: '2', title: 'AI writes your proposal', desc: 'Claude AI creates a polished, professional proposal in seconds.' },
  { num: '3', title: 'Send, track, get paid', desc: 'Email it to your client. Track views. Collect e-signatures and payments.' },
]

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    desc: 'Get started with the basics',
    features: ['5 proposals per month', 'Basic scheduling', '1 user', 'PDF downloads', 'Email support'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    desc: 'Everything you need to grow',
    features: [
      'Unlimited proposals',
      'AI follow-ups',
      'Website builder',
      'Client portal + e-signatures',
      'Invoice & payments',
      'Review automation',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$149',
    period: '/month',
    desc: 'For growing crews',
    features: [
      'Everything in Pro',
      'Up to 5 users',
      'Team scheduling',
      'Advanced reporting',
      'Custom branding',
      'Dedicated account manager',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
]

const testimonials = [
  {
    quote: "I used to spend 2 hours writing proposals after work. Now I do it in 60 seconds from my truck. My close rate went up 40% because I'm sending proposals same-day instead of a week later.",
    name: 'Mike Reynolds',
    trade: 'HVAC Contractor',
    location: 'Dallas, TX',
    stars: 5,
  },
  {
    quote: "ContractorOS paid for itself the first week. One proposal I sent got signed within an hour. The client said it was the most professional bid they'd ever received.",
    name: 'Sarah Torres',
    trade: 'Roofing Contractor',
    location: 'Phoenix, AZ',
    stars: 5,
  },
  {
    quote: "I'm not a computer guy. But this thing is so simple even I figured it out. My wife used to do all the paperwork — now ContractorOS does it. She's happy, I'm happy.",
    name: 'Carlos Martinez',
    trade: 'General Contractor',
    location: 'Houston, TX',
    stars: 5,
  },
]

const tradeIcons = [Wrench, Hammer, Zap, Paintbrush, Leaf, Home]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---- NAV ---- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-accent" />
            <span className="text-xl font-heading font-bold text-navy">ContractorOS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-navy transition-colors">Features</a>
            <a href="#pricing" className="hover:text-navy transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-navy transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/sign-in" className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-navy transition-colors">
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-600 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-600 to-navy-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(249,115,22,0.15),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-28 sm:pb-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-6">
              <Zap className="h-3.5 w-3.5 text-accent" />
              Powered by AI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
              The Only Business Tool a Contractor Will{' '}
              <span className="text-accent">Ever Need</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
              AI-powered proposals, scheduling, invoicing, and client management — all in one platform.
              From first call to five-star review, on autopilot.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-accent text-white font-heading font-bold text-lg hover:bg-accent-600 transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 text-white font-heading font-semibold text-lg hover:bg-white/10 transition-all"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-4 text-sm text-white/50">14 days free. No credit card required.</p>
          </div>

          {/* Dashboard mockup */}
          <div className="mt-16 sm:mt-20 relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Title bar */}
              <div className="bg-navy h-10 flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-white/60 font-mono">contractoros.com/dashboard</span>
              </div>
              <div className="flex">
                {/* Mini sidebar */}
                <div className="hidden sm:block w-48 bg-navy p-4 space-y-3 min-h-[280px]">
                  <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <Zap className="h-4 w-4 text-accent" />
                    ContractorOS
                  </div>
                  <div className="space-y-1 pt-4">
                    {['Dashboard', 'New Proposal', 'Proposals', 'Schedule', 'Invoices'].map((item, i) => (
                      <div
                        key={item}
                        className={cn(
                          'px-3 py-1.5 rounded text-xs',
                          i === 0 ? 'bg-accent text-white' : 'text-white/50'
                        )}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Content area */}
                <div className="flex-1 p-6 bg-[#F8F9FA]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Revenue', value: '$33,500', color: 'text-emerald-600' },
                      { label: 'Proposals', value: '24', color: 'text-accent' },
                      { label: 'Win Rate', value: '68%', color: 'text-navy' },
                      { label: 'Pending', value: '5', color: 'text-amber-600' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase">{stat.label}</p>
                        <p className={cn('text-lg font-bold font-mono', stat.color)}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Fake chart bars */}
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-3">Monthly Revenue</p>
                    <div className="flex items-end gap-2 h-20">
                      {[40, 55, 45, 70, 60, 85].map((h, i) => (
                        <div
                          key={i}
                          className={cn('flex-1 rounded-t', i === 5 ? 'bg-accent' : 'bg-navy/20')}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ---- SOCIAL PROOF BAR ---- */}
      <section className="border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
            Trusted by 2,000+ contractors across the country
          </p>
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            {tradeIcons.map((Icon, i) => (
              <Icon key={i} className="h-8 w-8 text-gray-300" />
            ))}
          </div>
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy">
              Everything You Need. Nothing You Don't.
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Replace Jobber, QuickBooks, Calendly, and that stack of papers on your dashboard — with one app.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-heading font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy">
              From Job Details to Signed Proposal in 60 Seconds
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent/40 to-accent/10" />
                )}
                <div className="mx-auto h-16 w-16 rounded-2xl bg-accent text-white flex items-center justify-center text-2xl font-heading font-bold mb-4 shadow-lg shadow-accent/20">
                  {s.num}
                </div>
                <h3 className="text-lg font-heading font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- PRICING ---- */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy">
              Simple, Honest Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              No contracts. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl p-8 flex flex-col',
                  plan.popular
                    ? 'border-2 border-accent bg-white shadow-xl shadow-accent/10 scale-105'
                    : 'border border-gray-200 bg-white'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-heading font-bold text-navy">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-bold text-navy">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.desc}</p>

                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/dashboard"
                  className={cn(
                    'mt-8 inline-flex items-center justify-center px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-all',
                    plan.popular
                      ? 'bg-accent text-white hover:bg-accent-600 shadow-lg shadow-accent/20'
                      : 'bg-navy text-white hover:bg-navy-600'
                  )}
                >
                  {plan.cta}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- TESTIMONIALS ---- */}
      <section id="testimonials" className="py-20 sm:py-28 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy">
              Contractors Love ContractorOS
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-heading font-bold text-navy">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.trade} — {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FINAL CTA ---- */}
      <section className="py-20 sm:py-28 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.15),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white">
            Ready to Run Your Business on Autopilot?
          </h2>
          <p className="mt-6 text-lg text-white/60">
            Join 2,000+ contractors who send better proposals, get paid faster, and earn more 5-star reviews.
          </p>
          <Link
            to="/dashboard"
            className="mt-10 inline-flex items-center justify-center px-10 py-5 rounded-xl bg-accent text-white font-heading font-bold text-lg hover:bg-accent-600 transition-all shadow-lg shadow-accent/30 hover:shadow-xl"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-white/40">14 days free. No credit card required.</p>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-accent" />
                <span className="text-lg font-heading font-bold text-navy">ContractorOS</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                The only business tool a contractor will ever need.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-navy mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-navy transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-navy transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-navy transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-navy mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-navy transition-colors">About</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-navy mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-navy transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-navy transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ContractorOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
