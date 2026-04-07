import { useEffect, useState, useRef, useCallback } from 'react'
import { Loader2, Save, CreditCard, ExternalLink, Upload, Image, Trash2, Copy, Check } from 'lucide-react'
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
import type { TradeType, PaymentTerms, FontPairType, User } from '@/types'
import { APP_NAME } from '@/lib/branding'

const FONT_PAIRS: { value: FontPairType; name: string; heading: string; body: string; vibe: string }[] = [
  { value: 'modern_pro', name: 'Modern Pro', heading: 'DM Sans', body: 'Inter', vibe: 'Clean, corporate' },
  { value: 'industrial', name: 'Industrial', heading: 'Barlow Condensed', body: 'Barlow', vibe: 'Strong, trade' },
  { value: 'friendly', name: 'Friendly', heading: 'Nunito', body: 'Nunito Sans', vibe: 'Approachable' },
  { value: 'premium', name: 'Premium', heading: 'Playfair Display', body: 'Lato', vibe: 'Luxury remodels' },
  { value: 'bold_builder', name: 'Bold Builder', heading: 'Oswald', body: 'Source Sans 3', vibe: 'Punchy' },
  { value: 'minimal', name: 'Minimal', heading: 'Outfit', body: 'Outfit Light', vibe: 'Sleek, modern' },
]

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
    secondaryColor: '#64748B',
    fontPair: 'modern_pro' as FontPairType,
    tagline: '',
    logoUrl: '',
    signatureUrl: '',
    taxRate: '0',
    defaultPaymentTerms: '50_upfront' as PaymentTerms,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const signatureFileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [signatureTab, setSignatureTab] = useState<'type' | 'draw' | 'upload'>('type')
  const [typedSignature, setTypedSignature] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
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
          secondaryColor: u.secondary_color || u.secondaryColor || '#64748B',
          fontPair: (u.font_pair || u.fontPair || 'modern_pro') as FontPairType,
          tagline: u.tagline || '',
          logoUrl: u.logo_url || u.logoUrl || '',
          signatureUrl: u.signature_url || u.signatureUrl || '',
          taxRate: String(u.tax_rate ?? u.taxRate ?? 0),
          defaultPaymentTerms: (u.default_payment_terms || u.defaultPaymentTerms || '50_upfront') as PaymentTerms,
        })
        setPlan(u.plan || 'starter')
      })
      .catch(() => {
        // Demo mode — use defaults
      })
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
        secondaryColor: form.secondaryColor,
        fontPair: form.fontPair,
        tagline: form.tagline,
        logoUrl: form.logoUrl || null,
        signatureUrl: form.signatureUrl || null,
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

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).nativeEvent.offsetX, y: (e as React.MouseEvent).nativeEvent.offsetY }
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    setIsDrawing(true)
    const { x, y } = getCanvasCoords(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [getCanvasCoords])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const { x, y } = getCanvasCoords(e)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e293b'
    ctx.lineTo(x, y)
    ctx.stroke()
  }, [isDrawing, getCanvasCoords])

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      updateField('signatureUrl', canvas.toDataURL())
    }
  }, [isDrawing])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateField('signatureUrl', '')
  }, [])

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
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo</Label>
            {form.logoUrl ? (
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <img
                  src={form.logoUrl}
                  alt="Business logo"
                  className="h-16 w-16 object-contain rounded"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateField('logoUrl', '')}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-2 hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Upload your logo</span>
                <span className="text-xs text-gray-400">PNG, JPG up to 2MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (file.size > 2 * 1024 * 1024) {
                  showToast({ title: 'File too large. Max 2MB.', variant: 'destructive' })
                  return
                }
                const reader = new FileReader()
                reader.onload = () => {
                  updateField('logoUrl', reader.result as string)
                }
                reader.readAsDataURL(file)
                e.target.value = ''
              }}
            />
          </div>

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

          {/* Secondary Color */}
          <div className="space-y-2">
            <Label>Secondary Color (headers, dividers)</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="h-10 w-14 rounded border border-gray-200 cursor-pointer"
              />
              <Input
                value={form.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-32 font-mono"
                placeholder="#64748B"
              />
              <div className="h-10 flex-1 rounded-lg" style={{ backgroundColor: form.secondaryColor }} />
            </div>
          </div>

          <Separator />

          {/* Font Pair Selector */}
          <div className="space-y-2">
            <Label>Font Pair</Label>
            <p className="text-sm text-gray-500">Choose a font combination for your proposals and documents.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FONT_PAIRS.map((fp) => (
                <button
                  key={fp.value}
                  type="button"
                  onClick={() => updateField('fontPair', fp.value)}
                  className={`card-hover relative text-left p-4 rounded-lg border-2 transition-all ${
                    form.fontPair === fp.value
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {form.fontPair === fp.value && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="text-lg font-bold text-navy">{fp.name}</div>
                  <div className="text-3xl font-bold text-navy mt-1">Aa</div>
                  <div className="text-xs text-gray-400 mt-1">{fp.heading} / {fp.body}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{fp.vibe}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Business Tagline */}
          <div className="space-y-2">
            <Label>Tagline (appears under your logo)</Label>
            <Input
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="Quality work. Fair prices. Every time."
            />
          </div>
        </CardContent>
      </Card>

      {/* Your Signature */}
      <Card>
        <CardHeader>
          <CardTitle>Your Signature</CardTitle>
          <CardDescription>Add a signature for proposals and contracts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Signature Tab Buttons */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {(['type', 'draw', 'upload'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSignatureTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  signatureTab === tab
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Type Tab */}
          {signatureTab === 'type' && (
            <div className="space-y-3">
              <Input
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Type your name..."
              />
              {typedSignature && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <p
                    className="text-2xl text-navy"
                    style={{ fontFamily: "'Dancing Script', cursive", fontStyle: 'italic' }}
                  >
                    {typedSignature}
                  </p>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!typedSignature}
                onClick={() => {
                  // Create a canvas to render the typed signature as an image
                  const tempCanvas = document.createElement('canvas')
                  tempCanvas.width = 300
                  tempCanvas.height = 150
                  const ctx = tempCanvas.getContext('2d')
                  if (ctx) {
                    ctx.fillStyle = 'transparent'
                    ctx.clearRect(0, 0, 300, 150)
                    ctx.font = 'italic 36px cursive'
                    ctx.fillStyle = '#1e293b'
                    ctx.fillText(typedSignature, 10, 90)
                    updateField('signatureUrl', tempCanvas.toDataURL())
                    showToast({ title: 'Signature saved!' })
                  }
                }}
              >
                Use This Signature
              </Button>
            </div>
          )}

          {/* Draw Tab */}
          {signatureTab === 'draw' && (
            <div className="space-y-3">
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair touch-none bg-white w-full"
                style={{ maxWidth: '300px' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
                Clear
              </Button>
            </div>
          )}

          {/* Upload Tab */}
          {signatureTab === 'upload' && (
            <div className="space-y-3">
              {form.signatureUrl && !form.signatureUrl.startsWith('data:image/png;base64') ? (
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <img
                    src={form.signatureUrl}
                    alt="Signature"
                    className="h-16 object-contain"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => signatureFileInputRef.current?.click()}
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateField('signatureUrl', '')}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => signatureFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-2 hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Upload your signature</span>
                  <span className="text-xs text-gray-400">PNG, JPG up to 2MB</span>
                </button>
              )}
              <input
                ref={signatureFileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (file.size > 2 * 1024 * 1024) {
                    showToast({ title: 'File too large. Max 2MB.', variant: 'destructive' })
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = () => {
                    updateField('signatureUrl', reader.result as string)
                  }
                  reader.readAsDataURL(file)
                  e.target.value = ''
                }}
              />
            </div>
          )}

          {/* Signature Preview */}
          {form.signatureUrl && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Signature Preview</Label>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <img
                    src={form.signatureUrl}
                    alt="Signature preview"
                    className="h-16 object-contain"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Signature */}
      <Card>
        <CardHeader>
          <CardTitle>Email Signature</CardTitle>
          <CardDescription>Auto-generated from your profile. Copy and paste into your email client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-5 bg-white">
            <table cellPadding={0} cellSpacing={0} style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#1e293b' }}>
              <tbody>
                <tr>
                  {form.logoUrl && (
                    <td style={{ paddingRight: '16px', verticalAlign: 'top' }}>
                      <img
                        src={form.logoUrl}
                        alt="Logo"
                        style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '6px' }}
                      />
                    </td>
                  )}
                  <td style={{ verticalAlign: 'top' }}>
                    {form.businessName && (
                      <div style={{ fontWeight: 700, fontSize: '15px', color: form.brandColor, marginBottom: '2px' }}>
                        {form.businessName}
                      </div>
                    )}
                    {form.name && (
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {form.name}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                      {form.phone && <div>{form.phone}</div>}
                      {form.email && <div>{form.email}</div>}
                      {form.licenseNumber && <div>License: {form.licenseNumber}</div>}
                    </div>
                    <div
                      style={{
                        marginTop: '8px',
                        borderTop: `2px solid ${form.brandColor}`,
                        paddingTop: '4px',
                        fontSize: '10px',
                        color: '#94a3b8',
                      }}
                    >
                      Powered by {APP_NAME}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const logoHtml = form.logoUrl
                ? `<td style="padding-right:16px;vertical-align:top"><img src="${form.logoUrl}" alt="Logo" style="width:60px;height:60px;object-fit:contain;border-radius:6px"/></td>`
                : ''
              const html = `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#1e293b"><tbody><tr>${logoHtml}<td style="vertical-align:top">${form.businessName ? `<div style="font-weight:700;font-size:15px;color:${form.brandColor};margin-bottom:2px">${form.businessName}</div>` : ''}${form.name ? `<div style="font-weight:600;margin-bottom:4px">${form.name}</div>` : ''}<div style="font-size:12px;color:#64748b;line-height:1.6">${form.phone ? `<div>${form.phone}</div>` : ''}${form.email ? `<div>${form.email}</div>` : ''}${form.licenseNumber ? `<div>License: ${form.licenseNumber}</div>` : ''}</div><div style="margin-top:8px;border-top:2px solid ${form.brandColor};padding-top:4px;font-size:10px;color:#94a3b8">Powered by {APP_NAME}</div></td></tr></tbody></table>`
              navigator.clipboard.writeText(html).then(() => {
                showToast({ title: 'Signature HTML copied to clipboard!' })
              }).catch(() => {
                showToast({ title: 'Failed to copy', variant: 'destructive' })
              })
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Signature
          </Button>
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
