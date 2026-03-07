'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BuilderState, WishEntry, AVATARS, THEME_COLORS } from '@/lib/types'
import { saveGame } from '@/lib/gameService'

const STAGE_LABELS = [
  'Family Member 1', 'Family Member 2', 'Family Member 3',
  'Family Member 4', 'Family Member 5', 'Family Member 6', 'Grand Finale 🏆'
]

const defaultWishes = (): WishEntry[] =>
  Array.from({ length: 7 }, (_, i) => ({
    stage: i + 1,
    from_name: '',
    avatar: AVATARS[i] || '🎁',
    short_wish: '',
  }))

export default function CreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [state, setState] = useState<BuilderState>({
    child_name: '',
    age: 5,
    theme_color: '#9333ea',
    wishes: defaultWishes(),
  })

  const col = state.theme_color

  function updateWish(idx: number, field: keyof WishEntry, value: string) {
    const updated = [...state.wishes]
    updated[idx] = { ...updated[idx], [field]: value }
    setState(s => ({ ...s, wishes: updated }))
  }

  function handlePhoto(idx: number, file: File) {
    const preview = URL.createObjectURL(file)
    const updated = [...state.wishes]
    updated[idx] = { ...updated[idx], photo_file: file, photo_preview: preview }
    setState(s => ({ ...s, wishes: updated }))
  }

  async function handlePublish() {
    setLoading(true); setError('')
    const filled = state.wishes.filter(w => w.from_name.trim() && w.short_wish.trim())
    if (filled.length < 1) { setError('Please add at least 1 family member wish!'); setLoading(false); return }
    const finalState = { ...state, wishes: filled }
    const slug = await saveGame(finalState)
    if (!slug) { setError('Something went wrong. Please try again!'); setLoading(false); return }
    router.push(`/success?slug=${slug}&name=${encodeURIComponent(state.child_name)}`)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#1a0030', border: `2px solid ${col}44`,
    borderRadius: 12, padding: '12px 16px', color: '#fff',
    fontFamily: "'Boogaloo',cursive", fontSize: '1.1rem', outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Racing Sans One',cursive", fontSize: '0.8rem',
    letterSpacing: 2, color: `${col}cc`, textTransform: 'uppercase', marginBottom: 6, display: 'block',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%,#1e0042,#080010)', padding: '24px 16px', overflowY: 'scroll', height: '100vh' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎁</div>
          <h1 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.6rem,5vw,2.4rem)', color: col, textShadow: `0 0 30px ${col}88`, marginBottom: 8 }}>
            Create a Birthday Game
          </h1>
          <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' }}>
            Make a personalised race game for your child! 🚗⚡
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {['Child Info', 'Wishes', 'Photos', 'Preview'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <div style={{ width: 24, height: 2, background: step > i ? col : '#2a0050', borderRadius: 2 }} />}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step === i + 1 ? col : step > i + 1 ? col + '88' : '#1a0030',
                border: `2px solid ${step >= i + 1 ? col : '#2a0050'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: '#fff',
                fontWeight: 'bold',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'linear-gradient(145deg,#120024,#1a0036)', border: `2px solid ${col}44`, borderRadius: 24, padding: '28px 24px', boxShadow: `0 0 60px ${col}22` }}>

          {/* ── STEP 1: Child Info ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.4rem', color: '#fff', marginBottom: 4 }}>
                🧒 About the Birthday Child
              </h2>

              <div>
                <label style={labelStyle}>Child's Name</label>
                <input style={inputStyle} placeholder="e.g. Kabileshwar"
                  value={state.child_name}
                  onChange={e => setState(s => ({ ...s, child_name: e.target.value }))}
                />
              </div>

              <div>
                <label style={labelStyle}>Age they're turning</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onClick={() => setState(s => ({ ...s, age: n }))}
                      style={{ width: 48, height: 48, borderRadius: 12, border: `2px solid ${state.age === n ? col : '#2a0050'}`, background: state.age === n ? col : '#1a0030', color: '#fff', fontFamily: "'Boogaloo',cursive", fontSize: '1.2rem', cursor: 'pointer' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Theme Colour</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {THEME_COLORS.map(tc => (
                    <button key={tc.value} onClick={() => setState(s => ({ ...s, theme_color: tc.value }))}
                      title={tc.label}
                      style={{ width: 40, height: 40, borderRadius: '50%', background: tc.value, border: `3px solid ${state.theme_color === tc.value ? '#fff' : 'transparent'}`, cursor: 'pointer', boxShadow: state.theme_color === tc.value ? `0 0 12px ${tc.value}` : 'none' }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Wishes ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h2 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.4rem', color: '#fff', marginBottom: 4 }}>
                💜 Family Wishes
              </h2>
              <p style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: -16 }}>
                Add up to 7 family members. Each wish unlocks after a race stage! Fill as many as you like.
              </p>
              {state.wishes.map((w, i) => (
                <div key={i} style={{ background: '#0e001e', borderRadius: 16, padding: '16px', border: `1px solid ${col}33` }}>
                  <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.75rem', color: col, letterSpacing: 2, marginBottom: 12 }}>
                    STAGE {i + 1} — {STAGE_LABELS[i]}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                    {/* Avatar picker */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                      {AVATARS.map(av => (
                        <button key={av} onClick={() => updateWish(i, 'avatar', av)}
                          style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${w.avatar === av ? col : '#2a0050'}`, background: w.avatar === av ? col + '44' : '#1a0030', fontSize: '1.2rem', cursor: 'pointer' }}>
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input style={inputStyle} placeholder="Who is this from? (e.g. Paati, Amma, Anna...)"
                      value={w.from_name}
                      onChange={e => updateWish(i, 'from_name', e.target.value)}
                    />
                    <input style={inputStyle} placeholder="Short wish — 1 line! (e.g. You are my shining star! ⭐)"
                      value={w.short_wish}
                      onChange={e => updateWish(i, 'short_wish', e.target.value)}
                      maxLength={60}
                    />
                    <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
                      {w.short_wish.length}/60
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 3: Photos ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.4rem', color: '#fff', marginBottom: 4 }}>
                📸 Add Photos
              </h2>
              <p style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: -12 }}>
                Optional! Add a photo for each family member — it reveals inside the gift box! 🎁
              </p>
              {state.wishes.filter(w => w.from_name.trim()).map((w, i) => {
                const realIdx = state.wishes.findIndex(x => x.stage === w.stage)
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#0e001e', borderRadius: 16, padding: 16, border: `1px solid ${col}33` }}>
                    {/* Preview */}
                    <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${col}`, flexShrink: 0, background: '#1a0030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                      {w.photo_preview
                        ? <img src={w.photo_preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                        : w.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.85rem', color: col, marginBottom: 8 }}>
                        Stage {w.stage} — {w.from_name}
                      </div>
                      <label style={{ display: 'inline-block', background: col + '33', border: `2px solid ${col}66`, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontFamily: "'Boogaloo',cursive", color: '#fff', fontSize: '0.95rem' }}>
                        {w.photo_preview ? '🔄 Change Photo' : '📷 Upload Photo'}
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => { if (e.target.files?.[0]) handlePhoto(realIdx, e.target.files[0]) }}
                        />
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── STEP 4: Preview ── */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.4rem', color: '#fff', marginBottom: 4 }}>
                🎮 Ready to Launch!
              </h2>

              {/* Summary card */}
              <div style={{ background: '#0e001e', borderRadius: 16, padding: 20, border: `2px solid ${col}55` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🎂</div>
                  <div>
                    <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.4rem', color: col }}>{state.child_name || 'Your Child'}</div>
                    <div style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>Turning {state.age} 🎉</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {state.wishes.filter(w => w.from_name.trim()).map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: col + '15', borderRadius: 10 }}>
                      <span style={{ fontSize: '1.3rem' }}>{w.avatar}</span>
                      <span style={{ fontFamily: "'Boogaloo',cursive", color: '#fff', fontSize: '0.95rem', flex: 1 }}>{w.from_name}</span>
                      {w.photo_preview && <span style={{ fontSize: '1rem' }}>📸</span>}
                      <span style={{ fontFamily: "'Boogaloo',cursive", color: col, fontSize: '0.8rem' }}>Stage {w.stage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ background: '#ff000022', border: '2px solid #ff4444', borderRadius: 12, padding: '12px 16px', fontFamily: "'Boogaloo',cursive", color: '#ff8888', fontSize: '1rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handlePublish} disabled={loading}
                style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.2rem', background: loading ? '#3a0070' : `linear-gradient(135deg,${col},#6b21a8)`, color: '#fff', border: 'none', borderRadius: 50, padding: '16px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: `0 6px 0 #3b0764`, letterSpacing: 1, width: '100%' }}>
                {loading ? '⏳ Creating your game...' : '🚀 PUBLISH THE GAME!'}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)}
                style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1rem', background: 'transparent', border: `2px solid ${col}55`, color: col, borderRadius: 40, padding: '10px 24px', cursor: 'pointer' }}>
                ← Back
              </button>
            ) : <div />}

            {step < 4 && (
              <button onClick={() => {
                if (step === 1 && !state.child_name.trim()) { setError('Please enter the child\'s name!'); return }
                setError(''); setStep(s => s + 1)
              }}
                style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1rem', background: `linear-gradient(135deg,${col},#6b21a8)`, color: '#fff', border: 'none', borderRadius: 40, padding: '12px 32px', cursor: 'pointer', boxShadow: `0 4px 0 #3b0764`, letterSpacing: 1 }}>
                Next →
              </button>
            )}
          </div>
          {error && step !== 4 && (
            <div style={{ marginTop: 12, fontFamily: "'Boogaloo',cursive", color: '#ff8888', fontSize: '0.95rem', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
