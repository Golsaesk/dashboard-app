import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    const { transactions, fixedCosts } = await req.json()

    const totalIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((a: number, b: any) => a + b.amount, 0)

    const totalExpense = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((a: number, b: any) => a + b.amount, 0)

    const balance = totalIncome - totalExpense - fixedCosts

    const prompt = `
You are a financial AI assistant.

Analyze this user's financial data:

- Total income: ${totalIncome}
- Total expense: ${totalExpense}
- Fixed costs: ${fixedCosts}
- Balance: ${balance}

Return ONLY valid JSON in this format:
{
  "score": number between -100 and 100,
  "summary": string,
  "insight": string,
  "suggestion": string
}

Rules:
- Output ONLY JSON
- No markdown
- No extra text
`

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Return ONLY valid JSON. No explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
    })

    const raw = completion.choices[0]?.message?.content || '{}'

    let data
    try {
      data = JSON.parse(raw)
    } catch (e) {
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

    return NextResponse.json(data)
  } catch (err: any) {
    console.error(err)

    return NextResponse.json(
      {
        error: 'Server error',
        message: err?.message || 'unknown error',
      },
      { status: 500 },
    )
  }
}
