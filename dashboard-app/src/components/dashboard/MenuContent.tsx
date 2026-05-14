import { MenuItem } from '@/data/menu'
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
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'} `}
      />

      {/* menu panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
      >
        <div className="space-y-3 p-4">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="flex cursor-pointer items-center gap-3 rounded p-3 hover:bg-gray-100"
              >
                <Icon size={18} />
                <span>{item.lable}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
