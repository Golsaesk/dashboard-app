import { create } from 'zustand'

export type Currency = 'USD' | 'EUR' | 'TRY'

type SettingsState = {
  notifications: boolean
  currency: Currency

  toggleNotifications: () => void
  setCurrency: (currency: Currency) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notifications: true,
  currency: 'USD',

  toggleNotifications: () =>
    set((state) => ({
      notifications: !state.notifications,
    })),

  setCurrency: (currency) =>
    set({
      currency,
    }),
}))
