import { GoogleGenerativeAI } from '@google/generative-ai'
import { CareRecord, GenerateResponse } from '@/types'
import {
  buildFormalRecordPrompt,
  buildCarePlanPrompt,
  buildWorkReportPrompt,
} from './prompts'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: 'あなたは介護福祉の専門家です。実際の現場で使えるプロフェッショナルな日本語文書を作成します。',
})

async function callGemini(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function generateAllDocuments(
  record: CareRecord
): Promise<GenerateResponse> {
  const [formal_record, care_plan, work_report] = await Promise.all([
    callGemini(buildFormalRecordPrompt(record)),
    callGemini(buildCarePlanPrompt(record)),
    callGemini(buildWorkReportPrompt(record)),
  ])

  return { formal_record, care_plan, work_report }
}
