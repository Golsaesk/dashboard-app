import GoalChart from '@/components/income/GoalChart'
import CategoryChart from '@/components/charts/CategoryChart'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { dashboardItems } from '@/data/dashboard/dashboard.config'
import { reportCategory } from '@/data/reports/reportCategory.conf'
import TransactionHistory from '@/components/transaction/TransactionHistory'
import { transactionItems } from '@/data/transactions/transactionhistory.config'

export default function OutcomePage() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-6">
        <SummaryCards items={dashboardItems} />
      </div>
      <GoalChart value={75} />
      <CategoryChart data={reportCategory} />
      <TransactionHistory items={transactionItems} />
    </>
  )
}
