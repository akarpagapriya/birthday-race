import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes roadScroll {
          from { background-position: 0 0; }
          to   { background-position: 80px 0; }
        }
        @keyframes carDrive {
          0%   { left: -80px; opacity: 1; }
          85%  { opacity: 1; }
          100% { left: calc(100% + 80px); opacity: 0; }
        }
        @keyframes btnBounce {
          0%,100% { transform: translateY(0); box-shadow: 0 6px 0 #3b0764; }
          50%      { transform: translateY(-3px); box-shadow: 0 9px 0 #3b0764; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 20%,#1e0042 0%,#06000f 60%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px 20px',
        fontFamily: "'Nunito',sans-serif", textAlign: 'center',
        overflowX: 'hidden',
      }}>

        {/* 404 number */}
        <div style={{
          fontFamily: "'Racing Sans One',cursive",
          fontSize: 'clamp(5rem,22vw,10rem)',
          color: 'transparent',
          WebkitTextStroke: '3px #9333ea44',
          lineHeight: 1, marginBottom: 0,
          animation: 'fadeUp 0.5s ease-out both',
          position: 'relative',
          textShadow: '0 0 80px #9333ea22',
        }}>404</div>

        {/* Crash emoji */}
        <div style={{
          fontSize: 'clamp(3rem,10vw,5rem)',
          animation: 'floatY 2.5s ease-in-out infinite, fadeUp 0.5s 0.1s ease-out both',
          filter: 'drop-shadow(0 0 20px #f87171)',
          marginBottom: 12, lineHeight: 1,
        }}>💥</div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Racing Sans One',cursive",
          fontSize: 'clamp(1.6rem,6vw,2.8rem)',
          color: '#fff', marginBottom: 10,
          textShadow: '0 0 30px #9333ea88',
          animation: 'fadeUp 0.5s 0.2s ease-out both',
        }}>
          WRONG TRACK!
        </h1>

        <p style={{
          fontFamily: "'Boogaloo',cursive",
          fontSize: 'clamp(1rem,3vw,1.2rem)',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: 360, lineHeight: 1.7,
          marginBottom: 32,
          animation: 'fadeUp 0.5s 0.3s ease-out both',
        }}>
          Looks like this race track doesn't exist!<br />
          The game link may be wrong or expired. 🏎️
        </p>

        {/* Animated road */}
        <div style={{
          width: '100%', maxWidth: 420,
          height: 52, position: 'relative',
          background: '#0e001e',
          border: '2px solid #3b0764',
          borderRadius: 12, overflow: 'hidden',
          marginBottom: 32,
          animation: 'fadeUp 0.5s 0.35s ease-out both',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(90deg,transparent 0,transparent 30px,#9333ea44 30px,#9333ea44 60px)',
            backgroundSize: '80px 4px',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
            animation: 'roadScroll 0.6s linear infinite',
          }} />
          <div style={{
            position: 'absolute', top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
            animation: 'carDrive 2.8s linear infinite',
            filter: 'drop-shadow(0 0 10px #9333ea)',
          }}>🏎️</div>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'fadeUp 0.5s 0.4s ease-out both',
        }}>
          <Link href="/" style={{
            fontFamily: "'Racing Sans One',cursive",
            fontSize: 'clamp(0.9rem,2.5vw,1.1rem)',
            background: 'linear-gradient(135deg,#9333ea,#6b21a8)',
            color: '#fff', borderRadius: 40,
            padding: '13px 28px', textDecoration: 'none',
            animation: 'btnBounce 2s ease-in-out infinite',
            letterSpacing: 1, display: 'inline-block',
          }}>
            🏠 Go Home
          </Link>
          <Link href="/create" style={{
            fontFamily: "'Racing Sans One',cursive",
            fontSize: 'clamp(0.9rem,2.5vw,1.1rem)',
            background: 'linear-gradient(135deg,#16a34a,#15803d)',
            color: '#fff', borderRadius: 40,
            padding: '13px 28px', textDecoration: 'none',
            boxShadow: '0 6px 0 #14532d',
            letterSpacing: 1, display: 'inline-block',
          }}>
            🎁 Create a Game
          </Link>
        </div>
      </div>
    </>
  )
}