'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BuilderState, WishEntry, AVATARS, CAR_COLORS, STEP_LABELS } from '@/lib/types'
import { saveGame } from '@/lib/gameService'
import Image from 'next/image'
import raceNotifyheart from '@/assets/race-notify-heart.png'

function defaultWishes(): WishEntry[] {
  return [{ stage: 1, from_name: '', avatar: '💛', short_wish: '' }]
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
    } else setNameReaction('')
  }

  async function handlePublish() {
    setLoading(true); setError('')
    const filled = state.wishes.filter(w => w.from_name.trim() && w.short_wish.trim())
    if (filled.length < 1) { setError('Add at least 1 pit crew member!'); setLoading(false); return }
    const slug = await saveGame({ ...state, wishes: filled })
    if (!slug) { setError('Engine failure! Please try again! 🔧'); setLoading(false); return }
    router.push(`/success?slug=${slug}&name=${encodeURIComponent(state.child_name)}`)
  }

  const inp: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${col}44`,
    borderRadius: 12,
    padding: '12px 16px',
    color: '#fff',
    fontFamily: "'Boogaloo',cursive",
    fontSize: '1.1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const lbl: React.CSSProperties = {
    fontFamily: "'Racing Sans One',cursive",
    fontSize: '0.68rem',
    letterSpacing: 3,
    color: `${col}cc`,
    textTransform: 'uppercase',
    marginBottom: 8,
    display: 'block',
  }

  const currentStep = STEP_LABELS[step - 1]

  return (
    <>
      <style>{`
        @keyframes flagWave {
          0%   { transform: rotate(-6deg) scale(1); }
          100% { transform: rotate(6deg) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        .inp-focus:focus {
          border-color: ${col}99 !important;
          box-shadow: 0 0 0 3px ${col}18;
        }
        .nav-btn-next {
          font-family: 'Racing Sans One', cursive;
          font-size: 1rem;
          color: #fff;
          border: none;
          border-radius: 40px;
          padding: 13px 32px;
          cursor: pointer;
          letter-spacing: 1px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .nav-btn-next:hover { transform: translateY(-2px); }
        .nav-btn-next:active { transform: translateY(1px); }
        .nav-btn-back {
          font-family: 'Boogaloo', cursive;
          font-size: 1rem;
          background: transparent;
          border-radius: 40px;
          padding: 11px 22px;
          cursor: pointer;
          transition: all 0.15s;
          color: rgba(255,255,255,0.5);
        }
        .nav-btn-back:hover { color: rgba(255,255,255,0.8); }
        .age-btn:hover { transform: scale(1.08); }
        .color-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at 50% 0%, #1e0042 0%, #06000f 60%)`,
      }}>

        {/* ── HEADER ── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: 'clamp(20px,5vw,36px) 20px clamp(16px,4vw,24px)',
          textAlign: 'center',
          borderBottom: `1px solid ${col}18`,
        }}>
          {/* Subtle checkered bg */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(45deg,#fff 25%,transparent 25%),linear-gradient(-45deg,#fff 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#fff 75%),linear-gradient(-45deg,transparent 75%,#fff 75%)',
            backgroundSize: '16px 16px', backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Image
              src={raceNotifyheart}
              alt="Birthday Race"
              width={80}
              height={80}
              style={{
                width: 'clamp(56px,14vw,80px)',
                height: 'auto',
                animation: 'flagWave 1.6s ease-in-out infinite alternate',
                marginBottom: 4,
              }}
            />
            <div style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(1.1rem,4vw,1.6rem)',
              color: '#fff', letterSpacing: 2,
            }}>
              BUILD THE ULTIMATE
            </div>
            <div style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(0.8rem,3vw,1.1rem)',
              color: col, letterSpacing: 4,
              textShadow: `0 0 16px ${col}`,
            }}>
              BIRTHDAY RACE 🏁
            </div>
          </div>
        </div>

        {/* ── PROGRESS TRACK ── */}
        <div style={{ padding: '16px 20px 0', maxWidth: 560, margin: '0 auto' }}>

          {/* Track bar */}
          <div style={{
            position: 'relative', height: 44,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 40,
            border: `1px solid ${col}22`,
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            {/* Fill */}
            <div style={{
              position: 'absolute', inset: 0,
              width: `${(step / 4) * 100}%`,
              background: `linear-gradient(90deg,${col}33,${col}18)`,
              borderRadius: 40,
              transition: 'width 0.5s cubic-bezier(.36,1.3,.5,1)',
            }} />
            {/* Lane dashes */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center',
              padding: '0 14px', gap: 5,
            }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 1.5, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
              ))}
            </div>
            {/* Racing car */}
            <div style={{
              position: 'absolute', top: '50%',
              transform: 'translateY(-50%)',
              left: `calc(${(step / 4) * 100}% - 26px)`,
              fontSize: '1.4rem',
              transition: 'left 0.5s cubic-bezier(.36,1.3,.5,1)',
              filter: `drop-shadow(0 0 8px ${col})`,
            }}>🏎️</div>
            {/* Step dots */}
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{
                position: 'absolute', top: '50%',
                transform: 'translateY(-50%)',
                left: `${(n / 4) * 100 - 5.5}%`,
                width: 11, height: 11, borderRadius: '50%',
                background: step >= n ? col : '#1a0030',
                border: `2px solid ${step >= n ? col : '#2a0050'}`,
                transition: 'all 0.3s',
                boxShadow: step >= n ? `0 0 8px ${col}` : 'none',
              }} />
            ))}
          </div>

          {/* Step label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: '1.2rem' }}>{currentStep.icon}</span>
            <div>
              <div style={{
                fontFamily: "'Racing Sans One',cursive",
                fontSize: '0.78rem', color: col, letterSpacing: 2,
              }}>
                {step} / 4 — {currentStep.title}
              </div>
              <div style={{
                fontFamily: "'Boogaloo',cursive",
                fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)',
              }}>
                {currentStep.sub}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CARD ── */}
        <div style={{ maxWidth: 560, margin: '12px auto 0', padding: '0 16px 120px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${col}28`,
            borderRadius: 20,
            padding: 'clamp(18px,4vw,24px)',
            backdropFilter: 'blur(20px)',
          }}>

            {/* ══ STEP 1 ══ */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeUp 0.4s ease-out both' }}>

                {/* Name */}
                <div>
                  <label style={lbl}>🏆 Champion's Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="inp-focus"
                      placeholder='e.g. Kabil'
                      style={inp}
                      value={state.child_name}
                      onChange={e => handleNameChange(e.target.value)}
                    />
                    {nameReaction && (
                      <div style={{
                        position: 'absolute', right: 12, top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: "'Racing Sans One',cursive",
                        fontSize: '0.72rem', color: col, letterSpacing: 1,
                        animation: 'badgePop 0.4s ease-out',
                        whiteSpace: 'nowrap',
                      }}>
                        {nameReaction}
                      </div>
                    )}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label style={lbl}>🎂 Turning Age</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <button
                        key={n}
                        className="age-btn"
                        onClick={() => setState(s => ({ ...s, age: n }))}
                        style={{
                          width: 46, height: 36,
                          borderRadius: 8, cursor: 'pointer',
                          fontFamily: "'Racing Sans One',cursive",
                          fontSize: '1rem', transition: 'all 0.15s',
                          background: state.age === n ? col : 'rgba(255,255,255,0.04)',
                          border: `1.5px solid ${state.age === n ? '#fff4' : col + '22'}`,
                          color: state.age === n ? '#fff' : 'rgba(255,255,255,0.4)',
                          boxShadow: state.age === n ? `0 4px 0 ${col}66, 0 0 12px ${col}55` : 'none',
                        }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Car color */}
                <div>
                  <label style={lbl}>🚗 Race Car Colour</label>
                  <p style={{
                    fontFamily: "'Boogaloo',cursive", fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.35)', margin: '-4px 0 12px',
                  }}>
                    This themes your car, road glow and HUD throughout the game
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {CAR_COLORS.map(cc => (
                      <button
                        key={cc.value}
                        className="color-btn"
                        onClick={() => setState(s => ({ ...s, car_color: cc.value }))}
                        style={{
                          padding: '10px 6px', borderRadius: 12, cursor: 'pointer',
                          border: `1.5px solid ${state.car_color === cc.value ? '#fff5' : cc.value + '33'}`,
                          background: state.car_color === cc.value ? cc.value + '28' : 'rgba(255,255,255,0.02)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                          transition: 'all 0.15s',
                          boxShadow: state.car_color === cc.value ? `0 0 20px ${cc.value}66` : 'none',
                        }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: cc.value,
                          boxShadow: state.car_color === cc.value ? `0 0 10px ${cc.value}` : 'none',
                        }} />
                        <span style={{
                          fontFamily: "'Boogaloo',cursive", fontSize: '0.68rem',
                          color: state.car_color === cc.value ? '#fff' : 'rgba(255,255,255,0.4)',
                          textAlign: 'center', lineHeight: 1.2,
                        }}>{cc.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected preview */}
                  <div style={{
                    marginTop: 12, padding: '10px 14px',
                    background: `${col}10`,
                    borderRadius: 12, border: `1px solid ${col}33`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: col, flexShrink: 0,
                      boxShadow: `0 0 16px ${col}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem',
                    }}>🚗</div>
                    <div>
                      <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.6rem', color: col, letterSpacing: 2 }}>SELECTED</div>
                      <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.95rem', color: '#fff' }}>{carLabel}</div>
                    </div>
                  </div>
                </div>

                {/* Kid photo */}
                <div>
                  <label style={lbl}>
                    📸 Birthday Star's Photo
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem', letterSpacing: 1, marginLeft: 6 }}>
                      OPTIONAL
                    </span>
                  </label>
                  <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', margin: '-4px 0 12px' }}>
                    Shows on the winner screen when they finish the race 🏆
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      border: `2px solid ${col}66`,
                      overflow: 'hidden', background: '#0e001e', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem',
                      boxShadow: `0 0 16px ${col}33`,
                    }}>
                      {state.kid_photo_preview
                        ? <img src={state.kid_photo_preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="kid" />
                        : '🏆'}
                    </div>
                    <label style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: `${col}10`, border: `1.5px dashed ${col}44`,
                      borderRadius: 12, padding: '13px',
                      cursor: 'pointer', fontFamily: "'Boogaloo',cursive",
                      color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem',
                      transition: 'all 0.15s',
                    }}>
                      {state.kid_photo_preview ? '🔄 Change Photo' : '📷 Upload Photo'}
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => { if (e.target.files?.[0]) handleKidPhoto(e.target.files[0]) }} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ══ STEP 2 ══ */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.4s ease-out both' }}>

                {/* Crew chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {state.wishes.map((w, i) => (
                    <button key={i} onClick={() => setEditingIdx(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 40,
                        border: `1.5px solid ${editingIdx === i ? col : col + '33'}`,
                        background: editingIdx === i ? col + '28' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer', fontFamily: "'Boogaloo',cursive",
                        fontSize: '0.88rem', color: '#fff', transition: 'all 0.15s',
                      }}>
                      <span>{w.avatar}</span>
                      <span style={{ color: editingIdx === i ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                        {w.from_name || `Person ${i + 1}`}
                      </span>
                      {w.from_name && w.short_wish && (
                        <span style={{ color: col, fontSize: '0.75rem' }}>✓</span>
                      )}
                    </button>
                  ))}
                  {state.wishes.length < 7 && (
                    <button onClick={() => {
                      const newEntry: WishEntry = { stage: state.wishes.length + 1, from_name: '', avatar: AVATARS[state.wishes.length % AVATARS.length], short_wish: '' }
                      setState(s => ({ ...s, wishes: [...s.wishes, newEntry] }))
                      setEditingIdx(state.wishes.length)
                    }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 14px', borderRadius: 40,
                        border: `1.5px dashed ${col}44`, background: 'transparent',
                        cursor: 'pointer', fontFamily: "'Boogaloo',cursive",
                        fontSize: '0.88rem', color: col,
                      }}>
                      + Add Person
                    </button>
                  )}
                </div>

                {/* Editor card */}
                {state.wishes[editingIdx] && (() => {
                  const w = state.wishes[editingIdx]
                  const i = editingIdx
                  return (
                    <div style={{
                      background: `${col}08`,
                      borderRadius: 16, padding: '18px',
                      border: `1px solid ${col}33`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      {/* Checkered corner */}
                      <div style={{
                        position: 'absolute', top: 0, right: 0, width: 36, height: 36, opacity: 0.06,
                        backgroundImage: 'linear-gradient(45deg,#fff 25%,transparent 25%),linear-gradient(-45deg,#fff 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#fff 75%),linear-gradient(-45deg,transparent 75%,#fff 75%)',
                        backgroundSize: '9px 9px', backgroundPosition: '0 0,0 4.5px,4.5px -4.5px,-4.5px 0',
                        borderRadius: '0 16px 0 0',
                      }} />

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.65rem', color: col, letterSpacing: 3 }}>
                          PIT STOP {i + 1} / {state.wishes.length}
                        </div>
                        {state.wishes.length > 1 && (
                          <button onClick={() => {
                            const updated = state.wishes.filter((_, idx) => idx !== i).map((w, idx) => ({ ...w, stage: idx + 1 }))
                            setState(s => ({ ...s, wishes: updated }))
                            setEditingIdx(Math.max(0, i - 1))
                          }}
                            style={{
                              background: 'rgba(248,113,113,0.08)',
                              border: '1px solid rgba(248,113,113,0.25)',
                              borderRadius: 8, padding: '3px 10px',
                              cursor: 'pointer', fontFamily: "'Boogaloo',cursive",
                              fontSize: '0.78rem', color: '#f87171',
                            }}>
                            Remove ✕
                          </button>
                        )}
                      </div>

                      {/* Avatar picker */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
                          Pick an avatar:
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {AVATARS.map(av => (
                            <button key={av} onClick={() => updateWish(i, 'avatar', av)}
                              style={{
                                width: 34, height: 34, borderRadius: 8,
                                border: `1.5px solid ${w.avatar === av ? col : 'transparent'}`,
                                background: w.avatar === av ? col + '28' : 'rgba(255,255,255,0.04)',
                                fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.1s',
                              }}>
                              {av}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Inputs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                            Their name — Mom, Dad, BFF...
                          </div>
                          <input
                            className="inp-focus"
                            style={inp}
                            placeholder="e.g. Mom, Dad, Best Friend..."
                            value={w.from_name}
                            onChange={e => updateWish(i, 'from_name', e.target.value)}
                          />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                            One punchy birthday wish ⭐
                          </div>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="inp-focus"
                              style={{ ...inp, paddingRight: 50 }}
                              placeholder="e.g. You are my shining star! ⭐"
                              value={w.short_wish}
                              onChange={e => updateWish(i, 'short_wish', e.target.value)}
                              maxLength={60}
                            />
                            <span style={{
                              position: 'absolute', right: 12, top: '50%',
                              transform: 'translateY(-50%)',
                              fontFamily: "'Boogaloo',cursive", fontSize: '0.72rem',
                              color: w.short_wish.length > 50 ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                            }}>
                              {w.short_wish.length}/60
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ready nudge */}
                      {w.from_name && w.short_wish && (
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                          <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.88rem', color: col }}>
                            ✓ {w.from_name} is ready!
                          </span>
                          {i === state.wishes.length - 1 && state.wishes.length < 7 && (
                            <button onClick={() => {
                              const newEntry: WishEntry = { stage: state.wishes.length + 1, from_name: '', avatar: AVATARS[state.wishes.length % AVATARS.length], short_wish: '' }
                              setState(s => ({ ...s, wishes: [...s.wishes, newEntry] }))
                              setEditingIdx(state.wishes.length)
                            }}
                              style={{
                                fontFamily: "'Racing Sans One',cursive", fontSize: '0.75rem',
                                background: col + '18', border: `1px solid ${col}55`,
                                color: col, borderRadius: 30, padding: '6px 14px',
                                cursor: 'pointer', letterSpacing: 1,
                              }}>
                              + ADD ANOTHER
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}

                <p style={{
                  fontFamily: "'Boogaloo',cursive", fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.25)', margin: 0, textAlign: 'center',
                }}>
                  {state.wishes.length}/7 crew members · Add more anytime
                </p>
              </div>
            )}

            {/* ══ STEP 3 ══ */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.4s ease-out both' }}>
                <div style={{
                  background: `${col}10`, border: `1px solid ${col}22`,
                  borderRadius: 12, padding: '12px 14px',
                }}>
                  <p style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                    Optional — each photo <strong style={{ color: col }}>pops out of the gift box</strong> when your child wins a stage! 🎁
                  </p>
                </div>

                {state.wishes.filter(w => w.from_name.trim()).map((w) => {
                  const realIdx = state.wishes.findIndex(x => x.stage === w.stage)
                  return (
                    <div key={w.stage} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: 14, padding: '12px',
                      border: `1px solid ${col}18`,
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        overflow: 'hidden', border: `2px solid ${col}55`,
                        flexShrink: 0, background: '#0e001e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', boxShadow: `0 0 10px ${col}33`,
                      }}>
                        {w.photo_preview
                          ? <img src={w.photo_preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                          : w.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.68rem', color: col, marginBottom: 6, letterSpacing: 1 }}>
                          STAGE {w.stage} · {w.from_name}
                        </div>
                        <label style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          background: `${col}10`, border: `1px solid ${col}33`,
                          borderRadius: 10, padding: '8px 12px',
                          cursor: 'pointer', fontFamily: "'Boogaloo',cursive",
                          color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem',
                          transition: 'all 0.15s',
                        }}>
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

            {/* ══ STEP 4 ══ */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeUp 0.4s ease-out both' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>🏁</div>
                  <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.2rem,4vw,1.6rem)', color: '#fff', letterSpacing: 2 }}>
                    LIGHTS OUT…
                  </div>
                  <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(0.8rem,2.5vw,1rem)', color: col, letterSpacing: 3, textShadow: `0 0 14px ${col}` }}>
                    AND AWAY WE GO!
                  </div>
                </div>

                {/* Summary card */}
                <div style={{
                  background: `${col}08`,
                  borderRadius: 16, padding: '16px',
                  border: `1px solid ${col}33`,
                }}>
                  {/* Kid */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${col}18` }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: col, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem', boxShadow: `0 0 16px ${col}66`,
                    }}>
                      {state.kid_photo_preview
                        ? <img src={state.kid_photo_preview} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="kid" />
                        : '🏆'}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '1.1rem', color: col }}>
                        {state.child_name || 'Champion'}
                      </div>
                      <div style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                        Turning {state.age} · {carLabel} 🚗
                      </div>
                    </div>
                  </div>

                  {/* Wishes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {state.wishes.filter(w => w.from_name.trim()).map((w, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 10px',
                        background: `${col}08`, borderRadius: 10,
                      }}>
                        <span style={{ fontSize: '1rem' }}>{w.avatar}</span>
                        <span style={{ fontFamily: "'Boogaloo',cursive", color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', flex: 1 }}>
                          {w.from_name}
                        </span>
                        {w.photo_preview && <span style={{ fontSize: '0.8rem' }}>📸</span>}
                        <span style={{ fontFamily: "'Racing Sans One',cursive", color: col, fontSize: '0.6rem', letterSpacing: 1 }}>
                          STAGE {w.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.3)',
                    borderRadius: 10, padding: '10px 14px',
                    fontFamily: "'Boogaloo',cursive", color: '#fca5a5', fontSize: '0.95rem',
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={handlePublish}
                  disabled={loading}
                  style={{
                    fontFamily: "'Racing Sans One',cursive", fontSize: '1.1rem',
                    background: loading ? '#1a0030' : `linear-gradient(135deg,${col},${col}88)`,
                    color: '#fff', border: 'none', borderRadius: 50,
                    padding: '16px', cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : `0 5px 0 #1a0030, 0 0 24px ${col}44`,
                    letterSpacing: 2, width: '100%', transition: 'all 0.2s',
                    opacity: loading ? 0.6 : 1,
                  }}>
                  {loading ? '📸 Uploading photos...' : '🏁 START THE RACE!'}
                </button>
              </div>
            )}

            {/* ── NAV ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 12 }}>
              {step > 1 ? (
                <button
                  className="nav-btn-back"
                  onClick={() => { setError(''); setStep(s => s - 1) }}
                  style={{
                    border: `1px solid ${col}33`,
                    flexShrink: 0,

                  }}>
                  ← Back
                </button>
              ) : <div />}

              {step < 4 && (
                <button
                  className="nav-btn-next"
                  onClick={() => {
                    if (step === 1 && !state.child_name.trim()) { setError("Enter your champion's name first! 🏆"); return }
                    setError(''); setStep(s => s + 1)
                  }}
                  style={{
                    background: `linear-gradient(135deg,${col},${col}88)`,
                    boxShadow: `0 4px 0 #1a0030, 0 0 16px ${col}44`,
                    flexShrink: 0,

                  }}>
                  NEXT PIT STOP →
                </button>
              )}
            </div>

            {error && step !== 4 && (
              <div style={{
                marginTop: 10, fontFamily: "'Boogaloo',cursive",
                color: '#fca5a5', fontSize: '0.9rem', textAlign: 'center',
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}