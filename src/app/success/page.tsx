'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const slug = params.get('slug') || ''
  const name = params.get('name') || 'your child'
  const gameUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/play/${slug}`
    : `/play/${slug}`

  function copyLink() {
    navigator.clipboard.writeText(gameUrl)
    alert('Link copied! 🎉')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 30%,#1e0042,#080010)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.8rem,6vw,3rem)', color: '#d8b4fe', marginBottom: 12, textShadow: '0 0 40px #9333ea' }}>
        Game Created!
      </h1>
      <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1.3rem', color: 'rgba(255,255,255,0.8)', marginBottom: 32, maxWidth: 400 }}>
        {name}'s birthday race is ready to play! 🚗⚡<br />Share this link with them:
      </p>

      {/* Link box */}
      <div style={{ background: '#1a0030', border: '2px solid #9333ea', borderRadius: 16, padding: '16px 24px', maxWidth: 480, width: '100%', marginBottom: 20, wordBreak: 'break-all', fontFamily: "'Boogaloo',cursive", fontSize: '1rem', color: '#d8b4fe' }}>
        {gameUrl}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
        <button onClick={copyLink}
          style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1rem', background: 'linear-gradient(135deg,#9333ea,#6b21a8)', color: '#fff', border: 'none', borderRadius: 40, padding: '13px 28px', cursor: 'pointer', boxShadow: '0 6px 0 #3b0764', letterSpacing: 1 }}>
          📋 Copy Link
        </button>
        <Link href={`/play/${slug}`}
          style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1rem', background: 'linear-gradient(135deg,#059669,#047857)', color: '#fff', borderRadius: 40, padding: '13px 28px', textDecoration: 'none', boxShadow: '0 6px 0 #065f46', letterSpacing: 1 }}>
          🎮 Play Now!
        </Link>
      </div>

      <Link href="/create"
        style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
        + Create another game
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', padding: 40 }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
