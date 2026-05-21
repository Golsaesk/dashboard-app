'use client'

import { useMemo } from 'react'
import GoalChart from '@/components/income/GoalChart'
import { useFinanceStore } from '@/store/financeStore'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { dashboardItems } from '@/data/dashboard/dashboard.config'
import { reportCategory } from '@/data/reports/reportCategory.conf'
import TransactionHistory from '@/components/transaction/TransactionHistory'

export default function IncomePage() {
  const transactions = useFinanceStore((state) => state.transactions),
    income = useMemo(() => {
      return transactions.filter((t) => t.type === 'income')
    }, [transactions])
  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-6">
        <SummaryCards items={dashboardItems} />
      </div>
      <GoalChart value={75} />
      <CategoryChart data={reportCategory} />
      <TransactionHistory items={income} />
    </>
  )
}
