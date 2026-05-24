'use client'

import { getSettingsData } from "@/data/setting/setting.config"
import { useSettingsStore } from "@/store/settingStore"
import SettingsSection from "./SettingSections"

export default function Setting() {
  const darkMode = useSettingsStore((s) => s.darkMode)
  const notifications = useSettingsStore((s) => s.notifications)

  const toggleDarkMode = useSettingsStore((s) => s.toggleDarkMode)
  const toggleNotifications = useSettingsStore((s) => s.toggleNotifications)

  const data = getSettingsData({
    darkMode,
    notifications,
  })

  const handleToggle = (key: 'darkMode' | 'notifications') => {
    if (key === 'darkMode') toggleDarkMode()
    if (key === 'notifications') toggleNotifications()
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
          Settings
        </h1>

        <div className="space-y-6">
          {data.map((section) => (
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
