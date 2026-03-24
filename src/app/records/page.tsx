import Link from 'next/link'
import { Button } from '@/components/ui/button'
import RecordCard from '@/components/RecordCard'
import { getCareRecords } from '@/lib/supabase/queries'
import { CareRecord } from '@/types'

export const dynamic = 'force-dynamic'

export default async function RecordsPage() {
  let records: CareRecord[] = []
  let error: string | null = null

  try {
    records = await getCareRecords()
  } catch (e) {
    error = e instanceof Error ? e.message : '記録の取得に失敗しました'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">記録一覧</h1>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">新規記録</Button>
          </Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {records.length === 0 && !error ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-4">まだ記録がありません</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">最初の記録を入力する</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
