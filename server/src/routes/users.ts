import { Router } from 'express'
import { requireAuth, getUserId } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

export const userRoutes = Router()

userRoutes.use(requireAuth)

// Get or create user profile
userRoutes.get('/profile', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (error && error.code === 'PGRST116') {
      // User doesn't exist yet, create them
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          clerk_id: clerkId,
          plan: 'starter',
          brand_color: '#F97316',
          tax_rate: 0,
          default_payment_terms: '50_upfront',
          onboarding_complete: false,
        })
        .select()
        .single()

      if (createError) {
        res.status(500).json({ message: createError.message })
        return
      }
      res.json({ user: newUser })
      return
    }

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile' })
  }
})

// Update user profile
userRoutes.put('/profile', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const allowedFields = [
      'name', 'email', 'business_name', 'trade', 'phone', 'logo_url',
      'brand_color', 'license_number', 'service_area', 'bio',
      'tax_rate', 'default_payment_terms', 'onboarding_complete',
    ]

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      // Accept both snake_case and camelCase
      const camelCase = field.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      if (req.body[field] !== undefined) updates[field] = req.body[field]
      else if (req.body[camelCase] !== undefined) updates[field] = req.body[camelCase]
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('clerk_id', clerkId)
      .select()
      .single()

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
})
