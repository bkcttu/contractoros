import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Plus,
  Search,
  Trash2,
  ArrowUpDown,
  Clock,
  DollarSign,
  Filter,
  Send,
  CheckCircle2,
  XCircle,
  LayoutList,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import type { Proposal, ProposalStatus } from '@/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { showToast } from '@/components/Toaster'

const statusConfig: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' | 'accent' }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'accent' },
  viewed: { label: 'Viewed', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'danger' },
  expired: { label: 'Expired', variant: 'secondary' },
}

type TabFilter = 'all' | ProposalStatus
type SortOption = 'date' | 'amount' | 'status'

const TAB_FILTERS: { value: TabFilter; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <LayoutList className="h-3.5 w-3.5" /> },
  { value: 'draft', label: 'Draft', icon: <FileText className="h-3.5 w-3.5" /> },
  { value: 'sent', label: 'Sent', icon: <Send className="h-3.5 w-3.5" /> },
  { value: 'accepted', label: 'Accepted', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { value: 'declined', label: 'Declined', icon: <XCircle className="h-3.5 w-3.5" /> },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date')

  useEffect(() => {
    api
      .getProposals()
      .then((res) => setProposals(res.proposals))
      .catch(() => {
        setProposals([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = proposals

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter((p) => p.status === activeTab)
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((p) => {
        const clientName = (p.client?.name || '').toLowerCase()
        const number = (p.proposalNumber || p.proposal_number || '').toLowerCase()
        const desc = (p.jobDescription || p.job_description || '').toLowerCase()
        return clientName.includes(q) || number.includes(q) || desc.includes(q)
      })
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt || a.created_at || '').getTime()
        const dateB = new Date(b.createdAt || b.created_at || '').getTime()
        return dateB - dateA
      }
      if (sortBy === 'amount') {
        return Number(b.total) - Number(a.total)
      }
      // status: alphabetical
      return a.status.localeCompare(b.status)
    })

    return result
  }, [proposals, search, activeTab, sortBy])

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: proposals.length }
    for (const p of proposals) {
      counts[p.status] = (counts[p.status] || 0) + 1
    }
    return counts
  }, [proposals])

  const stats = useMemo(() => {
    const accepted = proposals.filter((p) => p.status === 'accepted')
    const totalValue = accepted.reduce((sum, p) => sum + Number(p.total), 0)
    const pending = proposals.filter((p) => p.status === 'sent' || p.status === 'viewed')
    return { totalValue, acceptedCount: accepted.length, pendingCount: pending.length }
  }, [proposals])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this proposal?')) return
    try {
      await api.deleteProposal(id)
      setProposals((prev) => prev.filter((p) => p.id !== id))
      showToast({ title: 'Proposal deleted' })
    } catch {
      showToast({ title: 'Failed to delete', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">
            Proposals
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your client proposals
          </p>
        </div>
        <Link to="/proposals/new">
          <Button variant="accent" size="lg" className="w-full sm:w-auto btn-press shadow-lg shadow-accent/20">
            <Plus className="h-5 w-5 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      {!loading && proposals.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</span>
            </div>
            <p className="text-2xl font-bold font-mono text-navy">{proposals.length}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Won</span>
            </div>
            <p className="text-2xl font-bold font-mono text-navy">{formatCurrency(stats.totalValue)}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</span>
            </div>
            <p className="text-2xl font-bold font-mono text-navy">{stats.pendingCount}</p>
          </div>
        </div>
      )}

      {/* Tab Filters */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
        {TAB_FILTERS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap btn-press',
              activeTab === tab.value
                ? 'bg-navy text-white shadow-md shadow-navy/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            )}
          >
            {tab.icon}
            {tab.label}
            {(tabCounts[tab.value] || 0) > 0 && (
              <span
                className={cn(
                  'ml-1 text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center',
                  activeTab === tab.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {tabCounts[tab.value] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by client, proposal number, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-gray-400" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Newest First
              </span>
            </SelectItem>
            <SelectItem value="amount">
              <span className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5" /> Highest Amount
              </span>
            </SelectItem>
            <SelectItem value="status">
              <span className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" /> Status
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Proposals List */}
      {loading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-11 w-11 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="py-20 text-center relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent pointer-events-none" />

            <div className="relative mx-auto w-28 h-28 mb-8">
              {/* Layered illustration */}
              <div className="absolute -top-1 -right-2 w-10 h-10 rounded-lg bg-accent/10 rotate-12 flex items-center justify-center">
                <Send className="h-4 w-4 text-accent/50" />
              </div>
              <div className="absolute -bottom-1 -left-2 w-10 h-10 rounded-lg bg-emerald-500/10 -rotate-12 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-emerald-500/50" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-accent/5 rotate-6" />
              <div className="absolute inset-0 rounded-2xl bg-navy/5 -rotate-3" />
              <div className="relative h-full w-full rounded-2xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center shadow-sm">
                <FileText className="h-12 w-12 text-gray-300" />
              </div>
            </div>
            <h3 className="text-xl font-heading font-semibold text-navy mb-2">
              {search
                ? 'No matching proposals'
                : activeTab !== 'all'
                  ? `No ${activeTab} proposals`
                  : 'No proposals yet'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
              {search
                ? 'Try adjusting your search or filter to find what you need.'
                : 'Create your first proposal and impress your clients with professional estimates.'}
            </p>
            {!search && activeTab === 'all' && (
              <Link to="/proposals/new">
                <Button variant="accent" size="lg" className="btn-press shadow-lg shadow-accent/20">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Proposal
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filtered.map((proposal, idx) => {
              const config = statusConfig[proposal.status] || statusConfig.draft
              const clientName = proposal.client?.name || 'Unknown Client'
              return (
                <Link key={proposal.id} to={`/proposals/${proposal.id}`}>
                  <div
                    className={cn(
                      'flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-all duration-200 group',
                      idx === 0 && 'rounded-t-xl'
                    )}
                  >
                    {/* Client Avatar */}
                    <div
                      className={cn(
                        'h-11 w-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm ring-2 ring-white transition-transform duration-200 group-hover:scale-105',
                        getAvatarColor(clientName)
                      )}
                    >
                      {getInitials(clientName)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-navy truncate group-hover:text-accent transition-colors">
                          {clientName}
                        </p>
                        <Badge variant={config.variant} className="shrink-0">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {proposal.proposalNumber || proposal.proposal_number}
                        {' · '}
                        {proposal.jobDescription || proposal.job_description || 'No description'}
                      </p>
                    </div>

                    {/* Amount + Date + Delete */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="font-mono font-bold text-navy">
                          {formatCurrency(Number(proposal.total))}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(proposal.createdAt || proposal.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, proposal.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>
      )}

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="text-center text-sm text-gray-400">
          Showing {filtered.length} of {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
