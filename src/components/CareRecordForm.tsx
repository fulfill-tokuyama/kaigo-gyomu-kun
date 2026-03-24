'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import FlowIndicator from './FlowIndicator'
import GeneratedDocuments from './GeneratedDocuments'
import { CareRecord, CareLevel, CareType, GenerateResponse } from '@/types'

const CARE_LEVELS: CareLevel[] = [
  '要支援1', '要支援2',
  '要介護1', '要介護2', '要介護3', '要介護4', '要介護5',
]

const CARE_TYPES: CareType[] = [
  '食事介助', '排泄介助', '入浴介助', '移乗介助',
  '口腔ケア', '服薬確認', 'レクリエーション', 'バイタル測定',
  '体位変換', '機能訓練',
]

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

const initialRecord: CareRecord = {
  resident_name: '',
  record_date: todayStr(),
  staff_name: '',
  care_level: '',
  disease: '',
  vitals: {},
  care_types: [],
  condition: '',
  wish: '',
  note: '',
}

export default function CareRecordForm() {
  const [step, setStep] = useState(0)
  const [record, setRecord] = useState<CareRecord>(initialRecord)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof CareRecord>(key: K, value: CareRecord[K]) => {
    setRecord((prev) => ({ ...prev, [key]: value }))
  }

  const updateVital = (key: string, value: string) => {
    setRecord((prev) => ({ ...prev, vitals: { ...prev.vitals, [key]: value } }))
  }

  const toggleCareType = (type: CareType) => {
    setRecord((prev) => ({
      ...prev,
      care_types: prev.care_types.includes(type)
        ? prev.care_types.filter((t) => t !== type)
        : [...prev.care_types, type],
    }))
  }

  const handleSubmit = async () => {
    if (!record.resident_name || !record.staff_name) {
      setError('利用者名と担当者名は必須です')
      return
    }
    setError(null)
    setStep(1)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      })

      if (!res.ok) throw new Error('生成に失敗しました')

      const data = await res.json()
      setResult(data)
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成に失敗しました')
      setStep(0)
    }
  }

  const handleReset = () => {
    setRecord({ ...initialRecord, record_date: todayStr() })
    setResult(null)
    setError(null)
    setStep(0)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <FlowIndicator currentStep={step} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* STEP 0: 入力フォーム */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-700">介護記録入力</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="resident_name">利用者名 *</Label>
                <Input
                  id="resident_name"
                  value={record.resident_name}
                  onChange={(e) => updateField('resident_name', e.target.value)}
                  placeholder="山田 太郎"
                />
              </div>
              <div>
                <Label htmlFor="record_date">記録日</Label>
                <Input
                  id="record_date"
                  type="date"
                  value={record.record_date}
                  onChange={(e) => updateField('record_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="staff_name">担当者名 *</Label>
                <Input
                  id="staff_name"
                  value={record.staff_name}
                  onChange={(e) => updateField('staff_name', e.target.value)}
                  placeholder="佐藤 花子"
                />
              </div>
            </div>

            {/* 要介護度・疾患 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>要介護度</Label>
                <Select
                  value={record.care_level}
                  onValueChange={(v) => updateField('care_level', v as CareLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="disease">主な疾患・既往歴</Label>
                <Input
                  id="disease"
                  value={record.disease}
                  onChange={(e) => updateField('disease', e.target.value)}
                  placeholder="高血圧、糖尿病 など"
                />
              </div>
            </div>

            {/* バイタル */}
            <div>
              <Label className="mb-2 block">バイタルサイン</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bp" className="text-xs text-gray-500">血圧</Label>
                  <Input
                    id="bp"
                    value={record.vitals.bp || ''}
                    onChange={(e) => updateVital('bp', e.target.value)}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <Label htmlFor="temp" className="text-xs text-gray-500">体温 (℃)</Label>
                  <Input
                    id="temp"
                    value={record.vitals.temp || ''}
                    onChange={(e) => updateVital('temp', e.target.value)}
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <Label htmlFor="spo2" className="text-xs text-gray-500">SpO2 (%)</Label>
                  <Input
                    id="spo2"
                    value={record.vitals.spo2 || ''}
                    onChange={(e) => updateVital('spo2', e.target.value)}
                    placeholder="98"
                  />
                </div>
                <div>
                  <Label htmlFor="pulse" className="text-xs text-gray-500">脈拍 (bpm)</Label>
                  <Input
                    id="pulse"
                    value={record.vitals.pulse || ''}
                    onChange={(e) => updateVital('pulse', e.target.value)}
                    placeholder="72"
                  />
                </div>
              </div>
            </div>

            {/* 実施ケア */}
            <div>
              <Label className="mb-2 block">実施したケア</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {CARE_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={record.care_types.includes(type)}
                      onCheckedChange={() => toggleCareType(type)}
                    />
                    <Label htmlFor={type} className="text-sm cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* テキストエリア */}
            <div>
              <Label htmlFor="condition">利用者の様子</Label>
              <Textarea
                id="condition"
                value={record.condition}
                onChange={(e) => updateField('condition', e.target.value)}
                placeholder="食事は自力で8割程度摂取。表情は穏やかで会話にも積極的..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="wish">本人・家族の希望</Label>
              <Textarea
                id="wish"
                value={record.wish}
                onChange={(e) => updateField('wish', e.target.value)}
                placeholder="できるだけ自分で歩きたい..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="note">特記事項・申し送り</Label>
              <Textarea
                id="note"
                value={record.note}
                onChange={(e) => updateField('note', e.target.value)}
                placeholder="夜間のトイレ回数が増加傾向..."
                rows={2}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              AIで介護記録を自動生成する
            </Button>
          </CardContent>
        </Card>
      )}

      {/* STEP 1: AI生成中 */}
      {step === 1 && (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6" />
            <p className="text-lg text-gray-600">AIが介護記録ドキュメントを生成しています...</p>
            <p className="text-sm text-gray-400 mt-2">3種類の文書を並列で生成中</p>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: 結果表示 */}
      {step === 2 && result && (
        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">生成完了</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>利用者:</strong> {record.resident_name}</p>
              <p><strong>記録日:</strong> {record.record_date}</p>
              <p><strong>担当者:</strong> {record.staff_name}</p>
              <p><strong>実施ケア:</strong> {record.care_types.join('、') || 'なし'}</p>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold text-gray-800">AI生成ドキュメント</h2>
          <GeneratedDocuments documents={result} />

          <Button onClick={handleReset} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            新しい記録を入力する
          </Button>
        </div>
      )}
    </div>
  )
}
