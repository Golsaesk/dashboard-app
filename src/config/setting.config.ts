import { Currency } from '@/store/settingStore'
import { SettingsSection } from '../type/setting'
import { Bell, DollarSign, LogOut, Moon, Trash2, User } from 'lucide-react'

type Props = {
  darkMode: boolean
  notifications: boolean
  currency: Currency

  onEditProfile: () => void
  onLogout: () => void
  onDeleteAccount: () => void
}

export const getSettingsData = ({
  darkMode,
  notifications,
  currency,
  onEditProfile,
  onLogout,
  onDeleteAccount,
}: Props): SettingsSection[] => [
  {
    title: 'Profile',
    items: [
      {
        id: 1,
        title: 'Edit Profile',
        description: 'Update your profile information',
        icon: User,
        type: 'button',
        key: 'profile',
        onClick: onEditProfile,
      },
    ],
  },

  {
    title: 'Preferences',
    items: [
      {
        id: 2,
        title: 'Dark Mode',
        description: 'Switch between light and dark theme',
        icon: Moon,
        type: 'toggle',
        value: darkMode,
        key: 'darkMode',
      },

      {
        id: 3,
        title: 'Currency',
        description: 'Select preferred currency',
        icon: DollarSign,
        type: 'select',
        value: currency,
        key: 'currency',
        options: ['USD', 'EUR', 'TRY'],
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
        value: notifications,
        key: 'notifications',
      },
    ],
  },

  {
    title: 'Account',
    items: [
      {
        id: 5,
        title: 'Logout',
        description: 'Sign out of your account',
        icon: LogOut,
        type: 'button',
        key: 'logout',
        variant: 'danger',
        onClick: onLogout,
      },

      {
        id: 6,
        title: 'Delete Account',
        description: 'Permanently delete your account',
        icon: Trash2,
        type: 'button',
        key: 'deleteAccount',
        variant: 'danger',
        onClick: onDeleteAccount,
      },
    ],
  },
]
