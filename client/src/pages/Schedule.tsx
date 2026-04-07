import React, { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ViewMode = 'day' | 'week' | 'month'
type AppointmentColor = 'blue' | 'orange' | 'green' | 'purple'

interface Appointment {
  id: string
  title: string
  client: string
  phone: string
  address: string
  jobType: string
  description: string
  dayIndex: number // 0 = Mon, 6 = Sun
  startHour: number // 7 = 7am
  startMin: number
  durationMins: number
  color: AppointmentColor
  proposalId?: string
}

// ---------------------------------------------------------------------------
// Demo data — week of Apr 7-13, 2026 (Mon = index 0)
// ---------------------------------------------------------------------------
const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    title: 'Free Estimate — Johnson Residence',
    client: 'Mark Johnson',
    phone: '(816) 555-0142',
    address: '1842 Maple Ave, Kansas City, MO',
    jobType: 'Estimate',
    description: 'Homeowner requesting estimate for full HVAC replacement and ductwork.',
    dayIndex: 0,
    startHour: 9,
    startMin: 0,
    durationMins: 60,
    color: 'blue',
    proposalId: 'PRO-0041',
  },
  {
    id: 'a2',
    title: 'HVAC Install — Oak Street',
    client: 'Patricia Owen',
    phone: '(816) 555-0278',
    address: '309 Oak Street, Overland Park, KS',
    jobType: 'Installation',
    description: 'Full HVAC system installation. Unit delivered, crew of 3 on-site.',
    dayIndex: 0,
    startHour: 14,
    startMin: 0,
    durationMins: 240,
    color: 'orange',
  },
  {
    id: 'a3',
    title: 'Roof Inspection — Pine Valley',
    client: 'Tom Nguyen',
    phone: '(913) 555-0391',
    address: '54 Pine Valley Dr, Lenexa, KS',
    jobType: 'Inspection',
    description: 'Post-storm roof inspection. Check for hail damage and flashing issues.',
    dayIndex: 1,
    startHour: 8,
    startMin: 0,
    durationMins: 120,
    color: 'green',
    proposalId: 'PRO-0038',
  },
  {
    id: 'a4',
    title: 'Follow-up — Garcia',
    client: 'Maria Garcia',
    phone: '(816) 555-0504',
    address: '718 Elm Road, Kansas City, MO',
    jobType: 'Follow-up',
    description: 'Check satisfaction on recent plumbing repair. Collect final payment.',
    dayIndex: 1,
    startHour: 13,
    startMin: 0,
    durationMins: 30,
    color: 'purple',
  },
  {
    id: 'a5',
    title: 'Plumbing Repair — Elm St',
    client: 'David Lee',
    phone: '(913) 555-0617',
    address: '220 Elm Street, Shawnee, KS',
    jobType: 'Repair',
    description: 'Main water line leak repair. Need to shut off street valve. Parts on truck.',
    dayIndex: 2,
    startHour: 9,
    startMin: 0,
    durationMins: 180,
    color: 'blue',
  },
  {
    id: 'a6',
    title: 'Estimate — Kim Residence',
    client: 'Susan Kim',
    phone: '(816) 555-0730',
    address: '1100 Brookside Blvd, Kansas City, MO',
    jobType: 'Estimate',
    description: 'Kitchen remodel estimate. Client wants full gut and rebuild with island.',
    dayIndex: 3,
    startHour: 10,
    startMin: 0,
    durationMins: 60,
    color: 'blue',
    proposalId: 'PRO-0044',
  },
  {
    id: 'a7',
    title: 'Deck Build Start — Brown',
    client: 'James Brown',
    phone: '(913) 555-0843',
    address: '892 Willow Lane, Prairie Village, KS',
    jobType: 'Construction',
    description: 'Day 1 of 3-day deck build. Crew of 4. Materials already staged on-site.',
    dayIndex: 4,
    startHour: 8,
    startMin: 0,
    durationMins: 480,
    color: 'orange',
  },
  {
    id: 'a8',
    title: 'Final Walkthrough — Wilson',
    client: 'Carol Wilson',
    phone: '(816) 555-0956',
    address: '437 Sunset Drive, Leawood, KS',
    jobType: 'Walkthrough',
    description: 'Final walkthrough for completed bathroom renovation. Sign-off and collect balance.',
    dayIndex: 4,
    startHour: 16,
    startMin: 0,
    durationMins: 60,
    color: 'green',
    proposalId: 'PRO-0035',
  },
]

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const HOUR_START = 7
const HOUR_END = 19 // exclusive — shows 7am through 6pm slots
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SLOT_HEIGHT = 56 // px per hour

