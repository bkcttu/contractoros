import { Router } from 'express'
import Stripe from 'stripe'
import { requireAuth, getUserId } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey ? new Stripe(stripeKey) : null

export const stripeRoutes = Router()

// Create checkout session
stripeRoutes.post('/create-checkout', requireAuth, async (req, res) => {
  try {
    if (!stripe) {
      res.status(500).json({ message: 'Stripe not configured' })
      return
    }

    const clerkId = getUserId(req)
    const { plan } = req.body

    const priceId = plan === 'team'
      ? process.env.STRIPE_TEAM_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID

    if (!priceId) {
      res.status(400).json({ message: 'Invalid plan' })
      return
    }

    const { data: user } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('clerk_id', clerkId)
      .single()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/settings/billing`,
    }

    if (user?.stripe_customer_id) {
      sessionConfig.customer = user.stripe_customer_id
    } else if (user?.email) {
      sessionConfig.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ message: 'Failed to create checkout session' })
  }
})

// Get subscription status
stripeRoutes.get('/subscription', requireAuth, async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('plan, trial_ends_at, stripe_customer_id')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({
      plan: user.plan,
      status: user.trial_ends_at && new Date(user.trial_ends_at) > new Date() ? 'trialing' : 'active',
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get subscription' })
  }
})

// Stripe webhook
stripeRoutes.post('/webhook', async (req, res) => {
  try {
    if (!stripe) {
      res.status(500).json({ message: 'Stripe not configured' })
      return
    }

    const sig = req.headers['stripe-signature'] as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      res.status(500).json({ message: 'Webhook secret not configured' })
      return
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.customer_email) {
          await supabase
            .from('users')
            .update({
              plan: 'pro',
              stripe_customer_id: session.customer as string,
            })
            .eq('email', session.customer_email)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabase
          .from('users')
          .update({ plan: 'starter' })
          .eq('stripe_customer_id', sub.customer as string)
        break
      }
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(400).json({ message: 'Webhook error' })
  }
})
