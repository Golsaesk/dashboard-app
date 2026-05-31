'use client'

import { supabase } from '@/lib/supabase/client'
import { Check, Sparkles } from 'lucide-react'
import { useState } from 'react'

const freeFeatures = [
  'Basic access',
  'Limited usage',
  'Community support',
  'Standard features',
]

const proFeatures = [
  'Unlimited access',
  'Fast AI responses',
  'Premium features',
  'Priority support',
  'Advanced tools',
  'Early access updates',
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      })
      if (!res.ok) throw new Error('Failed to create checkout')
      const data = await res.json()
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3.5 w-3.5" />
            Pricing
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Choose your plan
          </h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
            Start for free and upgrade anytime to unlock premium features.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Free
              </h2>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-semibold text-zinc-900 dark:text-white">
                  $0
                </span>
                <span className="mb-1 text-sm text-zinc-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Perfect for getting started
              </p>
            </div>

            <div className="flex-1 space-y-3">
              {freeFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Check className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled
              className="mt-8 w-full rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
            >
              Current Plan
            </button>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 p-8 dark:border-zinc-700 dark:bg-zinc-800">
            {/* Badge */}
            <div className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Pro</h2>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-semibold text-white">$5</span>
                <span className="mb-1 text-sm text-zinc-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Unlock the full experience
              </p>
            </div>

            <div className="flex-1 space-y-3">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </div>
                  <span className="text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading ? 'Redirecting...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
