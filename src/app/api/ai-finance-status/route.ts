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
      { error: 'Too many requests — please wait a moment' },
      {
        status: 429,
        headers: { 'Retry-After': '60', ...rateLimitHeaders(rl) },
      },
    )
  }

  let body: RequestBody
  try {
    const raw = await req.json().catch(() => null)
    if (!raw) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const parsed = requestBodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 },
      )
    }
    body = parsed.data
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { transactions, fixedCosts } = body

  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    const toNumber = (v: number | string): number => Number(v) || 0

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + toNumber(t.amount), 0)

    const totalExpense = transactions
      .filter(
        (t) =>
          t.type === 'expense' || t.type === 'outcome' || t.type === 'cost',
      )
      .reduce((acc, t) => acc + toNumber(t.amount), 0)

    const fixedCostTotal = Array.isArray(fixedCosts)
      ? fixedCosts.reduce((acc, fc) => acc + toNumber(fc.amount), 0)
      : toNumber(fixedCosts)

    const balance = totalIncome - totalExpense - fixedCostTotal

    const prompt = `
You are a financial AI assistant.

Analyze this user's financial data:
- Total income: ${totalIncome}
- Total expense: ${totalExpense}
- Fixed costs: ${fixedCostTotal}
- Balance: ${balance}

Return ONLY valid JSON:
{
  "score": number between -100 and 100,
  "summary": string,
  "insight": string,
  "suggestion": string
}
`

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Return ONLY valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    })

    const raw = completion?.choices?.[0]?.message?.content

    if (!raw) {
      return NextResponse.json(
        { score: 0, summary: 'Empty AI response', insight: '', suggestion: '' },
        { status: 500 },
      )
    }

    let data: AiFinanceStatus
    try {
      data = JSON.parse(raw) as AiFinanceStatus
    } catch {
      console.error('[ai-finance-status] JSON parse error:', raw)
      return NextResponse.json(
        {
          score: 0,
          summary: 'AI response parsing failed',
          insight: '',
          suggestion: '',
        },
        { status: 500 },
      )
    }

    return NextResponse.json(data, { headers: rateLimitHeaders(rl) })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    console.error('[ai-finance-status]', message)
    return NextResponse.json(
      { error: 'Server error', message },
      { status: 500 },
    )
  }
}
