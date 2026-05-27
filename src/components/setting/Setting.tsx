'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Bell, User } from 'lucide-react'
import ProfileInformation from './EditInformation'
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
    [openProfile, setOpenProfile] = useState(false),
    sections: SettingsSectionType[] = [
      {
        title: 'Profile',
        items: [
          {
            id: 3,
            title: 'Edit Profile',
            description: 'Update your profile information',
            icon: User,
            type: 'button',
            key: 'editProfile',
            onClick: () => setOpenProfile(true),
          },
        ],
      },

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

        {openProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 dark:bg-zinc-900">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Edit Profile
                </h2>

                <button
                  onClick={() => setOpenProfile(false)}
                  className="rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
                >
                  Close
                </button>
              </div>

              <ProfileInformation />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
