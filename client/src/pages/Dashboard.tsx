import { useEffect, useState, useRef } from 'react'
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
  Star,
  Clock,
  Calendar,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import type { Proposal, ProposalStatus } from '@/types'
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
// Helpers
// ---------------------------------------------------------------------------
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay === 1) return '1 day ago'
  if (diffDay < 30) return `${diffDay} days ago`
  return formatDate(dateStr)
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
]

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// ---------------------------------------------------------------------------
// Demo proposals
// ---------------------------------------------------------------------------
const DEMO_PROPOSALS: Proposal[] = [
  {
    id: 'demo-1',
    userId: 'u1',
    clientId: 'c1',
    client: { id: 'c1', userId: 'u1', name: 'John Smith', email: 'john@example.com', phone: '(555) 234-5678', address: '123 Oak St, Austin TX', notes: null, createdAt: daysAgo(60) },
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
    client: { id: 'c2', userId: 'u1', name: 'Maria Garcia', email: 'maria@example.com', phone: '(555) 345-6789', address: '456 Maple Ave, Austin TX', notes: null, createdAt: daysAgo(45) },
    proposalNumber: 'P-1042',
    status: 'viewed',
    jobDescription: 'Complete bathroom renovation — walk-in shower, double vanity, heated tile floors',
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
    client: { id: 'c3', userId: 'u1', name: 'Robert Johnson', email: 'robert@example.com', phone: '(555) 456-7890', address: '789 Elm Dr, Austin TX', notes: null, createdAt: daysAgo(30) },
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
    client: { id: 'c4', userId: 'u1', name: 'Lisa Chen', email: 'lisa@example.com', phone: '(555) 567-8901', address: '321 Pine Rd, Austin TX', notes: null, createdAt: daysAgo(20) },
    proposalNumber: 'P-1041',
    status: 'sent',
    jobDescription: 'Electrical panel upgrade — 200-amp service, whole-house surge protection, EV charger outlet',
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
    client: { id: 'c5', userId: 'u1', name: 'James Wilson', email: 'james@example.com', phone: '(555) 678-9012', address: '555 Cedar Ln, Austin TX', notes: null, createdAt: daysAgo(50) },
    proposalNumber: 'P-1038',
    status: 'accepted',
    jobDescription: 'Exterior house painting — scraping, priming, two-coat paint, trim and shutters',
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
    client: { id: 'c6', userId: 'u1', name: 'Sarah Kim', email: 'sarah@example.com', phone: '(555) 789-0123', address: '987 Birch Ct, Austin TX', notes: null, createdAt: daysAgo(25) },
    proposalNumber: 'P-1036',
    status: 'viewed',
    jobDescription: 'Landscaping redesign — paver patio, retaining wall, irrigation system, sod installation',
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
    client: { id: 'c7', userId: 'u1', name: 'David Brown', email: 'david@example.com', phone: '(555) 890-1234', address: '654 Walnut St, Austin TX', notes: null, createdAt: daysAgo(10) },
    proposalNumber: 'P-1043',
    status: 'draft',
    jobDescription: 'Deck construction — 400 sq ft composite deck with built-in bench seating and pergola',
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
    client: { id: 'c8', userId: 'u1', name: 'Jennifer Davis', email: 'jennifer@example.com', phone: '(555) 901-2345', address: '222 Spruce Way, Austin TX', notes: null, createdAt: daysAgo(35) },
    proposalNumber: 'P-1035',
    status: 'declined',
    jobDescription: 'Kitchen remodel — custom cabinets, quartz countertops, backsplash, new appliances',
    jobAddress: '222 Spruce Way',
    materialsCost: 1600,
    laborCost: 1600,
    total: 3200,
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
  iconBg: string
  iconColor: string
  text: React.ReactNode
  time: string
}

const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    icon: Eye,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    text: (
      <>
        <span className="font-semibold text-navy">Maria Garcia</span> viewed{' '}
        <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">P-1042</span>
      </>
    ),
    time: '2 hours ago',
  },
  {
    id: 'a2',
    icon: CheckCircle,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    text: (
      <>
        <span className="font-semibold text-navy">Robert Johnson</span> accepted{' '}
        <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">P-1039</span>
      </>
    ),
    time: '5 hours ago',
  },
  {
    id: 'a3',
    icon: DollarSign,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    text: (
      <>
        Payment received: <span className="font-mono font-semibold text-emerald-600">$8,750</span>
        {' '}from <span className="font-semibold text-navy">James Wilson</span>
      </>
    ),
    time: '1 day ago',
  },
  {
    id: 'a4',
    icon: Send,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    text: (
      <>
        Proposal sent to <span className="font-semibold text-navy">Lisa Chen</span>
      </>
    ),
    time: '1 day ago',
  },
  {
    id: 'a5',
    icon: MessageSquare,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    text: (
      <>
        <span className="font-semibold text-navy">Sarah Kim</span> requested changes on{' '}
        <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">P-1036</span>
      </>
    ),
    time: '3 days ago',
  },
  {
    id: 'a6',
    icon: Star,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    text: (
      <>
        <span className="font-semibold text-navy">John Smith</span> left a 5-star review
      </>
    ),
    time: '4 days ago',
  },
]

