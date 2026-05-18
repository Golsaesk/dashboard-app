'use client'
import { useRouter } from 'next/navigation'
import { FooterItem } from '@/data/footer/footer'

type props = {
  items: FooterItem[]
}
export default function Footer({ items }: props) {
  const router = useRouter()
  function handleNavigate(path: string) {
    router.push(path)
  }

  return (
    <div className="border-gray-۲00 fixed bottom-0 left-0 flex w-full justify-around rounded-t-xl border-t bg-gray-100 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className="flex cursor-pointer flex-col items-center gap-1 p-4 text-sm text-black transition-all transition-transform duration-500 hover:scale-110"
          >
            <Icon size={18} />
            <span>{item.lable}</span>
          </div>
        )
      })}
    </div>
  )
}
