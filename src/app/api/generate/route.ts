import { NextRequest, NextResponse } from 'next/server'
import { generateAllDocuments } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase/server'
import { CareRecord } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const record: CareRecord = await req.json()
    const supabase = createServerClient()

    const { data: savedRecord, error: recordError } = await supabase
      .from('care_records')
      .insert({
        resident_name: record.resident_name,
        record_date: record.record_date,
        staff_name: record.staff_name,
        care_level: record.care_level,
        disease: record.disease,
        vitals: record.vitals,
        care_types: record.care_types,
        condition: record.condition,
        wish: record.wish,
        note: record.note,
      })
      .select()
      .single()

    if (recordError) throw recordError

    const generated = await generateAllDocuments(record)

    const docInserts = [
      { care_record_id: savedRecord.id, doc_type: 'formal_record', content: generated.formal_record },
      { care_record_id: savedRecord.id, doc_type: 'care_plan', content: generated.care_plan },
      { care_record_id: savedRecord.id, doc_type: 'work_report', content: generated.work_report },
    ]

    const { error: docError } = await supabase
      .from('generated_documents')
      .insert(docInserts)

    if (docError) throw docError

    return NextResponse.json({
      record_id: savedRecord.id,
      ...generated,
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
