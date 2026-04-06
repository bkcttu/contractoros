import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, Search, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import type { Proposal } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' | 'accent' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'accent' },
  viewed: { label: 'Viewed', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'danger' },
  expired: { label: 'Expired', variant: 'secondary' },
}

export function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getProposals()
      .then((res) => setProposals(res.proposals))
      .catch(() => setProposals([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = proposals.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    const clientName = (p.client?.name || '').toLowerCase()
    const number = (p.proposalNumber || p.proposal_number || '').toLowerCase()
    const desc = (p.jobDescription || p.job_description || '').toLowerCase()
    return clientName.includes(q) || number.includes(q) || desc.includes(q)
  })

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this proposal?')) return
    try {
      await api.deleteProposal(id)
      setProposals((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">Proposals</h1>
          <p className="text-gray-500 mt-1">{proposals.length} total proposals</p>
        </div>
        <Link to="/proposals/new">
          <Button variant="accent" size="lg" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by client, proposal number, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Proposals */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-navy mb-2">
                {search ? 'No matching proposals' : 'No proposals yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {search ? 'Try a different search term.' : 'Create your first proposal to get started.'}
              </p>
              {!search && (
                <Link to="/proposals/new">
                  <Button variant="accent">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Proposal
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((proposal) => {
                const config = statusConfig[proposal.status] || statusConfig.draft
                return (
                  <Link
                    key={proposal.id}
                    to={`/proposals/${proposal.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-navy/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-navy truncate">
                          {proposal.client?.name || 'Unknown Client'}
                        </p>
                        <Badge variant={config.variant} className="shrink-0">{config.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {proposal.proposalNumber || proposal.proposal_number} · {proposal.jobDescription || proposal.job_description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="font-mono font-medium text-navy">
                          {formatCurrency(Number(proposal.total))}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(proposal.createdAt || proposal.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, proposal.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
