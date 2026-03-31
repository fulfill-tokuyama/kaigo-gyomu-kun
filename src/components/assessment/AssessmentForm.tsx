'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import {
  AssessmentInput,
  IndependenceLevel,
  DementiaLevel,
  DisabilityLevel,
} from '@/types/assessment'
import { CareLevel } from '@/types'
import { sampleAssessmentInput } from '@/lib/sample-data'

const CARE_LEVELS: CareLevel[] = [
  '要支援1', '要支援2',
  '要介護1', '要介護2', '要介護3', '要介護4', '要介護5',
]

const INDEPENDENCE_LEVELS: IndependenceLevel[] = ['自立', '一部介助', '全介助']

const DEMENTIA_LEVELS: DementiaLevel[] = [
  '自立', 'I', 'IIa', 'IIb', 'IIIa', 'IIIb', 'IV', 'M',
]

const DISABILITY_LEVELS: DisabilityLevel[] = [
  '自立', 'J1', 'J2', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2',
]

const ADL_ITEMS: { key: keyof AssessmentInput['adl']; label: string }[] = [
  { key: 'eating', label: '食事' },
  { key: 'toileting', label: '排泄' },
  { key: 'bathing', label: '入浴' },
  { key: 'mobility', label: '移動' },
  { key: 'dressing', label: '着替え' },
  { key: 'grooming', label: '整容' },
]

const IADL_ITEMS: { key: keyof AssessmentInput['iadl']; label: string }[] = [
  { key: 'cooking', label: '調理' },
  { key: 'laundry', label: '洗濯' },
  { key: 'cleaning', label: '掃除' },
  { key: 'shopping', label: '買物' },
  { key: 'money_management', label: '金銭管理' },
  { key: 'medication_management', label: '服薬管理' },
  { key: 'phone', label: '電話' },
  { key: 'transportation', label: '交通手段' },
]

interface AssessmentFormProps {
  input: AssessmentInput
  onChange: (input: AssessmentInput) => void
  onSubmit: () => void
}

