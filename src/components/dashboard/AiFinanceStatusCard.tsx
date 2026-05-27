'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
  Brain,
} from 'lucide-react'
import { useFinanceStore } from '@/store/financeStore'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface AiFinanceResponse {
  summary: string
  score: number
  insight: string
  suggestion: string
}

export default function AiFinanceStatusCard() {
  const { transactions, fixedCosts } = useFinanceStore()

  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<AiFinanceResponse | null>(null)

  async function fetchAnalysis() {
    // اگر هیچ داده‌ای نیست → نزن به API
    if (!transactions?.length) {
      setStatus('idle')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/ai-finance-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, fixedCosts }),
      })

      if (!res.ok) throw new Error('Request failed')

      const json = await res.json()

      setData(json)
      setStatus('success')
    } catch (e) {
      setStatus('error')
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [transactions, fixedCosts])

  const scoreColor =
    (data?.score ?? 0) > 20
      ? 'text-emerald-500'
      : (data?.score ?? 0) < -20
        ? 'text-red-500'
        : 'text-yellow-500'

  // -------------------------
  // 🧠 EMPTY STATE (DEFAULT UI)
  // -------------------------
  if (!transactions?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <Brain className="h-8 w-8 text-emerald-500" />

        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          AI Financial Assistant
        </h3>

        <p className="text-xs text-zinc-500">
          Add your transactions and expenses to get AI-powered financial insights
        </p>

        <p className="text-xs text-emerald-600">
          “I’ll analyze your money habits instantly.”
        </p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          AI Financial Health
        </h2>

        <button
          onClick={fetchAnalysis}
          className="text-xs text-emerald-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          AI is analyzing your finances...
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          Failed to analyze data. Try again.
        </div>
      )}

      {/* Success */}
      {status === 'success' && data && (
        <div className="space-y-3">
          {/* Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Financial Score</span>

            <div
              className={`flex items-center gap-1 text-lg font-bold ${scoreColor}`}
            >
              {data.score > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {data.score}
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {data.summary}
          </p>

          {/* Insight */}
          <div className="rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <span className="font-medium">Insight:</span> {data.insight}
          </div>

          {/* Suggestion */}
          <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <span className="font-medium">Suggestion:</span>{' '}
            {data.suggestion}
          </div>
        </div>
      )}
    </div>
  )
}