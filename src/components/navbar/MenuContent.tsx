'use client'

import { MenuItem } from '@/data/menu/menu'
import { useRouter, usePathname } from 'next/navigation'

type Props = {
  items: MenuItem[]
  isOpen?: boolean
  onClose?: () => void
  mode?: 'mobile' | 'desktop'
}

export default function MenuContent({
  items,
  isOpen = false,
  onClose,
  mode = 'desktop',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function navigate(path: string) {
    router.push(path)
    onClose?.()
  }

  return (
    <>
      {/* 🔴 MOBILE OVERLAY */}
      {mode === 'mobile' && (
        <>
          {/* BACKDROP */}
          <div
            onClick={onClose}
            className={`fixed inset-0 bg-black/50 transition-opacity lg:hidden ${
              isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          />

          {/* DRAWER */}
          <aside
            className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col gap-2 p-4">
              {items.map((item) => {
                const Icon = item.icon
                const active = pathname === item.path

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                      active
                        ? 'bg-[#0AA165] text-white'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon size={18} />
                    {item.lable}
                  </button>
                )
              })}
            </div>
          </aside>
        </>
      )}

      {/* 🖥 DESKTOP SIDEBAR */}
      {mode === 'desktop' && (
        <aside className="hidden h-screen w-64 border-r border-zinc-200 bg-white lg:block">
          <div className="flex flex-col gap-2 p-4">
            {items.map((item) => {
              const Icon = item.icon
              const active = pathname === item.path

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    active
                      ? 'bg-[#0AA165] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.lable}
                </button>
              )
            })}
          </div>
        </aside>
      )}
    </>
  )
}
