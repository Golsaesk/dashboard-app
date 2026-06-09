import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

type Plan = 'free' | 'pro'

interface AuthState {
  user: User | null
  plan: Plan
  loading: boolean

  setAuth: (data: Partial<AuthState>) => void
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  plan: 'free',
  loading: true,

  setAuth: (data) => set((state) => ({ ...state, ...data })),
}))
