export type CareLevel =
  | '要支援1' | '要支援2'
  | '要介護1' | '要介護2' | '要介護3' | '要介護4' | '要介護5'
  | ''

export type CareType =
  | '食事介助' | '排泄介助' | '入浴介助' | '移乗介助'
  | '口腔ケア' | '服薬確認' | 'レクリエーション' | 'バイタル測定'
  | '体位変換' | '機能訓練'

export type DocType = 'formal_record' | 'care_plan' | 'work_report'

export interface Vitals {
  bp?: string
  temp?: string
  spo2?: string
  pulse?: string
}

export interface CareRecord {
  id?: string
  resident_name: string
  record_date: string
  staff_name: string
  care_level: CareLevel
  disease: string
  vitals: Vitals
  care_types: CareType[]
  condition: string
  wish: string
  note: string
  created_at?: string
}

export interface GeneratedDocument {
  id?: string
  care_record_id: string
  doc_type: DocType
  content: string
  created_at?: string
}

export interface GenerateResponse {
  formal_record: string
  care_plan: string
  work_report: string
}
