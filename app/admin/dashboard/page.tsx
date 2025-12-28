'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #facc15 0, #0b0b0b 55%)',
        color: 'white',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>
          Dashboard Taxi Pollo
        </h1>
        <p style={{ color: '#e5e5e5', marginBottom: '24px' }}>
          Qui in futuro vedrai ordini, prodotti, città e statistiche.
        </p>
      </div>
    </div>
  )
}
