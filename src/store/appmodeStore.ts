import { create } from 'zustand'

type Mode = 'demo' | 'auth'

interface ModeState {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useAppMode = create<ModeState>((set) => ({
  mode: 'demo',
  setMode: (mode) => set({ mode }),
}))
