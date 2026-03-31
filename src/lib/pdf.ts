import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { AssessmentSheet, IssueAnalysisRow, DetailedCarePlan } from '@/types/assessment'

async function loadFont(doc: jsPDF) {
  const fontUrl = 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/Variable/TTF/Subset/NotoSansCJKjp-VF.ttf'
  const response = await fetch(fontUrl)
  const buffer = await response.arrayBuffer()
  const base64 = btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  doc.addFileToVFS('NotoSansJP.ttf', base64)
  doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal')
  doc.setFont('NotoSansJP')
}

export async function generateAssessmentSheetPdf(sheet: AssessmentSheet): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('アセスメントシート（課題分析標準項目）', 15, 20)

  let y = 30
  doc.setFontSize(10)
  for (const item of sheet.items) {
    if (y > 270) {
      doc.addPage()
      y = 15
    }
    doc.setFontSize(11)
    doc.text(item.label, 15, y)
    y += 5
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(item.content, 170)
    doc.text(lines, 20, y)
    y += lines.length * 4.5 + 4
  }

  return doc.output('blob')
}

export async function generateIssueAnalysisPdf(rows: IssueAnalysisRow[]): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('課題分析シート（課題整理総括表）', 15, 20)

  autoTable(doc, {
    startY: 28,
    head: [['課題（ニーズ）', '現状', '目標', '背景・原因', '優先順位', 'サービスの方向性']],
    body: rows.map((r) => [r.need, r.current_status, r.goal, r.background, r.priority, r.service_direction]),
    styles: { font: 'NotoSansJP', fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], font: 'NotoSansJP' },
    columnStyles: {
      0: { cellWidth: 40 },
      4: { cellWidth: 20, halign: 'center' },
    },
  })

  return doc.output('blob')
}

export async function generateCarePlanPdf(plan: DetailedCarePlan): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('居宅サービス計画書（ケアプラン）', 15, 20)

  let y = 32
  doc.setFontSize(12)
  doc.text('長期目標（6ヶ月）', 15, y)
  y += 6
  doc.setFontSize(10)
  for (const goal of plan.long_term_goals) {
    const lines = doc.splitTextToSize(`- ${goal}`, 170)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 2
  }

  y += 4
  doc.setFontSize(12)
  doc.text('短期目標（3ヶ月）', 15, y)
  y += 6
  doc.setFontSize(10)
  for (const goal of plan.short_term_goals) {
    const lines = doc.splitTextToSize(`- ${goal}`, 170)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 2
  }

  y += 4
  doc.setFontSize(12)
  doc.text('サービス内容', 15, y)
  y += 2

  autoTable(doc, {
    startY: y,
    head: [['内容', '種類', '担当者', '頻度', '期間']],
    body: plan.services.map((s) => [s.content, s.type, s.provider, s.frequency, s.period]),
    styles: { font: 'NotoSansJP', fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], font: 'NotoSansJP' },
    columnStyles: { 0: { cellWidth: 60 } },
  })

  return doc.output('blob')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadAssessmentSheetPdf(sheet: AssessmentSheet) {
  const blob = await generateAssessmentSheetPdf(sheet)
  downloadBlob(blob, 'assessment-sheet.pdf')
}

export async function downloadIssueAnalysisPdf(rows: IssueAnalysisRow[]) {
  const blob = await generateIssueAnalysisPdf(rows)
  downloadBlob(blob, 'issue-analysis.pdf')
}

export async function downloadCarePlanPdf(plan: DetailedCarePlan) {
  const blob = await generateCarePlanPdf(plan)
  downloadBlob(blob, 'care-plan.pdf')
}

export async function downloadAllPdf(
  sheet: AssessmentSheet,
  rows: IssueAnalysisRow[],
  plan: DetailedCarePlan
) {
  await downloadAssessmentSheetPdf(sheet)
  await downloadIssueAnalysisPdf(rows)
  await downloadCarePlanPdf(plan)
}
