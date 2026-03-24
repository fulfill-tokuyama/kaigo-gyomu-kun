'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GenerateResponse } from '@/types'

interface GeneratedDocumentsProps {
  documents: GenerateResponse
}

const docConfig = [
  { key: 'formal_record' as const, title: '介護記録（正式文書）', color: 'border-blue-400' },
  { key: 'care_plan' as const, title: 'ケアプラン', color: 'border-green-400' },
  { key: 'work_report' as const, title: '作業報告書', color: 'border-orange-400' },
]

export default function GeneratedDocuments({ documents }: GeneratedDocumentsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="space-y-4">
      {docConfig.map(({ key, title, color }) => (
        <Card key={key} className={`border-l-4 ${color}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(documents[key], key)}
            >
              {copiedKey === key ? 'コピー済み' : 'コピー'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {documents[key]}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
