'use client'

import Chart from '@/components/charts/Chart'
import { useFinanceStore } from '@/store/financeStore'
import { FeatureGate } from '@/components/auth/FeatureGate'
import Transaction from '@/components/transaction/Transaction'
import { getDashboardSummary } from '@/config/dashboardSummary'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import DailyReportButton from '@/components/dashboard/DailyReportButton'

export default function Dashboard() {
  const transactions = useFinanceStore((state) => state.transactions),
    summaryItems = getDashboardSummary(transactions)

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <FeatureGate>
            <DailyReportButton />
          </FeatureGate>
        </div>

        <SummaryCards items={summaryItems} />

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-white">
            Overview
          </h2>
          <Chart />
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
