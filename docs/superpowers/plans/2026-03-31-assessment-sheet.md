# Assessment Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add assessment sheet, issue analysis sheet, and detailed care plan generation as a separate mode alongside the existing quick record generation.

**Architecture:** Page-routing separation (`/` mode selector, `/quick` existing, `/assessment` new). New assessment flow uses accordion input form, one-shot parallel generation via Gemini 2.5 Flash, then step-by-step review/edit UI. Client-side PDF export via jsPDF.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (base-nova), Gemini 2.5 Flash, jsPDF + jspdf-autotable

**Spec:** `docs/superpowers/specs/2026-03-31-assessment-sheet-design.md`

---

### Task 1: Install dependencies and add accordion component

**Files:**
- Modify: `package.json`
- Create: `src/components/ui/accordion.tsx` (via shadcn CLI)

- [ ] **Step 1: Install jsPDF packages**

Run:
```bash
cd C:/Users/tokuc/AI/claude/kaigo-gyomu-kun
npm install jspdf jspdf-autotable
```

Expected: packages added to dependencies in package.json

- [ ] **Step 2: Add shadcn accordion component**

Run:
```bash
cd C:/Users/tokuc/AI/claude/kaigo-gyomu-kun
npx shadcn@latest add accordion
```

Expected: `src/components/ui/accordion.tsx` created

- [ ] **Step 3: Verify accordion file exists**

Run:
```bash
ls src/components/ui/accordion.tsx
```

Expected: file listed

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/components/ui/accordion.tsx
git commit -m "chore: add jspdf, jspdf-autotable, and shadcn accordion"
```

---

### Task 2: Create assessment type definitions

**Files:**
- Create: `src/types/assessment.ts`

- [ ] **Step 1: Create the type definitions file**

Create `src/types/assessment.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
cd C:/Users/tokuc/AI/claude/kaigo-gyomu-kun
npx tsc --noEmit src/types/assessment.ts 2>&1 || echo "Check errors"
```

- [ ] **Step 3: Commit**

```bash
git add src/types/assessment.ts
git commit -m "feat: add assessment type definitions"
```

---

### Task 3: Create sample data

**Files:**
- Create: `src/lib/sample-data.ts`

- [ ] **Step 1: Create sample data file**

Create `src/lib/sample-data.ts`:

```typescript
import { AssessmentInput } from '@/types/assessment'

