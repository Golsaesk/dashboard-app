import { describe, it, expect, vi, beforeEach } from 'vitest'

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }))

vi.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    ok: true,
    user: { id: 'test-user-id', email: 'test@example.com' },
    response: null,
  }),
}))

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 9,
    reset: Date.now() + 60000,
  }),
  rateLimitHeaders: vi.fn().mockReturnValue({}),
}))

vi.mock('openai', () => {
  const OpenAI = function (this: any) {
    this.chat = { completions: { create: createMock } }
  }
  return { default: OpenAI }
})

import { POST } from '@/app/api/ai-finance-status/route'

describe('POST /api/ai-finance-status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              score: 70,
              summary: 'Your financial status is good',
              insight: 'Income is higher than expenses',
              suggestion: 'Try to save more',
            }),
          },
        },
      ],
    })
  })

  it('should return score and summary', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        transactions: [
          { type: 'income', amount: 5000 },
          { type: 'expense', amount: 1000 },
        ],
        fixedCosts: 500,
      }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.score).toBeDefined()
    expect(data.summary).toBeDefined()
  })

  it('should return status 500 when OpenAI returns invalid JSON', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'invalid json' } }],
    })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ transactions: [], fixedCosts: 0 }),
    })

    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})
