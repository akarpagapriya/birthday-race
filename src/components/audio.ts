import { BDAY_NOTES } from './gameData'

let audioCtx: AudioContext | null = null

function getAC(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return audioCtx
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) {
  try {
    const c = getAC(), o = c.createOscillator(), g = c.createGain()
    o.connect(g); g.connect(c.destination)
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(vol, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    o.start(); o.stop(c.currentTime + dur + 0.02)
  } catch {}
}

export function sndCollect() { tone(1047, .08); setTimeout(() => tone(1319, .1), 80) }

export function sndCrash() {
  try {
    const c = getAC(), o = c.createOscillator(), g = c.createGain()
    o.connect(g); g.connect(c.destination); o.type = 'sawtooth'
    o.frequency.setValueAtTime(200, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(35, c.currentTime + .35)
    g.gain.setValueAtTime(0.22, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + .4)
    o.start(); o.stop(c.currentTime + .45)
  } catch {}
}

export function sndWin() {
  [523,659,784,1047,1319,1568].forEach((f,i) => setTimeout(() => tone(f, .3, 'sine', .22), i * 100))
}

export function sndRev() {
  try {
    const c = getAC(), o = c.createOscillator(), g = c.createGain()
    o.connect(g); g.connect(c.destination); o.type = 'sawtooth'
    o.frequency.setValueAtTime(70, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(260, c.currentTime + .18)
    o.frequency.exponentialRampToValueAtTime(90, c.currentTime + .42)
    g.gain.setValueAtTime(0.1, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + .45)
    o.start(); o.stop(c.currentTime + .5)
  } catch {}
}

export function sndBday() {
  try {
    const c = getAC(); let t = c.currentTime + .1
    BDAY_NOTES.forEach(([f, d]) => {
      const o = c.createOscillator(), g = c.createGain()
      o.connect(g); g.connect(c.destination)
      o.type = 'sine'; o.frequency.value = f
      g.gain.setValueAtTime(.2, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + d)
      o.start(t); o.stop(t + d + .05); t += d + .02
    })
  } catch {}
}
