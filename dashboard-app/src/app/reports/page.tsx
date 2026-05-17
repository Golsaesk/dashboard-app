import Navbar from '@/components/dashboard/Navbar'
import ReportsCarts from '@/components/reports/ReportsCarts'
import { reportItems } from '@/data/reports/reportCarts.config'

export default function ReportsPage() {
  return (
    <div>
      <Navbar />
      <h2 className="px-6 py-4 text-lg font-bold text-black">
        Monthly Overview
      </h2>

      <div className="grid grid-cols-2 gap-4 px-6">
        <ReportsCarts items={reportItems} />
      </div>
    </div>
  )
}