export default function AssessmentForm({ input, onChange, onSubmit }: AssessmentFormProps) {
  const update = <K extends keyof AssessmentInput>(key: K, value: AssessmentInput[K]) => {
    onChange({ ...input, [key]: value })
  }

  const updateVital = (key: string, value: string) => {
    onChange({ ...input, vitals: { ...input.vitals, [key]: value } })
  }

  const updateADL = (key: keyof AssessmentInput['adl'], value: IndependenceLevel) => {
    onChange({ ...input, adl: { ...input.adl, [key]: value } })
  }

  const updateIADL = (key: keyof AssessmentInput['iadl'], value: IndependenceLevel) => {
    onChange({ ...input, iadl: { ...input.iadl, [key]: value } })
  }

  const loadSample = () => {
    onChange({ ...sampleAssessmentInput, record_date: new Date().toISOString().split('T')[0] })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={loadSample}>
          サンプルデータを入力
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['basic']} className="space-y-2">
        {/* Section 1: Basic Info */}
        <AccordionItem value="basic">
          <AccordionTrigger className="text-base font-semibold">基本情報</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="resident_name">利用者名 *</Label>
                <Input id="resident_name" value={input.resident_name} onChange={(e) => update('resident_name', e.target.value)} placeholder="田中 花子" />
              </div>
              <div>
                <Label htmlFor="birth_date">生年月日</Label>
                <Input id="birth_date" type="date" value={input.birth_date} onChange={(e) => update('birth_date', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="age">年齢</Label>
                <Input id="age" value={input.age} onChange={(e) => update('age', e.target.value)} placeholder="85" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>性別</Label>
                <Select value={input.gender} onValueChange={(v) => update('gender', v as AssessmentInput['gender'])}>
                  <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="男性">男性</SelectItem>
                    <SelectItem value="女性">女性</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>要介護度</Label>
                <Select value={input.care_level} onValueChange={(v) => update('care_level', v as CareLevel)}>
                  <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                  <SelectContent>
                    {CARE_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="certification_period">認定有効期間</Label>
                <Input id="certification_period" value={input.certification_period} onChange={(e) => update('certification_period', e.target.value)} placeholder="2026-04-01 ~ 2027-03-31" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="family_structure">家族構成</Label>
                <Input id="family_structure" value={input.family_structure} onChange={(e) => update('family_structure', e.target.value)} placeholder="長男夫婦と同居" />
              </div>
              <div>
                <Label htmlFor="primary_caregiver">主介護者</Label>
                <Input id="primary_caregiver" value={input.primary_caregiver} onChange={(e) => update('primary_caregiver', e.target.value)} placeholder="長男の妻" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="staff_name">担当者名 *</Label>
                <Input id="staff_name" value={input.staff_name} onChange={(e) => update('staff_name', e.target.value)} placeholder="佐藤 太郎" />
              </div>
              <div>
                <Label htmlFor="record_date">記録日</Label>
                <Input id="record_date" type="date" value={input.record_date} onChange={(e) => update('record_date', e.target.value)} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Medical */}
        <AccordionItem value="medical">
          <AccordionTrigger className="text-base font-semibold">医療・健康</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div>
              <Label htmlFor="disease">主な疾患・既往歴</Label>
              <Input id="disease" value={input.disease} onChange={(e) => update('disease', e.target.value)} placeholder="高血圧、糖尿病 など" />
            </div>
            <div>
              <Label className="mb-2 block">バイタルサイン</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bp" className="text-xs text-gray-500">血圧</Label>
                  <Input id="bp" value={input.vitals.bp || ''} onChange={(e) => updateVital('bp', e.target.value)} placeholder="120/80" />
                </div>
                <div>
                  <Label htmlFor="temp" className="text-xs text-gray-500">体温</Label>
                  <Input id="temp" value={input.vitals.temp || ''} onChange={(e) => updateVital('temp', e.target.value)} placeholder="36.5" />
                </div>
                <div>
                  <Label htmlFor="spo2" className="text-xs text-gray-500">SpO2</Label>
                  <Input id="spo2" value={input.vitals.spo2 || ''} onChange={(e) => updateVital('spo2', e.target.value)} placeholder="98" />
                </div>
                <div>
                  <Label htmlFor="pulse" className="text-xs text-gray-500">脈拍</Label>
                  <Input id="pulse" value={input.vitals.pulse || ''} onChange={(e) => updateVital('pulse', e.target.value)} placeholder="72" />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="medications">服薬状況</Label>
              <Textarea id="medications" value={input.medications} onChange={(e) => update('medications', e.target.value)} placeholder="アムロジピン5mg（朝食後）..." rows={2} />
            </div>
            <div>
              <Label htmlFor="primary_doctor">主治医・医療機関</Label>
              <Input id="primary_doctor" value={input.primary_doctor} onChange={(e) => update('primary_doctor', e.target.value)} placeholder="山田医院 山田一郎医師" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: ADL */}
        <AccordionItem value="adl">
          <AccordionTrigger className="text-base font-semibold">ADL（日常生活動作）</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ADL_ITEMS.map(({ key, label }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Select value={input.adl[key]} onValueChange={(v) => updateADL(key, v as IndependenceLevel)}>
                    <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                    <SelectContent>
                      {INDEPENDENCE_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: IADL */}
        <AccordionItem value="iadl">
          <AccordionTrigger className="text-base font-semibold">IADL（手段的日常生活動作）</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {IADL_ITEMS.map(({ key, label }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Select value={input.iadl[key]} onValueChange={(v) => updateIADL(key, v as IndependenceLevel)}>
                    <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                    <SelectContent>
                      {INDEPENDENCE_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Cognition */}
        <AccordionItem value="cognition">
          <AccordionTrigger className="text-base font-semibold">認知・コミュニケーション</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>認知症高齢者日常生活自立度</Label>
                <Select value={input.dementia_level} onValueChange={(v) => update('dementia_level', v as DementiaLevel)}>
                  <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                  <SelectContent>
                    {DEMENTIA_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>障害高齢者日常生活自立度</Label>
                <Select value={input.disability_level} onValueChange={(v) => update('disability_level', v as DisabilityLevel)}>
                  <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                  <SelectContent>
                    {DISABILITY_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="communication">コミュニケーション能力</Label>
              <Textarea id="communication" value={input.communication} onChange={(e) => update('communication', e.target.value)} placeholder="簡単な会話は可能..." rows={2} />
            </div>
            <div>
              <Label htmlFor="problematic_behavior">問題行動</Label>
              <Textarea id="problematic_behavior" value={input.problematic_behavior} onChange={(e) => update('problematic_behavior', e.target.value)} placeholder="夕方になると落ち着きがなくなる..." rows={2} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 6: Environment */}
        <AccordionItem value="environment">
          <AccordionTrigger className="text-base font-semibold">生活環境・社会参加</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div>
              <Label htmlFor="housing_type">居住環境</Label>
              <Input id="housing_type" value={input.housing_type} onChange={(e) => update('housing_type', e.target.value)} placeholder="木造2階建て（1階居室）" />
            </div>
            <div>
              <Label htmlFor="barrier_free">バリアフリー状況</Label>
              <Textarea id="barrier_free" value={input.barrier_free} onChange={(e) => update('barrier_free', e.target.value)} placeholder="廊下・トイレに手すり設置済み..." rows={2} />
            </div>
            <div>
              <Label htmlFor="social_participation">社会との関わり</Label>
              <Textarea id="social_participation" value={input.social_participation} onChange={(e) => update('social_participation', e.target.value)} placeholder="週1回デイサービスに通所..." rows={2} />
            </div>
            <div>
              <Label htmlFor="current_services">現在利用しているサービス</Label>
              <Textarea id="current_services" value={input.current_services} onChange={(e) => update('current_services', e.target.value)} placeholder="通所介護（週2回）..." rows={2} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 7: Wishes */}
        <AccordionItem value="wishes">
          <AccordionTrigger className="text-base font-semibold">本人・家族の意向</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div>
              <Label htmlFor="chief_complaint">主訴</Label>
              <Textarea id="chief_complaint" value={input.chief_complaint} onChange={(e) => update('chief_complaint', e.target.value)} placeholder="膝が痛くて歩くのがつらい..." rows={2} />
            </div>
            <div>
              <Label htmlFor="resident_wish">本人の希望</Label>
              <Textarea id="resident_wish" value={input.resident_wish} onChange={(e) => update('resident_wish', e.target.value)} placeholder="できるだけ自分の足で歩き続けたい..." rows={2} />
            </div>
            <div>
              <Label htmlFor="family_wish">家族の希望</Label>
              <Textarea id="family_wish" value={input.family_wish} onChange={(e) => update('family_wish', e.target.value)} placeholder="安全に生活してほしい..." rows={2} />
            </div>
            <div>
              <Label htmlFor="special_notes">特記事項・申し送り</Label>
              <Textarea id="special_notes" value={input.special_notes} onChange={(e) => update('special_notes', e.target.value)} placeholder="夜間のトイレ回数が増加傾向..." rows={2} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
        AIでアセスメント・ケアプランを自動生成する
      </Button>
    </div>
  )
}
