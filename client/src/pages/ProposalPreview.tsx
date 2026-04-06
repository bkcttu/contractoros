import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Send,
  Copy,
  Check,
  Loader2,
  Sparkles,
  ExternalLink,
  Trash2,
  Pencil,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Clock,
  FileText,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import type { Proposal } from '@/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { showToast } from '@/components/Toaster'

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' | 'accent' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'accent' },
  viewed: { label: 'Viewed', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'danger' },
  expired: { label: 'Expired', variant: 'secondary' },
}

const DEMO_PROPOSAL: Proposal = {
  id: 'demo',
  userId: 'demo',
  clientId: 'demo',
  client: { id: 'demo', userId: 'demo', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 234-5678', address: '742 Evergreen Terrace, Springfield, IL', notes: null, createdAt: new Date().toISOString() },
  proposalNumber: 'P-2024-001',
  status: 'draft',
  jobDescription: 'Complete kitchen remodel including new countertops, cabinets, and plumbing fixtures',
  jobAddress: '742 Evergreen Terrace, Springfield, IL',
  materialsCost: 4200,
  laborCost: 3800,
  total: 8000,
  paymentTerms: '50_upfront',
  warranty: '1-year workmanship warranty',
  specialNotes: null,
  expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  projectDuration: '2-3 weeks',
  aiContent: '<h2>Project Overview</h2><p>We are pleased to present this proposal for your kitchen remodel project. Our team will provide a complete transformation of your kitchen space, including premium countertop installation, custom cabinetry, and modern plumbing fixtures.</p><h2>Scope of Work</h2><ul><li>Removal and disposal of existing countertops and cabinets</li><li>Installation of granite countertops with polished edges</li><li>Custom soft-close cabinet installation</li><li>New sink and faucet installation</li><li>All necessary plumbing connections</li></ul><h2>Timeline</h2><p>The estimated project duration is 2-3 weeks from start date. We will work diligently to minimize disruption to your daily routine.</p><h2>Materials</h2><p>All materials used are premium-grade and sourced from trusted suppliers. Specific selections will be finalized during the pre-construction walkthrough.</p>',
  pdfUrl: null,
  viewedAt: null,
  acceptedAt: null,
  signatureName: null,
  signatureDate: null,
  createdAt: new Date().toISOString(),
}

export function ProposalPreview() {
  const pageRef = useRef<HTMLDivElement>(null)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [copied, setCopied] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getProposal(id)
      .then((res) => setProposal(res.proposal))
      .catch(() => {
        setProposal(DEMO_PROPOSAL)
        setIsDemo(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      pageRef.current?.querySelectorAll('.fade-in-up, .reveal-fade, .fade-in-left, .fade-in-right, .scale-in, .stagger-children').forEach(el => {
        el.classList.add('visible')
      })
      // Also make the container itself visible
      pageRef.current?.classList.add('visible')
    }, 50)
    return () => clearTimeout(timer)
  }, [loading])

  const handleSend = async () => {
    if (!proposal || isDemo) return
    setSending(true)
    try {
      await api.sendProposal(proposal.id)
      setProposal((prev) => prev ? { ...prev, status: 'sent' } : prev)
      showToast({ title: 'Proposal sent!', description: 'Your client will receive an email shortly.' })
    } catch {
      showToast({ title: 'Failed to send', description: 'Please try again.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const handleRegenerate = async () => {
    if (!proposal || isDemo) return
    setRegenerating(true)
    setStreamText('')
    try {
      let content = ''
      for await (const chunk of api.generateProposal(proposal.id)) {
        content += chunk
        setStreamText(content)
      }
      setProposal((prev) => prev ? { ...prev, ai_content: content, aiContent: content } : prev)
      showToast({ title: 'Proposal regenerated!' })
    } catch {
      showToast({ title: 'Regeneration failed', variant: 'destructive' })
    } finally {
      setRegenerating(false)
      setStreamText('')
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/p/${proposal?.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showToast({ title: 'Link copied to clipboard!' })
  }

  const handleDownloadPdf = () => {
    if (!proposal || isDemo) return
    window.open(api.getProposalPdfUrl(proposal.id), '_blank')
  }

  const handleDelete = async () => {
    if (!proposal || isDemo) return
    if (!confirm('Are you sure you want to delete this proposal? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.deleteProposal(proposal.id)
      showToast({ title: 'Proposal deleted' })
      navigate('/proposals')
    } catch {
      showToast({ title: 'Failed to delete', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-gray-400">Loading proposal...</p>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="text-center py-24">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-gray-300" />
        </div>
        <h2 className="text-xl font-heading font-bold text-navy mb-2">Proposal not found</h2>
        <p className="text-gray-500 mb-4">This proposal may have been deleted or the link is invalid.</p>
        <Link to="/proposals">
          <Button variant="accent">Back to Proposals</Button>
        </Link>
      </div>
    )
  }

  const content = regenerating ? streamText : (proposal.aiContent || proposal.ai_content || '')
  const config = statusConfig[proposal.status] || statusConfig.draft

  return (
    <div ref={pageRef} className="max-w-4xl mx-auto space-y-6 fade-in-up">
      {/* Demo Banner */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>This is a sample proposal preview. Connect to the API to see real data.</span>
        </div>
      )}

      {/* Navigation + Status */}
      <div className="flex items-center justify-between">
        <Link to="/proposals" className="inline-flex items-center gap-2 text-gray-500 hover:text-navy transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to proposals
        </Link>
        <Badge variant={config.variant} className="text-sm px-3 py-1">
          {config.label}
        </Badge>
      </div>

      {/* Proposal Document */}
      <Card className="overflow-hidden shadow-lg">
        {/* Colored top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-accent to-accent/60" />

        <div className="p-6 sm:p-10">
          {/* Header: Contractor + Proposal Number */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-lg bg-navy flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-bold text-navy">
                    {proposal.proposalNumber || proposal.proposal_number}
                  </h1>
                  <p className="text-sm text-gray-400">
                    Created {formatDate(proposal.createdAt || proposal.created_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Amount</p>
              <p className="text-3xl font-mono font-bold gradient-text">
                {formatCurrency(Number(proposal.total))}
              </p>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Client + Job Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Prepared For</p>
              <div className="space-y-1.5">
                <p className="font-semibold text-navy text-lg">{proposal.client?.name || 'Client'}</p>
                {proposal.client?.email && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {proposal.client.email}
                  </p>
                )}
                {proposal.client?.phone && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {proposal.client.phone}
                  </p>
                )}
                {(proposal.jobAddress || proposal.job_address) && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {proposal.jobAddress || proposal.job_address}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Project Details</p>
              <div className="space-y-1.5">
                <p className="text-sm text-gray-700">{proposal.jobDescription || proposal.job_description || 'No description'}</p>
                {(proposal.projectDuration || proposal.project_duration) && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    Estimated: {proposal.projectDuration || proposal.project_duration}
                  </p>
                )}
                {(proposal.expirationDate || proposal.expiration_date) && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    Valid until: {formatDate(proposal.expirationDate || proposal.expiration_date)}
                  </p>
                )}
                {proposal.warranty && (
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="h-3.5 w-3.5 text-gray-400" />
                    {proposal.warranty}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 mb-8">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Cost Breakdown</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Materials</span>
                <span className="font-mono font-semibold text-navy">
                  {formatCurrency(Number(proposal.materialsCost || proposal.materials_cost))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Labor</span>
                <span className="font-mono font-semibold text-navy">
                  {formatCurrency(Number(proposal.laborCost || proposal.labor_cost))}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy">Total</span>
                <span className="text-xl font-mono font-bold text-accent">
                  {formatCurrency(Number(proposal.total))}
                </span>
              </div>
            </div>
          </div>

          {/* AI Generated Content */}
          {content ? (
            <div className="relative">
              {regenerating && (
                <div className="absolute top-0 right-0">
                  <span className="inline-flex items-center gap-1.5 text-xs text-accent bg-accent/5 rounded-full px-3 py-1">
                    <Sparkles className="h-3 w-3 animate-pulse" /> Regenerating...
                  </span>
                </div>
              )}
              <div
                className="prose prose-sm sm:prose max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-gray-700 prose-li:text-gray-700 prose-table:text-sm prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              {regenerating && <span className="inline-block w-2 h-5 bg-accent animate-pulse ml-1" />}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-navy mb-2">No content generated yet</h3>
              <p className="text-gray-500 mb-4 max-w-sm mx-auto">Click below to generate professional proposal content with AI.</p>
              <Button variant="accent" onClick={handleRegenerate} disabled={regenerating || isDemo} className="btn-press">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Proposal
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Signature Info (if accepted) */}
      {proposal.status === 'accepted' && (proposal.signatureName || proposal.signature_name) && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Proposal Accepted</p>
                <p className="text-sm text-emerald-600/70">
                  Signed by {proposal.signatureName || proposal.signature_name} on{' '}
                  {formatDate(proposal.signatureDate || proposal.signature_date || proposal.acceptedAt || proposal.accepted_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="accent"
              className="btn-press flex-1 sm:flex-initial"
              onClick={handleSend}
              disabled={sending || proposal.status === 'accepted' || isDemo}
            >
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {proposal.status === 'draft' ? 'Send to Client' : 'Resend'}
            </Button>
            <Button variant="outline" onClick={handleDownloadPdf} disabled={isDemo}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button variant="ghost" onClick={handleRegenerate} disabled={regenerating || isDemo}>
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate
            </Button>

            <div className="flex-1" />

            <div className="flex gap-2">
              <Link to={isDemo ? '#' : `/proposals/${proposal.id}/edit`}>
                <Button variant="outline" size="sm" disabled={isDemo}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={deleting || isDemo}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Portal Link */}
      <div className="text-center text-sm text-gray-400 pb-4">
        <p className="mb-1">Client portal link:</p>
        <a
          href={`/p/${proposal.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline inline-flex items-center gap-1"
        >
          {window.location.origin}/p/{proposal.id}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
