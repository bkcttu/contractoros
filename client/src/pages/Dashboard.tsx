import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, DollarSign, Clock, CheckCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

export function Dashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProposals()
      .then((res) => setProposals(res.proposals))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: proposals.length,
    totalValue: proposals.reduce((sum, p) => sum + Number(p.total), 0),
    accepted: proposals.filter((p) => p.status === 'accepted').length,
    pending: proposals.filter((p) => ['sent', 'viewed'].includes(p.status)).length,
    conversionRate: proposals.length > 0
      ? Math.round((proposals.filter((p) => p.status === 'accepted').length / proposals.length) * 100)
      : 0,
  }

  const recentProposals = proposals.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here's your business at a glance.</p>
        </div>
        <Link to="/proposals/new">
          <Button variant="accent" size="lg" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Proposals</p>
                <p className="text-2xl font-bold font-mono text-navy">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold font-mono text-navy">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Win Rate</p>
                <p className="text-2xl font-bold font-mono text-navy">{stats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold font-mono text-navy">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Proposals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Proposals</CardTitle>
          <Link to="/proposals">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : recentProposals.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-navy mb-2">No proposals yet</h3>
              <p className="text-gray-500 mb-4">Create your first AI-powered proposal in minutes.</p>
              <Link to="/proposals/new">
                <Button variant="accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProposals.map((proposal) => {
                const config = statusConfig[proposal.status] || statusConfig.draft
                return (
                  <Link
                    key={proposal.id}
                    to={`/proposals/${proposal.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-navy/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy truncate">
                        {proposal.client?.name || 'Unknown Client'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {proposal.proposalNumber || proposal.proposal_number} · {formatDate(proposal.createdAt || proposal.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-medium text-navy hidden sm:block">
                        {formatCurrency(Number(proposal.total))}
                      </span>
                      <Badge variant={config.variant}>{config.label}</Badge>
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
