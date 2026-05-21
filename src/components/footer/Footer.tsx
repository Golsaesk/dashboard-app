'use client'

import { useRouter } from 'next/navigation'
import { FooterItem } from '@/data/footer/footer'
import { AddTransactionSheet } from '../transaction/AddTransactionSheet'

type props = {
  items: FooterItem[]
}

export default function Footer({ items }: props) {
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 flex w-full justify-around rounded-t-xl border-t border-gray-200 bg-gray-100 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon

        if (item.type === 'add') {
          return (
            <div key="add" className="-translate-y-6">
              <AddTransactionSheet />
            </div>
          )
        }

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 p-4 text-sm transition-transform duration-300 hover:scale-110"
          >
            <Icon size={18} />
            <span>{item.lable}</span>
          </button>
        )
      })}
    </div>
  )
}
