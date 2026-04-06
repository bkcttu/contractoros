import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  MessageSquare,
  Pause,
  Pencil,
  SkipForward,
  Send,
  RefreshCw,
  Clock,
  CalendarClock,
  Trophy,
  TrendingUp,
  MailOpen,
  Target,
  X,
  Zap,
  Archive,
  Phone,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ActionPriority = 'hot' | 'overdue' | 'expiring'
type EmailTone = 'check-in' | 'value' | 'urgency' | 'final'
type Channel = 'email' | 'sms'

interface ActionItem {
  id: string
  priority: ActionPriority
  clientName: string
  amount: number
  context: string
  recommendedAction: string
}

interface AutomationRow {
  id: string
  clientName: string
  sequenceStep: string
  sendsIn: string
  channel: Channel
}

interface StatCard {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  color: string
}

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------
const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'a1',
    priority: 'hot',
    clientName: 'Marcus Rivera',
    amount: 14800,
    context: 'Viewed 3x, checked add-ons tab twice',
    recommendedAction: 'Send a value-focused follow-up highlighting the premium add-ons they explored.',
  },
  {
    id: 'a2',
    priority: 'overdue',
    clientName: 'Sarah Chen',
    amount: 8200,
    context: 'No response in 4 days since proposal sent',
    recommendedAction: 'Reach out with a casual check-in to keep the conversation warm.',
  },
  {
    id: 'a3',
    priority: 'expiring',
    clientName: 'David Kowalski',
    amount: 22500,
    context: 'Proposal expires tomorrow — client opened once',
    recommendedAction: 'Send an urgency email with a deadline reminder and offer to extend.',
  },
]

const AUTOMATIONS: AutomationRow[] = [
  { id: 'au1', clientName: 'Marcus Rivera', sequenceStep: 'Day 2 follow-up', sendsIn: '6 hours', channel: 'email' },
  { id: 'au2', clientName: 'Lisa Park', sequenceStep: 'Day 1 intro nudge', sendsIn: '2 hours', channel: 'sms' },
  { id: 'au3', clientName: 'Tom Bradley', sequenceStep: 'Day 5 value add', sendsIn: '1 day', channel: 'email' },
  { id: 'au4', clientName: 'Janet Holmes', sequenceStep: 'Day 3 check-in', sendsIn: '14 hours', channel: 'email' },
  { id: 'au5', clientName: 'Carlos Ruiz', sequenceStep: 'Day 7 final follow-up', sendsIn: '3 days', channel: 'sms' },
]

const STATS: StatCard[] = [
  {
    label: 'Proposals Followed Up',
    value: '18',
    subtext: 'this month',
    icon: <Send className="h-5 w-5" />,
    color: 'text-blue-500 bg-blue-50',
  },
  {
    label: 'Follow-ups Opened',
    value: '14',
    subtext: '78% open rate',
    icon: <MailOpen className="h-5 w-5" />,
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    label: 'Deals Recovered',
    value: '4',
    subtext: formatCurrency(23400),
    icon: <Trophy className="h-5 w-5" />,
    color: 'text-amber-500 bg-amber-50',
  },
  {
    label: 'Avg Days to Close',
    value: '6.2',
    subtext: 'days',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-violet-500 bg-violet-50',
  },
]

const PRIORITY_CONFIG: Record<ActionPriority, { icon: string; borderClass: string; bgClass: string; badgeVariant: 'danger' | 'warning' | 'accent' }> = {
  hot: { icon: '🔥', borderClass: 'border-l-red-500', bgClass: 'bg-red-50/40', badgeVariant: 'danger' },
  overdue: { icon: '⚠️', borderClass: 'border-l-amber-500', bgClass: 'bg-amber-50/30', badgeVariant: 'warning' },
  expiring: { icon: '⏰', borderClass: 'border-l-blue-500', bgClass: 'bg-blue-50/30', badgeVariant: 'accent' },
}

const PRIORITY_LABEL: Record<ActionPriority, string> = {
  hot: 'Hot Lead',
  overdue: 'Overdue',
  expiring: 'Expiring Soon',
}

