'use client'

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type Props = {
  value?: string
  onChange: (isoDate: string) => void
}

export function AdminDatePicker({ value, onChange }: Props) {
  const [selected, setSelected] = useState<Date | null>(null)

  useEffect(() => {
    if (value) {
      const d = new Date(value)
      if (!isNaN(d.getTime())) setSelected(d)
    }
  }, [value])

  const handleChange = (date: Date | null) => {
    setSelected(date)
    if (date) {
      const iso = date.toISOString().slice(0, 10) // YYYY-MM-DD
      onChange(iso)
    } else {
      onChange('')
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <DatePicker
        selected={selected}
        onChange={handleChange}
        dateFormat="yyyy-MM-dd"
        placeholderText="Seleziona una data"
        className="admin-datepicker-input"
      />
      <style jsx global>{`
        .admin-datepicker-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid #404040;
          background: #0a0a0a;
          color: white;
          font-size: 14px;
          outline: none;
        }
      `}</style>
    </div>
  )
}
