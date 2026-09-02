import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/sonner'
import { GoogleAnalytics } from '@/components/website/google-analytics'
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

const agatho = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
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
      { url: '/images/T_logo.png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/T_logo.png',
    apple: '/images/T_logo.png',
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
        <GoogleAnalytics />
        {children}
        <Toaster position="top-center" richColors closeButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
