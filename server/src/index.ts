import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { userRoutes } from './routes/users.js'
import { proposalRoutes } from './routes/proposals.js'
import { publicRoutes } from './routes/public.js'
import { stripeRoutes } from './routes/stripe.js'

const app = express()
const PORT = process.env.PORT || 3001

// Stripe webhook needs raw body - must be before json parser
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// Routes
app.use('/api/users', userRoutes)
app.use('/api/proposals', proposalRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/stripe', stripeRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`ContractorOS server running on port ${PORT}`)
})
