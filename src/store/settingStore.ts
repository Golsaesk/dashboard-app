import { create } from 'zustand'

type SettingsState = {
  notifications: boolean
  darkMode: boolean

  toggleNotifications: () => void
  toggleDarkMode: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notifications: true,
  darkMode: false,

  toggleNotifications: () =>
    set((state) => ({ notifications: !state.notifications })),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
