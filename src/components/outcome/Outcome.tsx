'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import { useFinanceStore } from '@/store/financeStore'
import { getOutcomeSummary } from '@/config/outcomeSummry'
import AddFixedCost from '@/components/outcome/AddFixedCost'
import CategoryChart from '@/components/charts/CategoryChart'
import FixedCostsList from '@/components/outcome/FixedCostsList'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import MonthlyOutcomeCard from '@/components/outcome/MonthlyOutcomeCard'
import TransactionHistory from '@/components/transaction/TransactionHistory'

export default function Outcome() {
  const transactions = useFinanceStore((state: any) => state.transactions)

  const outcomeTransactions = useMemo(
    () => (transactions ?? []).filter((t: any) => t.type === 'outcome'),
    [transactions],
  )

  const summaryItems = useMemo(
    () => getOutcomeSummary(transactions ?? []),
    [transactions],
  )

  const chartData = useMemo(
    () => getCategoryChartData(outcomeTransactions),
    [outcomeTransactions],
  )

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SummaryCards items={summaryItems} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <CategoryChart
            title="Outcome Categories"
            totalLabel="Total Outcome"
            data={chartData}
          />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <TransactionHistory items={outcomeTransactions} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl space-y-6">
            <MonthlyOutcomeCard />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AddFixedCost />
              <FixedCostsList />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
