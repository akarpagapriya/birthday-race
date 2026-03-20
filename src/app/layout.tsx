import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Birthday Race — Personalised Birthday Game for Kids',
  description: 'Create a personalised birthday racing game in 5 minutes! Your child races through stages to unlock real family photos and wishes hidden inside gift boxes. Free · Works on any phone.',
  keywords: ['birthday game', 'kids birthday', 'personalised birthday', 'birthday race', 'family wishes'],

  openGraph: {
    title: 'Birthday Race — A game made just for your child!',
    description: 'Race through stages · Unlock family wishes · Real photos inside gift boxes 🎁',
    url: 'https://birthday-race.vercel.app',
    siteName: 'Birthday Race',
    images: [{
      url: 'https://birthday-race.vercel.app/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Birthday Race — Personalised Birthday Game for Kids',
    }],
    type: 'website',
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Race — Personalised Birthday Game',
    description: 'Create a racing game with real family photos for your child\'s birthday! Free & takes 5 mins.',
    images: ['https://birthday-race.vercel.app/og-image.png'],
  },

  themeColor: '#9333ea',
icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-title" content="BdayRace" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Boogaloo&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}