// ---------------------------------------------------------------------------
// Upcoming appointments
// ---------------------------------------------------------------------------
interface Appointment {
  id: string
  client: string
  job: string
  time: string
  day: string
  location: string
}

const DEMO_APPOINTMENTS: Appointment[] = [
  { id: 'apt-1', client: 'Maria Garcia', job: 'Site walkthrough', time: '9:00 AM', day: 'Tomorrow', location: '456 Maple Ave' },
  { id: 'apt-2', client: 'Sarah Kim', job: 'Landscaping consult', time: '2:00 PM', day: 'Wednesday', location: '987 Birch Ct' },
  { id: 'apt-3', client: 'Lisa Chen', job: 'Electrical inspection', time: '10:30 AM', day: 'Thursday', location: '321 Pine Rd' },
]

// ---------------------------------------------------------------------------
// Review data
// ---------------------------------------------------------------------------
interface ReviewItem {
  id: string
  client: string
  text: string
  rating: number
}

const DEMO_REVIEWS: ReviewItem[] = [
  { id: 'r1', client: 'John Smith', text: 'Excellent work on the HVAC install. Professional crew, finished ahead of schedule. Would highly recommend to anyone.', rating: 5 },
  { id: 'r2', client: 'James Wilson', text: 'The paint job looks phenomenal. Attention to detail on the trim was outstanding. Very happy with the results.', rating: 5 },
]

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------
function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn('rounded-xl bg-gray-100 shimmer', className)} />
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-1">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-gray-100 rounded-lg shimmer" />
          <div className="h-4 w-80 bg-gray-50 rounded-md shimmer" />
        </div>
        <div className="h-12 w-40 bg-gray-100 rounded-lg shimmer" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} className="h-32" />
        ))}
      </div>

      {/* Chart skeleton */}
      <SkeletonCard className="h-80" />

      {/* Two column skeleton */}
      <div className="grid lg:grid-cols-5 gap-6">
        <SkeletonCard className="lg:col-span-3 h-96" />
        <SkeletonCard className="lg:col-span-2 h-96" />
      </div>

      {/* Bottom row skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-48" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard component
// ---------------------------------------------------------------------------
export function Dashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Make all fade-in elements visible on mount
  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      containerRef.current?.querySelectorAll('.fade-in-up, .fade-in, .scale-in, .stagger-children').forEach(el => {
        el.classList.add('visible')
      })
    }, 50)
    return () => clearTimeout(timer)
  }, [loading])

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

  // Computed stats
  const acceptedProposals = proposals.filter((p) => p.status === 'accepted')
  const totalRevenue = acceptedProposals.reduce((sum, p) => sum + Number(p.total), 0)
  const activeCount = proposals.filter((p) => ['sent', 'viewed', 'draft'].includes(p.status)).length
  const winRate =
    proposals.length > 0
      ? Math.round((acceptedProposals.length / proposals.length) * 100)
      : 0
  const avgValue =
    proposals.length > 0
      ? proposals.reduce((s, p) => s + Number(p.total), 0) / proposals.length
      : 0

  const recentProposals = [...proposals]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.created_at || '').getTime() -
        new Date(a.createdAt || a.created_at || '').getTime(),
    )
    .slice(0, 5)

  const revenueData = getRevenueData()
  const maxRevenue = Math.max(...revenueData.map((m) => m.value))

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div ref={containerRef} className="space-y-8 p-1">
      {/* ================================================================= */}
      {/* Welcome Header                                                    */}
      {/* ================================================================= */}
      <div className="fade-in-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy tracking-tight">
            {getGreeting()}, Contractor
          </h1>
          <p className="text-gray-500 mt-1.5 font-body">
            Here&rsquo;s what&rsquo;s happening with your business today.
            {isDemo && (
              <span className="ml-2 inline-flex items-center text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                Demo Mode
              </span>
            )}
          </p>
        </div>
        <Link to="/proposals/new">
          <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">
            <Plus className="h-5 w-5 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* ================================================================= */}
      {/* Stat Cards                                                        */}
      {/* ================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="fade-in-up" style={{ animationDelay: '0.05s' }}>
          <Card className="card-hover h-full">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl shrink-0">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold font-mono text-emerald-600 tracking-tight mt-1 truncate">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +12% from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Proposals */}
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Card className="card-hover h-full">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-xl shrink-0">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Active Proposals</p>
                  <p className="text-2xl font-bold font-mono text-navy tracking-tight mt-1">
                    {activeCount}
                  </p>
                  {/* Mini progress bar */}
                  <div className="mt-2.5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${proposals.length > 0 ? (activeCount / proposals.length) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{activeCount} of {proposals.length} total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Win Rate */}
        <div className="fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Card className="card-hover h-full">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-xl shrink-0', winRate >= 50 ? 'bg-emerald-50' : 'bg-amber-50')}>
                  <TrendingUp className={cn('h-5 w-5', winRate >= 50 ? 'text-emerald-600' : 'text-amber-600')} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Win Rate</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold font-mono text-navy tracking-tight">{winRate}%</p>
                    <span className="flex items-center text-xs font-medium text-emerald-600">
                      <ArrowUpRight className="h-3 w-3" />
                      +5%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{acceptedProposals.length} won of {proposals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avg Proposal Value */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="card-hover h-full">
            <CardContent className="pt-6 pb-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Avg. Proposal Value</p>
                  <p className="text-2xl font-bold font-mono text-navy tracking-tight mt-1 truncate">
                    {formatCurrency(avgValue)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">Across {proposals.length} proposals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Revenue Chart                                                     */}
      {/* ================================================================= */}
      <div className="fade-in-up" style={{ animationDelay: '0.25s' }}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2.5 text-lg">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Revenue Overview
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">Last 6 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-navy/80" /> Previous
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-accent" /> Current
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Y-axis labels + bars */}
            <div className="flex gap-3">
              {/* Y-axis */}
              <div className="flex flex-col justify-between h-56 sm:h-64 text-right pr-1 shrink-0">
                {[maxRevenue, maxRevenue * 0.75, maxRevenue * 0.5, maxRevenue * 0.25, 0].map((val, i) => (
                  <span key={i} className="text-[10px] font-mono text-gray-400 leading-none">
                    ${Math.round(val / 1000)}k
                  </span>
                ))}
              </div>

              {/* Chart area */}
              <div className="flex-1 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-gray-100 w-full" />
                  ))}
                </div>

                {/* Bars */}
                <div className="flex items-end gap-2 sm:gap-4 h-56 sm:h-64 relative z-10">
                  {revenueData.map((month, idx) => {
                    const pct = maxRevenue > 0 ? (month.value / maxRevenue) * 100 : 0
                    const isLatest = idx === revenueData.length - 1
                    return (
                      <div
                        key={month.label}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                      >
                        {/* Hover tooltip */}
                        <div
                          className={cn(
                            'px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all duration-200 whitespace-nowrap',
                            isLatest
                              ? 'opacity-100 bg-accent text-white shadow-sm'
                              : 'opacity-0 group-hover:opacity-100 bg-navy text-white shadow-sm',
                          )}
                        >
                          {formatCurrency(month.value)}
                        </div>
                        {/* Bar */}
                        <div
                          className={cn(
                            'w-full max-w-[48px] rounded-t-lg transition-all duration-700 ease-out cursor-pointer',
                            isLatest
                              ? 'bg-accent hover:bg-accent/90 shadow-sm'
                              : 'bg-navy/80 hover:bg-navy',
                          )}
                          style={{
                            height: `${pct}%`,
                            minHeight: pct > 0 ? '6px' : '0px',
                            transitionDelay: `${idx * 80}ms`,
                          }}
                        />
                        {/* Month label */}
                        <span className={cn(
                          'text-xs font-medium',
                          isLatest ? 'text-accent' : 'text-gray-400',
                        )}>
                          {month.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Two-column: Recent Proposals + Activity Feed                      */}
      {/* ================================================================= */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Proposals */}
        <div className="lg:col-span-3 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Recent Proposals</CardTitle>
              <Link to="/proposals">
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                  View All
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-0.5">
                {recentProposals.map((proposal, idx) => {
                  const config = statusConfig[proposal.status] || statusConfig.draft
                  const clientName = proposal.client?.name || 'Unknown Client'
                  const createdAt = proposal.createdAt || proposal.created_at || ''
                  const desc = proposal.jobDescription || proposal.job_description || ''
                  const propNum = proposal.proposalNumber || proposal.proposal_number || ''

                  return (
                    <Link
                      key={proposal.id}
                      to={`/proposals/${proposal.id}`}
                      className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold shadow-sm',
                          avatarColor(clientName),
                        )}
                      >
                        {getInitials(clientName)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-navy text-sm truncate group-hover:text-accent transition-colors">
                            {clientName}
                          </p>
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded shrink-0">
                            {propNum}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate mt-0.5">
                          {desc.length > 55 ? desc.slice(0, 55) + '...' : desc}
                        </p>
                      </div>

                      {/* Right side */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-semibold text-sm text-navy hidden sm:block">
                            {formatCurrency(Number(proposal.total))}
                          </span>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {relativeTime(createdAt)}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 fade-in-up" style={{ animationDelay: '0.35s' }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[17px] top-3 bottom-3 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />

                <div className="space-y-5">
                  {DEMO_ACTIVITY.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.id} className="relative flex gap-4">
                        {/* Icon circle */}
                        <div
                          className={cn(
                            'relative z-10 flex items-center justify-center h-[35px] w-[35px] rounded-full shrink-0 shadow-sm border border-white',
                            item.iconBg,
                          )}
                        >
                          <Icon className={cn('h-4 w-4', item.iconColor)} />
                        </div>
                        {/* Content */}
                        <div className="pt-1 min-w-0">
                          <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </p>
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

      {/* ================================================================= */}
      {/* Bottom Row: Upcoming + Reviews                                    */}
      {/* ================================================================= */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming This Week */}
        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Upcoming This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {DEMO_APPOINTMENTS.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50/60 hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0',
                        avatarColor(apt.client),
                      )}
                    >
                      {getInitials(apt.client)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy">{apt.client}</p>
                      <p className="text-xs text-gray-400 truncate">{apt.job}</p>
                    </div>
                    {/* Time + location */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-navy">{apt.day}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        {apt.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <div className="fade-in-up" style={{ animationDelay: '0.45s' }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {DEMO_REVIEWS.map((review) => (
                  <div key={review.id} className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      {/* Client avatar */}
                      <div
                        className={cn(
                          'h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0',
                          avatarColor(review.client),
                        )}
                      >
                        {getInitials(review.client)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{review.client}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed pl-12">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    {review.id !== DEMO_REVIEWS[DEMO_REVIEWS.length - 1].id && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
