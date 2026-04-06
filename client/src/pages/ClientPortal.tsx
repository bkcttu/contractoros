import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Check, FileText, Phone, Mail, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import type { Proposal, User } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export function ClientPortal() {
  const { id } = useParams<{ id: string }>()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [contractor, setContractor] = useState<Partial<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [showSignForm, setShowSignForm] = useState(false)
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
      .catch(() => setError('Proposal not found or has expired.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSign = async () => {
    if (!id || !signatureName.trim()) return
    setSigning(true)
    try {
      await api.signProposal(id, signatureName.trim())
      setSigned(true)
      setShowSignForm(false)
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold text-navy mb-2">Proposal Not Found</h2>
            <p className="text-gray-500">{error || 'This proposal may have been removed or the link is invalid.'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const brandColor = contractor?.brandColor || contractor?.brand_color || '#F97316'
  const content = proposal.aiContent || proposal.ai_content || ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-lg text-navy">
              {contractor?.businessName || contractor?.business_name || contractor?.name || 'Contractor'}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
              {contractor?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {contractor.phone}
                </span>
              )}
              {contractor?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {contractor.email}
                </span>
              )}
            </div>
          </div>
          {proposal.status === 'accepted' ? (
            <Badge variant="success" className="text-sm px-3 py-1">Accepted</Badge>
          ) : (
            <Badge variant="accent" className="text-sm px-3 py-1" style={{ backgroundColor: brandColor }}>
              Proposal
            </Badge>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Proposal Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Proposal {proposal.proposalNumber || proposal.proposal_number} · {formatDate(proposal.createdAt || proposal.created_at)}
            </p>
            <p className="text-sm text-gray-500">
              Prepared for <span className="font-medium text-navy">{proposal.client?.name || 'Client'}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-3xl font-mono font-bold" style={{ color: brandColor }}>
              {formatCurrency(Number(proposal.total))}
            </p>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-gray-500 uppercase">Materials</p>
              <p className="text-lg font-mono font-bold text-navy">
                {formatCurrency(Number(proposal.materialsCost || proposal.materials_cost))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-gray-500 uppercase">Labor</p>
              <p className="text-lg font-mono font-bold text-navy">
                {formatCurrency(Number(proposal.laborCost || proposal.labor_cost))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-lg font-mono font-bold" style={{ color: brandColor }}>
                {formatCurrency(Number(proposal.total))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Job Address */}
        {(proposal.jobAddress || proposal.job_address) && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{proposal.jobAddress || proposal.job_address}</span>
          </div>
        )}

        {/* Proposal Content */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            {content ? (
              <div
                className="prose prose-sm sm:prose max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-gray-700"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">Proposal content is being prepared.</p>
            )}
          </CardContent>
        </Card>

        {/* Signature / Accept */}
        {signed ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy mb-2">Proposal Accepted</h3>
              <p className="text-gray-500">
                Signed by {proposal.signatureName || proposal.signature_name || signatureName} on{' '}
                {formatDate(proposal.signatureDate || proposal.signature_date || new Date().toISOString())}
              </p>
            </CardContent>
          </Card>
        ) : showSignForm ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-bold text-navy mb-4">Accept Proposal</h3>
              <p className="text-sm text-gray-500 mb-4">
                By typing your name below, you agree to the terms outlined in this proposal.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signature">Your Full Name (e-signature)</Label>
                  <Input
                    id="signature"
                    placeholder="Type your full name"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="text-lg"
                    style={{ fontFamily: 'cursive' }}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSign}
                    disabled={!signatureName.trim() || signing}
                    className="flex-1"
                    style={{ backgroundColor: brandColor }}
                  >
                    {signing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Accept & Sign
                  </Button>
                  <Button variant="outline" onClick={() => setShowSignForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 text-white"
              style={{ backgroundColor: brandColor }}
              onClick={() => setShowSignForm(true)}
            >
              <Check className="h-5 w-5 mr-2" />
              Accept Proposal
            </Button>
          </div>
        )}

        {/* Expiration Notice */}
        {(proposal.expirationDate || proposal.expiration_date) && !signed && (
          <p className="text-center text-sm text-gray-400">
            This proposal expires on {formatDate(proposal.expirationDate || proposal.expiration_date)}
          </p>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">Powered by ContractorOS</p>
        </div>
      </main>
    </div>
  )
}
