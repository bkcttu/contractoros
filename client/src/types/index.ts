export type TradeType =
  | 'hvac'
  | 'roofing'
  | 'plumbing'
  | 'electrical'
  | 'painting'
  | 'landscaping'
  | 'general'

export type PaymentTerms =
  | '50_upfront'
  | 'net_30'
  | 'due_on_completion'
  | 'custom'

export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'declined'
  | 'expired'

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'partially_paid'
  | 'paid'
  | 'overdue'

export type PlanType = 'starter' | 'pro' | 'team'

// Interfaces support both camelCase and snake_case since Supabase returns snake_case
export interface User {
  id: string
  email: string
  name: string
  businessName: string
  business_name?: string
  trade: TradeType
  phone: string
  logoUrl: string | null
  logo_url?: string | null
  brandColor: string
  brand_color?: string
  licenseNumber: string | null
  license_number?: string | null
  serviceArea: string | null
  service_area?: string | null
  bio: string | null
  taxRate: number
  tax_rate?: number
  defaultPaymentTerms: PaymentTerms
  default_payment_terms?: PaymentTerms
  stripeCustomerId: string | null
  stripe_customer_id?: string | null
  plan: PlanType
  trialEndsAt: string | null
  trial_ends_at?: string | null
  onboardingComplete: boolean
  onboarding_complete?: boolean
  createdAt: string
  created_at?: string
}

export interface Client {
  id: string
  userId: string
  user_id?: string
  name: string
  email: string
  phone: string | null
  address: string | null
  notes: string | null
  createdAt: string
  created_at?: string
}

export interface Proposal {
  id: string
  userId: string
  user_id?: string
  clientId: string
  client_id?: string
  client?: Client
  proposalNumber: string
  proposal_number?: string
  status: ProposalStatus
  jobDescription: string
  job_description?: string
  jobAddress: string
  job_address?: string
  materialsCost: number
  materials_cost?: number
  laborCost: number
  labor_cost?: number
  total: number
  paymentTerms: PaymentTerms
  payment_terms?: PaymentTerms
  warranty: string | null
  specialNotes: string | null
  special_notes?: string | null
  expirationDate: string
  expiration_date?: string
  projectDuration: string | null
  project_duration?: string | null
  aiContent: string | null
  ai_content?: string | null
  pdfUrl: string | null
  pdf_url?: string | null
  viewedAt: string | null
  viewed_at?: string | null
  acceptedAt: string | null
  accepted_at?: string | null
  signatureName: string | null
  signature_name?: string | null
  signatureDate: string | null
  signature_date?: string | null
  createdAt: string
  created_at?: string
}

export interface ProposalFormData {
  clientName: string
  clientEmail: string
  clientPhone: string
  jobAddress: string
  jobDescription: string
  materialsCost: number
  laborCost: number
  projectDuration: string
  paymentTerms: PaymentTerms
  warranty: string
  specialNotes: string
  expirationDate: string
  products?: Array<{
    id: string
    name: string
    url: string
    imageUrl: string
    price: string
    description: string
  }>
}
