'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/financeStore'
import { getDashboardSummary } from '@/config/dashboardSummary'
import SummaryCards from '@/components/summaryCarts/SummaryCarts'
import AddGoalForm from '@/features/goals/components/AddGoalForm'
import ProfileOverview from '@/components/profile/ProfileOverview'
import EditSavedModal from '@/features/goals/components/EditSavedModal'
import { useGoalsProgress } from '@/features/goals/hooks/useGoalsProgress'

type SectionKey = 'info' | 'summary' | 'goals'

type EditingGoal = {
  id: string
  title: string
  target_amount: number
  saved_amount: number
}

export default function Profile() {
  const { data, isLoading } = useGoalsProgress(),
    [openAdd, setOpenAdd] = useState(false),
    [editingGoal, setEditingGoal] = useState<EditingGoal | null>(null),
    transactions = useFinanceStore((state) => state.transactions),
    summaryItems = getDashboardSummary(transactions),
    sections: Record<SectionKey, { title: string; content: React.ReactNode }> =
      {
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
                onClick={() => setOpenAdd(true)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                <span className="text-lg leading-none">+</span> Add Goal
              </button>

              {isLoading && (
                <p className="text-sm text-zinc-400">Loading goals...</p>
              )}

              {!isLoading && (!data || data.length === 0) && (
                <p className="text-sm text-zinc-400">
                  No goals yet. Create your first one!
                </p>
              )}

              {data?.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-zinc-800">{goal.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-emerald-600">
                        {Math.round(goal.percent)}%
                      </span>
                      <button
                        onClick={() =>
                          setEditingGoal({
                            id: goal.id,
                            title: goal.title,
                            target_amount: goal.target_amount,
                            saved_amount: goal.saved ?? 0,
                          })
                        }
                        className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-500 transition hover:border-emerald-400 hover:text-emerald-600"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${goal.percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>
                      Saved:{' '}
                      <span className="text-zinc-600">
                        {(goal.saved ?? 0).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </span>
                    </span>
                    <span>
                      Target:{' '}
                      <span className="text-zinc-600">
                        {goal.target_amount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
      }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
      {Object.entries(sections).map(([key, section]) => (
        <div key={key} className="rounded-xl border p-4">
          <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
          {section.content}
        </div>
      ))}

      <AnimatePresence>
        {openAdd && <AddGoalForm onClose={() => setOpenAdd(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {editingGoal && (
          <EditSavedModal
            goalId={editingGoal.id}
            goalTitle={editingGoal.title}
            targetAmount={editingGoal.target_amount}
            currentSaved={editingGoal.saved_amount}
            onClose={() => setEditingGoal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
