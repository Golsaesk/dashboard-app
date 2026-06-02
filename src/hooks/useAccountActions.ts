'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

export function useAccountActions() {
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()

  const setAuth = useAuthStore((s) => s.setAuth)

  const logout = async () => {
    await supabase.auth.signOut()

    localStorage.removeItem('demo_transactions')
    localStorage.removeItem('demo_fixed_costs')

    setAuth({
      user: null,
      session: null,
      loading: false,
      plan: 'free',
    })

    router.replace('/signin')
  }

  const deleteAccount = async () => {
    try {
      setDeleting(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await supabase.from('transactions').delete().eq('user_id', user.id)

      await supabase.from('fixed_costs').delete().eq('user_id', user.id)

      await supabase.from('profiles').delete().eq('id', user.id)

      await supabase.rpc('delete_user')

      await logout()
    } finally {
      setDeleting(false)
    }
  }

  return {
    logout,
    deleteAccount,
    deleting,
  }
}
