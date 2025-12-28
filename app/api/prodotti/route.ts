 import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'prodotti.json')
    const data = JSON.parse(readFileSync(filePath, 'utf8'))
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}

