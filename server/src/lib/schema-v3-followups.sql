-- Hecho Ai Schema v3 — Follow-Up & Deal Closing System
-- Run this in Supabase SQL Editor

-- ============================================================
-- Follow-up Sequence Templates
-- ============================================================
CREATE TABLE IF NOT EXISTS followup_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trade TEXT,
  is_default BOOLEAN DEFAULT false,
  day2_enabled BOOLEAN DEFAULT true,
  day2_tone TEXT DEFAULT 'check_in',
  day2_channel TEXT DEFAULT 'email',
  day5_enabled BOOLEAN DEFAULT true,
  day5_tone TEXT DEFAULT 'value',
  day5_channel TEXT DEFAULT 'email',
  day9_enabled BOOLEAN DEFAULT true,
  day9_tone TEXT DEFAULT 'urgency',
  day9_channel TEXT DEFAULT 'email',
  day14_enabled BOOLEAN DEFAULT true,
  day14_tone TEXT DEFAULT 'expiration',
  day14_channel TEXT DEFAULT 'email',
  day21_enabled BOOLEAN DEFAULT false,
  day21_tone TEXT DEFAULT 'nurture',
  day21_channel TEXT DEFAULT 'email',
  sms_enabled BOOLEAN DEFAULT false,
  sms_day INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followup_seq_user ON followup_sequences(user_id);

-- ============================================================
-- Follow-up Queue (scheduled messages)
-- ============================================================
CREATE TABLE IF NOT EXISTS followup_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'sms')),
  tone TEXT DEFAULT 'check_in' CHECK (tone IN ('check_in', 'value', 'urgency', 'expiration', 'nurture', 'hot_lead', 'custom')),
  sequence_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'draft_ready', 'sent', 'skipped', 'cancelled')),
  ai_draft TEXT,
  final_content TEXT,
  subject TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followup_queue_proposal ON followup_queue(proposal_id);
CREATE INDEX IF NOT EXISTS idx_followup_queue_status ON followup_queue(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_followup_queue_user ON followup_queue(user_id);

-- ============================================================
-- Client Engagement Events
-- ============================================================
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'email_sent', 'email_opened', 'proposal_viewed',
    'link_clicked', 'addon_checked', 'addon_unchecked',
    'signed', 'payment', 'reply_received',
    'followup_opened', 'time_spent'
  )),
  metadata_json JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_engagement_proposal ON engagement_events(proposal_id);
CREATE INDEX IF NOT EXISTS idx_engagement_type ON engagement_events(proposal_id, event_type);
CREATE INDEX IF NOT EXISTS idx_engagement_time ON engagement_events(occurred_at);

-- ============================================================
-- Loss Feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS loss_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  reason TEXT CHECK (reason IN ('price_too_high', 'went_with_competitor', 'job_postponed', 'no_response', 'other')),
  reason_detail TEXT,
  would_use_again TEXT CHECK (would_use_again IN ('yes', 'maybe', 'no')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loss_proposal ON loss_feedback(proposal_id);

-- ============================================================
-- Add pipeline stage to proposals
-- ============================================================
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS pipeline_stage TEXT DEFAULT 'sent'
  CHECK (pipeline_stage IN ('sent', 'opened', 'engaged', 'hot_lead', 'closed_won', 'closed_lost'));
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS total_time_spent INTEGER DEFAULT 0;

-- ============================================================
-- Follow-up settings per user
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS followup_auto_send TEXT DEFAULT 'review'
  CHECK (followup_auto_send IN ('always', 'review', 'never'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS followup_email_enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS followup_sms_enabled BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS followup_quiet_start TEXT DEFAULT '20:00';
ALTER TABLE users ADD COLUMN IF NOT EXISTS followup_quiet_end TEXT DEFAULT '07:00';
ALTER TABLE users ADD COLUMN IF NOT EXISTS followup_loss_recovery BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS hot_lead_push BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS hot_lead_email BOOLEAN DEFAULT true;

-- ============================================================
-- Enable RLS
-- ============================================================
ALTER TABLE followup_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE loss_feedback ENABLE ROW LEVEL SECURITY;
