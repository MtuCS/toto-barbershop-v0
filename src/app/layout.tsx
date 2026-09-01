import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-oswald',
  display: 'swap',
})

const agatho = localFont({
  src: '../../public/font/Agatho_ Medium.otf',
  weight: '500',
  variable: '--font-agatho-local',
  display: 'swap',
})

const akira = localFont({
  src: '../../public/font/Akira_Expanded.otf',
  weight: '800',
  variable: '--font-akira-local',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Toto Barbershop — Barber. Culture. Craft.',
    template: '%s | Toto Barbershop',
  },
  description:
    'Toto Barbershop — barber culture, grooming, training và merchandise. Cắt tóc chuẩn barber, sản phẩm chăm sóc và đồ streetwear mang tinh thần của tiệm.',
  generator: 'v0.app',
  keywords: [
    'barbershop',
    'barber',
    'cắt tóc nam',
    'grooming',
    'đào tạo barber',
    'merchandise',
    'streetwear',
  ],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#13443B' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`bg-background ${inter.variable} ${oswald.variable} ${agatho.variable} ${akira.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
