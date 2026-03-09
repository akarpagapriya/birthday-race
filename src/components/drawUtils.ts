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
  x: number,
  y: number,
  w: number,
  h: number,
  carColor: string
) {
  ctx.save();
  ctx.translate(x, y);

  // 1. SOFT GROUND SHADOW
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.roundRect(-w * 0.55, -h * 0.5, w * 1.1, h * 1.1, 30);
  ctx.fill();

  // 2. THE "TOY" BODY (Contoured with Fenders)
  // This shape creates the "waist" in the middle
  ctx.fillStyle = carColor;
  ctx.beginPath();
  ctx.moveTo(-w * 0.4, -h * 0.5); // Front top left
  ctx.quadraticCurveTo(-w * 0.6, -h * 0.25, -w * 0.45, 0); // Front Fender
  ctx.quadraticCurveTo(-w * 0.6, h * 0.25, -w * 0.4, h * 0.5);  // Rear Fender
  ctx.lineTo(w * 0.4, h * 0.5);   // Rear bottom
  ctx.quadraticCurveTo(w * 0.6, h * 0.25, w * 0.45, 0);  // Rear Fender
  ctx.quadraticCurveTo(w * 0.6, -h * 0.25, w * 0.4, -h * 0.5); // Front Fender
  ctx.closePath();
  ctx.fill();

  // 3. INTERNAL 3D SHADING (Makes it look rounded)
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = w * 0.08;
  ctx.stroke();

  // 4. LARGE BUBBLE WINDSHIELD
  const glassGrad = ctx.createLinearGradient(0, -h * 0.4, 0, -h * 0.1);
  glassGrad.addColorStop(0, "#c8ecff");
  glassGrad.addColorStop(1, "#6ebfff");
  
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.roundRect(-w * 0.35, -h * 0.35, w * 0.7, h * 0.3, 12);
  ctx.fill();

  // Windshield Shine
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.roundRect(-w * 0.28, -h * 0.32, w * 0.15, h * 0.05, 5);
  ctx.fill();

  // 5. SIDE MIRRORS (The "Toy" Ears)
  ctx.fillStyle = carColor;
  ctx.beginPath();
  ctx.roundRect(-w * 0.65, -h * 0.2, w * 0.15, h * 0.12, 5); // Left
  ctx.roundRect(w * 0.5, -h * 0.2, w * 0.15, h * 0.12, 5);  // Right
  ctx.fill();

  // 6. WHEELS (Visible from top slightly)
  ctx.fillStyle = "#333";
  const wheelW = w * 0.15;
  const wheelH = h * 0.2;
  ctx.fillRect(-w * 0.6, -h * 0.4, wheelW, wheelH); // Front L
  ctx.fillRect(w * 0.45, -h * 0.4, wheelW, wheelH); // Front R
  ctx.fillRect(-w * 0.6, h * 0.2, wheelW, wheelH);  // Rear L
  ctx.fillRect(w * 0.45, h * 0.2, wheelW, wheelH);  // Rear R

  // 7. BIG "BUG" HEADLIGHTS
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(-w * 0.25, -h * 0.45, w * 0.12, h * 0.08, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.25, -h * 0.45, w * 0.12, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Lens detail
  ctx.fillStyle = "#fffae3";
  ctx.beginPath();
  ctx.ellipse(-w * 0.25, -h * 0.45, w * 0.06, h * 0.04, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.25, -h * 0.45, w * 0.06, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  // 8. RACING STRIPE (Classy touch)
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(-w * 0.05, -h * 0.5, w * 0.1, h * 0.15); // Front stripe
  ctx.fillRect(-w * 0.05, h * 0.35, w * 0.1, h * 0.15); // Rear stripe

  ctx.restore();
}

// ── colour helpers ──
function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, (n >> 16) + amt)
  const g = Math.min(255, ((n >> 8) & 0xff) + amt)
  const b = Math.min(255, (n & 0xff) + amt)
  return `rgb(${r},${g},${b})`
}
function darken(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - amt)
  const g = Math.max(0, ((n >> 8) & 0xff) - amt)
  const b = Math.max(0, (n & 0xff) - amt)
  return `rgb(${r},${g},${b})`
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
