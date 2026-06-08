'use client'

import ModalShell from './ModalShell'

export default function VerifyEmailModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      onClose={onClose}
      title="Verify your email"
      subtitle="We sent you a verification link. Please check your inbox."
    >
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl dark:bg-emerald-950/50">
          ✉️
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full rounded-xl border border-zinc-200 py-3 text-sm font-medium"
      >
        Back to Sign In
      </button>
    </ModalShell>
  )
}