const TONE_OPTIONS: { value: EmailTone; label: string }[] = [
  { value: 'check-in', label: 'Check-in' },
  { value: 'value', label: 'Value' },
  { value: 'urgency', label: 'Urgency' },
  { value: 'final', label: 'Final' },
]

const DRAFT_TEMPLATES: Record<EmailTone, string> = {
  'check-in': `Hi {name},\n\nJust checking in on the proposal I sent over for your project. I know things get busy, so I wanted to make sure it didn't slip through the cracks.\n\nHappy to jump on a quick call if you have any questions or want to walk through the details.\n\nBest,\nYour Contractor`,
  value: `Hi {name},\n\nI noticed you were looking at the premium add-on options — great eye! Those upgrades tend to pay for themselves within the first year through energy savings.\n\nI'd love to walk you through the ROI numbers if you're interested. No pressure at all.\n\nBest,\nYour Contractor`,
  urgency: `Hi {name},\n\nQuick heads-up — the pricing on your proposal is locked in until tomorrow. After that, material costs may adjust based on current supplier rates.\n\nIf you'd like to move forward or need a few more days, just let me know and I'll see what I can do.\n\nBest,\nYour Contractor`,
  final: `Hi {name},\n\nI wanted to reach out one last time regarding your project proposal. I completely understand if the timing isn't right — no hard feelings at all.\n\nIf anything changes down the road, my door is always open. Wishing you the best with your project!\n\nBest,\nYour Contractor`,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function FollowUpCenter() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalClient, setModalClient] = useState<ActionItem | null>(null)
  const [emailTone, setEmailTone] = useState<EmailTone>('check-in')
  const [emailChannel, setEmailChannel] = useState<Channel>('email')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')

  // Fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current
        ?.querySelectorAll('.fade-in-up, .reveal-fade, .scale-in, .stagger-children')
        .forEach((el) => {
          el.classList.add('visible')
        })
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Populate email draft when modal opens or tone changes
  useEffect(() => {
    if (!modalClient) return
    const template = DRAFT_TEMPLATES[emailTone]
    setEmailBody(template.replace(/{name}/g, modalClient.clientName.split(' ')[0]))
    setEmailSubject(`Following up on your ${formatCurrency(modalClient.amount)} project proposal`)
  }, [modalClient, emailTone])

  const openDraftModal = (item: ActionItem) => {
    setModalClient(item)
    const toneMap: Record<ActionPriority, EmailTone> = {
      hot: 'value',
      overdue: 'check-in',
      expiring: 'urgency',
    }
    setEmailTone(toneMap[item.priority])
    setEmailChannel('email')
    setModalOpen(true)
  }

  const closeDraftModal = () => {
    setModalOpen(false)
    setModalClient(null)
  }

  const handleRegenerate = () => {
    if (!modalClient) return
    const tones: EmailTone[] = ['check-in', 'value', 'urgency', 'final']
    const otherTones = tones.filter((t) => t !== emailTone)
    const next = otherTones[Math.floor(Math.random() * otherTones.length)]
    setEmailTone(next)
  }

  return (
    <div ref={containerRef} className="space-y-8 p-1">
      {/* ================================================================= */}
      {/* Page Header                                                       */}
      {/* ================================================================= */}
      <div className="fade-in-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-navy tracking-tight">
            Follow-Up Center
          </h1>
          <p className="text-gray-500 mt-1.5 font-body">
            Action items, automations, and follow-up performance at a glance.
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* ================================================================= */}
      {/* Section 1: Action Needed Today                                    */}
      {/* ================================================================= */}
      <div className="fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-heading font-bold text-navy">Action Needed Today</h2>
          <Badge variant="danger">{ACTION_ITEMS.length} items</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ACTION_ITEMS.map((item) => {
            const cfg = PRIORITY_CONFIG[item.priority]
            return (
              <Card
                key={item.id}
                className={cn(
                  'card-hover border-l-4 transition-all',
                  cfg.borderClass,
                  cfg.bgClass,
                )}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" role="img" aria-label={PRIORITY_LABEL[item.priority]}>
                        {cfg.icon}
                      </span>
                      <div>
                        <p className="font-heading font-semibold text-navy">{item.clientName}</p>
                        <p className="text-sm font-mono font-semibold text-gray-700">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={cfg.badgeVariant}>{PRIORITY_LABEL[item.priority]}</Badge>
                  </div>

                  <p className="text-sm text-gray-600">{item.context}</p>

                  <Separator />

                  <p className="text-xs text-gray-500 italic">{item.recommendedAction}</p>

                  {item.priority === 'hot' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button size="sm" onClick={() => openDraftModal(item)}>
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        AI Draft Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Mark as Called
                      </Button>
                      <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Won
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Lost
                      </Button>
                    </div>
                  )}

                  {item.priority === 'overdue' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button size="sm" onClick={() => openDraftModal(item)}>
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Send Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit Draft
                      </Button>
                      <Button size="sm" variant="outline">
                        <SkipForward className="h-3.5 w-3.5 mr-1" />
                        Skip
                      </Button>
                    </div>
                  )}

                  {item.priority === 'expiring' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button size="sm" onClick={() => openDraftModal(item)}>
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        AI Draft Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <CalendarClock className="h-3.5 w-3.5 mr-1" />
                        Extend Deadline
                      </Button>
                      <Button size="sm" variant="outline">
                        <Archive className="h-3.5 w-3.5 mr-1" />
                        Archive
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* Section 3: Automations Running                                    */}
      {/* ================================================================= */}
      <div className="fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-violet-500" />
          <h2 className="text-lg font-heading font-bold text-navy">Automations Running</h2>
          <Badge variant="default">{AUTOMATIONS.length} automations running</Badge>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {AUTOMATIONS.map((auto) => (
                <div
                  key={auto.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'flex items-center justify-center h-8 w-8 rounded-full shrink-0',
                      auto.channel === 'email' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500',
                    )}>
                      {auto.channel === 'email' ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-navy text-sm truncate">{auto.clientName}</p>
                      <p className="text-xs text-gray-500">{auto.sequenceStep}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>sends in {auto.sendsIn}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                        <SkipForward className="h-3 w-3 mr-1" />
                        Skip
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Section 4: This Month's Follow-Up Stats                           */}
      {/* ================================================================= */}
      <div className="fade-in-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-heading font-bold text-navy">This Month&rsquo;s Follow-Up Stats</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={cn('flex items-center justify-center h-10 w-10 rounded-lg shrink-0', stat.color)}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-mono font-bold text-navy">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-xs font-medium text-gray-400">{stat.subtext}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* Section 2: AI Email Drafting Modal                                */}
      {/* ================================================================= */}
      {modalOpen && modalClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDraftModal()
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal card */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="font-heading font-bold text-navy text-lg">
                  Follow-up to {modalClient.clientName}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatCurrency(modalClient.amount)} proposal
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeDraftModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Tone selector */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => setEmailTone(tone.value)}
                      className={cn(
                        'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
                        emailTone === tone.value
                          ? 'bg-navy text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      )}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel toggle */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Channel
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailChannel('email')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                      emailChannel === 'email'
                        ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    )}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailChannel('sms')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                      emailChannel === 'sms'
                        ? 'bg-green-50 text-green-600 ring-1 ring-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    )}
                  >
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </button>
                </div>
              </div>

              {/* Subject line */}
              {emailChannel === 'email' && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              )}

              {/* Email body */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  {emailChannel === 'email' ? 'Email Body' : 'Message'}
                </label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                  className="resize-none text-sm"
                />
              </div>

              {/* Preview */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Preview
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
                  {emailChannel === 'email' && (
                    <p className="text-xs text-gray-400">
                      <span className="font-semibold text-gray-500">Subject:</span> {emailSubject}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {emailBody}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
              <Button variant="outline" size="sm" onClick={handleRegenerate}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Regenerate
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={closeDraftModal}>
                  <CalendarClock className="h-3.5 w-3.5 mr-1" />
                  Schedule for Later
                </Button>
                <Button size="sm" onClick={closeDraftModal}>
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Send Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
