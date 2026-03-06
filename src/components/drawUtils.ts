export function drawSpaceBg(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  bgStars: {x:number;y:number;r:number;speed:number;op:number}[],
  stageColor: string,
  bgTimer: number
) {
  ctx.fillStyle = '#080010'
  ctx.fillRect(0, 0, W, H)
  bgStars.forEach(s => {
    ctx.beginPath()
    ctx.arc(s.x / 1200 * W, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200,180,255,${s.op})`
    ctx.fill()
  })
  if (bgTimer % 200 === 0) {
    const nx = Math.random()*W, ny = Math.random()*H*.8, nr = 40+Math.random()*80
    const ng = ctx.createRadialGradient(nx,ny,0,nx,ny,nr)
    ng.addColorStop(0, stageColor+'18'); ng.addColorStop(1,'transparent')
    ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(nx,ny,nr,0,Math.PI*2); ctx.fill()
  }
}

export function drawRoad(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  roadScroll: number,
  stageColor: string,
  stageName: string
) {
  const rL=W*.12, rR=W*.88, rW=rR-rL
  const rg = ctx.createLinearGradient(rL,0,rR,0)
  rg.addColorStop(0,'#0e0020'); rg.addColorStop(.15,'#160030')
  rg.addColorStop(.5,'#1e0040'); rg.addColorStop(.85,'#160030'); rg.addColorStop(1,'#0e0020')
  ctx.fillStyle = rg; ctx.fillRect(rL,0,rW,H)
  ;[rL,rR].forEach(ex => {
    const eg = ctx.createLinearGradient(ex-5,0,ex+5,0)
    eg.addColorStop(0,'transparent'); eg.addColorStop(.5,stageColor+'bb'); eg.addColorStop(1,'transparent')
    ctx.fillStyle = eg; ctx.fillRect(ex-4,0,8,H)
  })
  ctx.setLineDash([36,24]); ctx.lineDashOffset = -roadScroll
  ctx.strokeStyle = 'rgba(196,181,253,0.14)'; ctx.lineWidth = 2
  ;[rL+rW/3, rL+rW*2/3].forEach(lx => {
    ctx.beginPath(); ctx.moveTo(lx,0); ctx.lineTo(lx,H); ctx.stroke()
  })
  ctx.setLineDash([])
  ctx.save()
  ctx.font = `bold ${Math.max(14,W*.032)}px 'Racing Sans One',cursive`
  ctx.fillStyle = 'rgba(255,255,255,0.022)'; ctx.textAlign = 'center'
  ctx.fillText(stageName, W/2, H*.5)
  ctx.restore()
}

export function drawToycar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  stageColor: string
) {
  const cw = w * 1.5
  ctx.save()

  // ground shadow
  const sg = ctx.createRadialGradient(x,y+h*.52,0,x,y+h*.52,cw*.75)
  sg.addColorStop(0,'rgba(0,0,0,0.45)'); sg.addColorStop(1,'rgba(0,0,0,0)')
  ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(x,y+h*.53,cw*.7,h*.1,0,0,Math.PI*2); ctx.fill()

  // engine glow
  const eg = ctx.createRadialGradient(x,y+h*.2,0,x,y+h*.2,cw)
  eg.addColorStop(0, stageColor+'50'); eg.addColorStop(1,'transparent')
  ctx.fillStyle = eg; ctx.beginPath(); ctx.ellipse(x,y+h*.2,cw,h*.55,0,0,Math.PI*2); ctx.fill()

  // chassis
  ctx.save()
  ctx.shadowColor = stageColor; ctx.shadowBlur = 20
  const cg = ctx.createLinearGradient(x-cw*.5,y+h*.05,x+cw*.5,y+h*.5)
  cg.addColorStop(0,'#ff3a6e'); cg.addColorStop(.3,'#e81060')
  cg.addColorStop(.7,'#c0004a'); cg.addColorStop(1,'#7a0030')
  ctx.fillStyle = cg
  ctx.beginPath()
  ctx.moveTo(x-cw*.48, y+h*.48); ctx.lineTo(x-cw*.52, y+h*.08)
  ctx.quadraticCurveTo(x-cw*.52,y-h*.02,x-cw*.4,y-h*.02)
  ctx.lineTo(x+cw*.4,y-h*.02)
  ctx.quadraticCurveTo(x+cw*.52,y-h*.02,x+cw*.52,y+h*.08)
  ctx.lineTo(x+cw*.48,y+h*.48); ctx.closePath(); ctx.fill()
  ctx.restore()

  // cabin roof
  ctx.save()
  const rg = ctx.createLinearGradient(x-cw*.28,y-h*.5,x+cw*.28,y+h*.02)
  rg.addColorStop(0,'#ff7aaa'); rg.addColorStop(.4,'#e8105e'); rg.addColorStop(1,'#a0003e')
  ctx.fillStyle = rg
  ctx.beginPath()
  ctx.moveTo(x-cw*.25,y-h*.02); ctx.lineTo(x-cw*.32,y-h*.38)
  ctx.quadraticCurveTo(x-cw*.30,y-h*.52,x-cw*.15,y-h*.52)
  ctx.lineTo(x+cw*.15,y-h*.52)
  ctx.quadraticCurveTo(x+cw*.30,y-h*.52,x+cw*.32,y-h*.38)
  ctx.lineTo(x+cw*.25,y-h*.02); ctx.closePath(); ctx.fill()
  // cabin highlight
  ctx.fillStyle='rgba(255,200,220,0.18)'
  ctx.beginPath()
  ctx.moveTo(x-cw*.23,y-h*.04); ctx.lineTo(x-cw*.28,y-h*.35)
  ctx.lineTo(x-cw*.12,y-h*.35); ctx.lineTo(x-cw*.1,y-h*.04); ctx.closePath(); ctx.fill()
  ctx.restore()

  // windshield
  const wg = ctx.createLinearGradient(x,y-h*.5,x,y-h*.05)
  wg.addColorStop(0,'rgba(180,240,255,0.78)'); wg.addColorStop(.4,'rgba(100,200,255,0.55)'); wg.addColorStop(1,'rgba(30,80,200,0.3)')
  ctx.fillStyle = wg
  ctx.beginPath()
  ctx.moveTo(x-cw*.26,y-h*.04); ctx.lineTo(x-cw*.3,y-h*.36)
  ctx.lineTo(x+cw*.3,y-h*.36); ctx.lineTo(x+cw*.26,y-h*.04); ctx.closePath(); ctx.fill()
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=1.5
  ctx.beginPath(); ctx.moveTo(x-cw*.22,y-h*.06); ctx.lineTo(x-cw*.26,y-h*.32); ctx.stroke()

  // side windows
  ;[[x-cw*.38,y-h*.28,cw*.09,h*.18],[x+cw*.29,y-h*.28,cw*.09,h*.18]].forEach(([wx,wy,ww,wh]) => {
    ctx.fillStyle='rgba(120,200,255,0.4)'
    ctx.beginPath(); ctx.roundRect(wx,wy,ww,wh,3); ctx.fill()
    ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1; ctx.stroke()
  })

  // hood stripes
  ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=2
  ;[x-cw*.1,x+cw*.1].forEach(sx => {
    ctx.beginPath(); ctx.moveTo(sx,y-h*.02); ctx.lineTo(sx,y+h*.35); ctx.stroke()
  })

  // lightning decal
  ctx.fillStyle='rgba(255,230,0,0.85)'
  ctx.shadowColor='#FFD600'; ctx.shadowBlur=10
  ctx.font=`bold ${Math.max(9,cw*.22)}px serif`
  ctx.textAlign='center'; ctx.textBaseline='middle'
  ctx.fillText('⚡',x,y+h*.15)

  // racing number
  ctx.shadowBlur=0
  ctx.fillStyle='rgba(255,255,255,0.22)'
  ctx.beginPath(); ctx.roundRect(x+cw*.15,y-h*.01,cw*.22,h*.28,4); ctx.fill()
  ctx.fillStyle='#fff'
  ctx.font=`bold ${Math.max(8,cw*.18)}px 'Boogaloo',cursive`
  ctx.fillText('6',x+cw*.26,y+h*.13)

  // headlights
  ;[[x-cw*.34,y-h*.5],[x+cw*.34,y-h*.5]].forEach(([lx,ly]) => {
    ctx.fillStyle='#222'; ctx.beginPath(); ctx.roundRect(lx-cw*.09,ly,cw*.18,h*.1,3); ctx.fill()
    const lg = ctx.createRadialGradient(lx,ly+h*.05,0,lx,ly+h*.05,cw*.1)
    lg.addColorStop(0,'rgba(255,255,210,1)'); lg.addColorStop(.5,'rgba(255,210,80,0.8)'); lg.addColorStop(1,'rgba(255,140,0,0)')
    ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(lx,ly+h*.05,cw*.1,0,Math.PI*2); ctx.fill()
    ctx.save(); ctx.globalAlpha=0.1
    const bg=ctx.createRadialGradient(lx,ly-h*.08,0,lx,ly-h*.08,cw*.55)
    bg.addColorStop(0,'rgba(255,255,180,1)'); bg.addColorStop(1,'transparent')
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(lx,ly-h*.08,cw*.55,0,Math.PI*2); ctx.fill()
    ctx.restore()
  })

  // tail lights
  ;[[x-cw*.36,y+h*.44],[x+cw*.36,y+h*.44]].forEach(([lx,ly]) => {
    ctx.fillStyle='#ff2200'; ctx.shadowColor='#ff4400'; ctx.shadowBlur=8
    ctx.beginPath(); ctx.roundRect(lx-cw*.07,ly-h*.04,cw*.14,h*.07,2); ctx.fill()
  })

  // wheels
  const wr = cw*.13
  ;[[x-cw*.44,y+h*.28],[x+cw*.44,y+h*.28],[x-cw*.44,y+h*.42],[x+cw*.44,y+h*.42]].forEach(([wx,wy]) => {
    ctx.save()
    ctx.shadowBlur=0
    ctx.beginPath(); ctx.arc(wx,wy,wr,0,Math.PI*2)
    ctx.fillStyle='#0d0020'; ctx.fill()
    ctx.beginPath(); ctx.arc(wx,wy,wr,0,Math.PI*2)
    ctx.strokeStyle='#2a0050'; ctx.lineWidth=wr*.28; ctx.stroke()
    const rimG = ctx.createRadialGradient(wx-wr*.15,wy-wr*.15,0,wx,wy,wr*.72)
    rimG.addColorStop(0,'rgba(255,255,255,0.9)')
    rimG.addColorStop(.3,stageColor+'dd')
    rimG.addColorStop(.7,'rgba(100,0,200,0.5)')
    rimG.addColorStop(1,'rgba(40,0,80,0.4)')
    ctx.beginPath(); ctx.arc(wx,wy,wr*.72,0,Math.PI*2); ctx.fillStyle=rimG; ctx.fill()
    ctx.beginPath(); ctx.arc(wx,wy,wr*.28,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.fill()
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=wr*.1
    for(let s=0;s<4;s++){
      const a=s*Math.PI/2
      ctx.beginPath()
      ctx.moveTo(wx+Math.cos(a)*wr*.28,wy+Math.sin(a)*wr*.28)
      ctx.lineTo(wx+Math.cos(a)*wr*.68,wy+Math.sin(a)*wr*.68); ctx.stroke()
    }
    ctx.restore()
  })

  ctx.restore()
}

export function drawStar3D(ctx: CanvasRenderingContext2D, x:number, y:number, r:number, spin:number) {
  ctx.save(); ctx.translate(x,y); ctx.rotate(spin)
  const gg = ctx.createRadialGradient(0,0,0,0,0,r*2.8)
  gg.addColorStop(0,'rgba(255,220,80,0.55)'); gg.addColorStop(.5,'rgba(255,180,0,0.2)'); gg.addColorStop(1,'transparent')
  ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(0,0,r*2.8,0,Math.PI*2); ctx.fill()
  const pts=5,outer=r,inner=r*.42
  ctx.beginPath()
  for(let i=0;i<pts*2;i++){
    const a=(i*Math.PI)/pts-(Math.PI/2); const dist=i%2===0?outer:inner
    i===0?ctx.moveTo(Math.cos(a)*dist,Math.sin(a)*dist):ctx.lineTo(Math.cos(a)*dist,Math.sin(a)*dist)
  }
  ctx.closePath()
  const sg = ctx.createLinearGradient(-r,-r,r,r)
  sg.addColorStop(0,'#fffde4'); sg.addColorStop(.25,'#ffe066'); sg.addColorStop(.6,'#f59e0b'); sg.addColorStop(1,'#92400e')
  ctx.fillStyle=sg; ctx.shadowColor='#fbbf24'; ctx.shadowBlur=14; ctx.fill()
  ctx.beginPath(); ctx.arc(-r*.18,-r*.22,r*.22,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.fill()
  ctx.beginPath(); ctx.arc(r*.08,r*.08,r*.1,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fill()
  ctx.restore()
}

export function drawObstacle(ctx: CanvasRenderingContext2D, x:number, y:number, r:number, type:string) {
  if(type==='rock') {
    ctx.save(); ctx.translate(x,y)
    const sg=ctx.createRadialGradient(0,r*.6,0,0,r*.6,r*.8)
    sg.addColorStop(0,'rgba(0,0,0,0.3)'); sg.addColorStop(1,'transparent')
    ctx.fillStyle=sg; ctx.beginPath(); ctx.ellipse(0,r*.6,r*.8,r*.25,0,0,Math.PI*2); ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-r*.6,r*.3);ctx.lineTo(-r*.75,-r*.1);ctx.lineTo(-r*.4,-r*.55)
    ctx.lineTo(r*.1,-r*.7);ctx.lineTo(r*.65,-r*.35);ctx.lineTo(r*.7,r*.25)
    ctx.lineTo(r*.35,r*.55);ctx.lineTo(-r*.3,r*.6);ctx.closePath()
    const rg=ctx.createLinearGradient(-r,-r,r,r)
    rg.addColorStop(0,'#9ca3af');rg.addColorStop(.4,'#6b7280');rg.addColorStop(1,'#1f2937')
    ctx.fillStyle=rg;ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=8;ctx.fill()
    ctx.beginPath();ctx.moveTo(-r*.3,-r*.5);ctx.lineTo(r*.1,-r*.65);ctx.lineTo(r*.5,-r*.3)
    ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=2;ctx.stroke()
    ctx.restore()
  } else if(type==='barrier') {
    ctx.save(); ctx.translate(x,y)
    const pg=ctx.createLinearGradient(-r*.08,0,r*.08,0)
    pg.addColorStop(0,'#6b7280');pg.addColorStop(.4,'#d1d5db');pg.addColorStop(1,'#374151')
    ctx.fillStyle=pg;ctx.fillRect(-r*.06,-r*.5,r*.12,r)
    ctx.save();ctx.beginPath();ctx.roundRect(-r*.5,-r*.5,r,r*.35,4);ctx.clip()
    for(let i=0;i<8;i++){
      ctx.fillStyle=i%2===0?'#f97316':'#fff'
      ctx.fillRect(-r*.5+i*(r*.125),-r*.5,r*.125,r*.35)
    }
    ctx.restore()
    ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=2
    ctx.beginPath();ctx.roundRect(-r*.5,-r*.5,r,r*.35,4);ctx.stroke()
    ctx.fillStyle='rgba(255,255,255,0.2)'
    ctx.beginPath();ctx.roundRect(-r*.5,-r*.5,r,r*.06,4);ctx.fill()
    ctx.restore()
  } else if(type==='fuel') {
    ctx.save(); ctx.translate(x,y)
    const bg=ctx.createLinearGradient(-r,0,r,0)
    bg.addColorStop(0,'#065f46');bg.addColorStop(.4,'#34d399');bg.addColorStop(1,'#064e3b')
    ctx.fillStyle=bg;ctx.shadowColor='#34d399';ctx.shadowBlur=12
    ctx.beginPath();ctx.roundRect(-r*.55,-r*.7,r*1.1,r*1.4,r*.2);ctx.fill()
    ctx.fillStyle='#374151';ctx.beginPath();ctx.roundRect(-r*.2,-r*.85,r*.4,r*.25,r*.1);ctx.fill()
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.beginPath();ctx.roundRect(-r*.38,-r*.4,r*.76,r*.7,r*.1);ctx.fill()
    ctx.fillStyle='#fff';ctx.font=`bold ${r*.55}px serif`;ctx.textAlign='center';ctx.textBaseline='middle'
    ctx.fillText('⛽',0,r*.02)
    ctx.fillStyle='rgba(255,255,255,0.25)';ctx.beginPath();ctx.roundRect(-r*.42,-r*.65,r*.22,r*.5,r*.08);ctx.fill()
    ctx.restore()
  } else {
    // traffic light
    ctx.save(); ctx.translate(x,y)
    const h=r*3.2
    ctx.fillStyle='#374151';ctx.fillRect(-r*.12,-h*.5,r*.24,h)
    const hg=ctx.createLinearGradient(-r*.55,0,r*.55,0)
    hg.addColorStop(0,'#1f2937');hg.addColorStop(.4,'#374151');hg.addColorStop(1,'#111827')
    ctx.fillStyle=hg;ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=8
    ctx.beginPath();ctx.roundRect(-r*.55,-h*.5,r*1.1,h,r*.3);ctx.fill()
    ;([[0,-r*1.1,'#ef4444','#fca5a5'],[0,0,'#f59e0b','#fde68a'],[0,r*1.1,'#22c55e','#86efac']] as const).forEach(([lx,ly,c,gc]) => {
      const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,r*.35)
      lg.addColorStop(0,gc);lg.addColorStop(.5,c);lg.addColorStop(1,c+'88')
      ctx.fillStyle=lg;ctx.shadowColor=c;ctx.shadowBlur=10
      ctx.beginPath();ctx.arc(lx,ly,r*.34,0,Math.PI*2);ctx.fill()
    })
    ctx.restore()
  }
}
