'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import heroImg from '@/assets/race-hero.png'

export default function HomePage() {
  const [showHiw, setShowHiw] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Boogaloo&family=Nunito:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; overflow-x: hidden; background: #06000f; }

        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes flagWave {
          0%   { transform: rotate(-6deg) scale(1); }
          100% { transform: rotate(6deg) scale(1.05); }
        }
        @keyframes roadScroll {
          from { background-position: 0 0; }
          to   { background-position: 80px 0; }
        }
        @keyframes carDrive {
          0%   { left: -100px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { left: calc(100% + 100px); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          50%  { background-position: 150% center; }
          100% { background-position: 300% center; }
        }
        @keyframes starFloat {
          0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50%      { transform: translateY(-12px) rotate(15deg); opacity: 1; }
        }
        @keyframes btnBounce {
          0%,100% { transform: translateY(0); box-shadow: 0 7px 0 #2a0060, 0 0 30px #9333ea77; }
          50%      { transform: translateY(-3px); box-shadow: 0 10px 0 #2a0060, 0 0 50px #9333eaaa; }
        }
        @keyframes hiwSlideIn {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nodePop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .page-wrap {
          width: 100%;
          min-height: 100vh;
          background: radial-gradient(ellipse at 50% 0%, #1e0042 0%, #06000f 60%);
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Nunito', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .floating-star {
          position: fixed;
          pointer-events: none;
          animation: starFloat var(--dur) var(--delay) ease-in-out infinite;
          z-index: 0;
        }

        .hero-title {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(2.8rem, 10vw, 7rem);
          line-height: 0.95;
          color: #fff;
          text-align: center;
          text-shadow: 3px 3px 0 #3b076488;
          animation: fadeUp 0.6s 0.1s ease-out both;
          margin-bottom: 10px;
        }

        .hero-accent {
          background: linear-gradient(135deg,#fde68a 0%,#e879f9 35%,#c084fc 50%,#818cf8 65%,#e879f9 80%,#fde68a 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .cta-btn {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(0.95rem, 3vw, 1.3rem);
          background: linear-gradient(135deg, #9333ea, #6b21a8);
          color: #fff;
          border: none;
          border-radius: 60px;
          padding: clamp(14px, 3vw, 18px) clamp(32px, 6vw, 52px);
          cursor: pointer;
          letter-spacing: 2px;
          text-decoration: none;
          display: inline-block;
          animation: btnBounce 2s ease-in-out infinite;
          white-space: nowrap;
          max-width: 100%;
        }


        .timeline {
          width: 100%;
          max-width: 660px;
          margin: 0 auto;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 0 20px;
        }

        .timeline-item {
          display: flex;
          gap: clamp(16px, 4vw, 28px);
          position: relative;
          animation: fadeUp 0.5s ease-out both;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: clamp(18px, 3.5vw, 22px);
          top: clamp(40px, 7vw, 46px);
          width: 2px;
          bottom: 0;
          background: linear-gradient(180deg, #9333ea33, transparent);
        }

        .timeline-node {
          width: clamp(36px, 7vw, 44px);
          height: clamp(36px, 7vw, 44px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(1.1rem, 3vw, 1.4rem);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          animation: nodePop 0.5s ease-out both;
        }

        .timeline-right {
          flex: 1;
          padding-bottom: clamp(28px, 5vw, 40px);
          min-width: 0;
        }

        .timeline-step {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(0.55rem, 1.5vw, 0.65rem);
          letter-spacing: 3px;
          margin-bottom: 4px;
          opacity: 0.7;
        }

        .timeline-title {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(0.95rem, 3vw, 1.25rem);
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 5px;
          line-height: 1.2;
        }

        .timeline-desc {
          font-family: 'Boogaloo', cursive;
          font-size: clamp(0.85rem, 2.2vw, 1rem);
          color: rgba(255,255,255,0.55);
          line-height: 1.5;
        }

        @media (max-width: 400px) {
          .cta-btn { letter-spacing: 1px; }
        }
      `}</style>

      <div className="page-wrap">

        {/* Floating stars */}
        {[
          { top: '8%',  left: '6%',  e: '⭐', dur: '3.2s', delay: '0s'   },
          { top: '14%', left: '88%', e: '✨', dur: '2.8s', delay: '0.4s' },
          { top: '32%', left: '4%',  e: '💫', dur: '3.8s', delay: '0.8s' },
          { top: '28%', left: '93%', e: '⭐', dur: '2.5s', delay: '1.1s' },
          { top: '55%', left: '7%',  e: '✨', dur: '3.5s', delay: '0.2s' },
          { top: '62%', left: '90%', e: '💫', dur: '4s',   delay: '0.6s' },
        ].map((s, i) => (
          <div key={i} className="floating-star" style={{
            top: s.top, left: s.left,
            fontSize: 'clamp(1rem,2.5vw,1.6rem)',
            ['--dur' as string]: s.dur,
            ['--delay' as string]: s.delay,
          } as React.CSSProperties}>{s.e}</div>
        ))}

        {/* ── HERO ── */}
        <div style={{
          width: '100%', maxWidth: 680,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: showHiw ? 'clamp(32px,6vw,52px) 24px 0' : 'clamp(48px,10vw,80px) 24px 0',
          transition: 'padding 0.5s ease',
          gap: 0, zIndex: 1, position: 'relative',
        }}>

          {/* Hero image */}
          <div style={{ fontSize: '2.8rem', marginBottom: 4, alignItems: 'center', display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Image
              src={heroImg}
              alt="Birthday Notify Heart"
              width={150}
              height={150}
              style={{
                animation: 'flagWave 1.4s ease-in-out infinite alternate',
                marginBottom: 12,
                width: 'clamp(80px, 20vw, 150px)',
                height: 'auto',
              }}
            />
            </div>

          {/* Title */}
          <h1 className="hero-title" style={{ marginBottom: 10 }}>
            Birthday<br />
            <span className="hero-accent">Race!</span>
          </h1>

          {/* Tagline — hides when HIW shows */}
          {!showHiw && (
            <p style={{
              fontFamily: "'Boogaloo', cursive",
              fontSize: 'clamp(1.05rem,3vw,1.35rem)',
              color: 'rgba(255,255,255,0.72)',
              textAlign: 'center',
              lineHeight: 1.7, maxWidth: 460,
              padding: '0 8px', marginBottom: 16,
              animation: 'fadeUp 0.6s 0.25s ease-out both',
            }}>
              A <strong style={{ color: '#d8b4fe' }}>personalised race game</strong> where your child
              unlocks family wishes hidden inside gift boxes! 🎁
            </p>
          )}

          {/* Pills — hides when HIW shows */}
          {!showHiw && (
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
              marginBottom: 28,
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
          )}

{/* CTA button — only shows when HIW is hidden */}
          {!showHiw && (
            <div style={{ animation: 'fadeUp 0.6s 0.45s ease-out both', marginBottom: 12 }}>
              <button
                className="cta-btn"
                onClick={() => {
                  setShowHiw(true)
                  setTimeout(() => {
                    const el = document.getElementById('how-it-works')
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 24
                      window.scrollTo({ top, behavior: 'smooth' })
                    }
                  }, 350)
                }}
              >
                CREATE A BIRTHDAY GAME
              </button>
            </div>
          )}

        </div>

{/* ── HOW IT WORKS ── */}
        {showHiw && (
          <div id="how-it-works" style={{
            width: '100%', maxWidth: 520,
            margin: '0 auto',
            padding: '0 20px 80px',
            animation: 'hiwSlideIn 0.7s cubic-bezier(.22,1,.36,1) both',
          }}>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 32,
            }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#9333ea44)' }} />
              <div style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 0 10px #9333ea)' }}>🏁</div>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#9333ea44,transparent)' }} />
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 36, animation: 'fadeUp 0.5s 0.1s ease-out both' }}>

              <div style={{
                fontFamily: "'Racing Sans One',cursive",
                fontSize: 'clamp(1.5rem,6vw,2.4rem)',
                color: '#fff', lineHeight: 1.05,
                textShadow: '0 0 40px #9333ea55',
              }}>
                Ready in <span style={{
                  background: 'linear-gradient(90deg,#c084fc,#e879f9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>5 minutes</span> ⚡
              </div>
              <div style={{
                fontFamily: "'Boogaloo',cursive",
                fontSize: 'clamp(0.9rem,2.5vw,1.05rem)',
                color: 'rgba(255,255,255,0.45)',
                marginTop: 8,
              }}>
                Here's how it all comes together 👇
              </div>
            </div>

            {/* Steps card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: 'clamp(20px,4vw,28px)',
              marginBottom: 36,
              backdropFilter: 'blur(10px)',
            }}>
              {[
                { n: '01', icon: '✍️', col: '#c084fc', title: 'Enter name & age',   desc: 'Pick their race car colour — it themes the whole game!' },
                { n: '02', icon: '💜', col: '#e879f9', title: 'Add family wishes',  desc: 'Up to 7 people with a short birthday wish each.' },
                { n: '03', icon: '📸', col: '#a78bfa', title: 'Upload photos',      desc: 'Each face hides inside a gift box on the track.' },
                { n: '04', icon: '🚗', col: '#818cf8', title: 'Share the link!',    desc: 'Your child races and unlocks every wish one by one. 🎉' },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  paddingBottom: i < 3 ? 20 : 0,
                  marginBottom: i < 3 ? 20 : 0,
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  animation: `fadeUp 0.4s ${0.2 + i * 0.1}s ease-out both`,
                }}>
                  {/* Number bubble */}
                  <div style={{
                    flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
                    background: `${s.col}18`, border: `1.5px solid ${s.col}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Racing Sans One',cursive", fontSize: '0.6rem',
                    color: s.col, letterSpacing: 1, marginTop: 2,
                    boxShadow: `0 0 12px ${s.col}33`,
                  }}>{s.n}</div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3,
                    }}>
                      <span style={{ fontSize: '1rem', filter: `drop-shadow(0 0 4px ${s.col})` }}>{s.icon}</span>
                      <span style={{
                        fontFamily: "'Racing Sans One',cursive",
                        fontSize: 'clamp(0.82rem,2.2vw,0.95rem)',
                        color: '#fff', letterSpacing: 1,
                      }}>{s.title}</span>
                    </div>
                    <div style={{
                      fontFamily: "'Boogaloo',cursive",
                      fontSize: 'clamp(0.82rem,2vw,0.95rem)',
                      color: 'rgba(255,255,255,0.45)', lineHeight: 1.45,
                    }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA block */}
            <div style={{
              textAlign: 'center',
              animation: 'fadeUp 0.5s 0.65s ease-out both',
            }}>
              <div style={{
                fontFamily: "'Racing Sans One',cursive",
                fontSize: 'clamp(1rem,3.5vw,1.3rem)',
                color: '#fff', marginBottom: 16, lineHeight: 1.2,
                textShadow: '0 0 20px #9333ea66',
              }}>
                Your child will <span style={{ color: '#c084fc' }}>love this</span> 🏆
              </div>
              <Link href="/create" className="cta-btn" style={{
                fontSize: 'clamp(0.9rem,2.8vw,1.15rem)',
                padding: 'clamp(13px,2.5vw,16px) clamp(28px,5vw,44px)',
              }}>
                LET'S BUILD THE GAME
              </Link>
            </div>

          </div>
        )}

{/* ── FOOTER ── */}
        <div style={{
          width: '100%', textAlign: 'center',
          padding: '20px 24px 36px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 'auto',
        }}>
          <p style={{
            fontFamily: "'Boogaloo',cursive", fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.2)',
          }}>
            Made with 💜 by <span style={{ color: '#9333ea' }}>Karpagapriya</span>
          </p>
        </div>

      </div>
    </>
  )
}