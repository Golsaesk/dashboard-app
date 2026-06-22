'use client'

import { useMemo } from 'react'
import AiHighlight from './AiHighlight'
import Chart from '@/components/charts/Chart'
import GoalChart from '@/components/charts/GoalChart'
import { formatCurrency } from '@/lib/utils/currency'
import AiFinanceStatusCard from './AiFinanceStatusCard'
import ActiveFilterBadge from '../navbar/Activefilterbadge'
import { FeatureGate } from '@/components/auth/FeatureGate'
import { useFilterContext } from '@/providers/FilterContext'
import UpcomingFixedCosts from '../outcome/UpcomingFixedCosts'
import Transaction from '@/components/transaction/Transaction'
import { getTotalIncome, getNetSaving } from '@/helper/finance'
import { getDashboardSummary } from '@/config/dashboardSummary'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { CardsGridSkeleton } from '@/components/skeleton/Skeleton'
import DailyReportButton from '@/components/dashboard/DailyReportButton'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

export default function Dashboard() {
  const { data: transactions = [], isLoading: loading } = useTransactions(),
    { applyFilters, hasActiveFilter, hasActiveDateRange } = useFilterContext(),
    filteredTransactions = useMemo(
      () => applyFilters(transactions),
      [transactions, applyFilters],
    ),
    summaryItems = getDashboardSummary(filteredTransactions),
    totalIncome = getTotalIncome(filteredTransactions),
    netSaving = getNetSaving(filteredTransactions),
    savingsGoal = {
      title: 'Savings Progress',
      target_amount: Math.max(totalIncome, 1),
      saved_amount: Math.max(netSaving, 0),
    },
    isFiltered = hasActiveFilter || hasActiveDateRange

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
