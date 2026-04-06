import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import type { PaymentTerms } from '@/types'

export function NewProposal() {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    jobAddress: '',
    jobDescription: '',
    materialsCost: '',
    laborCost: '',
    projectDuration: '',
    paymentTerms: '50_upfront' as PaymentTerms,
    warranty: '',
    specialNotes: '',
    expirationDate: getDefaultExpiration(),
  })

  function getDefaultExpiration() {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split('T')[0]
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.clientName || !form.clientEmail || !form.jobDescription || !form.materialsCost || !form.laborCost) {
      setError('Please fill in all required fields.')
      return
    }

    setGenerating(true)
    setStreamText('')

    try {
      // Create the proposal
      const { proposal } = await api.createProposal({
        ...form,
        materialsCost: Number(form.materialsCost),
        laborCost: Number(form.laborCost),
      })

      // Stream AI generation
      setStreamText('AI is writing your proposal...\n\n')

      for await (const chunk of api.generateProposal(proposal.id)) {
        setStreamText((prev) => prev + chunk)
      }

      // Navigate to preview
      navigate(`/proposals/${proposal.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setGenerating(false)
    }
  }

  if (generating) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                <span className="text-accent font-medium">AI is writing your proposal...</span>
              </div>
              <p className="text-gray-500">This usually takes about 10 seconds. Sit tight!</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: streamText }}
              />
              <span className="inline-block w-2 h-5 bg-accent animate-pulse ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">Create Proposal</h1>
        <p className="text-gray-500 mt-1">Fill in the details and let AI write a professional proposal for you.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Who is this proposal for?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  placeholder="John Smith"
                  value={form.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={form.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Phone Number</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={form.clientPhone}
                  onChange={(e) => updateField('clientPhone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobAddress">Job Site Address</Label>
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

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Describe the work — be as sloppy as you want, AI will clean it up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description *</Label>
              <Textarea
                id="jobDescription"
                placeholder="Replace 2 ton AC unit, install new ductwork in attic, add return air in master bedroom..."
                rows={4}
                value={form.jobDescription}
                onChange={(e) => updateField('jobDescription', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materialsCost">Materials Cost ($) *</Label>
                <Input
                  id="materialsCost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="2500.00"
                  value={form.materialsCost}
                  onChange={(e) => updateField('materialsCost', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laborCost">Labor Cost ($) *</Label>
                <Input
                  id="laborCost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1500.00"
                  value={form.laborCost}
                  onChange={(e) => updateField('laborCost', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDuration">Estimated Project Duration</Label>
              <Input
                id="projectDuration"
                placeholder="3-5 business days"
                value={form.projectDuration}
                onChange={(e) => updateField('projectDuration', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Terms & Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select value={form.paymentTerms} onValueChange={(v) => updateField('paymentTerms', v)}>
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
                <Label htmlFor="expirationDate">Proposal Expires</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={form.expirationDate}
                  onChange={(e) => updateField('expirationDate', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty (optional)</Label>
              <Input
                id="warranty"
                placeholder="1 year parts and labor warranty"
                value={form.warranty}
                onChange={(e) => updateField('warranty', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialNotes">Special Notes (optional)</Label>
              <Textarea
                id="specialNotes"
                placeholder="Any additional notes or special conditions..."
                rows={3}
                value={form.specialNotes}
                onChange={(e) => updateField('specialNotes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={generating}>
          <Sparkles className="h-5 w-5 mr-2" />
          Generate Proposal with AI
        </Button>
      </form>
    </div>
  )
}
