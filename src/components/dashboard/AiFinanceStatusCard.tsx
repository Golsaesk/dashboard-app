'use client'

import AiHighlight from './AiHighlight'
import { useEffect, useState, useCallback } from 'react'
import { useTransactions } from '@/features/finance/hooks/useTransaction'
import { useFixedCosts } from '@/features/fixedCosts/hooks/useFixedCosts'
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
  Brain,
} from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface AiFinanceResponse {
  summary: string
  score: number
  insight: string
  suggestion: string
}

export default function AiFinanceStatusCard() {
  const { data: transactions = [] } = useTransactions(),
    { data: fixedCosts = [] } = useFixedCosts(),
    [status, setStatus] = useState<Status>('idle'),
    [data, setData] = useState<AiFinanceResponse | null>(null)

  const fetchAnalysis = useCallback(async () => {
    if (!transactions.length) {
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
    } catch {
      setStatus('error')
    }
  }, [transactions, fixedCosts])

  useEffect(() => {
    fetchAnalysis()
  }, [fetchAnalysis])

  const scoreColor =
    (data?.score ?? 0) > 20
      ? 'text-emerald-500'
      : (data?.score ?? 0) < -20
        ? 'text-red-500'
        : 'text-yellow-500'

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <Brain className="h-8 w-8 text-emerald-500" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          AI Financial Assistant
        </h3>
        <p className="text-xs text-zinc-500">
          Add your transactions to unlock AI insights
        </p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <AiHighlight />
      <div className="flex items-center justify-between">
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

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          AI is analyzing your finances...
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          Failed to analyze data. Try again.
        </div>
      )}

      {status === 'success' && data && (
        <div className="space-y-3">
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

          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {data.summary}
          </p>

          <div className="rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <span className="font-medium">Insight:</span> {data.insight}
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <span className="font-medium">Suggestion:</span> {data.suggestion}
          </div>
        </div>
      )}
    </div>
  )
}
