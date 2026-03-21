import Link from 'next/link'
import Image from 'next/image'
import heroImg from '@/assets/race-hero.png'


export default function HomePage() {
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

        .page-wrap {
          width: 100%;
          min-height: 100vh;
          max-height: 100dvh;
          background: radial-gradient(ellipse at 50% 0%, #1e0042 0%, #06000f 60%);
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Nunito', sans-serif;
          overflow-x: hidden;
          overflow-y: auto;
          position: relative;
        }

        .floating-star {
          position: fixed;
          pointer-events: none;
          animation: starFloat var(--dur) var(--delay) ease-in-out infinite;
          z-index: 0;
        }

        /* Hero */
        .hero {
          width: 100%;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(40px, 8vw, 72px) 20px 0;
          position: relative;
          z-index: 1;
        }

        .hero-img-wrap {
          animation: flagWave 1.6s ease-in-out infinite alternate, fadeUp 0.5s ease-out both;
          margin-bottom: 16px;
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
          background: linear-gradient(
            135deg,
            #fde68a 0%,
            #e879f9 35%,
            #c084fc 50%,
            #818cf8 65%,
            #e879f9 80%,
            #fde68a 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .tagline {
          font-family: 'Boogaloo', cursive;
          font-size: clamp(1rem, 3vw, 1.35rem);
          color: rgba(255,255,255,0.7);
          text-align: center;
          line-height: 1.65;
          max-width: 420px;
          padding: 0 8px;
          margin-bottom: 18px;
          animation: fadeUp 0.6s 0.2s ease-out both;
        }

        .pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.3s ease-out both;
        }

        .pill {
          font-family: 'Boogaloo', cursive;
          font-size: clamp(0.78rem, 2vw, 0.92rem);
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 40px;
          padding: 4px 14px;
          white-space: nowrap;
        }

        .cta-wrap {
          animation: fadeUp 0.6s 0.4s ease-out both;
          margin-bottom: 12px;
          width: 100%;
          display: flex;
          justify-content: center;
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

        .credit {
          font-family: 'Boogaloo', cursive;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.2);
          margin-bottom: 44px;
          animation: fadeUp 0.6s 0.45s ease-out both;
          text-align: center;
        }

.road-strip {
          width: 100%;
          flex-shrink: 0;
          position: relative;
          background: #0e001e;
          border-top: 2px solid #3b0764;
          border-bottom: 2px solid #3b0764;
          height: 68px;
          overflow: hidden;
          margin-bottom: clamp(36px, 6vw, 56px);
          z-index: 1;
        }

        .road-dashes {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            90deg,
            transparent 0px, transparent 30px,
            #9333ea44 30px, #9333ea44 60px
          );
          background-size: 80px 4px;
          background-repeat: repeat-x;
          background-position: 0 center;
          animation: roadScroll 0.5s linear infinite;
        }

        .road-car {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(1.6rem, 5vw, 2.4rem);
          animation: carDrive 3.2s linear infinite;
          filter: drop-shadow(0 0 10px #9333ea);
        }

        .road-gift {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(1rem, 3vw, 1.3rem);
          opacity: 0.45;
        }

        /* How it works */
        .hiw-section {
          width: 100%;
          max-width: 620px;
          padding: 0 16px;
          margin-bottom: clamp(40px, 8vw, 64px);
          z-index: 1;
        }

        .hiw-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .hiw-line {
          flex: 1;
          height: 1px;
        }

        .hiw-label {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(0.6rem, 1.8vw, 0.75rem);
          color: #9333ea;
          letter-spacing: 4px;
          white-space: nowrap;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .step-card {
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 16px;
          padding: clamp(12px, 2.5vw, 16px) clamp(12px, 3vw, 18px);
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.5s ease-out both;
          transition: transform 0.2s ease;
        }

        .step-card:hover { transform: translateY(-3px); }

        .step-num {
          flex-shrink: 0;
          width: clamp(30px, 5vw, 38px);
          height: clamp(30px, 5vw, 38px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(0.6rem, 1.5vw, 0.72rem);
          letter-spacing: 1px;
        }

        .step-icon {
          font-size: clamp(1.3rem, 3.5vw, 1.6rem);
          flex-shrink: 0;
        }

        .step-title {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(0.75rem, 2vw, 0.88rem);
          letter-spacing: 1px;
          margin-bottom: 2px;
        }

        .step-desc {
          font-family: 'Boogaloo', cursive;
          font-size: clamp(0.8rem, 2vw, 0.92rem);
          color: rgba(255,255,255,0.6);
          line-height: 1.4;
        }

        /* Bottom CTA */
        .bottom-cta {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px clamp(48px, 10vw, 72px);
          gap: 16px;
          animation: fadeUp 0.6s 0.6s ease-out both;
          z-index: 1;
        }

        .bottom-title {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(1.1rem, 4vw, 1.7rem);
          color: #fff;
          text-align: center;
          line-height: 1.25;
          text-shadow: 0 0 24px #9333ea77;
        }

        /* Mobile tweaks */
        @media (max-width: 400px) {
          .cta-btn { letter-spacing: 1px; }
          .pills { gap: 6px; }
        }
      `}</style>

      <div className="page-wrap">


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
              CREATE A BIRTHDAY GAME
            </Link>
          </div>

          <p style={{
            fontFamily: "'Boogaloo', cursive", fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.22)', marginBottom: 36,
            animation: 'fadeUp 0.6s 0.5s ease-out both',
          }}>
            Made with 💜 by <span style={{ color: '#9333ea' }}>Karpagapriya</span>
          </p>
        </div>

        {/* ── ROAD STRIP ── */}
        <div className="road-strip">
          <div className="road-dashes" />
          <div className="road-car">🏎️</div>
          {[{ delay: '0.9s' }, { delay: '1.8s' }].map((g, i) => (
            <div key={i} className="road-gift" style={{
              animation: `carDrive 3.2s ${g.delay} linear infinite`,
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
            LET'S BUILD THE GAME
          </Link>
        </div>
      </div>
    </>
  )
}