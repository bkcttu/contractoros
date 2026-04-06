import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  GripVertical,
  Package,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ImagePlus,
  X,
  DollarSign,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export interface LineItem {
  id: string
  groupName: string
  itemName: string
  description: string
  category: 'labor' | 'materials' | 'equipment' | 'subcontractor' | 'fee'
  quantity: number
  unit: string
  unitPrice: number
  lineTotal: number
  photoUrl: string
  productLink: string
  isOptional: boolean
  internalNotes: string
}

interface LineItemBuilderProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  taxRate: number
  onAiDescribe?: (itemName: string) => Promise<string>
}

const CATEGORY_STYLES: Record<LineItem['category'], string> = {
  labor: 'bg-blue-100 text-blue-700',
  materials: 'bg-green-100 text-green-700',
  equipment: 'bg-purple-100 text-purple-700',
  subcontractor: 'bg-amber-100 text-amber-700',
  fee: 'bg-gray-100 text-gray-600',
}

const CATEGORY_LABELS: Record<LineItem['category'], string> = {
  labor: 'Labor',
  materials: 'Materials',
  equipment: 'Equipment',
  subcontractor: 'Subcontractor',
  fee: 'Fee',
}

const UNITS = ['each', 'hr', 'sq ft', 'linear ft', 'lump sum', 'day']

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function createEmptyItem(groupName = 'General'): LineItem {
  return {
    id: generateId(),
    groupName,
    itemName: '',
    description: '',
    category: 'labor',
    quantity: 1,
    unit: 'each',
    unitPrice: 0,
    lineTotal: 0,
    photoUrl: '',
    productLink: '',
    isOptional: false,
    internalNotes: '',
  }
}

