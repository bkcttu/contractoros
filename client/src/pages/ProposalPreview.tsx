import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Send,
  Copy,
  Check,
  Loader2,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import type { Proposal } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { showToast } from '@/components/Toaster'

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' | 'accent' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'accent' },
  viewed: { label: 'Viewed', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'danger' },
  expired: { label: 'Expired', variant: 'secondary' },
}

export function ProposalPreview() {
  const { id } = useParams<{ id: string }>()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getProposal(id)
      .then((res) => setProposal(res.proposal))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSend = async () => {
    if (!proposal) return
    setSending(true)
    try {
      await api.sendProposal(proposal.id)
      setProposal((prev) => prev ? { ...prev, status: 'sent' } : prev)
      showToast({ title: 'Proposal sent!', description: 'Your client will receive an email shortly.' })
    } catch (err) {
      showToast({ title: 'Failed to send', description: 'Please try again.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const handleRegenerate = async () => {
    if (!proposal) return
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
    } catch (err) {
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
    if (!proposal) return
    window.open(api.getProposalPdfUrl(proposal.id), '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-heading font-bold text-navy">Proposal not found</h2>
        <Link to="/proposals" className="text-accent hover:underline mt-2 inline-block">
          Back to proposals
        </Link>
      </div>
    )
  }

  const content = regenerating ? streamText : (proposal.aiContent || proposal.ai_content || '')
  const config = statusConfig[proposal.status] || statusConfig.draft

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link to="/proposals" className="text-gray-500 hover:text-navy transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading font-bold text-navy">
              {proposal.proposalNumber || proposal.proposal_number}
            </h1>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <p className="text-gray-500 mt-1">
            {proposal.client?.name || 'Client'} · {formatCurrency(Number(proposal.total))}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="accent" onClick={handleSend} disabled={sending || proposal.status === 'accepted'}>
          {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {proposal.status === 'draft' ? 'Send to Client' : 'Resend'}
        </Button>
        <Button variant="outline" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={handleCopyLink}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
        <Button variant="ghost" onClick={handleRegenerate} disabled={regenerating}>
          <Sparkles className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </div>

      {/* Proposal Details Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Materials</p>
            <p className="text-lg font-mono font-bold text-navy">
              {formatCurrency(Number(proposal.materialsCost || proposal.materials_cost))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Labor</p>
            <p className="text-lg font-mono font-bold text-navy">
              {formatCurrency(Number(proposal.laborCost || proposal.labor_cost))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-lg font-mono font-bold text-accent">
              {formatCurrency(Number(proposal.total))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Expires</p>
            <p className="text-sm font-medium text-navy">
              {proposal.expirationDate || proposal.expiration_date
                ? formatDate(proposal.expirationDate || proposal.expiration_date)
                : 'No expiration'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Generated Content */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          {content ? (
            <div className="relative">
              {regenerating && (
                <div className="absolute top-0 right-0">
                  <span className="inline-flex items-center gap-1 text-xs text-accent">
                    <Sparkles className="h-3 w-3 animate-pulse" /> Regenerating...
                  </span>
                </div>
              )}
              <div
                className="prose prose-sm sm:prose max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-gray-700 prose-table:text-sm"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              {regenerating && <span className="inline-block w-2 h-5 bg-accent animate-pulse ml-1" />}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-navy mb-2">No content generated yet</h3>
              <p className="text-gray-500 mb-4">Click the button below to generate proposal content with AI.</p>
              <Button variant="accent" onClick={handleRegenerate} disabled={regenerating}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Proposal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Info (if accepted) */}
      {proposal.status === 'accepted' && (proposal.signatureName || proposal.signature_name) && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-emerald-600">
              <Check className="h-5 w-5" />
              <div>
                <p className="font-medium">Proposal Accepted</p>
                <p className="text-sm text-gray-500">
                  Signed by {proposal.signatureName || proposal.signature_name} on{' '}
                  {formatDate(proposal.signatureDate || proposal.signature_date || proposal.acceptedAt || proposal.accepted_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Portal Link */}
      <div className="text-center text-sm text-gray-400">
        <p>Client portal link:</p>
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
