import { MenuItem } from '@/data/menu/menu'
import { useRouter } from 'next/navigation'

type props = {
  items: MenuItem[]
  isOpen: boolean
  onClose: () => void
}

export default function MenuContent({ items, onClose, isOpen }: props) {
  const router = useRouter()

  function handleNavigate(path: string) {
    router.push(path)
    onClose()
  }
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 transition-opacity duration-500 ${isOpen ? 'opacity-500' : 'pointer-events-none opacity-0'} `}
      />
      <div className={` ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}>
        <div className="space-y-3 p-4">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="flex cursor-pointer items-center gap-3 rounded p-3 text-base transition-all duration-500 hover:bg-gray-500 hover:text-lg"
              >
                <Icon size={18} className="text-white" />
                <span className="text-white">{item.lable}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
