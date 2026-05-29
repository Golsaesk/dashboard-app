'use client'

import { useState } from 'react'
import { Lock, Loader2 } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase/client'

type FeatureGateProps = {
  children: React.ReactNode
  title?: string
}

export function FeatureGate({
  children,
  title = 'Pro Feature',
}: FeatureGateProps) {
  const [loading, setLoading] = useState(false)

  const plan = useAuthStore((s) => s.plan)

  const isLocked = plan !== 'pro'

  const handleUpgrade = async () => {
    try {
      setLoading(true)

      // گرفتن یوزر
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // اگر لاگین نبود
      if (!user) {
        window.location.href = '/login'
        return
      }

      // ساخت checkout session
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await res.json()

      // رفتن به Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      console.error(err)

      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

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

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:scale-[1.02] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                'Upgrade to Pro'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
