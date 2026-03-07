'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { WISHES, STARS_NEEDED, STAGE_COLORS, STAGE_NAMES, STAGE_ICONS, Wish } from './gameData'
import { sndCollect, sndCrash, sndWin, sndRev, sndBday } from './audio'
import { drawSpaceBg, drawRoad, drawToycar, drawStar3D, drawObstacle } from './drawUtils'

type Screen = 'intro' | 'game' | 'wish' | 'gameover' | 'winner'
type ObsType = 'rock' | 'barrier' | 'fuel' | 'light'

interface Star { x:number; y:number; w:number; speed:number; spin:number; spinSpeed:number }
interface Obstacle { x:number; y:number; r:number; speed:number; type:ObsType }
interface Puff { x:number; y:number; r:number; op:number }
interface BgStar { x:number; y:number; r:number; speed:number; op:number }

const CF_COLORS = ['#c084fc','#e879f9','#a78bfa','#fde68a','#93c5fd','#f87171','#fff','#7c3aed','#f0abfc']

function spawnConfetti(n=80) {
  for(let i=0;i<n;i++) setTimeout(()=>{
    const el=document.createElement('div'); el.className='cf'
    const s=7+Math.random()*12, col=CF_COLORS[~~(Math.random()*CF_COLORS.length)]
    el.style.cssText=`position:fixed;pointer-events:none;z-index:9999;border-radius:${Math.random()>.5?'50%':'2px'};left:${Math.random()*100}vw;top:-20px;width:${s}px;height:${s}px;background:${col};animation:confettiFall ${1.6+Math.random()*2}s ${Math.random()*.4}s linear forwards;`
    document.body.appendChild(el); setTimeout(()=>el.remove(),4500)
  }, i*11)
}

function makeBgStars(): BgStar[] {
  return Array.from({length:160},()=>({x:Math.random()*1200,y:Math.random()*900,r:Math.random()*1.6+.3,speed:.2+Math.random()*.8,op:.15+Math.random()*.7}))
}