export const sampleAssessmentInput: AssessmentInput = {
  resident_name: '田中 花子',
  birth_date: '1940-05-15',
  age: '85',
  gender: '女性',
  care_level: '要介護3',
  certification_period: '2026-04-01 〜 2027-03-31',
  family_structure: '長男夫婦と同居（長男60歳・会社員、長男の妻58歳・パート勤務）',
  primary_caregiver: '長男の妻（日中はパート勤務のため不在がち）',
  staff_name: '佐藤 太郎',
  record_date: new Date().toISOString().split('T')[0],

  disease: '高血圧症、2型糖尿病、変形性膝関節症、軽度アルツハイマー型認知症',
  vitals: { bp: '138/82', temp: '36.4', spo2: '97', pulse: '76' },
  medications: 'アムロジピン5mg（朝食後）、メトホルミン500mg（朝夕食後）、ドネペジル5mg（朝食後）、ロキソプロフェン60mg（疼痛時）',
  primary_doctor: '山田医院 山田一郎医師（内科・月2回往診）',

  adl: {
    eating: '自立',
    toileting: '一部介助',
    bathing: '全介助',
    mobility: '一部介助',
    dressing: '一部介助',
    grooming: '一部介助',
  },

  iadl: {
    cooking: '全介助',
    laundry: '全介助',
    cleaning: '全介助',
    shopping: '全介助',
    money_management: '全介助',
    medication_management: '一部介助',
    phone: '一部介助',
    transportation: '全介助',
  },

  dementia_level: 'IIb',
  disability_level: 'A2',
  communication: '簡単な会話は可能。時折、同じ話を繰り返すことがある。指示理解はゆっくり話せば可能。難聴なし。',
  problematic_behavior: '夕方になると落ち着きがなくなり、「家に帰りたい」と繰り返すことがある（夕暮れ症候群）。夜間にトイレの場所がわからず廊下を歩き回ることがある。',

  housing_type: '木造2階建て（1階居室）、トイレ・浴室は1階。玄関に段差あり。',
  barrier_free: '廊下・トイレに手すり設置済み。浴室は未改修（またぎが高い）。居室からトイレまで約8m。',
  social_participation: '週1回デイサービスに通所。近所付き合いは減少傾向。以前は俳句の会に参加していた。',
  current_services: '通所介護（週2回）、訪問介護（週3回・入浴介助と生活援助）、訪問看護（週1回・バイタル確認と服薬管理）',

  chief_complaint: '膝が痛くて歩くのがつらい。お風呂に一人で入れなくなった。物忘れが増えて不安。',
  resident_wish: 'できるだけ自分の足で歩き続けたい。家族に迷惑をかけたくない。',
  family_wish: '安全に生活してほしい。入浴や夜間のトイレが心配。認知症の進行をできるだけ遅らせたい。',
  special_notes: '夜間のトイレ回数が増加傾向（1〜3回/夜）。転倒歴あり（3ヶ月前に廊下で転倒、打撲のみ）。甘いものが好きで血糖コントロールに注意が必要。',
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/sample-data.ts
git commit -m "feat: add sample assessment data for demo"
```

---

### Task 4: Create assessment prompts

**Files:**
- Create: `src/lib/assessment-prompts.ts`

- [ ] **Step 1: Create the prompts file**

Create `src/lib/assessment-prompts.ts`:

```typescript
import { AssessmentInput } from '@/types/assessment'

function buildAssessmentContext(input: AssessmentInput): string {
  const vitals = [
    input.vitals.bp && `血圧${input.vitals.bp}`,
    input.vitals.temp && `体温${input.vitals.temp}℃`,
    input.vitals.spo2 && `SpO2 ${input.vitals.spo2}%`,
    input.vitals.pulse && `脈拍${input.vitals.pulse}bpm`,
  ].filter(Boolean).join('、')

  const adlLines = [
    `食事: ${input.adl.eating || '未入力'}`,
    `排泄: ${input.adl.toileting || '未入力'}`,
    `入浴: ${input.adl.bathing || '未入力'}`,
    `移動: ${input.adl.mobility || '未入力'}`,
    `着替え: ${input.adl.dressing || '未入力'}`,
    `整容: ${input.adl.grooming || '未入力'}`,
  ].join('\n')

  const iadlLines = [
    `調理: ${input.iadl.cooking || '未入力'}`,
    `洗濯: ${input.iadl.laundry || '未入力'}`,
    `掃除: ${input.iadl.cleaning || '未入力'}`,
    `買物: ${input.iadl.shopping || '未入力'}`,
    `金銭管理: ${input.iadl.money_management || '未入力'}`,
    `服薬管理: ${input.iadl.medication_management || '未入力'}`,
    `電話: ${input.iadl.phone || '未入力'}`,
    `交通手段: ${input.iadl.transportation || '未入力'}`,
  ].join('\n')

  return `【利用者名】${input.resident_name}
【生年月日】${input.birth_date || '未入力'}
【年齢】${input.age || '未入力'}
【性別】${input.gender || '未入力'}
【要介護度】${input.care_level || '未設定'}
【認定有効期間】${input.certification_period || '未入力'}
【家族構成】${input.family_structure || '未入力'}
【主介護者】${input.primary_caregiver || '未入力'}
【担当者】${input.staff_name}
【記録日】${input.record_date}

【疾患・既往歴】${input.disease || 'なし'}
【バイタル】${vitals || '未計測'}
【服薬状況】${input.medications || '未入力'}
【主治医・医療機関】${input.primary_doctor || '未入力'}

【ADL（日常生活動作）】
${adlLines}

【IADL（手段的日常生活動作）】
${iadlLines}

【認知症高齢者日常生活自立度】${input.dementia_level || '未入力'}
【障害高齢者日常生活自立度】${input.disability_level || '未入力'}
【コミュニケーション】${input.communication || '未入力'}
【問題行動】${input.problematic_behavior || '未入力'}

【居住環境】${input.housing_type || '未入力'}
【バリアフリー状況】${input.barrier_free || '未入力'}
【社会との関わり】${input.social_participation || '未入力'}
【現在利用しているサービス】${input.current_services || '未入力'}

【主訴】${input.chief_complaint || '未入力'}
【本人の希望】${input.resident_wish || '未入力'}
【家族の希望】${input.family_wish || '未入力'}
【特記事項】${input.special_notes || 'なし'}`
}

export function buildAssessmentSheetPrompt(input: AssessmentInput): string {
  return `あなたは経験豊富なケアマネージャーです。
以下の利用者情報をもとに、厚生労働省の課題分析標準項目（23項目）に沿ったアセスメントシートを作成してください。

【重要なルール】
- 情報が提供されている項目はその内容をもとに専門的な記述を行ってください
- 情報が「未入力」の項目は content に「要確認」と記入してください
- JSON形式で出力してください。マークダウンのコードブロックは不要です

【出力形式】
{"items":[{"label":"1. 基本情報","content":"..."},{"label":"2. 生活状況","content":"..."},...]}

23項目:
1. 基本情報（氏名・年齢・要介護度・家族構成など）
2. 生活状況
3. 利用者の被保険者情報
4. 現在利用しているサービスの状況
5. 障害高齢者の日常生活自立度
6. 認知症高齢者の日常生活自立度
7. 主訴
8. 認定情報
9. 課題分析の理由
10. 健康状態
11. ADL（日常生活動作）
12. IADL（手段的日常生活動作）
13. 認知
14. コミュニケーション能力
15. 社会との関わり
16. 排尿・排便
17. じょくそう・皮膚の問題
18. 口腔衛生
19. 食事摂取
20. 問題行動
21. 介護力
22. 居住環境
23. 特別な状況

${buildAssessmentContext(input)}`
}

export function buildIssueAnalysisPrompt(input: AssessmentInput): string {
  return `あなたは経験豊富なケアマネージャーです。
以下の利用者情報をもとに、課題整理総括表（課題分析シート）を作成してください。

【重要なルール】
- 利用者の状態から3〜6個の課題を抽出してください
- 各課題に対して現状・目標・背景と原因・優先順位・サービスの方向性を記述してください
- 優先順位は「高」「中」「低」で設定してください
- JSON形式で出力してください。マークダウンのコードブロックは不要です

【出力形式】
[{"need":"...","current_status":"...","goal":"...","background":"...","priority":"高","service_direction":"..."},...]

${buildAssessmentContext(input)}`
}

export function buildDetailedCarePlanPrompt(input: AssessmentInput): string {
  return `あなたは経験豊富なケアマネージャーです。
以下の利用者情報をもとに、居宅サービス計画書（ケアプラン）を作成してください。

【重要なルール】
- 長期目標（6ヶ月）は2〜3個設定してください
- 短期目標（3ヶ月）は3〜5個設定してください
- サービス内容は具体的に記述し、種類・担当者・頻度・期間を明記してください
- JSON形式で出力してください。マークダウンのコードブロックは不要です

【出力形式】
{"long_term_goals":["..."],"short_term_goals":["..."],"services":[{"content":"...","type":"...","provider":"...","frequency":"...","period":"..."},..."]}

${buildAssessmentContext(input)}`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/assessment-prompts.ts
git commit -m "feat: add assessment, issue analysis, and care plan prompts"
```

---

### Task 5: Create assessment Gemini service and API route

**Files:**
- Create: `src/lib/assessment-gemini.ts`
- Create: `src/app/api/assessment/generate/route.ts`

- [ ] **Step 1: Create assessment Gemini service**

Create `src/lib/assessment-gemini.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AssessmentInput, AssessmentGenerateResponse, AssessmentSheet, IssueAnalysisRow, DetailedCarePlan } from '@/types/assessment'
import {
  buildAssessmentSheetPrompt,
  buildIssueAnalysisPrompt,
  buildDetailedCarePlanPrompt,
} from './assessment-prompts'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: 'あなたは介護福祉の専門家です。指定されたJSON形式で正確に出力してください。JSONのみを出力し、他のテキストは含めないでください。',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})

