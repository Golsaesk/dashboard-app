
import { reportItems } from '@/data/reports/reportCarts.config'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import SpendingTrendChart from '@/components/reports/SpendingTrendChart'
import CategoryChart from '@/components/charts/CategoryChart'
import { reportCategory } from '@/data/reports/reportCategory.conf'

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
        <CategoryChart data={reportCategory} />
      </div>
      <div>
        <SpendingTrendChart />
      </div>
    </div>
  )
}
