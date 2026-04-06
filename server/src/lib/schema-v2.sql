-- ContractorOS Schema Upgrade v2
-- Run this in Supabase SQL Editor AFTER the original schema

-- ============================================================
-- Brand Kit (extends users table)
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS watermark_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#64748B';
ALTER TABLE users ADD COLUMN IF NOT EXISTS font_pair TEXT DEFAULT 'modern_pro';
ALTER TABLE users ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- ============================================================
-- Proposal Line Items
-- ============================================================
CREATE TABLE IF NOT EXISTS proposal_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  group_name TEXT DEFAULT 'General',
  item_name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'materials' CHECK (category IN ('labor', 'materials', 'equipment', 'subcontractor', 'fee')),
  quantity NUMERIC(10,2) DEFAULT 1,
  unit TEXT DEFAULT 'each',
  unit_price NUMERIC(12,2) DEFAULT 0,
  line_total NUMERIC(12,2) DEFAULT 0,
  photo_url TEXT,
  product_link TEXT,
  is_optional BOOLEAN DEFAULT false,
  internal_notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_line_items_proposal ON proposal_line_items(proposal_id);
CREATE INDEX IF NOT EXISTS idx_line_items_sort ON proposal_line_items(proposal_id, sort_order);

-- ============================================================
-- Proposal Sections (modular content blocks)
-- ============================================================
CREATE TABLE IF NOT EXISTS proposal_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN (
    'cover_photo', 'about', 'why_choose_us', 'gallery',
    'product_spotlight', 'video', 'testimonials', 'warranty',
    'process', 'financing', 'custom_text', 'terms'
  )),
  title TEXT,
  content_json JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_proposal ON proposal_sections(proposal_id);

-- ============================================================
-- Service / Product Library
-- ============================================================
CREATE TABLE IF NOT EXISTS service_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'materials',
  default_price NUMERIC(12,2) DEFAULT 0,
  unit TEXT DEFAULT 'each',
  photo_url TEXT,
  product_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_library_user ON service_library(user_id);

-- ============================================================
-- Proposal Templates
-- ============================================================
CREATE TABLE IF NOT EXISTS proposal_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  structure_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_user ON proposal_templates(user_id);

-- ============================================================
-- Proposal Analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS proposal_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'opened', 'viewed', 'time_spent', 'link_clicked',
    'addon_checked', 'addon_unchecked', 'signed', 'payment'
  )),
  event_data JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_proposal ON proposal_analytics(proposal_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON proposal_analytics(proposal_id, event_type);

-- ============================================================
-- Proposal Tiers (Good / Better / Best)
-- ============================================================
CREATE TABLE IF NOT EXISTS proposal_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL,
  tier_label TEXT,
  price NUMERIC(12,2) DEFAULT 0,
  line_items_json JSONB NOT NULL DEFAULT '[]',
  features_json JSONB NOT NULL DEFAULT '[]',
  is_highlighted BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tiers_proposal ON proposal_tiers(proposal_id);

-- ============================================================
-- Add cover photo and tier mode to proposals
-- ============================================================
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tier_mode BOOLEAN DEFAULT false;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS selected_tier_id UUID;

-- ============================================================
-- Enable RLS on new tables
-- ============================================================
ALTER TABLE proposal_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_tiers ENABLE ROW LEVEL SECURITY;
