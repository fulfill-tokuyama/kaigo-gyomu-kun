import { NextRequest, NextResponse } from 'next/server'
import { generateAssessmentDocuments } from '@/lib/assessment-gemini'
import { AssessmentInput } from '@/types/assessment'

export async function POST(req: NextRequest) {
  try {
    const input: AssessmentInput = await req.json()
    const generated = await generateAssessmentDocuments(input)
    return NextResponse.json(generated)
  } catch (error) {
    console.error('Assessment generate error:', error)
    return NextResponse.json(
      { error: 'Assessment generation failed' },
      { status: 500 }
    )
  }
}
