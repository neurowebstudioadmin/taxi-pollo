import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const filePath = join(process.cwd(), 'data', 'citta.json')

export async function GET() {
  const data = JSON.parse(readFileSync(filePath, 'utf8'))
  return NextResponse.json(data.settimana || [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const data = JSON.parse(readFileSync(filePath, 'utf8'))
  const settimana = data.settimana || []
  
  const index = settimana.findIndex((g: any) => g.giorno === body.giorno)
  if (index >= 0) {
    settimana[index] = body
  } else {
    settimana.push(body)
  }
  
  writeFileSync(filePath, JSON.stringify({ settimana }, null, 2), 'utf-8')
  return NextResponse.json({ settimana }, { status: 201 })
}
