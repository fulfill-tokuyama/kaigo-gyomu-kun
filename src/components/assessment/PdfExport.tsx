'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AssessmentSheet, IssueAnalysisRow, DetailedCarePlan } from '@/types/assessment'
import {
  downloadAssessmentSheetPdf,
  downloadIssueAnalysisPdf,
  downloadCarePlanPdf,
  downloadAllPdf,
} from '@/lib/pdf'
import { Download } from 'lucide-react'

interface PdfExportProps {
  sheet: AssessmentSheet
  issues: IssueAnalysisRow[]
  plan: DetailedCarePlan
}

export default function PdfExport({ sheet, issues, plan }: PdfExportProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handle = async (key: string, fn: () => Promise<void>) => {
    setLoading(key)
    try {
      await fn()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">PDF出力</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handle('assessment', () => downloadAssessmentSheetPdf(sheet))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'assessment' ? '生成中...' : 'アセスメントシート'}
        </Button>
        <Button
          variant="outline"
          onClick={() => handle('issue', () => downloadIssueAnalysisPdf(issues))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'issue' ? '生成中...' : '課題分析シート'}
        </Button>
        <Button
          variant="outline"
          onClick={() => handle('plan', () => downloadCarePlanPdf(plan))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'plan' ? '生成中...' : 'ケアプラン'}
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handle('all', () => downloadAllPdf(sheet, issues, plan))}
          disabled={loading !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading === 'all' ? '生成中...' : '全帳票を一括ダウンロード'}
        </Button>
      </div>
    </div>
  )
}
