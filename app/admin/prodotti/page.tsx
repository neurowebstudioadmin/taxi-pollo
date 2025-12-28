'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Prodotto = {
  id: string
  nome: string
  descrizione: string
  prezzo: number
  categoria: string
  disponibile: boolean
}

export default function AdminProdotti() {
  const router = useRouter()
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    descrizione: '',
    prezzo: '',
    categoria: '',
    disponibile: true,
  })

  // Controllo login + carica prodotti
  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const fetchProdotti = async () => {
      try {
        const res = await fetch('/api/admin/prodotti')
        const data = await res.json()
        setProdotti(data || [])
      } catch (e) {
        setError('Errore nel caricamento dei prodotti')
      } finally {
        setLoading(false)
      }
    }

    fetchProdotti()
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleDisponibile = () => {
    setForm((prev) => ({ ...prev, disponibile: !prev.disponibile }))
  }

  const handleSubmit = async () => {
    if (!form.nome || !form.prezzo) {
      setError('Nome e prezzo sono obbligatori')
      return
    }
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/prodotti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Errore salvataggio')
      }

      const nuovo = await res.json()
      setProdotti((prev) => [...prev, nuovo])
      setShowForm(false)
      setForm({
        nome: '',
        descrizione: '',
        prezzo: '',
        categoria: '',
        disponibile: true,
      })
    } catch (e) {
      setError('Errore nel salvataggio del prodotto')
    } finally {
      setSaving(false)
    }
  }

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
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>
              Prodotti Taxi Pollo
            </h1>
            <p style={{ color: '#e5e5e5', fontSize: '14px' }}>
              Gestisci i prodotti che compaiono nella pagina ordini.
            </p>
          </div>
          <button
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background:
                'linear-gradient(90deg, #facc15 0%, #fb923c 50%, #f97316 100%)',
              boxShadow: '0 0 20px rgba(250,204,21,0.7)',
              color: '#0b0b0b',
            }}
            onClick={() => setShowForm(true)}
          >
            + NUOVO PRODOTTO
          </button>
        </div>

        {/* Messaggi */}
        {error && (
          <div
            style={{
              marginBottom: '12px',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(248,113,113,0.8)',
              background: 'rgba(127,29,29,0.7)',
              color: '#fee2e2',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        {/* Modal Nuovo prodotto */}
        {showForm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'rgba(15,15,15,0.98)',
                borderRadius: '28px',
                border: '1px solid rgba(250,204,21,0.6)',
                boxShadow: '0 0 40px rgba(250,204,21,0.5)',
                padding: '22px 26px 18px 26px',
              }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                Nuovo prodotto
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                {/* Nome */}
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                    }}
                  >
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    style={{
                      marginTop: '4px',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '999px',
                      border: '1px solid #404040',
                      background: '#0a0a0a',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Descrizione */}
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                    }}
                  >
                    Descrizione
                  </label>
                  <textarea
                    name="descrizione"
                    value={form.descrizione}
                    onChange={handleChange}
                    rows={3}
                    style={{
                      marginTop: '4px',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '14px',
                      border: '1px solid #404040',
                      background: '#0a0a0a',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Prezzo */}
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                    }}
                  >
                    Prezzo * (es. 12.9)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="prezzo"
                    value={form.prezzo}
                    onChange={handleChange}
                    style={{
                      marginTop: '4px',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '999px',
                      border: '1px solid #404040',
                      background: '#0a0a0a',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Categoria */}
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                    }}
                  >
                    Categoria
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    placeholder="es. Pollo, Specialità"
                    style={{
                      marginTop: '4px',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '999px',
                      border: '1px solid #404040',
                      background: '#0a0a0a',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Toggle visibilità */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    maxWidth: '360px',
                    marginTop: '4px',
                  }}
                >
                  <div
                    onClick={handleToggleDisponibile}
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '999px',
                      background: form.disponibile ? '#22c55e' : '#525252',
                      padding: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: form.disponibile ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: 'white',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#e5e5e5' }}>
                    Prodotto visibile nel sito
                  </span>
                </div>
              </div>

              {/* Bottoni */}
              <div
                style={{
                  marginTop: '18px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    border: '1px solid #404040',
                    background: 'transparent',
                    color: '#e5e5e5',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Annulla
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    background:
                      'linear-gradient(90deg, #facc15 0%, #fb923c 50%, #f97316 100%)',
                    boxShadow: '0 0 20px rgba(250,204,21,0.7)',
                    color: '#0b0b0b',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'SALVATAGGIO...' : 'SALVA'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista prodotti */}
        <div
          style={{
            background: 'rgba(15,15,15,0.96)',
            borderRadius: '24px',
            border: '1px solid rgba(250,204,21,0.4)',
            boxShadow: '0 0 40px rgba(250,204,21,0.25)',
            padding: '20px',
          }}
        >
          {loading ? (
            <div style={{ padding: '12px', fontSize: '14px' }}>Caricamento...</div>
          ) : prodotti.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '14px', color: '#e5e5e5' }}>
              Nessun prodotto presente. Clicca su “Nuovo prodotto” per iniziare.
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Categoria</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Prezzo</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Stato</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px' }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {prodotti.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderTop: '1px solid rgba(64,64,64,0.9)',
                    }}
                  >
                    <td style={{ padding: '10px 6px', fontWeight: 600 }}>{p.nome}</td>
                    <td style={{ padding: '10px 6px', color: '#e5e5e5' }}>
                      {p.categoria}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#facc15' }}>
                      € {p.prezzo.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 6px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          background: p.disponibile
                            ? 'rgba(22,163,74,0.15)'
                            : 'rgba(127,29,29,0.4)',
                          color: p.disponibile ? '#4ade80' : '#fecaca',
                          border: p.disponibile
                            ? '1px solid rgba(74,222,128,0.7)'
                            : '1px solid rgba(248,113,113,0.8)',
                        }}
                      >
                        {p.disponibile ? 'Attivo' : 'Nascosto'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '10px 6px',
                        textAlign: 'right',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                      }}
                    >
                      <button
                        style={{
                          padding: '6px 10px',
                          borderRadius: '999px',
                          border: '1px solid rgba(250,204,21,0.7)',
                          background: 'transparent',
                          color: 'white',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          alert(`Qui modificheremo il prodotto: ${p.nome}`)
                        }
                      >
                        Modifica
                      </button>
                      <button
                        style={{
                          padding: '6px 10px',
                          borderRadius: '999px',
                          border: '1px solid rgba(248,113,113,0.8)',
                          background: 'rgba(127,29,29,0.7)',
                          color: '#fee2e2',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          alert(`Qui elimineremo il prodotto: ${p.nome}`)
                        }
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
