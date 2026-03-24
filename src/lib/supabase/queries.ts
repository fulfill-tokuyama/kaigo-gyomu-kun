import { createServerClient } from './server'
import { CareRecord, GeneratedDocument } from '@/types'

export async function getCareRecords() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('care_records')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as CareRecord[]
}

export async function getCareRecordById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('care_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as CareRecord
}

export async function getGeneratedDocuments(careRecordId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('generated_documents')
    .select('*')
    .eq('care_record_id', careRecordId)

  if (error) throw error
  return data as GeneratedDocument[]
}
