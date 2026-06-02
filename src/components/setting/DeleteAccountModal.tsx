'use client'

import { Trash2 } from 'lucide-react'

type Props = {
  open: boolean
  loading: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteAccountModal({
  open,
  loading,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-zinc-900">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
          <Trash2 size={22} className="text-red-500" />
        </div>

        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
          Delete Account?
        </h2>

        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          This action is permanent. All your transactions and data will be
          deleted and cannot be recovered.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
