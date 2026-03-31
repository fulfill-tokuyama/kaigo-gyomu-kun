import { CareLevel, Vitals } from '.'

export type IndependenceLevel = '自立' | '一部介助' | '全介助' | ''

export type DementiaLevel =
  | '' | '自立' | 'I' | 'IIa' | 'IIb' | 'IIIa' | 'IIIb' | 'IV' | 'M'

export type DisabilityLevel =
  | '' | '自立' | 'J1' | 'J2' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface AssessmentInput {
  resident_name: string
  birth_date: string
  age: string
  gender: '男性' | '女性' | ''
  care_level: CareLevel
  certification_period: string
  family_structure: string
  primary_caregiver: string
  staff_name: string
  record_date: string

  disease: string
  vitals: Vitals
  medications: string
  primary_doctor: string

  adl: {
    eating: IndependenceLevel
    toileting: IndependenceLevel
    bathing: IndependenceLevel
    mobility: IndependenceLevel
    dressing: IndependenceLevel
    grooming: IndependenceLevel
  }

  iadl: {
    cooking: IndependenceLevel
    laundry: IndependenceLevel
    cleaning: IndependenceLevel
    shopping: IndependenceLevel
    money_management: IndependenceLevel
    medication_management: IndependenceLevel
    phone: IndependenceLevel
    transportation: IndependenceLevel
  }

  dementia_level: DementiaLevel
  disability_level: DisabilityLevel
  communication: string
  problematic_behavior: string

  housing_type: string
  barrier_free: string
  social_participation: string
  current_services: string

  chief_complaint: string
  resident_wish: string
  family_wish: string
  special_notes: string
}

export interface AssessmentSheet {
  items: { label: string; content: string }[]
}

export interface IssueAnalysisRow {
  need: string
  current_status: string
  goal: string
  background: string
  priority: '高' | '中' | '低'
  service_direction: string
}

export interface DetailedCarePlan {
  long_term_goals: string[]
  short_term_goals: string[]
  services: {
    content: string
    type: string
    provider: string
    frequency: string
    period: string
  }[]
}

export interface AssessmentGenerateResponse {
  assessment_sheet: AssessmentSheet
  issue_analysis: IssueAnalysisRow[]
  care_plan: DetailedCarePlan
}
