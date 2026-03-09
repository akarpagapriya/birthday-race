'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BuilderState, WishEntry, AVATARS, CAR_COLORS, STEP_LABELS } from '@/lib/types'
import { saveGame } from '@/lib/gameService'

function defaultWishes(): WishEntry[] {
  return [{ stage: 1, from_name: '', avatar: '👵', short_wish: '' }]
}

export default function CreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nameReaction, setNameReaction] = useState('')
  const [editingIdx, setEditingIdx] = useState(0)
  const [state, setState] = useState<BuilderState>({
    child_name: '', age: 6, car_color: '#9333ea', wishes: defaultWishes(),
  })

  const col = state.car_color
  const carLabel = CAR_COLORS.find(c => c.value === col)?.label ?? 'Purple Rocket'

  function updateWish(idx: number, field: keyof WishEntry, value: string) {
    const updated = [...state.wishes]
    updated[idx] = { ...updated[idx], [field]: value }
    setState(s => ({ ...s, wishes: updated }))
  }

  function handleKidPhoto(file: File) {
    setState(s => ({ ...s, kid_photo_file: file, kid_photo_preview: URL.createObjectURL(file) }))
  }

  function handleWishPhoto(idx: number, file: File) {
    const updated = [...state.wishes]
    updated[idx] = { ...updated[idx], photo_file: file, photo_preview: URL.createObjectURL(file) }
    setState(s => ({ ...s, wishes: updated }))
  }

  function handleNameChange(val: string) {
    setState(s => ({ ...s, child_name: val }))
    if (val.length > 1) {
      const reactions = ['🏎️ VROOM!', '⚡ ZOOM!', '🏁 LET\'S GO!', '🚀 BLAZING!', '🔥 ON FIRE!']
      setNameReaction(reactions[val.length % reactions.length])
    } else {
      setNameReaction('')
    }
  }

  async function handlePublish() {
    setLoading(true); setError('')
    const filled = state.wishes.filter(w => w.from_name.trim() && w.short_wish.trim())
    if (filled.length < 1) { setError('Add at least 1 pit crew member!'); setLoading(false); return }
    const slug = await saveGame({ ...state, wishes: filled })
    if (!slug) { setError('Engine failure! Please try again! 🔧'); setLoading(false); return }
    router.push(`/success?slug=${slug}&name=${encodeURIComponent(state.child_name)}`)
  }

  // Shared styles
  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: `2px solid ${col}55`, borderRadius: 14,
    padding: '13px 18px', color: '#fff',
    fontFamily: "'Boogaloo',cursive", fontSize: '1.15rem', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    fontFamily: "'Racing Sans One',cursive", fontSize: '0.72rem',
    letterSpacing: 3, color: `${col}dd`, textTransform: 'uppercase',
    marginBottom: 7, display: 'block',
  }

  const currentStep = STEP_LABELS[step - 1]

  return (
    <div style={{ height: '100vh', overflowY: 'scroll', background: '#060010' }}>

      {/* ── CHECKERED HEADER ── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '28px 20px 20px', textAlign: 'center' }}>
        {/* Checkered pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(45deg,#fff 25%,transparent 25%),linear-gradient(-45deg,#fff 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#fff 75%),linear-gradient(-45deg,transparent 75%,#fff 75%)',
          backgroundSize: '20px 20px', backgroundPosition: '0 0,0 10px,10px -10px,-10px 0' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 4 }}>🏁</div>
          <h1 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.4rem,5vw,2.2rem)', color: '#fff', margin: 0, letterSpacing: 2 }}>
            BUILD THE ULTIMATE
          </h1>
          <h2 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1rem,4vw,1.6rem)', color: col, margin: '2px 0 0', textShadow: `0 0 20px ${col}`, letterSpacing: 3 }}>
            BIRTHDAY RACE!
          </h2>
        </div>
      </div>

      {/* ── RACE TRACK PROGRESS ── */}
      <div style={{ padding: '0 20px 4px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ position: 'relative', height: 48, background: 'rgba(255,255,255,0.04)', borderRadius: 40, border: `2px solid ${col}33`, overflow: 'hidden' }}>
          {/* track fill */}
          <div style={{ position: 'absolute', inset: 0, width: `${(step / 4) * 100}%`, background: `linear-gradient(90deg,${col}44,${col}22)`, borderRadius: 40, transition: 'width 0.5s cubic-bezier(.36,1.3,.5,1)' }} />
          {/* dashed lane lines */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
            ))}
          </div>
          {/* car emoji racing */}
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `calc(${(step / 4) * 100}% - 28px)`, fontSize: '1.6rem', transition: 'left 0.5s cubic-bezier(.36,1.3,.5,1)', filter: `drop-shadow(0 0 8px ${col})` }}>
            🏎️
          </div>
          {/* step dots */}
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `${(n / 4) * 100 - 6}%`, width: 12, height: 12, borderRadius: '50%', background: step >= n ? col : '#1a0030', border: `2px solid ${step >= n ? col : '#2a0050'}`, transition: 'background 0.3s' }} />
          ))}
        </div>
        {/* Step label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingLeft: 4 }}>
          <span style={{ fontSize: '1.4rem' }}>{currentStep.icon}</span>
          <div>
            <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.85rem', color: col, letterSpacing: 2 }}>STEP {step} OF 4 — {currentStep.title}</div>
            <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>{currentStep.sub}</div>
          </div>
        </div>
      </div>

      {/* ── CARD ── */}
      <div style={{ maxWidth: 560, margin: '12px auto 32px', padding: '0 16px' }}>
        <div style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', border: `1.5px solid ${col}33`, borderRadius: 24, padding: '24px 20px', backdropFilter: 'blur(20px)' }}>

          {/* ══ STEP 1: IGNITION ══ */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Name with reaction */}
              <div>
                <label style={lbl}>🏆 Champion's Name</label>
                <div style={{ position: 'relative' }}>
                  <input style={inp} placeholder="e.g. Kabileshwar"
                    value={state.child_name}
                    onChange={e => handleNameChange(e.target.value)}
                  />
                  {nameReaction && (
                    <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Racing Sans One',cursive", fontSize: '0.8rem', color: col, letterSpacing: 1, animation: 'badgePop 0.4s ease-out' }}>
                      {nameReaction} {state.child_name}!
                    </div>
                  )}
                </div>
              </div>

              {/* Age — number plate style */}
              <div>
                <label style={lbl}>🎂 Turning Age</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onClick={() => setState(s => ({ ...s, age: n }))}
                      style={{ width: 52, height: 38, borderRadius: 8, cursor: 'pointer', fontFamily: "'Racing Sans One',cursive", fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.15s',
                        background: state.age === n ? col : 'rgba(255,255,255,0.05)',
                        border: state.age === n ? `2px solid #fff` : `2px solid ${col}33`,
                        color: state.age === n ? '#fff' : 'rgba(255,255,255,0.5)',
                        boxShadow: state.age === n ? `0 4px 0 ${col}88, 0 0 14px ${col}66` : 'none',
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Car color picker */}
              <div>
                <label style={lbl}>🚗 Pick Your Race Car Colour</label>
                <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '-4px 0 10px' }}>
                  This colour changes your car, road glow, and HUD in the game!
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {CAR_COLORS.map(cc => (
                    <button key={cc.value} onClick={() => setState(s => ({ ...s, car_color: cc.value }))}
                      style={{ padding: '10px 6px', borderRadius: 12, cursor: 'pointer', border: `2px solid ${state.car_color === cc.value ? '#fff' : cc.value + '44'}`, background: state.car_color === cc.value ? cc.value + '33' : 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s', boxShadow: state.car_color === cc.value ? `0 0 16px ${cc.value}88` : 'none' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: cc.value, }} />
                      <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.7rem', color: state.car_color === cc.value ? '#fff' : 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.2 }}>{cc.label}</span>
                    </button>
                  ))}
                </div>
                {/* Live preview */}
                <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 14, border: `1px solid ${col}44`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: col, boxShadow: `0 0 20px ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🚗</div>
                  <div>
                    <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.75rem', color: col, letterSpacing: 2 }}>SELECTED</div>
                    <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1rem', color: '#fff' }}>{carLabel}</div>
                  </div>
                </div>
              </div>

              {/* Kid photo upload */}
              <div>
                <label style={lbl}>📸 Birthday Star's Photo <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: 1 }}>(OPTIONAL — shows on winner screen)</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', border: `3px solid ${col}`, overflow: 'hidden', background: '#0e001e', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: `0 0 20px ${col}44` }}>
                    {state.kid_photo_preview
                      ? <img src={state.kid_photo_preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="kid" />
                      : '🏆'}
                  </div>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: `${col}22`, border: `2px dashed ${col}66`, borderRadius: 14, padding: '14px', cursor: 'pointer', fontFamily: "'Boogaloo',cursive", color: '#fff', fontSize: '1rem' }}>
                    {state.kid_photo_preview ? '🔄 Change Photo' : '📷 Upload Photo'}
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { if (e.target.files?.[0]) handleKidPhoto(e.target.files[0]) }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2: PIT CREW ══ */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Crew summary chips */}
              {state.wishes.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {state.wishes.map((w, i) => (
                    <button key={i} onClick={() => setEditingIdx(i)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 40, border: `2px solid ${editingIdx === i ? col : col + '44'}`, background: editingIdx === i ? col + '33' : 'rgba(255,255,255,0.04)', cursor: 'pointer', fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: '#fff', transition: 'all 0.15s' }}>
                      <span>{w.avatar}</span>
                      <span>{w.from_name || `Person ${i + 1}`}</span>
                      {w.from_name && w.short_wish && <span style={{ color: col }}>✓</span>}
                    </button>
                  ))}
                  {state.wishes.length < 7 && (
                    <button onClick={() => {
                      const newEntry: WishEntry = { stage: state.wishes.length + 1, from_name: '', avatar: AVATARS[state.wishes.length % AVATARS.length], short_wish: '' }
                      setState(s => ({ ...s, wishes: [...s.wishes, newEntry] }))
                      setEditingIdx(state.wishes.length)
                    }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 40, border: `2px dashed ${col}55`, background: 'transparent', cursor: 'pointer', fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: col }}>
                      + Add Person
                    </button>
                  )}
                </div>
              )}

              {/* Active editor card */}
              {state.wishes[editingIdx] && (() => {
                const w = state.wishes[editingIdx]
                const i = editingIdx
                return (
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: '20px', border: `1.5px solid ${col}55`, position: 'relative', overflow: 'hidden' }}>
                    {/* Checkered corner */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, opacity: 0.07,
                      backgroundImage: 'linear-gradient(45deg,#fff 25%,transparent 25%),linear-gradient(-45deg,#fff 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#fff 75%),linear-gradient(-45deg,transparent 75%,#fff 75%)',
                      backgroundSize: '10px 10px', backgroundPosition: '0 0,0 5px,5px -5px,-5px 0', borderRadius: '0 20px 0 0' }} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.72rem', color: col, letterSpacing: 3 }}>
                        PIT STOP {i + 1} OF {state.wishes.length}
                      </div>
                      {/* Remove button */}
                      {state.wishes.length > 1 && (
                        <button onClick={() => {
                          const updated = state.wishes.filter((_, idx) => idx !== i).map((w, idx) => ({ ...w, stage: idx + 1 }))
                          setState(s => ({ ...s, wishes: updated }))
                          setEditingIdx(Math.max(0, i - 1))
                        }}
                          style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: "'Boogaloo',cursive", fontSize: '0.8rem', color: '#f87171' }}>
                          Remove ✕
                        </button>
                      )}
                    </div>

                    {/* Avatar picker */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Pick an avatar:</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {AVATARS.map(av => (
                          <button key={av} onClick={() => updateWish(i, 'avatar', av)}
                            style={{ width: 36, height: 36, borderRadius: 10, border: `2px solid ${w.avatar === av ? col : 'transparent'}`, background: w.avatar === av ? col + '33' : 'rgba(255,255,255,0.04)', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.1s' }}>
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Their name — anything works! Mom, Dad, Coach, BFF...</div>
                        <input style={inp} placeholder="e.g. Mom, Dad, Uncle, Best Friend..."
                          value={w.from_name} onChange={e => updateWish(i, 'from_name', e.target.value)} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>One punchy birthday wish — keep it short and fun! ⭐</div>
                        <div style={{ position: 'relative' }}>
                          <input style={{ ...inp, paddingRight: 52 }}
                            placeholder="e.g. You are my shining star! ⭐"
                            value={w.short_wish} onChange={e => updateWish(i, 'short_wish', e.target.value)}
                            maxLength={60} />
                          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Boogaloo',cursive", fontSize: '0.75rem', color: w.short_wish.length > 50 ? '#f59e0b' : 'rgba(255,255,255,0.25)' }}>
                            {w.short_wish.length}/60
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Next person nudge */}
                    {w.from_name && w.short_wish && (
                      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: col }}>
                          ✓ {w.from_name} is ready!
                        </span>
                        {i === state.wishes.length - 1 && state.wishes.length < 7 && (
                          <button onClick={() => {
                            const newEntry: WishEntry = { stage: state.wishes.length + 1, from_name: '', avatar: AVATARS[state.wishes.length % AVATARS.length], short_wish: '' }
                            setState(s => ({ ...s, wishes: [...s.wishes, newEntry] }))
                            setEditingIdx(state.wishes.length)
                          }}
                            style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.8rem', background: col + '22', border: `1.5px solid ${col}66`, color: col, borderRadius: 30, padding: '7px 16px', cursor: 'pointer', letterSpacing: 1 }}>
                            + ADD ANOTHER
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}

              <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', margin: 0, textAlign: 'center' }}>
                {state.wishes.length}/7 crew members added · You can always add more!
              </p>
            </div>
          )}

          {/* ══ STEP 3: PHOTO FINISH ══ */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.55)', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
                Optional! These photos <strong style={{ color: col }}>pop out of the gift box</strong> when your child wins a stage. 🎁
              </p>
              {state.wishes.filter(w => w.from_name.trim()).map((w) => {
                const realIdx = state.wishes.findIndex(x => x.stage === w.stage)
                return (
                  <div key={w.stage} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: '14px', border: `1px solid ${col}22` }}>
                    <div style={{ width: 62, height: 62, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${col}`, flexShrink: 0, background: '#0e001e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: `0 0 12px ${col}55` }}>
                      {w.photo_preview
                        ? <img src={w.photo_preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                        : w.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.75rem', color: col, marginBottom: 6, letterSpacing: 1 }}>
                        PIT STOP {w.stage} · {w.from_name}
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${col}18`, border: `1.5px solid ${col}55`, borderRadius: 10, padding: '9px 14px', cursor: 'pointer', fontFamily: "'Boogaloo',cursive", color: '#fff', fontSize: '0.9rem' }}>
                        {w.photo_preview ? '🔄 Change' : '📷 Add Photo'}
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => { if (e.target.files?.[0]) handleWishPhoto(realIdx, e.target.files[0]) }} />
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ══ STEP 4: RACE DAY ══ */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Trophy header */}
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 4 }}>🏁</div>
                <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.5rem', color: '#fff', letterSpacing: 2 }}>LIGHTS OUT…</div>
                <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.1rem', color: col, letterSpacing: 3, textShadow: `0 0 16px ${col}` }}>AND AWAY WE GO!</div>
              </div>

              {/* Summary */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 18, padding: 18, border: `1.5px solid ${col}44` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: `0 0 20px ${col}` }}>
                    {state.kid_photo_preview
                      ? <img src={state.kid_photo_preview} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="kid" />
                      : '🏆'}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.3rem', color: col }}>{state.child_name || 'Champion'}</div>
                    <div style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Turning {state.age} · {CAR_COLORS.find(c=>c.value===col)?.label} 🚗</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {state.wishes.filter(w => w.from_name.trim()).map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', background: `${col}10`, borderRadius: 10 }}>
                      <span style={{ fontSize: '1.1rem' }}>{w.avatar}</span>
                      <span style={{ fontFamily: "'Boogaloo',cursive", color: '#fff', fontSize: '0.9rem', flex: 1 }}>{w.from_name}</span>
                      {w.photo_preview && <span>📸</span>}
                      <span style={{ fontFamily: "'Racing Sans One',cursive", color: col, fontSize: '0.7rem', letterSpacing: 1 }}>STAGE {w.stage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ background: '#ff000018', border: '1.5px solid #ff4444', borderRadius: 12, padding: '12px 16px', fontFamily: "'Boogaloo',cursive", color: '#ff9999', fontSize: '1rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handlePublish} disabled={loading}
                style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.25rem', background: loading ? '#1a0030' : `linear-gradient(135deg,${col},#6b21a8)`, color: '#fff', border: 'none', borderRadius: 50, padding: '17px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 6px 0 #3b0764, 0 0 30px ${col}55`, letterSpacing: 2, width: '100%', transition: 'all 0.2s' }}>
                {loading ? '⏳ FUELLING UP...' : '🚦 START THE RACE!'}
              </button>
            </div>
          )}

          {/* ── NAV BUTTONS ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
            {step > 1
              ? <button onClick={() => { setError(''); setStep(s => s - 1) }}
                  style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1rem', background: 'transparent', border: `1.5px solid ${col}44`, color: 'rgba(255,255,255,0.6)', borderRadius: 40, padding: '10px 22px', cursor: 'pointer' }}>
                  ← Back
                </button>
              : <div />}
            {step < 4 && (
              <button onClick={() => {
                if (step === 1 && !state.child_name.trim()) { setError("Enter your champion's name first! 🏆"); return }
                setError(''); setStep(s => s + 1)
              }}
                style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1rem', background: `linear-gradient(135deg,${col},#6b21a8)`, color: '#fff', border: 'none', borderRadius: 40, padding: '12px 32px', cursor: 'pointer', boxShadow: `0 4px 0 #3b0764`, letterSpacing: 1 }}>
                NEXT PIT STOP →
              </button>
            )}
          </div>
          {error && step !== 4 && (
            <div style={{ marginTop: 10, fontFamily: "'Boogaloo',cursive", color: '#ff9999', fontSize: '0.95rem', textAlign: 'center' }}>⚠️ {error}</div>
          )}
        </div>
      </div>
    </div>
  )
}
