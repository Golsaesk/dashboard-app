'use client'

import { SettingItem } from '@/type/setting'
import SettingsItem from '@/components/setting/SettingItems'

type SettingsSectionType = {
  title: string
  items: SettingItem[]
}

type Props = {
  section: SettingsSectionType
  onToggle: (key: 'darkMode' | 'notifications') => void
  onSelect: (key: string, value: string) => void
}

export default function SettingsSection({
  section,
  onToggle,
  onSelect,
}: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {section.title}
      </h2>

      <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {section.items.map((item) => (
          <SettingsItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
