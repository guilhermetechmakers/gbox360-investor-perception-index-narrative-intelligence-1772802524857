import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AuditLogCard } from './AuditLogCard'
import { useAuditLogs, useAdminUsers } from '@/hooks/use-admin'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, subDays } from 'date-fns'

const ACTION_TYPES: { value: string; label: string }[] = [
  { value: 'all', label: 'All actions' },
  { value: 'signin', label: 'Sign in' },
  { value: 'role_change', label: 'Role change' },
  { value: 'deactivate', label: 'Deactivate' },
  { value: 'reactivate', label: 'Reactivate' },
  { value: 'invite', label: 'Invite' },
  { value: 'user.invited', label: 'User invited' },
  { value: 'seat.adjusted', label: 'Seat adjusted' },
  { value: 'ingestion.replay', label: 'Ingestion replay' },
]

const PAGE_SIZE = 10

export function AuditLogViewer() {
  const [actionType, setActionType] = useState<string>('all')
  const [userId, setUserId] = useState<string>('')
  const [from, setFrom] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [to, setTo] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [offset, setOffset] = useState(0)

  const { data: usersResponse } = useAdminUsers()
  const safeUsers = Array.isArray((usersResponse as { data?: unknown[] })?.data)
    ? (usersResponse as { data: unknown[] }).data
    : []

  const { data, isLoading } = useAuditLogs({
    actionType: actionType && actionType !== 'all' ? actionType : undefined,
    userId: userId || undefined,
    from: from || undefined,
    to: to || undefined,
    limit: PAGE_SIZE,
    offset,
  })

  const logs = Array.isArray(data?.data) ? data.data : []
  const count = typeof data?.count === 'number' ? data.count : 0
  const totalPages = Math.ceil(count / PAGE_SIZE)
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1
  const hasNext = offset + PAGE_SIZE < count
  const hasPrev = offset > 0

  const handleNext = useCallback(() => {
    if (hasNext) setOffset((o) => o + PAGE_SIZE)
  }, [hasNext])

  const handlePrev = useCallback(() => {
    if (hasPrev) setOffset((o) => Math.max(0, o - PAGE_SIZE))
  }, [hasPrev])

  return (
    <Card className="rounded-card">
      <CardHeader>
        <CardTitle className="font-serif text-lg">Audit log</CardTitle>
        <p className="text-sm text-muted-foreground">
          Filter by action type, user, and date range. Entries are read-only.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex-1 space-y-1 sm:min-w-[140px]">
            <label htmlFor="audit-action" className="text-xs font-medium text-muted-foreground">
              Action type
            </label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger id="audit-action" className="rounded-lg">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                {ACTION_TYPES.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1 sm:min-w-[180px]">
            <label htmlFor="audit-user" className="text-xs font-medium text-muted-foreground">
              User
            </label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger id="audit-user" className="rounded-lg">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All users</SelectItem>
                {(safeUsers as { id?: string; email?: string }[]).map((u) => (
                  <SelectItem key={u?.id ?? ''} value={u?.id ?? ''}>
                    {u?.email ?? '—'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="space-y-1">
              <label htmlFor="audit-from" className="text-xs font-medium text-muted-foreground">
                From
              </label>
              <Input
                id="audit-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="audit-to" className="text-xs font-medium text-muted-foreground">
                To
              </label>
              <Input
                id="audit-to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/40" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              <Filter className="h-6 w-6" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">No audit entries found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting filters or date range. Admin actions will appear here when they occur.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {logs.map((log) => (
                <AuditLogCard key={log?.id ?? ''} log={log} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} · {count} total
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={!hasNext}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
