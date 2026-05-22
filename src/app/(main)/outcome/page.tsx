'use client'

import { useMemo } from 'react'
import { getCategoryChartData } from '@/helper/chart'
import GoalChart from '@/components/income/GoalChart'
import { useFinanceStore } from '@/store/financeStore'
import { getOutcomeSummary } from '@/config/outcomeSummry'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import TransactionHistory from '@/components/transaction/TransactionHistory'

export default function OutcomePage() {
  const transactions = useFinanceStore((state) => state.transactions),
    outcome = useMemo(() => {
      return transactions.filter((t) => t.type === 'outcome')
    }, [transactions]),
    summaryItems = getOutcomeSummary(transactions),
    outcomeTransactions = transactions.filter((t) => t.type === 'outcome'),
    chartData = getCategoryChartData(outcomeTransactions)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-6">
        <SummaryCards items={summaryItems} />
      </div>
      <GoalChart value={75} />
      <CategoryChart
        title="Outcome Categories"
        totalLabel="Total Outcome"
        data={chartData}
      />
      <TransactionHistory items={outcome} />
    </>
  )
}
