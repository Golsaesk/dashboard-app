import { z } from 'zod'
import OpenAI from 'openai'
import { requireAuth } from '@/lib/auth/requireAuth'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rateLimit'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'cost']),
  amount: z.number(),
  category: z.string().optional(),
  date: z.string().optional(),
})

const fixedCostSchema = z.object({
  title: z.string(),
  amount: z.number(),
  due_day: z.number().int().min(1).max(31),
})

const requestBodySchema = z.object({
  transactions: z.array(transactionSchema),
  fixedCosts: z.array(fixedCostSchema),
})

type RequestBody = z.infer<typeof requestBodySchema>
type Transaction = z.infer<typeof transactionSchema>
type FixedCost = z.infer<typeof fixedCostSchema>

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

async function getTelegramChatId(userId: string): Promise<string | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('profiles')
    .select('telegram_chat_id')
    .eq('id', userId)
    .single()

  if (error || !data?.telegram_chat_id) return null
  return String(data.telegram_chat_id)
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const rl = await checkRateLimit(auth.user.id, {
    endpoint: 'daily-report',
    limit: 3,
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
    const raw = await req.json()
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
  const telegramChatId = await getTelegramChatId(auth.user.id)
  if (!telegramChatId) {
    return NextResponse.json(
      {
        error:
          'Telegram chat ID not configured. Please set it in your profile.',
      },
      { status: 400 },
    )
  }

  try {
    const today = new Date()
    const todayDay = today.getDate()
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate()
    const daysLeft = daysInMonth - todayDay

    const totalIncome = transactions
      .filter((t: Transaction) => t.type === 'income')
      .reduce((acc: number, t: Transaction) => acc + t.amount, 0)

    const totalExpenses = transactions
      .filter((t: Transaction) => t.type === 'expense' || t.type === 'cost')
      .reduce((acc: number, t: Transaction) => acc + t.amount, 0)

    const upcomingFixedCosts = fixedCosts
      .filter((fc: FixedCost) => fc.due_day >= todayDay)
      .sort((a: FixedCost, b: FixedCost) => a.due_day - b.due_day)

    const totalUpcoming = upcomingFixedCosts.reduce(
      (acc: number, fc: FixedCost) => acc + fc.amount,
      0,
    )

    const availableAfterFixed = totalIncome - totalExpenses - totalUpcoming

    const prompt = `
You are a personal finance assistant. Write a friendly Telegram report in Persian.

Today: Day ${todayDay} (${daysLeft} days left in month)

Income: ${totalIncome}
Expenses: ${totalExpenses}
Remaining: ${totalIncome - totalExpenses}

Upcoming fixed costs:
${upcomingFixedCosts.map((fc: FixedCost) => `- ${fc.title}: ${fc.amount} (day ${fc.due_day})`).join('\n')}

After fixed costs: ${availableAfterFixed}

Format:
1. Brief summary of today's financial status
2. Income
3. Expenses
4. Recommendation
`

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    })

    const reportText = response.choices[0]?.message?.content ?? ''

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: reportText,
        }),
      },
    )

    if (!telegramRes.ok) {
      const err: unknown = await telegramRes.json()
      throw new Error(`Telegram error: ${JSON.stringify(err)}`)
    }

    return NextResponse.json(
      { success: true, report: reportText },
      { headers: rateLimitHeaders(rl) },
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error'
    console.error('[daily-report]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
