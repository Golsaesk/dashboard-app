'use client'

import { useTheme } from 'next-themes'
import { Moon, Bell } from 'lucide-react'
import { SettingItem } from '@/data/setting/setting'
import { useSettingsStore } from '@/store/settingStore'
import SettingsSection from '@/components/setting/SettingSections'

export type SettingsSectionType = {
  title: string
  items: SettingItem[]
}

export default function Setting() {
  const { notifications, toggleNotifications } = useSettingsStore(),
    { theme, setTheme } = useTheme(),
    sections: SettingsSectionType[] = [
      {
        title: 'Appearance',
        items: [
          {
            id: 1,
            title: 'Dark Mode',
            description: 'Switch between light and dark theme',
            icon: Moon,
            type: 'toggle',
            key: 'darkMode',
            value: theme === 'dark',
          },
        ],
      },
      {
        title: 'Notifications',
        items: [
          {
            id: 2,
            title: 'Enable Notifications',
            description: 'Receive alerts and updates',
            icon: Bell,
            type: 'toggle',
            key: 'notifications',
            value: notifications,
          },
        ],
      },
    ]

  const handleToggle = (key: 'darkMode' | 'notifications') => {
    if (key === 'notifications') {
      toggleNotifications()
      return
    }
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-white">
          Settings
        </h1>
        <div className="space-y-6">
          {sections.map((section) => (
            <SettingsSection
              key={section.title}
              section={section}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
