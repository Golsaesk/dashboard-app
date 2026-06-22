'use client'

import GoalCarousel from './GoalCarousel'
import { useMemo, useEffect, useState } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import GoalChart from '@/components/charts/GoalChart'
import { getIncomeSummary } from '@/config/incomeSummary'
import ActiveFilterBadge from '../navbar/Activefilterbadge'
import { useFilterContext } from '@/providers/FilterContext'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { useTransactions } from '@/features/finance/hooks/useTransaction'
import { useGoalsProgress } from '@/features/goals/hooks/useGoalsProgress'
import TransactionHistory from '@/components/transaction/TransactionHistory'
import {
  CardsGridSkeleton,
  PieChartSkeleton,
  TransactionListSkeleton,
  GoalSkeleton,
} from '@/components/skeleton/Skeleton'

export default function IncomePage() {
  const { data: transactions = [], isLoading: txLoading } = useTransactions(),
    { data: goals, isLoading: goalsLoading } = useGoalsProgress(),
    [mounted, setMounted] = useState(false),
    { applyFilters, hasActiveFilter, hasActiveDateRange } = useFilterContext(),
    isFiltered = hasActiveFilter || hasActiveDateRange,
    filteredAll = useMemo(
      () => applyFilters(transactions),
      [transactions, applyFilters],
    ),
    incomeTransactions = useMemo(
      () => filteredAll.filter((t) => t.type === 'income'),
      [filteredAll],
    ),
    summaryItems = useMemo(() => getIncomeSummary(filteredAll), [filteredAll]),
    chartData = useMemo(
      () => getCategoryChartData(incomeTransactions),
      [incomeTransactions],
    )
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {isFiltered && <ActiveFilterBadge />}

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {!mounted || txLoading ? (
            <CardsGridSkeleton count={2} />
          ) : (
            <SummaryCards items={summaryItems} />
          )}
        </section>

        <section className="space-y-4">
          {goalsLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <GoalSkeleton />
            </div>
          ) : (
            (!goals || goals.length === 0) && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <GoalChart />
              </div>
            )
          )}
        </section>

        <section className="space-y-4">
          <GoalCarousel isLoading={goalsLoading} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {!mounted ? (
            <PieChartSkeleton />
          ) : incomeTransactions.length === 0 && isFiltered ? (
            <div className="py-10 text-center">
              <p className="text-sm text-zinc-400">
                No income transactions in this period.
              </p>
            </div>
          ) : (
            <CategoryChart
              title="Income Categories"
              totalLabel="Total Income"
              data={chartData}
            />
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {!mounted ? (
            <TransactionListSkeleton />
          ) : (
            <TransactionHistory items={incomeTransactions} />
          )}
        </section>
      </div>
    </main>
  )
}
