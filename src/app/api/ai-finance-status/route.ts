import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/requireAuth'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { transactions = [], fixedCosts = 0 } = body

    const totalIncome = transactions
      .filter((t: any) => t?.type === 'income')
      .reduce((a: number, b: any) => a + Number(b.amount || 0), 0)

    const totalExpense = transactions
      .filter((t: any) => t?.type === 'expense' || t?.type === 'outcome')
      .reduce((a: number, b: any) => a + Number(b.amount || 0), 0)

    const fixedCostTotal = Array.isArray(fixedCosts)
      ? fixedCosts.reduce((a: number, b: any) => a + Number(b.amount || 0), 0)
      : Number(fixedCosts || 0)

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

    const completion = await client.chat.completions.create({
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

    let data
    try {
      data = JSON.parse(raw)
    } catch {
      console.error('JSON parse error:', raw)
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
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: 'Server error', message: err?.message || 'unknown error' },
      { status: 500 },
    )
  }
}
