import { supabase } from '@/lib/supabase/client'

export type CurrentUser =
  | { id: string; isDemo: true }
  | { id: string; isDemo: false }
  | null
export function getCurrentUserFromStore(): CurrentUser {
  const { useAuthStore } =
    require('@/store/authStore') as typeof import('@/store/authStore')
  const user = useAuthStore.getState().user
  if (!user) return null
  if (user.is_anonymous === true) return { id: 'demo-user', isDemo: true }
  return { id: user.id, isDemo: false }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  if (user.is_anonymous === true) {
    return { id: 'demo-user', isDemo: true }
  }

  return { id: user.id, isDemo: false }
}
