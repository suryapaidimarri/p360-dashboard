import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'P360 — Partnership Marketing Dashboard',
  description: 'All-in-one marketing analytics platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