const COLOR_CLASSES: Record<AppointmentColor, string> = {
  blue: 'bg-blue-500/90 border-blue-600 text-white',
  orange: 'bg-accent/90 border-orange-600 text-white',
  green: 'bg-emerald-500/90 border-emerald-600 text-white',
  purple: 'bg-violet-500/90 border-violet-600 text-white',
}

const BADGE_CLASSES: Record<AppointmentColor, string> = {
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-emerald-100 text-emerald-700',
  purple: 'bg-violet-100 text-violet-700',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatHour(h: number): string {
  const suffix = h < 12 ? 'am' : 'pm'
  const display = h > 12 ? h - 12 : h
  return `${display}${suffix}`
}

function formatTime(h: number, m: number): string {
  const suffix = h < 12 ? 'am' : 'pm'
  const display = h > 12 ? h - 12 : h
  const mins = m === 0 ? '' : `:${String(m).padStart(2, '0')}`
  return `${display}${mins}${suffix}`
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}hr` : `${h}hr ${m}min`
}

// Top offset in px from the start of the grid
function apptTop(startHour: number, startMin: number): number {
  return (startHour - HOUR_START) * SLOT_HEIGHT + (startMin / 60) * SLOT_HEIGHT
}

function apptHeight(durationMins: number): number {
  return Math.max((durationMins / 60) * SLOT_HEIGHT, 22)
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------
function AppointmentBlock({
  appt,
  onClick,
  selected,
}: {
  appt: Appointment
  onClick: () => void
  selected: boolean
}) {
  const top = apptTop(appt.startHour, appt.startMin)
  const height = apptHeight(appt.durationMins)
  const isShort = height < 40

  return (
    <button
      onClick={onClick}
      style={{ top, height, left: 2, right: 2 }}
      className={cn(
        'absolute rounded-md border px-1.5 py-0.5 text-left transition-all overflow-hidden z-10',
        'hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/50',
        COLOR_CLASSES[appt.color],
        selected && 'ring-2 ring-white shadow-lg scale-[1.01]',
      )}
    >
      <p className={cn('font-semibold leading-tight', isShort ? 'text-[10px]' : 'text-xs')}>
        {appt.title}
      </p>
      {!isShort && (
        <p className="text-[10px] opacity-80 mt-0.5">
          {formatTime(appt.startHour, appt.startMin)} · {formatDuration(appt.durationMins)}
        </p>
      )}
    </button>
  )
}

function DetailPanel({
  appt,
  onClose,
}: {
  appt: Appointment
  onClose: () => void
}) {
  return (
    <Card className="border-0 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn('text-xs font-medium', BADGE_CLASSES[appt.color])}>
              {appt.jobType}
            </Badge>
            {appt.proposalId && (
              <Badge variant="outline" className="text-xs">
                {appt.proposalId}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xs shrink-0"
          >
            ✕ close
          </button>
        </div>
        <CardTitle className="text-base mt-1">{appt.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{appt.client}</p>
              <p className="text-muted-foreground text-xs">{appt.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-muted-foreground">{appt.address}</p>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">
                {formatTime(appt.startHour, appt.startMin)} — {DAY_FULL[appt.dayIndex]}, Apr{' '}
                {7 + appt.dayIndex}, 2026
              </p>
              <p className="text-muted-foreground text-xs">{formatDuration(appt.durationMins)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-muted-foreground">{appt.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Call Client
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Get Directions
          </Button>
          {appt.proposalId && (
            <Button size="sm" variant="outline" className="gap-1.5 text-accent border-accent/40">
              View Proposal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Today's sidebar
// ---------------------------------------------------------------------------
// "Today" is pinned to Wednesday Apr 8 = dayIndex 1 (Tue) in our demo week
// We pick a representative "today" = dayIndex 1 (Tuesday)
const TODAY_INDEX = 1

function TodaySidebar({ onSelect, selectedId }: { onSelect: (a: Appointment) => void; selectedId: string | null }) {
  const todayAppts = DEMO_APPOINTMENTS.filter((a) => a.dayIndex === TODAY_INDEX).sort(
    (a, b) => a.startHour * 60 + a.startMin - (b.startHour * 60 + b.startMin),
  )

  // "Next" = first appointment that hasn't passed (using a fixed demo "now" = 9:30am)
  const NOW_MINS = 9 * 60 + 30
  const nextIdx = todayAppts.findIndex((a) => a.startHour * 60 + a.startMin >= NOW_MINS)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          Today — {DAY_FULL[TODAY_INDEX]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {todayAppts.length === 0 && (
          <p className="text-sm text-muted-foreground">No appointments today.</p>
        )}
        {todayAppts.map((appt, idx) => {
          const isNext = idx === nextIdx
          const isSelected = appt.id === selectedId
          return (
            <button
              key={appt.id}
              onClick={() => onSelect(appt)}
              className={cn(
                'w-full text-left rounded-lg p-2.5 border transition-all',
                isNext
                  ? 'border-accent/40 bg-accent/5'
                  : 'border-transparent hover:border-border hover:bg-muted/40',
                isSelected && 'border-accent/60 bg-accent/10',
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-xs font-semibold text-foreground">
                  {formatTime(appt.startHour, appt.startMin)}
                </span>
                {isNext && (
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wide">
                    Next
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-tight line-clamp-2">{appt.title}</p>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function Schedule() {
  const [view, setView] = useState<ViewMode>('week')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const headerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 },
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  const selectedAppt = DEMO_APPOINTMENTS.find((a) => a.id === selectedId) ?? null

  // Current time indicator — demo "now" = Tuesday 9:30am
  const NOW_TOP = apptTop(9, 30)

  const handleSelect = (appt: Appointment) => {
    setSelectedId((prev) => (prev === appt.id ? null : appt.id))
  }

  return (
    <div
      ref={headerRef}
      className={cn(
        'space-y-6 transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your appointments and job visits
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white gap-2 shrink-0 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Calendar + Sidebar layout */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calendar panel */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Toolbar */}
          <Card className="border-0 shadow-sm">
            <CardContent className="py-3 px-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Week navigation */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">
                    Apr 7–13, 2026
                  </span>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                  {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                        view === v
                          ? 'bg-white text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Week grid */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Day header row */}
              <div className="flex border-b border-border">
                {/* Time gutter */}
                <div className="w-14 shrink-0 border-r border-border" />
                {/* Day columns */}
                {DAY_LABELS.map((day, idx) => {
                  const isToday = idx === TODAY_INDEX
                  const dateNum = 7 + idx
                  return (
                    <div
                      key={day}
                      className={cn(
                        'flex-1 min-w-0 py-2 text-center border-r border-border last:border-r-0',
                        isToday && 'bg-accent/5',
                      )}
                    >
                      <p className={cn('text-xs font-medium', isToday ? 'text-accent' : 'text-muted-foreground')}>
                        {day}
                      </p>
                      <p
                        className={cn(
                          'text-sm font-bold mt-0.5',
                          isToday
                            ? 'bg-accent text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto text-xs'
                            : 'text-foreground',
                        )}
                      >
                        {dateNum}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Scrollable time grid */}
              <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
                <div className="flex">
                  {/* Time labels */}
                  <div className="w-14 shrink-0 border-r border-border">
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        style={{ height: SLOT_HEIGHT }}
                        className="border-b border-border/50 flex items-start pt-1 justify-end pr-2"
                      >
                        <span className="text-[10px] text-muted-foreground">{formatHour(h)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Day columns */}
                  {DAY_LABELS.map((day, idx) => {
                    const isToday = idx === TODAY_INDEX
                    const dayAppts = DEMO_APPOINTMENTS.filter((a) => a.dayIndex === idx)
                    return (
                      <div
                        key={day}
                        className={cn(
                          'flex-1 min-w-0 relative border-r border-border last:border-r-0',
                          isToday && 'bg-accent/[0.03]',
                        )}
                        style={{ height: HOURS.length * SLOT_HEIGHT }}
                      >
                        {/* Hour lines */}
                        {HOURS.map((h) => (
                          <div
                            key={h}
                            style={{ top: (h - HOUR_START) * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                            className="absolute inset-x-0 border-b border-border/40"
                          />
                        ))}

                        {/* Current time indicator — only on today's column */}
                        {isToday && (
                          <div
                            className="absolute inset-x-0 z-20 flex items-center"
                            style={{ top: NOW_TOP }}
                          >
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 -ml-1.5 shrink-0" />
                            <div className="flex-1 h-px bg-red-500" />
                          </div>
                        )}

                        {/* Appointments */}
                        {dayAppts.map((appt) => (
                          <AppointmentBlock
                            key={appt.id}
                            appt={appt}
                            selected={appt.id === selectedId}
                            onClick={() => handleSelect(appt)}
                          />
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detail panel */}
          {selectedAppt && (
            <DetailPanel appt={selectedAppt} onClose={() => setSelectedId(null)} />
          )}
        </div>

        {/* Today's sidebar */}
        <div className="w-full lg:w-56 shrink-0">
          <TodaySidebar onSelect={handleSelect} selectedId={selectedId} />
        </div>
      </div>
    </div>
  )
}
