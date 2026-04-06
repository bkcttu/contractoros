// ContractorOS Pricing Constants
// All plan data in one place for easy updates

export const WIN_RATE_IMPROVEMENT = 0.22

export interface PlanFeature {
  text: string
  textEs: string
  included: boolean
}

export interface PricingPlan {
  id: string
  name: string
  nameEs: string
  label: string
  monthlyPrice: number
  annualPrice: number
  annualMonthly: number
  annualSavings: number
  subtitle: string
  subtitleEs: string
  features: PlanFeature[]
  ctaText: string
  ctaTextEs: string
  ctaStyle: 'outline' | 'solid'
  popular: boolean
  fineprint: string
  fineprintEs: string
  stripePriceIds: {
    monthly: string
    annual: string
  }
}

export const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameEs: 'Gratis',
    label: 'FREE',
    monthlyPrice: 0,
    annualPrice: 0,
    annualMonthly: 0,
    annualSavings: 0,
    subtitle: 'No credit card. No catch.',
    subtitleEs: 'Sin tarjeta. Sin trampa.',
    features: [
      { text: '3 AI proposals per month', textEs: '3 propuestas con IA al mes', included: true },
      { text: 'PDF download', textEs: 'Descarga en PDF', included: true },
      { text: 'Client e-signature', textEs: 'Firma electrónica del cliente', included: true },
      { text: 'Basic dashboard', textEs: 'Panel básico', included: true },
      { text: 'ContractorOS watermark on proposals', textEs: 'Marca de agua de ContractorOS', included: false },
      { text: 'No follow-up automation', textEs: 'Sin automatización de seguimientos', included: false },
      { text: 'No scheduling', textEs: 'Sin agenda', included: false },
      { text: 'No website', textEs: 'Sin sitio web', included: false },
    ],
    ctaText: 'Start Free',
    ctaTextEs: 'Empieza Gratis',
    ctaStyle: 'outline',
    popular: false,
    fineprint: 'Watermark removed when you upgrade',
    fineprintEs: 'La marca de agua se quita al mejorar tu plan',
    stripePriceIds: { monthly: '', annual: '' },
  },
  {
    id: 'starter',
    name: 'Starter',
    nameEs: 'Inicial',
    label: 'STARTER',
    monthlyPrice: 39,
    annualPrice: 390,
    annualMonthly: 32.5,
    annualSavings: 78,
    subtitle: 'Less than a tank of gas.',
    subtitleEs: 'Menos que un tanque de gasolina.',
    features: [
      { text: '20 AI proposals per month', textEs: '20 propuestas con IA al mes', included: true },
      { text: 'Your branding — no watermark', textEs: 'Tu marca — sin marca de agua', included: true },
      { text: 'PDF with logo + signature', textEs: 'PDF con logo y firma', included: true },
      { text: 'Client e-signature + portal', textEs: 'Firma electrónica + portal del cliente', included: true },
      { text: 'Email follow-ups (manual)', textEs: 'Seguimientos por email (manual)', included: true },
      { text: 'Basic scheduling', textEs: 'Agenda básica', included: true },
      { text: 'Invoice generator', textEs: 'Generador de facturas', included: true },
      { text: 'Unlimited proposals', textEs: 'Propuestas ilimitadas', included: false },
      { text: 'AI follow-up automation', textEs: 'Automatización IA de seguimientos', included: false },
      { text: 'Pricing intelligence', textEs: 'Inteligencia de precios', included: false },
      { text: 'Mini website', textEs: 'Mini sitio web', included: false },
    ],
    ctaText: 'Start Free Trial',
    ctaTextEs: 'Prueba Gratis',
    ctaStyle: 'outline',
    popular: false,
    fineprint: '14-day free trial · No card required',
    fineprintEs: 'Prueba gratis 14 días · Sin tarjeta',
    stripePriceIds: { monthly: 'price_starter_monthly', annual: 'price_starter_annual' },
  },
  {
    id: 'pro',
    name: 'Pro',
    nameEs: 'Pro',
    label: 'PRO',
    monthlyPrice: 79,
    annualPrice: 790,
    annualMonthly: 65.83,
    annualSavings: 158,
    subtitle: 'Everything you need. Nothing you don\'t.',
    subtitleEs: 'Todo lo que necesitas. Nada que no.',
    features: [
      { text: 'UNLIMITED AI proposals', textEs: 'Propuestas IA ILIMITADAS', included: true },
      { text: 'Voice-to-proposal (speak, it writes)', textEs: 'Voz a propuesta (habla y se escribe)', included: true },
      { text: 'Photo-to-proposal (AI reads job site)', textEs: 'Foto a propuesta (IA lee el sitio)', included: true },
      { text: 'Rich proposals — photos, links, QR codes', textEs: 'Propuestas ricas — fotos, links, códigos QR', included: true },
      { text: 'Logo + signature on PDF', textEs: 'Logo + firma en PDF', included: true },
      { text: 'AI follow-up automation', textEs: 'Automatización IA de seguimientos', included: true },
      { text: 'Hot lead alerts', textEs: 'Alertas de prospectos calientes', included: true },
      { text: 'Market pricing intelligence', textEs: 'Inteligencia de precios del mercado', included: true },
      { text: 'Client scheduling & booking', textEs: 'Agenda y reservas de clientes', included: true },
      { text: 'Invoice + Stripe payments', textEs: 'Facturas + pagos con Stripe', included: true },
      { text: 'AI-written follow-up emails', textEs: 'Emails de seguimiento escritos por IA', included: true },
      { text: 'Review request automation', textEs: 'Automatización de solicitudes de reseñas', included: true },
      { text: 'Your own mini-website', textEs: 'Tu propio mini sitio web', included: true },
      { text: 'AI Business Coach', textEs: 'Asesor de negocios IA', included: true },
      { text: 'Works in English AND Spanish', textEs: 'Funciona en inglés Y español', included: true },
      { text: 'WhatsApp integration', textEs: 'Integración con WhatsApp', included: true },
    ],
    ctaText: 'Start Free Trial',
    ctaTextEs: 'Prueba Gratis',
    ctaStyle: 'solid',
    popular: true,
    fineprint: '14-day free trial · No card required · Cancel anytime',
    fineprintEs: 'Prueba gratis 14 días · Sin tarjeta · Cancela cuando quieras',
    stripePriceIds: { monthly: 'price_pro_monthly', annual: 'price_pro_annual' },
  },
  {
    id: 'team',
    name: 'Team',
    nameEs: 'Equipo',
    label: 'TEAM',
    monthlyPrice: 149,
    annualPrice: 1490,
    annualMonthly: 124.17,
    annualSavings: 298,
    subtitle: 'For growing crews.',
    subtitleEs: 'Para equipos en crecimiento.',
    features: [
      { text: 'Everything in Pro', textEs: 'Todo lo de Pro', included: true },
      { text: 'Up to 5 users', textEs: 'Hasta 5 usuarios', included: true },
      { text: 'Crew mobile app', textEs: 'App móvil para tu equipo', included: true },
      { text: 'GPS job tracking', textEs: 'Rastreo GPS de trabajos', included: true },
      { text: 'Dispatch board', textEs: 'Tablero de despacho', included: true },
      { text: 'Subcontractor management', textEs: 'Gestión de subcontratistas', included: true },
      { text: 'Job costing (estimate vs actual)', textEs: 'Costeo de trabajos (estimado vs real)', included: true },
      { text: 'QuickBooks sync', textEs: 'Sincronización con QuickBooks', included: true },
      { text: 'Team performance reports', textEs: 'Reportes de rendimiento del equipo', included: true },
      { text: 'Priority support', textEs: 'Soporte prioritario', included: true },
    ],
    ctaText: 'Start Free Trial',
    ctaTextEs: 'Prueba Gratis',
    ctaStyle: 'outline',
    popular: false,
    fineprint: '14-day free trial · No card required',
    fineprintEs: 'Prueba gratis 14 días · Sin tarjeta',
    stripePriceIds: { monthly: 'price_team_monthly', annual: 'price_team_annual' },
  },
]

