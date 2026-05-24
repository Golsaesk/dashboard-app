'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import { useFinanceStore } from '@/store/financeStore'
import { getOutcomeSummary } from '@/config/outcomeSummry'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import TransactionHistory from '@/components/transaction/TransactionHistory'

export default function Outcome() {
  const transactions = useFinanceStore((state) => state.transactions)

  const outcomeTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'outcome'),
    [transactions],
  )

  const summaryItems = useMemo(
    () => getOutcomeSummary(transactions),
    [transactions],
  )

  const chartData = useMemo(
    () => getCategoryChartData(outcomeTransactions),
    [outcomeTransactions],
  )

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <SummaryCards items={summaryItems} />
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <CategoryChart
            title="Outcome Categories"
            totalLabel="Total Outcome"
            data={chartData}
          />
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <TransactionHistory items={outcomeTransactions} />
        </section>
      </div>
    </main>
  )
}
