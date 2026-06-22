'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import { getOutcomeSummary } from '@/config/outcomeSummry'
import ActiveFilterBadge from '../navbar/Activefilterbadge'
import { useFilterContext } from '@/providers/FilterContext'
import AddFixedCost from '@/components/outcome/AddFixedCost'
import CategoryChart from '@/components/charts/CategoryChart'
import FixedCostsList from '@/components/outcome/FixedCostsList'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import MonthlyOutcomeCard from '@/components/outcome/MonthlyOutcomeCard'
import { useTransactions } from '@/features/finance/hooks/useTransaction'
import TransactionHistory from '@/components/transaction/TransactionHistory'

export default function Outcome() {
  const { data: transactions = [] } = useTransactions(),
    { applyFilters, hasActiveFilter, hasActiveDateRange } = useFilterContext(),
    isFiltered = hasActiveFilter || hasActiveDateRange,
    filteredAll = useMemo(
      () => applyFilters(transactions),
      [transactions, applyFilters],
    ),
    outcomeTransactions = useMemo(
      () =>
        filteredAll.filter((t) => t.type === 'expense' || t.type === 'cost'),
      [filteredAll],
    ),
    summaryItems = useMemo(() => getOutcomeSummary(filteredAll), [filteredAll]),
    chartData = useMemo(
      () => getCategoryChartData(outcomeTransactions),
      [outcomeTransactions],
    )

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {isFiltered && <ActiveFilterBadge />}

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SummaryCards items={summaryItems} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {outcomeTransactions.length === 0 && isFiltered ? (
            <div className="py-10 text-center">
              <p className="text-sm text-zinc-400">
                No expense transactions in this period.
              </p>
            </div>
          ) : (
            <CategoryChart
              title="Expense Categories"
              totalLabel="Total Expenses"
              data={chartData}
            />
          )}
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
