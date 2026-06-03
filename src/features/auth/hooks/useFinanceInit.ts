'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase/client'
import { useFinanceStore } from '@/store/financeStore'

export function useFinanceInit() {
  const user = useAuthStore((s) => s.user)
  const fetchTransactions = useFinanceStore((s) => s.fetchTransactions)
  const fetchFixedCosts = useFinanceStore((s) => s.fetchFixedCosts)

  useEffect(() => {
    console.log('useFinanceInit user:', user)
    console.log('user.is_anonymous:', user?.is_anonymous)
    if (!user) return

    let mounted = true

    const init = async () => {
      // تست مستقیم Supabase
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
      console.log('direct supabase test:', data, 'error:', error)

      await fetchTransactions()
      if (!mounted) return
      console.log(
        'transactions after fetch:',
        useFinanceStore.getState().transactions,
      )
      await fetchFixedCosts()
    }

    init()

    return () => {
      mounted = false
    }
  }, [user, fetchTransactions, fetchFixedCosts])
}
