import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Upload, Loader2, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import type { TradeType, PaymentTerms } from '@/types'

const TRADE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'painting', label: 'Painting' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general', label: 'General Contracting' },
]

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

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
      return
    }

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

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-accent" />
          <span className="text-2xl font-heading font-bold text-navy">Welcome to ContractorOS</span>
        </div>
        <p className="text-gray-500">Let's get your business set up in 2 minutes.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? 'w-8 bg-accent' : s < step ? 'w-8 bg-emerald-500' : 'w-8 bg-gray-200'
            }`}
          />
        ))}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-xl font-heading font-bold text-navy">Business Basics</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    placeholder="Smith Plumbing LLC"
                    value={form.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trade</Label>
                  <Select value={form.trade} onValueChange={(v) => updateField('trade', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Service Area</Label>
                  <Input
                    placeholder="Dallas-Fort Worth, TX"
                    value={form.serviceArea}
                    onChange={(e) => updateField('serviceArea', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-heading font-bold text-navy">Business Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>License Number (optional)</Label>
                  <Input
                    placeholder="TACL-12345"
                    value={form.licenseNumber}
                    onChange={(e) => updateField('licenseNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>About Your Business (optional)</Label>
                  <Textarea
                    placeholder="Family-owned business serving the community since 2005..."
                    rows={3}
                    value={form.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-heading font-bold text-navy">Payment Defaults</h2>
              <p className="text-sm text-gray-500">These will be pre-filled on new proposals. You can always change them.</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Payment Terms</Label>
                  <Select value={form.defaultPaymentTerms} onValueChange={(v) => updateField('defaultPaymentTerms', v)}>
                    <SelectTrigger>
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
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Skip for now
          </Button>
        )}
        <Button variant="accent" onClick={handleNext} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : step === 3 ? null : null}
          {step === 3 ? 'Finish & Create First Proposal' : 'Next'}
          {step < 3 && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </div>
  )
}
