import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProvisionalWeightBadgeProps {
  className?: string
}

const TOOLTIP_TEXT =
  'IPI weights are provisional: Narrative 40%, Credibility 40%, Risk 20%. These may be overridden by admin in Settings. Methodology is documented in exports.'

export function ProvisionalWeightBadge({ className }: ProvisionalWeightBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'gap-1 rounded-full border-muted-foreground/30 bg-muted/30 px-2 py-0.5 text-xs font-normal',
              className
            )}
            aria-label="Provisional weights info"
          >
            <Info className="h-3 w-3" />
            Provisional weights
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>{TOOLTIP_TEXT}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
