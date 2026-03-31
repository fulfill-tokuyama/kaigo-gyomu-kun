import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { AssessmentSheet, IssueAnalysisRow, DetailedCarePlan } from '@/types/assessment'

let fontLoaded = false

async function loadFont(doc: jsPDF) {
  if (!fontLoaded) {
    try {
      const fontUrl = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf'
      const response = await fetch(fontUrl)
      if (!response.ok) throw new Error(`Font fetch failed: ${response.status}`)
      const buffer = await response.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      const chunkSize = 8192
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
      }
      const base64 = btoa(binary)
      doc.addFileToVFS('NotoSansJP.ttf', base64)
      doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal')
      fontLoaded = true
    } catch (e) {
      console.warn('Japanese font load failed, using fallback:', e)
    }
  } else {
    doc.addFileToVFS('NotoSansJP.ttf', '')
    doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal')
  }

  try {
    doc.setFont('NotoSansJP')
  } catch {
    // fallback to default font if NotoSansJP not available
  }
}

export async function generateAssessmentSheetPdf(sheet: AssessmentSheet): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('Assessment Sheet', 15, 20)

  let y = 30
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

  doc.save('assessment-sheet.pdf')
}

export async function generateIssueAnalysisPdf(rows: IssueAnalysisRow[]): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('Issue Analysis Sheet', 15, 20)

  const fontName = fontLoaded ? 'NotoSansJP' : 'helvetica'

  autoTable(doc, {
    startY: 28,
    head: [['Needs', 'Current Status', 'Goal', 'Background', 'Priority', 'Service Direction']],
    body: rows.map((r) => [r.need, r.current_status, r.goal, r.background, r.priority, r.service_direction]),
    styles: { font: fontName, fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], font: fontName },
    columnStyles: {
      0: { cellWidth: 40 },
      4: { cellWidth: 20, halign: 'center' as const },
    },
  })

  doc.save('issue-analysis.pdf')
}

export async function generateCarePlanPdf(plan: DetailedCarePlan): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await loadFont(doc)

  doc.setFontSize(16)
  doc.text('Care Plan', 15, 20)

  let y = 32
  doc.setFontSize(12)
  doc.text('Long-term Goals (6 months)', 15, y)
  y += 6
  doc.setFontSize(10)
  for (const goal of plan.long_term_goals) {
    const lines = doc.splitTextToSize(`- ${goal}`, 170)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 2
  }

  y += 4
  doc.setFontSize(12)
  doc.text('Short-term Goals (3 months)', 15, y)
  y += 6
  doc.setFontSize(10)
  for (const goal of plan.short_term_goals) {
    const lines = doc.splitTextToSize(`- ${goal}`, 170)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 2
  }

  y += 4
  doc.setFontSize(12)
  doc.text('Services', 15, y)
  y += 2

  const fontName = fontLoaded ? 'NotoSansJP' : 'helvetica'

  autoTable(doc, {
    startY: y,
    head: [['Content', 'Type', 'Provider', 'Frequency', 'Period']],
    body: plan.services.map((s) => [s.content, s.type, s.provider, s.frequency, s.period]),
    styles: { font: fontName, fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], font: fontName },
    columnStyles: { 0: { cellWidth: 60 } },
  })

  doc.save('care-plan.pdf')
}

export async function downloadAssessmentSheetPdf(sheet: AssessmentSheet) {
  await generateAssessmentSheetPdf(sheet)
}

export async function downloadIssueAnalysisPdf(rows: IssueAnalysisRow[]) {
  await generateIssueAnalysisPdf(rows)
}

export async function downloadCarePlanPdf(plan: DetailedCarePlan) {
  await generateCarePlanPdf(plan)
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
