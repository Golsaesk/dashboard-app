'use client'
import Chart from '@/components/charts/Chart'
import { useFinanceStore } from '@/store/financeStore'
import Transaction from '@/components/transaction/Transaction'
import { getDashboardSummary } from '@/config/dashboardSummary'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'

export default function Dashboard() {
  const transactions = useFinanceStore((state) => state.transactions),
    summaryItems = getDashboardSummary(transactions)

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
          <SummaryCards items={summaryItems} />
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
          <Chart />
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
          <Transaction />
        </section>
      </div>
    </main>
  )
}
