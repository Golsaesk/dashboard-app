'use client'

import { SettingItem } from '@/type/setting'

type Props = {
  item: SettingItem
  onToggle: (key: 'darkMode' | 'notifications') => void
  onSelect: (key: string, value: string) => void
}

export default function SettingsItem({ item, onToggle, onSelect }: Props) {
  const Icon = item.icon

  const isDanger = item.type === 'button' && item.variant === 'danger'

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            isDanger
              ? 'bg-red-50 dark:bg-red-950/40'
              : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
        >
          <Icon
            size={18}
            className={
              isDanger
                ? 'text-red-500 dark:text-red-400'
                : 'text-zinc-600 dark:text-zinc-400'
            }
          />
        </div>

        <div>
          <p
            className={`text-sm font-medium ${
              isDanger
                ? 'text-red-600 dark:text-red-400'
                : 'text-zinc-900 dark:text-white'
            }`}
          >
            {item.title}
          </p>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {item.description}
          </p>
        </div>
      </div>

      {item.type === 'toggle' && (
        <button
          onClick={() => onToggle(item.key as 'darkMode' | 'notifications')}
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
      )}

      {item.type === 'select' && (
        <select
          value={item.value as string}
          onChange={(e) => onSelect(item.key, e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition outline-none hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {item.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {item.type === 'button' && (
        <button
          onClick={item.onClick}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
            isDanger
              ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30'
              : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          {isDanger ? item.title.split(' ')[0] : 'Open'}
        </button>
      )}
    </div>
  )
}
