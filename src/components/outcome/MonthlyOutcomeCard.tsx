'use client'

import { useMemo } from 'react'
import { useTransactions } from '@/features/finance/hooks/useTransaction'
import { formatCurrency } from '@/lib/utils/currency'

export default function MonthlyOutcomeCard() {
  const { data: transactions = [] } = useTransactions()
  const total = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense' || t.type === 'cost')
        .reduce((acc, t) => acc + Number(t.amount || 0), 0),
    [transactions],
  )

  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-zinc-500">Monthly Expense</p>
      <p className="text-xl font-semibold text-red-500">
        {formatCurrency(total)}
      </p>
    </div>
  )
}
