import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

export const publicRoutes = Router()

// Get proposal for client portal (no auth required)
publicRoutes.get('/proposals/:id', async (req, res) => {
  try {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select('*, clients(*)')
      .eq('id', req.params.id)
      .single()

    if (error || !proposal) {
      res.status(404).json({ message: 'Proposal not found' })
      return
    }

    // Mark as viewed
    if (proposal.status === 'sent' && !proposal.viewed_at) {
      await supabase
        .from('proposals')
        .update({ status: 'viewed', viewed_at: new Date().toISOString() })
        .eq('id', proposal.id)
    }

    // Get contractor info
    const { data: contractor } = await supabase
      .from('users')
      .select('name, business_name, trade, phone, email, logo_url, brand_color, license_number, service_area')
      .eq('id', proposal.user_id)
      .single()

    res.json({ proposal, contractor })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch proposal' })
  }
})

// Sign proposal (e-signature)
publicRoutes.post('/proposals/:id/sign', async (req, res) => {
  try {
    const { signatureName } = req.body

    if (!signatureName) {
      res.status(400).json({ message: 'Signature name is required' })
      return
    }

    const { data: proposal, error } = await supabase
      .from('proposals')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        signature_name: signatureName,
        signature_date: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.json({ success: true, proposal })
  } catch (err) {
    res.status(500).json({ message: 'Failed to sign proposal' })
  }
})
