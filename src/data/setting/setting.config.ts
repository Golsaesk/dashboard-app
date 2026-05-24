import { Bell, CreditCard, Moon, ShieldCheck, Sun, User } from 'lucide-react'
import { SettingsSection } from './setting'

export const getSettingsData = (state: {
  darkMode: boolean
  notifications: boolean
}): SettingsSection[] => [
  {
    title: 'Preferences',
    items: [
      {
        id: 1,
        title: 'Dark Mode',
        description: 'Switch between light and dark theme',
        icon: state.darkMode ? Moon : Sun,
        type: 'toggle',
        value: state.darkMode,
        key: 'darkMode',
      },
    ],
  },

  {
    title: 'Account & Security',
    items: [
      {
        id: 2,
        title: 'Account',
        description: 'Manage your profile',
        icon: User,
        type: 'button',
      },
      {
        id: 3,
        title: 'Security',
        description: 'Password & 2FA',
        icon: ShieldCheck,
        type: 'button',
      },
    ],
  },

  {
    title: 'Notifications',
    items: [
      {
        id: 4,
        title: 'Push Notifications',
        description: 'Enable or disable alerts',
        icon: Bell,
        type: 'toggle',
        value: state.notifications,
        key: 'notifications',
      },
    ],
  },

  {
    title: 'Financial',
    items: [
      {
        id: 5,
        title: 'Payments',
        description: 'Cards and billing',
        icon: CreditCard,
        type: 'button',
      },
    ],
  },
]
