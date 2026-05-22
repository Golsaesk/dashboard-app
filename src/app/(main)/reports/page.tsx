'use client'

import { getCategoryChartData } from '@/helper/chart'
import { useFinanceStore } from '@/store/financeStore'
import { getReportSummary } from '@/config/reportSummary'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import SpendingTrendChart from '@/components/reports/SpendingTrendChart'

export default function ReportsPage() {
  const transactions = useFinanceStore((state) => state.transactions),
    summaryItems = getReportSummary(transactions),
    chartData = getCategoryChartData(transactions)
  return (
    <div>
      <h2 className="px-6 py-4 text-lg font-bold text-black">
        Monthly Overview
      </h2>

      <div className="grid grid-cols-2 gap-4 px-6">
        <SummaryCards items={summaryItems} />
      </div>
      <div>
        <CategoryChart
          title="Financial Report"
          totalLabel="Total Transactions"
          data={chartData}
        />
      </div>
      <div>
        <SpendingTrendChart />
      </div>
    </div>
  )
}
