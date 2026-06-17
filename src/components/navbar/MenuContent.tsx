'use client'

import { MenuItem } from '@/type/menu'
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
          className={`bg-card fixed top-0 left-0 z-50 h-screen w-72 shadow-xl transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="border-border flex items-center gap-2 border-b px-5 py-5">
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full">
              <span className="text-sm font-bold">F</span>
            </div>
            <span className="text-foreground text-lg font-semibold">
              Finova
            </span>
          </div>

          <div className="flex flex-col gap-1 p-4">
            {items.map((item, i) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              if (item.type === 'add') {
                return (
                  <button
                    key={i}
                    className="text-foreground hover:bg-accent flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
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
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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
    <aside className="border-border bg-card sticky top-0 z-50 hidden h-screen w-24 flex-col items-center gap-3 border-r py-6 lg:flex">
      <div className="bg-primary text-primary-foreground mb-4 flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm">
        <span className="text-base font-bold">F</span>
      </div>

      <div className="flex flex-1 flex-col items-center gap-3">
        {items.map((item, i) => {
          const Icon = item.icon

          if (item.type === 'add') {
            return (
              <div key="add" className="mt-2">
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
              title={item.label}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon size={20} />
              <span className="bg-foreground text-background pointer-events-none absolute left-full ml-3 scale-95 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
