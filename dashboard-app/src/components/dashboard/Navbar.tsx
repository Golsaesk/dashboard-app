'use client'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import MenuContent from './MenuContent'
import { menuItems } from '@/data/menu.config'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function HandleToggleMenu() {
    setIsMenuOpen((prev) => !prev)
  }
  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <div className="flex items-center justify-between bg-gray-100 p-6 text-white">
      <div>
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
      </div>
      <div className="hover text-black" onClick={HandleToggleMenu}>
        <Menu className="hover:text-green text-gray-500 transition-colors" />
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
    </div>
  )
}
