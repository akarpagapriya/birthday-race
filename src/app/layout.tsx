import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '⚡ Birthday Race — Personalised Birthday Games for Kids!',
  description: 'Create a personalised birthday race game for your child with family photos and wishes inside gift boxes!',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
