import CareRecordForm from '@/components/CareRecordForm'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">介護業務実行くん</h1>
          <Link
            href="/records"
            className="text-sm text-blue-600 hover:underline"
          >
            記録一覧 →
          </Link>
        </div>
      </header>
      <div className="px-4 py-8">
        <CareRecordForm />
      </div>
    </main>
  )
}
