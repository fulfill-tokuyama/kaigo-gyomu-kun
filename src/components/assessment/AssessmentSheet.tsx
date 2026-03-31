'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AssessmentSheet as AssessmentSheetType } from '@/types/assessment'

interface AssessmentSheetProps {
  sheet: AssessmentSheetType
  onChange: (sheet: AssessmentSheetType) => void
}

export default function AssessmentSheet({ sheet, onChange }: AssessmentSheetProps) {
  const updateItem = (index: number, content: string) => {
    const newItems = [...sheet.items]
    newItems[index] = { ...newItems[index], content }
    onChange({ items: newItems })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-700">アセスメントシート（課題分析標準項目）</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sheet.items.map((item, index) => (
          <div key={index}>
            <Label className="text-sm font-semibold">{item.label}</Label>
            <Textarea
              value={item.content}
              onChange={(e) => updateItem(index, e.target.value)}
              rows={item.content.length > 100 ? 4 : 2}
              className={item.content === '要確認' ? 'border-orange-300 bg-orange-50' : ''}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
