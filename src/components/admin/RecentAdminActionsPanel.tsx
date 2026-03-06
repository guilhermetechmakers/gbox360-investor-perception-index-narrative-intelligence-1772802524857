import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AuditLogCard } from './AuditLogCard'
import { useAuditLogs } from '@/hooks/use-admin'
import { FileText } from 'lucide-react'

export function RecentAdminActionsPanel() {
  const { data: logs = [], isLoading } = useAuditLogs()
  const safeLogs = Array.isArray(logs) ? logs.slice(0, 5) : []

  return (
    <Card className="rounded-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif text-lg">Recent admin actions</CardTitle>
        <Link to="/admin/users">
          <Button variant="ghost" size="sm">
            View audit log
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : safeLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">No admin actions yet</p>
              <p className="text-sm text-muted-foreground">
                Platform events and admin actions will appear here when they occur.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {safeLogs.map((log) => (
              <AuditLogCard key={log?.id ?? ''} log={log} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