async function callGeminiJSON<T>(prompt: string): Promise<T> {
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text) as T
}

export async function generateAssessmentDocuments(
  input: AssessmentInput
): Promise<AssessmentGenerateResponse> {
  const [assessment_sheet, issue_analysis, care_plan] = await Promise.all([
    callGeminiJSON<AssessmentSheet>(buildAssessmentSheetPrompt(input)),
    callGeminiJSON<IssueAnalysisRow[]>(buildIssueAnalysisPrompt(input)),
    callGeminiJSON<DetailedCarePlan>(buildDetailedCarePlanPrompt(input)),
  ])

  return { assessment_sheet, issue_analysis, care_plan }
}
```

- [ ] **Step 2: Create API route**

Create `src/app/api/assessment/generate/route.ts`:

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/assessment-gemini.ts src/app/api/assessment/generate/route.ts
git commit -m "feat: add assessment generation API with Gemini integration"
```

---

### Task 6: Create mode selector and update routing

**Files:**
- Create: `src/components/ModeSelector.tsx`
- Create: `src/app/quick/page.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create ModeSelector component**

Create `src/components/ModeSelector.tsx`:

```tsx
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ClipboardList } from 'lucide-react'

const modes = [
  {
    href: '/quick',
    title: '簡易記録生成',
    description: '介護記録メモから正式文書・ケアプラン・業務報告書を自動生成します。',
    icon: FileText,
    color: 'text-blue-600',
    borderColor: 'hover:border-blue-300',
  },
  {
    href: '/assessment',
    title: 'ケアプラン作成',
    description: 'アセスメントシート・課題分析シート・詳細ケアプランを一括生成します。',
    icon: ClipboardList,
    color: 'text-green-600',
    borderColor: 'hover:border-green-300',
  },
]

