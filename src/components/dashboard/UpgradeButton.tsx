'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { supabase } from '@/lib/supabase/client'

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

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

      // رفتن مستقیم به Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error(error)

      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
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
  )
}
