'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { signIn } from '../api/sign-in'
import { signUp } from '../api/sign-up'

import ForgotPasswordModal from './ForgotPasswordModal'
import VerifyEmailModal from './VerifyEmailModal'
import ResetPasswordModal from './ResetPasswordModal'

type Props = {
  isSignup: boolean
  onToggle: () => void
}

type Modal = 'forgot' | 'verify' | 'reset' | null

export function AuthCard({ isSignup, onToggle }: Props) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<Modal>(null)

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
        } else if (
          msg.includes('invalid login') ||
          msg.includes('incorrect')
        ) {
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
      {/* ─── Auth Card (UI اصلی خودت حفظ شده) ─── */}
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

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Password */}
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
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
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

            {/* Remember + Forgot */}
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

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* cooldown */}
            {cooldown && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Please wait a few seconds before trying again...
              </p>
            )}

            {/* Submit */}
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

          {/* toggle */}
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