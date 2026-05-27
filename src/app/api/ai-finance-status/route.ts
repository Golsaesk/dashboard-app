import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
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
  "summary": string (1 sentence),
  "insight": string (short analysis),
  "suggestion": string (practical advice)
}

Rules:
- Output ONLY JSON
- No markdown
- No extra text
- Keep it concise and useful
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a strict JSON generator. You always return valid JSON only.',
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
