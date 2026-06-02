import { supabase } from '@/lib/supabase/client'

export type CurrentUser =
  | { id: string; isDemo: true }
  | { id: string; isDemo: false }
  | null

export async function getCurrentUser(): Promise<CurrentUser> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  if (user.is_anonymous === true) {
    return { id: 'demo-user', isDemo: true }
  }

  return { id: user.id, isDemo: false }
}
