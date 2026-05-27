'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

type FeatureGateProps = {
  children: React.ReactNode
  title?: string
}

export function FeatureGate({
  children,
  title = 'Pro Feature',
}: FeatureGateProps) {
  const plan = useAuthStore((s) => s.plan),
    isLocked = plan !== 'pro'

  return (
    <div className="relative w-full min-w-0">
      <div className="w-full">
        <div
          className={isLocked ? 'pointer-events-none blur-sm select-none' : ''}
        >
          {children}
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm dark:bg-zinc-900/60">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-5 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Lock className="h-5 w-5" />
            </div>

            <div className="text-sm font-medium text-zinc-900 dark:text-white">
              {title}
            </div>

            <p className="max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
              Upgrade to Pro to unlock this feature
            </p>

            <Link
              href="/pricing"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:scale-[1.02] hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
