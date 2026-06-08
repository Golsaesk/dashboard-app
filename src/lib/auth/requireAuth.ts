import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase/server'

export type AuthResult =
  | { ok: true; user: User; response?: never }
  | { ok: false; user?: never; response: Response }

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  if (user.is_anonymous) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Feature not available in demo mode' },
        { status: 403 },
      ),
    }
  }

  return { ok: true, user }
}
