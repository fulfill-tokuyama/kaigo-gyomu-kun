# ケアプラン作成機能の拡張: アセスメントシート・課題分析シート出力対応

## 概要

介護記録入力からアセスメントシート（厚労省23項目準拠）、課題分析シート（課題整理総括表）、詳細ケアプランを一括生成する機能を追加する。既存の簡易記録生成機能とは別モードとして並存させる。

## 決定事項

| 項目 | 決定 |
|------|------|
| ルーティング | ページ分離型: `/`(モード選択) `/quick`(既存) `/assessment`(新規) |
| 入力フォーム | アコーディオン7セクション構成、サンプルデータボタン付き |
| 入力方針 | フォームを拡張し全項目入力可能に（必須は氏名・担当者のみ） |
| 生成タイミング | 一括生成（3帳票をPromise.allで並列生成） |
| 確認フロー | Step1入力 → Step2アセスメント確認・編集 → Step3課題分析確認・編集 → Step4ケアプラン+PDF |
| PDF出力 | jsPDFクライアントサイド生成（NotoSansJP埋め込み）、個別+一括ダウンロード |
| 既存機能 | 変更最小。page.tsxをトップページ化、既存フォームは/quickへ移動 |
| API | `/api/assessment/generate` を新設 |
| モデル | gemini-2.5-flash（既存と同じ） |

## ルーティング・ページ構成

```
/                 トップページ（モード選択）
/quick            既存の簡易記録生成（現在のpage.tsxをほぼそのまま移動）
/assessment       ケアプラン作成フロー（新規）
```

### トップページ (`/`)
「簡易記録生成」と「ケアプラン作成」の2つのカードを表示。それぞれの説明と遷移リンク。

### `/quick`
既存の CareRecordForm / FlowIndicator / GeneratedDocuments をそのまま利用。API も `/api/generate` をそのまま利用。

### `/assessment`
新しい4ステップフロー。Step1: 入力（アコーディオン形式） → Step2: アセスメントシート確認・編集 → Step3: 課題分析シート確認・編集 → Step4: ケアプラン・全帳票出力。API は `/api/assessment/generate` を新設。

## 入力フォーム（アセスメント用）

アコーディオン形式で以下7セクションに分割。フォーム上部に「サンプルデータを入力」ボタンを配置。

### セクション1: 基本情報（既存項目 + 拡張）
- 利用者名*、生年月日、年齢、性別
- 要介護度、認定有効期間
- 家族構成・主介護者
- 担当者名*、記録日

### セクション2: 医療・健康
- 主な疾患・既往歴（既存）
- バイタルサイン（既存: 血圧/体温/SpO2/脈拍）
- 服薬状況
- 主治医・医療機関

### セクション3: ADL（日常生活動作）
食事 / 排泄 / 入浴 / 移動 / 着替え / 整容 の各項目を「自立 / 一部介助 / 全介助」の3段階セレクトで入力。

### セクション4: IADL（手段的日常生活動作）
調理 / 洗濯 / 掃除 / 買物 / 金銭管理 / 服薬管理 / 電話 / 交通手段 の各項目を「自立 / 一部介助 / 全介助」の3段階セレクトで入力。

### セクション5: 認知・コミュニケーション
- 認知症高齢者日常生活自立度（自立 / I / IIa / IIb / IIIa / IIIb / IV / M）
- 障害高齢者日常生活自立度（自立 / J1 / J2 / A1 / A2 / B1 / B2 / C1 / C2）
- コミュニケーション能力（自由記述）
- 問題行動（自由記述）

### セクション6: 生活環境・社会参加
- 居住環境（住宅タイプ、バリアフリー状況）
- 社会との関わり（自由記述）
- 現在利用しているサービス（自由記述）

### セクション7: 本人・家族の意向
- 主訴（自由記述）
- 本人の希望（既存）
- 家族の希望
- 特記事項・申し送り（既存）

必須は利用者名と担当者名のみ。未入力項目はAI生成時に「要確認」となる。

## 出力帳票

### アセスメントシート
厚労省23項目に沿った構造で出力。各項目はテキストエリアで編集可能。入力データから直接転記できる項目（氏名、バイタル等）はそのまま転記。AIが分析・補完する項目（ADL評価の詳細文、課題分析の理由等）はAI生成。

### 課題分析シート（課題整理総括表）
テーブル形式で出力。列: 課題（ニーズ）/ 現状 / 目標 / 背景・原因 / 優先順位（高/中/低）/ サービスの方向性。行の追加・削除・編集が可能。

### ケアプラン（居宅サービス計画書）
既存の簡易版より詳細な形式: 長期目標（6ヶ月）/ 短期目標（3ヶ月）/ サービス内容・種類 / 担当者 / 頻度 / 期間。

### PDF出力
各帳票に個別の「PDFダウンロード」ボタン。Step4に「全帳票一括ダウンロード」ボタン。jsPDFで日本語フォント対応（NotoSansJP埋め込み）。

