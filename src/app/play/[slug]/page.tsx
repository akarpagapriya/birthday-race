'use client'
import React, { useEffect, useState } from 'react'
import { loadGame } from '@/lib/gameService'
import Game from '@/components/Game'
import { Wish } from '@/components/gameData'

interface Props { params: Promise<{ slug: string }> }

export default function PlayPage({ params }: Props) {
  const { slug } = React.use(params)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
const [gameData, setGameData] = useState<{ childName: string; age?: number; carColor: string; kidPhotoUrl?: string; wishes: Wish[] } | null>(null)
  useEffect(() => {
    async function fetchGame() {
      const result = await loadGame(slug)
      if (!result) { setNotFound(true); setLoading(false); return }
      const { game, wishes } = result
      const mapped: Wish[] = wishes.map((w: any, i: number) => ({
        from: w.from_name,
        av: w.avatar,
        color: ['#c084fc', '#fde68a', '#e879f9', '#6ee7b7', '#93c5fd', '#fca5a5', '#fde68a'][i % 7],
        tag: i < wishes.length - 1 ? `Stage ${w.stage} Complete! 🏁` : '🏁 CHAMPION! All Done!',
        photo: w.photo_url || null,
        text: w.short_wish,
      }))
      setGameData({
        childName: game.child_name,
        age: game.age,
        carColor: game.car_color ?? '#9333ea',
        kidPhotoUrl: game.kid_photo_url ?? undefined,
        wishes: mapped,
      })
      setLoading(false)
    }
    fetchGame() 
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080010', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: '4rem', animation: 'spin 1s linear infinite' }}>🏎️</div>
      <p style={{ fontFamily: "'Racing Sans One',cursive", color: '#d8b4fe', fontSize: '1.4rem', letterSpacing: 3 }}>ENGINES STARTING...</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#080010', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: '4rem' }}>🚧</div>
      <h1 style={{ fontFamily: "'Racing Sans One',cursive", color: '#f87171', fontSize: '2rem' }}>ROAD CLOSED!</h1>
      <p style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>This birthday game link is invalid or has expired.</p>
      <a href="/create" style={{ fontFamily: "'Racing Sans One',cursive", background: 'linear-gradient(135deg,#9333ea,#6b21a8)', color: '#fff', borderRadius: 40, padding: '13px 28px', textDecoration: 'none', letterSpacing: 1 }}>
        Create a New Game
      </a>
    </div>
  )

  return <Game customData={gameData!} />
}
