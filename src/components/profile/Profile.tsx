'use client'

import { useState } from 'react'
import SummaryCards from '../summaryCarts/SummaryCarts'
import { getDashboardSummary } from '@/config/dashboardSummary'
import { useFinanceStore } from '@/store/financeStore'
import { useGoalsProgress } from '@/features/goals/hooks/useGoalsProgress'
import { AnimatePresence } from 'framer-motion'
import AddGoalForm from '@/features/goals/components/AddGoalForm'
import ProfileOverview from './ProfileOverview'

type UserProfile = {
  name: string
  email: string
  bio: string
}

type SectionKey = 'info' | 'summary' | 'goals'

export default function Profile() {
  const { data } = useGoalsProgress()

  const [open, setOpen] = useState(false)

  const [user] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Frontend Developer',
  })

  const transactions = useFinanceStore((state) => state.transactions)
  const summaryItems = getDashboardSummary(transactions)

  const sections: Record<
    SectionKey,
    {
      title: string
      content: React.ReactNode
    }
  > = {
    info: {
      title: 'Profile',
      content: <ProfileOverview />,
    },

    summary: {
      title: 'Financial Summary',
      content: <SummaryCards items={summaryItems} />,
    },

    goals: {
      title: 'Goals',
      content: (
        <div className="space-y-3">
          <button
            onClick={() => setOpen(true)}
            className="rounded bg-black px-3 py-1 text-white"
          >
            + Add Goal
          </button>

          {data?.map((goal) => (
            <div key={goal.id} className="rounded-lg border p-3">
              <h3>{goal.title}</h3>
              <p className="text-sm text-zinc-500">
                Target: ${goal.target_amount}
              </p>
            </div>
          ))}
        </div>
      ),
    },
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {Object.entries(sections).map(([key, section]) => (
        <div key={key} className="rounded-xl border p-4">
          <h2 className="mb-3 text-xl ">{section.title}</h2>
          {section.content}
        </div>
      ))}

      <AnimatePresence>{open && <AddGoalForm />}</AnimatePresence>
    </div>
  )
}
