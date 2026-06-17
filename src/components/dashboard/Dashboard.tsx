'use client'

import { useEffect } from 'react'
import AiHighlight from './AiHighlight'
import Chart from '@/components/charts/Chart'
import GoalChart from '@/components/charts/GoalChart'
import { formatCurrency } from '@/lib/utils/currency'
import AiFinanceStatusCard from './AiFinanceStatusCard'
import { FeatureGate } from '@/components/auth/FeatureGate'
import Transaction from '@/components/transaction/Transaction'
import { getDashboardSummary } from '@/config/dashboardSummary'
import { getTotalIncome, getNetSaving } from '@/helper/finance'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { CardsGridSkeleton } from '@/components/skeleton/Skeleton'
import DailyReportButton from '@/components/dashboard/DailyReportButton'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

export default function Dashboard() {
  const {
    data: transactions = [],
    isLoading: loading,
    refetch: fetchTransactions,
  } = useTransactions()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const summaryItems = getDashboardSummary(transactions ?? []),
    totalIncome = getTotalIncome(transactions ?? []),
    netSaving = getNetSaving(transactions ?? []),
    savingsGoal = {
      title: 'Savings Progress',
      target_amount: Math.max(totalIncome, 1),
      saved_amount: Math.max(netSaving, 0),
    }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="card-shadow bg-card rounded-3xl p-4">
        <AiHighlight />
      </div>

      <FeatureGate variant="overlay" title="AI Features">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card-shadow bg-card rounded-3xl p-4">
            <AiFinanceStatusCard />
          </div>

          <div className="card-shadow bg-card flex h-full items-start rounded-3xl p-4">
            <div className="w-full space-y-3">
              <h3 className="text-foreground text-sm font-semibold">
                Daily Report
              </h3>
              <p className="text-muted-foreground text-xs">
                Send your financial summary directly to Telegram with AI
                insights.
              </p>
              <DailyReportButton />
            </div>
          </div>
        </div>
      </FeatureGate>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-5">
          {loading ? (
            <CardsGridSkeleton count={4} />
          ) : (
            <SummaryCards items={summaryItems} />
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
            <div className="card-shadow bg-card rounded-3xl p-5 md:p-6">
              <h2 className="text-foreground mb-1 text-base font-semibold">
                Cashflow
              </h2>
              <Chart transactions={transactions} />
            </div>

            <div className="card-shadow bg-card flex flex-col rounded-3xl p-5 md:p-6">
              <h2 className="text-foreground mb-2 text-base font-semibold">
                Savings Goal
              </h2>
              <GoalChart goal={savingsGoal} />
            </div>
          </div>

          <div className="card-shadow bg-card rounded-3xl p-5 md:p-6">
            <Transaction />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card-shadow-md bg-primary text-primary-foreground relative overflow-hidden rounded-3xl p-5">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-black/10" />

            <div className="relative z-10">
              <p className="text-primary-foreground/80 text-sm">
                Total Balance
              </p>
              <p className="mt-1 text-3xl font-bold">
                {formatCurrency(netSaving)}
              </p>

              <div className="text-primary-foreground/80 mt-5 flex items-center justify-between text-xs">
                <span>Income</span>
                <span className="text-primary-foreground font-medium">
                  {formatCurrency(totalIncome)}
                </span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white"
                  style={{
                    width: `${Math.min(
                      totalIncome > 0
                        ? Math.round((netSaving / totalIncome) * 100)
                        : 0,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="card-shadow bg-card rounded-3xl p-5">
            <h3 className="text-foreground mb-3 text-sm font-semibold">
              Quick Summary
            </h3>
            <ul className="space-y-3 text-sm">
              {summaryItems.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="text-foreground font-medium">
                    {item.total
                      ? item.total
                      : formatCurrency(Number(item.total) || 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
