'use client'

import { useState } from 'react'
import ModalShell from './ModalShell'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function ResetPasswordModal({
  onClose,
}: {
  onClose: () => void
}) {
  const router = useRouter(),
    [password, setPassword] = useState(''),
    [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      onClose()
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell
      onClose={onClose}
      title="Reset Password"
      subtitle="Enter your new password below."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </ModalShell>
  )
}
