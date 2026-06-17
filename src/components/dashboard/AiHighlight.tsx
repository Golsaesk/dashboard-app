'use client'

import { useEffect, useState } from 'react'
import { useTransactions } from '@/features/finance/hooks/useTransaction'
import { Sparkles, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'

export default function AiHighlight() {
  const { data: transactions = [] } = useTransactions(),
    [loading, setLoading] = useState(true),
    [insight, setInsight] = useState<string | null>(null)

  useEffect(() => {
    if (!transactions.length) {
      setLoading(false)
      return
    }

    const timer = setTimeout(() => {
      const total = transactions.reduce((sum, t) => sum + t.amount, 0)

      if (total > 1000) {
        setInsight(
          'You are spending more than usual this period. Consider reviewing your top categories.',
        )
      } else {
        setInsight('Your spending is stable. No unusual patterns detected.')
      }

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [transactions])

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        AI is analyzing your spending...
      </div>
    )
  }

  if (!insight) {
    return (
      <p className="text-muted-foreground text-sm">
        Add transactions to see AI insights
      </p>
    )
  }

  const isPositive = !insight.includes('more than usual')

  return (
    <div className="flex items-start gap-3">
      <Sparkles className="text-primary mt-0.5 h-4 w-4" />

      <div className="flex-1">
        <p className="text-primary text-xs font-medium">AI Insight</p>
        <p className="text-foreground/80 text-sm">{insight}</p>
      </div>

      {isPositive ? (
        <TrendingUp className="text-primary h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-500" />
      )}
    </div>
  )
}
