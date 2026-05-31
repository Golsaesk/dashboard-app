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
import { Plus } from 'lucide-react'

type EditingGoal = {
  id: string
  title: string
  target_amount: number
  saved_amount: number
}

export default function Profile() {
  const { data, isLoading } = useGoalsProgress()
  const [openAdd, setOpenAdd] = useState(false)
  const [editingGoal, setEditingGoal] = useState<EditingGoal | null>(null)
  const transactions = useFinanceStore((state) => state.transactions)
  const summaryItems = getDashboardSummary(transactions)

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Profile Info */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
            Profile
          </h2>
          <ProfileOverview />
        </div>

        {/* Financial Summary */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
            Financial Summary
          </h2>
          <SummaryCards items={summaryItems} />
        </div>

        {/* Goals */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              Goals
            </h2>
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              <Plus size={14} />
              Add Goal
            </button>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
                />
              ))}
            </div>
          )}

          {!isLoading && (!data || data.length === 0) && (
            <p className="py-4 text-center text-sm text-zinc-400 dark:text-zinc-500">
              No goals yet. Create your first one!
            </p>
          )}

          <div className="space-y-3">
            {data?.map((goal) => (
              <div
                key={goal.id}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
                    {goal.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
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
                      className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-500 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${goal.percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
                  <span>
                    Saved:{' '}
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {(goal.saved ?? 0).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </span>
                  <span>
                    Target:{' '}
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {goal.target_amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
    </main>
  )
}
