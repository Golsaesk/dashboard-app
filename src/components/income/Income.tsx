'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import GoalChart from '@/components/charts/GoalChart'
import { useFinanceStore } from '@/store/financeStore'
import { getIncomeSummary } from '@/config/incomeSummary'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { useGoalsProgress } from '@/features/goals/hooks/useGoalsProgress'
import TransactionHistory from '@/components/transaction/TransactionHistory'

export default function IncomePage() {
  const transactions = useFinanceStore((state) => state.transactions),
    { data, isLoading } = useGoalsProgress(),
    incomeTransactions = useMemo(
      () => transactions.filter((t) => t.type === 'income'),
      [transactions],
    ),
    summaryItems = useMemo(
      () => getIncomeSummary(transactions),
      [transactions],
    ),
    chartData = useMemo(
      () => getCategoryChartData(incomeTransactions),
      [incomeTransactions],
    )

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SummaryCards items={summaryItems} />
        </section>

        <section className="space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Loading goals...
            </div>
          ) : (
            <>
              {(!data || data.length === 0) && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <GoalChart />
                </div>
              )}
              {data?.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <GoalChart goal={goal} />
                </div>
              ))}
            </>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <CategoryChart
            title="Income Categories"
            totalLabel="Total Income"
            data={chartData}
          />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <TransactionHistory items={incomeTransactions} />
        </section>
      </div>
    </main>
  )
}
