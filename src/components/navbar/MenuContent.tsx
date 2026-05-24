'use client'

import { MenuItem } from '@/data/menu/menu'
import { useRouter, usePathname } from 'next/navigation'
import { AddTransactionSheet } from '../transaction/AddTransactionSheet'

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
          className={`fixed inset-0 z-40 bg-black/50 transition ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        <aside
          className={`fixed top-0 left-0 z-50 h-screen w-full bg-white transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-2 p-6">
            {items.map((item, i) => {
              const Icon = item.icon

              if (item.type === 'add') {
                const active = pathname === item.path

                return (
                  <button key={i} className="">
                    <Icon size={20} />
                    {item.label}
                  </button>
                )
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    onClose?.()
                  }}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 text-zinc-700 hover:bg-zinc-100"
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
    <aside className="sticky top-0 z-50 hidden h-screen w-64 border-r bg-white lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        {items.map((item, i) => {
          const Icon = item.icon

          if (item.type === 'add') {
            return (
              <div key="add" className="-translate-y-6 p-4">
                <AddTransactionSheet />
              </div>
            )
          }

          const handleClick = () => {
            if (item.path) {
              router.push(item.path)
            }
          }

          return (
            <button
              key={i}
              onClick={handleClick}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-zinc-700 hover:bg-zinc-100"
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
