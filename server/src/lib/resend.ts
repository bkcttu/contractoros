import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

if (!apiKey) {
  console.warn('Missing RESEND_API_KEY — email sending disabled')
}

export const resend = apiKey ? new Resend(apiKey) : null

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'

export async function sendProposalEmail(
  to: string,
  contractorName: string,
  clientName: string,
  proposalId: string,
  contractorEmail: string
) {
  const proposalLink = `${APP_URL}/p/${proposalId}`

  if (!resend) {
    console.warn('Email not sent — Resend not configured')
    return
  }

  return resend.emails.send({
    from: 'Hecho Ai <noreply@gethecho.com>',
    replyTo: contractorEmail,
    to,
    subject: `You have a proposal from ${contractorName}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1B2A4A; padding: 24px; text-align: center;">
          <h1 style="color: #F97316; margin: 0; font-size: 24px;">Hecho Ai</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <p style="font-size: 16px; color: #333;">Hi ${clientName},</p>
          <p style="font-size: 16px; color: #333;">
            <strong>${contractorName}</strong> has sent you a proposal. Click the button below to view the details.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${proposalLink}"
               style="background-color: #F97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View Proposal
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            If you have questions, reply to this email to reach ${contractorName} directly.
          </p>
        </div>
        <div style="background-color: #F8F9FA; padding: 16px; text-align: center;">
          <p style="font-size: 12px; color: #999; margin: 0;">Powered by Hecho Ai</p>
        </div>
      </div>
    `,
  })
}
