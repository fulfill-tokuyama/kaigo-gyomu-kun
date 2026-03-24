import Anthropic from '@anthropic-ai/sdk'
import { CareRecord, GenerateResponse } from '@/types'
import {
  buildFormalRecordPrompt,
  buildCarePlanPrompt,
  buildWorkReportPrompt,
} from './prompts'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function callClaude(prompt: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: 'あなたは介護福祉の専門家です。実際の現場で使えるプロフェッショナルな日本語文書を作成します。',
    messages: [{ role: 'user', content: prompt }],
  })
  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function generateAllDocuments(
  record: CareRecord
): Promise<GenerateResponse> {
  const [formal_record, care_plan, work_report] = await Promise.all([
    callClaude(buildFormalRecordPrompt(record)),
    callClaude(buildCarePlanPrompt(record)),
    callClaude(buildWorkReportPrompt(record)),
  ])

  return { formal_record, care_plan, work_report }
}
