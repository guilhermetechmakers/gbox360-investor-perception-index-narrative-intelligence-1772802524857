import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface TopicTagProps {
  topic: string
  className?: string
}

export function TopicTag({ topic, className }: TopicTagProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full border-cardPastel-sage/60 bg-cardPastel-sage/30 px-2 py-0.5 text-xs font-medium text-foreground',
        className
      )}
    >
      {topic}
    </Badge>
  )
}
