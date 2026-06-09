import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import ThemeProvider from '@/providers/themeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryProvider } from '@/providers/query-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Dashboard — AI Finance Tracker',
    template: '%s | Dashboard',
  },
  description:
    'Track your income and expenses, and get instant AI-powered insights on where your money goes — just like a personal financial advisor.',
  keywords: ['finance', 'budget', 'AI', 'expense tracker', 'personal finance'],
  authors: [{ name: 'Dashboard App' }],
  openGraph: {
    title: 'Dashboard — AI Finance Tracker',
    description: 'Stop guessing. Understand your money with AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
