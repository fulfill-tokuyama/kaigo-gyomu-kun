import { CareRecord } from '@/types'

function buildContext(record: CareRecord): string {
  const vitals = [
    record.vitals.bp && `血圧${record.vitals.bp}`,
    record.vitals.temp && `体温${record.vitals.temp}`,
    record.vitals.spo2 && `SpO2 ${record.vitals.spo2}`,
    record.vitals.pulse && `脈拍${record.vitals.pulse}`,
  ].filter(Boolean).join('、')

  return `【利用者】${record.resident_name}
【記録日】${record.record_date}
【担当者】${record.staff_name}
【要介護度】${record.care_level || '未設定'}
【疾患・既往歴】${record.disease || 'なし'}
【バイタル】${vitals || '未計測'}
【実施ケア】${record.care_types.join('、') || 'なし'}
【利用者の様子】${record.condition || 'なし'}
【本人・家族の希望】${record.wish || 'なし'}
【特記事項・申し送り】${record.note || 'なし'}`
}

export function buildFormalRecordPrompt(record: CareRecord): string {
  return `あなたは介護施設のベテランケアワーカーです。
以下の介護記録メモをもとに、正式な介護記録文書を200〜300字で作成してください。
専門的かつ読みやすく、実際の現場で使える文体で書いてください。

${buildContext(record)}`
}

export function buildCarePlanPrompt(record: CareRecord): string {
  return `あなたは経験豊富なケアマネージャーです。
以下の介護記録をもとに、居宅サービス計画書（ケアプラン）の文案を作成してください。

【出力形式】
■ 長期目標（6ヶ月）
■ 短期目標（3ヶ月）
■ サービス内容・留意事項

${buildContext(record)}`
}

export function buildWorkReportPrompt(record: CareRecord): string {
  return `あなたは介護施設の担当者です。
以下の介護記録をもとに、作業報告書を作成してください。

【出力形式】
■ 実施内容
■ 利用者の状態
■ 課題・気になる点
■ 申し送り事項

${buildContext(record)}`
}
