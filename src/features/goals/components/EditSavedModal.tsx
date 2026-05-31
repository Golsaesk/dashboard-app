'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGoalSaved } from '../api/updateGoalApi'
import { deleteGoal } from '../api/deleteGoalApi'

type Props = {
  goalId: string
  goalTitle: string
  targetAmount: number
  currentSaved: number
  onClose: () => void
}

type UpdateGoalInput = {
  id: string
  saved: number
}

export default function EditSavedModal({
  goalId,
  goalTitle,
  targetAmount,
  currentSaved,
  onClose,
}: Props) {
  const queryClient = useQueryClient()
  const [saved, setSaved] = useState(String(currentSaved))

  useEffect(() => {
    setSaved(String(currentSaved))
  }, [currentSaved])

  const validSaved = Number(saved) || 0
  const percent =
    targetAmount > 0
      ? Math.min(Math.round((validSaved / targetAmount) * 100), 100)
      : 0

  const mutation = useMutation<void, Error, UpdateGoalInput>({
    mutationFn: updateGoalSaved,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['goals-progress'], (old: any) => {
        if (!old) return old
        return old.map((goal: any) =>
          goal.id === variables.id
            ? {
                ...goal,
                saved: variables.saved,
                percent: Math.min(
                  Math.round((variables.saved / goal.target_amount) * 100),
                  100,
                ),
              }
            : goal,
        )
      })
      queryClient.invalidateQueries({ queryKey: ['goals-progress'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-progress'] })
      onClose()
    },
  })

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    try {
      await updateGoalSaved({ id: goalId, saved: validSaved })
      queryClient.invalidateQueries({ queryKey: ['goals-progress'] })
      onClose()
    } catch (err) {
      console.error('update error', err)
    }
  }

  function handleDelete() {
    deleteMutation.mutate(goalId)
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
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Save Progress'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full rounded-xl border border-red-200 py-3 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Goal'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
