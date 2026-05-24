'use client'

import { SettingItem } from "@/data/setting/setting"


type Props = {
  item: SettingItem
  onToggle: (key: 'darkMode' | 'notifications') => void
}

export default function SettingsItem({ item, onToggle }: Props) {
  const Icon = item.icon

  return (
    <div className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-none dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Icon size={20} />
        </div>

        <div>
          <p className="font-medium text-zinc-900 dark:text-white">
            {item.title}
          </p>
          <p className="text-sm text-zinc-500">{item.description}</p>
        </div>
      </div>

      {item.type === 'toggle' ? (
        <button
          onClick={() => onToggle(item.key)}
          className={`relative h-8 w-14 rounded-full transition ${
            item.value ? 'bg-black dark:bg-white' : 'bg-zinc-300'
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all dark:bg-black ${
              item.value ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      ) : (
        <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-black">
          Open
        </button>
      )}
    </div>
  )
}
