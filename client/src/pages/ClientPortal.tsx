import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Loader2,
  Check,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Clock,
  MessageSquare,
  CalendarCheck,
  Building2,
  X,
  Send,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import type { Proposal, User } from '@/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

const DEMO_PROPOSAL: Proposal = {
  id: 'demo',
  userId: 'demo',
  clientId: 'demo',
  client: { id: 'demo', userId: 'demo', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 234-5678', address: '742 Evergreen Terrace, Springfield, IL', notes: null, createdAt: new Date().toISOString() },
  proposalNumber: 'P-2024-001',
  status: 'sent',
  jobDescription: 'Complete bathroom renovation including new tile, vanity, and plumbing fixtures',
  jobAddress: '742 Evergreen Terrace, Springfield, IL',
  materialsCost: 5200,
  laborCost: 4800,
  total: 10000,
  paymentTerms: '50_upfront',
  warranty: '1-year workmanship warranty',
  specialNotes: null,
  expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  projectDuration: '3-4 weeks',
  aiContent: '<h2>Project Overview</h2><p>We are pleased to present this proposal for your complete bathroom renovation. Our experienced team will transform your bathroom into a modern, functional space that adds lasting value to your home.</p><h2>Scope of Work</h2><ul><li>Complete demolition and removal of existing fixtures</li><li>Installation of premium porcelain floor and wall tile</li><li>New custom vanity with granite countertop and undermount sink</li><li>Modern faucet and fixture installation</li><li>Complete plumbing connections and leak testing</li><li>Final cleanup and inspection</li></ul><h2>Timeline</h2><p>The estimated project duration is 3-4 weeks from start date. A detailed schedule will be provided before work begins.</p><h2>Materials</h2><p>All materials are premium-grade and sourced from trusted suppliers. Selections will be finalized during the pre-construction consultation.</p><h2>Warranty</h2><p>All workmanship is backed by our 1-year warranty. Materials carry their manufacturer warranties.</p>',
  pdfUrl: null,
  viewedAt: null,
  acceptedAt: null,
  signatureName: null,
  signatureDate: null,
  createdAt: new Date().toISOString(),
}

const DEMO_CONTRACTOR: Partial<User> = {
  name: 'Mike Reynolds',
  businessName: 'Reynolds Home Services',
  email: 'mike@reynoldshome.com',
  phone: '(555) 987-6543',
  brandColor: '#F97316',
  trade: 'plumbing',
  serviceArea: 'Dallas-Fort Worth, TX',
  licenseNumber: 'TACL-98765',
}

const PAYMENT_LABELS: Record<string, string> = {
  '50_upfront': '50% Upfront / 50% on Completion',
  'net_30': 'Net 30 Days',
  'due_on_completion': 'Due on Completion',
  'custom': 'Custom Terms',
}

export function ClientPortal() {
  const { id } = useParams<{ id: string }>()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [contractor, setContractor] = useState<Partial<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [showSignModal, setShowSignModal] = useState(false)
  const [showChangesModal, setShowChangesModal] = useState(false)
  const [changesText, setChangesText] = useState('')
  const [changesSent, setChangesSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.getPublicProposal(id)
      .then((res) => {
        setProposal(res.proposal)
        setContractor(res.contractor)
        if (res.proposal.status === 'accepted') {
          setSigned(true)
        }
      })
      .catch(() => {
        // Demo mode
        setProposal(DEMO_PROPOSAL)
        setContractor(DEMO_CONTRACTOR)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSign = async () => {
    if (!id || !signatureName.trim()) return
    setSigning(true)
    try {
      await api.signProposal(id, signatureName.trim())
      setSigned(true)
      setShowSignModal(false)
      setProposal((prev) => prev ? { ...prev, status: 'accepted' } : prev)
    } catch {
      setError('Failed to sign. Please try again.')
    } finally {
      setSigning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading your proposal...</p>
        </div>
      </div>
    )
  }

  if (error && !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-heading font-bold text-navy mb-2">Proposal Not Found</h2>
            <p className="text-gray-500">{error || 'This proposal may have been removed or the link is invalid.'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!proposal) return null

  const brandColor = contractor?.brandColor || contractor?.brand_color || '#F97316'
  const content = proposal.aiContent || proposal.ai_content || ''
  const businessName = contractor?.businessName || contractor?.business_name || contractor?.name || 'Contractor'
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Colored top bar */}
      <div className="h-1" style={{ backgroundColor: brandColor }} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-navy leading-tight">
                {businessName}
              </h1>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                {contractor?.phone && (
                  <a href={`tel:${contractor.phone}`} className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                    <Phone className="h-3 w-3" />
                    {contractor.phone}
                  </a>
                )}
                {contractor?.email && (
                  <a href={`mailto:${contractor.email}`} className="flex items-center gap-1 hover:text-gray-600 transition-colors hidden sm:flex">
                    <Mail className="h-3 w-3" />
                    {contractor.email}
                  </a>
                )}
              </div>
            </div>
          </div>
          {signed ? (
            <Badge variant="success" className="text-sm px-3 py-1">
              <Check className="h-3 w-3 mr-1" />
              Accepted
            </Badge>
          ) : (
            <Badge variant="outline" className="text-sm px-3 py-1">
              Proposal
            </Badge>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Hero Section */}
        <div className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden" style={{ backgroundColor: brandColor }}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
          <div className="relative">
            <p className="text-white/70 text-sm mb-1">
              Proposal {proposal.proposalNumber || proposal.proposal_number}
            </p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
              {proposal.jobDescription || proposal.job_description || 'Project Proposal'}
            </h2>
            <p className="text-white/70 text-sm">
              Prepared for <span className="font-semibold text-white">{proposal.client?.name || 'Client'}</span> on{' '}
              {formatDate(proposal.createdAt || proposal.created_at)}
            </p>
          </div>
        </div>

        {/* Total Amount + Key Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="sm:col-span-1">
            <CardContent className="pt-5 pb-5 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Amount</p>
              <p className="text-3xl font-mono font-bold" style={{ color: brandColor }}>
                {formatCurrency(Number(proposal.total))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Materials</p>
              <p className="text-xl font-mono font-bold text-navy">
                {formatCurrency(Number(proposal.materialsCost || proposal.materials_cost))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Labor</p>
              <p className="text-xl font-mono font-bold text-navy">
                {formatCurrency(Number(proposal.laborCost || proposal.labor_cost))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Project Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(proposal.jobAddress || proposal.job_address) && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm text-navy font-medium">{proposal.jobAddress || proposal.job_address}</p>
                  </div>
                </div>
              )}
              {(proposal.projectDuration || proposal.project_duration) && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm text-navy font-medium">{proposal.projectDuration || proposal.project_duration}</p>
                  </div>
                </div>
              )}
              {(proposal.paymentTerms || proposal.payment_terms) && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Payment Terms</p>
                    <p className="text-sm text-navy font-medium">
                      {PAYMENT_LABELS[proposal.paymentTerms || proposal.payment_terms || ''] || 'Standard Terms'}
                    </p>
                  </div>
                </div>
              )}
              {proposal.warranty && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Warranty</p>
                    <p className="text-sm text-navy font-medium">{proposal.warranty}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Proposal Content */}
        <Card className="overflow-hidden">
          <div className="h-0.5" style={{ backgroundColor: brandColor, opacity: 0.3 }} />
          <CardContent className="p-6 sm:p-8">
            {content ? (
              <div
                className="prose prose-sm sm:prose max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-gray-700 prose-li:text-gray-700 prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">Proposal content is being prepared. Please check back shortly.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signature / Accept Section */}
        {signed ? (
          <Card className="border-emerald-200 bg-emerald-50/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy mb-2">Proposal Accepted</h3>
              <p className="text-gray-500 mb-4">
                Signed by <span className="font-semibold text-navy">{proposal.signatureName || proposal.signature_name || signatureName}</span> on{' '}
                {formatDate(proposal.signatureDate || proposal.signature_date || new Date().toISOString())}
              </p>
              <p className="text-sm text-gray-400">
                {businessName} will be in touch with next steps.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full text-white text-base h-14 btn-press shadow-lg"
                style={{ backgroundColor: brandColor }}
                onClick={() => setShowSignModal(true)}
              >
                <Check className="h-5 w-5 mr-2" />
                Accept Proposal
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowChangesModal(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Changes
                </Button>
                {contractor?.phone && (
                  <a href={`tel:${contractor.phone}`} className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {/* Expiration Notice */}
        {(proposal.expirationDate || proposal.expiration_date) && !signed && (
          <p className="text-center text-sm text-gray-400">
            This proposal is valid until {formatDate(proposal.expirationDate || proposal.expiration_date)}
          </p>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-6 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-1">{businessName}</p>
          <p className="text-xs text-gray-300">Powered by ContractorOS</p>
        </div>
      </main>

      {/* Sign Modal Overlay */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in-up">
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-navy">Accept Proposal</h3>
                <button
                  onClick={() => setShowSignModal(false)}
                  className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                By typing your name below, you agree to the terms and pricing outlined in this proposal for{' '}
                <span className="font-medium text-navy">{formatCurrency(Number(proposal.total))}</span>.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signature" className="text-sm font-medium">Your Full Name (e-signature)</Label>
                  <Input
                    id="signature"
                    placeholder="Type your full name"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="text-lg h-12"
                    style={{ fontFamily: "'Caveat', cursive" }}
                    autoFocus
                  />
                </div>

                <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                  <p>Date: <span className="font-medium text-navy">{today}</span></p>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSign}
                    disabled={!signatureName.trim() || signing}
                    className="flex-1 h-12 text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {signing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Accept & Sign
                  </Button>
                  <Button variant="outline" onClick={() => setShowSignModal(false)} className="h-12">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in-up">
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-navy">Request Changes</h3>
                <button
                  onClick={() => { setShowChangesModal(false); setChangesSent(false) }}
                  className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {changesSent ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                    <Send className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-heading font-semibold text-navy mb-2">Message Sent</h4>
                  <p className="text-sm text-gray-500">
                    {businessName} will review your feedback and get back to you.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => { setShowChangesModal(false); setChangesSent(false); setChangesText('') }}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Let {businessName} know what you would like changed about this proposal.
                  </p>
                  <Textarea
                    placeholder="Describe the changes you'd like..."
                    value={changesText}
                    onChange={(e) => setChangesText(e.target.value)}
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 text-white"
                      style={{ backgroundColor: brandColor }}
                      disabled={!changesText.trim()}
                      onClick={() => setChangesSent(true)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </Button>
                    <Button variant="outline" onClick={() => setShowChangesModal(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
