import { describe, it, expect, vi, beforeEach } from 'vitest'

const createMock = vi.fn()
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
  return {
    default: class OpenAI {
      chat = {
        completions: {
          create: createMock,
        },
      }
    },
  }
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
              score: 75,
              summary: 'Healthy financial status',
              insight: 'Income > expenses',
              suggestion: 'Increase savings',
            }),
          },
        },
      ],
    })
  })
  it('returns structured AI response', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        transactions: [
          { type: 'income', amount: 5000, category: 'salary' },
          { type: 'expense', amount: 1000, category: 'food' },
        ],
        fixedCosts: 500,
      }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)

    expect(data).toHaveProperty('score')
    expect(data).toHaveProperty('summary')
    expect(data).toHaveProperty('insight')
    expect(data).toHaveProperty('suggestion')
  })

  it('returns fallback when AI returns invalid JSON', async () => {
    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'invalid json here',
          },
        },
      ],
    })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        transactions: [],
        fixedCosts: 0,
      }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200) // ⚠️ IMPORTANT: fallback returns 200 now
    expect(data).toHaveProperty('score')
    expect(data).toHaveProperty('summary')
    expect(data.summary).toContain('Fallback')
  })

  it('handles empty AI response', async () => {
    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: null,
          },
        },
      ],
    })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        transactions: [],
        fixedCosts: 0,
      }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.summary).toBe('Empty AI response')
  })
})
