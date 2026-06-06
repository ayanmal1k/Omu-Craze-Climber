import type { Metadata } from 'next'
import { Press_Start_2P, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Omu Climber - Endless 2D Retro Climber',
  description: 'Scale the platforms and collect spinning gold coins in this pixel-art arcade climber.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
