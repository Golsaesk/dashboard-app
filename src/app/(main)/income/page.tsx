'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import GoalChart from '@/components/income/GoalChart'
import { useFinanceStore } from '@/store/financeStore'
import { getIncomeSummary } from '@/config/incomeSummary'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import TransactionHistory from '@/components/transaction/TransactionHistory'
import { useGoalsProgress } from '@/features/goals/hooks/useGoalsProgress'

export default function IncomePage() {
  const transactions = useFinanceStore((state) => state.transactions),
    summaryItems = getIncomeSummary(transactions),
    income = useMemo(() => {
      return transactions.filter((t) => t.type === 'income')
    }, [transactions]),
    incomeTransactions = transactions.filter((t) => t.type === 'income'),
    chartData = getCategoryChartData(incomeTransactions),
    { data } = useGoalsProgress()

  if (!data) return null

  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-6">
        <SummaryCards items={summaryItems} />
      </div>
      {data.map((goal) => (
        <GoalChart key={goal.id} goal={goal} saved={goal.saved} />
      ))}
      <CategoryChart
        title="Income Categories"
        totalLabel="Total Income"
        data={chartData}
      />
      <TransactionHistory items={income} />
    </>
  )
}
