import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface CompanyDetailIPIHeaderProps {
  companyId: string
  companyName: string
  ticker?: string
  sector?: string
  description?: string
  logoUrl?: string
  isLoading?: boolean
  className?: string
}

export function CompanyDetailIPIHeader({
  companyId,
  companyName,
  ticker,
  sector,
  description,
  logoUrl,
  isLoading = false,
  className,
}: CompanyDetailIPIHeaderProps) {
  const initials = (companyName ?? '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (isLoading) {
    return (
      <Card className={cn('rounded-card card-pastel overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'rounded-card card-pastel overflow-hidden bg-white border-border',
        className
      )}
      aria-labelledby={`company-header-${companyId}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Avatar
            className="h-16 w-16 shrink-0 rounded-xl border-2 border-border"
            aria-hidden
          >
            <AvatarImage src={logoUrl} alt="" />
            <AvatarFallback className="rounded-xl bg-muted text-lg font-semibold text-foreground">
              {initials || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1
              id={`company-header-${companyId}`}
              className="font-serif text-2xl font-bold text-foreground sm:text-3xl"
            >
              {companyName || 'Company'}
              {ticker && (
                <span className="ml-2 text-lg font-medium text-muted-foreground">
                  ({ticker})
                </span>
              )}
            </h1>
            {sector && (
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {sector}
              </p>
            )}
            {description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
