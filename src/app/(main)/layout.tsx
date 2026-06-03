'use client'

import { useMemo, useState } from 'react'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { footerItems } from '@/config/footer.config'
import { desktopMenuItems } from '@/config/menu.config'
import MenuContent from '@/components/navbar/MenuContent'
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [addOpen, setAddOpen] = useState(false),
    menu = useMemo(() => desktopMenuItems(() => setAddOpen(true)), [])

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <MenuContent items={menu} mode="desktop" />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6 pb-20 lg:pb-6">{children}</main>
        <div className="lg:hidden">
          <Footer items={footerItems} />
        </div>
      </div>
    </div>
  )
}
