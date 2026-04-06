// Import all trade configs
import hvac from './hvac.json'
import plumbing from './plumbing.json'
import roofing from './roofing.json'
import electrical from './electrical.json'
import landscaping from './landscaping.json'
import painting from './painting.json'
import concrete from './concrete.json'
import drywall from './drywall.json'
import tile from './tile.json'
import fencing from './fencing.json'
import general from './general.json'
import pest from './pest.json'
import irrigation from './irrigation.json'
import pool from './pool.json'
import handyman from './handyman.json'

export interface TradeJobType {
  id: string
  name: string
  nameEs: string
  defaultLineItems: TradeLineItem[]
}

export interface TradeLineItem {
  groupName: string
  itemName: string
  description: string
  category: 'labor' | 'materials' | 'equipment' | 'subcontractor' | 'fee'
  quantity: number
  unit: string
  defaultPrice: number
  isOptional: boolean
  brands?: string[]
}

export interface TradeConfig {
  slug: string
  tradeName: string
  tradeNameEs: string
  icon: string
  aiPersona: string
  jobTypes: TradeJobType[]
  commonBrands: string[]
  terminologyGlossary: Record<string, string>
  unitsOfMeasure: string[]
  seasonalTips: Array<{ month: number; tip: string }>
  followUpToneNotes: string
}

const ALL_TRADES: Record<string, TradeConfig> = {
  hvac: hvac as TradeConfig,
  plumbing: plumbing as TradeConfig,
  roofing: roofing as TradeConfig,
  electrical: electrical as TradeConfig,
  landscaping: landscaping as TradeConfig,
  painting: painting as TradeConfig,
  concrete: concrete as TradeConfig,
  drywall: drywall as TradeConfig,
  tile: tile as TradeConfig,
  fencing: fencing as TradeConfig,
  general: general as TradeConfig,
  pest: pest as TradeConfig,
  irrigation: irrigation as TradeConfig,
  pool: pool as TradeConfig,
  handyman: handyman as TradeConfig,
}

export function getTradeConfig(slug: string): TradeConfig | undefined {
  return ALL_TRADES[slug]
}

export function getAllTrades(): TradeConfig[] {
  return Object.values(ALL_TRADES)
}

export function getTradeJobTypes(slug: string): TradeJobType[] {
  return ALL_TRADES[slug]?.jobTypes || []
}

export function getJobTypeLineItems(tradeSlug: string, jobTypeId: string): TradeLineItem[] {
  const trade = ALL_TRADES[tradeSlug]
  if (!trade) return []
  const jobType = trade.jobTypes.find(j => j.id === jobTypeId)
  return jobType?.defaultLineItems || []
}

export function getTradePersona(slug: string): string {
  return ALL_TRADES[slug]?.aiPersona || ''
}

export function getTradeNames(): Array<{ slug: string; name: string; nameEs: string; icon: string }> {
  return Object.values(ALL_TRADES).map(t => ({
    slug: t.slug,
    name: t.tradeName,
    nameEs: t.tradeNameEs,
    icon: t.icon,
  }))
}

export default ALL_TRADES
