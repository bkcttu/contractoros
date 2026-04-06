import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  DollarSign,
  FileText,
  TrendingUp,
  BarChart3,
  Eye,
  CheckCircle,
  Send,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import type { Proposal } from '@/types'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Status badge config
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Demo data — used when the API is unavailable
// ---------------------------------------------------------------------------
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const DEMO_PROPOSALS: Proposal[] = [
  {
    id: 'demo-1',
    userId: 'u1',
    clientId: 'c1',
    client: { id: 'c1', userId: 'u1', name: 'John Smith', email: 'john@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(60) },
    proposalNumber: 'P-1044',
    status: 'accepted',
    jobDescription: 'Full HVAC system installation — 3-ton Carrier unit with ductwork for 2,400 sq ft home',
    jobAddress: '123 Oak St',
    materialsCost: 9500,
    laborCost: 6500,
    total: 16000,
    paymentTerms: '50_upfront',
    warranty: '2 years',
    specialNotes: null,
    expirationDate: daysAgo(-30),
    projectDuration: '5 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: daysAgo(4),
    acceptedAt: daysAgo(3),
    signatureName: 'John Smith',
    signatureDate: daysAgo(3),
    createdAt: daysAgo(5),
  },
  {
    id: 'demo-2',
    userId: 'u1',
    clientId: 'c2',
    client: { id: 'c2', userId: 'u1', name: 'Maria Garcia', email: 'maria@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(45) },
    proposalNumber: 'P-1042',
    status: 'viewed',
    jobDescription: 'Complete bathroom remodel — walk-in shower, double vanity, heated floors',
    jobAddress: '456 Maple Ave',
    materialsCost: 12000,
    laborCost: 10500,
    total: 22500,
    paymentTerms: '50_upfront',
    warranty: '1 year',
    specialNotes: null,
    expirationDate: daysAgo(-14),
    projectDuration: '10 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: daysAgo(0),
    acceptedAt: null,
    signatureName: null,
    signatureDate: null,
    createdAt: daysAgo(2),
  },
  {
    id: 'demo-3',
    userId: 'u1',
    clientId: 'c3',
    client: { id: 'c3', userId: 'u1', name: 'Robert Johnson', email: 'robert@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(30) },
    proposalNumber: 'P-1039',
    status: 'accepted',
    jobDescription: 'Roof repair — replace damaged shingles, fix flashing around chimney, clean gutters',
    jobAddress: '789 Elm Dr',
    materialsCost: 3200,
    laborCost: 5550,
    total: 8750,
    paymentTerms: 'due_on_completion',
    warranty: '5 years',
    specialNotes: null,
    expirationDate: daysAgo(-20),
    projectDuration: '3 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: daysAgo(8),
    acceptedAt: daysAgo(7),
    signatureName: 'Robert Johnson',
    signatureDate: daysAgo(7),
    createdAt: daysAgo(10),
  },
  {
    id: 'demo-4',
    userId: 'u1',
    clientId: 'c4',
    client: { id: 'c4', userId: 'u1', name: 'Lisa Chen', email: 'lisa@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(20) },
    proposalNumber: 'P-1041',
    status: 'sent',
    jobDescription: 'Kitchen electrical upgrade — new panel, under-cabinet lighting, island outlets',
    jobAddress: '321 Pine Rd',
    materialsCost: 2800,
    laborCost: 4200,
    total: 7000,
    paymentTerms: 'net_30',
    warranty: '1 year',
    specialNotes: null,
    expirationDate: daysAgo(-21),
    projectDuration: '4 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: null,
    acceptedAt: null,
    signatureName: null,
    signatureDate: null,
    createdAt: daysAgo(1),
  },
  {
    id: 'demo-5',
    userId: 'u1',
    clientId: 'c5',
    client: { id: 'c5', userId: 'u1', name: 'James Wilson', email: 'james@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(50) },
    proposalNumber: 'P-1038',
    status: 'accepted',
    jobDescription: 'Exterior house painting — scraping, priming, two-coat paint, trim work',
    jobAddress: '555 Cedar Ln',
    materialsCost: 1800,
    laborCost: 6950,
    total: 8750,
    paymentTerms: '50_upfront',
    warranty: '3 years',
    specialNotes: null,
    expirationDate: daysAgo(-10),
    projectDuration: '6 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: daysAgo(14),
    acceptedAt: daysAgo(12),
    signatureName: 'James Wilson',
    signatureDate: daysAgo(12),
    createdAt: daysAgo(15),
  },
  {
    id: 'demo-6',
    userId: 'u1',
    clientId: 'c6',
    client: { id: 'c6', userId: 'u1', name: 'Sarah Kim', email: 'sarah@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(25) },
    proposalNumber: 'P-1036',
    status: 'viewed',
    jobDescription: 'Landscape design — paver patio, retaining wall, irrigation system, sod installation',
    jobAddress: '987 Birch Ct',
    materialsCost: 18000,
    laborCost: 27000,
    total: 45000,
    paymentTerms: '50_upfront',
    warranty: '2 years',
    specialNotes: null,
    expirationDate: daysAgo(-7),
    projectDuration: '14 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: daysAgo(1),
    acceptedAt: null,
    signatureName: null,
    signatureDate: null,
    createdAt: daysAgo(3),
  },
  {
    id: 'demo-7',
    userId: 'u1',
    clientId: 'c7',
    client: { id: 'c7', userId: 'u1', name: 'David Park', email: 'david@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(10) },
    proposalNumber: 'P-1043',
    status: 'draft',
    jobDescription: 'Plumbing — re-pipe whole house from galvanized to PEX, replace water heater',
    jobAddress: '654 Walnut St',
    materialsCost: 3500,
    laborCost: 5000,
    total: 8500,
    paymentTerms: 'net_30',
    warranty: '10 years',
    specialNotes: null,
    expirationDate: daysAgo(-30),
    projectDuration: '4 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: null,
    acceptedAt: null,
    signatureName: null,
    signatureDate: null,
    createdAt: daysAgo(0),
  },
  {
    id: 'demo-8',
    userId: 'u1',
    clientId: 'c8',
    client: { id: 'c8', userId: 'u1', name: 'Emily Adams', email: 'emily@example.com', phone: null, address: null, notes: null, createdAt: daysAgo(35) },
    proposalNumber: 'P-1035',
    status: 'declined',
    jobDescription: 'Basement waterproofing — interior drain tile, sump pump, wall sealant',
    jobAddress: '222 Spruce Way',
    materialsCost: 1200,
    laborCost: 1300,
    total: 2500,
    paymentTerms: 'due_on_completion',
    warranty: 'Lifetime',
    specialNotes: null,
    expirationDate: daysAgo(5),
    projectDuration: '2 days',
    aiContent: null,
    pdfUrl: null,
    viewedAt: daysAgo(22),
    acceptedAt: null,
    signatureName: null,
    signatureDate: null,
    createdAt: daysAgo(25),
  },
]

// ---------------------------------------------------------------------------
// Revenue chart data (last 6 months)
// ---------------------------------------------------------------------------
function getRevenueData() {
  const months: { label: string; value: number }[] = []
  const now = new Date()
  const values = [12400, 18750, 9200, 24800, 31500, 33500]
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      label: d.toLocaleString('default', { month: 'short' }),
      value: values[5 - i],
    })
  }
  return months
}

// ---------------------------------------------------------------------------
// Activity feed items
// ---------------------------------------------------------------------------
interface ActivityItem {
  id: string
  icon: typeof Eye
  iconColor: string
  dotColor: string
  text: React.ReactNode
  time: string
}

const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    icon: Eye,
    iconColor: 'text-amber-500',
    dotColor: 'bg-amber-500',
    text: (
      <>
        <span className="font-medium text-navy">Maria Garcia</span> viewed{' '}
        <span className="font-mono text-sm">Proposal #1042</span>
      </>
    ),
    time: '2 hours ago',
  },
  {
    id: 'a2',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    dotColor: 'bg-emerald-500',
    text: (
      <>
        <span className="font-medium text-navy">Robert Johnson</span> accepted{' '}
        <span className="font-mono text-sm">Proposal #1039</span>
      </>
    ),
    time: '5 hours ago',
  },
  {
    id: 'a3',
    icon: Send,
    iconColor: 'text-accent',
    dotColor: 'bg-accent',
    text: (
      <>
        New proposal sent to <span className="font-medium text-navy">Lisa Chen</span>
      </>
    ),
    time: '1 day ago',
  },
  {
    id: 'a4',
    icon: DollarSign,
    iconColor: 'text-emerald-500',
    dotColor: 'bg-emerald-500',
    text: (
      <>
        Payment received from <span className="font-medium text-navy">James Wilson</span>{' '}
        &mdash; <span className="font-mono font-medium">$8,750</span>
      </>
    ),
    time: '2 days ago',
  },
  {
    id: 'a5',
    icon: MessageSquare,
    iconColor: 'text-blue-500',
    dotColor: 'bg-blue-500',
    text: (
      <>
        <span className="font-medium text-navy">Sarah Kim</span> requested changes on{' '}
        <span className="font-mono text-sm">Proposal #1036</span>
      </>
    ),
    time: '3 days ago',
  },
]

// ---------------------------------------------------------------------------
// Dashboard component
// ---------------------------------------------------------------------------
export function Dashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    api
      .getProposals()
      .then((res) => {
        if (res.proposals && res.proposals.length > 0) {
          setProposals(res.proposals)
        } else {
          setProposals(DEMO_PROPOSALS)
          setIsDemo(true)
        }
      })
      .catch(() => {
        setProposals(DEMO_PROPOSALS)
        setIsDemo(true)
      })
      .finally(() => setLoading(false))
  }, [])

  // -- Computed stats -------------------------------------------------------
  const acceptedProposals = proposals.filter((p) => p.status === 'accepted')
  const totalRevenue = acceptedProposals.reduce((sum, p) => sum + Number(p.total), 0)
  const activeCount = proposals.filter((p) => ['sent', 'viewed'].includes(p.status)).length
  const winRate =
    proposals.length > 0
      ? Math.round((acceptedProposals.length / proposals.length) * 100)
      : 0
  const avgValue =
    proposals.length > 0
      ? proposals.reduce((s, p) => s + Number(p.total), 0) / proposals.length
      : 0

  const recentProposals = [...proposals]
    .sort((a, b) => new Date(b.createdAt || b.created_at || '').getTime() - new Date(a.createdAt || a.created_at || '').getTime())
    .slice(0, 5)

  const revenueData = getRevenueData()
  const maxRevenue = Math.max(...revenueData.map((m) => m.value))

  // -- Loading skeleton -----------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-9 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="h-72 bg-gray-100 rounded-xl" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 h-80 bg-gray-100 rounded-xl" />
          <div className="lg:col-span-2 h-80 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back. Here&rsquo;s your business at a glance.
            {isDemo && (
              <span className="ml-2 inline-flex items-center text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                Demo Data
              </span>
            )}
          </p>
        </div>
        <Link to="/proposals/new">
          <Button variant="accent" size="lg" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Stats Row                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold font-mono text-emerald-600 truncate">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Proposals */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-lg">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Proposals</p>
                <p className="text-2xl font-bold font-mono text-navy">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={cn('p-2.5 rounded-lg', winRate >= 50 ? 'bg-emerald-50' : 'bg-amber-50')}>
                <TrendingUp className={cn('h-5 w-5', winRate >= 50 ? 'text-emerald-600' : 'text-amber-600')} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Win Rate</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-2xl font-bold font-mono text-navy">{winRate}%</p>
                  {winRate >= 50 ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg. Proposal Value */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Avg. Value</p>
                <p className="text-2xl font-bold font-mono text-navy truncate">
                  {formatCurrency(avgValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Revenue Chart                                                     */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Revenue — Last 6 Months
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chart container */}
          <div className="flex items-end gap-2 sm:gap-4 h-56 sm:h-64">
            {revenueData.map((month, idx) => {
              const pct = maxRevenue > 0 ? (month.value / maxRevenue) * 100 : 0
              const isLatest = idx === revenueData.length - 1
              return (
                <div key={month.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Value label */}
                  <span
                    className={cn(
                      'text-xs font-mono font-medium transition-opacity',
                      isLatest ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-100 text-gray-500',
                    )}
                  >
                    {formatCurrency(month.value)}
                  </span>
                  {/* Bar */}
                  <div
                    className={cn(
                      'w-full rounded-t-md transition-all duration-500 ease-out',
                      isLatest
                        ? 'bg-accent hover:bg-accent/90'
                        : 'bg-navy/80 hover:bg-navy',
                    )}
                    style={{ height: `${pct}%`, minHeight: pct > 0 ? '4px' : '0px' }}
                  />
                  {/* Month label */}
                  <span className="text-xs text-gray-500 font-medium">{month.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Two-column: Recent Proposals + Activity Feed                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Proposals — wider */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Proposals</CardTitle>
            <Link to="/proposals">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
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
                      <p className="text-sm text-gray-400 truncate">
                        {proposal.proposalNumber || proposal.proposal_number} &middot;{' '}
                        {(proposal.jobDescription || proposal.job_description || '').slice(0, 50)}
                        {(proposal.jobDescription || proposal.job_description || '').length > 50 && '...'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-semibold text-navy hidden sm:block">
                        {formatCurrency(Number(proposal.total))}
                      </span>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed — narrower */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

              <div className="space-y-6">
                {DEMO_ACTIVITY.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="relative flex gap-4">
                      {/* Dot + icon */}
                      <div className="relative z-10 flex items-center justify-center h-8 w-8 rounded-full bg-white border-2 border-gray-100 shrink-0">
                        <Icon className={cn('h-4 w-4', item.iconColor)} />
                      </div>
                      {/* Content */}
                      <div className="pt-0.5 min-w-0">
                        <p className="text-sm text-gray-600 leading-snug">{item.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
