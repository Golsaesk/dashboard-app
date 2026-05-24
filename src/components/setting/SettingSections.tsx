'use client'

import { SettingItem } from '@/data/setting/setting'
import SettingsItem from './SettingItems'
type SettingsSection = {
  title: string
  items: SettingItem[]
}

type Props = {
  section: SettingsSection
  onToggle: (key: 'darkMode' | 'notifications') => void
}

export default function SettingsSection({ section, onToggle }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        {section.title}
      </h2>

      <div className="space-y-4">
        {section.items.map((item) => (
          <SettingsItem key={item.id} item={item} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}
