import { z } from 'zod'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/requireAuth'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const transactionSchema = z.object({
  type: z.string(),
  amount: z.union([z.number(), z.string()]),
  category: z.string().optional(),
})

const fixedCostSchema = z.object({
  amount: z.union([z.number(), z.string()]),
})

const requestBodySchema = z.object({
  transactions: z.array(transactionSchema).default([]),
  fixedCosts: z.union([z.array(fixedCostSchema), z.number()]).default([]),
})

type RequestBody = z.infer<typeof requestBodySchema>

type AiFinanceStatus = {
  score: number
  summary: string
  insight: string
  suggestion: string
}
const toNumber = (v: number | string): number =>
  typeof v === 'number' ? v : Number(v) || 0

function isExpense(type: string) {
  return type === 'expense' || type === 'cost' || type === 'outcome'
}

type NormalizedFixedCost = {
  amount: number | string
}

function normalizeFixedCosts(
  fixedCosts: number | { amount: string | number }[],
): NormalizedFixedCost[] {
  return Array.isArray(fixedCosts) ? fixedCosts : [{ amount: fixedCosts }]
}

function buildFinancialContext(
  transactions: any[],
  fixedCosts: NormalizedFixedCost[],
) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + toNumber(t.amount), 0)

  const expense = transactions
    .filter((t) => isExpense(t.type))
    .reduce((acc, t) => acc + toNumber(t.amount), 0)

  const fixed = fixedCosts.reduce((acc, f) => acc + toNumber(f.amount), 0)

  const balance = income - expense - fixed

  const spendingByCategory: Record<string, number> = {}

  transactions.forEach((t) => {
    if (isExpense(t.type) && t.category) {
      spendingByCategory[t.category] =
        (spendingByCategory[t.category] || 0) + toNumber(t.amount)
    }
  })

  const topSpendingCategory =
    Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    'unknown'

  const burnRate = income > 0 ? expense / income : 0

  return {
    totals: {
      income,
      expense,
      fixed,
      balance,
    },

    insights: {
      topSpendingCategory,
      categories: spendingByCategory,
    },

    signals: {
      negativeBalance: balance < 0,
      highBurnRate: burnRate > 0.7,
      burnRate,
    },
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const rl = await checkRateLimit(auth.user.id, {
    endpoint: 'ai-finance-status',
    limit: 10,
    windowSeconds: 60,
  })

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': '60', ...rateLimitHeaders(rl) },
      },
    )
  }
  const raw = await req.json().catch(() => null)

  if (!raw) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = requestBodySchema.safeParse(raw)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid body',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  const { transactions, fixedCosts } = parsed.data
  const normalizedFixedCosts = normalizeFixedCosts(fixedCosts)
  const context = buildFinancialContext(transactions, normalizedFixedCosts)

  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: 'https://api.groq.com/openai/v1',
  })

  const prompt = `
You are a financial reasoning engine.

Use this structured context:

${JSON.stringify(context, null, 2)}

TASK:
- Analyze financial health
- Detect risks or anomalies
- Provide insights
- Give actionable suggestion

OUTPUT STRICT JSON:
{
  "score": number (-100 to 100),
  "summary": string,
  "insight": string,
  "suggestion": string
}
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Return ONLY valid JSON. No extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    })

    const rawResponse = completion.choices?.[0]?.message?.content

    if (!rawResponse) {
      return NextResponse.json(
        {
          score: 0,
          summary: 'Empty AI response',
          insight: '',
          suggestion: '',
        },
        { status: 500 },
      )
    }

    let data: AiFinanceStatus

    try {
      data = JSON.parse(rawResponse)
    } catch (err) {
      console.error('[AI parse error]', rawResponse)

      // fallback (safe)
      return NextResponse.json({
        score: context.signals.negativeBalance ? -40 : 20,
        summary: 'Fallback analysis (parse error)',
        insight: `Top category: ${context.insights.topSpendingCategory}`,
        suggestion: context.signals.highBurnRate
          ? 'Reduce spending immediately'
          : 'Spending is stable',
      })
    }

    return NextResponse.json(data, {
      headers: rateLimitHeaders(rl),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    console.error('[ai-finance-status]', message)

    return NextResponse.json(
      { error: 'Server error', message },
      { status: 500 },
    )
  }
}
