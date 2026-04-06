import { useState } from 'react'
import {
  Wrench,
  Thermometer,
  Home,
  Zap,
  Leaf,
  Paintbrush,
  HardHat,
  Layers,
  Grid3x3,
  Fence,
  Hammer,
  Bug,
  Droplets,
  Waves,
  Check,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getTradeNames,
  getTradeJobTypes,
  getJobTypeLineItems,
} from '@/data/trades'
import type { TradeLineItem } from '@/data/trades'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Thermometer,
  Wrench,
  Home,
  Zap,
  Leaf,
  Paintbrush,
  HardHat,
  Layers,
  Grid3x3,
  Fence,
  Hammer,
  Bug,
  Droplets,
  Waves,
}

interface TradeJobSelectorProps {
  trade: string
  onTradeChange: (trade: string) => void
  onJobTypeSelect: (jobTypeId: string, lineItems: TradeLineItem[]) => void
}

export default function TradeJobSelector({
  trade,
  onTradeChange,
  onJobTypeSelect,
}: TradeJobSelectorProps) {
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null)
  const [loadedCount, setLoadedCount] = useState(0)

  const tradeNames = getTradeNames()
  const jobTypes = trade ? getTradeJobTypes(trade) : []

  function handleTradeChange(slug: string) {
    setSelectedJobType(null)
    setLoadedCount(0)
    onTradeChange(slug)
  }

  function handleJobTypeClick(jobTypeId: string) {
    const lineItems = getJobTypeLineItems(trade, jobTypeId)
    setSelectedJobType(jobTypeId)
    setLoadedCount(lineItems.length)
    onJobTypeSelect(jobTypeId, lineItems)
  }

  function getIcon(iconName: string) {
    const IconComponent = ICON_MAP[iconName]
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Wrench className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      {/* Trade selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select your trade
        </label>
        <Select value={trade} onValueChange={handleTradeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a trade..." />
          </SelectTrigger>
          <SelectContent>
            {tradeNames.map((t) => {
              const IconComp = ICON_MAP[t.icon]
              return (
                <SelectItem key={t.slug} value={t.slug}>
                  <span className="flex items-center gap-2">
                    {IconComp ? <IconComp className="h-4 w-4" /> : null}
                    {t.name}
                  </span>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Job type cards */}
      {trade && jobTypes.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            What type of job?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jobTypes.map((jt) => {
              const isSelected = selectedJobType === jt.id
              const itemCount = jt.defaultLineItems.length
              return (
                <Card
                  key={jt.id}
                  onClick={() => handleJobTypeClick(jt.id)}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-orange-300'
                  )}
                >
                  <CardContent className="p-4">
                    <p className="font-semibold text-gray-900">{jt.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {itemCount} item{itemCount !== 1 ? 's' : ''} pre-filled
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Success message */}
      {selectedJobType && loadedCount > 0 && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 animate-in fade-in duration-300">
          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium">
            {loadedCount} item{loadedCount !== 1 ? 's' : ''} loaded — customize
            below
          </span>
        </div>
      )}
    </div>
  )
}
