import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  ChevronRight,
  User,
  Briefcase,
  FileCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  DollarSign,
  Wand2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  FileText,
  CreditCard,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import type { PaymentTerms, TradeType } from '@/types'

const STEPS = [
  { id: 1, label: 'Client Info', icon: User },
  { id: 2, label: 'Job Details', icon: Briefcase },
  { id: 3, label: 'Review & Generate', icon: FileCheck },
] as const

const TRADE_LABELS: Record<TradeType, string> = {
  hvac: 'HVAC',
  roofing: 'Roofing',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  painting: 'Painting',
  landscaping: 'Landscaping',
  general: 'General Contracting',
}

const PAYMENT_LABELS: Record<PaymentTerms, string> = {
  '50_upfront': '50% Upfront / 50% on Completion',
  net_30: 'Net 30',
  due_on_completion: 'Due on Completion',
  custom: 'Custom',
}

function getDefaultExpiration() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function getDemoProposalText(trade: TradeType, clientName: string, description: string): string {
  const tradeName = TRADE_LABELS[trade] || 'General Contracting'
  return `PROFESSIONAL ${tradeName.toUpperCase()} PROPOSAL

Prepared for: ${clientName || 'Valued Client'}

Dear ${clientName || 'Valued Client'},

Thank you for the opportunity to provide this proposal for your ${tradeName.toLowerCase()} project. We are pleased to present the following scope of work for your review and approval.

SCOPE OF WORK

${description || `Based on our thorough on-site assessment, we propose a comprehensive ${tradeName.toLowerCase()} solution tailored to meet your specific needs. Our team of licensed professionals will deliver high-quality workmanship using industry-leading materials and best practices.`}

Our approach includes:
- Complete site preparation and protection of surrounding areas
- Professional-grade materials sourced from trusted suppliers
- Expert installation by our certified technicians
- Thorough cleanup and final inspection upon completion
- Post-project walkthrough to ensure your complete satisfaction

QUALITY ASSURANCE

All work will be performed in accordance with local building codes and industry standards. Our team maintains current licenses and certifications, and we carry comprehensive liability insurance for your protection.

We stand behind our work with confidence. Should any issues arise related to our workmanship, we will address them promptly and professionally at no additional cost during the warranty period.

PROJECT TIMELINE

Work will commence within 5 business days of proposal acceptance, weather and material availability permitting. We will maintain clear communication throughout the project and provide daily progress updates.

We look forward to working with you on this project. Please do not hesitate to reach out with any questions.

Respectfully submitted,
Your Professional ${tradeName} Team`
}

