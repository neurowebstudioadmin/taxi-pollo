import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const filePath = join(process.cwd(), 'data', 'prodotti.json')

async function readProdotti() {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

async function writeProdotti(data: any) {
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const prodotti = await readProdotti()
  return NextResponse.json(prodotti)
}

export async function POST(request: Request) {
  const body = await request.json()
  const prodotti = await readProdotti()

  const nuovo = {
    id: body.id || Date.now().toString(),
    nome: body.nome,
    descrizione: body.descrizione || '',
    prezzo: Number(body.prezzo) || 0,
    categoria: body.categoria || 'Generico',
    disponibile: body.disponibile ?? true,
  }

  prodotti.push(nuovo)
  await writeProdotti(prodotti)
  return NextResponse.json(nuovo, { status: 201 })
}
