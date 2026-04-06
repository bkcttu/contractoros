import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  Star,
  Check,
  Crown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export interface TierFeature {
  text: string
  included: boolean
}

export interface PricingTier {
  id: string
  name: string
  label: string
  price: number
  features: TierFeature[]
  isHighlighted: boolean
}

interface PricingTiersProps {
  tiers: PricingTier[]
  onChange: (tiers: PricingTier[]) => void
  mode: 'edit' | 'preview' | 'client'
  onSelect?: (tierId: string) => void
  selectedTierId?: string
}

export const DEFAULT_TIERS: PricingTier[] = [
  {
    id: '1',
    name: 'Basic',
    label: 'GOOD',
    price: 0,
    features: [
      { text: 'Standard materials', included: true },
      { text: 'Basic warranty', included: true },
      { text: 'Standard timeline', included: true },
    ],
    isHighlighted: false,
  },
  {
    id: '2',
    name: 'Standard',
    label: 'BETTER',
    price: 0,
    features: [
      { text: 'Premium materials', included: true },
      { text: 'Extended warranty', included: true },
      { text: 'Priority scheduling', included: true },
      { text: 'Smart thermostat included', included: true },
    ],
    isHighlighted: true,
  },
  {
    id: '3',
    name: 'Premium',
    label: 'BEST',
    price: 0,
    features: [
      { text: 'Top-of-line materials', included: true },
      { text: 'Lifetime warranty', included: true },
      { text: 'Priority scheduling', included: true },
      { text: 'Smart home integration', included: true },
      { text: 'Annual maintenance plan', included: true },
    ],
    isHighlighted: false,
  },
]

function EditTierColumn({
  tier,
  onUpdate,
  onHighlight,
}: {
  tier: PricingTier
  onUpdate: (updated: PricingTier) => void
  onHighlight: () => void
}) {
  const updateFeature = (index: number, patch: Partial<TierFeature>) => {
    const features = tier.features.map((f, i) =>
      i === index ? { ...f, ...patch } : f
    )
    onUpdate({ ...tier, features })
  }

  const addFeature = () => {
    onUpdate({
      ...tier,
      features: [...tier.features, { text: '', included: true }],
    })
  }

  const removeFeature = (index: number) => {
    onUpdate({
      ...tier,
      features: tier.features.filter((_, i) => i !== index),
    })
  }

  return (
    <Card
      className={cn(
        'card-hover relative flex flex-col',
        tier.isHighlighted && 'border-2 border-accent shadow-xl shadow-accent/10'
      )}
    >
      {tier.isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            <Crown className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-500">Tier Label</Label>
            <Input
              value={tier.label}
              onChange={(e) => onUpdate({ ...tier, label: e.target.value })}
              placeholder="e.g. GOOD"
              className="mt-1 text-xs font-semibold uppercase tracking-widest"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Tier Name</Label>
            <Input
              value={tier.name}
              onChange={(e) => onUpdate({ ...tier, name: e.target.value })}
              placeholder="e.g. Basic"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Price</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-500">
                $
              </span>
              <Input
                type="number"
                value={tier.price || ''}
                onChange={(e) =>
                  onUpdate({ ...tier, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
                className="pl-7 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Features</Label>
          {tier.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  updateFeature(idx, { included: !feature.included })
                }
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                  feature.included
                    ? 'border-green-300 bg-green-50 text-green-600'
                    : 'border-gray-300 bg-gray-50 text-gray-400'
                )}
              >
                {feature.included ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-xs">--</span>
                )}
              </button>
              <Input
                value={feature.text}
                onChange={(e) => updateFeature(idx, { text: e.target.value })}
                placeholder="Feature description"
                className="h-8 text-sm"
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addFeature}
            className="w-full text-gray-500"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Feature
          </Button>
        </div>

        <div className="mt-auto pt-3 border-t">
          <button
            type="button"
            onClick={onHighlight}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              tier.isHighlighted
                ? 'bg-accent/10 text-accent'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            )}
          >
            <Star
              className={cn(
                'h-4 w-4',
                tier.isHighlighted && 'fill-accent'
              )}
            />
            {tier.isHighlighted ? 'Recommended' : 'Highlight as recommended'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

function DisplayTierColumn({
  tier,
  maxFeatures,
  mode,
  onSelect,
  isSelected,
}: {
  tier: PricingTier
  maxFeatures: number
  mode: 'preview' | 'client'
  onSelect?: () => void
  isSelected?: boolean
}) {
  return (
    <Card
      className={cn(
        'card-hover relative flex flex-col transition-all duration-300',
        tier.isHighlighted
          ? 'border-2 border-accent shadow-xl shadow-accent/10 lg:scale-105 z-10'
          : 'border border-gray-200'
      )}
    >
      {tier.isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            <Crown className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}
      <CardContent className="flex flex-1 flex-col p-6 pt-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {tier.label}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-navy">
            {tier.name}
          </h3>
          <p className="mt-3 font-mono text-3xl font-bold text-navy">
            {formatCurrency(tier.price)}
          </p>
        </div>

        <div className="mt-6 flex-1 space-y-0">
          {Array.from({ length: maxFeatures }).map((_, idx) => {
            const feature = tier.features[idx]
            return (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-md text-sm',
                  idx % 2 === 0 ? 'bg-gray-50/70' : 'bg-transparent'
                )}
              >
                {feature ? (
                  <>
                    {feature.included ? (
                      <Check className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-gray-300">
                        --
                      </span>
                    )}
                    <span
                      className={cn(
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      )}
                    >
                      {feature.text}
                    </span>
                  </>
                ) : (
                  <span className="h-4">&nbsp;</span>
                )}
              </div>
            )
          })}
        </div>

        {mode === 'client' && onSelect && (
          <div className="mt-6">
            <Button
              type="button"
              variant={isSelected ? 'accent' : 'outline'}
              className={cn(
                'w-full transition-all duration-300',
                isSelected && 'shadow-md shadow-accent/30'
              )}
              onClick={onSelect}
            >
              {isSelected ? 'Selected' : 'Select This Package'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function PricingTiers({
  tiers,
  onChange,
  mode,
  onSelect,
  selectedTierId,
}: PricingTiersProps) {
  const updateTier = (index: number, updated: PricingTier) => {
    const next = tiers.map((t, i) => (i === index ? updated : t))
    onChange(next)
  }

  const highlightTier = (index: number) => {
    const next = tiers.map((t, i) => ({
      ...t,
      isHighlighted: i === index,
    }))
    onChange(next)
  }

  const maxFeatures = Math.max(...tiers.map((t) => t.features.length))

  if (mode === 'edit') {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {tiers.map((tier, idx) => (
          <EditTierColumn
            key={tier.id}
            tier={tier}
            onUpdate={(updated) => updateTier(idx, updated)}
            onHighlight={() => highlightTier(idx)}
          />
        ))}
      </div>
    )
  }

  // Sort tiers for mobile: highlighted first
  const sortedTiers = [...tiers].sort((a, b) => {
    if (a.isHighlighted) return -1
    if (b.isHighlighted) return 1
    return 0
  })

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      {/* On mobile, show sorted (highlighted first); on desktop, show original order */}
      {tiers.map((tier) => (
        <DisplayTierColumn
          key={tier.id}
          tier={tier}
          maxFeatures={maxFeatures}
          mode={mode}
          onSelect={onSelect ? () => onSelect(tier.id) : undefined}
          isSelected={selectedTierId === tier.id}
        />
      ))}
    </div>
  )
}