## API・データフロー

### エンドポイント
`POST /api/assessment/generate` — 入力データを受け取り、3帳票を一括生成して返す。

### データの流れ
```
入力フォーム送信
  → /api/assessment/generate (3帳票並列生成 via Promise.all)
  → クライアントに構造化データ返却
  → Step2: アセスメントシート表示・編集
  → Step3: 課題分析シート表示・編集
  → Step4: ケアプラン表示・編集 + PDF出力
```

編集はクライアントサイドの state で管理。API再呼び出しはしない。

### Gemini呼び出し
- 3帳票を `Promise.all` で並列生成（既存パターンと同じ）
- 各プロンプトにJSON形式での出力を指定し、構造化データとして受け取る
- モデル: `gemini-2.5-flash`
- システムインストラクション: 既存と同じ「介護福祉の専門家」ロール

## ファイル構成

```
src/
  app/
    page.tsx                          # トップ（モード選択）★変更
    quick/page.tsx                    # 既存の簡易記録生成 ★新規（既存page.tsxの内容を移動）
    assessment/page.tsx               # ケアプラン作成フロー ★新規
    api/
      generate/route.ts               # 既存API（変更なし）
      assessment/generate/route.ts    # 新規API ★新規
  components/
    # 既存（変更なし）
    CareRecordForm.tsx
    FlowIndicator.tsx
    GeneratedDocuments.tsx
    # 新規
    ModeSelector.tsx                  # トップのモード選択カード ★新規
    assessment/
      AssessmentFlowIndicator.tsx     # 4ステップ表示 ★新規
      AssessmentForm.tsx              # アコーディオン入力フォーム ★新規
      AssessmentSheet.tsx             # アセスメントシート表示・編集 ★新規
      IssueAnalysis.tsx               # 課題分析シート表示・編集 ★新規
      DetailedCarePlan.tsx            # 詳細ケアプラン表示・編集 ★新規
      PdfExport.tsx                   # PDF出力ボタン群 ★新規
  lib/
    prompts.ts                        # 既存（変更なし）
    assessment-prompts.ts             # 新規プロンプト ★新規
    gemini.ts                         # 既存（変更なし）
    assessment-gemini.ts              # 新規Gemini呼び出し ★新規
    pdf.ts                            # PDF生成ロジック ★新規
    sample-data.ts                    # サンプルデータ ★新規
  types/
    index.ts                          # 既存型（変更なし）
    assessment.ts                     # 新規型定義 ★新規
```

## 型定義 (src/types/assessment.ts)

```typescript
import { CareLevel, Vitals } from '.'

// ADL/IADL の評価レベル
export type IndependenceLevel = '自立' | '一部介助' | '全介助' | ''

// 認知症高齢者日常生活自立度
export type DementiaLevel = '' | '自立' | 'I' | 'IIa' | 'IIb' | 'IIIa' | 'IIIb' | 'IV' | 'M'

// 障害高齢者日常生活自立度
export type DisabilityLevel = '' | '自立' | 'J1' | 'J2' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

// 入力データ
export interface AssessmentInput {
  // 基本情報
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

  // 医療・健康
  disease: string
  vitals: Vitals
  medications: string
  primary_doctor: string

  // ADL
  adl: {
    eating: IndependenceLevel
    toileting: IndependenceLevel
    bathing: IndependenceLevel
    mobility: IndependenceLevel
    dressing: IndependenceLevel
    grooming: IndependenceLevel
  }

  // IADL
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

  // 認知・コミュニケーション
  dementia_level: DementiaLevel
  disability_level: DisabilityLevel
  communication: string
  problematic_behavior: string

  // 生活環境・社会参加
  housing_type: string
  barrier_free: string
  social_participation: string
  current_services: string

  // 本人・家族の意向
  chief_complaint: string
  resident_wish: string
  family_wish: string
  special_notes: string
}

// アセスメントシート（23項目）
export interface AssessmentSheet {
  items: { label: string; content: string }[]
}

// 課題分析シートの行
export interface IssueAnalysisRow {
  need: string
  current_status: string
  goal: string
  background: string
  priority: '高' | '中' | '低'
  service_direction: string
}

// 詳細ケアプラン
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

// APIレスポンス
export interface AssessmentGenerateResponse {
  assessment_sheet: AssessmentSheet
  issue_analysis: IssueAnalysisRow[]
  care_plan: DetailedCarePlan
}
```

## 新規パッケージ

- `jspdf` — PDF生成
- `jspdf-autotable` — テーブル形式のPDF出力（課題分析シート用）

日本語フォント（NotoSansJP-Regular）はGoogle Fontsからttfをダウンロードし、Base64エンコードして `src/lib/fonts/` に `.ts` ファイルとして配置する。jsPDFの `addFileToVFS` / `addFont` で登録して使用する。
