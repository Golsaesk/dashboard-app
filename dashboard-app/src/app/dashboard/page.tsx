import Chart from '@/components/dashboard/Chart'
import Navbar from '@/components/dashboard/Navbar'
import Summary from '@/components/dashboard/Summary'
import Transaction from '@/components/dashboard/Transaction'

export default function DashboardPage() {
  return (
    <div
      id="container"
      className="max-auto p-auto mx-auto min-h-screen w-full max-w-full bg-blue-500 md:max-w-3xl lg:max-w-5xl"
    >
      <Navbar />
      <Summary />
      <Chart />
      <Transaction />
    </div>
  )
}
