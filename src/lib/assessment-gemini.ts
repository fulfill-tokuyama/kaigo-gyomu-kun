import { GoogleGenerativeAI } from '@google/generative-ai'
import { AssessmentInput, AssessmentGenerateResponse, AssessmentSheet, IssueAnalysisRow, DetailedCarePlan } from '@/types/assessment'
import {
  buildAssessmentSheetPrompt,
  buildIssueAnalysisPrompt,
  buildDetailedCarePlanPrompt,
} from './assessment-prompts'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: 'あなたは介護福祉の専門家です。指定されたJSON形式で正確に出力してください。JSONのみを出力し、他のテキストは含めないでください。',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})

async function callGeminiJSON<T>(prompt: string): Promise<T> {
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text) as T
}

export async function generateAssessmentDocuments(
  input: AssessmentInput
): Promise<AssessmentGenerateResponse> {
  const [assessment_sheet, issue_analysis, care_plan] = await Promise.all([
    callGeminiJSON<AssessmentSheet>(buildAssessmentSheetPrompt(input)),
    callGeminiJSON<IssueAnalysisRow[]>(buildIssueAnalysisPrompt(input)),
    callGeminiJSON<DetailedCarePlan>(buildDetailedCarePlanPrompt(input)),
  ])

  return { assessment_sheet, issue_analysis, care_plan }
}
