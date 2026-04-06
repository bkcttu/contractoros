import { Router } from 'express'
import { requireAuth, getUserId } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'
import { anthropic, PROPOSAL_SYSTEM_PROMPT } from '../lib/anthropic.js'
import { sendProposalEmail } from '../lib/resend.js'

export const proposalRoutes = Router()

proposalRoutes.use(requireAuth)

// List proposals
proposalRoutes.get('/', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    // Get user's internal id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('*, clients(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.json({ proposals: proposals || [] })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch proposals' })
  }
})

// Get single proposal
proposalRoutes.get('/:id', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { data: proposal, error } = await supabase
      .from('proposals')
      .select('*, clients(*)')
      .eq('id', req.params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      res.status(404).json({ message: 'Proposal not found' })
      return
    }

    res.json({ proposal })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch proposal' })
  }
})

// Create proposal
proposalRoutes.post('/', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('id, tax_rate')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const {
      clientName, clientEmail, clientPhone,
      jobAddress, jobDescription, materialsCost, laborCost,
      projectDuration, paymentTerms, warranty, specialNotes, expirationDate,
    } = req.body

    // Create or find client
    let clientId: string
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .eq('email', clientEmail)
      .single()

    if (existingClient) {
      clientId = existingClient.id
    } else {
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: clientName,
          email: clientEmail,
          phone: clientPhone || null,
          address: jobAddress || null,
        })
        .select()
        .single()

      if (clientError || !newClient) {
        res.status(500).json({ message: 'Failed to create client' })
        return
      }
      clientId = newClient.id
    }

    // Generate proposal number
    const { count } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const proposalNumber = `P-${String((count || 0) + 1).padStart(4, '0')}`
    const subtotal = Number(materialsCost) + Number(laborCost)
    const taxAmount = subtotal * ((user.tax_rate || 0) / 100)
    const total = subtotal + taxAmount

    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        user_id: user.id,
        client_id: clientId,
        proposal_number: proposalNumber,
        status: 'draft',
        job_description: jobDescription,
        job_address: jobAddress,
        materials_cost: Number(materialsCost),
        labor_cost: Number(laborCost),
        total,
        payment_terms: paymentTerms,
        warranty: warranty || null,
        special_notes: specialNotes || null,
        expiration_date: expirationDate,
        project_duration: projectDuration || null,
      })
      .select('*, clients(*)')
      .single()

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.status(201).json({ proposal })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create proposal' })
  }
})

// Update proposal
proposalRoutes.put('/:id', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { data: proposal, error } = await supabase
      .from('proposals')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', user.id)
      .select('*, clients(*)')
      .single()

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.json({ proposal })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update proposal' })
  }
})

// Delete proposal
proposalRoutes.delete('/:id', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', user.id)

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete proposal' })
  }
})

// Generate AI proposal content (streaming)
proposalRoutes.post('/:id/generate', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { data: proposal } = await supabase
      .from('proposals')
      .select('*, clients(*)')
      .eq('id', req.params.id)
      .eq('user_id', user.id)
      .single()

    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' })
      return
    }

    const paymentTermsMap: Record<string, string> = {
      '50_upfront': '50% due upfront, 50% upon completion',
      'net_30': 'Net 30 days',
      'due_on_completion': 'Due upon completion',
      'custom': 'Custom terms (see details)',
    }

    const userPrompt = `Generate a professional contractor proposal with these details:

Contractor: ${user.business_name || user.name || 'Contractor'}
Trade: ${user.trade || 'General Contracting'}
License #: ${user.license_number || 'N/A'}
Phone: ${user.phone || 'N/A'}
Email: ${user.email || 'N/A'}

Client: ${proposal.clients?.name || 'Client'}
Job Site: ${proposal.job_address || 'N/A'}

Job Description: ${proposal.job_description}

Materials Cost: $${proposal.materials_cost.toFixed(2)}
Labor Cost: $${proposal.labor_cost.toFixed(2)}
Total: $${proposal.total.toFixed(2)}

Project Duration: ${proposal.project_duration || 'To be determined'}
Payment Terms: ${paymentTermsMap[proposal.payment_terms] || proposal.payment_terms}
${proposal.warranty ? `Warranty: ${proposal.warranty}` : ''}
${proposal.special_notes ? `Special Notes: ${proposal.special_notes}` : ''}

Proposal #: ${proposal.proposal_number}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Expiration: ${proposal.expiration_date ? new Date(proposal.expiration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '30 days from issue'}`

    // Stream the response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Cache-Control', 'no-cache')

    let fullContent = ''

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: PROPOSAL_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    stream.on('text', (text) => {
      fullContent += text
      res.write(text)
    })

    stream.on('end', async () => {
      // Save the generated content
      await supabase
        .from('proposals')
        .update({ ai_content: fullContent })
        .eq('id', proposal.id)

      res.end()
    })

    stream.on('error', (error) => {
      console.error('Stream error:', error)
      res.end()
    })
  } catch (err) {
    console.error('Generate error:', err)
    res.status(500).json({ message: 'Failed to generate proposal' })
  }
})

