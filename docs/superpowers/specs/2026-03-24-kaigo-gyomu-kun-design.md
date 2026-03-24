# 介護業務実行くん — 設計仕様書

## 概要
介護福祉施設向け業務支援SaaS。スタッフが介護記録を入力すると、AIがケアプラン・作業報告書・正式介護記録を自動生成する。

## 技術スタック
- Next.js 14 (App Router) / TypeScript / Tailwind CSS / shadcn/ui
- Supabase (PostgreSQL + RLS) — 認証・DB
- Anthropic Claude API (claude-sonnet-4-20250514) — 文書生成

## データベース設計

### residents テーブル
| カラム | 型 | 備考 |
|--------|------|------|
| id | UUID (PK) | auto-generated |
| name | TEXT | NOT NULL |
| care_level | TEXT | 要介護度 |
| diseases | TEXT | 疾患 |
| created_at | TIMESTAMPTZ | auto |

### care_records テーブル
| カラム | 型 | 備考 |
|--------|------|------|
| id | UUID (PK) | auto-generated |
| resident_id | UUID (FK) | residents.id |
| resident_name | TEXT | NOT NULL |
| record_date | DATE | NOT NULL |
| staff_name | TEXT | NOT NULL |
| care_level | TEXT | |
| disease | TEXT | |
| vitals | JSONB | {bp, temp, spo2, pulse} |
| care_types | TEXT[] | ケア種別配列 |
| condition | TEXT | 利用者の様子 |
| wish | TEXT | 本人・家族の希望 |
| note | TEXT | 特記事項 |
| created_at | TIMESTAMPTZ | auto |

### generated_documents テーブル
| カラム | 型 | 備考 |
|--------|------|------|
| id | UUID (PK) | auto-generated |
| care_record_id | UUID (FK) | care_records.id |
| doc_type | TEXT | 'formal_record' / 'care_plan' / 'work_report' |
| content | TEXT | AI生成テキスト |
| created_at | TIMESTAMPTZ | auto |

RLS: 全テーブル有効化、初期は全ユーザー読み書き可（後日認証追加時に変更）

## 画面構成

### 1. トップページ (`/`) — 記録入力 + AI生成
3ステップUI:
1. **入力** — 基本情報、バイタル(4列グリッド)、ケアチェックボックス、テキストエリア群
2. **AI生成中** — ローディングスピナー
3. **完成** — 生成結果3ドキュメント表示(各コピーボタン付き)

### 2. 記録一覧 (`/records`)
- care_records を created_at 降順取得
- カード形式: 利用者名・記録日・担当者・ケアバッジ
- 詳細リンク → `/records/[id]`

### 3. 記録詳細 (`/records/[id]`)
- 記録全情報 + AI生成ドキュメント3件表示
- 各ドキュメントにコピーボタン

## API設計

### POST /api/generate
1. リクエストボディ: CareRecord JSON
2. care_records テーブルに保存
3. Claude API 3並列呼び出し（正式記録・ケアプラン・作業報告書）
4. generated_documents テーブルに3件保存
5. レスポンス: { record_id, formal_record, care_plan, work_report }

## Supabaseクライアント構成
- **サーバー用** (`lib/supabase/server.ts`): service role key使用、API Route内で使用
- **クライアント用** (`lib/supabase/client.ts`): anon key使用、ブラウザ側で使用

## AI生成仕様
- モデル: claude-sonnet-4-20250514
- System prompt: 介護福祉専門家ロール
- 3種類を Promise.all で並列生成
- 正式記録: 200-300字
- ケアプラン: 長期目標(6ヶ月) / 短期目標(3ヶ月) / サービス内容
- 作業報告書: 実施内容 / 状態 / 課題 / 申し送り

## デザイン要件
- 白ベース、アクセント青系（清潔感）
- shadcn/ui コンポーネント使用
- レスポンシブ対応
