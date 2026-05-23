'use client'

import { getCategoryChartData } from '@/helper/chart'
import { useFinanceStore } from '@/store/financeStore'
import { getReportSummary } from '@/config/reportSummary'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import SpendingTrendChart from '@/components/reports/SpendingTrendChart'

export default function ReportsPage() {
  const transactions = useFinanceStore((state) => state.transactions),
    summaryItems = getReportSummary(transactions),
    chartData = getCategoryChartData(transactions)

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h2 className="text-xl font-bold text-zinc-900">Monthly Overview</h2>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <SummaryCards items={summaryItems} />
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <CategoryChart
            title="Financial Report"
            totalLabel="Total Transactions"
            data={chartData}
          />
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <SpendingTrendChart />
        </section>
      </div>
    </main>
  )
}
