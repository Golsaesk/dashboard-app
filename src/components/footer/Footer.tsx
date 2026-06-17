'use client'

import { FooterItem } from '@/config/footer.config'
import { useRouter, usePathname } from 'next/navigation'
import { AddTransactionSheet } from '@/components/transaction/AddTransactionSheet'

type Props = {
  items: FooterItem[]
}

export default function Footer({ items }: Props) {
  const router = useRouter(),
    pathname = usePathname()

  return (
    <div className="bg-card/95 fixed bottom-0 left-0 z-40 flex w-full justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_-4px_rgb(0_0_0_/_0.10)] backdrop-blur-md dark:shadow-[0_-4px_20px_-4px_rgb(0_0_0_/_0.4)]">
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
            className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                isActive ? 'bg-primary/10' : ''
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span>{item.lable}</span>
          </button>
        )
      })}
    </div>
  )
}
