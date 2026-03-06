import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '⚡ Lightning Kabileshwar – Birthday Race!',
  description: 'Happy 6th Birthday Kabileshwar! Race through 7 stages and collect family wishes!',
  viewport: 'width=device-width, initial-scale=1, user-scalable=no',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
