'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from '../api/sign-in'
import { signUp } from '../api/sign-up'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  isSignup: boolean
  onToggle: () => void
}

export function AuthCard({ isSignup, onToggle }: Props) {
  const router = useRouter(),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [showPassword, setShowPassword] = useState(false),
    [loading, setLoading] = useState(false),
    [cooldown, setCooldown] = useState(false),
    [error, setError] = useState('')

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
        router.push('/verify-email')
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

      setTimeout(() => {
        setCooldown(false)
      }, 5000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-900">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-zinc-500">Manage your financial life</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-zinc-300 px-4 py-4 transition outline-none focus:border-[#0AA165]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-4 pr-12 transition outline-none focus:border-[#0AA165]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {!isSignup && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-500">
                <input type="checkbox" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-[#0AA165]"
              >
                Forgot Password?
              </Link>
            </div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}
          {cooldown && (
            <p className="text-xs text-zinc-400">
              Please wait a few seconds before trying again...
            </p>
          )}
          <button
            type="submit"
            disabled={loading || cooldown}
            className="w-full rounded-2xl bg-[#0AA165] py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-zinc-500">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}

          <button
            onClick={onToggle}
            className="ml-1 font-medium text-[#0AA165]"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
