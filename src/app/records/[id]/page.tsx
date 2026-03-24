import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCareRecordById, getGeneratedDocuments } from '@/lib/supabase/queries'
import CopyButton from './CopyButton'

export const dynamic = 'force-dynamic'

const docLabels: Record<string, { title: string; color: string }> = {
  formal_record: { title: '介護記録（正式文書）', color: 'border-blue-400' },
  care_plan: { title: 'ケアプラン', color: 'border-green-400' },
  work_report: { title: '作業報告書', color: 'border-orange-400' },
}

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let record
  let documents

  try {
    record = await getCareRecordById(id)
    documents = await getGeneratedDocuments(id)
  } catch {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">記録詳細</h1>
          <Link href="/records" className="text-sm text-blue-600 hover:underline">
            ← 一覧に戻る
          </Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* 記録情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">介護記録</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500">利用者名</span>
                <p className="font-medium">{record.resident_name}</p>
              </div>
              <div>
                <span className="text-gray-500">記録日</span>
                <p className="font-medium">{record.record_date}</p>
              </div>
              <div>
                <span className="text-gray-500">担当者</span>
                <p className="font-medium">{record.staff_name}</p>
              </div>
              <div>
                <span className="text-gray-500">要介護度</span>
                <p className="font-medium">{record.care_level || '未設定'}</p>
              </div>
              <div>
                <span className="text-gray-500">疾患</span>
                <p className="font-medium">{record.disease || 'なし'}</p>
              </div>
            </div>

            {record.vitals && Object.keys(record.vitals).length > 0 && (
              <div>
                <span className="text-gray-500">バイタル</span>
                <div className="flex gap-4 mt-1">
                  {record.vitals.bp && <span>血圧: {record.vitals.bp}</span>}
                  {record.vitals.temp && <span>体温: {record.vitals.temp}℃</span>}
                  {record.vitals.spo2 && <span>SpO2: {record.vitals.spo2}%</span>}
                  {record.vitals.pulse && <span>脈拍: {record.vitals.pulse}bpm</span>}
                </div>
              </div>
            )}

            {record.care_types && record.care_types.length > 0 && (
              <div>
                <span className="text-gray-500">実施ケア</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {record.care_types.map((type) => (
                    <Badge key={type} variant="secondary">{type}</Badge>
                  ))}
                </div>
              </div>
            )}

            {record.condition && (
              <div>
                <span className="text-gray-500">利用者の様子</span>
                <p>{record.condition}</p>
              </div>
            )}
            {record.wish && (
              <div>
                <span className="text-gray-500">本人・家族の希望</span>
                <p>{record.wish}</p>
              </div>
            )}
            {record.note && (
              <div>
                <span className="text-gray-500">特記事項</span>
                <p>{record.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 生成ドキュメント */}
        <h2 className="text-xl font-bold text-gray-800">AI生成ドキュメント</h2>
        {documents.length === 0 ? (
          <p className="text-gray-500">生成ドキュメントはありません</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => {
              const config = docLabels[doc.doc_type] || { title: doc.doc_type, color: 'border-gray-400' }
              return (
                <Card key={doc.id} className={`border-l-4 ${config.color}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{config.title}</CardTitle>
                    <CopyButton text={doc.content} />
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {doc.content}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="flex gap-4">
          <Link href="/records" className="flex-1">
            <Button variant="outline" className="w-full">← 一覧に戻る</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">新しい記録を入力する</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
