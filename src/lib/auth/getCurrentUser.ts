import { supabase } from '@/lib/supabase/client'
import { isDemoUser } from '@/lib/isDemoUser'

export type CurrentUser =
  | {
      id: string
      isDemo: true
    }
  | {
      id: string
      isDemo: false
    }
  | null

export async function getCurrentUser(): Promise<CurrentUser> {
  const demo = await isDemoUser()

  if (demo) {
    return {
      id: 'demo-user',
      isDemo: true,
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    isDemo: false,
  }
}
