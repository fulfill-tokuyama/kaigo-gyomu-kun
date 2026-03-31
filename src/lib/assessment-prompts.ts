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
