import CategoryChart from '@/components/reports/CategoryChart'
import { reportItems } from '@/data/reports/reportCarts.config'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import SpendingTrendChart from '@/components/reports/SpendingTrendChart'

export default function ReportsPage() {
  return (
    <div>
      <h2 className="px-6 py-4 text-lg font-bold text-black">
        Monthly Overview
      </h2>

      <div className="grid grid-cols-2 gap-4 px-6">
        <SummaryCards items={reportItems} />
      </div>
      <div>
        <CategoryChart />
      </div>
      <div>
        <SpendingTrendChart />
      </div>
    </div>
  )
}
