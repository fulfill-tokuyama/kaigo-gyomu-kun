import CareRecordForm from '@/components/CareRecordForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-700">介護業務くん</h1>
        </div>
      </header>
      <div className="px-4 py-8">
        <CareRecordForm />
      </div>
    </main>
  )
}
