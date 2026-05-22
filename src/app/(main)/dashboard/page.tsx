'use client'
import Chart from '@/components/dashboard/Chart'
import { useFinanceStore } from '@/store/financeStore'
import Transaction from '@/components/dashboard/Transaction'
import { getDashboardSummary } from '@/config/dashboardSummary'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'

export default function DashboardPage() {
  const transactions = useFinanceStore((state) => state.transactions),
    summaryItems = getDashboardSummary(transactions)

  return (
    <>
      <div className="p-6">
        <SummaryCards items={summaryItems} />
      </div>
      <Chart />
      <Transaction />
    </>
  )
}
