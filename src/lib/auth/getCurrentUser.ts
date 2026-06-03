import { supabase } from '@/lib/supabase/client'

export type CurrentUser =
  | { id: string; isDemo: true }
  | { id: string; isDemo: false }
  | null

// از authStore بخون نه از Supabase مستقیم — بدون race condition
export function getCurrentUserFromStore(): CurrentUser {
  // این import رو اینجا می‌ذاریم تا circular dependency نداشته باشیم
  const { useAuthStore } = require('@/store/authStore')
  const user = useAuthStore.getState().user
  if (!user) return null
  if (user.is_anonymous === true) return { id: 'demo-user', isDemo: true }
  return { id: user.id, isDemo: false }
}

// fallback: برای جاهایی که store هنوز آماده نیست
export async function getCurrentUser(): Promise<CurrentUser> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user

  if (!user) return null

  if (user.is_anonymous === true) {
    return { id: 'demo-user', isDemo: true }
  }

  return { id: user.id, isDemo: false }
}
