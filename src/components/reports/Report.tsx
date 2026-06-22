'use client'

import { useMemo } from 'react'
import ReportPDFExport from './Reportpdfexport'
import { getCategoryChartData } from '@/helper/chart'
import { getReportSummary } from '@/config/reportSummary'
import ActiveFilterBadge from '../navbar/Activefilterbadge'
import { useFilterContext } from '@/providers/FilterContext'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import SpendingTrendChart from '@/components/charts/SpendingTrendChart'
import { TransactionListSkeleton } from '@/components/skeleton/Skeleton'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

export default function Report() {
  const { data: transactions = [], isLoading } = useTransactions()

  const {
    applyFilters,
    hasActiveFilter,
    hasActiveDateRange,
    dateRange,
    filter,
  } = useFilterContext()

  const isFiltered = hasActiveFilter || hasActiveDateRange

  const filteredTransactions = useMemo(
    () => applyFilters(transactions),
    [transactions, applyFilters],
  )

  const summaryItems = useMemo(
    () => getReportSummary(filteredTransactions),
    [filteredTransactions],
  )

  const chartData = useMemo(
    () => getCategoryChartData(filteredTransactions),
    [filteredTransactions],
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
        {isFiltered && <ActiveFilterBadge />}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Financial Report
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Overview and analytics of your transactions
            </p>
          </div>

          <ReportPDFExport
            transactions={filteredTransactions}
            dateRange={dateRange}
            filter={filter}
          />
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SummaryCards items={summaryItems} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {filteredTransactions.length === 0 && isFiltered ? (
            <div className="py-10 text-center">
              <p className="text-sm text-zinc-400">
                No transactions found for this filter.
              </p>
            </div>
          ) : (
            <CategoryChart
              title="Financial Report"
              totalLabel="Total Transactions"
              data={chartData}
            />
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SpendingTrendChart transactions={filteredTransactions} />
        </section>
      </div>
    </main>
  )
}
