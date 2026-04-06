const API_BASE = '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await window.Clerk?.session?.getToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  // User profile
  getProfile: () => request<{ user: import('@/types').User }>('/users/profile'),
  updateProfile: (data: Partial<import('@/types').User>) =>
    request<{ user: import('@/types').User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Proposals
  getProposals: () => request<{ proposals: import('@/types').Proposal[] }>('/proposals'),
  getProposal: (id: string) => request<{ proposal: import('@/types').Proposal }>(`/proposals/${id}`),
  createProposal: (data: import('@/types').ProposalFormData) =>
    request<{ proposal: import('@/types').Proposal }>('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProposal: (id: string, data: Partial<import('@/types').Proposal>) =>
    request<{ proposal: import('@/types').Proposal }>(`/proposals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProposal: (id: string) =>
    request<{ success: boolean }>(`/proposals/${id}`, { method: 'DELETE' }),
  sendProposal: (id: string) =>
    request<{ success: boolean }>(`/proposals/${id}/send`, { method: 'POST' }),

  // AI Generation
  generateProposal: async function* (proposalId: string) {
    const token = await window.Clerk?.session?.getToken()
    const res = await fetch(`${API_BASE}/proposals/${proposalId}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Generation failed' }))
      throw new Error(error.message || 'Failed to generate proposal')
    }

    const reader = res.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      yield decoder.decode(value)
    }
  },

  // PDF
  getProposalPdfUrl: (id: string) => `${API_BASE}/proposals/${id}/pdf`,

  // Public (client portal)
  getPublicProposal: (id: string) =>
    request<{ proposal: import('@/types').Proposal; contractor: Partial<import('@/types').User> }>(
      `/public/proposals/${id}`
    ),
  signProposal: (id: string, signatureName: string) =>
    request<{ success: boolean }>(`/public/proposals/${id}/sign`, {
      method: 'POST',
      body: JSON.stringify({ signatureName }),
    }),

  // Stripe
  createCheckoutSession: (plan: string) =>
    request<{ url: string }>('/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
  getSubscriptionStatus: () =>
    request<{ plan: string; status: string }>('/stripe/subscription'),
}
