'use client'

import { useMemo, useState } from 'react'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { footerItems } from '@/config/footer.config'
import { desktopMenuItems } from '@/config/menu.config'
import MenuContent from '@/components/navbar/MenuContent'
import { FilterProvider } from '@/providers/FilterContext'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [addOpen, setAddOpen] = useState(false),
    menu = useMemo(() => desktopMenuItems(() => setAddOpen(true)), [])

  return (
    <FilterProvider>
      <div className="bg-background flex min-h-screen">
        <MenuContent items={menu} mode="desktop" />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 px-4 pb-24 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
            {children}
          </main>
          <div className="lg:hidden">
            <Footer items={footerItems} />
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}
