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
