import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'P360 — Marketing Analytics Dashboard',
  description: 'All-in-one marketing analytics platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
