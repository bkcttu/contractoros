import { Link } from 'react-router-dom'
import { Zap, FileText, Calendar, DollarSign, Users, MessageSquare, Star, Check, ArrowRight, Menu, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function LandingPageES() {
  const scrollRef = useScrollReveal()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div ref={scrollRef} className="min-h-screen bg-white scroll-smooth">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/es" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-navy">ContractorOS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#caracteristicas" className="hover:text-navy transition-colors">Características</a>
            <a href="#precios" className="hover:text-navy transition-colors">Precios</a>
            <Link to="/" className="hover:text-navy transition-colors">English</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/sign-in" className="text-sm font-medium text-gray-600 hover:text-navy">Iniciar Sesión</Link>
            <Link to="/sign-up" className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-600 transition-colors">
              Empieza Gratis
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6 text-navy" /> : <Menu className="h-6 w-6 text-navy" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-6 pt-4">
            <div className="flex flex-col gap-4">
              <a href="#caracteristicas" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-600">Características</a>
              <a href="#precios" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-600">Precios</a>
              <Link to="/" className="text-sm font-medium text-gray-600">English</Link>
              <hr className="border-gray-100" />
              <Link to="/sign-in" className="text-sm font-medium text-gray-600">Iniciar Sesión</Link>
              <Link to="/sign-up" className="text-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white">Empieza Gratis</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80&auto=format" alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold tracking-wide text-white/80">PLATAFORMA IMPULSADA POR IA</span>
            </div>
            <h1 className="fade-in-up font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Propuestas Profesionales en Inglés.{' '}
              <span className="gradient-text">Tú Trabajas en Español.</span>
            </h1>
            <p className="fade-in-up mt-6 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
              Describe el trabajo en español — la IA escribe una propuesta profesional en inglés en 60 segundos.
              Tus clientes nunca sabrán que no lo escribiste tú.
            </p>
            <div className="fade-in-up mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/sign-up" className="btn-press inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 font-heading text-base font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-600 transition-all">
                Prueba Gratis 14 Días
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#caracteristicas" className="btn-press inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-heading text-base font-semibold text-white hover:bg-white/5 transition-all">
                Ver Cómo Funciona
              </a>
            </div>
            <p className="fade-in-up mt-4 text-sm text-white/40">Sin tarjeta de crédito. Sin compromiso.</p>
            <div className="fade-in-up mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="flex -space-x-2">
                {['https://randomuser.me/api/portraits/men/32.jpg','https://randomuser.me/api/portraits/women/44.jpg','https://randomuser.me/api/portraits/men/67.jpg','https://randomuser.me/api/portraits/women/17.jpg'].map((src, i) => (
                  <img key={i} src={src} alt="" className="h-8 w-8 rounded-full border-2 border-navy object-cover" />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-white/50">Usado por 2,000+ contratistas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="caracteristicas" className="py-24 sm:py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="fade-in-up text-sm font-semibold tracking-wide text-accent">TODO LO QUE NECESITAS</p>
            <h2 className="fade-in-up mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-navy">
              Una plataforma para todo tu negocio
            </h2>
            <p className="fade-in-up mt-4 text-lg text-gray-500">
              Deja de usar 5 apps diferentes. ContractorOS las reemplaza todas.
            </p>
          </div>
          <div className="stagger-children grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Propuestas con IA', desc: 'Escribe en español, la propuesta sale en inglés profesional. Lista en 60 segundos.', color: 'bg-accent/10 text-accent' },
              { icon: Calendar, title: 'Agenda Inteligente', desc: 'Tus clientes reservan en línea. Se sincroniza con Google Calendar automáticamente.', color: 'bg-blue-50 text-blue-600' },
              { icon: DollarSign, title: 'Facturas en Un Clic', desc: 'Convierte propuestas aceptadas en facturas al instante. Cobra más rápido.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Users, title: 'Portal del Cliente', desc: 'Clientes ven, firman y pagan — sin necesidad de crear cuenta.', color: 'bg-violet-50 text-violet-600' },
              { icon: MessageSquare, title: 'Seguimientos con IA', desc: 'Nunca pierdas un trabajo por silencio. Mensajes automáticos en el momento justo.', color: 'bg-amber-50 text-amber-600' },
              { icon: Star, title: 'Reseñas Automáticas', desc: 'Consigue reseñas de 5 estrellas en piloto automático después de cada trabajo.', color: 'bg-rose-50 text-rose-600' },
            ].map((f) => (
              <div key={f.title} className="card-hover group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition">
                <div className={cn('mb-5 flex h-12 w-12 items-center justify-center rounded-xl', f.color)}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGITIMACY */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="fade-in-up text-sm font-semibold tracking-wide text-accent">TU NEGOCIO SE VE PROFESIONAL</p>
              <h2 className="fade-in-up mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-navy">
                Propuestas que se ven de empresa grande. Hechas en tu teléfono.
              </h2>
              <p className="fade-in-up mt-4 text-lg text-gray-500">
                No importa si eres un equipo de uno o de diez. Tus propuestas se verán como si tuvieras un departamento de ventas profesional.
              </p>
              <ul className="fade-in-up mt-8 space-y-4">
                {[
                  'Tu licencia visible en cada documento',
                  'Logo y marca propios en todas las propuestas',
                  'Portal profesional para tus clientes',
                  'Funciona en inglés Y español',
                  'Firma electrónica incluida',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="fade-in-up">
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80&auto=format" alt="Contratista usando tablet" className="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" className="py-24 sm:py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="fade-in-up font-heading text-3xl sm:text-4xl font-extrabold text-navy">
              Precios Simples y Honestos
            </h2>
            <p className="fade-in-up mt-4 text-lg text-gray-500">Sin contratos. Sin cargos ocultos. Cancela cuando quieras.</p>
          </div>
          <div className="stagger-children grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Gratis', price: '$0', period: '', desc: 'Para empezar', features: ['5 propuestas al mes', 'Descarga en PDF', 'Firma electrónica', '1 usuario'], cta: 'Empieza Gratis', popular: false },
              { name: 'Pro', price: '$79', period: '/mes', desc: 'Todo lo que necesitas', features: ['Propuestas ilimitadas', 'IA para seguimientos', 'Sitio web incluido', 'Portal del cliente', 'Facturas y pagos', 'Reseñas automáticas', 'Funciona en español'], cta: 'Prueba Gratis', popular: true },
              { name: 'Equipo', price: '$149', period: '/mes', desc: 'Para equipos en crecimiento', features: ['Todo lo de Pro', 'Hasta 5 usuarios', 'Agenda de equipo', 'Reportes avanzados', 'Soporte prioritario'], cta: 'Prueba Gratis', popular: false },
            ].map((plan) => (
              <div key={plan.name} className={cn('relative rounded-2xl p-8 flex flex-col', plan.popular ? 'border-2 border-accent bg-white shadow-xl shadow-accent/10 scale-105' : 'border border-gray-200 bg-white')}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wider">
                    Más Popular
                  </div>
                )}
                <h3 className="text-xl font-heading font-bold text-navy">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-bold text-navy font-mono">{plan.price}</span>
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
                <Link to="/sign-up" className={cn('mt-8 inline-flex items-center justify-center px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-all', plan.popular ? 'bg-accent text-white hover:bg-accent-600 shadow-lg shadow-accent/20' : 'bg-navy text-white hover:bg-navy-600')}>
                  {plan.cta} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="fade-in-up text-center font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-16">
            Lo Que Dicen Nuestros Contratistas
          </h2>
          <div className="stagger-children grid sm:grid-cols-3 gap-8">
            {[
              { quote: 'Hablé en español, la propuesta salió en inglés perfecto. Mi cliente pensó que tenía una empresa grande. Ya no pierdo trabajos por el idioma.', name: 'Carlos R.', trade: 'Contratista HVAC, Houston TX', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
              { quote: 'Antes me tardaba 2 horas escribiendo propuestas después del trabajo. Ahora lo hago en 60 segundos desde mi troca. Mi tasa de cierre subió 40%.', name: 'Juan M.', trade: 'Techador, Dallas TX', photo: 'https://randomuser.me/api/portraits/men/67.jpg' },
              { quote: 'ContractorOS se pagó solo la primera semana. Una propuesta que envié se firmó en una hora. El cliente dijo que era la cotización más profesional que había visto.', name: 'María S.', trade: 'Contratista General, Phoenix AZ', photo: 'https://randomuser.me/api/portraits/women/32.jpg' },
            ].map((t) => (
              <div key={t.name} className="card-hover bg-[#F8F9FA] rounded-2xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                  <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-heading text-sm font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.trade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-32 bg-navy relative overflow-hidden noise-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.15),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="fade-in-up font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            ¿Listo Para Que Tus Propuestas{' '}
            <span className="gradient-text">Hablen Por Ti?</span>
          </h2>
          <p className="fade-in-up mt-6 text-lg text-white/60">
            Tu trabajo habla por sí solo. Ahora tus propuestas también.
          </p>
          <div className="fade-in-up mt-10">
            <Link to="/sign-up" className="btn-press inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-5 font-heading text-lg font-bold text-white shadow-lg shadow-accent/30 hover:bg-accent-600 transition-all">
              Empieza Tu Prueba Gratis <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="fade-in-up mt-4 text-sm text-white/40">14 días gratis. Sin tarjeta de crédito.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-accent" />
              <span className="text-lg font-heading font-bold text-navy">ContractorOS</span>
            </div>
            <p className="text-sm text-gray-400">
              La única herramienta de negocio que un contratista necesitará.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-navy transition-colors">English</Link>
              <Link to="/precios" className="hover:text-navy transition-colors">Precios</Link>
              <Link to="/sign-up" className="hover:text-navy transition-colors">Registrarse</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} ContractorOS. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
