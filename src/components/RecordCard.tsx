import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CareRecord } from '@/types'

interface RecordCardProps {
  record: CareRecord
}

export default function RecordCard({ record }: RecordCardProps) {
  return (
    <Link href={`/records/${record.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{record.resident_name}</span>
            <span className="text-sm text-gray-500 font-normal">{record.record_date}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">担当: {record.staff_name}</p>
          <div className="flex flex-wrap gap-1">
            {record.care_types?.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
