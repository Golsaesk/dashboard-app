'use client'

import Chart from '@/components/charts/Chart'
import AiFinanceStatusCard from './AiFinanceStatusCard'
import { FeatureGate } from '@/components/auth/FeatureGate'
import Transaction from '@/components/transaction/Transaction'
import { getDashboardSummary } from '@/config/dashboardSummary'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { CardsGridSkeleton } from '@/components/skeleton/Skeleton'
import DailyReportButton from '@/components/dashboard/DailyReportButton'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

export default function Dashboard() {
  const { data: transactions = [], isLoading } = useTransactions(),
    summaryItems = getDashboardSummary(transactions)

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="w-full">
          <FeatureGate variant="overlay" title="AI Features">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <AiFinanceStatusCard />
              </div>

              <div className="flex h-full items-start rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="w-full space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    Daily Report
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Send your financial summary directly to Telegram with AI
                    insights.
                  </p>
                  <DailyReportButton />
                </div>
              </div>
            </div>
          </FeatureGate>
        </div>

        {isLoading ? (
          <CardsGridSkeleton count={4} />
        ) : (
          <SummaryCards items={summaryItems} />
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-white">
            Overview
          </h2>

          <Chart transactions={transactions} />
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-white">
            Recent Transactions
          </h2>
          <Transaction />
        </div>
      </div>
    </main>
  )
}