export function LineItemBuilder({
  items,
  onChange,
  taxRate,
  onAiDescribe,
}: LineItemBuilderProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [newGroupName, setNewGroupName] = useState('')
  const [showGroupInput, setShowGroupInput] = useState(false)

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleGroupCollapsed = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    const next = items.map((item) => {
      if (item.id !== id) return item
      const updated = { ...item, ...updates }
      updated.lineTotal = updated.quantity * updated.unitPrice
      return updated
    })
    onChange(next)
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= items.length) return
    const next = [...items]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp
    onChange(next)
  }

  const addItem = (groupName = 'General') => {
    const newItem = createEmptyItem(groupName)
    onChange([...items, newItem])
    setExpandedIds((prev) => new Set(prev).add(newItem.id))
  }

  const handleAddGroup = () => {
    const name = newGroupName.trim()
    if (!name) return
    const newItem = createEmptyItem(name)
    onChange([...items, newItem])
    setExpandedIds((prev) => new Set(prev).add(newItem.id))
    setNewGroupName('')
    setShowGroupInput(false)
  }

  const handleAiDescribe = async (item: LineItem) => {
    if (!onAiDescribe || !item.itemName) return
    const description = await onAiDescribe(item.itemName)
    updateItem(item.id, { description })
  }

  // Group items preserving order
  const groups: { name: string; items: { item: LineItem; globalIndex: number }[] }[] = []
  const groupMap = new Map<string, { item: LineItem; globalIndex: number }[]>()

  items.forEach((item, globalIndex) => {
    if (!groupMap.has(item.groupName)) {
      const arr: { item: LineItem; globalIndex: number }[] = []
      groupMap.set(item.groupName, arr)
      groups.push({ name: item.groupName, items: arr })
    }
    groupMap.get(item.groupName)!.push({ item, globalIndex })
  })

  // Pricing calculations
  const requiredItems = items.filter((i) => !i.isOptional)
  const optionalItems = items.filter((i) => i.isOptional)
  const subtotal = requiredItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const optionalTotal = optionalItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.name)
        return (
          <div key={group.name} className="space-y-2">
            {/* Group header */}
            <button
              type="button"
              onClick={() => toggleGroupCollapsed(group.name)}
              className="flex w-full items-center gap-2 border-l-4 border-orange-400 pl-3 py-1 hover:bg-gray-50 rounded-r transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {group.name}
              </span>
              <span className="text-xs text-gray-400">
                ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
              </span>
            </button>

            {/* Group items */}
            {!isCollapsed && (
              <div className="space-y-2 pl-4">
                {group.items.map(({ item, globalIndex }) => {
                  const isExpanded = expandedIds.has(item.id)
                  return (
                    <Card
                      key={item.id}
                      className={cn(
                        'transition-all',
                        item.isOptional ? 'border-dashed border-gray-300' : 'border-gray-200'
                      )}
                    >
                      <CardContent className="p-3">
                        {/* Collapsed row */}
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 shrink-0 text-gray-300 cursor-grab" />

                          {/* Move up/down */}
                          <div className="flex flex-col shrink-0">
                            <button
                              type="button"
                              onClick={() => moveItem(globalIndex, -1)}
                              disabled={globalIndex === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Move up"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem(globalIndex, 1)}
                              disabled={globalIndex === items.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Move down"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Item name */}
                          <span className="min-w-0 flex-1 truncate font-semibold text-sm text-navy">
                            {item.itemName || 'Untitled item'}
                          </span>

                          {/* Optional badge */}
                          {item.isOptional && (
                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                              Optional
                            </span>
                          )}

                          {/* Category badge */}
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                              CATEGORY_STYLES[item.category]
                            )}
                          >
                            {CATEGORY_LABELS[item.category]}
                          </span>

                          {/* Pricing */}
                          <span className="shrink-0 font-mono text-sm text-orange-600">
                            {item.quantity} x {formatCurrency(item.unitPrice)} ={' '}
                            <span className="font-bold">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </span>
                          </span>

                          {/* Expand/collapse */}
                          <button
                            type="button"
                            onClick={() => toggleExpanded(item.id)}
                            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            aria-label="Delete item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Expanded edit form */}
                        {isExpanded && (
                          <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                            {/* Row 1: Item name + Category */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                              <div className="sm:col-span-2">
                                <Label htmlFor={`name-${item.id}`}>Item Name</Label>
                                <Input
                                  id={`name-${item.id}`}
                                  value={item.itemName}
                                  onChange={(e) =>
                                    updateItem(item.id, { itemName: e.target.value })
                                  }
                                  placeholder="e.g. Copper pipe 1/2 inch"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Category</Label>
                                <Select
                                  value={item.category}
                                  onValueChange={(val) =>
                                    updateItem(item.id, {
                                      category: val as LineItem['category'],
                                    })
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="labor">Labor</SelectItem>
                                    <SelectItem value="materials">Materials</SelectItem>
                                    <SelectItem value="equipment">Equipment</SelectItem>
                                    <SelectItem value="subcontractor">Subcontractor</SelectItem>
                                    <SelectItem value="fee">Fee</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Row 2: Description + AI button */}
                            <div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`desc-${item.id}`}>Description</Label>
                                {onAiDescribe && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAiDescribe(item)}
                                    disabled={!item.itemName}
                                    className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                  >
                                    <Sparkles className="h-3 w-3" />
                                    AI Describe
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                id={`desc-${item.id}`}
                                value={item.description}
                                onChange={(e) =>
                                  updateItem(item.id, { description: e.target.value })
                                }
                                placeholder="Describe the work or material..."
                                rows={2}
                                className="mt-1 min-h-0"
                              />
                            </div>

                            {/* Row 3: Quantity, Unit, Unit Price */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                                <Input
                                  id={`qty-${item.id}`}
                                  type="number"
                                  min={0}
                                  step="any"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(item.id, {
                                      quantity: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Unit</Label>
                                <Select
                                  value={item.unit}
                                  onValueChange={(val) => updateItem(item.id, { unit: val })}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {UNITS.map((u) => (
                                      <SelectItem key={u} value={u}>
                                        {u}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor={`price-${item.id}`}>Unit Price</Label>
                                <div className="relative mt-1">
                                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    id={`price-${item.id}`}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      updateItem(item.id, {
                                        unitPrice: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="pl-8"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Row 4: Photo URL + Product Link */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor={`photo-${item.id}`}>Photo URL</Label>
                                <div className="relative mt-1">
                                  <ImagePlus className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    id={`photo-${item.id}`}
                                    value={item.photoUrl}
                                    onChange={(e) =>
                                      updateItem(item.id, { photoUrl: e.target.value })
                                    }
                                    placeholder="https://..."
                                    className="pl-8"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`link-${item.id}`}>Product Link</Label>
                                <div className="relative mt-1">
                                  <ExternalLink className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    id={`link-${item.id}`}
                                    value={item.productLink}
                                    onChange={(e) =>
                                      updateItem(item.id, { productLink: e.target.value })
                                    }
                                    placeholder="https://..."
                                    className="pl-8"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Photo preview */}
                            {item.photoUrl && (
                              <div className="flex items-start gap-2">
                                <img
                                  src={item.photoUrl}
                                  alt={item.itemName}
                                  className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => updateItem(item.id, { photoUrl: '' })}
                                  className="rounded p-0.5 text-gray-400 hover:text-red-500"
                                  aria-label="Remove photo"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}

                            {/* Internal notes */}
                            <div>
                              <Label htmlFor={`notes-${item.id}`} className="flex items-center gap-1 text-gray-400">
                                <Package className="h-3 w-3" />
                                Internal only — not shown to client
                              </Label>
                              <Input
                                id={`notes-${item.id}`}
                                value={item.internalNotes}
                                onChange={(e) =>
                                  updateItem(item.id, { internalNotes: e.target.value })
                                }
                                placeholder="Private notes..."
                                className="mt-1 border-dashed"
                              />
                            </div>

                            {/* Optional toggle */}
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.isOptional}
                                onChange={(e) =>
                                  updateItem(item.id, { isOptional: e.target.checked })
                                }
                                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-600">Mark as Optional Add-on</span>
                            </label>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem('General')}
          className="border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Line Item
        </Button>

        {showGroupInput ? (
          <div className="flex items-center gap-2">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name..."
              className="h-9 w-48"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddGroup()
                if (e.key === 'Escape') {
                  setShowGroupInput(false)
                  setNewGroupName('')
                }
              }}
              autoFocus
            />
            <Button type="button" size="sm" onClick={handleAddGroup} disabled={!newGroupName.trim()}>
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowGroupInput(false)
                setNewGroupName('')
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowGroupInput(true)}
            className="border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Group
          </Button>
        )}
      </div>

      {/* Pricing Summary */}
      {items.length > 0 && (
        <Card className="bg-slate-900 text-white border-0">
          <CardContent className="p-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>

              {optionalItems.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Optional items</span>
                  <span className="font-mono text-gray-400">
                    {formatCurrency(optionalTotal)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Tax ({taxRate.toFixed(2)}%)</span>
                <span className="font-mono">{formatCurrency(taxAmount)}</span>
              </div>

              <div className="my-2 border-t border-gray-600" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="font-mono">{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
