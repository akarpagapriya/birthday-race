'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'race2024'  // ← change this to whatever you want!

interface GameRow {
  id: string
  slug: string
  child_name: string
  age: number
  car_color: string
  created_at: string
  wish_count?: number
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [games, setGames] = useState<GameRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
      setPw('')
    }
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    async function fetchGames() {
      // Load games
      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })

      if (!gamesData) { setLoading(false); return }

      // Load wish counts
      const { data: wishData } = await supabase
        .from('wishes')
        .select('game_id')

      const countMap: Record<string, number> = {}
      wishData?.forEach(w => {
        countMap[w.game_id] = (countMap[w.game_id] || 0) + 1
      })

      setGames(gamesData.map(g => ({ ...g, wish_count: countMap[g.id] || 0 })))
      setLoading(false)
    }
    fetchGames()
  }, [authed])

  const filtered = games.filter(g =>
    g.child_name.toLowerCase().includes(search.toLowerCase())
  )

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  // ── PASSWORD SCREEN ──
  if (!authed) return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 30%,#1e0042,#06000f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Nunito',sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        background: 'rgba(0,0,0,0.4)',
        border: '1.5px solid rgba(147,51,234,0.35)',
        borderRadius: 24, padding: '32px 28px',
        backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 20px #9333ea)' }}>🔐</div>
        <div style={{
          fontFamily: "'Racing Sans One',cursive",
          fontSize: '1.2rem', color: '#fff', letterSpacing: 2, textAlign: 'center',
        }}>ADMIN ACCESS</div>
        <div style={{
          fontFamily: "'Boogaloo',cursive",
          fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center',
        }}>Enter the admin password to view all games</div>

        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setPwError(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          style={{
            width: '100%', padding: '12px 16px',
            background: 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${pwError ? '#f87171' : 'rgba(147,51,234,0.35)'}`,
            borderRadius: 12, color: '#fff',
            fontFamily: "'Boogaloo',cursive", fontSize: '1rem',
            outline: 'none', textAlign: 'center', letterSpacing: 4,
          }}
          autoFocus
        />

        {pwError && (
          <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.85rem', color: '#f87171' }}>
            ❌ Wrong password!
          </div>
        )}

        <button onClick={handleLogin} style={{
          width: '100%',
          fontFamily: "'Racing Sans One',cursive", fontSize: '1rem',
          background: 'linear-gradient(135deg,#9333ea,#6b21a8)',
          color: '#fff', border: 'none', borderRadius: 40,
          padding: '13px', cursor: 'pointer', letterSpacing: 2,
          boxShadow: '0 5px 0 #3b0764',
        }}>
          🔓 ENTER
        </button>

        <Link href="/" style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
    </div>
  )
  async function deleteGame(id: string, slug: string) {
    if (!confirm('Delete this game? This cannot be undone! 🗑️')) return

    // Delete photos from storage
    const { data: files } = await supabase.storage.from('photos').list(slug)
    if (files && files.length > 0) {
      const paths = files.map(f => `${slug}/${f.name}`)
      await supabase.storage.from('photos').remove(paths)
    }

    // Delete game row (wishes cascade automatically)
    const { error } = await supabase.from('games').delete().eq('id', id)
    if (error) { alert('Delete failed! Check console.'); console.error(error); return }

    // Remove from local state instantly
    setGames(prev => prev.filter(g => g.id !== id))
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div style={{
      minHeight: '100vh',
      height: '100dvh',
      overflowY: 'scroll',
      background: 'radial-gradient(ellipse at 50% 0%,#1e0042,#06000f)',
      padding: '32px 20px 60px',
      fontFamily: "'Nunito',sans-serif",
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.4rem,5vw,2rem)', color: '#fff', letterSpacing: 2 }}>
              🏁 Admin Dashboard
            </div>
            <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {games.length} game{games.length !== 1 ? 's' : ''} created total
            </div>
          </div>
          <Link href="/" style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            ← Home
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Total Games', value: games.length, icon: '🎮' },
            { label: 'Total Wishes', value: games.reduce((a, g) => a + (g.wish_count || 0), 0), icon: '💜' },
            { label: 'This Month', value: games.filter(g => new Date(g.created_at).getMonth() === new Date().getMonth()).length, icon: '📅' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(147,51,234,0.1)',
              border: '1.5px solid rgba(147,51,234,0.25)',
              borderRadius: 16, padding: '14px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.2rem,4vw,1.8rem)', color: '#c084fc' }}>{s.value}</div>
              <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by child name..."
          style={{
            width: '100%', padding: '12px 16px', marginBottom: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1.5px solid rgba(147,51,234,0.3)',
            borderRadius: 12, color: '#fff',
            fontFamily: "'Boogaloo',cursive", fontSize: '1rem',
            outline: 'none',
          }}
        />

        {/* Games list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontFamily: "'Racing Sans One',cursive", color: '#9333ea', letterSpacing: 2 }}>
            LOADING GAMES...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem' }}>
            No games found 🏁
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((g, i) => (
              <div key={g.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'linear-gradient(100deg,rgba(147,51,234,0.1),rgba(0,0,0,0.25))',
                border: '1.5px solid rgba(147,51,234,0.2)',
                borderRadius: 16, padding: '14px 16px',
                position: 'relative', overflow: 'hidden',
              }}>

                {/* Left color bar */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: g.car_color, borderRadius: '16px 0 0 16px' }} />

                {/* Row number */}
                <div style={{ flexShrink: 0, fontFamily: "'Racing Sans One',cursive", fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', width: 20, textAlign: 'right' }}>
                  {i + 1}
                </div>

                {/* Car color dot */}
                <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: g.car_color, boxShadow: `0 0 12px ${g.car_color}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  🏎️
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(0.85rem,2.5vw,1rem)', color: '#fff' }}>
                      {g.child_name}
                    </div>
                    <div style={{ background: `${g.car_color}22`, border: `1px solid ${g.car_color}55`, borderRadius: 20, padding: '1px 8px', fontFamily: "'Racing Sans One',cursive", fontSize: '0.6rem', color: g.car_color }}>
                      AGE {g.age}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '1px 8px', fontFamily: "'Boogaloo',cursive", fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                      💜 {g.wish_count} wish{g.wish_count !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                    📅 {formatDate(g.created_at)}
                  </div>
                </div>

{/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Link href={`/play/${g.slug}`} target="_blank" style={{
                    fontFamily: "'Racing Sans One',cursive", fontSize: '0.72rem',
                    background: `${g.car_color}22`, border: `1.5px solid ${g.car_color}55`,
                    color: g.car_color, borderRadius: 30, padding: '7px 14px',
                    textDecoration: 'none', letterSpacing: 1, whiteSpace: 'nowrap',
                  }}>
                    ▶ PLAY
                  </Link>
                  <button onClick={() => deleteGame(g.id, g.slug)} style={{
                    fontFamily: "'Racing Sans One',cursive", fontSize: '0.72rem',
                    background: 'rgba(248,113,113,0.1)', border: '1.5px solid rgba(248,113,113,0.35)',
                    color: '#f87171', borderRadius: 30, padding: '7px 12px',
                    cursor: 'pointer', letterSpacing: 1, whiteSpace: 'nowrap',
                  }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}