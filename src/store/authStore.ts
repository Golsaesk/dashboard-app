import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean

  setAuth: (payload: {
    user: User | null
    session: Session | null
    loading: boolean
  }) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  setAuth: ({ user, session, loading }) => set({ user, session, loading }),
}))
