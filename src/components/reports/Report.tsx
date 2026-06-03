'use client'

import { getCategoryChartData } from '@/helper/chart'
import { useFinanceStore } from '@/store/financeStore'
import { getReportSummary } from '@/config/reportSummary'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import SpendingTrendChart from '@/components/charts/SpendingTrendChart'

export default function Report() {
  const transactions = useFinanceStore((state: any) => state.transactions)
  const summaryItems = getReportSummary(transactions ?? [])
  const chartData = getCategoryChartData(transactions ?? [])

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Monthly Overview
        </h2>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SummaryCards items={summaryItems} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <CategoryChart
            title="Financial Report"
            totalLabel="Total Transactions"
            data={chartData}
          />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SpendingTrendChart transactions={transactions ?? []} />
        </section>
      </div>
    </main>
  )
}
