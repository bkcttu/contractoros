import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Star,
  CreditCard,
  ArrowRight,
  Lock,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANS, COMPARISON_DATA, FAQ_DATA, calculateROI } from '@/lib/pricing'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { APP_NAME } from '@/lib/branding'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PricingPageProps {
  lang?: 'en' | 'es'
}

/* ------------------------------------------------------------------ */
/*  i18n helper                                                        */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    badge: 'Average contractor closes 1 extra job/month',
    h1: 'Software That Pays For Itself.',
    h2: 'Before lunch.',
    subhead: 'AI proposals, follow-ups, scheduling, payments — one platform, built for contractors who close.',
    monthly: 'Monthly',
    annual: 'Annual',
    save17: 'Save 17%',
    saveBadge: 'SAVE',
    mostPopular: 'MOST POPULAR',
    perMonth: '/mo',
    free: 'Free',
    roiCalloutTitle: 'Average Pro member ROI:',
    roiCalloutJob: '1 extra job',
    roiCalloutCost: 'Your cost',
    roiCalloutReturn: 'Return',
    roiCalcHeadline: `How fast does ${APP_NAME} pay for itself?`,
    roiCalcSubhead: 'Move the sliders. Watch your numbers change in real time.',
    sliderJobValue: 'Average job value',
    sliderProposals: 'Proposals sent per month',
    sliderWinRate: 'Current win rate',
    resultNewWinRate: 'New win rate',
    resultExtraJobs: 'Extra jobs/month',
    resultExtraRevenue: 'Extra revenue/month',
    resultCost: `${APP_NAME} cost`,
    resultNetGain: 'Net gain/month',
    resultROI: 'Return on investment',
    roiCta: 'Start Free Trial — See It For Yourself',
    comparisonTitle: `How ${APP_NAME} stacks up`,
    comparisonSubtitle: 'Feature-for-feature, dollar-for-dollar.',
    comparisonFeature: 'Feature',
    comparisonCallout: '14 features your competitors don\'t offer. Half the price.',
    testimonialTitle: 'Contractors who close more. Pay less.',
    faqTitle: 'Frequently Asked Questions',
    ctaHeadline: 'Your next proposal could close your next job.',
    ctaSubhead: 'Try free for 14 days. No credit card required.',
    ctaButton: 'Start Free Trial',
    trustSsl: 'SSL Secured',
    trustRating: '4.9/5 Rating',
    trustNoCard: 'No Credit Card',
    trustCancel: 'Cancel Anytime',
  },
  es: {
    badge: 'El contratista promedio cierra 1 trabajo extra al mes',
    h1: 'Software Que Se Paga Solo.',
    h2: 'Antes del almuerzo.',
    subhead: 'Propuestas IA, seguimientos, agenda, pagos — una plataforma, hecha para contratistas que cierran.',
    monthly: 'Mensual',
    annual: 'Anual',
    save17: 'Ahorra 17%',
    saveBadge: 'AHORRA',
    mostPopular: 'MÁS POPULAR',
    perMonth: '/mes',
    free: 'Gratis',
    roiCalloutTitle: 'ROI promedio del miembro Pro:',
    roiCalloutJob: '1 trabajo extra',
    roiCalloutCost: 'Tu costo',
    roiCalloutReturn: 'Retorno',
    roiCalcHeadline: `¿Qué tan rápido se paga solo ${APP_NAME}?`,
    roiCalcSubhead: 'Mueve los controles. Mira tus números cambiar en tiempo real.',
    sliderJobValue: 'Valor promedio del trabajo',
    sliderProposals: 'Propuestas enviadas al mes',
    sliderWinRate: 'Tasa actual de cierre',
    resultNewWinRate: 'Nueva tasa de cierre',
    resultExtraJobs: 'Trabajos extra/mes',
    resultExtraRevenue: 'Ingreso extra/mes',
    resultCost: `Costo de ${APP_NAME}`,
    resultNetGain: 'Ganancia neta/mes',
    resultROI: 'Retorno de inversión',
    roiCta: 'Prueba Gratis — Compruébalo Tú Mismo',
    comparisonTitle: `Cómo se compara ${APP_NAME}`,
    comparisonSubtitle: 'Función por función, dólar por dólar.',
    comparisonFeature: 'Función',
    comparisonCallout: '14 funciones que tu competencia no ofrece. La mitad del precio.',
    testimonialTitle: 'Contratistas que cierran más. Pagan menos.',
    faqTitle: 'Preguntas Frecuentes',
    ctaHeadline: 'Tu próxima propuesta podría cerrar tu próximo trabajo.',
    ctaSubhead: 'Prueba gratis por 14 días. Sin tarjeta de crédito.',
    ctaButton: 'Prueba Gratis',
    trustSsl: 'SSL Seguro',
    trustRating: '4.9/5 Calificación',
    trustNoCard: 'Sin Tarjeta',
    trustCancel: 'Cancela Cuando Quieras',
  },
}

