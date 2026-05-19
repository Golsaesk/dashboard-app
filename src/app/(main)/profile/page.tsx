import ProfileOverview from '@/components/profile/ProfileOverview'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import { dashboardItems } from '@/data/dashboard/dashboard.config'

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <ProfileOverview />
      <SummaryCards items={dashboardItems} />
    </div>
  )
}
