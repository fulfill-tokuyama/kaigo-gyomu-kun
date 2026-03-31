'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IssueAnalysisRow } from '@/types/assessment'
import { Plus, Trash2 } from 'lucide-react'

interface IssueAnalysisProps {
  rows: IssueAnalysisRow[]
  onChange: (rows: IssueAnalysisRow[]) => void
}

const PRIORITIES = ['高', '中', '低'] as const

const emptyRow: IssueAnalysisRow = {
  need: '',
  current_status: '',
  goal: '',
  background: '',
  priority: '中',
  service_direction: '',
}

export default function IssueAnalysis({ rows, onChange }: IssueAnalysisProps) {
  const updateRow = (index: number, field: keyof IssueAnalysisRow, value: string) => {
    const newRows = [...rows]
    newRows[index] = { ...newRows[index], [field]: value }
    onChange(newRows)
  }

  const addRow = () => {
    onChange([...rows, { ...emptyRow }])
  }

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-blue-700">課題分析シート（課題整理総括表）</CardTitle>
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="w-4 h-4 mr-1" />
          課題を追加
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {rows.map((row, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">課題 {index + 1}</span>
              {rows.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeRow(index)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500">課題（ニーズ）</label>
              <Input value={row.need} onChange={(e) => updateRow(index, 'need', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">現状</label>
                <Textarea value={row.current_status} onChange={(e) => updateRow(index, 'current_status', e.target.value)} rows={2} />
              </div>
              <div>
                <label className="text-xs text-gray-500">目標</label>
                <Textarea value={row.goal} onChange={(e) => updateRow(index, 'goal', e.target.value)} rows={2} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">背景・原因</label>
              <Textarea value={row.background} onChange={(e) => updateRow(index, 'background', e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">優先順位</label>
                <Select value={row.priority} onValueChange={(v) => updateRow(index, 'priority', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-500">サービスの方向性</label>
                <Input value={row.service_direction} onChange={(e) => updateRow(index, 'service_direction', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
