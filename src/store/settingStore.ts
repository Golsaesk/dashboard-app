import { create } from 'zustand'

type SettingsState = {
  darkMode: boolean
  notifications: boolean

  toggleDarkMode: () => void
  toggleNotifications: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: true,
  notifications: true,

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),

  toggleNotifications: () =>
    set((state) => ({
      notifications: !state.notifications,
    })),
}))
