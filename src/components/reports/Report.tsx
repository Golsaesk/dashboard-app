'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import { getReportSummary } from '@/config/reportSummary'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import SpendingTrendChart from '@/components/charts/SpendingTrendChart'
import { TransactionListSkeleton } from '@/components/skeleton/Skeleton'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

export default function Report() {
  const { data: transactions = [], isLoading } = useTransactions()

  const summaryItems = useMemo(
    () => getReportSummary(transactions),
    [transactions],
  )

  const chartData = useMemo(
    () => getCategoryChartData(transactions),
    [transactions],
  )

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">
          <TransactionListSkeleton />
        </div>
      </main>
    )
  }

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
          <SpendingTrendChart transactions={transactions} />
        </section>
      </div>
    </main>
  )
}
