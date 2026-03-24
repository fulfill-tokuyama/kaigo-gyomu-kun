import { NextRequest, NextResponse } from 'next/server'
import { generateAllDocuments } from '@/lib/gemini'
import { CareRecord } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const record: CareRecord = await req.json()
    const generated = await generateAllDocuments(record)
    return NextResponse.json(generated)
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
