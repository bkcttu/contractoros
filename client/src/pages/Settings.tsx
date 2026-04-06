import { useEffect, useState } from 'react'
import { Loader2, Save, CreditCard, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import { showToast } from '@/components/Toaster'
import type { TradeType, PaymentTerms, User } from '@/types'

const TRADE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'painting', label: 'Painting' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general', label: 'General Contracting' },
]

export function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    trade: '' as TradeType,
    phone: '',
    email: '',
    serviceArea: '',
    licenseNumber: '',
    bio: '',
    brandColor: '#F97316',
    taxRate: '0',
    defaultPaymentTerms: '50_upfront' as PaymentTerms,
  })
  const [plan, setPlan] = useState('starter')

  useEffect(() => {
    api.getProfile()
      .then((res) => {
        const u = res.user
        setForm({
          name: u.name || '',
          businessName: u.business_name || u.businessName || '',
          trade: (u.trade || '') as TradeType,
          phone: u.phone || '',
          email: u.email || '',
          serviceArea: u.service_area || u.serviceArea || '',
          licenseNumber: u.license_number || u.licenseNumber || '',
          bio: u.bio || '',
          brandColor: u.brand_color || u.brandColor || '#F97316',
          taxRate: String(u.tax_rate ?? u.taxRate ?? 0),
          defaultPaymentTerms: (u.default_payment_terms || u.defaultPaymentTerms || '50_upfront') as PaymentTerms,
        })
        setPlan(u.plan || 'starter')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateProfile({
        name: form.name,
        businessName: form.businessName,
        trade: form.trade,
        phone: form.phone,
        email: form.email,
        serviceArea: form.serviceArea,
        licenseNumber: form.licenseNumber,
        bio: form.bio,
        brandColor: form.brandColor,
        taxRate: Number(form.taxRate),
        defaultPaymentTerms: form.defaultPaymentTerms,
      } as Partial<User>)
      showToast({ title: 'Settings saved!' })
    } catch {
      showToast({ title: 'Failed to save', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpgrade = async (plan: string) => {
    try {
      const { url } = await api.createCheckoutSession(plan)
      window.location.href = url
    } catch {
      showToast({ title: 'Failed to start checkout', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your business profile and preferences.</p>
      </div>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>This information appears on your proposals and website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input value={form.businessName} onChange={(e) => updateField('businessName', e.target.value)} placeholder="Smith Plumbing LLC" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trade</Label>
              <Select value={form.trade} onValueChange={(v) => updateField('trade', v)}>
                <SelectTrigger><SelectValue placeholder="Select trade" /></SelectTrigger>
                <SelectContent>
                  {TRADE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input value={form.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} placeholder="TACL-12345" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@company.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Service Area</Label>
            <Input value={form.serviceArea} onChange={(e) => updateField('serviceArea', e.target.value)} placeholder="Dallas-Fort Worth, TX" />
          </div>
          <div className="space-y-2">
            <Label>About Your Business</Label>
            <Textarea value={form.bio} onChange={(e) => updateField('bio', e.target.value)} placeholder="Tell clients about your business..." rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Customize how your proposals and client portal look.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Brand Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.brandColor}
                onChange={(e) => updateField('brandColor', e.target.value)}
                className="h-10 w-14 rounded border border-gray-200 cursor-pointer"
              />
              <Input
                value={form.brandColor}
                onChange={(e) => updateField('brandColor', e.target.value)}
                className="w-32 font-mono"
                placeholder="#F97316"
              />
              <div className="h-10 flex-1 rounded-lg" style={{ backgroundColor: form.brandColor }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Proposal Defaults</CardTitle>
          <CardDescription>These are pre-filled when you create a new proposal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Payment Terms</Label>
              <Select value={form.defaultPaymentTerms} onValueChange={(v) => updateField('defaultPaymentTerms', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
                value={form.taxRate}
                onChange={(e) => updateField('taxRate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your plan and billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-heading font-bold text-navy capitalize">{plan} Plan</p>
                {plan === 'starter' && <Badge variant="secondary">Free</Badge>}
                {plan === 'pro' && <Badge variant="accent">$79/mo</Badge>}
                {plan === 'team' && <Badge variant="accent">$149/mo</Badge>}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {plan === 'starter'
                  ? '5 proposals per month. Upgrade for unlimited.'
                  : 'Unlimited proposals and all features.'}
              </p>
            </div>
            {plan === 'starter' && (
              <Button variant="accent" onClick={() => handleUpgrade('pro')}>
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <Button variant="accent" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
