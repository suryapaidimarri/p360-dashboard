import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alloy Intelligence — Marketing Analytics Platform',
  description: 'Partnership analytics and marketing intelligence platform by Alloy',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
