'use client'

interface AssessmentFlowIndicatorProps {
  currentStep: number
}

const steps = [
  { label: '入力', description: '情報を入力' },
  { label: 'AI生成中', description: '帳票を自動生成' },
  { label: 'アセスメント', description: 'シートを確認・編集' },
  { label: '課題分析', description: 'シートを確認・編集' },
  { label: 'ケアプラン', description: '出力・PDF' },
]

export default function AssessmentFlowIndicator({ currentStep }: AssessmentFlowIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                index < currentStep
                  ? 'bg-blue-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? '\u2713' : index + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center ${
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 mb-5 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
