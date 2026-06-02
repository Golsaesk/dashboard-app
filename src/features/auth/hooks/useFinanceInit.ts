import { useAuthStore } from '@/store/authStore'
import { useFinanceStore } from '@/store/financeStore'
import { useEffect } from 'react'

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
