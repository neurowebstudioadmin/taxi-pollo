import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const filePath = path.join(process.cwd(), 'data', 'admin.json')
    const fileData = await readFile(filePath, 'utf-8')
    const json = JSON.parse(fileData)

    const user = json.users.find(
      (u: any) => u.username === username && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Credenziali errate' },
        { status: 401 }
      )
    }

    const fakeToken = 'taxi-pollo-admin-token-123'

    return NextResponse.json({
      success: true,
      token: fakeToken
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Errore server interno' },
      { status: 500 }
    )
  }
}
