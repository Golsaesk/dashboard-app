'use client'
import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import { footerItems } from '@/data/footer/footer.config'
import { QueryProvider } from '@/providers/query-provider'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-auto p-auto mx-auto flex min-h-screen w-full max-w-full flex-col md:max-w-3xl lg:max-w-5xl">
      <Navbar />

      <main className="flex-1 pb-16">
        <QueryProvider>{children}</QueryProvider>
      </main>

      <Footer items={footerItems} />
    </div>
  )
}
