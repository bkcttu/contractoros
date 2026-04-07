import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  Plus,
  Send,
  Download,
  Check,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Eye,
  CreditCard,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { api as _api } from '@/lib/api'

type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Partially Paid'

interface Invoice {
  id: string
  number: string
  client: string
  clientInitials: string
  avatarColor: string
  amount: number
  amountPaid?: number
  status: InvoiceStatus
  dueDate: string
  sentDate: string | null
  proposalId?: string
}

const demoInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-001',
    client: 'Riverside Community Church',
    clientInitials: 'RC',
    avatarColor: 'bg-blue-500',
    amount: 22500,
    status: 'Paid',
    dueDate: '2026-03-15',
    sentDate: '2026-03-01',
  },
  {
    id: '2',
    number: 'INV-002',
    client: 'Martinez Family Home',
    clientInitials: 'MF',
    avatarColor: 'bg-emerald-500',
    amount: 8750,
    status: 'Overdue',
    dueDate: '2026-03-20',
    sentDate: '2026-03-05',
  },
  {
    id: '3',
    number: 'INV-003',
    client: 'Sunset Ridge HOA',
    clientInitials: 'SR',
    avatarColor: 'bg-violet-500',
    amount: 14200,
    status: 'Sent',
    dueDate: '2026-04-10',
    sentDate: '2026-03-27',
  },
  {
    id: '4',
    number: 'INV-004',
    client: 'Thompson Construction',
    clientInitials: 'TC',
    avatarColor: 'bg-orange-500',
    amount: 5400,
    status: 'Partially Paid',
    amountPaid: 2700,
    dueDate: '2026-04-05',
    sentDate: '2026-03-22',
  },
  {
    id: '5',
    number: 'INV-005',
    client: 'Greenfield Apartments',
    clientInitials: 'GA',
    avatarColor: 'bg-teal-500',
    amount: 3200,
    status: 'Overdue',
    dueDate: '2026-03-18',
    sentDate: '2026-03-04',
  },
  {
    id: '6',
    number: 'INV-006',
    client: 'Park Avenue Retail',
    clientInitials: 'PA',
    avatarColor: 'bg-rose-500',
    amount: 11800,
    status: 'Paid',
    dueDate: '2026-03-28',
    sentDate: '2026-03-14',
  },
  {
    id: '7',
    number: 'INV-007',
    client: 'Chen Residence',
    clientInitials: 'CR',
    avatarColor: 'bg-indigo-500',
    amount: 850,
    status: 'Draft',
    dueDate: '2026-04-20',
    sentDate: null,
  },
  {
    id: '8',
    number: 'INV-008',
    client: 'Lakewood Medical Center',
    clientInitials: 'LM',
    avatarColor: 'bg-cyan-600',
    amount: 16750,
    status: 'Sent',
    dueDate: '2026-04-15',
    sentDate: '2026-03-31',
  },
  {
    id: '9',
    number: 'INV-009',
    client: 'Summit View Condos',
    clientInitials: 'SV',
    avatarColor: 'bg-amber-600',
    amount: 6200,
    status: 'Paid',
    dueDate: '2026-03-22',
    sentDate: '2026-03-08',
  },
  {
    id: '10',
    number: 'INV-010',
    client: 'Hartley & Associates',
    clientInitials: 'HA',
    avatarColor: 'bg-pink-500',
    amount: 4900,
    status: 'Draft',
    dueDate: '2026-04-25',
    sentDate: null,
  },
]

const statusConfig: Record<InvoiceStatus, { label: string; className: string; icon: React.ElementType }> = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
    icon: FileText,
  },
  Sent: {
    label: 'Sent',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    icon: Send,
  },
  Paid: {
    label: 'Paid',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
    icon: Check,
  },
  Overdue: {
    label: 'Overdue',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
    icon: AlertTriangle,
  },
  'Partially Paid': {
    label: 'Partial',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    icon: Clock,
  },
}

type FilterTab = 'All' | 'Sent' | 'Paid' | 'Overdue'

export function Invoices() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const filtered = demoInvoices.filter((inv) => {
    const matchesSearch =
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Sent' && (inv.status === 'Sent' || inv.status === 'Partially Paid')) ||
      (activeTab === 'Paid' && inv.status === 'Paid') ||
      (activeTab === 'Overdue' && inv.status === 'Overdue')
    return matchesSearch && matchesTab
  })

  const tabs: FilterTab[] = ['All', 'Sent', 'Paid', 'Overdue']

  return (
    <div ref={ref} className={cn('space-y-8 transition-all duration-500', visible ? 'fade-in-up opacity-100' : 'opacity-0 translate-y-4')}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-50">
              <CreditCard className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy">Invoices</h1>
          </div>
          <p className="text-gray-500 ml-14">Track payments and get paid faster</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Outstanding</p>
              <div className="p-1.5 rounded-lg bg-amber-50">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy font-mono">$12,450</p>
            <p className="text-xs text-amber-600 mt-1">3 invoices pending</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Paid This Month</p>
              <div className="p-1.5 rounded-lg bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy font-mono">$28,750</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +18% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Overdue</p>
              <div className="p-1.5 rounded-lg bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy font-mono">$3,200</p>
            <p className="text-xs text-red-500 mt-1">2 invoices overdue</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Avg Days to Pay</p>
              <div className="p-1.5 rounded-lg bg-blue-50">
                <DollarSign className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy font-mono">4.2</p>
            <p className="text-xs text-gray-400 mt-1">days average</p>
          </CardContent>
        </Card>
      </div>

      {/* Convert from Proposal Banner */}
      <Card className="border-accent/30 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">3 accepted proposals ready to invoice</p>
                <p className="text-xs text-gray-500">Convert accepted proposals into invoices with one click</p>
              </div>
            </div>
            <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90 whitespace-nowrap">
              <ArrowUpRight className="h-4 w-4" />
              Convert to Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              All Invoices
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-3 border-b border-gray-100 pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-navy'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="p-4 rounded-full bg-gray-100 mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-semibold text-navy mb-1">No invoices found</p>
              <p className="text-sm text-gray-500 max-w-xs">
                {search
                  ? `No invoices match "${search}". Try a different search.`
                  : `No ${activeTab.toLowerCase()} invoices yet.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((invoice, i) => {
                const config = statusConfig[invoice.status]
                const StatusIcon = config.icon
                const isPending = invoice.status === 'Sent' || invoice.status === 'Overdue' || invoice.status === 'Partially Paid'

                return (
                  <div
                    key={invoice.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors',
                      i === 0 && 'rounded-t-none'
                    )}
                  >
                    {/* Avatar + invoice info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn('h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', invoice.avatarColor)}>
                        {invoice.clientInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-navy text-sm truncate">{invoice.client}</p>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">{invoice.number}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="sm:text-right shrink-0">
                      <p className="font-bold text-navy font-mono text-sm">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      {invoice.status === 'Partially Paid' && invoice.amountPaid && (
                        <p className="text-xs text-amber-600 font-mono">
                          ${invoice.amountPaid.toLocaleString()} paid
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                      <Badge className={cn('gap-1 text-xs', config.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>

                    {/* Due date */}
                    <div className="text-xs text-gray-400 shrink-0 min-w-[80px]">
                      <p className="text-gray-500 font-medium">Due</p>
                      <p>{new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                          title="Send payment link (Stripe)"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          Pay
                        </a>
                      )}
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors" title="View invoice">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors" title="Download PDF">
                        <Download className="h-4 w-4" />
                      </button>
                      {invoice.status === 'Draft' && (
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Send invoice">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
