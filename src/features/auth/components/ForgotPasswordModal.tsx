'use client'

import { useState } from 'react'
import ModalShell from './ModalShell'
import { forgotPassword } from '../api/forgotPassword'

export default function ForgotPasswordModal({
  onClose,
}: {
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)
      await forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell
      onClose={onClose}
      title="Forgot Password"
      subtitle="Enter your email to reset your password."
    >
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400">
          Check your inbox for the reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </ModalShell>
  )
}
