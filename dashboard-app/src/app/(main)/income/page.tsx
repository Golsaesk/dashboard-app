import CategoryChart from '@/components/charts/CategoryChart'
import GoalChart from '@/components/income/GoalChart'
import IncomeHistory from '@/components/income/IncomeHistory'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { dashboardItems } from '@/data/dashboard/dashboard.config'
import { reportCategory } from '@/data/reports/reportCategory.conf'
import { transactionItems } from '@/data/transactions/transactionhistory.config'
export default function IncomePage() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-6">
        <SummaryCards items={dashboardItems} />
      </div>
      <GoalChart value={75} />
      <CategoryChart data={reportCategory} />
      <IncomeHistory items={transactionItems} />
    </>
  )
}
