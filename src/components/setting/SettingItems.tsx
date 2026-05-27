'use client'

import { SettingItem } from '@/data/setting/setting'

type Props = {
  item: SettingItem
  onToggle: (key: 'darkMode' | 'notifications') => void
}

export default function SettingsItem({ item, onToggle }: Props) {
  const Icon = item.icon

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex  items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Icon size={18} className="text-zinc-600 dark:text-zinc-400" />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {item.title}
          </p>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {item.description}
          </p>
        </div>
      </div>

      {item.type === 'toggle' ? (
        <button
          onClick={() => onToggle(item.key)}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            item.value ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
              item.value ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
      ) : (
        <button
          onClick={item.onClick}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Open
        </button>
      )}
    </div>
  )
}
