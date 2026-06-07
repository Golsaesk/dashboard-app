'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  useUpdateGoalSaved,
  useDeleteGoal,
} from '@/features/goals/hooks/useGoalsProgress'

type Props = {
  goalId: string
  goalTitle: string
  targetAmount: number
  currentSaved: number
  onClose: () => void
}

export default function EditSavedModal({
  goalId,
  goalTitle,
  targetAmount,
  currentSaved,
  onClose,
}: Props) {
  const [saved, setSaved] = useState(String(currentSaved))

  useEffect(() => {
    setSaved(String(currentSaved))
  }, [currentSaved])

  const validSaved = Number(saved) || 0
  const percent =
    targetAmount > 0
      ? Math.min(Math.round((validSaved / targetAmount) * 100), 100)
      : 0

  const { mutate: updateSaved, isPending: updating } = useUpdateGoalSaved()
  const { mutate: deleteGoal, isPending: deleting } = useDeleteGoal()

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    updateSaved({ id: goalId, saved: validSaved }, { onSuccess: onClose })
  }

  function handleDelete() {
    deleteGoal(goalId, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            Update Progress
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {goalTitle}
        </p>

        <div className="mb-5">
          <div className="mb-1.5 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Progress</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-400">
              $
            </span>
            <input
              type="number"
              value={saved}
              onChange={(e) => setSaved(e.target.value)}
              min={0}
              max={targetAmount}
              className="w-full rounded-xl border border-zinc-200 py-3 pr-4 pl-7 text-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={updating}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {updating ? 'Saving...' : 'Save Progress'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full rounded-xl border border-red-200 py-3 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
          >
            {deleting ? 'Deleting...' : 'Delete Goal'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
