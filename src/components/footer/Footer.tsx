'use client'

import { FooterItem } from '@/data/footer/footer'
import { useRouter, usePathname } from 'next/navigation'
import { AddTransactionSheet } from '@/components/transaction/AddTransactionSheet'

type Props = {
  items: FooterItem[]
}

export default function Footer({ items }: Props) {
  const router = useRouter(),
    pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 flex w-full justify-around border-t border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      {items.map((item) => {
        const Icon = item.icon

        if (item.type === 'add') {
          return (
            <div key="add" className="-translate-y-5">
              <AddTransactionSheet />
            </div>
          )
        }

        const isActive = pathname === item.path

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-transform duration-200 hover:scale-110 ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <Icon size={20} />
            <span>{item.lable}</span>
          </button>
        )
      })}
    </div>
  )
}
