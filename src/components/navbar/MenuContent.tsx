'use client'

import { MenuItem } from '@/data/menu/menu'
import { useRouter, usePathname } from 'next/navigation'
import { AddTransactionSheet } from '@/components/transaction/AddTransactionSheet'

type Props = {
  items: MenuItem[]
  isOpen?: boolean
  onClose?: () => void
  mode: 'mobile' | 'desktop'
}

export default function MenuContent({ items, isOpen, onClose, mode }: Props) {
  const router = useRouter(),
    pathname = usePathname()

  if (!Array.isArray(items)) return null

  if (mode === 'mobile') {
    return (
      <>
        <div
          onClick={onClose}
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        <aside
          className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-xl transition-transform dark:bg-zinc-900 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-1 p-5">
            {items.map((item, i) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              if (item.type === 'add') {
                return (
                  <button
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                )
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (item.path) router.push(item.path)
                    onClose?.()
                  }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </aside>
      </>
    )
  }

  return (
    <aside className="sticky top-0 z-50 hidden h-screen w-64 flex-col border-r border-zinc-200 bg-white lg:flex dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
        <span className="text-lg font-semibold text-zinc-900 dark:text-white">
          Finance
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {items.map((item, i) => {
          const Icon = item.icon

          if (item.type === 'add') {
            return (
              <div key="add" className="my-2">
                <AddTransactionSheet />
              </div>
            )
          }

          const isActive = pathname === item.path
          const handleClick = () => {
            if (item.path) router.push(item.path)
          }

          return (
            <button
              key={i}
              onClick={handleClick}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
