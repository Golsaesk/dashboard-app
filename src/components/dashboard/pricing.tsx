
'use client'

import { supabase } from '@/lib/supabase/client'
import { Check, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    try {
      setLoading(true)

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
        throw new Error('Failed to create checkout')
      }

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
    <main className="min-h-screen bg-white px-6 py-20 text-zinc-900 transition dark:bg-black dark:text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Sparkles className="h-4 w-4" />
            Pricing
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choose your plan
          </h1>

          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Start for free and upgrade anytime to unlock premium features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Free</h2>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-bold">$0</span>
                <span className="mb-1 text-zinc-500 dark:text-zinc-400">
                  /month
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                Perfect for getting started
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Basic access',
                'Limited usage',
                'Community support',
                'Standard features',
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Check className="h-3.5 w-3.5" />
                  </div>

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              disabled
              className="mt-8 w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-900 p-8 text-white shadow-2xl transition dark:border-white dark:bg-white dark:text-zinc-900">
            {/* Badge */}
            <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur dark:bg-zinc-900/10">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Pro</h2>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-bold">$5</span>
                <span className="mb-1 text-zinc-300 dark:text-zinc-600">
                  /month
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-300 dark:text-zinc-600">
                Unlock the full experience
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Unlimited access',
                'Fast AI responses',
                'Premium features',
                'Priority support',
                'Advanced tools',
                'Early access updates',
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 dark:bg-zinc-900/10">
                    <Check className="h-3.5 w-3.5" />
                  </div>

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:scale-[1.02] hover:bg-zinc-200 disabled:opacity-70 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              {loading ? 'Redirecting...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

