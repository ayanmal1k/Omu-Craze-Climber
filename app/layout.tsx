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
  weight: ['200', '300', '400', '600', '800', '900'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Omu Studio — Interactive Experiences & Game Design',
  description:
    'A creative studio crafting memorable digital experiences through game design, interactive technology, and bold visuals.',
  icons: {
    icon: '/idle.png',
    apple: '/idle.png',
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
