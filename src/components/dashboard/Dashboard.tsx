'use client'

import { useEffect, useMemo } from 'react'

import AiHighlight from './AiHighlight'
import AiFinanceStatusCard from './AiFinanceStatusCard'

import Chart from '@/components/charts/Chart'
import GoalChart from '@/components/charts/GoalChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import Transaction from '@/components/transaction/Transaction'
import DailyReportButton from '@/components/dashboard/DailyReportButton'
import ActiveFilterBadge from '../navbar/Activefilterbadge'
import { FeatureGate } from '@/components/auth/FeatureGate'
import { CardsGridSkeleton } from '@/components/skeleton/Skeleton'

import { useTransactions } from '@/features/finance/hooks/useTransaction'
import { useFilterContext } from '@/providers/FilterContext'

import { formatCurrency } from '@/lib/utils/currency'
import { getDashboardSummary } from '@/config/dashboardSummary'
import { getTotalIncome, getNetSaving } from '@/helper/finance'
import UpcomingFixedCosts from '../outcome/UpcomingFixedCosts'

export default function Dashboard() {
  const {
    data: transactions = [],
    isLoading: loading,
    refetch,
  } = useTransactions()

  const { applyFilters, hasActiveFilter, hasActiveDateRange } =
    useFilterContext()

  useEffect(() => {
    refetch()
  }, [refetch])

  const filteredTransactions = useMemo(
    () => applyFilters(transactions),
    [transactions, applyFilters],
  )

  const summaryItems = getDashboardSummary(filteredTransactions)

  const totalIncome = getTotalIncome(filteredTransactions)

  const netSaving = getNetSaving(filteredTransactions)

  const savingsGoal = {
    title: 'Savings Progress',
    target_amount: Math.max(totalIncome, 1),
    saved_amount: Math.max(netSaving, 0),
  }

  const isFiltered = hasActiveFilter || hasActiveDateRange

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
      {isFiltered && <ActiveFilterBadge />}

      <section className="card-shadow bg-card rounded-3xl p-6">
        <AiHighlight />
      </section>

      <FeatureGate variant="overlay" title="AI Features">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card-shadow bg-card rounded-3xl p-6">
            <AiFinanceStatusCard />
          </div>

          <div className="card-shadow bg-card rounded-3xl p-6">
            <div className="space-y-3">
              <h3 className="text-foreground text-sm font-semibold">
                Daily Report
              </h3>

              <p className="text-muted-foreground text-sm">
                Send your financial summary directly to Telegram with AI
                insights.
              </p>

              <DailyReportButton />
            </div>
          </div>
        </section>
      </FeatureGate>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          {loading ? (
            <CardsGridSkeleton count={4} />
          ) : (
            <SummaryCards items={summaryItems} />
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="card-shadow bg-card rounded-3xl p-6">
              <h2 className="text-foreground mb-4 text-base font-semibold">
                Cashflow
              </h2>

              <Chart transactions={filteredTransactions} />
            </div>

            <div className="card-shadow bg-card rounded-3xl p-6">
              <h2 className="text-foreground mb-4 text-base font-semibold">
                Savings Goal
              </h2>

              <GoalChart goal={savingsGoal} />
            </div>
          </div>

          <div className="card-shadow bg-card rounded-3xl p-6">
            <Transaction />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="card-shadow-md bg-primary text-primary-foreground relative overflow-hidden rounded-3xl p-6">
            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-black/10" />

            <div className="relative z-10">
              <p className="text-primary-foreground/80 text-sm">
                {isFiltered ? 'Filtered Balance' : 'Total Balance'}
              </p>

              <p className="mt-2 text-4xl font-bold">
                {formatCurrency(netSaving)}
              </p>

              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-primary-foreground/70">Income</span>

                <span className="font-semibold">
                  {formatCurrency(totalIncome)}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      totalIncome > 0 ? (netSaving / totalIncome) * 100 : 0,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <UpcomingFixedCosts />

          <div className="card-shadow bg-card rounded-3xl p-6">
            <h3 className="text-foreground mb-4 text-sm font-semibold">
              Quick Summary
            </h3>

            <ul className="space-y-4">
              {summaryItems.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-muted-foreground text-sm">
                    {item.name}
                  </span>

                  <span className="text-foreground text-sm font-semibold">
                    {typeof item.total === 'number'
                      ? formatCurrency(item.total)
                      : item.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}
