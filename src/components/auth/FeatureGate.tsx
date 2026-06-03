'use client'
import { useState } from 'react'
import { Lock, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase/client'

type FeatureGateProps = {
  children: React.ReactNode
  variant?: 'page' | 'overlay'
  title?: string
  description?: string
  fallback?: React.ReactNode
}

export function FeatureGate({
  children,
  variant = 'page',
  title = 'Pro Feature',
  description = 'Upgrade to Pro to unlock this feature.',
  fallback,
}: FeatureGateProps) {
  const plan = useAuthStore((s) => s.plan)
  const [loading, setLoading] = useState(false)

  if (plan === 'pro') return <>{children}</>
  if (fallback) return <>{fallback}</>

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        window.location.href = '/signin'
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
        }),
      })
      if (!res.ok) throw new Error('Failed to create checkout session')
      const data = await res.json()
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'page') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
            <Lock className="h-6 w-6" />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="mb-5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:scale-[1.02] hover:opacity-90 dark:bg-white dark:text-black"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="relative w-full min-w-0">
      <div className="pointer-events-none w-full blur-sm select-none">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm dark:bg-zinc-900/60">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-5 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <Lock className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium text-zinc-900 dark:text-white">
            {title}
          </div>
          <p className="max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:scale-[1.02] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              'Upgrade to Pro'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