export default function ModeSelector() {
  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {modes.map((mode) => (
        <Link key={mode.href} href={mode.href}>
          <Card className={`cursor-pointer transition-colors border-2 ${mode.borderColor} h-full`}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <mode.icon className={`w-8 h-8 ${mode.color}`} />
              <CardTitle className={`text-lg ${mode.color}`}>{mode.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{mode.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create /quick page (move existing content)**

Create `src/app/quick/page.tsx`:

```tsx
import Link from 'next/link'
import CareRecordForm from '@/components/CareRecordForm'

export default function QuickPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-700 cursor-pointer">介護業務くん</h1>
          </Link>
        </div>
      </header>
      <div className="px-4 py-8">
        <CareRecordForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Update root page to show mode selector**

Replace `src/app/page.tsx` with:

```tsx
import Link from 'next/link'
import ModeSelector from '@/components/ModeSelector'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-700 cursor-pointer">介護業務くん</h1>
          </Link>
        </div>
      </header>
      <div className="px-4 py-16">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-8">モードを選択してください</h2>
        <ModeSelector />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify both routes work**

Run:
```bash
cd C:/Users/tokuc/AI/claude/kaigo-gyomu-kun
npm run build 2>&1 | tail -20
```

Expected: Build succeeds with `/`, `/quick`, and `/assessment` routes listed.

- [ ] **Step 5: Commit**

```bash
git add src/components/ModeSelector.tsx src/app/quick/page.tsx src/app/page.tsx
git commit -m "feat: add mode selector and move existing flow to /quick"
```

---

### Task 7: Create AssessmentFlowIndicator component

**Files:**
- Create: `src/components/assessment/AssessmentFlowIndicator.tsx`

- [ ] **Step 1: Create the flow indicator**

Create `src/components/assessment/AssessmentFlowIndicator.tsx`:

```tsx
'use client'

interface AssessmentFlowIndicatorProps {
  currentStep: number
}

const steps = [
  { label: '入力', description: '情報を入力' },
  { label: 'AI生成中', description: '帳票を自動生成' },
  { label: 'アセスメント', description: 'シートを確認・編集' },
  { label: '課題分析', description: 'シートを確認・編集' },
  { label: 'ケアプラン', description: '出力・PDF' },
]

export default function AssessmentFlowIndicator({ currentStep }: AssessmentFlowIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                index < currentStep
                  ? 'bg-blue-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? '\u2713' : index + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center ${
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 mb-5 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/assessment/AssessmentFlowIndicator.tsx
git commit -m "feat: add assessment flow indicator with 5 steps"
```

---

### Task 8: Create AssessmentForm component (accordion input)

**Files:**
- Create: `src/components/assessment/AssessmentForm.tsx`

- [ ] **Step 1: Create the assessment form**

Create `src/components/assessment/AssessmentForm.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/assessment/AssessmentForm.tsx
git commit -m "feat: add accordion-based assessment input form with sample data"
```

---

### Task 9: Create AssessmentSheet display/edit component

**Files:**
- Create: `src/components/assessment/AssessmentSheet.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/assessment/AssessmentSheet.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AssessmentSheet as AssessmentSheetType } from '@/types/assessment'

interface AssessmentSheetProps {
  sheet: AssessmentSheetType
  onChange: (sheet: AssessmentSheetType) => void
}

export default function AssessmentSheet({ sheet, onChange }: AssessmentSheetProps) {
  const updateItem = (index: number, content: string) => {
    const newItems = [...sheet.items]
    newItems[index] = { ...newItems[index], content }
    onChange({ items: newItems })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-700">アセスメントシート（課題分析標準項目）</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sheet.items.map((item, index) => (
          <div key={index}>
            <Label className="text-sm font-semibold">{item.label}</Label>
            <Textarea
              value={item.content}
              onChange={(e) => updateItem(index, e.target.value)}
              rows={item.content.length > 100 ? 4 : 2}
              className={item.content === '要確認' ? 'border-orange-300 bg-orange-50' : ''}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/assessment/AssessmentSheet.tsx
git commit -m "feat: add editable assessment sheet component"
```

---

### Task 10: Create IssueAnalysis display/edit component

**Files:**
- Create: `src/components/assessment/IssueAnalysis.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/assessment/IssueAnalysis.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IssueAnalysisRow } from '@/types/assessment'
import { Plus, Trash2 } from 'lucide-react'

interface IssueAnalysisProps {
  rows: IssueAnalysisRow[]
  onChange: (rows: IssueAnalysisRow[]) => void
}

const PRIORITIES = ['高', '中', '低'] as const

const emptyRow: IssueAnalysisRow = {
  need: '',
  current_status: '',
  goal: '',
  background: '',
  priority: '中',
  service_direction: '',
}

export default function IssueAnalysis({ rows, onChange }: IssueAnalysisProps) {
  const updateRow = (index: number, field: keyof IssueAnalysisRow, value: string) => {
    const newRows = [...rows]
    newRows[index] = { ...newRows[index], [field]: value }
    onChange(newRows)
  }

  const addRow = () => {
    onChange([...rows, { ...emptyRow }])
  }

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-blue-700">課題分析シート（課題整理総括表）</CardTitle>
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="w-4 h-4 mr-1" />
          課題を追加
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {rows.map((row, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">課題 {index + 1}</span>
              {rows.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeRow(index)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500">課題（ニーズ）</label>
              <Input value={row.need} onChange={(e) => updateRow(index, 'need', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">現状</label>
                <Textarea value={row.current_status} onChange={(e) => updateRow(index, 'current_status', e.target.value)} rows={2} />
              </div>
              <div>
                <label className="text-xs text-gray-500">目標</label>
                <Textarea value={row.goal} onChange={(e) => updateRow(index, 'goal', e.target.value)} rows={2} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">背景・原因</label>
              <Textarea value={row.background} onChange={(e) => updateRow(index, 'background', e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">優先順位</label>
                <Select value={row.priority} onValueChange={(v) => updateRow(index, 'priority', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-500">サービスの方向性</label>
                <Input value={row.service_direction} onChange={(e) => updateRow(index, 'service_direction', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/assessment/IssueAnalysis.tsx
git commit -m "feat: add editable issue analysis component with add/remove rows"
```

---

### Task 11: Create DetailedCarePlan display/edit component

**Files:**
- Create: `src/components/assessment/DetailedCarePlan.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/assessment/DetailedCarePlan.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DetailedCarePlan as DetailedCarePlanType } from '@/types/assessment'
import { Plus, Trash2 } from 'lucide-react'

interface DetailedCarePlanProps {
  plan: DetailedCarePlanType
  onChange: (plan: DetailedCarePlanType) => void
}

export default function DetailedCarePlan({ plan, onChange }: DetailedCarePlanProps) {
  const updateGoal = (type: 'long_term_goals' | 'short_term_goals', index: number, value: string) => {
    const newGoals = [...plan[type]]
    newGoals[index] = value
    onChange({ ...plan, [type]: newGoals })
  }

  const addGoal = (type: 'long_term_goals' | 'short_term_goals') => {
    onChange({ ...plan, [type]: [...plan[type], ''] })
  }

  const removeGoal = (type: 'long_term_goals' | 'short_term_goals', index: number) => {
    onChange({ ...plan, [type]: plan[type].filter((_, i) => i !== index) })
  }

  const updateService = (index: number, field: keyof DetailedCarePlanType['services'][0], value: string) => {
    const newServices = [...plan.services]
    newServices[index] = { ...newServices[index], [field]: value }
    onChange({ ...plan, services: newServices })
  }

  const addService = () => {
    onChange({
      ...plan,
      services: [...plan.services, { content: '', type: '', provider: '', frequency: '', period: '' }],
    })
  }

  const removeService = (index: number) => {
    onChange({ ...plan, services: plan.services.filter((_, i) => i !== index) })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-700">ケアプラン（居宅サービス計画書）</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Long-term goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">長期目標（6ヶ月）</h3>
            <Button variant="outline" size="sm" onClick={() => addGoal('long_term_goals')}>
              <Plus className="w-4 h-4 mr-1" />追加
            </Button>
          </div>
          <div className="space-y-2">
            {plan.long_term_goals.map((goal, i) => (
              <div key={i} className="flex gap-2">
                <Textarea value={goal} onChange={(e) => updateGoal('long_term_goals', i, e.target.value)} rows={1} className="flex-1" />
                {plan.long_term_goals.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeGoal('long_term_goals', i)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Short-term goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">短期目標（3ヶ月）</h3>
            <Button variant="outline" size="sm" onClick={() => addGoal('short_term_goals')}>
              <Plus className="w-4 h-4 mr-1" />追加
            </Button>
          </div>
          <div className="space-y-2">
            {plan.short_term_goals.map((goal, i) => (
              <div key={i} className="flex gap-2">
                <Textarea value={goal} onChange={(e) => updateGoal('short_term_goals', i, e.target.value)} rows={1} className="flex-1" />
                {plan.short_term_goals.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeGoal('short_term_goals', i)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">サービス内容</h3>
            <Button variant="outline" size="sm" onClick={addService}>
              <Plus className="w-4 h-4 mr-1" />追加
            </Button>
          </div>
          <div className="space-y-4">
            {plan.services.map((svc, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">サービス {i + 1}</span>
                  {plan.services.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeService(i)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">内容</label>
                  <Textarea value={svc.content} onChange={(e) => updateService(i, 'content', e.target.value)} rows={2} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">種類</label>
                    <Input value={svc.type} onChange={(e) => updateService(i, 'type', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">担当者</label>
                    <Input value={svc.provider} onChange={(e) => updateService(i, 'provider', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">頻度</label>
                    <Input value={svc.frequency} onChange={(e) => updateService(i, 'frequency', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">期間</label>
                    <Input value={svc.period} onChange={(e) => updateService(i, 'period', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/assessment/DetailedCarePlan.tsx
git commit -m "feat: add editable detailed care plan component"
```

---

### Task 12: Create PDF export module

**Files:**
- Create: `src/lib/pdf.ts`
- Create: `src/components/assessment/PdfExport.tsx`

- [ ] **Step 1: Create PDF generation logic**

Create `src/lib/pdf.ts`:

```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { AssessmentSheet, IssueAnalysisRow, DetailedCarePlan } from '@/types/assessment'

async function loadFont(doc: jsPDF) {
  const fontUrl = 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/Variable/TTF/Subset/NotoSansCJKjp-VF.ttf'
  const response = await fetch(fontUrl)
  const buffer = await response.arrayBuffer()
  const base64 = btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  doc.addFileToVFS('NotoSansJP.ttf', base64)
  doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal')
  doc.setFont('NotoSansJP')
}

export async function generateAssessmentSheetPdf(sheet: AssessmentSheet): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('アセスメントシート（課題分析標準項目）', 15, 20)

  let y = 30
  doc.setFontSize(10)
  for (const item of sheet.items) {
    if (y > 270) {
      doc.addPage()
      y = 15
    }
    doc.setFontSize(11)
    doc.text(item.label, 15, y)
    y += 5
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(item.content, 170)
    doc.text(lines, 20, y)
    y += lines.length * 4.5 + 4
  }

  return doc.output('blob')
}

export async function generateIssueAnalysisPdf(rows: IssueAnalysisRow[]): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('課題分析シート（課題整理総括表）', 15, 20)

  autoTable(doc, {
    startY: 28,
    head: [['課題（ニーズ）', '現状', '目標', '背景・原因', '優先順位', 'サービスの方向性']],
    body: rows.map((r) => [r.need, r.current_status, r.goal, r.background, r.priority, r.service_direction]),
    styles: { font: 'NotoSansJP', fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], font: 'NotoSansJP' },
    columnStyles: {
      0: { cellWidth: 40 },
      4: { cellWidth: 20, halign: 'center' },
    },
  })

  return doc.output('blob')
}

export async function generateCarePlanPdf(plan: DetailedCarePlan): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('居宅サービス計画書（ケアプラン）', 15, 20)

  let y = 32
  doc.setFontSize(12)
  doc.text('長期目標（6ヶ月）', 15, y)
  y += 6
  doc.setFontSize(10)
  for (const goal of plan.long_term_goals) {
    const lines = doc.splitTextToSize(`- ${goal}`, 170)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 2
  }

  y += 4
  doc.setFontSize(12)
  doc.text('短期目標（3ヶ月）', 15, y)
  y += 6
  doc.setFontSize(10)
  for (const goal of plan.short_term_goals) {
    const lines = doc.splitTextToSize(`- ${goal}`, 170)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 2
  }

  y += 4
  doc.setFontSize(12)
  doc.text('サービス内容', 15, y)
  y += 2

  autoTable(doc, {
    startY: y,
    head: [['内容', '種類', '担当者', '頻度', '期間']],
    body: plan.services.map((s) => [s.content, s.type, s.provider, s.frequency, s.period]),
    styles: { font: 'NotoSansJP', fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], font: 'NotoSansJP' },
    columnStyles: { 0: { cellWidth: 60 } },
  })

  return doc.output('blob')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadAssessmentSheetPdf(sheet: AssessmentSheet) {
  const blob = await generateAssessmentSheetPdf(sheet)
  downloadBlob(blob, 'assessment-sheet.pdf')
}

export async function downloadIssueAnalysisPdf(rows: IssueAnalysisRow[]) {
  const blob = await generateIssueAnalysisPdf(rows)
  downloadBlob(blob, 'issue-analysis.pdf')
}

export async function downloadCarePlanPdf(plan: DetailedCarePlan) {
  const blob = await generateCarePlanPdf(plan)
  downloadBlob(blob, 'care-plan.pdf')
}

export async function downloadAllPdf(
  sheet: AssessmentSheet,
  rows: IssueAnalysisRow[],
  plan: DetailedCarePlan
) {
  await downloadAssessmentSheetPdf(sheet)
  await downloadIssueAnalysisPdf(rows)
  await downloadCarePlanPdf(plan)
}
```

- [ ] **Step 2: Create PdfExport component**

Create `src/components/assessment/PdfExport.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AssessmentSheet, IssueAnalysisRow, DetailedCarePlan } from '@/types/assessment'
import {
  downloadAssessmentSheetPdf,
  downloadIssueAnalysisPdf,
  downloadCarePlanPdf,
  downloadAllPdf,
} from '@/lib/pdf'
import { Download } from 'lucide-react'

interface PdfExportProps {
  sheet: AssessmentSheet
  issues: IssueAnalysisRow[]
  plan: DetailedCarePlan
}

export default function PdfExport({ sheet, issues, plan }: PdfExportProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handle = async (key: string, fn: () => Promise<void>) => {
    setLoading(key)
    try {
      await fn()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">PDF出力</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handle('assessment', () => downloadAssessmentSheetPdf(sheet))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'assessment' ? '生成中...' : 'アセスメントシート'}
        </Button>
        <Button
          variant="outline"
          onClick={() => handle('issue', () => downloadIssueAnalysisPdf(issues))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'issue' ? '生成中...' : '課題分析シート'}
        </Button>
        <Button
          variant="outline"
          onClick={() => handle('plan', () => downloadCarePlanPdf(plan))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'plan' ? '生成中...' : 'ケアプラン'}
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handle('all', () => downloadAllPdf(sheet, issues, plan))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'all' ? '生成中...' : '全帳票を一括ダウンロード'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/pdf.ts src/components/assessment/PdfExport.tsx
git commit -m "feat: add PDF export for assessment sheets with Japanese font support"
```

---

### Task 13: Create assessment page (main flow orchestrator)

**Files:**
- Create: `src/app/assessment/page.tsx`

- [ ] **Step 1: Create the assessment page**

Create `src/app/assessment/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/assessment/page.tsx
git commit -m "feat: add assessment page with 5-step flow orchestration"
```

---

### Task 14: Build verification and smoke test

**Files:**
- No new files

- [ ] **Step 1: Run TypeScript check**

Run:
```bash
cd C:/Users/tokuc/AI/claude/kaigo-gyomu-kun
npx tsc --noEmit 2>&1
```

Expected: No errors

- [ ] **Step 2: Run build**

Run:
```bash
cd C:/Users/tokuc/AI/claude/kaigo-gyomu-kun
npm run build 2>&1
```

Expected: Build succeeds. Routes listed should include `/`, `/quick`, `/assessment`, `/api/generate`, `/api/assessment/generate`

- [ ] **Step 3: Fix any build errors found in Steps 1-2**

If there are TypeScript or build errors, fix them in the relevant files and re-run the checks.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors"
```

---

### Task 15: Manual smoke test with dev server

**Files:**
- No new files

- [ ] **Step 1: Start dev server**

Run:
```bash
cd C:/Users/tokuc/AI/claude/kaigo-gyomu-kun
npm run dev
```

- [ ] **Step 2: Test mode selector page**

Open `http://localhost:3000` and verify:
- Two cards displayed: "簡易記録生成" and "ケアプラン作成"
- Clicking "簡易記録生成" navigates to `/quick`
- Clicking "ケアプラン作成" navigates to `/assessment`

- [ ] **Step 3: Test existing quick flow at /quick**

Verify the existing flow still works unchanged at `/quick`.

- [ ] **Step 4: Test assessment flow**

At `/assessment`:
1. Click "サンプルデータを入力" — all fields populate
2. Click "AIでアセスメント・ケアプランを自動生成する"
3. Wait for generation (step indicator shows progress)
4. Step 2: Review assessment sheet items, edit one, click "次へ"
5. Step 3: Review issue analysis table, click "次へ"
6. Step 4: Review care plan, click PDF download buttons
7. Click "新しいアセスメントを開始" to reset

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: post-smoke-test fixes"
```
