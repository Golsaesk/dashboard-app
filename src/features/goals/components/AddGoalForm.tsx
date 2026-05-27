// 'use client'

// import { useState } from 'react'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { motion } from 'framer-motion'
// import { createGoal } from '../api/createGoalsApi'

// type CreateGoalInput = {
//   title: string
//   target_amount: number
//   saved: number
// }

// export default function AddGoalForm({ onClose }: { onClose: () => void }) {
//   const queryClient = useQueryClient()
//   const [title, setTitle] = useState('')
//   const [target, setTarget] = useState('')
//   const [saved, setSaved] = useState('0')

//   const isValid = title.trim().length > 0 && Number(target) > 0

//   const mutation = useMutation<void, Error, CreateGoalInput>({
//     mutationFn: createGoal,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['goals-progress'] })
//       onClose()
//     },
//     onError: (err: any) => {
//       console.error('Create goal error:', err?.message)
//     },
//   })

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     if (!isValid) return

//     mutation.mutate({
//       title: title.trim(),
//       target_amount: Number(target),
//       saved: Number(saved) || 0,
//     })
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <motion.form
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         onSubmit={handleSubmit}
//         className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
//       >
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold">Create Goal</h2>
//           <button
//             type="button"
//             onClick={onClose}
//             className="text-zinc-400 hover:text-zinc-700"
//           >
//             ✕
//           </button>
//         </div>

//         <input
//           className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
//           placeholder="Goal name"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <div className="grid grid-cols-2 gap-3">
//           <div className="relative">
//             <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-400">
//               $
//             </span>
//             <input
//               className="w-full rounded-xl border border-zinc-200 py-3 pr-4 pl-7 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
//               type="number"
//               placeholder="Target"
//               value={target}
//               onChange={(e) => setTarget(e.target.value)}
//               required
//               min={1}
//             />
//           </div>

//           <div className="relative">
//             <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-400">
//               $
//             </span>
//             <input
//               className="w-full rounded-xl border border-zinc-200 py-3 pr-4 pl-7 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
//               type="number"
//               placeholder="Already saved"
//               value={saved}
//               onChange={(e) => setSaved(e.target.value)}
//               min={0}
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={mutation.isPending || !isValid}
//           className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
//         >
//           {mutation.isPending ? 'Creating...' : 'Create Goal'}
//         </button>

//         {mutation.isError && (
//           <p className="text-center text-sm text-red-500">
//             Something went wrong. Please try again.
//           </p>
//         )}
//       </motion.form>
//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { createGoal } from '../api/createGoalsApi'

type CreateGoalInput = {
  title: string
  target_amount: number
  saved: number
}

export default function AddGoalForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [saved, setSaved] = useState('0')

  const isValid = title.trim().length > 0 && Number(target) > 0

  const mutation = useMutation<void, Error, CreateGoalInput>({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-progress'] })
      onClose()
    },
    onError: (err: any) => {
      console.error('Create goal error:', err?.message)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    mutation.mutate({
      title: title.trim(),
      target_amount: Number(target),
      saved: Number(saved) || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Create Goal
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>

        <input
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          placeholder="Goal name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-400">
              $
            </span>
            <input
              className="w-full rounded-xl border border-zinc-200 py-3 pr-4 pl-7 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              type="number"
              placeholder="Target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              min={1}
            />
          </div>

          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-400">
              $
            </span>
            <input
              className="w-full rounded-xl border border-zinc-200 py-3 pr-4 pl-7 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              type="number"
              placeholder="Already saved"
              value={saved}
              onChange={(e) => setSaved(e.target.value)}
              min={0}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || !isValid}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {mutation.isPending ? 'Creating...' : 'Create Goal'}
        </button>

        {mutation.isError && (
          <p className="text-center text-sm text-red-500 dark:text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </motion.form>
    </div>
  )
}
