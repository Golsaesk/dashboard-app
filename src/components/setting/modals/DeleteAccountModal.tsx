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
        <Trash2 className="mb-4 text-red-500" />

        <h2 className="mb-2 text-lg font-semibold">Delete Account?</h2>

        <p className="mb-6 text-sm text-zinc-500">This action is permanent.</p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border py-2">
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2 text-white"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
