import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'P360 — Marketing Analytics Dashboard',
  description: 'All-in-one marketing analytics platform for agencies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-sans), sans-serif', background: '#05070d', color: '#f0f2ff', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
