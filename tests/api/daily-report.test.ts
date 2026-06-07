import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockCreate } = vi.hoisted(() => {
  return { mockCreate: vi.fn() }
})

vi.mock('openai', () => {
  const OpenAI = function (this: any) {
    this.chat = {
      completions: {
        create: mockCreate,
      },
    }
  }
  return { default: OpenAI }
})

vi.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    ok: true,
    user: { id: 'test-user-id', is_anonymous: false },
  }),
}))

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: vi
    .fn()
    .mockResolvedValue({ allowed: true, remaining: 2, reset: 0 }),
  rateLimitHeaders: vi.fn().mockReturnValue({}),
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { POST } from '@/app/api/daily-report/route'

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/daily-report', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

const sampleTransactions = [
  { type: 'income', amount: 5000 },
  { type: 'outcome', amount: 1000 },
]

const sampleFixedCosts = [
  { title: 'Rent', amount: 800, dueDay: 25 },
  { title: 'Internet', amount: 50, dueDay: 5 },
]

describe('POST /api/daily-report', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'You`re daily report' } }],
    })
  })

  it('should return success: true and report', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })

    const req = makeRequest({
      transactions: sampleTransactions,
      fixedCosts: sampleFixedCosts,
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.report).toBe('You`re daily report')
  })

  it('should return status 500 when Telegram API fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ description: 'Unauthorized' }),
    })

    const req = makeRequest({
      transactions: sampleTransactions,
      fixedCosts: sampleFixedCosts,
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.error).toBeDefined()
  })

  it('should include only future fixed costs (dueDay >= today)', async () => {
    let capturedPrompt = ''

    mockCreate.mockImplementation(async ({ messages }: any) => {
      capturedPrompt = messages?.[0]?.content ?? ''
      return {
        choices: [{ message: { content: 'report' } }],
      }
    })

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })

    const today = new Date().getDate()
    const futureDay = Math.min(today + 2, 28)
    const pastDay = Math.max(today - 2, 1)

    const fixedCosts = [
      { title: 'FutureCost', amount: 100, dueDay: futureDay },
      { title: 'PastCost', amount: 200, dueDay: pastDay },
    ]

    const req = makeRequest({
      transactions: sampleTransactions,
      fixedCosts,
    })

    await POST(req)

    expect(capturedPrompt).toContain('FutureCost')
    if (pastDay < today) {
      expect(capturedPrompt).not.toContain('PastCost')
    }
  })

  it('should return 401 when user is not authenticated', async () => {
    const { requireAuth } = await import('@/lib/auth/requireAuth')
    vi.mocked(requireAuth).mockResolvedValueOnce({
      ok: false,
      response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      }),
    })

    const req = makeRequest({
      transactions: sampleTransactions,
      fixedCosts: sampleFixedCosts,
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('should return 429 when rate limit is exceeded', async () => {
    const { checkRateLimit } = await import('@/lib/rateLimit')
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      reset: Date.now() + 60000,
    })

    const req = makeRequest({
      transactions: sampleTransactions,
      fixedCosts: sampleFixedCosts,
    })

    const res = await POST(req)
    expect(res.status).toBe(429)
  })
})
