'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useFinanceStore } from '@/store/financeStore'

export function useFinanceInit() {
  const user = useAuthStore((s) => s.user)
  const fetchTransactions = useFinanceStore((s: any) => s.fetchTransactions)
  const fetchFixedCosts = useFinanceStore((s) => s.fetchFixedCosts)

  useEffect(() => {
    if (!user) return

    let mounted = true

    const init = async () => {
      if (fetchTransactions) {
        await fetchTransactions()
      }

      if (!mounted) return

      await fetchFixedCosts()
    }

    init()

    return () => {
      mounted = false
    }
  }, [user, fetchTransactions, fetchFixedCosts])
}