export default function Game({ customData }: { customData?: { childName: string; themeColor: string; wishes: Wish[] } | null }) {
  const activeWishes = customData?.wishes ?? WISHES
  const defaultTheme = customData?.themeColor ?? '#9333ea'
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
  const [dotParticles] = useState(() => Array.from({length:70},(_,i)=>({
    id:i, left:Math.random()*100, dur:7+Math.random()*14, delay:Math.random()*14,
    size:0.8+Math.random()*2.5, op:0.4+Math.random()*0.6
  })))

  // Game state (mutable refs for canvas loop)
  const G = useRef({
    stage:1, starsN:10, starsC:0, lives:3, totalScore:0, running:false,
    car:{x:200,y:400,w:36,h:60,lane:1,targetX:200},
    laneXs:[200,400,600] as [number,number,number],
    stars:[] as Star[], obstacles:[] as Obstacle[], puffs:[] as Puff[],
    starTimer:0, obsTimer:0, roadScroll:0, speed:4,
    invincible:0, shakeT:0, stageColor:'#c084fc',
    bgStars:makeBgStars(), bgTimer:0,
  })
  const keysRef = useRef<Record<string,boolean>>({})
  const lLRef = useRef(false), lRRef = useRef(false)
  const rafRef = useRef<number>(0)
  const lastTRef = useRef(0)
  const screenRef = useRef<Screen>('intro')

  // keep screenRef in sync
  useEffect(()=>{ screenRef.current = screen },[screen])

  const doTransition = useCallback((msg:string, cb:()=>void) => {
    setTransMsg(msg); setTransOpen(true)
    setTimeout(()=>{ cb(); setTransOpen(false) }, 380)
  },[])

  const initStage = useCallback((n:number) => {
    const g = G.current
    g.stage=n; g.starsN=STARS_NEEDED[n-1]; g.starsC=0
    g.speed=3.8+n*.42; g.stars=[]; g.obstacles=[]; g.puffs=[]
    g.starTimer=0; g.obsTimer=0; g.roadScroll=0
    g.stageColor=STAGE_COLORS[n-1]
    g.invincible=0; g.shakeT=0; g.running=true
    setHStage(n); setHStars(0); setHScore(g.totalScore); setHLives(g.lives)
    setProgLab(`Stage ${n} — Collect ${g.starsN} ⭐`)
    setProgCnt(`0/${g.starsN}`); setProgPct(0)
    setTimeout(()=>{
      const canvas=canvasRef.current; if(!canvas) return
      const rect=canvas.getBoundingClientRect()
      canvas.width=rect.width; canvas.height=rect.height
      const W=canvas.width, H=canvas.height
      g.laneXs=[W*.22,W*.5,W*.78]
      g.car.lane=1; g.car.x=g.laneXs[1]; g.car.targetX=g.laneXs[1]; g.car.y=H*.74
    },50)
  },[])

  // GAME LOOP
  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return
    const ctx = canvas.getContext('2d'); if(!ctx) return

    function resize(){
      if(!canvas) return
      const r=canvas.getBoundingClientRect()
      if(r.width>0&&r.height>0){
        canvas.width=r.width; canvas.height=r.height
        const g=G.current, W=canvas.width, H=canvas.height
        if(g.running){ g.laneXs=[W*.22,W*.5,W*.78]; g.car.targetX=g.laneXs[g.car.lane]; g.car.y=H*.74 }
      }
    }
    window.addEventListener('resize',resize); resize()

    function loop(ts:number){
      rafRef.current=requestAnimationFrame(loop)
      const g=G.current
      if(!canvas || !ctx) return
      const W=canvas.width, H=canvas.height
      if(W===0||H===0) return

      if(g.running){
        const dt=Math.min((ts-lastTRef.current)/16.67,3); lastTRef.current=ts
        if(g.invincible>0) g.invincible-=dt
        if(g.shakeT>0) g.shakeT-=dt

        // input
        if(!lLRef.current&&keysRef.current['ArrowLeft']){lLRef.current=true;if(g.car.lane>0){g.car.lane--;g.car.targetX=g.laneXs[g.car.lane];sndRev()}}
        if(!keysRef.current['ArrowLeft']) lLRef.current=false
        if(!lRRef.current&&keysRef.current['ArrowRight']){lRRef.current=true;if(g.car.lane<2){g.car.lane++;g.car.targetX=g.laneXs[g.car.lane];sndRev()}}
        if(!keysRef.current['ArrowRight']) lRRef.current=false
        g.car.x+=(g.car.targetX-g.car.x)*.14*dt*3
        g.laneXs=[W*.22,W*.5,W*.78]; g.car.targetX=g.laneXs[g.car.lane]; g.car.y=H*.74
        g.roadScroll=(g.roadScroll+g.speed*1.8*dt)%70
        g.bgTimer++
        g.bgStars.forEach(s=>{ s.y=(s.y+s.speed*dt)%(H+10); if(s.y>H) s.y=-5 })

        // spawn
        g.starTimer+=dt
        if(g.starTimer>Math.max(22,55-g.stage*4)){
          g.starTimer=0
          g.stars.push({x:g.laneXs[~~(Math.random()*3)],y:-35,w:16+g.stage,speed:g.speed+1.1,spin:0,spinSpeed:.06+Math.random()*.04})
        }
        g.obsTimer+=dt
        if(g.obsTimer>Math.max(42,95-g.stage*7)){
          g.obsTimer=0
          if(Math.random()<.5+g.stage*.03){
            const types:ObsType[]=['rock','barrier','fuel','light']
            g.obstacles.push({x:g.laneXs[~~(Math.random()*3)],y:-55,r:18,speed:g.speed+.5,type:types[~~(Math.random()*types.length)]})
          }
        }

        // update stars
        for(let i=g.stars.length-1;i>=0;i--){
          g.stars[i].y+=g.stars[i].speed*dt; g.stars[i].spin+=g.stars[i].spinSpeed*dt
          if(g.stars[i].y>H+50){g.stars.splice(i,1);continue}
          const s=g.stars[i]
          if(Math.abs(g.car.x-s.x)<(g.car.w*.75+s.w-10)&&Math.abs(g.car.y-s.y)<(g.car.h*.5+s.w-10)){
            g.stars.splice(i,1); g.starsC++; g.totalScore++; sndCollect()
            const pct=Math.min(100,g.starsC/g.starsN*100)
            setHStars(g.starsC); setHScore(g.totalScore)
            setProgPct(pct); setProgCnt(`${g.starsC}/${g.starsN}`)
            if(g.starsC>=g.starsN){
              g.running=false; sndWin(); spawnConfetti(60)
              setTimeout(()=>{ setWishIdx(g.stage-1); setScreen('wish') },500)
              return
            }
          }
        }

        // update obstacles
        for(let i=g.obstacles.length-1;i>=0;i--){
          g.obstacles[i].y+=g.obstacles[i].speed*dt
          if(g.obstacles[i].y>H+60){g.obstacles.splice(i,1);continue}
          const o=g.obstacles[i]
          if(g.invincible<=0&&Math.abs(g.car.x-o.x)<(g.car.w*.75+o.r-12)&&Math.abs(g.car.y-o.y)<(g.car.h*.5+o.r-12)){
            g.obstacles.splice(i,1); g.lives--; g.invincible=90; g.shakeT=25
            sndCrash(); spawnConfetti(16); setHLives(g.lives)
            if(g.lives<=0){
              g.running=false; setGoScore(g.totalScore)
              setTimeout(()=>doTransition('OH NO! 💥',()=>setScreen('gameover')),500)
              return
            }
          }
        }
      }

      // DRAW
      const shake=g.shakeT>0
      if(shake){ctx.save();ctx.translate(~~(Math.random()*8-4),~~(Math.random()*6-3))}
      drawSpaceBg(ctx,W,H,g.bgStars,g.stageColor,g.bgTimer)
      drawRoad(ctx,W,H,g.roadScroll,g.stageColor,STAGE_NAMES[g.stage-1])

      // puffs
      g.puffs=g.puffs.filter(p=>{
        p.y-=1.4;p.r+=.45;p.op-=.045
        if(p.op<=0) return false
        const pg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r)
        const a=Math.round(p.op*180).toString(16).padStart(2,'0')
        pg.addColorStop(0,g.stageColor+a);pg.addColorStop(1,'transparent')
        ctx.fillStyle=pg;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()
        return true
      })

      g.stars.forEach(s=>drawStar3D(ctx,s.x,s.y,s.w*.5,s.spin))
      g.obstacles.forEach(o=>drawObstacle(ctx,o.x,o.y,o.r,o.type))

      if(!(g.invincible>0&&~~(g.invincible/5)%2===1)){
        if(Math.random()<.28) g.puffs.push({x:g.car.x+(Math.random()*g.car.w*.3-g.car.w*.15),y:g.car.y+g.car.h*.5,r:2+Math.random()*4,op:.5})
        drawToycar(ctx,g.car.x,g.car.y,g.car.w,g.car.h,g.stageColor)
      }

      if(shake) ctx.restore()
    }

    rafRef.current=requestAnimationFrame(loop)
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener('resize',resize) }
  },[doTransition])

  // Keyboard
  useEffect(()=>{
    const kd=(e:KeyboardEvent)=>{ keysRef.current[e.key]=true; if(e.key.startsWith('Arrow'))e.preventDefault() }
    const ku=(e:KeyboardEvent)=>{ keysRef.current[e.key]=false }
    window.addEventListener('keydown',kd); window.addEventListener('keyup',ku)
    return ()=>{ window.removeEventListener('keydown',kd); window.removeEventListener('keyup',ku) }
  },[])

  // Intro confetti
  useEffect(()=>{ setTimeout(()=>spawnConfetti(30),600) },[])

  const startGame = useCallback(()=>{
    sndRev(); G.current.lives=3; G.current.totalScore=0
    doTransition('STAGE 1 🏁',()=>{ setScreen('game'); initStage(1) })
  },[doTransition,initStage])

  const continueFromWish = useCallback(()=>{
    const stage = G.current.stage
    if(stage >= totalStages){
      doTransition('🏆 CHAMPION!',()=>{ setScreen('winner'); spawnConfetti(140); sndBday() })
    } else {
      const ns=stage+1
      doTransition(`STAGE ${ns} ⚡`,()=>{ setScreen('game'); initStage(ns) })
    }
  },[doTransition, initStage, totalStages])

  const retry = useCallback(()=>{
    sndRev(); G.current.lives=3
    doTransition('TRY AGAIN! 🔄',()=>{ setScreen('game'); initStage(G.current.stage||1) })
  },[doTransition,initStage])

  const playAgain = useCallback(()=>{
    G.current.lives=3; G.current.totalScore=0
    doTransition('NEW RACE! 🏁',()=>setScreen('intro'))
  },[doTransition])

  const SHORT_WISHES = activeWishes.map(w => w.text)
  const wish = activeWishes[wishIdx]
  const isTouch = typeof window!=='undefined' && 'ontouchstart' in window

  return (
    <div style={{position:'fixed',inset:0,background:'#080010',fontFamily:"'Nunito',sans-serif"}}>

      {/* TRANSITION OVERLAY */}
      <div style={{
        position:'fixed',inset:0,zIndex:500,pointerEvents:'none',
        background:'linear-gradient(135deg,#6b21a8,#9333ea)',
        clipPath: transOpen ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
        transition:'clip-path 0.4s cubic-bezier(.7,0,.3,1)',
        display:'flex',alignItems:'center',justifyContent:'center',
        fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(1.8rem,6vw,3.5rem)',
        color:'#fff',letterSpacing:3,textShadow:'0 0 20px rgba(255,255,255,.5)'
      }}>{transMsg}</div>

      {/* ═══ INTRO ═══ */}
      {screen==='intro' && (
        <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 40%,#1e0042 0%,#080010 75%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,overflow:'hidden'}}>
          {/* Floating dots */}
          {dotParticles.map(d=>(
            <div key={d.id} style={{position:'absolute',borderRadius:'50%',width:d.size,height:d.size,left:`${d.left}%`,background:`rgba(147,51,234,${d.op})`,animation:`floatDot ${d.dur}s ${-d.delay}s linear infinite`,pointerEvents:'none'}}/>
          ))}
          <div style={{fontSize:'clamp(3rem,12vw,7rem)',filter:'drop-shadow(0 0 30px #9333ea)',animation:'flagWave 1.2s ease-in-out infinite alternate',zIndex:2}}>🏁</div>
          <div style={{fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(2.2rem,8vw,5.5rem)',color:'#d8b4fe',textAlign:'center',textShadow:'0 0 40px #9333ea,0 0 80px #6b21a8,4px 4px 0 #3b0764',lineHeight:1.1,padding:'0 16px',zIndex:2}}>
⚡ Lightning<br/>{childName}!
          </div>
          <div style={{fontFamily:"'Boogaloo',cursive",fontSize:'clamp(1rem,3vw,1.6rem)',color:'rgba(255,255,255,0.75)',zIndex:2}}>🎂 Happy 6th Birthday! 🎂</div>
          <div style={{background:'rgba(147,51,234,0.1)',border:'2px solid rgba(147,51,234,0.4)',borderRadius:20,padding:'16px 26px',maxWidth:400,margin:'0 16px',zIndex:2}}>
            <p style={{fontSize:'clamp(0.85rem,2.5vw,1.05rem)',color:'rgba(255,255,255,0.85)',lineHeight:1.8,textAlign:'center',fontFamily:"'Boogaloo',cursive"}}>
              🚗 Steer your car &amp; <strong style={{color:'#d8b4fe'}}>collect ⭐ stars!</strong><br/>
              Avoid obstacles on the road.<br/>
              Win a stage → unlock a <strong style={{color:'#d8b4fe'}}>family wish! 💜</strong><br/>
              {totalStages} stages · {totalStages} wishes · 1 Champion!
            </p>
          </div>
          <button onClick={startGame} style={{fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(1.1rem,3.5vw,1.8rem)',background:'linear-gradient(135deg,#9333ea,#6b21a8)',color:'#fff',border:'none',borderRadius:60,padding:'16px 44px',cursor:'pointer',letterSpacing:2,boxShadow:'0 7px 0 #3b0764,0 0 40px rgba(147,51,234,0.5)',animation:'btnPulse 1.8s ease-in-out infinite',zIndex:2}}>
            🚦 START RACING!
          </button>
        </div>
      )}

      {/* ═══ GAME ═══ */}
      <div style={{position:'fixed',inset:0,flexDirection:'column',display:screen==='game'?'flex':'none'}}>
        {/* HUD */}
        <div style={{width:'100%',height:50,background:'rgba(8,0,16,0.95)',borderBottom:'2px solid rgba(147,51,234,0.4)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px',gap:6,flexShrink:0,zIndex:10}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{fontFamily:"'Racing Sans One',cursive",fontSize:'0.58rem',letterSpacing:2,color:'rgba(255,255,255,0.38)',textTransform:'uppercase'}}>Stage</span>
            <span style={{fontFamily:"'Boogaloo',cursive",fontSize:'1.2rem',color:'#d8b4fe'}}>{hStage}/{totalStages}</span>
          </div>
          {/* Stage nodes */}
          <div style={{display:'flex',alignItems:'center',gap:3}}>
            {Array.from({length:totalStages},(_,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:3}}>
                {i>0&&<div style={{width:8,height:3,background:i<hStage?'#7c3aed':'#1e0042',borderRadius:2}}/>}
                <div style={{width:20,height:20,borderRadius:'50%',background:i+1<hStage?'#7c3aed':i+1===hStage?'#d8b4fe':'#1e0042',border:`2px solid ${i+1<hStage?'#a78bfa':i+1===hStage?'#fff':'#4c1d95'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.55rem',animation:i+1===hStage?'nodePulse 1s ease-in-out infinite':undefined}}>
                  {STAGE_ICONS[i] ?? '⭐'}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{fontFamily:"'Racing Sans One',cursive",fontSize:'0.58rem',letterSpacing:2,color:'rgba(255,255,255,0.38)',textTransform:'uppercase'}}>Stars</span>
            <span style={{fontFamily:"'Boogaloo',cursive",fontSize:'1.2rem',color:'#d8b4fe'}}>{hStars}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{fontFamily:"'Racing Sans One',cursive",fontSize:'0.58rem',letterSpacing:2,color:'rgba(255,255,255,0.38)',textTransform:'uppercase'}}>Score</span>
            <span style={{fontFamily:"'Boogaloo',cursive",fontSize:'1.2rem',color:'#d8b4fe'}}>{hScore}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{fontFamily:"'Racing Sans One',cursive",fontSize:'0.58rem',letterSpacing:2,color:'rgba(255,255,255,0.38)',textTransform:'uppercase'}}>Lives</span>
            <span style={{fontFamily:"'Boogaloo',cursive",fontSize:'1.2rem',color:'#d8b4fe'}}>{'❤️'.repeat(Math.max(0,hLives))}</span>
          </div>
        </div>

        <canvas ref={canvasRef} style={{flex:1,width:'100%',display:'block',touchAction:'none'}}/>

        {/* Progress bar */}
        <div style={{width:'100%',height:44,background:'rgba(8,0,16,0.95)',borderTop:'2px solid rgba(147,51,234,0.3)',display:'flex',alignItems:'center',padding:'0 14px',gap:10,flexShrink:0}}>
          <span style={{fontFamily:"'Boogaloo',cursive",fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',whiteSpace:'nowrap'}}>{progLab}</span>
          <div style={{flex:1,height:12,background:'#120024',borderRadius:6,overflow:'hidden',border:'2px solid #3b0764'}}>
            <div style={{height:'100%',width:`${progPct}%`,background:'linear-gradient(90deg,#7c3aed,#d8b4fe)',borderRadius:6,transition:'width 0.25s'}}/>
          </div>
          <span style={{fontFamily:"'Boogaloo',cursive",fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',whiteSpace:'nowrap'}}>{progCnt}</span>
        </div>

        {/* Touch buttons */}
        <div style={{position:'absolute',bottom:48,left:0,right:0,display:'flex',justifyContent:'space-between',padding:'0 20px',zIndex:20,pointerEvents:'none'}}>
          {[{label:'◀',key:'ArrowLeft'},{label:'▶',key:'ArrowRight'}].map(({label,key})=>(
            <div key={key}
              onTouchStart={e=>{e.preventDefault();keysRef.current[key]=true}}
              onTouchEnd={e=>{e.preventDefault();keysRef.current[key]=false}}
              style={{width:72,height:72,borderRadius:'50%',background:'rgba(147,51,234,0.2)',border:'3px solid rgba(147,51,234,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',pointerEvents:'all',userSelect:'none',cursor:'pointer'}}>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ WISH OVERLAY — GIFT BOX UNWRAP ═══ */}
      {screen==='wish' && wish && (
        <div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(5,0,12,0.97)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,backdropFilter:'blur(14px)',overflow:'hidden'}}>

          {/* Background floating sparkles */}
          {Array.from({length:10},(_,i)=>(
            <div key={i} style={{
              position:'absolute',
              left:`${5+i*10}%`,
              top:`${10+((i*37)%70)}%`,
              animation:`floatSparkle ${1.5+i*.3}s ${i*.2}s ease-in-out infinite`,
              pointerEvents:'none',
              fontSize: i%2===0 ? '1.2rem' : '0.85rem',
            } as React.CSSProperties}>
              {['✨','⭐','💫','🌟','💜'][i%5]}
            </div>
          ))}

          {/* MAIN GIFT CARD — slides up from bottom */}
          <div style={{animation:'giftSlideUp 0.6s cubic-bezier(.36,1.3,.5,1) both',width:'min(420px,92vw)',position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>

            {/* BOW — flies upward at 0.75s */}
            <div style={{position:'absolute',top:-32,left:'50%',transform:'translateX(-50%)',fontSize:'3rem',zIndex:10,animation:'bowFlyUp 0.7s 0.75s cubic-bezier(.36,1.3,.5,1) both',filter:'drop-shadow(0 0 12px rgba(255,100,200,0.9))'}}>
              🎀
            </div>

            {/* RIBBON — left slides left, right slides right at 0.6s */}
            <div style={{position:'absolute',top:'18%',left:0,right:0,height:20,zIndex:9,display:'flex',overflow:'hidden',borderRadius:4}}>
              <div style={{flex:1,background:`linear-gradient(90deg,transparent,${wish.color}cc,${wish.color})`,animation:'ribbonLeft 0.55s 0.6s ease-in forwards',transformOrigin:'right center'}}/>
              <div style={{flex:1,background:`linear-gradient(90deg,${wish.color},${wish.color}cc,transparent)`,animation:'ribbonRight 0.55s 0.6s ease-in forwards',transformOrigin:'left center'}}/>
            </div>

            {/* BOX LID — lifts off at 1.05s */}
            <div style={{animation:'lidLift 0.65s 1.05s cubic-bezier(.36,1.3,.5,1) both',transformOrigin:'center bottom',zIndex:8,width:'100%'}}>
              <div style={{background:`linear-gradient(135deg,${wish.color}ee,${wish.color}88)`,borderRadius:'20px 20px 4px 4px',height:56,border:`3px solid ${wish.color}`,boxShadow:`0 -6px 24px ${wish.color}66`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontFamily:"'Racing Sans One',cursive",fontSize:'1rem',color:'#fff',letterSpacing:2,textShadow:'0 2px 8px rgba(0,0,0,0.6)'}}>
                  {wish.tag}
                </span>
              </div>
            </div>

            {/* BOX BODY */}
            <div style={{background:'linear-gradient(160deg,#140028,#1e0038,#0e001e)',border:`3px solid ${wish.color}`,borderTop:'none',borderRadius:'4px 4px 24px 24px',padding:'16px 24px 28px',boxShadow:`0 0 0 4px ${wish.color}22,0 20px 60px rgba(0,0,0,0.9),0 0 80px ${wish.color}33`,position:'relative',overflow:'hidden',width:'100%'}}>

              {/* Ribbon vertical stripe */}
              <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:20,height:'100%',background:`linear-gradient(180deg,${wish.color}88,${wish.color}33)`,pointerEvents:'none'}}/>

              {/* SPARKLE BURST — explodes at 1.35s */}
              <div style={{position:'absolute',top:'35%',left:'50%',transform:'translate(-50%,-50%)',animation:'sparkleBurst 0.65s 1.35s ease-out both',pointerEvents:'none',zIndex:5,fontSize:'3.5rem'}}>
                ✨
              </div>

              {/* Sparkle particles fly outward */}
              {([
                {sx:'-90px',sy:'-80px',e:'⭐'},{sx:'90px',sy:'-80px',e:'💫'},
                {sx:'-110px',sy:'10px',e:'✨'},{sx:'110px',sy:'10px',e:'🌟'},
                {sx:'-65px',sy:'85px',e:'💜'},{sx:'65px',sy:'85px',e:'⭐'},
              ] as {sx:string;sy:string;e:string}[]).map((p,i)=>(
                <div key={i} style={{position:'absolute',top:'35%',left:'50%',transform:'translate(-50%,-50%)',['--sx' as string]:p.sx,['--sy' as string]:p.sy,animation:`sparkleOut 0.7s ${1.35+i*.06}s ease-out both`,pointerEvents:'none',zIndex:5,fontSize:'1.1rem'}}>
                  {p.e}
                </div>
              ))}

              {/* PHOTO — reveals at 1.55s */}
              <div style={{animation:'photoReveal 0.7s 1.55s cubic-bezier(.36,1.3,.5,1) both',margin:'18px auto 14px',width:'clamp(110px,28vw,150px)',aspectRatio:'1',position:'relative',zIndex:6}}>
                {/* Spinning glow ring */}
                <div style={{position:'absolute',inset:-6,borderRadius:'50%',background:`conic-gradient(${wish.color},#fff4,${wish.color},#fff4,${wish.color})`,animation:'flagWave 3s linear infinite',opacity:0.5}}/>
                {/* Photo circle */}
                <div style={{position:'relative',zIndex:2,width:'100%',height:'100%',borderRadius:'50%',overflow:'hidden',border:`4px solid ${wish.color}`,boxShadow:`0 0 0 3px #fff2,0 0 30px ${wish.color}99`,background:`linear-gradient(135deg,${wish.color}33,#1a0030)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',animation:'photoFloat 3s 2.3s ease-in-out infinite'}}>
                  {wish.photo ? (
                    /* ── REPLACE BELOW with <img src={`/photo${wish.photo}.jpg`} ... /> once you add real photos to /public ── */
                    <img src={wish.photo} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} alt="Family photo" />
                  ) : (
                    <span style={{fontSize:'3.5rem'}}>{wish.av}</span>
                  )}
                </div>
              </div>

              {/* SENDER BADGE — pops in at 1.95s */}
              <div style={{animation:'badgePop 0.5s 1.95s cubic-bezier(.36,1.5,.5,1) both',display:'flex',alignItems:'center',justifyContent:'center',gap:8,margin:'0 auto 14px',background:`${wish.color}22`,border:`2px solid ${wish.color}66`,borderRadius:40,padding:'6px 18px',width:'fit-content',position:'relative',zIndex:6}}>
                <span style={{fontSize:'1.5rem'}}>{wish.av}</span>
                <span style={{fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(0.85rem,3vw,1.05rem)',color:wish.color}}>
                  From {wish.from}
                </span>
              </div>

              {/* SHORT WISH — fades in at 2.25s */}
              <div style={{animation:'wishTextIn 0.5s 2.25s ease-out both',fontFamily:"'Boogaloo',cursive",fontSize:'clamp(1.15rem,4vw,1.55rem)',color:'#fff',textAlign:'center',lineHeight:1.55,padding:'0 8px',position:'relative',zIndex:6,textShadow:`0 0 20px ${wish.color}88`}}>
                {SHORT_WISHES[wishIdx]}
              </div>

              {/* CONTINUE BUTTON — fades in at 2.65s */}
              <button onClick={continueFromWish} style={{animation:'btnFadeUp 0.5s 2.65s ease-out both',marginTop:20,display:'block',fontFamily:"'Racing Sans One',cursive",fontSize:'1rem',background:`linear-gradient(135deg,${wish.color},#6b21a8)`,color:'#fff',border:'none',borderRadius:40,padding:'13px 36px',cursor:'pointer',boxShadow:`0 6px 0 #3b0764,0 0 24px ${wish.color}55`,letterSpacing:1,width:'100%',position:'relative',zIndex:6}}>
                {G.current.stage >= totalStages ? '🏆 CLAIM THE TROPHY!' : 'NEXT STAGE ⚡'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ GAME OVER ═══ */}
      {screen==='gameover' && (
        <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 40%,#1a0010,#080010)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
          <div style={{fontSize:'4rem'}}>💥</div>
          <h2 style={{fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(2rem,7vw,3.5rem)',color:'#f87171',textShadow:'0 0 30px rgba(248,113,113,.7)',textAlign:'center'}}>OH NO! CRASH!</h2>
          <p style={{fontFamily:"'Boogaloo',cursive",fontSize:'clamp(1rem,3vw,1.3rem)',color:'rgba(255,255,255,.8)',textAlign:'center',padding:'0 20px'}}>Don't worry {childName}!<br/>Every champion crashes sometimes!</p>
          <div style={{fontFamily:"'Boogaloo',cursive",fontSize:'1.4rem',color:'#d8b4fe'}}>⭐ Stars: {goScore}</div>
          <button onClick={retry} style={{fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(1.1rem,3.5vw,1.8rem)',background:'linear-gradient(135deg,#9333ea,#6b21a8)',color:'#fff',border:'none',borderRadius:60,padding:'16px 44px',cursor:'pointer',letterSpacing:2,boxShadow:'0 7px 0 #3b0764'}}>
            🔄 TRY AGAIN!
          </button>
        </div>
      )}

      {/* ═══ WINNER ═══ */}
      {screen==='winner' && (
        <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 30%,#1e0042,#080010)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,padding:20,overflowY:'auto'}}>
          <div style={{fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(1.6rem,5.5vw,3.5rem)',color:'#d8b4fe',textAlign:'center',textShadow:'0 0 40px rgba(147,51,234,.8)',lineHeight:1.1}}>⚡ LIGHTNING {childName.toUpperCase()}<br/>IS THE CHAMPION! 🏆</div>
          <div className="anim-trophy" style={{fontSize:'2.2rem'}}>🏆🥇🎊⭐🚗⚡🎂</div>
          <div className="anim-winfloat" style={{width:'clamp(90px,20vw,130px)',aspectRatio:'1',borderRadius:'50%',overflow:'hidden',border:'5px solid #9333ea',boxShadow:'0 0 0 4px #6b21a8,0 0 50px rgba(147,51,234,.7)',background:'#180030',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,color:'rgba(255,255,255,.35)'}}>
            <span style={{fontSize:'2rem'}}>📸</span><small style={{fontSize:'.6rem',letterSpacing:1,textTransform:'uppercase'}}>Winner!</small>
          </div>
          <p style={{fontFamily:"'Boogaloo',cursive",fontSize:'1rem',color:'rgba(255,255,255,.65)',textAlign:'center',maxWidth:480,padding:'0 16px'}}>
            You collected all 7 wishes from your whole family! 💜
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))',gap:8,width:'100%',maxWidth:660}}>
            {activeWishes.map((w,i)=>(
              <div key={i} style={{background:'rgba(147,51,234,.08)',border:`2px solid ${w.color}44`,borderRadius:14,padding:'10px 12px',textAlign:'center'}}>
                <div style={{fontSize:'1.5rem'}}>{w.av}</div>
                <div style={{fontFamily:"'Racing Sans One',cursive",fontSize:'.75rem',color:'#d8b4fe',margin:'3px 0',letterSpacing:1}}>{w.from}</div>
                <div style={{fontFamily:"'Boogaloo',cursive",fontSize:'.82rem',color:'rgba(255,255,255,.8)',lineHeight:1.5}}>{w.text}</div>
              </div>
            ))}
          </div>
          <button onClick={playAgain} style={{marginTop:8,fontFamily:"'Racing Sans One',cursive",fontSize:'clamp(1.1rem,3.5vw,1.8rem)',background:'linear-gradient(135deg,#9333ea,#6b21a8)',color:'#fff',border:'none',borderRadius:60,padding:'16px 44px',cursor:'pointer',letterSpacing:2,boxShadow:'0 7px 0 #3b0764'}}>
            🏁 RACE AGAIN!
          </button>
        </div>
      )}
    </div>
  )
}
