'use client'
import { useState } from 'react'
import MenuContent from './MenuContent'
import { Bell, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/data/menu/menu.config'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/reports': 'Reports',
  '/income': 'Income',
  '/outcome': 'Outcome',
  '/setting': 'Setting',
  '/profile': 'Profile',
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false),
    pathname = usePathname(),
    title = titles[pathname] || 'Dashboard'

  function HandleToggleMenu() {
    setIsMenuOpen((prev) => !prev)
  }
  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <div className="flex items-center justify-between p-6 text-white">
      <div className="flex items-center gap-6">
        <div className="hover text-black" onClick={HandleToggleMenu}>
          <Menu
            size={24}
            className="hover:text-green text-gray-500 transition-colors"
          />
          <div
            className={`fixed top-0 right-0 h-full w-full transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} `}
          >
            <MenuContent
              items={menuItems}
              isOpen={isMenuOpen}
              onClose={closeMenu}
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black">{title}</h1>
          <p className="text-sm text-gray-500">Welcome back, John Doe!👋</p>
        </div>
      </div>
      <div>
        <Bell
          size={24}
          className="hover:text-green text-gray-500 transition-colors"
        />
      </div>
    </div>
  )
}
