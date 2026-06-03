'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type CheckoutStatus = 'idle' | 'loading' | 'error'

export function useStripeCheckout() {
  const [status, setStatus] = useState<CheckoutStatus>('idle'),
    [error, setError] = useState<string | null>(null)

  const startCheckout = async () => {
    try {
      setStatus('loading')
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/signin'
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      })

      if (!res.ok) throw new Error('Failed to create checkout session')

      const data = await res.json()
      window.location.href = data.url
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setStatus('error')
    }
  }

  return {
    startCheckout,
    isLoading: status === 'loading',
    error,
  }
}
