import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionHeader } from './SectionHeader'
import { Users, UserPlus } from 'lucide-react'
import type { EnterpriseSeats } from '@/types/profile'

export interface EnterpriseSeatsPanelProps {
  seats: EnterpriseSeats | null
  onInvite?: () => void
}

export function EnterpriseSeatsPanel({
  seats,
  onInvite,
}: EnterpriseSeatsPanelProps) {
  if (!seats || seats.plan === '') return null

  const usagePercent =
    seats.seatsAllocated > 0
      ? Math.round((seats.seatsUsed / seats.seatsAllocated) * 100)
      : 0

  return (
    <Card className="card-pastel rounded-card-lg border border-border/50 bg-card">
      <CardHeader>
        <SectionHeader
          title="Team seats"
          subtitle="Manage your enterprise plan and seat usage."
          helpText="Enterprise plans include allocated seats. Invite team members to use available seats."
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/50 bg-cardPastel-sand/30 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Seats used</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-semibold text-foreground">
              {seats.seatsUsed} / {seats.seatsAllocated}
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-cardPastel-sage/30 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm font-medium">Plan</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-semibold capitalize text-foreground">
              {seats.plan}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, usagePercent)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {usagePercent}% of seats in use
          </p>
        </div>

        {onInvite && seats.seatsUsed < seats.seatsAllocated && (
          <Button
            onClick={onInvite}
            variant="outline"
            className="rounded-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite team member
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
