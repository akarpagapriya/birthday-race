import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 30%,#1e0042,#080010)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: "'Nunito',sans-serif", overflow: 'hidden' }}>

      <div style={{ fontSize: 'clamp(3rem,12vw,7rem)', marginBottom: 8, filter: 'drop-shadow(0 0 30px #9333ea)' }}>🏁</div>

      <h1 style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(2rem,7vw,4rem)', color: '#d8b4fe', textShadow: '0 0 40px #9333ea, 4px 4px 0 #3b0764', lineHeight: 1.1, marginBottom: 16 }}>
        Birthday Race!
      </h1>

      <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: 'clamp(1.1rem,3vw,1.5rem)', color: 'rgba(255,255,255,0.75)', maxWidth: 480, lineHeight: 1.7, marginBottom: 12 }}>
        Create a <strong style={{ color: '#d8b4fe' }}>personalised birthday race game</strong> for your child — with your family's faces and wishes hidden inside gift boxes! 🎁
      </p>

      <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: 36 }}>
        Takes 5 minutes · Free · Works on any phone
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40, maxWidth: 560 }}>
        {[
          { icon: '✍️', text: "Enter your child's name & age" },
          { icon: '💜', text: 'Add family wishes & photos' },
          { icon: '🚗', text: 'Child races to unlock each gift!' },
          { icon: '📸', text: 'Real family faces inside each box!' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.3)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 260 }}>
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <span style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', textAlign: 'left' }}>{item.text}</span>
          </div>
        ))}
      </div>

      <Link href="/create"
        style={{ fontFamily: "'Racing Sans One',cursive", fontSize: 'clamp(1.1rem,3.5vw,1.5rem)', background: 'linear-gradient(135deg,#9333ea,#6b21a8)', color: '#fff', borderRadius: 60, padding: '18px 48px', textDecoration: 'none', boxShadow: '0 7px 0 #3b0764, 0 0 40px rgba(147,51,234,0.5)', letterSpacing: 2, display: 'inline-block', marginBottom: 20 }}>
        🎁 CREATE A BIRTHDAY GAME
      </Link>

      <p style={{ fontFamily: "'Boogaloo',cursive", fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>
        Made with 💜 for Kabileshwar's 6th birthday
      </p>
    </div>
  )
}
