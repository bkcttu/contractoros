import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  Zap,
  Building2,
  FileText,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Award,
  Shield,
  Rocket,
  PartyPopper,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import type { TradeType, PaymentTerms } from '@/types'
import { cn } from '@/lib/utils'

const TRADE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'painting', label: 'Painting' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general', label: 'General Contracting' },
]

const STEPS = [
  {
    number: 1,
    title: 'Business Basics',
    subtitle: 'Tell us about your business',
    icon: Building2,
    motivator: 'Great start! Let us know the essentials.',
  },
  {
    number: 2,
    title: 'Contact Info',
    subtitle: 'How clients reach you',
    icon: Phone,
    motivator: 'Clients need to find you easily.',
  },
  {
    number: 3,
    title: 'Business Details',
    subtitle: 'Stand out from the competition',
    icon: Award,
    motivator: "You're halfway there! Almost done.",
  },
  {
    number: 4,
    title: 'Payment Defaults',
    subtitle: 'Pre-fill your proposals',
    icon: CreditCard,
    motivator: 'One more step after this!',
  },
  {
    number: 5,
    title: 'All Set!',
    subtitle: "You're ready to go",
    icon: Rocket,
    motivator: "Let's create your first proposal!",
  },
]

const TOTAL_STEPS = STEPS.length

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    trade: '' as TradeType,
    phone: '',
    email: '',
    serviceArea: '',
    licenseNumber: '',
    bio: '',
    taxRate: '0',
    defaultPaymentTerms: '50_upfront' as PaymentTerms,
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    }
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await api.updateProfile({
        businessName: form.businessName,
        trade: form.trade,
        phone: form.phone,
        email: form.email,
        serviceArea: form.serviceArea,
        licenseNumber: form.licenseNumber,
        bio: form.bio,
        taxRate: Number(form.taxRate),
        defaultPaymentTerms: form.defaultPaymentTerms,
        onboardingComplete: true,
      } as Partial<import('@/types').User>)
      navigate('/proposals/new')
    } catch {
      // Silently fail and still navigate
      navigate('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  const currentStep = STEPS[step - 1]
  const progressPercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100
  const StepIcon = currentStep.icon

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-xl w-full fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-navy">ContractorOS</span>
          </div>
          <p className="text-gray-500">
            {step < TOTAL_STEPS
              ? "Let's get your business set up in 2 minutes."
              : 'Your account is ready to go!'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-xs font-medium text-accent">
              {Math.round(progressPercent)}% complete
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex items-center justify-between mt-3">
            {STEPS.map((s) => (
              <div key={s.number} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    s.number === step
                      ? 'bg-accent text-white shadow-md shadow-accent/30 scale-110'
                      : s.number < step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {s.number < step ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    s.number
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-medium hidden sm:block',
                  s.number === step ? 'text-accent' : s.number < step ? 'text-emerald-500' : 'text-gray-300'
                )}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Card */}
        <Card className="shadow-lg overflow-hidden">
          {/* Step header accent */}
          <div className="h-1 bg-gradient-to-r from-accent to-accent/50" />

          <CardContent className="p-6 sm:p-8">
            {/* Step icon + title */}
            <div className="flex items-start gap-4 mb-6">
              <div className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
                step === TOTAL_STEPS ? 'bg-emerald-100' : 'bg-accent/10'
              )}>
                <StepIcon className={cn(
                  'h-6 w-6',
                  step === TOTAL_STEPS ? 'text-emerald-600' : 'text-accent'
                )} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-navy">{currentStep.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{currentStep.motivator}</p>
              </div>
            </div>

            {/* Step 1: Business Basics */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    placeholder="Smith Plumbing LLC"
                    value={form.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trade</Label>
                  <Select value={form.trade} onValueChange={(v) => updateField('trade', v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    Service Area
                  </Label>
                  <Input
                    placeholder="Dallas-Fort Worth, TX"
                    value={form.serviceArea}
                    onChange={(e) => updateField('serviceArea', e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Business Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-gray-400" />
                    License Number
                    <span className="text-xs text-gray-400">(optional)</span>
                  </Label>
                  <Input
                    placeholder="TACL-12345"
                    value={form.licenseNumber}
                    onChange={(e) => updateField('licenseNumber', e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                    About Your Business
                    <span className="text-xs text-gray-400">(optional)</span>
                  </Label>
                  <Textarea
                    placeholder="Family-owned business serving the community since 2005..."
                    rows={4}
                    value={form.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                  />
                  <p className="text-xs text-gray-400">This will appear in your proposals and help clients trust your business.</p>
                </div>
              </div>
            )}

            {/* Step 4: Payment Defaults */}
            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 -mt-1">
                  These will be pre-filled on new proposals. You can always change them later.
                </p>
                <div className="space-y-2">
                  <Label>Default Payment Terms</Label>
                  <Select value={form.defaultPaymentTerms} onValueChange={(v) => updateField('defaultPaymentTerms', v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50_upfront">50% Upfront / 50% on Completion</SelectItem>
                      <SelectItem value="net_30">Net 30</SelectItem>
                      <SelectItem value="due_on_completion">Due on Completion</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="25"
                    step="0.1"
                    placeholder="8.25"
                    value={form.taxRate}
                    onChange={(e) => updateField('taxRate', e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            {/* Step 5: All Set */}
            {step === 5 && (
              <div className="text-center py-6">
                <div className="relative inline-block mb-6">
                  <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                    <PartyPopper className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-navy mb-2">
                  You're all set!
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
                  Your account is ready. Let's create your first AI-powered proposal and win your next client.
                </p>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-2">
                  {form.businessName && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-gray-600">Business: <span className="font-medium text-navy">{form.businessName}</span></span>
                    </div>
                  )}
                  {form.trade && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-gray-600">Trade: <span className="font-medium text-navy">{TRADE_OPTIONS.find(t => t.value === form.trade)?.label || form.trade}</span></span>
                    </div>
                  )}
                  {form.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-gray-600">Email: <span className="font-medium text-navy">{form.email}</span></span>
                    </div>
                  )}
                  {form.serviceArea && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-gray-600">Area: <span className="font-medium text-navy">{form.serviceArea}</span></span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && step < TOTAL_STEPS ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="btn-press">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          ) : step === 1 ? (
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-400">
              Skip for now
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button variant="accent" onClick={handleNext} size="lg" className="btn-press shadow-md shadow-accent/20">
              {step === TOTAL_STEPS - 1 ? 'Review' : 'Continue'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={handleFinish}
              size="lg"
              disabled={saving}
              className="btn-press shadow-lg shadow-accent/20 shimmer"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Create My First Proposal
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