// Send proposal to client
proposalRoutes.post('/:id/send', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { data: proposal } = await supabase
      .from('proposals')
      .select('*, clients(*)')
      .eq('id', req.params.id)
      .eq('user_id', user.id)
      .single()

    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' })
      return
    }

    if (!proposal.clients?.email) {
      res.status(400).json({ message: 'Client email required' })
      return
    }

    // Send email
    await sendProposalEmail(
      proposal.clients.email,
      user.business_name || user.name || 'Contractor',
      proposal.clients.name,
      proposal.id,
      user.email || ''
    )

    // Update status
    await supabase
      .from('proposals')
      .update({ status: 'sent' })
      .eq('id', proposal.id)

    res.json({ success: true })
  } catch (err) {
    console.error('Send error:', err)
    res.status(500).json({ message: 'Failed to send proposal' })
  }
})

// Generate PDF
proposalRoutes.get('/:id/pdf', async (req, res) => {
  try {
    const clerkId = getUserId(req)

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { data: proposal } = await supabase
      .from('proposals')
      .select('*, clients(*)')
      .eq('id', req.params.id)
      .eq('user_id', user.id)
      .single()

    if (!proposal || !proposal.ai_content) {
      res.status(404).json({ message: 'Proposal not found or not generated yet' })
      return
    }

    const puppeteer = await import('puppeteer-core')
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable',
    })
    const page = await browser.newPage()

    const brandColor = user.brand_color || '#F97316'

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1B2A4A; line-height: 1.6; padding: 40px; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid ${brandColor}; }
    .logo-section h1 { font-family: 'DM Sans', sans-serif; font-size: 24px; color: #1B2A4A; }
    .logo-section p { font-size: 13px; color: #666; margin-top: 4px; }
    .proposal-info { text-align: right; }
    .proposal-info .number { font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 700; color: ${brandColor}; }
    .proposal-info p { font-size: 13px; color: #666; }

    .parties { display: flex; gap: 40px; margin-bottom: 32px; }
    .party { flex: 1; }
    .party-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${brandColor}; font-weight: 600; margin-bottom: 8px; }
    .party-name { font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; }
    .party p { font-size: 13px; color: #444; }

    h2 { font-family: 'DM Sans', sans-serif; font-size: 18px; color: #1B2A4A; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #E5E7EB; }
    p { font-size: 14px; margin-bottom: 8px; }
    ul { padding-left: 20px; margin-bottom: 12px; }
    li { font-size: 14px; margin-bottom: 4px; }

    .proposal-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .proposal-table th { background: #F8F9FA; padding: 10px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #E5E7EB; }
    .proposal-table td { padding: 10px 16px; font-size: 14px; border-bottom: 1px solid #F0F0F0; }
    .proposal-table tr:last-child td { border-bottom: 2px solid #E5E7EB; font-weight: 600; }
    .proposal-table .amount { text-align: right; font-family: 'JetBrains Mono', monospace; }

    .signature-block { margin-top: 40px; padding: 24px; background: #F8F9FA; border-radius: 8px; }
    .signature-block h3 { font-family: 'DM Sans', sans-serif; margin-bottom: 16px; }
    .sig-line { border-bottom: 1px solid #999; width: 250px; height: 40px; display: inline-block; margin-right: 40px; }
    .sig-label { font-size: 12px; color: #666; margin-top: 4px; }

    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-section">
      <h1>${user.business_name || user.name || 'Contractor'}</h1>
      <p>${user.phone || ''} ${user.phone && user.email ? '|' : ''} ${user.email || ''}</p>
      ${user.license_number ? `<p>License #: ${user.license_number}</p>` : ''}
    </div>
    <div class="proposal-info">
      <div class="number">${proposal.proposal_number}</div>
      <p>Date: ${new Date(proposal.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      ${proposal.expiration_date ? `<p>Expires: ${new Date(proposal.expiration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-label">From</div>
      <div class="party-name">${user.business_name || user.name || 'Contractor'}</div>
      ${user.service_area ? `<p>${user.service_area}</p>` : ''}
    </div>
    <div class="party">
      <div class="party-label">Prepared For</div>
      <div class="party-name">${proposal.clients?.name || 'Client'}</div>
      <p>${proposal.clients?.email || ''}</p>
      ${proposal.job_address ? `<p>${proposal.job_address}</p>` : ''}
    </div>
  </div>

  ${proposal.ai_content}

  <div class="footer">
    <p>${user.business_name || user.name || 'Contractor'} | ${user.phone || ''} | ${user.email || ''}</p>
  </div>
</body>
</html>`

    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'Letter',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      printBackground: true,
    })

    await browser.close()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${proposal.proposal_number}.pdf"`)
    res.send(pdf)
  } catch (err) {
    console.error('PDF error:', err)
    res.status(500).json({ message: 'Failed to generate PDF' })
  }
})
