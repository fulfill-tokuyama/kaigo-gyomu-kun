'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AssessmentFlowIndicator from '@/components/assessment/AssessmentFlowIndicator'
import AssessmentForm from '@/components/assessment/AssessmentForm'
import AssessmentSheetView from '@/components/assessment/AssessmentSheet'
import IssueAnalysis from '@/components/assessment/IssueAnalysis'
import DetailedCarePlanView from '@/components/assessment/DetailedCarePlan'
import PdfExport from '@/components/assessment/PdfExport'
import {
  AssessmentInput,
  AssessmentSheet,
  IssueAnalysisRow,
  DetailedCarePlan,
  AssessmentGenerateResponse,
} from '@/types/assessment'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

const initialInput: AssessmentInput = {
  resident_name: '',
  birth_date: '',
  age: '',
  gender: '',
  care_level: '',
  certification_period: '',
  family_structure: '',
  primary_caregiver: '',
  staff_name: '',
  record_date: todayStr(),
  disease: '',
  vitals: {},
  medications: '',
  primary_doctor: '',
  adl: { eating: '', toileting: '', bathing: '', mobility: '', dressing: '', grooming: '' },
  iadl: { cooking: '', laundry: '', cleaning: '', shopping: '', money_management: '', medication_management: '', phone: '', transportation: '' },
  dementia_level: '',
  disability_level: '',
  communication: '',
  problematic_behavior: '',
  housing_type: '',
  barrier_free: '',
  social_participation: '',
  current_services: '',
  chief_complaint: '',
  resident_wish: '',
  family_wish: '',
  special_notes: '',
}

export default function AssessmentPage() {
  const [step, setStep] = useState(0)
  const [input, setInput] = useState<AssessmentInput>(initialInput)
  const [assessmentSheet, setAssessmentSheet] = useState<AssessmentSheet>({ items: [] })
  const [issueAnalysis, setIssueAnalysis] = useState<IssueAnalysisRow[]>([])
  const [carePlan, setCarePlan] = useState<DetailedCarePlan>({ long_term_goals: [], short_term_goals: [], services: [] })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!input.resident_name || !input.staff_name) {
      setError('利用者名と担当者名は必須です')
      return
    }
    setError(null)
    setStep(1)

    try {
      const res = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!res.ok) throw new Error('生成に失敗しました')

      const data: AssessmentGenerateResponse = await res.json()
      setAssessmentSheet(data.assessment_sheet)
      setIssueAnalysis(data.issue_analysis)
      setCarePlan(data.care_plan)
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
      setStep(0)
    }
  }

  const handleReset = () => {
    setInput({ ...initialInput, record_date: todayStr() })
    setAssessmentSheet({ items: [] })
    setIssueAnalysis([])
    setCarePlan({ long_term_goals: [], short_term_goals: [], services: [] })
    setError(null)
    setStep(0)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-700 cursor-pointer">介護業務くん</h1>
          </Link>
        </div>
      </header>
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AssessmentFlowIndicator currentStep={step} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Step 0: Input */}
          {step === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">アセスメント情報入力</CardTitle>
              </CardHeader>
              <CardContent>
                <AssessmentForm input={input} onChange={setInput} onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          )}

          {/* Step 1: Generating */}
          {step === 1 && (
            <Card>
              <CardContent className="py-16 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6" />
                <p className="text-lg text-gray-600">AIがアセスメント帳票を生成しています...</p>
                <p className="text-sm text-gray-400 mt-2">3種類の帳票を並列で生成中</p>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Assessment Sheet */}
          {step === 2 && (
            <div className="space-y-4">
              <AssessmentSheetView sheet={assessmentSheet} onChange={setAssessmentSheet} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>入力に戻る</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setStep(3)}>
                  次へ: 課題分析シート
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Issue Analysis */}
          {step === 3 && (
            <div className="space-y-4">
              <IssueAnalysis rows={issueAnalysis} onChange={setIssueAnalysis} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>アセスメントに戻る</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setStep(4)}>
                  次へ: ケアプラン
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Care Plan + PDF */}
          {step === 4 && (
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">生成完了</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>利用者:</strong> {input.resident_name}</p>
                  <p><strong>記録日:</strong> {input.record_date}</p>
                  <p><strong>担当者:</strong> {input.staff_name}</p>
                  <p><strong>要介護度:</strong> {input.care_level || '未設定'}</p>
                </CardContent>
              </Card>

              <DetailedCarePlanView plan={carePlan} onChange={setCarePlan} />

              <Card>
                <CardContent className="py-6">
                  <PdfExport sheet={assessmentSheet} issues={issueAnalysis} plan={carePlan} />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>課題分析に戻る</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleReset}>
                  新しいアセスメントを開始
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
