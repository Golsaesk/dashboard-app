import { create } from 'zustand'

type SettingsState = {
  notifications: boolean
  toggleNotifications: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notifications: true,
  toggleNotifications: () =>
    set((state) => ({ notifications: !state.notifications })),
}))
