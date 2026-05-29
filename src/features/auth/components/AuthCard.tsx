'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/features/auth/api/sign-in'
import { signUp } from '@/features/auth/api/sign-up'
import { motion, AnimatePresence } from 'framer-motion'
import VerifyEmailModal from '@/features/auth/components/VerifyEmailModal'
import ForgotPasswordModal from '@/features/auth/components/ForgotPasswordModal'
import ResetPasswordModal from '@/features/auth/components/ResetPasswordModal'

type Props = {
  isSignup: boolean
  onToggle: () => void
}

type Modal = 'forgot' | 'verify' | 'reset' | null

export function AuthCard({ isSignup, onToggle }: Props) {
  const router = useRouter(),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [showPassword, setShowPassword] = useState(false),
    [loading, setLoading] = useState(false),
    [cooldown, setCooldown] = useState(false),
    [error, setError] = useState(''),
    [modal, setModal] = useState<Modal>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading || cooldown) return

    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)
      setCooldown(true)

      if (isSignup) {
        await signUp(email, password)
        setModal('verify')
      } else {
        await signIn(email, password)
        router.refresh()
        router.push('/dashboard')
      }
    } catch (err) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase()

        if (msg.includes('email not confirmed')) {
          setError('Please verify your email first.')
        } else if (msg.includes('invalid login') || msg.includes('incorrect')) {
          setError('Incorrect email or password.')
        } else if (msg.includes('rate limit')) {
          setError('Too many attempts. Please wait a moment.')
        } else {
          setError('Authentication failed.')
        }
      } else {
        setError('Something went wrong.')
      }
    } finally {
      setLoading(false)
      setTimeout(() => setCooldown(false), 5000)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              Manage your financial life
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 pr-12 text-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setModal('forgot')}
                  className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            {cooldown && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Please wait a few seconds before trying again...
              </p>
            )}

            <button
              type="submit"
              disabled={loading || cooldown}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Please wait...'
                : isSignup
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}

            <button
              onClick={onToggle}
              className="ml-1 font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modal === 'forgot' && (
          <ForgotPasswordModal onClose={() => setModal(null)} />
        )}
        {modal === 'verify' && (
          <VerifyEmailModal onClose={() => setModal(null)} />
        )}
        {modal === 'reset' && (
          <ResetPasswordModal onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
