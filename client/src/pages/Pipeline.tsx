import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Send,
  Eye,
  MousePointerClick,
  Flame,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  Trophy,
  Clock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  BarChart3,
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import type { Proposal } from '@/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function relativeTime(dateStr: string, prefix: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return `${prefix} just now`
  if (diffMin < 60) return `${prefix} ${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${prefix} ${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay === 1) return `${prefix} 1d ago`
  return `${prefix} ${diffDay}d ago`
}

// ---------------------------------------------------------------------------
// Pipeline stage types
// ---------------------------------------------------------------------------
type PipelineStage = 'sent' | 'opened' | 'engaged' | 'hot_lead' | 'closed_won' | 'closed_lost'

interface PipelineDeal {
  proposal: Proposal
  stage: PipelineStage
  viewCount: number
  timeSpent: string
  clickedLinks: boolean
  checkedAddOns: boolean
}

type TimeFilter = 'all' | 'week' | 'month'

// ---------------------------------------------------------------------------
// Stage configuration
// ---------------------------------------------------------------------------
interface StageConfig {
  key: PipelineStage | 'closed'
  label: string
  icon: typeof Send
  bgColor: string
  borderColor: string
  badgeBg: string
  badgeText: string
  headerBg: string
}

const STAGE_CONFIGS: StageConfig[] = [
  {
    key: 'sent',
    label: 'Sent',
    icon: Send,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    badgeBg: 'bg-gray-200',
    badgeText: 'text-gray-700',
    headerBg: 'bg-gray-100',
  },
  {
    key: 'opened',
    label: 'Opened',
    icon: Eye,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    badgeBg: 'bg-blue-200',
    badgeText: 'text-blue-700',
    headerBg: 'bg-blue-100',
  },
  {
    key: 'engaged',
    label: 'Engaged',
    icon: MousePointerClick,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    badgeBg: 'bg-amber-200',
    badgeText: 'text-amber-700',
    headerBg: 'bg-amber-100',
  },
  {
    key: 'hot_lead',
    label: 'Hot Lead',
    icon: Flame,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    badgeBg: 'bg-orange-200',
    badgeText: 'text-orange-700',
    headerBg: 'bg-orange-100',
  },
  {
    key: 'closed',
    label: 'Closed',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    badgeBg: 'bg-green-200',
    badgeText: 'text-green-700',
    headerBg: 'bg-green-100',
  },
]

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------
const DEMO_DEALS: PipelineDeal[] = [
  // SENT (2)
  {
    proposal: {
      id: 'pipe-1',
      userId: 'u1',
      clientId: 'c1',
      client: { id: 'c1', userId: 'u1', name: 'Lisa Chen', email: 'lisa@example.com', phone: '(555) 567-8901', address: '321 Pine Rd, Austin TX', notes: null, createdAt: daysAgo(30) },
      proposalNumber: 'P-1050',
      status: 'sent',
      jobDescription: 'Electrical panel upgrade — 200-amp service with EV charger outlet',
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
    stage: 'sent',
    viewCount: 0,
    timeSpent: '0s',
    clickedLinks: false,
    checkedAddOns: false,
  },
  {
    proposal: {
      id: 'pipe-2',
      userId: 'u1',
      clientId: 'c2',
      client: { id: 'c2', userId: 'u1', name: 'Tom Bradley', email: 'tom@example.com', phone: '(555) 234-5678', address: '88 Sunset Blvd, Austin TX', notes: null, createdAt: daysAgo(20) },
      proposalNumber: 'P-1049',
      status: 'sent',
      jobDescription: 'Fence installation — 180 ft cedar privacy fence with gate',
      jobAddress: '88 Sunset Blvd',
      materialsCost: 3600,
      laborCost: 2900,
      total: 6500,
      paymentTerms: '50_upfront',
      warranty: '5 years',
      specialNotes: null,
      expirationDate: daysAgo(-14),
      projectDuration: '3 days',
      aiContent: null,
      pdfUrl: null,
      viewedAt: null,
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(4),
    },
    stage: 'sent',
    viewCount: 0,
    timeSpent: '0s',
    clickedLinks: false,
    checkedAddOns: false,
  },
  // OPENED (2)
  {
    proposal: {
      id: 'pipe-3',
      userId: 'u1',
      clientId: 'c3',
      client: { id: 'c3', userId: 'u1', name: 'Maria Garcia', email: 'maria@example.com', phone: '(555) 345-6789', address: '456 Maple Ave, Austin TX', notes: null, createdAt: daysAgo(45) },
      proposalNumber: 'P-1048',
      status: 'viewed',
      jobDescription: 'Bathroom renovation — walk-in shower, double vanity, heated tile floors',
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
      viewedAt: daysAgo(1),
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(3),
    },
    stage: 'opened',
    viewCount: 1,
    timeSpent: '45s',
    clickedLinks: false,
    checkedAddOns: false,
  },
  {
    proposal: {
      id: 'pipe-4',
      userId: 'u1',
      clientId: 'c4',
      client: { id: 'c4', userId: 'u1', name: 'Kevin Park', email: 'kevin@example.com', phone: '(555) 456-7890', address: '77 Willow St, Austin TX', notes: null, createdAt: daysAgo(15) },
      proposalNumber: 'P-1047',
      status: 'viewed',
      jobDescription: 'Deck staining and sealing — 500 sq ft composite deck',
      jobAddress: '77 Willow St',
      materialsCost: 800,
      laborCost: 1700,
      total: 2500,
      paymentTerms: 'due_on_completion',
      warranty: '2 years',
      specialNotes: null,
      expirationDate: daysAgo(-10),
      projectDuration: '2 days',
      aiContent: null,
      pdfUrl: null,
      viewedAt: daysAgo(2),
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(5),
    },
    stage: 'opened',
    viewCount: 1,
    timeSpent: '30s',
    clickedLinks: false,
    checkedAddOns: false,
  },
  // ENGAGED (2)
  {
    proposal: {
      id: 'pipe-5',
      userId: 'u1',
      clientId: 'c5',
      client: { id: 'c5', userId: 'u1', name: 'Sarah Kim', email: 'sarah@example.com', phone: '(555) 789-0123', address: '987 Birch Ct, Austin TX', notes: null, createdAt: daysAgo(25) },
      proposalNumber: 'P-1046',
      status: 'viewed',
      jobDescription: 'Landscaping redesign — paver patio, retaining wall, irrigation system',
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
      viewedAt: daysAgo(0),
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(6),
    },
    stage: 'engaged',
    viewCount: 4,
    timeSpent: '3m 12s',
    clickedLinks: true,
    checkedAddOns: false,
  },
  {
    proposal: {
      id: 'pipe-6',
      userId: 'u1',
      clientId: 'c6',
      client: { id: 'c6', userId: 'u1', name: 'David Brown', email: 'david@example.com', phone: '(555) 890-1234', address: '654 Walnut St, Austin TX', notes: null, createdAt: daysAgo(10) },
      proposalNumber: 'P-1045',
      status: 'viewed',
      jobDescription: 'Deck construction — 400 sq ft composite deck with pergola',
      jobAddress: '654 Walnut St',
      materialsCost: 5500,
      laborCost: 3000,
      total: 8500,
      paymentTerms: 'net_30',
      warranty: '10 years',
      specialNotes: null,
      expirationDate: daysAgo(-30),
      projectDuration: '7 days',
      aiContent: null,
      pdfUrl: null,
      viewedAt: daysAgo(0),
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(4),
    },
    stage: 'engaged',
    viewCount: 3,
    timeSpent: '2m 45s',
    clickedLinks: true,
    checkedAddOns: false,
  },
  // HOT LEAD (2)
  {
    proposal: {
      id: 'pipe-7',
      userId: 'u1',
      clientId: 'c7',
      client: { id: 'c7', userId: 'u1', name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', address: '123 Oak St, Austin TX', notes: null, createdAt: daysAgo(60) },
      proposalNumber: 'P-1044',
      status: 'viewed',
      jobDescription: 'Full HVAC system installation — 3-ton Carrier unit with ductwork',
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
      viewedAt: daysAgo(0),
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(5),
    },
    stage: 'hot_lead',
    viewCount: 7,
    timeSpent: '8m 22s',
    clickedLinks: true,
    checkedAddOns: true,
  },
  {
    proposal: {
      id: 'pipe-8',
      userId: 'u1',
      clientId: 'c8',
      client: { id: 'c8', userId: 'u1', name: 'Rachel Adams', email: 'rachel@example.com', phone: '(555) 321-6543', address: '410 Magnolia Dr, Austin TX', notes: null, createdAt: daysAgo(12) },
      proposalNumber: 'P-1043',
      status: 'viewed',
      jobDescription: 'Kitchen remodel — custom cabinets, quartz countertops, backsplash',
      jobAddress: '410 Magnolia Dr',
      materialsCost: 15000,
      laborCost: 12000,
      total: 27000,
      paymentTerms: '50_upfront',
      warranty: '5 years',
      specialNotes: null,
      expirationDate: daysAgo(-20),
      projectDuration: '12 days',
      aiContent: null,
      pdfUrl: null,
      viewedAt: daysAgo(0),
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(3),
    },
    stage: 'hot_lead',
    viewCount: 5,
    timeSpent: '6m 10s',
    clickedLinks: true,
    checkedAddOns: true,
  },
  // CLOSED WON (1)
  {
    proposal: {
      id: 'pipe-9',
      userId: 'u1',
      clientId: 'c9',
      client: { id: 'c9', userId: 'u1', name: 'Robert Johnson', email: 'robert@example.com', phone: '(555) 654-3210', address: '789 Elm Dr, Austin TX', notes: null, createdAt: daysAgo(30) },
      proposalNumber: 'P-1042',
      status: 'accepted',
      jobDescription: 'Roof repair — replace damaged shingles, fix flashing around chimney',
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
    stage: 'closed_won',
    viewCount: 3,
    timeSpent: '4m 15s',
    clickedLinks: true,
    checkedAddOns: false,
  },
  // CLOSED LOST (1)
  {
    proposal: {
      id: 'pipe-10',
      userId: 'u1',
      clientId: 'c10',
      client: { id: 'c10', userId: 'u1', name: 'Jennifer Davis', email: 'jennifer@example.com', phone: '(555) 901-2345', address: '222 Spruce Way, Austin TX', notes: null, createdAt: daysAgo(35) },
      proposalNumber: 'P-1041',
      status: 'declined',
      jobDescription: 'Window replacement — 12 double-hung vinyl windows, energy efficient',
      jobAddress: '222 Spruce Way',
      materialsCost: 4800,
      laborCost: 3600,
      total: 8400,
      paymentTerms: 'net_30',
      warranty: 'Lifetime',
      specialNotes: null,
      expirationDate: daysAgo(5),
      projectDuration: '4 days',
      aiContent: null,
      pdfUrl: null,
      viewedAt: daysAgo(22),
      acceptedAt: null,
      signatureName: null,
      signatureDate: null,
      createdAt: daysAgo(25),
    },
    stage: 'closed_lost',
    viewCount: 2,
    timeSpent: '1m 30s',
    clickedLinks: false,
    checkedAddOns: false,
  },
]

// ---------------------------------------------------------------------------
// Map API proposals to pipeline deals (heuristic-based stage assignment)
// ---------------------------------------------------------------------------
function proposalsToPipelineDeals(proposals: Proposal[]): PipelineDeal[] {
  return proposals
    .filter((p) => p.status !== 'draft' && p.status !== 'expired')
    .map((p): PipelineDeal => {
      let stage: PipelineStage = 'sent'
      let viewCount = 0
      let timeSpent = '0s'
      const clickedLinks = false
      const checkedAddOns = false

      if (p.status === 'accepted') {
        stage = 'closed_won'
        viewCount = 3
        timeSpent = '4m'
      } else if (p.status === 'declined') {
        stage = 'closed_lost'
        viewCount = 2
        timeSpent = '1m'
      } else if (p.status === 'viewed' && p.viewedAt) {
        // Simple heuristic: more recently viewed = more engaged
        const viewedAgoMs = Date.now() - new Date(p.viewedAt).getTime()
        const viewedAgoDays = viewedAgoMs / (1000 * 60 * 60 * 24)
        if (viewedAgoDays < 1) {
          stage = 'engaged'
          viewCount = 3
          timeSpent = '2m 30s'
        } else {
          stage = 'opened'
          viewCount = 1
          timeSpent = '30s'
        }
      } else if (p.status === 'sent') {
        stage = 'sent'
      }

      return {
        proposal: p,
        stage,
        viewCount,
        timeSpent,
        clickedLinks,
        checkedAddOns,
      }
    })
}

// ---------------------------------------------------------------------------
// Get deals for a given column key
// ---------------------------------------------------------------------------
function getDealsForColumn(deals: PipelineDeal[], columnKey: string): PipelineDeal[] {
  if (columnKey === 'closed') {
    return deals.filter((d) => d.stage === 'closed_won' || d.stage === 'closed_lost')
  }
  return deals.filter((d) => d.stage === columnKey)
}

function getColumnTotal(deals: PipelineDeal[]): number {
  return deals.reduce((sum, d) => sum + Number(d.proposal.total), 0)
}

// ---------------------------------------------------------------------------
// Time label for deal card
// ---------------------------------------------------------------------------
function getDealTimeLabel(deal: PipelineDeal): string {
  const p = deal.proposal
  if (deal.stage === 'closed_won') {
    return relativeTime(p.acceptedAt || p.viewedAt || p.createdAt, 'Won')
  }
  if (deal.stage === 'closed_lost') {
    return relativeTime(p.viewedAt || p.createdAt, 'Lost')
  }
  if (deal.stage === 'opened' || deal.stage === 'engaged' || deal.stage === 'hot_lead') {
    return relativeTime(p.viewedAt || p.createdAt, 'Opened')
  }
  return relativeTime(p.createdAt, 'Sent')
}

// ---------------------------------------------------------------------------
// Border color for card left border
// ---------------------------------------------------------------------------
function getCardBorderColor(deal: PipelineDeal): string {
  switch (deal.stage) {
    case 'sent':
      return 'border-l-gray-400'
    case 'opened':
      return 'border-l-blue-400'
    case 'engaged':
      return 'border-l-amber-400'
    case 'hot_lead':
      return 'border-l-orange-500'
    case 'closed_won':
      return 'border-l-green-500'
    case 'closed_lost':
      return 'border-l-red-500'
  }
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function PipelineSkeleton() {
  return (
    <div className="space-y-8 p-1">
      <div className="h-8 w-48 rounded-lg bg-gray-100 shimmer" />
      <div className="h-5 w-72 rounded bg-gray-100 shimmer" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 shimmer" />
        ))}
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="min-w-[280px] h-96 rounded-xl bg-gray-100 shimmer" />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pipeline component
// ---------------------------------------------------------------------------
export function Pipeline() {
  const [deals, setDeals] = useState<PipelineDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Make all fade-in elements visible on mount
  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      containerRef.current
        ?.querySelectorAll('.fade-in-up, .reveal-fade, .scale-in, .stagger-children')
        .forEach((el) => {
          el.classList.add('visible')
        })
    }, 50)
    return () => clearTimeout(timer)
  }, [loading])

  // Fetch proposals
  useEffect(() => {
    api
      .getProposals()
      .then((res) => {
        if (res.proposals && res.proposals.length > 0) {
          const mapped = proposalsToPipelineDeals(res.proposals)
          if (mapped.length > 0) {
            setDeals(mapped)
          } else {
            setDeals(DEMO_DEALS)
            setIsDemo(true)
          }
        } else {
          setDeals(DEMO_DEALS)
          setIsDemo(true)
        }
      })
      .catch(() => {
        setDeals(DEMO_DEALS)
        setIsDemo(true)
      })
      .finally(() => setLoading(false))
  }, [])

  // Toggle column collapse (mobile)
  const toggleColumn = (key: string) => {
    setCollapsedColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Filter deals by time
  const filteredDeals = deals.filter((deal) => {
    if (timeFilter === 'all') return true
    const createdAt = new Date(deal.proposal.createdAt || deal.proposal.created_at || '').getTime()
    const now = Date.now()
    if (timeFilter === 'week') return now - createdAt <= 7 * 24 * 60 * 60 * 1000
    if (timeFilter === 'month') return now - createdAt <= 30 * 24 * 60 * 60 * 1000
    return true
  })

  // Computed stats
  const openDeals = filteredDeals.filter(
    (d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost'
  )
  const totalPipelineValue = openDeals.reduce((sum, d) => sum + Number(d.proposal.total), 0)
  const proposalCount = openDeals.length
  const hotLeadCount = filteredDeals.filter((d) => d.stage === 'hot_lead').length
  const closedWonDeals = filteredDeals.filter((d) => d.stage === 'closed_won')
  const closedWonValue = closedWonDeals.reduce((sum, d) => sum + Number(d.proposal.total), 0)
  const closedCount = closedWonDeals.length

  if (loading) {
    return <PipelineSkeleton />
  }

  return (
    <div ref={containerRef} className="space-y-6 p-1">
      {/* ================================================================= */}
      {/* Header                                                            */}
      {/* ================================================================= */}
      <div className="fade-in-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy tracking-tight">
            Deal Pipeline
          </h1>
          <p className="text-gray-500 mt-1.5 font-body">
            Track every proposal from sent to signed.
            {isDemo && (
              <span className="ml-2 inline-flex items-center text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                Demo Mode
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'week', 'month'] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
            >
              {filter === 'all' ? 'All' : filter === 'week' ? 'This Week' : 'This Month'}
            </Button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* Pipeline Stats Bar                                                */}
      {/* ================================================================= */}
      <div className="fade-in-up grid grid-cols-2 md:grid-cols-4 gap-4" style={{ animationDelay: '0.05s' }}>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">Pipeline Value</p>
              <p className="text-lg font-bold font-mono text-navy truncate">
                {formatCurrency(totalPipelineValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">In Pipeline</p>
              <p className="text-lg font-bold text-navy">{proposalCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">Hot Leads</p>
              <p className="text-lg font-bold text-orange-600">{hotLeadCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
              <Trophy className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">Closed This Month</p>
              <p className="text-lg font-bold text-emerald-600">
                {closedCount} ({formatCurrency(closedWonValue)})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Pipeline Columns                                                  */}
      {/* ================================================================= */}
      <div
        className="fade-in-up flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none scrollbar-thin"
        style={{ animationDelay: '0.1s' }}
      >
        {STAGE_CONFIGS.map((stage) => {
          const columnDeals = getDealsForColumn(filteredDeals, stage.key)
          const columnTotal = getColumnTotal(columnDeals)
          const isCollapsed = collapsedColumns[stage.key] ?? false
          const StageIcon = stage.icon

          return (
            <div
              key={stage.key}
              className={cn(
                'snap-start min-w-[280px] md:min-w-0 md:flex-1 rounded-xl border flex flex-col',
                stage.bgColor,
                'border-gray-200'
              )}
            >
              {/* Column Header — sticky */}
              <div
                className={cn(
                  'sticky top-0 z-10 rounded-t-xl px-4 py-3 flex items-center justify-between cursor-pointer md:cursor-default',
                  stage.headerBg
                )}
                onClick={() => toggleColumn(stage.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleColumn(stage.key)
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-2">
                  <StageIcon className="h-4 w-4 text-gray-600" />
                  <span className="font-semibold text-sm text-navy">{stage.label}</span>
                  <span
                    className={cn(
                      'text-xs font-bold rounded-full px-2 py-0.5',
                      stage.badgeBg,
                      stage.badgeText
                    )}
                  >
                    {columnDeals.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">
                    {formatCurrency(columnTotal)}
                  </span>
                  <span className="md:hidden">
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              {/* Column Body */}
              <div
                className={cn(
                  'flex-1 p-2 space-y-2 overflow-y-auto',
                  isCollapsed && 'hidden md:block'
                )}
                style={{ maxHeight: '65vh' }}
              >
                {columnDeals.length === 0 && (
                  <div className="text-center text-xs text-gray-400 py-8">No deals</div>
                )}
                {columnDeals.map((deal, dealIndex) => {
                  const p = deal.proposal
                  const clientName = p.client?.name || 'Unknown Client'
                  const isHotLead = deal.stage === 'hot_lead'
                  const isClosedWon = deal.stage === 'closed_won'
                  const isClosedLost = deal.stage === 'closed_lost'

                  return (
                    <Link
                      key={p.id}
                      to={`/proposals/${p.id}`}
                      className="block"
                    >
                      <Card
                        className={cn(
                          'card-hover border-l-4 transition-all',
                          getCardBorderColor(deal),
                          isHotLead && 'animate-pulse-border',
                          isClosedLost && 'border-l-red-500'
                        )}
                        style={{ animationDelay: `${dealIndex * 0.05}s` }}
                      >
                        <CardContent className="p-3 space-y-2">
                          {/* Client name */}
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-navy truncate">
                              {clientName}
                            </span>
                            {isClosedWon && (
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                            )}
                            {isClosedLost && (
                              <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                            )}
                          </div>

                          {/* Job description */}
                          <p className="text-xs text-gray-500 truncate">
                            {p.jobDescription || p.job_description || 'General work'}
                          </p>

                          {/* Amount */}
                          <p className="font-mono text-sm font-bold text-navy">
                            {formatCurrency(Number(p.total))}
                          </p>

                          {/* Time + engagement */}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getDealTimeLabel(deal)}
                            </span>
                            {deal.viewCount > 0 && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {deal.viewCount}x &middot; {deal.timeSpent}
                              </span>
                            )}
                          </div>

                          {/* Action button */}
                          <div className="pt-1">
                            {isHotLead && (
                              <Button
                                size="sm"
                                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                                onClick={(e) => e.preventDefault()}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                🔥 CALL NOW
                              </Button>
                            )}
                            {isClosedWon && (
                              <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-sm">
                                <CheckCircle className="h-4 w-4" />
                                {formatCurrency(Number(p.total))}
                              </div>
                            )}
                            {isClosedLost && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs"
                                onClick={(e) => e.preventDefault()}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Recovery Email
                              </Button>
                            )}
                            {(deal.stage === 'sent' ||
                              deal.stage === 'opened' ||
                              deal.stage === 'engaged') && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs"
                                onClick={(e) => e.preventDefault()}
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI Draft Follow-up
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ================================================================= */}
      {/* Pulsing border animation style                                    */}
      {/* ================================================================= */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
          50% { box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15); }
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
