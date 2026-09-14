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
    default: 'TOTO Barbershop - Trải nghiệm Barber chưa từng có tại TP.HCM',
    template: '%s | TOTO Barbershop',
  },
  description:
    'Không chỉ là cắt tóc, TOTO gửi gắm sự tỉ mỉ, tử tế và gu sống vào từng đường kéo. Đến TOTO để chỉn chu, thư giãn và tìm lại phong độ vốn có của bạn.',
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
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
