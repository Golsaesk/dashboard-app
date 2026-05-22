import { create } from 'zustand'

type AppMode = 'demo' | 'auth'

interface AppModeState {
  mode: AppMode
  setMode: (mode: AppMode) => void
}

export const useAppMode = create<AppModeState>((set) => ({
  mode: 'auth', // default

  setMode: (mode) => set({ mode }),
}))
