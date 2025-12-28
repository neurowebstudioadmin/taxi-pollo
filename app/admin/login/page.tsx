'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('admin-token', data.token)
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Credenziali errate')
      }
    } catch (err) {
      setError('Errore server')
    }

    setLoading(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (token) {
      router.push('/admin/dashboard')
    }
  }, [router])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #facc15 0, #0b0b0b 55%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(15,15,15,0.96)',
          borderRadius: '32px',
          border: '1px solid rgba(250,204,21,0.6)',
          boxShadow: '0 0 50px rgba(250,204,21,0.45)',
          padding: '32px 32px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <Image
              src="/taxi-pollo-logo.png"
              alt="Taxi Pollo"
              width={48}
              height={48}
              style={{ borderRadius: '12px' }}
            />
            <div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                }}
              >
                TAXI POLLO
              </div>
              <div style={{ fontSize: '12px', color: '#e5e5e5' }}>
                Pannello Amministratore
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '320px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#d4d4d4' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              onKeyDown={(e) => e.key === 'Enter' && login()}
              style={{
                marginTop: '6px',
                width: '100%',
                padding: '8px 14px',
                borderRadius: '999px',
                border: '1px solid #404040',
                background: '#0a0a0a',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ width: '100%', maxWidth: '320px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#d4d4d4' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && login()}
              style={{
                marginTop: '6px',
                width: '100%',
                padding: '8px 14px',
                borderRadius: '999px',
                border: '1px solid #404040',
                background: '#0a0a0a',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(248,113,113,0.6)',
                background: 'rgba(127,29,29,0.6)',
                color: '#fee2e2',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading || !username || !password}
            style={{
              marginTop: '4px',
              width: '100%',
              maxWidth: '320px',
              padding: '14px 18px',
              borderRadius: '999px',
              border: 'none',
              cursor: loading || !username || !password ? 'not-allowed' : 'cursor',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              background:
                'linear-gradient(90deg, #facc15 0%, #fb923c 50%, #f97316 100%)',
              boxShadow: '0 0 28px rgba(250,204,21,0.85)',
              opacity: loading || !username || !password ? 0.6 : 1,
            }}
          >
            {loading ? 'ACCESSO...' : 'ENTRA'}
          </button>
        </div>

        <div
          style={{
            marginTop: '10px',
            fontSize: '11px',
            color: '#a3a3a3',
            textAlign: 'center',
          }}
        >
          Credenziali demo: <strong>admin</strong> / <strong>TaxiPollo2025</strong>
        </div>
      </div>
    </div>
  )
}
