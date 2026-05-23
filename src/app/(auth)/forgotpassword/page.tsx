'use client'

import { useState } from 'react'
import { forgotPassword } from '@/features/auth/api/forgotPassword'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(''),
    [loading, setLoading] = useState(false),
    [success, setSuccess] = useState(false)

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold">Forgot Password</h1>

        <p className="mb-6 text-zinc-500">
          Enter your email to reset your password.
        </p>

        {success ? (
          <p className="rounded-2xl bg-green-100 p-4 text-green-700">
            Check your inbox for reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-zinc-300 p-4"
            />

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-[#0AA165] py-4 text-white"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