/* ------------------------------------------------------------------ */
/*  Pricing Page                                                       */
/* ------------------------------------------------------------------ */

export function Pricing({ lang = 'en' }: PricingPageProps) {
  const t = T[lang]
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // ROI calculator state
  const [jobValue, setJobValue] = useState(3500)
  const [proposals, setProposals] = useState(8)
  const [winRate, setWinRate] = useState(40)

  const roi = calculateROI(jobValue, proposals, winRate / 100)

  const revealRef = useScrollReveal()

  return (
    <div ref={revealRef} className="min-h-screen bg-navy text-white">
      {/* ============================================================ */}
      {/*  SECTION 1 — HEADLINE                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-navy py-20 sm:py-28 lg:py-32">
        {/* Dot grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-5 py-2 text-sm font-medium text-orange-300">
            <TrendingUp className="h-4 w-4" />
            {t.badge}
          </div>

          {/* H1 */}
          <h1 className="fade-in-up font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.h1}
          </h1>
          {/* H2 gradient */}
          <h2 className="fade-in-up mt-2 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              {t.h2}
            </span>
          </h2>

          {/* Subhead */}
          <p className="fade-in-up mx-auto mt-6 max-w-2xl text-lg text-white/60">
            {t.subhead}
          </p>

          {/* Monthly / Annual toggle */}
          <div className="fade-in-up mt-10 flex items-center justify-center gap-3">
            <span className={cn('text-sm font-medium transition', !annual ? 'text-white' : 'text-white/50')}>
              {t.monthly}
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                annual ? 'bg-orange-500' : 'bg-white/20'
              )}
              aria-label="Toggle billing period"
            >
              <span
                className={cn(
                  'inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform',
                  annual ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </button>
            <span className={cn('text-sm font-medium transition', annual ? 'text-white' : 'text-white/50')}>
              {t.annual}
            </span>
            {annual && (
              <span className="ml-2 rounded-full bg-green-500/20 px-3 py-0.5 text-xs font-bold text-green-400">
                {t.save17}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 2 — PRICING CARDS                                    */}
      {/* ============================================================ */}
      <section className="relative bg-navy pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan, idx) => {
              const price = annual ? plan.annualMonthly : plan.monthlyPrice
              const isPro = plan.popular
              const name = lang === 'es' ? plan.nameEs : plan.name
              const subtitle = lang === 'es' ? plan.subtitleEs : plan.subtitle
              const cta = lang === 'es' ? plan.ctaTextEs : plan.ctaText
              const fineprint = lang === 'es' ? plan.fineprintEs : plan.fineprint

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'fade-in-up group relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
                    isPro
                      ? 'scale-[1.03] border-orange-500 bg-navy-700 shadow-[0_0_40px_rgba(249,115,22,0.15)] lg:scale-105'
                      : 'border-white/10 bg-[#1f3361] hover:border-white/20 hover:bg-[#243a6a]'
                  )}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {/* Most Popular badge */}
                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                      {t.mostPopular}
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                      {plan.label}
                    </p>
                    <h3 className="mt-1 font-heading text-2xl font-bold text-white">{name}</h3>
                    <p className="mt-1 text-sm text-white/50">{subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {plan.monthlyPrice === 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-5xl font-bold text-white">{t.free}</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-lg text-white/60">$</span>
                        <span className="font-mono text-5xl font-bold text-white">
                          {annual ? Math.round(plan.annualMonthly) : plan.monthlyPrice}
                        </span>
                        <span className="text-sm text-white/50">{t.perMonth}</span>
                      </div>
                    )}
                    {annual && plan.annualSavings > 0 && (
                      <span className="mt-2 inline-block rounded-full bg-green-500/20 px-3 py-0.5 text-xs font-bold text-green-400">
                        {t.saveBadge} ${plan.annualSavings}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-6 flex-1 space-y-3">
                    {plan.features.map((feat, fi) => {
                      const featureText = lang === 'es' ? feat.textEs : feat.text
                      return (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          {feat.included ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                          ) : (
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-white/25" />
                          )}
                          <span className={feat.included ? 'text-white/80' : 'text-white/30'}>
                            {featureText}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {/* Pro ROI callout */}
                  {isPro && (
                    <div className="mb-6 rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                        {t.roiCalloutTitle}
                      </p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">{t.roiCalloutJob}</span>
                          <span className="font-mono font-bold text-green-400">= $3,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">{t.roiCalloutCost}</span>
                          <span className="font-mono font-bold text-white">= $79</span>
                        </div>
                        <div className="flex justify-between border-t border-orange-500/20 pt-1">
                          <span className="text-white/70">{t.roiCalloutReturn}</span>
                          <span className="font-mono font-bold text-green-400">= 4,300%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    to="/sign-up"
                    className={cn(
                      'btn-press flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-center font-heading text-sm font-semibold transition',
                      isPro
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600'
                        : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5'
                    )}
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {/* Fine print */}
                  <p className="mt-3 text-center text-xs text-white/40">{fineprint}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 3 — ROI CALCULATOR                                   */}
      {/* ============================================================ */}
      <section className="relative bg-[#162340] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="fade-in-up font-heading text-3xl font-bold text-white sm:text-4xl">
            {t.roiCalcHeadline}
          </h2>
          <p className="fade-in-up mt-3 text-white/50">
            {t.roiCalcSubhead}
          </p>

          <div className="fade-in-up mt-12 rounded-2xl border border-white/10 bg-[#1B2A4A] p-6 sm:p-10">
            {/* Sliders */}
            <div className="grid gap-8 sm:grid-cols-3">
              {/* Job Value */}
              <div className="text-left">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  {t.sliderJobValue}
                </label>
                <div className="mb-2 font-mono text-2xl font-bold text-orange-400">
                  ${jobValue.toLocaleString()}
                </div>
                <input
                  type="range"
                  min={500}
                  max={15000}
                  step={100}
                  value={jobValue}
                  onChange={(e) => setJobValue(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-orange-500"
                />
                <div className="mt-1 flex justify-between text-xs text-white/30">
                  <span>$500</span>
                  <span>$15,000</span>
                </div>
              </div>

              {/* Proposals/month */}
              <div className="text-left">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  {t.sliderProposals}
                </label>
                <div className="mb-2 font-mono text-2xl font-bold text-orange-400">
                  {proposals}
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={proposals}
                  onChange={(e) => setProposals(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-orange-500"
                />
                <div className="mt-1 flex justify-between text-xs text-white/30">
                  <span>1</span>
                  <span>30</span>
                </div>
              </div>

              {/* Win rate */}
              <div className="text-left">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  {t.sliderWinRate}
                </label>
                <div className="mb-2 font-mono text-2xl font-bold text-orange-400">
                  {winRate}%
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={1}
                  value={winRate}
                  onChange={(e) => setWinRate(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-orange-500"
                />
                <div className="mt-1 flex justify-between text-xs text-white/30">
                  <span>10%</span>
                  <span>90%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="mt-10 grid gap-4 rounded-xl border border-white/10 bg-[#162340] p-6 sm:grid-cols-3 lg:grid-cols-6">
              <ResultStat label={t.resultNewWinRate} value={`${roi.newWinRate}%`} color="green" />
              <ResultStat label={t.resultExtraJobs} value={`+${roi.extraJobs}`} color="green" />
              <ResultStat label={t.resultExtraRevenue} value={`+$${roi.extraRevenue.toLocaleString()}`} color="green" />
              <ResultStat label={t.resultCost} value={`-$${roi.monthlyCost}`} color="white" />
              <ResultStat label={t.resultNetGain} value={`+$${roi.netGain.toLocaleString()}`} color="green" />
              <ResultStat label={t.resultROI} value={`${roi.roi.toLocaleString()}%`} color="green" large />
            </div>

            {/* CTA */}
            <Link
              to="/sign-up"
              className="btn-press mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-4 font-heading text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
            >
              {t.roiCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 4 — COMPARISON TABLE                                 */}
      {/* ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="fade-in-up font-heading text-3xl font-bold text-navy sm:text-4xl">
              {t.comparisonTitle}
            </h2>
            <p className="fade-in-up mt-3 text-gray-500">
              {t.comparisonSubtitle}
            </p>
          </div>

          <div className="fade-in-up mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 pb-4 pr-4 font-heading text-sm font-semibold text-gray-500">
                    {t.comparisonFeature}
                  </th>
                  <th className="border-b-2 border-orange-500 pb-4 text-center font-heading text-sm font-bold text-orange-600">
                    {APP_NAME}
                  </th>
                  <th className="border-b border-gray-200 pb-4 text-center font-heading text-sm font-semibold text-gray-500">
                    Jobber
                  </th>
                  <th className="border-b border-gray-200 pb-4 text-center font-heading text-sm font-semibold text-gray-500">
                    Housecall Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, i) => {
                  const featureText = lang === 'es' ? row.featureEs : row.feature
                  const isLast = i === COMPARISON_DATA.length - 1
                  return (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className={cn('py-3 pr-4 text-gray-700', isLast && 'font-bold')}>
                        {featureText}
                      </td>
                      <td className="py-3 text-center">
                        <ComparisonCell value={row.contractorOS} highlight />
                      </td>
                      <td className="py-3 text-center">
                        <ComparisonCell value={row.jobber} />
                      </td>
                      <td className="py-3 text-center">
                        <ComparisonCell value={row.housecallPro} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Callout */}
          <div className="fade-in-up mt-10 rounded-xl border-2 border-orange-500/30 bg-orange-50 p-6 text-center">
            <p className="font-heading text-lg font-bold text-navy">
              {t.comparisonCallout}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 5 — TESTIMONIALS                                     */}
      {/* ============================================================ */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="fade-in-up text-center font-heading text-3xl font-bold text-white sm:text-4xl">
            {t.testimonialTitle}
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="fade-in-up group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-white/20"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 text-sm leading-relaxed text-white/80">
                  &ldquo;{item.quote}&rdquo;
                </p>
                {item.translation && (
                  <p className="mb-6 text-xs italic leading-relaxed text-white/50">
                    Translation: &ldquo;{item.translation}&rdquo;
                  </p>
                )}

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-white/50">{item.trade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 6 — FAQ                                              */}
      {/* ============================================================ */}
      <section className="bg-[#162340] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="fade-in-up text-center font-heading text-3xl font-bold text-white sm:text-4xl">
            {t.faqTitle}
          </h2>

          <div className="mt-12 space-y-3">
            {FAQ_DATA.map((faq, i) => {
              const question = lang === 'es' ? faq.questionEs : faq.question
              const answer = lang === 'es' ? faq.answerEs : faq.answer
              const isOpen = openFaq === i

              return (
                <div
                  key={i}
                  className="fade-in-up overflow-hidden rounded-xl border border-white/10 bg-white/5 transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className="pr-4 font-heading text-base font-semibold text-white">
                      {question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-orange-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-white/40" />
                    )}
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 7 — FINAL CTA                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-navy py-20 sm:py-28">
        {/* Noise overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="fade-in-up font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t.ctaHeadline}
          </h2>
          <p className="fade-in-up mt-4 text-lg text-white/50">
            {t.ctaSubhead}
          </p>

          <Link
            to="/sign-up"
            className="btn-press fade-in-up mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-10 py-4 font-heading text-lg font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
          >
            {t.ctaButton}
            <ArrowRight className="h-5 w-5" />
          </Link>

          {/* Trust badges */}
          <div className="fade-in-up mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4" /> {t.trustSsl}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4" /> {t.trustRating}
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4" /> {t.trustNoCard}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> {t.trustCancel}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ResultStat({
  label,
  value,
  color,
  large,
}: {
  label: string
  value: string
  color: 'green' | 'white'
  large?: boolean
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium text-white/50">{label}</p>
      <p
        className={cn(
          'mt-1 font-mono font-bold',
          large ? 'text-2xl' : 'text-lg',
          color === 'green' ? 'text-green-400' : 'text-white'
        )}
      >
        {value}
      </p>
    </div>
  )
}

function ComparisonCell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (typeof value === 'string') {
    // Price row or "Basic"
    const isBasic = value === 'Basic'
    return (
      <span
        className={cn(
          'text-sm font-semibold',
          isBasic ? 'text-amber-500' : highlight ? 'font-bold text-green-600' : 'text-gray-700 font-bold'
        )}
      >
        {value}
      </span>
    )
  }
  if (value) {
    return <Check className={cn('mx-auto h-5 w-5', highlight ? 'text-green-600' : 'text-green-500')} />
  }
  return <X className="mx-auto h-5 w-5 text-red-400" />
}

/* ------------------------------------------------------------------ */
/*  Static data: testimonials                                          */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    name: 'Marcus T.',
    initials: 'MT',
    trade: 'Roofing, San Antonio TX',
    color: '#3b82f6',
    quote:
      'Sent a proposal from the driveway using voice-to-proposal. Client signed it before I got back to the office. $8,400 roof job — closed in 20 minutes.',
    translation: null,
  },
  {
    name: 'Carlos R.',
    initials: 'CR',
    trade: 'HVAC, Houston TX',
    color: '#10b981',
    quote:
      'Yo hablaba español y mis propuestas salían en inglés perfecto. El cliente no sabía que yo no hablaba inglés. Cerré el trabajo de $6,200.',
    translation:
      'I spoke in Spanish and my proposals came out in perfect English. The client didn\'t know I didn\'t speak English. I closed the $6,200 job.',
  },
  {
    name: 'Jennifer K.',
    initials: 'JK',
    trade: 'General Contractor, Phoenix AZ',
    color: '#f59e0b',
    quote:
      'The AI follow-up sent a perfectly timed email to a client I had forgotten about. She called the next day and signed a $14,000 kitchen remodel.',
    translation: null,
  },
]
