'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DetailedCarePlan as DetailedCarePlanType } from '@/types/assessment'
import { Plus, Trash2 } from 'lucide-react'

interface DetailedCarePlanProps {
  plan: DetailedCarePlanType
  onChange: (plan: DetailedCarePlanType) => void
}

export default function DetailedCarePlan({ plan, onChange }: DetailedCarePlanProps) {
  const updateGoal = (type: 'long_term_goals' | 'short_term_goals', index: number, value: string) => {
    const newGoals = [...plan[type]]
    newGoals[index] = value
    onChange({ ...plan, [type]: newGoals })
  }

  const addGoal = (type: 'long_term_goals' | 'short_term_goals') => {
    onChange({ ...plan, [type]: [...plan[type], ''] })
  }

  const removeGoal = (type: 'long_term_goals' | 'short_term_goals', index: number) => {
    onChange({ ...plan, [type]: plan[type].filter((_, i) => i !== index) })
  }

  const updateService = (index: number, field: keyof DetailedCarePlanType['services'][0], value: string) => {
    const newServices = [...plan.services]
    newServices[index] = { ...newServices[index], [field]: value }
    onChange({ ...plan, services: newServices })
  }

  const addService = () => {
    onChange({
      ...plan,
      services: [...plan.services, { content: '', type: '', provider: '', frequency: '', period: '' }],
    })
  }

  const removeService = (index: number) => {
    onChange({ ...plan, services: plan.services.filter((_, i) => i !== index) })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-700">ケアプラン（居宅サービス計画書）</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Long-term goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">長期目標（6ヶ月）</h3>
            <Button variant="outline" size="sm" onClick={() => addGoal('long_term_goals')}>
              <Plus className="w-4 h-4 mr-1" />追加
            </Button>
          </div>
          <div className="space-y-2">
            {plan.long_term_goals.map((goal, i) => (
              <div key={i} className="flex gap-2">
                <Textarea value={goal} onChange={(e) => updateGoal('long_term_goals', i, e.target.value)} rows={1} className="flex-1" />
                {plan.long_term_goals.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeGoal('long_term_goals', i)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Short-term goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">短期目標（3ヶ月）</h3>
            <Button variant="outline" size="sm" onClick={() => addGoal('short_term_goals')}>
              <Plus className="w-4 h-4 mr-1" />追加
            </Button>
          </div>
          <div className="space-y-2">
            {plan.short_term_goals.map((goal, i) => (
              <div key={i} className="flex gap-2">
                <Textarea value={goal} onChange={(e) => updateGoal('short_term_goals', i, e.target.value)} rows={1} className="flex-1" />
                {plan.short_term_goals.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeGoal('short_term_goals', i)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">サービス内容</h3>
            <Button variant="outline" size="sm" onClick={addService}>
              <Plus className="w-4 h-4 mr-1" />追加
            </Button>
          </div>
          <div className="space-y-4">
            {plan.services.map((svc, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">サービス {i + 1}</span>
                  {plan.services.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeService(i)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">内容</label>
                  <Textarea value={svc.content} onChange={(e) => updateService(i, 'content', e.target.value)} rows={2} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">種類</label>
                    <Input value={svc.type} onChange={(e) => updateService(i, 'type', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">担当者</label>
                    <Input value={svc.provider} onChange={(e) => updateService(i, 'provider', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">頻度</label>
                    <Input value={svc.frequency} onChange={(e) => updateService(i, 'frequency', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">期間</label>
                    <Input value={svc.period} onChange={(e) => updateService(i, 'period', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
