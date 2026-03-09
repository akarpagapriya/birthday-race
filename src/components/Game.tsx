'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { WISHES, STARS_NEEDED, STAGE_COLORS, STAGE_NAMES, STAGE_ICONS, Wish } from './gameData'
import { sndCollect, sndCrash, sndWin, sndRev, sndBday } from './audio'
import { drawSpaceBg, drawRoad, drawToycar, drawStar3D, drawObstacle } from './drawUtils'

type Screen = 'intro' | 'game' | 'wish' | 'gameover' | 'winner'
type ObsType = 'rock' | 'barrier' | 'fuel' | 'light'

interface Star { x: number; y: number; w: number; speed: number; spin: number; spinSpeed: number }
interface Obstacle { x: number; y: number; r: number; speed: number; type: ObsType }
interface Puff { x: number; y: number; r: number; op: number }
interface BgStar { x: number; y: number; r: number; speed: number; op: number }

const CF_COLORS = ['#c084fc', '#e879f9', '#a78bfa', '#fde68a', '#93c5fd', '#f87171', '#fff', '#7c3aed', '#f0abfc']

function spawnConfetti(n = 80) {
  for (let i = 0; i < n; i++) setTimeout(() => {
    const el = document.createElement('div'); el.className = 'cf'
    const s = 7 + Math.random() * 12, col = CF_COLORS[~~(Math.random() * CF_COLORS.length)]
    el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;border-radius:${Math.random() > .5 ? '50%' : '2px'};left:${Math.random() * 100}vw;top:-20px;width:${s}px;height:${s}px;background:${col};animation:confettiFall ${1.6 + Math.random() * 2}s ${Math.random() * .4}s linear forwards;`
    document.body.appendChild(el); setTimeout(() => el.remove(), 4500)
  }, i * 11)
}

function ordinal(n: number): string {
  if (n === 1) return '1st'
  if (n === 2) return '2nd'
  if (n === 3) return '3rd'
  return `${n}th`
}

function makeBgStars(): BgStar[] {
  return Array.from({ length: 160 }, () => ({ x: Math.random() * 1200, y: Math.random() * 900, r: Math.random() * 1.6 + .3, speed: .2 + Math.random() * .8, op: .15 + Math.random() * .7 }))
}

export default function Game({ customData }: { customData?: { childName: string; age?: number; carColor: string; kidPhotoUrl?: string; wishes: Wish[] } | null }) {
  const activeWishes = customData?.wishes ?? WISHES
  const carColor = customData?.carColor ?? '#9333ea'
  const kidPhotoUrl = customData?.kidPhotoUrl
  const childName = customData?.childName ?? 'Kabileshwar'
  const totalStages = activeWishes.length  // ← dynamic! works for 1–7 stages
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [screen, setScreen] = useState<Screen>('intro')
  const [wishIdx, setWishIdx] = useState(0)
  const [hStage, setHStage] = useState(1)
  const [hStars, setHStars] = useState(0)
  const [hScore, setHScore] = useState(0)
  const [hLives, setHLives] = useState(3)
  const [progPct, setProgPct] = useState(0)
  const [progCnt, setProgCnt] = useState('0/10')
  const [progLab, setProgLab] = useState('Stage 1 — Collect 10 ⭐')
  const [transMsg, setTransMsg] = useState('')
  const [transOpen, setTransOpen] = useState(false)
  const [goScore, setGoScore] = useState(0)
  const [dotParticles] = useState(() => Array.from({ length: 70 }, (_, i) => ({
    id: i, left: Math.random() * 100, dur: 7 + Math.random() * 14, delay: Math.random() * 14,
    size: 0.8 + Math.random() * 2.5, op: 0.4 + Math.random() * 0.6
  })))

  // Game state (mutable refs for canvas loop)
  const G = useRef({
    stage: 1, starsN: 10, starsC: 0, lives: 3, totalScore: 0, running: false,
    car: { x: 200, y: 400, w: 36, h: 60, lane: 1, targetX: 200 },
    laneXs: [200, 400, 600] as [number, number, number],
    stars: [] as Star[], obstacles: [] as Obstacle[], puffs: [] as Puff[],
    starTimer: 0, obsTimer: 0, roadScroll: 0, speed: 4,
    invincible: 0, shakeT: 0, stageColor: '#c084fc',
    bgStars: makeBgStars(), bgTimer: 0,
  })
  const keysRef = useRef<Record<string, boolean>>({})
  const lLRef = useRef(false), lRRef = useRef(false)
  const rafRef = useRef<number>(0)
  const lastTRef = useRef(0)
  const screenRef = useRef<Screen>('intro')

  // keep screenRef in sync
  useEffect(() => { screenRef.current = screen }, [screen])

  const doTransition = useCallback((msg: string, cb: () => void) => {
    setTransMsg(msg); setTransOpen(true)
    setTimeout(() => { cb(); setTransOpen(false) }, 380)
  }, [])

  const initStage = useCallback((n: number) => {
    const g = G.current
    g.stage = n; g.starsN = STARS_NEEDED[n - 1]; g.starsC = 0
    g.speed = 3.8 + n * .42; g.stars = []; g.obstacles = []; g.puffs = []
    g.starTimer = 0; g.obsTimer = 0; g.roadScroll = 0
    g.stageColor = carColor
    g.invincible = 0; g.shakeT = 0; g.running = true
    setHStage(n); setHStars(0); setHScore(g.totalScore); setHLives(g.lives)
    setProgLab(`Stage ${n} — Collect ${g.starsN} ⭐`)
    setProgCnt(`0/${g.starsN}`); setProgPct(0)
    setTimeout(() => {
      const canvas = canvasRef.current; if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width; canvas.height = rect.height
      const W = canvas.width, H = canvas.height
      g.laneXs = [W * .22, W * .5, W * .78]
      g.car.lane = 1; g.car.x = g.laneXs[1]; g.car.targetX = g.laneXs[1]; g.car.y = H * .74
    }, 50)
  }, [carColor])

  // GAME LOOP
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return

    function resize() {
      if (!canvas) return
      const r = canvas.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        canvas.width = r.width; canvas.height = r.height
        const g = G.current, W = canvas.width, H = canvas.height
        if (g.running) { g.laneXs = [W * .22, W * .5, W * .78]; g.car.targetX = g.laneXs[g.car.lane]; g.car.y = H * .74 }
      }
    }
    window.addEventListener('resize', resize); resize()

    function loop(ts: number) {
      rafRef.current = requestAnimationFrame(loop)
      const g = G.current
      if (!canvas || !ctx) return
      const W = canvas.width, H = canvas.height
      if (W === 0 || H === 0) return

      if (g.running) {
        const dt = Math.min((ts - lastTRef.current) / 16.67, 3); lastTRef.current = ts
        if (g.invincible > 0) g.invincible -= dt
        if (g.shakeT > 0) g.shakeT -= dt

        // input
        if (!lLRef.current && keysRef.current['ArrowLeft']) { lLRef.current = true; if (g.car.lane > 0) { g.car.lane--; g.car.targetX = g.laneXs[g.car.lane]; sndRev() } }
        if (!keysRef.current['ArrowLeft']) lLRef.current = false
        if (!lRRef.current && keysRef.current['ArrowRight']) { lRRef.current = true; if (g.car.lane < 2) { g.car.lane++; g.car.targetX = g.laneXs[g.car.lane]; sndRev() } }
        if (!keysRef.current['ArrowRight']) lRRef.current = false
        g.car.x += (g.car.targetX - g.car.x) * .14 * dt * 3
        g.laneXs = [W * .22, W * .5, W * .78]; g.car.targetX = g.laneXs[g.car.lane]; g.car.y = H * .74
        g.roadScroll = (g.roadScroll + g.speed * 1.8 * dt) % 70
        g.bgTimer++
        g.bgStars.forEach(s => { s.y = (s.y + s.speed * dt) % (H + 10); if (s.y > H) s.y = -5 })

        // spawn
        g.starTimer += dt
        if (g.starTimer > Math.max(22, 55 - g.stage * 4)) {
          g.starTimer = 0
          g.stars.push({ x: g.laneXs[~~(Math.random() * 3)], y: -35, w: 16 + g.stage, speed: g.speed + 1.1, spin: 0, spinSpeed: .06 + Math.random() * .04 })
        }
        g.obsTimer += dt
        if (g.obsTimer > Math.max(42, 95 - g.stage * 7)) {
          g.obsTimer = 0
          if (Math.random() < .5 + g.stage * .03) {
            const types: ObsType[] = ['rock', 'barrier', 'fuel', 'light']
            g.obstacles.push({ x: g.laneXs[~~(Math.random() * 3)], y: -55, r: 18, speed: g.speed + .5, type: types[~~(Math.random() * types.length)] })
          }
        }

        // update stars
        for (let i = g.stars.length - 1; i >= 0; i--) {
          g.stars[i].y += g.stars[i].speed * dt; g.stars[i].spin += g.stars[i].spinSpeed * dt
          if (g.stars[i].y > H + 50) { g.stars.splice(i, 1); continue }
          const s = g.stars[i]
          if (Math.abs(g.car.x - s.x) < (g.car.w * .75 + s.w - 10) && Math.abs(g.car.y - s.y) < (g.car.h * .5 + s.w - 10)) {
            g.stars.splice(i, 1); g.starsC++; g.totalScore++; sndCollect()
            const pct = Math.min(100, g.starsC / g.starsN * 100)
            setHStars(g.starsC); setHScore(g.totalScore)
            setProgPct(pct); setProgCnt(`${g.starsC}/${g.starsN}`)
            if (g.starsC >= g.starsN) {
              g.running = false; sndWin(); spawnConfetti(60)
              setTimeout(() => { setWishIdx(g.stage - 1); setScreen('wish') }, 500)
              return
            }
          }
        }

        // update obstacles
        for (let i = g.obstacles.length - 1; i >= 0; i--) {
          g.obstacles[i].y += g.obstacles[i].speed * dt
          if (g.obstacles[i].y > H + 60) { g.obstacles.splice(i, 1); continue }
          const o = g.obstacles[i]
          if (g.invincible <= 0 && Math.abs(g.car.x - o.x) < (g.car.w * .75 + o.r - 12) && Math.abs(g.car.y - o.y) < (g.car.h * .5 + o.r - 12)) {
            g.obstacles.splice(i, 1); g.lives--; g.invincible = 90; g.shakeT = 25
            sndCrash(); spawnConfetti(16); setHLives(g.lives)
            if (g.lives <= 0) {
              g.running = false; setGoScore(g.totalScore)
              setTimeout(() => doTransition('OH NO! 💥', () => setScreen('gameover')), 500)
              return
            }
          }
        }
      }

      // DRAW
      const shake = g.shakeT > 0
      if (shake) { ctx.save(); ctx.translate(~~(Math.random() * 8 - 4), ~~(Math.random() * 6 - 3)) }
      drawSpaceBg(ctx, W, H, g.bgStars, g.stageColor, g.bgTimer)
      drawRoad(ctx, W, H, g.roadScroll, g.stageColor, STAGE_NAMES[g.stage - 1])

      // puffs
      g.puffs = g.puffs.filter(p => {
        p.y -= 1.4; p.r += .45; p.op -= .045
        if (p.op <= 0) return false
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        const a = Math.round(p.op * 180).toString(16).padStart(2, '0')
        pg.addColorStop(0, g.stageColor + a); pg.addColorStop(1, 'transparent')
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
        return true
      })

      g.stars.forEach(s => drawStar3D(ctx, s.x, s.y, s.w * .5, s.spin))
      g.obstacles.forEach(o => drawObstacle(ctx, o.x, o.y, o.r, o.type))

      if (!(g.invincible > 0 && ~~(g.invincible / 5) % 2 === 1)) {
        if (Math.random() < .28) g.puffs.push({ x: g.car.x + (Math.random() * g.car.w * .3 - g.car.w * .15), y: g.car.y + g.car.h * .5, r: 2 + Math.random() * 4, op: .5 })
        drawToycar(ctx, g.car.x, g.car.y, g.car.w, g.car.h, g.stageColor)
      }

      if (shake) ctx.restore()
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [doTransition])

  // Keyboard
  useEffect(() => {
    const kd = (e: KeyboardEvent) => { keysRef.current[e.key] = true; if (e.key.startsWith('Arrow')) e.preventDefault() }
    const ku = (e: KeyboardEvent) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku)
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku) }
  }, [])

  // Intro confetti
  useEffect(() => { setTimeout(() => spawnConfetti(30), 600) }, [])

  const startGame = useCallback(() => {
    sndRev(); G.current.lives = 3; G.current.totalScore = 0
    doTransition('STAGE 1 🏁', () => { setScreen('game'); initStage(1) })
  }, [doTransition, initStage])

  const continueFromWish = useCallback(() => {
    const stage = G.current.stage
    if (stage >= totalStages) {
      doTransition('🏆 CHAMPION!', () => { setScreen('winner'); spawnConfetti(140); sndBday() })
    } else {
      const ns = stage + 1
      doTransition(`STAGE ${ns} ⚡`, () => { setScreen('game'); initStage(ns) })
    }
  }, [doTransition, initStage, totalStages])

  const retry = useCallback(() => {
    sndRev(); G.current.lives = 3
    doTransition('TRY AGAIN! 🔄', () => { setScreen('game'); initStage(G.current.stage || 1) })
  }, [doTransition, initStage])

  const playAgain = useCallback(() => {
    G.current.lives = 3; G.current.totalScore = 0
    doTransition('NEW RACE! 🏁', () => setScreen('intro'))
  }, [doTransition])

  const SHORT_WISHES = activeWishes.map(w => w.text)
  const wish = activeWishes[wishIdx]
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#080010', fontFamily: "'Nunito',sans-serif", ['--car-color' as string]: carColor }}>

      {/* TRANSITION OVERLAY */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none',
        background: `linear-gradient(135deg,${carColor}cc,${carColor})`,
        clipPath: transOpen ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
        transition: 'clip-path 0.4s cubic-bezier(.7,0,.3,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.8rem,6vw,3.5rem)',
        color: '#fff', letterSpacing: 3, textShadow: '0 0 20px rgba(255,255,255,.5)'
      }}>{transMsg}</div>

      {/* ═══ INTRO ═══ */}
      {screen === 'intro' && (
        <div style={{
          position: 'fixed', inset: 0, overflow: 'hidden',
          background: `radial-gradient(at 50% 30%, rgb(30, 0, 66), rgb(8, 0, 16))`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Floating dot particles */}
          {dotParticles.map(d => (
            <div key={d.id} style={{
              position: 'absolute', borderRadius: '50%',
              width: d.size, height: d.size, left: `${d.left}%`,
              background: `${carColor}${Math.round(d.op * 255).toString(16).padStart(2, '0')}`,
              animation: `floatDot ${d.dur}s ${-d.delay}s linear infinite`,
              pointerEvents: 'none',
            }} />
          ))}

          {/* Road dashes at bottom — decorative */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
            background: `linear-gradient(180deg,transparent,${carColor}18)`,
            borderTop: `2px dashed ${carColor}33`,
            pointerEvents: 'none',
          }} />

          {/* Main content card */}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 0, padding: '0 20px', width: '100%', maxWidth: 460,
          }}>

            {/* Birthday badge — top pill */}
            <div style={{
              background: `linear-gradient(135deg,${carColor}33,${carColor}11)`,
              border: `1.5px solid ${carColor}66`,
              borderRadius: 40, padding: '6px 20px', marginBottom: 18,
              fontFamily: "'Boogaloo',cursive",
              fontSize: 'clamp(0.85rem,2.5vw,1.05rem)',
              color: 'rgba(255,255,255,0.85)', letterSpacing: 1,
            }}>
              🎂 Happy {ordinal(customData?.age ?? 6)} Birthday, {childName}!
            </div>


            {/* Hero name */}
            <div style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(2rem,8vw,5rem)',
              color: '#fff', textAlign: 'center', lineHeight: 1.05,
              marginBottom: 6,
            }}>
              ⚡ Lightning<br />
              <span style={{ color: carColor }}>
                {childName}
              </span>
            </div>

            {/* Subtitle */}
            <div style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(0.65rem,2vw,0.85rem)',
              color: carColor, letterSpacing: 4, marginBottom: 22,
              textShadow: `0 0 12px ${carColor}`,
            }}>
              BIRTHDAY RACE CHAMPION
            </div>

            {/* Instruction card */}
            <div style={{
              width: '100%',
              background: 'rgba(0,0,0,0.35)',
              border: `1.5px solid ${carColor}33`,
              borderRadius: 18, padding: '16px 20px', marginBottom: 24,
              backdropFilter: 'blur(8px)',
            }}>
              {/* 3 instruction rows */}
              {[
                { icon: '🚗', text: 'Steer your car & collect', highlight: '⭐ stars' },
                { icon: '⚠️', text: 'Dodge obstacles on the road', highlight: '' },
                { icon: '🎁', text: 'Win a stage → unlock a', highlight: 'family wish!' },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 0',
                  borderBottom: i < 2 ? `1px solid ${carColor}18` : 'none',
                }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{row.icon}</span>
                  <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: 'clamp(0.85rem,2.5vw,1rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    {row.text}{' '}
                    {row.highlight && <strong style={{ color: carColor }}>{row.highlight}</strong>}
                  </span>
                </div>
              ))}

              {/* Stage count strip */}
              <div style={{
                marginTop: 12, paddingTop: 10,
                borderTop: `1px solid ${carColor}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {Array.from({ length: totalStages }, (_, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `${carColor}22`,
                    border: `1.5px solid ${carColor}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontFamily: "'Racing Sans One',cursive",
                    color: carColor,
                  }}>{i + 1}</div>
                ))}
                <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                  {totalStages} {totalStages === 1 ? 'stage' : 'stages'} · {totalStages} {totalStages === 1 ? 'wish' : 'wishes'}
                </span>
              </div>
            </div>

            {/* Start button */}
            <button onClick={startGame} style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(1.1rem,3.5vw,1.6rem)',
              background: `linear-gradient(135deg,${carColor},${carColor}99)`,
              color: '#fff', border: 'none', borderRadius: 60,
              padding: '16px 52px', cursor: 'pointer', letterSpacing: 2,
              boxShadow: `0 7px 0 ${carColor}55, 0 0 40px ${carColor}66`,
              animation: 'btnPulse 1.8s ease-in-out infinite',
              width: '100%',
            }}>
              🚦 START RACING!
            </button>
          </div>
        </div>
      )}

      {/* ═══ GAME ═══ */}
      <div style={{ position: 'fixed', inset: 0, flexDirection: 'column', display: screen === 'game' ? 'flex' : 'none' }}>
        {/* HUD */}
        <div style={{ width: '100%', height: 50, background: 'rgba(8,0,16,0.95)', borderBottom: `2px solid ${carColor}66`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', gap: 6, flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.58rem', letterSpacing: 2, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>Stage</span>
            <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1.2rem', color: 'carColor' }}>{hStage}/{totalStages}</span>
          </div>
          {/* Stage nodes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {Array.from({ length: totalStages }, (_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {i > 0 && <div style={{ width: 8, height: 3, background: i < hStage ? carColor : '#1e0042', borderRadius: 2 }} />}
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: i + 1 < hStage ? carColor : i + 1 === hStage ? '#fff' : '#1e0042', border: `2px solid ${i + 1 < hStage ? carColor : i + 1 === hStage ? '#fff' : carColor + '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', animation: i + 1 === hStage ? 'nodePulse 1s ease-in-out infinite' : undefined }}>
                  {STAGE_ICONS[i] ?? '⭐'}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.58rem', letterSpacing: 2, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>Stars</span>
            <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1.2rem', color: carColor }}>{hStars}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.58rem', letterSpacing: 2, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>Score</span>
            <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1.2rem', color: 'carColor' }}>{hScore}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.58rem', letterSpacing: 2, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>Lives</span>
            <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1.2rem', color: 'carColor' }}>{'❤️'.repeat(Math.max(0, hLives))}</span>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ flex: 1, width: '100%', display: 'block', touchAction: 'none' }} />

        {/* Progress bar */}
        <div style={{ width: '100%', height: 44, background: 'rgba(8,0,16,0.95)', borderTop: '2px solid rgba(147,51,234,0.3)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{progLab}</span>
          <div style={{ flex: 1, height: 12, background: '#120024', borderRadius: 6, overflow: 'hidden', border: `2px solid ${carColor}44` }}>
            <div style={{ height: '100%', width: `${progPct}%`, background: `linear-gradient(90deg,${carColor}88,${carColor})`, borderRadius: 6, transition: 'width 0.25s' }} />
          </div>
          <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{progCnt}</span>
        </div>

        {/* Touch buttons */}
        <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 20px', zIndex: 20, pointerEvents: 'none' }}>
          {[{ label: '◀', key: 'ArrowLeft' }, { label: '▶', key: 'ArrowRight' }].map(({ label, key }) => (
            <div key={key}
              onTouchStart={e => { e.preventDefault(); keysRef.current[key] = true }}
              onTouchEnd={e => { e.preventDefault(); keysRef.current[key] = false }}
              style={{ width: 72, height: 72, borderRadius: '50%', background: `${carColor}33`, border: `3px solid ${carColor}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', pointerEvents: 'all', userSelect: 'none', cursor: 'pointer' }}>
              {label}
            </div>
          ))}
        </div>
      </div>
      {/* ═══ WISH OVERLAY — POLAROID REVEAL ═══ */}
      {screen === 'wish' && wish && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'radial-gradient(at 50% 30%, rgb(30, 0, 66), rgb(8, 0, 16))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(14px)', overflow: 'hidden' }}>

          {/* Background floating sparkles */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${5 + i * 10}%`,
              top: `${10 + ((i * 37) % 70)}%`,
              animation: `floatSparkle ${1.5 + i * .3}s ${i * .2}s ease-in-out infinite`,
              pointerEvents: 'none',
              fontSize: i % 2 === 0 ? '1.2rem' : '0.85rem',
            } as React.CSSProperties}>
              {['✨', '⭐', '💫', '🌟', '💜'][i % 5]}
            </div>
          ))}

          {/* MAIN WRAPPER */}
          <div style={{ animation: 'giftSlideUp 0.6s cubic-bezier(.36,1.3,.5,1) both', width: 'min(360px,92vw)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

            {/* Stage pill — pops in first */}
            <div style={{
              animation: 'badgePop 0.5s 0.2s cubic-bezier(.36,1.5,.5,1) both',
              background: `linear-gradient(135deg,${wish.color},${carColor})`,
              borderRadius: 40, padding: '5px 18px', marginBottom: 10,
              fontFamily: "'Racing Sans One',cursive", fontSize: '0.75rem',
              color: '#fff', letterSpacing: 2,
              boxShadow: `0 4px 16px ${wish.color}66`,
            }}>
              {wish.tag}
            </div>

            {/* ── POLAROID CARD ── */}
            <div style={{
              background: '#fdfaf5',
              borderRadius: 10,
              padding: '10px 10px 0 10px',
              boxShadow: `0 0 0 2px ${wish.color}99, 0 24px 60px rgba(0,0,0,0.95), 0 0 100px ${wish.color}44`,
              position: 'relative',
              width: '100%',
              transform: `rotate(${wishIdx % 2 === 0 ? '-1.5deg' : '1.5deg'})`,
            }}>

              {/* Tape strip at top */}
              <div style={{
                position: 'absolute', top: -11, left: '50%',
                transform: 'translateX(-50%)',
                width: 56, height: 20, borderRadius: 3,
                background: 'rgba(255,255,230,0.55)',
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(255,255,200,0.7)',
                zIndex: 12,
              }} />

              {/* BOW — flies up */}
              <div style={{
                position: 'absolute', top: -30, left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '2.2rem', zIndex: 10,
                animation: 'bowFlyUp 0.7s 0.75s cubic-bezier(.36,1.3,.5,1) both',
                filter: `drop-shadow(0 0 10px ${wish.color})`,
              }}>🎀</div>

              {/* RIBBON across photo */}
              <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: 14, zIndex: 9, display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: 1, background: `linear-gradient(90deg,transparent,${wish.color}99,${wish.color})`, animation: 'ribbonLeft 0.55s 0.6s ease-in forwards' }} />
                <div style={{ flex: 1, background: `linear-gradient(90deg,${wish.color},${wish.color}99,transparent)`, animation: 'ribbonRight 0.55s 0.6s ease-in forwards' }} />
              </div>

              {/* PHOTO AREA — square, fills polaroid top */}
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 6,
                overflow: 'hidden', position: 'relative',
                background: `linear-gradient(135deg,${wish.color}33,#0e001e)`,
              }}>
                {/* Sparkle burst */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'sparkleBurst 0.65s 1.35s ease-out both', pointerEvents: 'none', zIndex: 5, fontSize: '3rem' }}>✨</div>

                {/* Sparkle particles */}
                {([
                  { sx: '-80px', sy: '-70px', e: '⭐' }, { sx: '80px', sy: '-70px', e: '💫' },
                  { sx: '-100px', sy: '10px', e: '✨' }, { sx: '100px', sy: '10px', e: '🌟' },
                  { sx: '-55px', sy: '75px', e: '💜' }, { sx: '55px', sy: '75px', e: '⭐' },
                ] as { sx: string; sy: string; e: string }[]).map((p, i) => (
                  <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', ['--sx' as string]: p.sx, ['--sy' as string]: p.sy, animation: `sparkleOut 0.7s ${1.35 + i * .06}s ease-out both`, pointerEvents: 'none', zIndex: 5, fontSize: '1rem' }}>
                    {p.e}
                  </div>
                ))}

                {/* Actual photo / avatar */}
                <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 6 }}>
                  {wish.photo
                    ? <img src={`${wish.photo}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Family" />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(5rem,20vw,8rem)' }}>{wish.av}</div>
                  }

                  {/* Dark overlay at bottom for wish text */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '42%',
                    background: 'linear-gradient(transparent,rgba(0,0,0,0.82))',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    padding: '0 14px 12px',
                    animation: 'wishTextIn 0.5s 2.25s ease-out both',
                    zIndex: 7,
                  }}>
                    <div style={{
                      fontFamily: "'Boogaloo',cursive",
                      fontSize: 'clamp(1rem,4vw,1.3rem)',
                      color: '#fff', textAlign: 'center', lineHeight: 1.45,
                      textShadow: `0 2px 10px rgba(0,0,0,0.9), 0 0 20px ${wish.color}88`,
                    }}>
                      {SHORT_WISHES[wishIdx]}
                    </div>
                  </div>
                </div>
              </div>

              {/* POLAROID WHITE STRIP — sender info */}
              <div style={{
                padding: '10px 10px 16px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 10,
                animation: 'badgePop 0.5s 1.95s cubic-bezier(.36,1.5,.5,1) both',
              }}>
                {/* Avatar bubble + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: `${wish.color}22`,
                    border: `2.5px solid ${wish.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                    boxShadow: `0 0 12px ${wish.color}88`,
                  }}>
                    {wish.av}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.6rem', color: '#aaa', letterSpacing: 1 }}>FROM</div>
                    <div style={{
                      fontFamily: "'Racing Sans One',cursive", fontSize: '0.9rem',
                      color: wish.color, letterSpacing: 1,
                      textShadow: `0 0 8px ${wish.color}88`,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {wish.from}
                    </div>
                  </div>
                </div>

                {/* Car badge pin */}
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg,${carColor},${carColor}88)`,
                  border: '2.5px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem',
                  boxShadow: `0 0 14px ${carColor}, 0 3px 8px rgba(0,0,0,0.5)`,
                }}>
                  🏎️
                </div>
              </div>

              {/* Racing stripe at very bottom of polaroid */}
              <div style={{
                height: 7, borderRadius: '0 0 8px 8px',
                background: `linear-gradient(90deg,${wish.color},${carColor},${wish.color})`,
                opacity: 0.9,
              }} />
            </div>

            {/* CONTINUE BUTTON — below polaroid */}
            <button onClick={continueFromWish} style={{
              animation: 'btnFadeUp 0.5s 2.65s ease-out both',
              marginTop: 18, width: '100%',
              fontFamily: "'Racing Sans One',cursive", fontSize: '1rem',
              background: `linear-gradient(135deg,${wish.color},${carColor})`,
              color: '#fff', border: 'none', borderRadius: 40,
              padding: '13px 36px', cursor: 'pointer',
              boxShadow: `0 6px 0 ${carColor}cc, 0 0 24px ${wish.color}55`,
              letterSpacing: 1,
            }}>
              {G.current.stage >= totalStages ? '🏆 CLAIM THE TROPHY!' : 'NEXT STAGE ⚡'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ GAME OVER ═══ */}
      {screen === 'gameover' && (
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 40%,#1a0010,#080010)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ fontSize: '4rem' }}>💥</div>
          <h2 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(2rem,7vw,3.5rem)', color: '#f87171', textShadow: '0 0 30px rgba(248,113,113,.7)', textAlign: 'center' }}>OH NO! CRASH!</h2>
          <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: 'clamp(1rem,3vw,1.3rem)', color: 'rgba(255,255,255,.8)', textAlign: 'center', padding: '0 20px' }}>Don't worry {childName}!<br />Every champion crashes sometimes!</p>
          <div style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1.4rem', color: 'carColor' }}>⭐ Stars: {goScore}</div>
          <button onClick={retry} style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.1rem,3.5vw,1.8rem)', background: `linear-gradient(135deg,${carColor},${carColor}88)`, color: '#fff', border: 'none', borderRadius: 60, padding: '16px 44px', cursor: 'pointer', letterSpacing: 2, boxShadow: '0 7px 0 #3b0764' }}>
            🔄 TRY AGAIN!
          </button>
        </div>
      )}

      {/* ═══ WINNER ═══ */}
      {screen === 'winner' && (
        <div style={{
          position: 'fixed', inset: 0,
          background: `radial-gradient(at 50% 30%, rgb(30, 0, 66), rgb(8, 0, 16))`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          overflowY: 'auto', overflowX: 'hidden',
          padding: '24px 16px 40px',
          gap: 20,
        }}>
          {/* Background floating sparkles */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${5 + i * 10}%`,
              top: `${10 + ((i * 37) % 70)}%`,
              animation: `floatSparkle ${1.5 + i * .3}s ${i * .2}s ease-in-out infinite`,
              pointerEvents: 'none',
              fontSize: i % 2 === 0 ? '1.2rem' : '0.85rem',
            } as React.CSSProperties}>
              {['✨', '⭐', '💫', '🌟', '💜'][i % 5]}
            </div>
          ))}

          {/* ── TOP TITLE ── */}
          <div style={{ textAlign: 'center', paddingTop: 8, width: '100%', zIndex: 6 }}>
            <div style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(1rem,4vw,1.4rem)',
              color: carColor, letterSpacing: 4,
              textShadow: `0 0 20px ${carColor}`,
              marginBottom: 4,
            }}>
              🏁 RACE COMPLETE 🏁
            </div>
            <div style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(1.6rem,6vw,3rem)',
              color: '#fff', lineHeight: 1.15, textAlign: 'center',
            }}>
              ⚡ {childName.toUpperCase()}<br />
              <span style={{ color: carColor }}>IS THE CHAMPION!</span>
            </div>
          </div>

          {/* ── POLAROID + EMOJI ROW ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, width: '100%' }}>

            {/* Polaroid card */}
            <div className="anim-winfloat" style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                background: 'linear-gradient(180deg,#ffffff,#f8f4f0)',
                borderRadius: 12, padding: '8px 8px 32px 8px',
                boxShadow: `0 0 0 2px ${carColor}99, 0 20px 60px rgba(0,0,0,0.9), 0 0 80px ${carColor}55`,
                position: 'relative',
                width: 'clamp(150px,36vw,260px)',
                transform: 'rotate(-1.5deg)',
              }}>

                {/* Photo — same style as wish overlay */}
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 6,
                  overflow: 'hidden', position: 'relative',
                  background: `linear-gradient(135deg,${carColor}33,#0e001e)`,
                }}>

                  {/* Photo / fallback */}
                  <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 6 }}>
                    {kidPhotoUrl
                      ? <img src={kidPhotoUrl} alt={childName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(4rem,16vw,7rem)' }}>🏆</div>
                    }

                    {/* Shine sweep */}
                    <div style={{
                      position: 'absolute', top: 0, left: '-60%', width: '40%', height: '100%',
                      background: 'linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)',
                      transform: 'skewX(-20deg)', animation: 'shine 4s 1.5s infinite',
                      zIndex: 8, pointerEvents: 'none',
                    }} />

                    {/* Birthday overlay at bottom */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: '42%',
                      background: 'linear-gradient(transparent,rgba(0,0,0,0.82))',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'flex-end',
                      padding: '0 8px 10px', zIndex: 7,
                    }}>
                      <div style={{
                        fontFamily: "'Racing Sans One',cursive",
                        fontSize: 'clamp(0.55rem,2vw,0.8rem)',
                        color: '#fff', letterSpacing: 1.5, textAlign: 'center',
                        textShadow: `0 2px 6px rgba(0,0,0,0.9), 0 0 12px ${carColor}88`,
                      }}>
                        🎂 HAPPY {customData?.age ? ordinal(customData.age).toUpperCase() : '6TH'} BIRTHDAY
                      </div>
                      <div style={{
                        fontFamily: "'Boogaloo',cursive",
                        fontSize: 'clamp(0.5rem,1.8vw,0.75rem)',
                        color: 'rgba(255,255,255,0.9)', letterSpacing: 2, textAlign: 'center',
                        textShadow: `0 0 10px ${carColor}`,
                      }}>
                        ⚡ {childName.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div style={{ paddingTop: 8, textAlign: 'center', fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(0.6rem,2vw,0.82rem)', color: carColor, letterSpacing: 2, textShadow: `0 0 10px ${carColor}` }}>
                  🏁 CHAMPION 🏁
                </div>

                {/* Car pin */}
                <div style={{ position: 'absolute', top: -14, right: -14, width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${carColor},${carColor}88)`, border: '3px solid #fff', boxShadow: `0 0 14px ${carColor}, 0 4px 8px rgba(0,0,0,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', zIndex: 10 }}>🏎️</div>

                {/* Star pin */}
                <div style={{ position: 'absolute', top: -14, left: -14, width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#fde68a,#f59e0b)', border: '3px solid #fff', boxShadow: '0 0 12px #f59e0b, 0 4px 8px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', zIndex: 10 }}>⭐</div>

                {/* Tape */}
                <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', width: 48, height: 15, borderRadius: 3, background: 'rgba(255,255,255,0.38)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.6)', zIndex: 11 }} />

                {/* Racing stripe */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, borderRadius: '0 0 10px 10px', background: `linear-gradient(90deg,${carColor},#fff,${carColor})` }} />
              </div>
            </div>
          </div>

{/* ── WISHES UNLOCKED ── */}
          <div style={{ width: '100%', maxWidth: 600 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,transparent,${carColor}55)` }} />
              <div style={{ fontFamily: "'Racing Sans One',cursive", fontSize: '0.7rem', color: carColor, letterSpacing: 3, whiteSpace: 'nowrap' }}>
                🏁 VICTORY LAP · {totalStages} {totalStages === 1 ? 'WISH' : 'WISHES'}
              </div>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${carColor}55,transparent)` }} />
            </div>

            {/* Result rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeWishes.map((w, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: `linear-gradient(100deg,${w.color}14,${carColor}06,rgba(0,0,0,0.25))`,
                  border: `1.5px solid ${w.color}44`,
                  borderRadius: 16, padding: '10px 14px 10px 10px',
                  position: 'relative', overflow: 'hidden',
                  animation: `btnFadeUp 0.4s ${i * 0.08}s ease-out both`,
                  boxShadow: `0 4px 20px ${w.color}18`,
                }}>

                  {/* Left glow bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                    background: `linear-gradient(180deg,${w.color},${carColor})`,
                    borderRadius: '16px 0 0 16px',
                  }} />

                  {/* Position badge */}
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                    background: i === 0 ? 'linear-gradient(135deg,#fde68a,#f59e0b)'
                      : i === 1 ? 'linear-gradient(135deg,#e2e8f0,#94a3b8)'
                      : i === 2 ? 'linear-gradient(135deg,#fed7aa,#c2410c)'
                      : `${w.color}33`,
                    border: `2px solid ${i < 3 ? '#fff4' : w.color + '66'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Racing Sans One',cursive",
                    fontSize: i < 3 ? '0.75rem' : '0.6rem',
                    color: i < 3 ? '#000' : w.color,
                    fontWeight: 'bold',
                    boxShadow: i === 0 ? '0 0 12px #f59e0b88' : i === 1 ? '0 0 10px #94a3b888' : i === 2 ? '0 0 10px #c2410c88' : 'none',
                    flexDirection: 'column', lineHeight: 1,
                  }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </div>

                  {/* Wisher photo / avatar */}
                  <div style={{
                    flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
                    overflow: 'hidden',
                    border: `2.5px solid ${w.color}`,
                    boxShadow: `0 0 14px ${w.color}66`,
                    background: `linear-gradient(135deg,${w.color}33,#0e001e)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem',
                  }}>
                    {w.photo
                      ? <img src={`${w.photo}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={w.from} />
                      : w.av
                    }
                  </div>

                  {/* Text content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + stage tag row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div style={{
                        fontFamily: "'Racing Sans One',cursive",
                        fontSize: 'clamp(0.75rem,2.5vw,0.95rem)',
                        color: w.color, letterSpacing: 1,
                        textShadow: `0 0 8px ${w.color}88`,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {w.from}
                      </div>
                      <div style={{
                        flexShrink: 0,
                        background: `${w.color}22`, border: `1px solid ${w.color}55`,
                        borderRadius: 20, padding: '1px 7px',
                        fontFamily: "'Racing Sans One',cursive",
                        fontSize: '0.52rem', color: w.color, letterSpacing: 1,
                        whiteSpace: 'nowrap',
                      }}>
                        STAGE {i + 1}
                      </div>
                    </div>

                    {/* Wish text */}
                    <div style={{
                      fontFamily: "'Boogaloo',cursive",
                      fontSize: 'clamp(0.82rem,2.5vw,1rem)',
                      color: 'rgba(255,255,255,0.88)',
                      lineHeight: 1.4,
                    }}>
                      {w.text}
                    </div>
                  </div>

                  {/* Right emoji */}
                  <div style={{
                    flexShrink: 0, fontSize: '1.3rem',
                    filter: `drop-shadow(0 0 6px ${w.color})`,
                    animation: `photoFloat ${2 + i * 0.2}s ${i * 0.15}s ease-in-out infinite`,
                  }}>
                    {i === 0 ? '🏆' : i === 1 ? '⭐' : i === 2 ? '🎖️' : '💜'}
                  </div>

                  {/* Bottom racing stripe */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg,${w.color}88,${carColor}88,transparent)`,
                    borderRadius: '0 0 14px 14px',
                  }} />
                </div>
              ))}
            </div>

            {/* Footer line */}
            <div style={{ textAlign: 'center', marginTop: 14, fontFamily: "'Racing Sans One',cursive", fontSize: '0.65rem', color: `${carColor}66`, letterSpacing: 3 }}>
              ⚡ ALL STAGES COMPLETE ⚡
            </div>
          </div>

          {/* ── RACE AGAIN BUTTON ── */}
          <button onClick={playAgain} style={{
            fontFamily: "'Racing Sans One',cursive",
            fontSize: 'clamp(1rem,3.5vw,1.5rem)',
            background: `linear-gradient(135deg,${carColor},${carColor}88)`,
            color: '#fff', border: 'none', borderRadius: 60,
            padding: '14px 44px', cursor: 'pointer', letterSpacing: 2,
            boxShadow: `0 7px 0 ${carColor}55, 0 0 30px ${carColor}66`,
            animation: 'btnPulse 1.8s ease-in-out infinite',
          }}>
            🏁 RACE AGAIN!
          </button>
        </div>
      )}
    </div>
  )
}
