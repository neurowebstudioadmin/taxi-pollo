'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminDatePicker } from '@/components/AdminDatePicker'

type GiornoSettimana = {
  giorno: string
  data?: string
  citta: string[]
  orario: string
  luogo: string
}

type SettimanaResponse = {
  settimana: GiornoSettimana[]
}

const GIORNI = [
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
  'Domenica',
]

const CITTA_POSSIBILI = [
  'Barletta',
  'Bari',
  'Canosa',
  'Andria',
  'Trani',
  'Corato',
]

export default function AdminCitta() {
  const router = useRouter()
  const [settimana, setSettimana] = useState<GiornoSettimana[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [giornoSelezionato, setGiornoSelezionato] = useState<string | null>(null)

  const [form, setForm] = useState({
    data: '',
    citta: [] as string[],
    orario: '',
    luogo: '',
  })

  // Controllo login + carica settimana
  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const fetchSettimana = async () => {
      try {
        const res = await fetch('/api/admin/citta')
        const data: SettimanaResponse = await res.json()
        const lista = data.settimana || []

        // assicuriamoci che tutti i 7 giorni esistano
        const completa: GiornoSettimana[] = GIORNI.map((g) => {
          const trovato = lista.find((x) => x.giorno === g)
          if (trovato) return trovato
          return { giorno: g, data: '', citta: [], orario: '', luogo: '' }
        })

        setSettimana(completa)
      } catch (e) {
        setError('Errore nel caricamento della settimana')
      } finally {
        setLoading(false)
      }
    }

    fetchSettimana()
  }, [router])

  const apriFormPerGiorno = (giorno: string) => {
    const g = settimana.find((x) => x.giorno === giorno)
    setGiornoSelezionato(giorno)
    setForm({
      data: g?.data || '',
      citta: g?.citta || [],
      orario: g?.orario || '',
      luogo: g?.luogo || '',
    })
    setShowForm(true)
    setError('')
  }

  const handleSelectCitta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value)
    setForm((prev) => ({ ...prev, citta: options }))
  }

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const salvaGiorno = async () => {
    if (!giornoSelezionato) return
    if (!form.data || form.citta.length === 0 || !form.orario || !form.luogo) {
      setError('Data, città, fascia oraria e luogo sono obbligatori')
      return
    }
    setError('')

    try {
      const res = await fetch('/api/admin/citta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giorno: giornoSelezionato,
          data: form.data,
          citta: form.citta,
          orario: form.orario,
          luogo: form.luogo,
        }),
      })

      if (!res.ok) throw new Error()

      const data: SettimanaResponse = await res.json()
      const lista = data.settimana || []
      const completa: GiornoSettimana[] = GIORNI.map((g) => {
        const trovato = lista.find((x) => x.giorno === g)
        if (trovato) return trovato
        return { giorno: g, data: '', citta: [], orario: '', luogo: '' }
      })

      setSettimana(completa)
      setShowForm(false)
    } catch (e) {
      setError('Errore nel salvataggio del giorno')
    }
  }

  const svuotaGiorno = async (giorno: string) => {
    if (!confirm(`Vuoi svuotare il programma di ${giorno}?`)) return
    setError('')

    try {
      const res = await fetch('/api/admin/citta', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giorno }),
      })
      if (!res.ok) throw new Error()

      const data: SettimanaResponse = await res.json()
      const lista = data.settimana || []
      const completa: GiornoSettimana[] = GIORNI.map((g) => {
        const trovato = lista.find((x) => x.giorno === g)
        if (trovato) return trovato
        return { giorno: g, data: '', citta: [], orario: '', luogo: '' }
      })

      setSettimana(completa)
    } catch {
      setError('Errore nello svuotare il giorno')
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
              Programma settimanale
            </h1>
            <p style={{ color: '#e5e5e5', fontSize: '14px' }}>
              Definisci date, città, orari e luoghi per ogni giorno della settimana.
            </p>
          </div>
        </div>

        {/* Errori */}
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

        {/* Modal modifica giorno */}
        {showForm && giornoSelezionato && (
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
                {giornoSelezionato}
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                {/* Data del giro */}
<div style={{ width: '100%', maxWidth: '360px' }}>
  <label
    style={{
      fontSize: '12px',
      fontWeight: 600,
      color: '#d4d4d4',
    }}
  >
    Data del giro
  </label>
  <div style={{ marginTop: '4px' }}>
    <AdminDatePicker
      value={form.data}
      onChange={(iso) =>
        setForm((prev) => ({
          ...prev,
          data: iso,
        }))
      }
    />
  </div>
</div>

                {/* Città */}
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                    }}
                  >
                    Città servite (seleziona una o più)
                  </label>
                  <select
                    multiple
                    value={form.citta}
                    onChange={handleSelectCitta}
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
                      minHeight: '100px',
                    }}
                  >
                    {CITTA_POSSIBILI.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '11px',
                      color: '#a3a3a3',
                    }}
                  >
                    Tieni premuto CTRL (Windows) o CMD (Mac) per selezionare più città.
                  </div>
                </div>

                {/* Orario */}
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                    }}
                  >
                    Fascia oraria
                  </label>
                  <select
                    name="orario"
                    value={form.orario}
                    onChange={handleChangeInput}
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
                  >
                    <option value="">Seleziona una fascia</option>
                    <option value="12:00 - 14:00">12:00 - 14:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                    <option value="18:00 - 20:00">18:00 - 20:00</option>
                    <option value="19:00 - 21:00">19:00 - 21:00</option>
                    <option value="20:00 - 22:00">20:00 - 22:00</option>
                  </select>
                </div>

                {/* Luogo */}
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                    }}
                  >
                    Luogo di consegna
                  </label>
                  <input
                    type="text"
                    name="luogo"
                    value={form.luogo}
                    onChange={handleChangeInput}
                    placeholder="es. Parcheggio Lidl Barletta"
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
                  onClick={salvaGiorno}
                  style={{
                    padding: '8px 18px',
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
                >
                  SALVA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabella settimana */}
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
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Giorno</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Città</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Orario</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px' }}>Luogo</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px' }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {settimana.map((g) => (
                  <tr
                    key={g.giorno}
                    style={{
                      borderTop: '1px solid rgba(64,64,64,0.9)',
                    }}
                  >
                    <td style={{ padding: '10px 6px', fontWeight: 600 }}>
                      {g.giorno}
                      {g.data ? ` (${g.data})` : ''}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#e5e5e5' }}>
                      {g.citta.length ? g.citta.join(', ') : '—'}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#facc15' }}>
                      {g.orario || '—'}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#e5e5e5' }}>
                      {g.luogo || '—'}
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
                        onClick={() => apriFormPerGiorno(g.giorno)}
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
                        onClick={() => svuotaGiorno(g.giorno)}
                      >
                        Svuota
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
