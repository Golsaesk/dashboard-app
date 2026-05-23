'use client'

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import { footerItems } from '@/data/footer/footer.config'
import { ProtectedRoute } from '@/components/protectedRoute/ProtectedRoute'
import MenuContent from '@/components/navbar/MenuContent'
import { menuItems } from '@/data/menu/menu.config'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50">
      {/* 🧠 SIDEBAR (desktop only) */}
      <aside className="hidden lg:block lg:w-64">
        <MenuContent items={menuItems} isOpen={true} onClose={() => {}} />
      </aside>

      {/* 🧠 MAIN CONTENT */}
      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 pb-16">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>

        <Footer items={footerItems} />
      </div>
    </div>
  )
}
