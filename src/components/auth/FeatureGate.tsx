'use client'

import { Lock, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

type FeatureGateProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
  title?: string
  description?: string
}

export function FeatureGate({
  children,
  fallback,
  title = 'Pro Feature',
  description = 'Upgrade to Pro to unlock this feature.',
}: FeatureGateProps) {
  const plan = useAuthStore((s) => s.plan)

  if (plan !== 'pro') {
    if (fallback) return <>{fallback}</>

    return (
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        {/* glow */}
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

  return <>{children}</>
}
