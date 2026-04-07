import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Wrench,
  Thermometer,
  Home,
  Zap as ZapIcon,
  Leaf,
  Paintbrush,
  Hammer,
  TreePine,
  Paintbrush2,
  Plus,
  Loader2,
  Download,
  Send,
  Copy,
  MessageCircle,
  Mail,
  Check,
  Mic,
  DollarSign,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { APP_NAME } from '@/lib/branding'

// ---------------------------------------------------------------------------
// Trade options
// ---------------------------------------------------------------------------
const TRADES = [
  { id: 'landscaping', label: 'Jardinería', labelEn: 'Landscaping', icon: Leaf },
  { id: 'plumbing', label: 'Plomería', labelEn: 'Plumbing', icon: Wrench },
  { id: 'roofing', label: 'Techos', labelEn: 'Roofing', icon: Home },
  { id: 'painting', label: 'Pintura', labelEn: 'Painting', icon: Paintbrush },
  { id: 'hvac', label: 'Aire Acondicionado', labelEn: 'HVAC', icon: Thermometer },
  { id: 'tree_service', label: 'Árboles', labelEn: 'Tree Service', icon: TreePine },
  { id: 'cleaning', label: 'Limpieza', labelEn: 'Cleaning', icon: Paintbrush2 },
  { id: 'electrical', label: 'Electricidad', labelEn: 'Electrical', icon: ZapIcon },
  { id: 'handyman', label: 'Reparaciones', labelEn: 'Handyman', icon: Hammer },
  { id: 'other', label: 'Otro', labelEn: 'Other', icon: Plus },
]

// ---------------------------------------------------------------------------
// Demo fallback
// ---------------------------------------------------------------------------
function getDemoProposal(
  trade: string,
  description: string,
  materials: number,
  labor: number,
  clientName: string,
): string {
  const total = materials + labor
  return `# Professional ${trade} Proposal

**Prepared for:** ${clientName}
**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## Scope of Work

${description || 'Complete the described work according to industry standards and best practices.'}

## Investment

| Item | Amount |
|------|--------|
| Materials | $${materials.toLocaleString()} |
| Labor | $${labor.toLocaleString()} |
| **Total** | **$${total.toLocaleString()}** |

## Terms

- 50% deposit due upon acceptance
- Balance due upon completion
- Work to begin within 5 business days of acceptance

---

We look forward to working with you. Please sign below to accept this proposal.`
}

