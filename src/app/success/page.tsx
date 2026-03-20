'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import raceTrophy from '@/assets/race-rocket.png'

function SuccessContent() {
  const params = useSearchParams()
  const slug = params.get('slug') || ''
  const name = params.get('name') || 'your child'
  const [gameUrl, setGameUrl] = useState(`/play/${slug}`)
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setGameUrl(`${window.location.origin}/play/${slug}`)
    setTimeout(() => setVisible(true), 100)
  }, [slug])

  function copyLink() {
    navigator.clipboard.writeText(gameUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function shareLink() {
    if (navigator.share) {
      navigator.share({
        title: `🏁 ${name}'s Birthday Race!`,
        text: `Play ${name}'s personalised birthday race game! 🎁⚡`,
        url: gameUrl,
      })
    } else {
      copyLink()
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes confettiFall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes roadScroll {
          from { background-position: 0 0; }
          to   { background-position: 80px 0; }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 20px #9333ea66; }
          50%      { box-shadow: 0 0 40px #9333eacc; }
        }
@keyframes flagWave {
          0%   { transform: rotate(-8deg) scale(1); }
          100% { transform: rotate(8deg) scale(1.05); }
        }
        .shimmer-text {
          background: linear-gradient(90deg,#c084fc,#e879f9,#a78bfa,#c084fc);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .share-btn {
          font-family: 'Racing Sans One', cursive;
          font-size: clamp(0.85rem,2.5vw,1rem);
          border: none; border-radius: 40px;
          padding: 13px 24px; cursor: pointer;
          letter-spacing: 1px; transition: transform 0.15s, box-shadow 0.15s;
        }
        .share-btn:hover { transform: translateY(-2px); }
        .share-btn:active { transform: translateY(1px); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(at 50% 30%, rgb(30, 0, 66), rgb(8, 0, 16))',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px 20px',
        fontFamily: "'Nunito',sans-serif", overflowX: 'hidden',
        position: 'relative',
      }}>


        {/* Floating bg emojis */}
        {['🎁', '⭐', '✨', '🏁', '💜', '🎊', '💫', '🚗'].map((e, i) => (
          <div key={i} style={{
            position: 'absolute', pointerEvents: 'none',
            left: `${8 + i * 12}%`,
            top: `${10 + ((i * 41) % 70)}%`,
            fontSize: 'clamp(1rem,2.5vw,1.5rem)',
            opacity: 0.18,
            animation: `floatY ${2.5 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
          }}>{e}</div>
        ))}

        {/* Main card */}
        <div style={{
          width: '100%', maxWidth: 480,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}>

          {/* Trophy icon */}
          <div style={{
            fontSize: 'clamp(3.5rem,14vw,8rem)',
            animation: 'flagWave 1.4s ease-in-out infinite alternate, fadeUp 0.5s ease-out both',
            marginBottom: 12, lineHeight: 1,
          }}>
            <Image
              src={raceTrophy}
              alt="Birthday Trophy"
              width={150}
              height={150}
              style={{
                animation: 'flagWave 1.4s ease-in-out infinite alternate',
                marginBottom: 12,
                width: 'clamp(80px, 20vw, 200px)',
                height: 'auto',
              }}
            />
          </div>


          {/* Title */}
          <h1 style={{
            fontFamily: "'Racing Sans One',cursive",
            fontSize: 'clamp(1.8rem,6vw,3rem)',
            color: '#fff', textAlign: 'center', lineHeight: 1.1,
            textShadow: '0 0 40px #9333ea88',
            marginBottom: 8,
            animation: 'fadeUp 0.5s 0.3s ease-out both',
          }}>
            <span className="shimmer-text">Game Created!</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Boogaloo',cursive",
            fontSize: 'clamp(1rem,3vw,1.25rem)',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center', lineHeight: 1.6,
            marginBottom: 28,
            animation: 'fadeUp 0.5s 0.4s ease-out both',
          }}>
            <strong style={{ color: '#d8b4fe' }}>{name}'s</strong> birthday race is ready! 🚗⚡<br />
            Share the link below to start the fun.
          </p>


          {/* ── SHARE CARD ── */}
          <div style={{
            width: '100%', marginBottom: 24,
            background: 'linear-gradient(135deg,rgba(147,51,234,0.12),rgba(0,0,0,0.3))',
            border: '1.5px solid rgba(147,51,234,0.35)',
            borderRadius: 20, padding: '18px 16px 16px',
            backdropFilter: 'blur(10px)',
            animation: 'fadeUp 0.5s 0.5s ease-out both',
          }}>

            {/* Label */}
            <div style={{
              fontFamily: "'Racing Sans One',cursive",
              fontSize: '0.62rem', color: 'rgba(147,51,234,0.7)',
              letterSpacing: 3, marginBottom: 8, textAlign: 'center',
            }}>
              GAME LINK
            </div>

            {/* URL row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(147,51,234,0.25)',
              borderRadius: 12, padding: '10px 14px',
              marginBottom: 14,
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔗</span>
              <span style={{
                fontFamily: "'Boogaloo',cursive", fontSize: '0.88rem',
                color: '#c084fc', wordBreak: 'break-all', lineHeight: 1.4, flex: 1,
              }}>
                {gameUrl}
              </span>
            </div>

            {/* Copy + Share row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <button onClick={copyLink} className="share-btn" style={{
                flex: 1,
                background: copied
                  ? 'linear-gradient(135deg,#059669,#047857)'
                  : 'rgba(147,51,234,0.25)',
                color: copied ? '#fff' : '#c084fc',
                border: `1.5px solid ${copied ? '#059669' : 'rgba(147,51,234,0.4)'}`,
                boxShadow: copied ? '0 4px 0 #065f46' : 'none',
                transition: 'all 0.3s',
              }}>
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>

              <button onClick={shareLink} className="share-btn" style={{
                flex: 1,
                background: 'rgba(14,165,233,0.2)',
                color: '#7dd3fc',
                border: '1.5px solid rgba(14,165,233,0.35)',
                boxShadow: 'none',
              }}>
                📤 Share
              </button>
            </div>

            {/* Play Now — inside the card, stands out */}
            <Link href={`/play/${slug}`} style={{
              width: '100%', display: 'block', textAlign: 'center',
              fontFamily: "'Racing Sans One',cursive",
              fontSize: 'clamp(1rem,3vw,1.15rem)',
              background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(107, 33, 168))',
              color: '#fff', borderRadius: '40px',
              padding: '14px 28px', textDecoration: 'none',
              boxShadow: 'rgb(59, 7, 100) 0px 6px 0px, rgba(147, 51, 234, 0.333) 0px 0px 30px',
              letterSpacing: 1,
            }}>
              🎮 PLAY NOW!
            </Link>
          </div>



          {/* Footer links */}
          <div style={{
            display: 'flex', gap: 20, justifyContent: 'center',
            animation: 'fadeUp 0.5s 0.85s ease-out both',
          }}>
            <Link href="/create" style={{
              fontFamily: "'Boogaloo',cursive", fontSize: '0.92rem',
              color: '#9333ea', textDecoration: 'none',
              borderBottom: '1px dashed #9333ea55',
            }}>
              + Create another game
            </Link>
            <Link href="/" style={{
              fontFamily: "'Boogaloo',cursive", fontSize: '0.92rem',
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            }}>
              ← Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#06000f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Racing Sans One',cursive", color: '#9333ea', fontSize: '1.2rem', letterSpacing: 2 }}>LOADING...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}