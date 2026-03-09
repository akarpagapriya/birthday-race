import Link from 'next/link'
import Image from 'next/image'
import heroImg from '@/assets/race-hero.png'


export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Boogaloo&family=Nunito:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #06000f; }

        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes flagWave {
          0%   { transform: rotate(-8deg) scale(1); }
          100% { transform: rotate(8deg) scale(1.05); }
        }
        @keyframes roadScroll {
          from { background-position: 0 0; }
          to   { background-position: 0 80px; }
        }
        @keyframes carDrive {
          0%   { left: -80px; }
          100% { left: calc(100% + 80px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes starFloat {
          0%,100% { transform: translateY(0) rotate(0deg); opacity:0.7; }
          50%      { transform: translateY(-14px) rotate(20deg); opacity:1; }
        }
        @keyframes btnBounce {
          0%,100% { transform: translateY(0); box-shadow: 0 8px 0 #2a0060, 0 0 40px #9333ea88; }
          50%      { transform: translateY(-4px); box-shadow: 0 12px 0 #2a0060, 0 0 60px #9333eacc; }
        }
        @keyframes dotDrift {
          0%   { transform: translate(0,0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }

        .hero-title {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(3rem, 11vw, 7.5rem);
          line-height: 0.95;
          color: #fff;
          text-align: center;
          animation: fadeUp 0.7s 0.1s ease-out both;
        }
        .hero-accent {
          background: linear-gradient(90deg, #c084fc, #e879f9, #a78bfa, #c084fc);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .cta-btn {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(1rem, 3.5vw, 1.4rem);
          background: linear-gradient(135deg, #9333ea, #6b21a8);
          color: #fff;
          border: none;
          border-radius: 60px;
          padding: 18px 52px;
          cursor: pointer;
          letter-spacing: 2px;
          text-decoration: none;
          display: inline-block;
          animation: btnBounce 2s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }
        .step-card {
          animation: fadeUp 0.5s ease-out both;
        }
        .step-card:hover {
          transform: translateY(-4px);
          transition: transform 0.2s ease;
        }
        .floating-star {
          position: absolute;
          pointer-events: none;
          animation: starFloat var(--dur) var(--delay) ease-in-out infinite;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #1e0042 0%, #06000f 55%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: "'Nunito', sans-serif",
        overflowX: 'hidden', position: 'relative',
      }}>

        {/* ── FLOATING STARS BG ── */}
        {[
          { top: '8%', left: '6%', e: '⭐', dur: '3.2s', delay: '0s' },
          { top: '14%', left: '88%', e: '✨', dur: '2.8s', delay: '0.4s' },
          { top: '32%', left: '4%', e: '💫', dur: '3.8s', delay: '0.8s' },
          { top: '28%', left: '93%', e: '⭐', dur: '2.5s', delay: '1.1s' },
          { top: '55%', left: '7%', e: '✨', dur: '3.5s', delay: '0.2s' },
          { top: '62%', left: '90%', e: '💫', dur: '4s', delay: '0.6s' },
          { top: '78%', left: '5%', e: '⭐', dur: '2.9s', delay: '1.4s' },
          { top: '82%', left: '92%', e: '✨', dur: '3.1s', delay: '0.9s' },
        ].map((s, i) => (
          <div key={i} className="floating-star" style={{
            top: s.top, left: s.left,
            fontSize: 'clamp(1rem,2.5vw,1.6rem)',
            ['--dur' as string]: s.dur,
            ['--delay' as string]: s.delay,
          } as React.CSSProperties}>
            {s.e}
          </div>
        ))}

        {/* ── HERO SECTION ── */}
        <div style={{
          width: '100%', maxWidth: 680,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 'clamp(48px,10vw,80px) 24px 0',
          gap: 0,
        }}>

          {/* Flag + glow */}
          <div style={{
            fontSize: 'clamp(3.5rem,14vw,8rem)',
            animation: 'flagWave 1.4s ease-in-out infinite alternate, fadeUp 0.5s ease-out both',
            marginBottom: 12, lineHeight: 1,
          }}>
            <Image
              src={heroImg}
              alt="Birthday Race"
              width={100}
              height={100}
              style={{
                animation: 'flagWave 1.4s ease-in-out infinite alternate',
                marginBottom: 12,
              }}
            />
          </div>

          {/* Title */}
          <h1 className="hero-title" style={{ marginBottom: 12 }}>
            Birthday<br />
            <span className="hero-accent">Race!</span>
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Boogaloo', cursive",
            fontSize: 'clamp(1.05rem,3vw,1.45rem)',
            color: 'rgba(255,255,255,0.72)',
            textAlign: 'center',
            lineHeight: 1.7, maxWidth: 460,
            padding: '0 8px', marginBottom: 10,
            animation: 'fadeUp 0.6s 0.25s ease-out both',
          }}>
            A <strong style={{ color: '#d8b4fe' }}>personalised race game</strong> where your child<br />
            unlocks family wishes hidden inside gift boxes! 🎁
          </p>

          {/* Meta pills */}
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
            marginBottom: 36,
            animation: 'fadeUp 0.6s 0.35s ease-out both',
          }}>
            {['⏱️ 5 minutes', '📱 Any phone', '🆓 Free'].map((t, i) => (
              <div key={i} style={{
                fontFamily: "'Boogaloo', cursive", fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 40, padding: '4px 14px',
              }}>{t}</div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ animation: 'fadeUp 0.6s 0.45s ease-out both', marginBottom: 14 }}>
            <Link href="/create" className="cta-btn">
              🎁 CREATE A BIRTHDAY GAME
            </Link>
          </div>

          <p style={{
            fontFamily: "'Boogaloo', cursive", fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.22)', marginBottom: 52,
            animation: 'fadeUp 0.6s 0.5s ease-out both',
          }}>
            Made with 💜 for Kabileshwar's 6th birthday
          </p>
        </div>

        {/* ── ANIMATED ROAD STRIP ── */}
        <div style={{
          width: '100%', position: 'relative',
          background: '#0e001e',
          borderTop: '2px solid #3b0764',
          borderBottom: '2px solid #3b0764',
          height: 64, overflow: 'hidden',
          marginBottom: 52,
        }}>
          {/* Scrolling dashes */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 30px, #9333ea44 30px, #9333ea44 60px)',
            backgroundSize: '80px 4px',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
            animation: 'roadScroll 0.6s linear infinite',
          }} />
          {/* Driving car */}
          <div style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            fontSize: 'clamp(1.8rem,6vw,2.8rem)',
            animation: 'carDrive 3.5s linear infinite',
            filter: 'drop-shadow(0 0 12px #9333ea)',
          }}>🏎️</div>
          {/* Gift boxes trailing */}
          {[{ delay: '0.8s', left: 'calc(100% + 20px)' }, { delay: '1.6s', left: 'calc(100% + 60px)' }].map((g, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              fontSize: '1.4rem',
              animation: `carDrive 3.5s ${g.delay} linear infinite`,
              opacity: 0.5,
            }}>🎁</div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{
          width: '100%', maxWidth: 640, padding: '0 20px',
          marginBottom: 60,
        }}>
          {/* Section label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 28,
          }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#9333ea55)' }} />
            <div style={{
              fontFamily: "'Racing Sans One', cursive", fontSize: '0.72rem',
              color: '#9333ea', letterSpacing: 4,
            }}>HOW IT WORKS</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#9333ea55,transparent)' }} />
          </div>

          {/* Step cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { n: '01', icon: '✍️', title: "Enter name & age", desc: "Tell us who the birthday champion is and pick their race car colour.", col: '#c084fc' },
              { n: '02', icon: '💜', title: "Add family wishes", desc: "Add up to 7 people — name, emoji, and a short birthday wish each.", col: '#e879f9' },
              { n: '03', icon: '📸', title: "Upload your photos", desc: "Each family member's photo hides inside a gift box on the track.", col: '#a78bfa' },
              { n: '04', icon: '🚗', title: "Child races to unlock!", desc: "Win each stage → a gift box explodes open with a real family face!", col: '#818cf8' },
            ].map((s, i) => (
              <div key={i} className="step-card" style={{
                animationDelay: `${0.55 + i * 0.1}s`,
                display: 'flex', alignItems: 'center', gap: 14,
                background: `linear-gradient(100deg,${s.col}12,rgba(0,0,0,0.2))`,
                border: `1.5px solid ${s.col}33`,
                borderRadius: 18, padding: '14px 18px',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Left accent */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg,${s.col},${s.col}44)`, borderRadius: '18px 0 0 18px' }} />

                {/* Step number */}
                <div style={{
                  flexShrink: 0, width: 36, height: 36,
                  borderRadius: '50%', background: `${s.col}22`,
                  border: `1.5px solid ${s.col}66`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Racing Sans One', cursive", fontSize: '0.7rem',
                  color: s.col, letterSpacing: 1,
                }}>
                  {s.n}
                </div>

                {/* Icon */}
                <div style={{ fontSize: '1.6rem', flexShrink: 0, filter: `drop-shadow(0 0 6px ${s.col})` }}>
                  {s.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Racing Sans One', cursive", fontSize: '0.85rem',
                    color: s.col, letterSpacing: 1, marginBottom: 3,
                    textShadow: `0 0 8px ${s.col}88`,
                  }}>{s.title}</div>
                  <div style={{
                    fontFamily: "'Boogaloo', cursive", fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.65)', lineHeight: 1.4,
                  }}>{s.desc}</div>
                </div>

                {/* Right emoji */}
                <div style={{ fontSize: '1.2rem', flexShrink: 0, opacity: 0.4 }}>
                  {i === 3 ? '🎁' : '→'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{
          width: '100%', maxWidth: 480,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '0 24px 60px', gap: 16,
          animation: 'fadeUp 0.6s 0.7s ease-out both',
        }}>
          <div style={{
            fontFamily: "'Racing Sans One', cursive",
            fontSize: 'clamp(1.2rem,4vw,1.8rem)',
            color: '#fff', textAlign: 'center', lineHeight: 1.2,
            textShadow: '0 0 30px #9333ea88',
          }}>
            Ready to make their birthday<br />
            <span style={{ color: '#c084fc' }}>unforgettable? 🏆</span>
          </div>

          <Link href="/create" className="cta-btn" style={{ fontSize: 'clamp(0.9rem,3vw,1.2rem)', padding: '14px 40px' }}>
            🚦 LET'S BUILD THE GAME
          </Link>
        </div>
      </div>
    </>
  )
}