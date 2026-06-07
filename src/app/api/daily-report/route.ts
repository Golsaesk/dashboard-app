import OpenAI from 'openai'
import { requireAuth } from '@/lib/auth/requireAuth'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rateLimit'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

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

  try {
    const { transactions, fixedCosts } = await req.json()

    const today = new Date()
    const todayDay = today.getDate()
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate()
    const daysLeft = daysInMonth - todayDay

    const totalIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((acc: number, t: any) => acc + t.amount, 0)

    const totalExpenses = transactions
      .filter((t: any) => t.type === 'outcome')
      .reduce((acc: number, t: any) => acc + t.amount, 0)

    const upcomingFixedCosts = fixedCosts
      .filter((fc: any) => fc.dueDay >= todayDay)
      .sort((a: any, b: any) => a.dueDay - b.dueDay)

    const totalUpcoming = upcomingFixedCosts.reduce(
      (acc: number, fc: any) => acc + fc.amount,
      0,
    )

    const availableAfterFixed = totalIncome - totalExpenses - totalUpcoming

    const prompt = `
You are a personal finance assistant. Write a friendly Telegram report in Persian.

Today: Day ${todayDay} (${daysLeft} days left)

Income: ${totalIncome}
Expenses: ${totalExpenses}
Remaining: ${totalIncome - totalExpenses}

Upcoming fixed costs:
${upcomingFixedCosts.map((fc: any) => `- ${fc.title}: ${fc.amount} (day ${fc.dueDay})`).join('\n')}

After fixed costs: ${availableAfterFixed}

Format:
1. ‌Brief summary of today's financial status
2. Income
3. Expenses
4. Recommendation 
`

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    })

    const reportText = response.choices[0]?.message?.content || ''

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: reportText,
        }),
      },
    )

    if (!telegramRes.ok) {
      const err = await telegramRes.json()
      throw new Error(JSON.stringify(err))
    }

    return NextResponse.json(
      { success: true, report: reportText },
      { headers: rateLimitHeaders(rl) },
    )
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