export function NewProposal() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [generationDone, setGenerationDone] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState('')
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})
  const [generatedId, setGeneratedId] = useState<string | null>(null)

  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    jobAddress: '',
    tradeType: 'hvac' as TradeType,
    jobDescription: '',
    materialsCost: '',
    laborCost: '',
    projectDuration: '',
    paymentTerms: '50_upfront' as PaymentTerms,
    warranty: '',
    specialNotes: '',
    expirationDate: getDefaultExpiration(),
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear field-level error when user types
    if (stepErrors[field]) {
      setStepErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const totalCost = useMemo(() => {
    const m = parseFloat(form.materialsCost) || 0
    const l = parseFloat(form.laborCost) || 0
    return m + l
  }, [form.materialsCost, form.laborCost])

  const validateStep = useCallback(
    (step: number): boolean => {
      const errors: Record<string, string> = {}

      if (step === 1) {
        if (!form.clientName.trim()) errors.clientName = 'Client name is required'
        if (!form.clientEmail.trim()) errors.clientEmail = 'Client email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
          errors.clientEmail = 'Please enter a valid email'
      }

      if (step === 2) {
        if (!form.jobDescription.trim()) errors.jobDescription = 'Job description is required'
        if (!form.materialsCost || parseFloat(form.materialsCost) < 0)
          errors.materialsCost = 'Materials cost is required'
        if (!form.laborCost || parseFloat(form.laborCost) < 0)
          errors.laborCost = 'Labor cost is required'
      }

      setStepErrors(errors)
      return Object.keys(errors).length === 0
    },
    [form]
  )

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
      setError('')
      setStepErrors({})
      return
    }
    // Validate all steps up to the target
    for (let s = currentStep; s < step; s++) {
      if (!validateStep(s)) return
    }
    setCurrentStep(step)
    setError('')
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
      setError('')
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError('')
    setStepErrors({})
  }

  const simulateStreaming = useCallback(async () => {
    const text = getDemoProposalText(form.tradeType, form.clientName, form.jobDescription)
    const words = text.split(/(\s+)/)
    let accumulated = ''

    for (let i = 0; i < words.length; i++) {
      accumulated += words[i]
      setStreamText(accumulated)
      // Variable speed for realism
      const delay = words[i].trim() === '' ? 5 : Math.random() * 30 + 15
      await new Promise((r) => setTimeout(r, delay))
    }

    setGenerationDone(true)
  }, [form.tradeType, form.clientName, form.jobDescription])

  const handleGenerate = async () => {
    setError('')
    setGenerating(true)
    setStreamText('')
    setGenerationDone(false)

    try {
      const { proposal } = await api.createProposal({
        ...form,
        materialsCost: Number(form.materialsCost),
        laborCost: Number(form.laborCost),
      })

      setGeneratedId(proposal.id)
      setStreamText('')

      for await (const chunk of api.generateProposal(proposal.id)) {
        setStreamText((prev) => prev + chunk)
      }

      navigate(`/proposals/${proposal.id}`)
    } catch {
      // Demo/fallback mode: simulate streaming
      setGeneratedId(null)
      await new Promise((r) => setTimeout(r, 2000))
      await simulateStreaming()
    }
  }

  // -- Step Progress Indicator --
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.id
        const isComplete = currentStep > step.id
        const Icon = step.icon

        return (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => goToStep(step.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group',
                isActive && 'bg-accent/10',
                !isActive && !isComplete && 'opacity-50 hover:opacity-75',
                isComplete && 'hover:bg-accent/5 cursor-pointer'
              )}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0',
                  isActive && 'bg-accent text-white shadow-md shadow-accent/30',
                  isComplete && 'bg-accent/20 text-accent',
                  !isActive && !isComplete && 'bg-gray-200 text-gray-400'
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  'text-sm font-medium hidden sm:block transition-colors duration-300',
                  isActive && 'text-accent',
                  isComplete && 'text-navy',
                  !isActive && !isComplete && 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className="w-8 sm:w-16 mx-1">
                <div
                  className={cn(
                    'h-0.5 rounded-full transition-all duration-500',
                    currentStep > step.id ? 'bg-accent' : 'bg-gray-200'
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // -- Field Error Display --
  const FieldError = ({ field }: { field: string }) =>
    stepErrors[field] ? (
      <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">{stepErrors[field]}</p>
    ) : null

  // -- Step 1: Client Information --
  const Step1 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Who is this proposal for?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                Client Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="clientName"
                placeholder="John Smith"
                value={form.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                className={cn(stepErrors.clientName && 'border-red-300 focus-visible:ring-red-300')}
              />
              <FieldError field="clientName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                Client Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="john@example.com"
                value={form.clientEmail}
                onChange={(e) => updateField('clientEmail', e.target.value)}
                className={cn(stepErrors.clientEmail && 'border-red-300 focus-visible:ring-red-300')}
              />
              <FieldError field="clientEmail" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                Phone Number
              </Label>
              <Input
                id="clientPhone"
                type="tel"
                placeholder="(555) 123-4567"
                value={form.clientPhone}
                onChange={(e) => updateField('clientPhone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobAddress" className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                Job Site Address
              </Label>
              <Input
                id="jobAddress"
                placeholder="123 Main St, City, State"
                value={form.jobAddress}
                onChange={(e) => updateField('jobAddress', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // -- Step 2: Job Details --
  const Step2 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Describe the work. Don't worry about being perfect — AI will polish it up.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Trade Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-gray-400" />
              Trade Type
            </Label>
            <Select value={form.tradeType} onValueChange={(v) => updateField('tradeType', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(TRADE_LABELS) as [TradeType, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Job Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="jobDescription"
              placeholder="Describe the work to be done... Don't worry about being perfect — AI will polish it up."
              rows={5}
              value={form.jobDescription}
              onChange={(e) => updateField('jobDescription', e.target.value)}
              className={cn(stepErrors.jobDescription && 'border-red-300 focus-visible:ring-red-300')}
            />
            <FieldError field="jobDescription" />
          </div>

          <Separator />

          {/* Costs */}
          <div className="space-y-4">
            <h4 className="text-sm font-heading font-semibold text-navy flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent" />
              Pricing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="materialsCost">
                  Materials Cost <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">$</span>
                  <Input
                    id="materialsCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2,500.00"
                    value={form.materialsCost}
                    onChange={(e) => updateField('materialsCost', e.target.value)}
                    className={cn('pl-7 font-mono', stepErrors.materialsCost && 'border-red-300 focus-visible:ring-red-300')}
                  />
                </div>
                <FieldError field="materialsCost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laborCost">
                  Labor Cost <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">$</span>
                  <Input
                    id="laborCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1,500.00"
                    value={form.laborCost}
                    onChange={(e) => updateField('laborCost', e.target.value)}
                    className={cn('pl-7 font-mono', stepErrors.laborCost && 'border-red-300 focus-visible:ring-red-300')}
                  />
                </div>
                <FieldError field="laborCost" />
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-navy">Estimated Total</span>
              <span className="text-2xl font-heading font-bold text-accent">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Timeline & Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="projectDuration" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                Project Duration
              </Label>
              <Input
                id="projectDuration"
                placeholder="e.g., 2-3 weeks"
                value={form.projectDuration}
                onChange={(e) => updateField('projectDuration', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                Payment Terms
              </Label>
              <Select value={form.paymentTerms} onValueChange={(v) => updateField('paymentTerms', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PAYMENT_LABELS) as [PaymentTerms, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="warranty" className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-gray-400" />
                Warranty <span className="text-gray-400 text-xs">(optional)</span>
              </Label>
              <Input
                id="warranty"
                placeholder="1 year parts and labor"
                value={form.warranty}
                onChange={(e) => updateField('warranty', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                Proposal Expires
              </Label>
              <Input
                id="expirationDate"
                type="date"
                value={form.expirationDate}
                onChange={(e) => updateField('expirationDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialNotes" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Special Notes <span className="text-gray-400 text-xs">(optional)</span>
            </Label>
            <Textarea
              id="specialNotes"
              placeholder="Any additional notes, special conditions, or exclusions..."
              rows={3}
              value={form.specialNotes}
              onChange={(e) => updateField('specialNotes', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // -- Step 3: Review & Generate --
  const SummaryRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) =>
    value ? (
      <div className="flex items-start gap-3 py-2.5">
        <Icon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-sm text-navy font-body mt-0.5 break-words">{value}</p>
        </div>
      </div>
    ) : null

  const Step3 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Review Your Proposal</CardTitle>
              <CardDescription>Double-check the details before generating.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left column */}
            <div>
              <h4 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Client Details
              </h4>
              <div className="divide-y divide-gray-100">
                <SummaryRow icon={User} label="Name" value={form.clientName} />
                <SummaryRow icon={Mail} label="Email" value={form.clientEmail} />
                <SummaryRow icon={Phone} label="Phone" value={form.clientPhone} />
                <SummaryRow icon={MapPin} label="Job Site" value={form.jobAddress} />
              </div>
            </div>

            {/* Right column */}
            <div>
              <h4 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Job Details
              </h4>
              <div className="divide-y divide-gray-100">
                <SummaryRow icon={Briefcase} label="Trade" value={TRADE_LABELS[form.tradeType]} />
                <SummaryRow icon={Clock} label="Duration" value={form.projectDuration} />
                <SummaryRow icon={CreditCard} label="Payment" value={PAYMENT_LABELS[form.paymentTerms]} />
                <SummaryRow icon={Shield} label="Warranty" value={form.warranty} />
                <SummaryRow icon={Calendar} label="Expires" value={form.expirationDate} />
              </div>
            </div>
          </div>

          {/* Description */}
          {form.jobDescription && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Job Description
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                  {form.jobDescription}
                </p>
              </div>
            </>
          )}

          {form.specialNotes && (
            <div className="mt-4">
              <h4 className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Special Notes
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                {form.specialNotes}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="mt-6 bg-gradient-to-r from-navy/5 to-accent/10 border border-accent/20 rounded-lg p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Estimated Total</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Materials {formatCurrency(parseFloat(form.materialsCost) || 0)} + Labor{' '}
                {formatCurrency(parseFloat(form.laborCost) || 0)}
              </p>
            </div>
            <span className="text-3xl font-heading font-bold text-accent">{formatCurrency(totalCost)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button or Streaming UI */}
      {!generating ? (
        <Button
          variant="accent"
          size="lg"
          className="w-full h-14 text-base shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
          onClick={handleGenerate}
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Generate Proposal with AI
          <Sparkles className="h-4 w-4 ml-2 opacity-70" />
        </Button>
      ) : (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 p-4 border-b border-accent/10">
            <div className="flex items-center justify-center gap-3">
              {!generationDone ? (
                <>
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                    <Sparkles className="h-3.5 w-3.5 text-accent absolute" />
                  </div>
                  <div>
                    <p className="text-accent font-heading font-semibold">AI is writing your proposal...</p>
                    <p className="text-xs text-gray-500">This usually takes about 10 seconds. Sit tight!</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-green-700 font-heading font-semibold">Proposal generated successfully!</p>
                    <p className="text-xs text-gray-500">Your professional proposal is ready to review.</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {streamText}
              {!generationDone && <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 align-text-bottom" />}
            </div>
            {generationDone && (
              <div className="mt-4 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => {
                    if (generatedId) {
                      navigate(`/proposals/${generatedId}`)
                    } else {
                      navigate('/proposals')
                    }
                  }}
                  className="shadow-lg shadow-accent/20"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Proposal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-accent transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/proposals" className="hover:text-accent transition-colors">
          Proposals
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-navy font-medium">New</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">Create New Proposal</h1>
        <p className="text-gray-500 mt-1.5 font-body">
          Fill in the details and let AI write a professional proposal for you.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Global Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {/* Steps */}
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}

      {/* Navigation Buttons */}
      {!(currentStep === 3 && generating) && (
        <div className="flex items-center justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              Step {currentStep} of {STEPS.length}
            </span>
            {currentStep < 3 && (
              <Button variant="accent" onClick={handleNext} className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
