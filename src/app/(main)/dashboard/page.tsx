import Chart from '@/components/dashboard/Chart'
import Transaction from '@/components/dashboard/Transaction'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { dashboardItems } from '@/data/dashboard/dashboard.config'

export default function DashboardPage() {
  return (
    <>
      <div className="p-6">
        <SummaryCards items={dashboardItems} />
      </div>
      <Chart />
      <Transaction />
    </>
  )
}