export interface ComparisonRow {
  feature: string
  featureEs: string
  contractorOS: boolean | string
  jobber: boolean | string
  housecallPro: boolean | string
}

export const COMPARISON_DATA: ComparisonRow[] = [
  { feature: 'AI proposal writing', featureEs: 'Propuestas escritas por IA', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Voice-to-proposal', featureEs: 'Voz a propuesta', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Photo-to-proposal', featureEs: 'Foto a propuesta', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Photos on line items', featureEs: 'Fotos en líneas de items', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Works in Spanish', featureEs: 'Funciona en español', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'WhatsApp integration', featureEs: 'Integración WhatsApp', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Market pricing intel', featureEs: 'Inteligencia de precios', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'AI follow-up automation', featureEs: 'Seguimientos automáticos IA', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Hot lead alerts', featureEs: 'Alertas de prospectos calientes', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Built-in website', featureEs: 'Sitio web incluido', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'AI Business Coach', featureEs: 'Asesor de negocios IA', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Proposal analytics', featureEs: 'Analíticas de propuestas', contractorOS: true, jobber: false, housecallPro: false },
  { feature: 'Review automation', featureEs: 'Automatización de reseñas', contractorOS: true, jobber: 'Basic', housecallPro: 'Basic' },
  { feature: 'E-signature', featureEs: 'Firma electrónica', contractorOS: true, jobber: true, housecallPro: true },
  { feature: 'Scheduling', featureEs: 'Agenda', contractorOS: true, jobber: true, housecallPro: true },
  { feature: 'Invoicing', featureEs: 'Facturación', contractorOS: true, jobber: true, housecallPro: true },
  { feature: 'Monthly price', featureEs: 'Precio mensual', contractorOS: '$79', jobber: '$169', housecallPro: '$149' },
]

