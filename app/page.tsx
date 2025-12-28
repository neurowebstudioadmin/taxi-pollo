'use client'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        background: 'radial-gradient(circle at top, #111827 0, #000000 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '96px',
        }}
      >
        <img
          src="/taxi-pollo-logo.png"
          alt="Taxi Pollo"
          style={{
            width: '360px',
            maxWidth: '80vw',
            filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.8))',
          }}
        />
        <button
          onClick={() => (window.location.href = '/home')}
          style={{
            padding: '14px 40px',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            background:
              'linear-gradient(90deg, #FACC15 0%, #FB923C 50%, #F97316 100%)',
            boxShadow: '0 0 30px rgba(250, 204, 21, 0.9)',
          }}
        >
          Entra nel sito
        </button>
      </div>
    </main>
  )
}
