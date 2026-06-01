'use client'

import { useFinanceStore } from '@/store/financeStore'
import { Transaction } from '@/type/transaction'

export default function MonthlyOutcomeCard() {
  const total = useFinanceStore((state) =>
    (state.transactions ?? [])
      .filter((t) => t.type === 'outcome')
      .reduce((acc: number, item: Transaction) => {
        return acc + Number(item.amount || 0)
      }, 0),
  )

  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-zinc-500">Monthly Outcome</p>

      <p className="text-xl font-semibold text-red-500">
        ${total.toLocaleString()}
      </p>
    </div>
  )
}