export interface FAQItem {
  question: string
  questionEs: string
  answer: string
  answerEs: string
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Do I need a credit card to start?',
    questionEs: '¿Necesito tarjeta de crédito para empezar?',
    answer: 'No. Your 14-day free trial starts the moment you sign up. No card, no commitment. If you decide to upgrade, we\'ll ask for payment then.',
    answerEs: 'No. Tu prueba gratis de 14 días comienza en el momento en que te registras. Sin tarjeta, sin compromiso. Si decides mejorar tu plan, te pediremos el pago en ese momento.',
  },
  {
    question: 'Can I cancel anytime?',
    questionEs: '¿Puedo cancelar cuando quiera?',
    answer: 'Yes. No contracts, no cancellation fees. Cancel in 2 clicks from your settings page. We won\'t guilt-trip you.',
    answerEs: 'Sí. Sin contratos, sin cargos por cancelación. Cancela en 2 clics desde tu página de configuración.',
  },
  {
    question: 'What if I primarily speak Spanish?',
    questionEs: '¿Qué pasa si hablo principalmente español?',
    answer: 'ContractorOS works completely in Spanish. You type or speak in Spanish — your clients receive perfect professional English. The entire app interface switches to Spanish in one click.',
    answerEs: 'ContractorOS funciona completamente en español. Escribes o hablas en español — tus clientes reciben inglés profesional perfecto. Toda la interfaz de la app cambia a español con un solo clic.',
  },
  {
    question: 'What trades does this work for?',
    questionEs: '¿Para qué oficios funciona?',
    answer: 'HVAC, Roofing, Plumbing, Electrical, Landscaping, Painting, Concrete, Drywall, Tile, Fencing, General Contracting, Pest Control, Irrigation, Pool & Spa, and Handyman. Each trade has its own AI trained in that trade\'s language and line items.',
    answerEs: 'HVAC, Techos, Plomería, Electricidad, Paisajismo, Pintura, Concreto, Tablarroca, Azulejo, Cercas, Contratista General, Control de Plagas, Irrigación, Piscinas y Spa, y Handyman. Cada oficio tiene su propia IA entrenada en el lenguaje y los artículos de ese oficio.',
  },
  {
    question: 'How is this different from Jobber?',
    questionEs: '¿En qué se diferencia de Jobber?',
    answer: 'Jobber is scheduling software with basic quoting. ContractorOS is an AI-powered proposal and closing platform with scheduling built in. We have 14 features Jobber doesn\'t offer — at half the price. The biggest difference: our AI writes your proposals, follows up with your leads, and tells you exactly when to call.',
    answerEs: 'Jobber es un software de agenda con cotizaciones básicas. ContractorOS es una plataforma de propuestas y cierre de ventas impulsada por IA con agenda incluida. Tenemos 14 funciones que Jobber no ofrece — a la mitad del precio.',
  },
  {
    question: 'Will my proposals really look that much better?',
    questionEs: '¿Mis propuestas realmente se verán mucho mejor?',
    answer: 'Yes. We built the proposal system to match the quality of proposals sent by companies 100x your size — with your logo, your photos, your signature, and professional language for your specific trade.',
    answerEs: 'Sí. Construimos el sistema de propuestas para igualar la calidad de las propuestas enviadas por empresas 100 veces más grandes que la tuya — con tu logo, tus fotos, tu firma y lenguaje profesional para tu oficio específico.',
  },
  {
    question: 'What does the annual plan include?',
    questionEs: '¿Qué incluye el plan anual?',
    answer: 'Same features as monthly — you just pay for 10 months and get 2 months free. That\'s $158 back in your pocket on Pro. Annual members also get priority support and early access to new features.',
    answerEs: 'Las mismas funciones que el mensual — solo pagas 10 meses y obtienes 2 meses gratis. Eso son $158 de regreso en tu bolsillo con Pro. Los miembros anuales también reciben soporte prioritario y acceso anticipado a nuevas funciones.',
  },
  {
    question: 'Is my data secure?',
    questionEs: '¿Mis datos están seguros?',
    answer: 'Yes. All data encrypted in transit and at rest. We never sell your data or your clients\' data. Your proposals, client info, and business data belong to you — always.',
    answerEs: 'Sí. Todos los datos están cifrados en tránsito y en reposo. Nunca vendemos tus datos ni los de tus clientes. Tus propuestas, información de clientes y datos de negocio son tuyos — siempre.',
  },
]

export function calculateROI(jobValue: number, proposalsPerMonth: number, currentWinRate: number) {
  const newWinRate = Math.min(currentWinRate + WIN_RATE_IMPROVEMENT, 0.95)
  const currentJobs = proposalsPerMonth * currentWinRate
  const newJobs = proposalsPerMonth * newWinRate
  const extraJobs = newJobs - currentJobs
  const extraRevenue = extraJobs * jobValue
  const monthlyCost = 79
  const netGain = extraRevenue - monthlyCost
  const roi = monthlyCost > 0 ? ((extraRevenue - monthlyCost) / monthlyCost) * 100 : 0

  return {
    newWinRate: Math.round(newWinRate * 100),
    extraJobs: Math.round(extraJobs * 10) / 10,
    extraRevenue: Math.round(extraRevenue),
    monthlyCost,
    netGain: Math.round(netGain),
    roi: Math.round(roi),
  }
}
