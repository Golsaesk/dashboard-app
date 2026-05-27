import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'

type Plan = 'free' | 'pro'

interface AuthState {
  user: User | null
  session: Session | null
  plan: Plan
  loading: boolean

  setAuth: (data: Partial<AuthState>) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  plan: 'free',
  loading: true,

  setAuth: (data) => set((state) => ({ ...state, ...data })),
}))