// ---------------------------------------------------------------------------
// Simple markdown renderer (no external deps)
// ---------------------------------------------------------------------------
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-xl font-semibold mt-4 mb-1">{line.slice(3)}</h2>)
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} className="my-3 border-border" />)
    } else if (line.startsWith('- ')) {
      elements.push(<li key={key++} className="ml-5 list-disc text-sm">{line.slice(2)}</li>)
    } else if (line.startsWith('| ')) {
      const cells = line.split('|').filter(c => c.trim() !== '')
      if (cells.every(c => /^[-\s]+$/.test(c))) continue
      elements.push(
        <div key={key++} className="grid gap-1 text-sm" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
          {cells.map((c, ci) => (
            <span key={ci} className={cn('px-2 py-1 border-b border-border', c.includes('**') && 'font-semibold')}>
              {c.replace(/\*\*/g, '').trim()}
            </span>
          ))}
        </div>,
      )
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    } else {
      const rendered = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
      elements.push(
        <p key={key++} className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: rendered }} />,
      )
    }
  }
  return elements
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function NewProposal() {
  const navigate = useNavigate()

  // Step
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1
  const [selectedTrade, setSelectedTrade] = useState('')

  // Step 2
  const [description, setDescription] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')

  // Step 3
  const [materials, setMaterials] = useState('')
  const [labor, setLabor] = useState('')

  // Step 4 / 5
  const [proposalText, setProposalText] = useState('')
  const [proposalId, setProposalId] = useState<string | null>(null)
  const [showSendOptions, setShowSendOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  const materialsNum = parseFloat(materials) || 0
  const laborNum = parseFloat(labor) || 0
  const total = materialsNum + laborNum

  const selectedTradeObj = TRADES.find(t => t.id === selectedTrade)

  // -------------------------------------------------------------------------
  // Generate proposal
  // -------------------------------------------------------------------------
  async function handleGenerate() {
    setCurrentStep(4)
    setProposalText('')

    try {
      const isEmail = clientContact.includes('@')
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 30)

      const formData = {
        clientName,
        clientEmail: isEmail ? clientContact : '',
        clientPhone: !isEmail ? clientContact : '',
        jobAddress: '',
        jobDescription: `[${selectedTradeObj?.labelEn ?? selectedTrade}] ${description}`,
        materialsCost: materialsNum,
        laborCost: laborNum,
        projectDuration: '1-3 days',
        paymentTerms: '50_upfront' as const,
        warranty: '1 year',
        specialNotes: '',
        expirationDate: expiry.toISOString().split('T')[0],
      }

      const result = await api.createProposal(formData)
      const id = result.proposal.id
      setProposalId(id)

      let fullText = ''
      for await (const chunk of api.generateProposal(id)) {
        fullText += chunk
        setProposalText(fullText)
      }

      setCurrentStep(5)
    } catch {
      const demo = getDemoProposal(
        selectedTradeObj?.labelEn ?? selectedTrade,
        description,
        materialsNum,
        laborNum,
        clientName,
      )
      setProposalText(demo)
      setCurrentStep(5)
    }
  }

  // -------------------------------------------------------------------------
  // Copy link
  // -------------------------------------------------------------------------
  function handleCopyLink() {
    const url = proposalId
      ? `${window.location.origin}/p/${proposalId}`
      : window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // -------------------------------------------------------------------------
  // WhatsApp
  // -------------------------------------------------------------------------
  function handleWhatsApp() {
    const url = proposalId ? `${window.location.origin}/p/${proposalId}` : window.location.href
    const msg = encodeURIComponent(`Hola ${clientName}, aquí está tu propuesta: ${url}`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  // -------------------------------------------------------------------------
  // Email
  // -------------------------------------------------------------------------
  async function handleEmail() {
    if (!proposalId) return
    try {
      await api.sendProposal(proposalId)
    } catch {
      // ignore
    }
    setShowSendOptions(false)
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        {currentStep > 1 && currentStep < 4 && (
          <button
            onClick={() => setCurrentStep(s => s - 1)}
            className="p-2 rounded-full hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {(currentStep === 1 || currentStep >= 4) && (
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        )}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{APP_NAME}</p>
          <p className="text-base font-semibold leading-tight">
            {currentStep === 1 && 'Nueva Propuesta'}
            {currentStep === 2 && 'El Trabajo'}
            {currentStep === 3 && 'El Precio'}
            {currentStep === 4 && 'Generando...'}
            {currentStep === 5 && 'Tu Propuesta'}
          </p>
        </div>
        {currentStep <= 3 && (
          <div className="flex gap-1.5">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  s === currentStep ? 'bg-primary' : s < currentStep ? 'bg-primary/50' : 'bg-muted',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STEP 1 — Trade Selection                                            */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 1 && (
        <div className="px-4 pt-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">¿Qué tipo de trabajo?</h1>
          <p className="text-muted-foreground text-sm mb-6">What type of work?</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {TRADES.map(trade => {
              const Icon = trade.icon
              const selected = selectedTrade === trade.id
              return (
                <button
                  key={trade.id}
                  onClick={() => setSelectedTrade(trade.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 min-h-[90px] transition-all',
                    selected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted',
                  )}
                >
                  <Icon className={cn('w-7 h-7', selected && 'text-primary')} />
                  <div className="text-center">
                    <p className="text-sm font-semibold leading-tight">{trade.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{trade.labelEn}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <Button
            size="lg"
            className="w-full text-base min-h-[52px]"
            disabled={!selectedTrade}
            onClick={() => setCurrentStep(2)}
          >
            Siguiente <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 2 — Job Description                                            */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 2 && (
        <div className="px-4 pt-6 max-w-2xl mx-auto space-y-5">
          <div>
            <h1 className="text-2xl font-bold mb-1">Describe el trabajo</h1>
            <p className="text-muted-foreground text-sm">Describe the job</p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              ¿Qué hiciste? <span className="text-muted-foreground font-normal text-sm">/ What did you do?</span>
            </Label>
            <div className="relative">
              <Textarea
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={"Describe el trabajo con tus palabras...\nEj: limpié 5 árboles de palma y corté el pasto en una casa en Odessa"}
                className="text-base resize-none pr-12"
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Dictar (próximamente)"
              >
                <Mic className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-base font-semibold">
              Nombre del cliente <span className="text-muted-foreground font-normal text-sm">/ Client name</span>
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="Ej: Juan García"
              className="text-base min-h-[48px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientContact" className="text-base font-semibold">
              Email o teléfono <span className="text-muted-foreground font-normal text-sm">/ Email or phone</span>
            </Label>
            <Input
              id="clientContact"
              value={clientContact}
              onChange={e => setClientContact(e.target.value)}
              placeholder="Ej: juan@email.com  ó  555-123-4567"
              className="text-base min-h-[48px]"
              type="text"
              inputMode="email"
            />
          </div>

          <Button
            size="lg"
            className="w-full text-base min-h-[52px]"
            disabled={!description.trim() || !clientName.trim() || !clientContact.trim()}
            onClick={() => setCurrentStep(3)}
          >
            Siguiente <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 3 — Pricing                                                    */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 3 && (
        <div className="px-4 pt-6 max-w-2xl mx-auto space-y-5">
          <div>
            <h1 className="text-2xl font-bold mb-1">¿Cuánto cobras?</h1>
            <p className="text-muted-foreground text-sm">How much do you charge?</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials" className="text-base font-semibold">
              Materiales <span className="text-muted-foreground font-normal text-sm">/ Materials</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="materials"
                value={materials}
                onChange={e => setMaterials(e.target.value)}
                placeholder="0"
                className="pl-9 text-lg min-h-[52px]"
                type="number"
                inputMode="decimal"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="labor" className="text-base font-semibold">
              Mano de obra <span className="text-muted-foreground font-normal text-sm">/ Labor</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="labor"
                value={labor}
                onChange={e => setLabor(e.target.value)}
                placeholder="0"
                className="pl-9 text-lg min-h-[52px]"
                type="number"
                inputMode="decimal"
                min="0"
              />
            </div>
          </div>

          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="py-4 px-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Total</p>
                <p className="text-xs text-muted-foreground">Total del proyecto</p>
              </div>
              <p className="text-3xl font-bold text-primary">{formatCurrency(total)}</p>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full text-base min-h-[56px] gap-2"
            onClick={handleGenerate}
          >
            <Sparkles className="w-5 h-5" />
            Generar Propuesta
          </Button>
          <p className="text-center text-xs text-muted-foreground">Generate Proposal</p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 4 — Generating (loading)                                       */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 4 && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
          <div className="relative mb-8">
            <Sparkles className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-2">Hecho AI está escribiendo tu propuesta...</h2>
          <p className="text-muted-foreground text-sm mb-8">Hecho AI is writing your proposal...</p>
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 5 — Preview + Send                                             */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 5 && (
        <div className="px-4 pt-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Tu Propuesta</h1>
          <p className="text-muted-foreground text-sm mb-4">Your Proposal</p>

          <Card className="mb-6">
            <CardContent className="p-5 prose prose-sm max-w-none">
              {proposalText ? renderMarkdown(proposalText) : (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Cargando...</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 mb-4">
            <Button
              size="lg"
              className="w-full text-base min-h-[52px] gap-2"
              onClick={() => setShowSendOptions(true)}
            >
              <Send className="w-5 h-5" />
              Enviar / Send
            </Button>

            {proposalId && (
              <Button
                size="lg"
                variant="outline"
                className="w-full text-base min-h-[52px] gap-2"
                onClick={() => window.open(api.getProposalPdfUrl(proposalId), '_blank')}
              >
                <Download className="w-5 h-5" />
                Descargar PDF / Download PDF
              </Button>
            )}

            <Button
              size="lg"
              variant="ghost"
              className="w-full text-base min-h-[52px]"
              onClick={() => setCurrentStep(2)}
            >
              ✏️ Editar / Edit
            </Button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Send options bottom sheet                                           */}
      {/* ------------------------------------------------------------------ */}
      {showSendOptions && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSendOptions(false)}
          />
          <div className="relative w-full bg-background rounded-t-2xl p-6 space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold">Enviar propuesta</h3>
                <p className="text-sm text-muted-foreground">Send proposal</p>
              </div>
              <button
                onClick={() => setShowSendOptions(false)}
                className="p-2 rounded-full hover:bg-muted min-w-[44px] min-h-[44px] flex items-center justify-center text-xl"
              >
                ✕
              </button>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors min-h-[64px]"
            >
              <MessageCircle className="w-6 h-6 text-[#25D366] flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-base">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Enviar por WhatsApp</p>
              </div>
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted hover:bg-muted/80 border border-border transition-colors min-h-[64px]"
            >
              <Mail className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-base">Email</p>
                <p className="text-sm text-muted-foreground">
                  {clientContact.includes('@') ? clientContact : 'Enviar por email'}
                </p>
              </div>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted hover:bg-muted/80 border border-border transition-colors min-h-[64px]"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <Copy className="w-6 h-6 text-muted-foreground flex-shrink-0" />
              )}
              <div className="text-left">
                <p className="font-semibold text-base">{copied ? '¡Copiado!' : 'Copiar enlace'}</p>
                <p className="text-sm text-muted-foreground">Copy link</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
