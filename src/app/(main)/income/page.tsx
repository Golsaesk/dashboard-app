'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import GoalChart from '@/components/income/GoalChart'
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
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <SummaryCards items={summaryItems} />
        </section>
        <section className="space-y-6">
          {isLoading ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-2xl">
              Loading goals...
            </div>
          ) : (
            <>
              {(!data || data.length === 0) && (
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
                  <GoalChart />
                </div>
              )}
              {data?.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl"
                >
                  <GoalChart goal={goal} saved={goal.saved} />
                </div>
              ))}
            </>
          )}
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <CategoryChart
            title="Income Categories"
            totalLabel="Total Income"
            data={chartData}
          />
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <TransactionHistory items={incomeTransactions} />
        </section>
      </div>
    </main>
  )
}
