import { describe, it, expect, vi, beforeEach } from 'vitest'

const { createMock } = vi.hoisted(() => {
  return { createMock: vi.fn() }
})

vi.mock('openai', () => {
  const OpenAI = function (this: any) {
    this.chat = {
      completions: {
        create: createMock,
      },
    }
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
          { type: 'outcome', amount: 1000 },
        ],
        fixedCosts: 500,
      }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(data.score).toBeDefined()
    expect(data.summary).toBeDefined()
  })

  it('should return status 500 when OpenAI returns invalid JSON', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'invalid json' } }],
    })

    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        transactions: [],
        fixedCosts: 0,
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})
