'use client'

interface FlowIndicatorProps {
  currentStep: number
}

const steps = [
  { label: '入力', description: '介護記録を入力' },
  { label: 'AI生成中', description: 'ドキュメントを自動生成' },
  { label: '完成', description: '生成結果を確認' },
]

export default function FlowIndicator({ currentStep }: FlowIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                index < currentStep
                  ? 'bg-blue-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`text-xs mt-1 ${
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 mb-5 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
