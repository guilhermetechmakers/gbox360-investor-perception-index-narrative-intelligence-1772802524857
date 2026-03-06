import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, MoreHorizontal, Pause, Play, Pencil, Trash2, Plus } from 'lucide-react'
import type { ScheduledExport } from '@/types/admin'
import { format } from 'date-fns'

const CADENCE_OPTIONS = ['daily', 'weekly', 'monthly'] as const
const TIMEFRAME_OPTIONS = ['last_7_days', 'last_30_days', 'last_90_days'] as const
const FORMAT_OPTIONS = ['CSV', 'PDF'] as const
const METRIC_OPTIONS = ['mau', 'throughput', 'adoption'] as const

export interface ScheduledReportsPanelProps {
  reports: ScheduledExport[]
  isLoading?: boolean
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onEdit?: (report: ScheduledExport) => void
  onDelete?: (id: string) => void
  onCreate?: (payload: Omit<ScheduledExport, 'id' | 'lastRun' | 'nextRun' | 'status'>) => void
  onUpdate?: (id: string, payload: Partial<ScheduledExport>) => void
}

export function ScheduledReportsPanel({
  reports = [],
  isLoading = false,
  onPause,
  onResume,
  onEdit,
  onDelete,
  onCreate,
  onUpdate,
}: ScheduledReportsPanelProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editReport, setEditReport] = useState<ScheduledExport | null>(null)

  const safeReports = Array.isArray(reports) ? reports : []

  const handleDelete = (id: string) => {
    onDelete?.(id)
    setDeleteId(null)
  }

  const openEdit = (report: ScheduledExport) => {
    if (onUpdate) {
      setEditReport(report)
    } else {
      onEdit?.(report)
    }
  }

  return (
    <>
      <Card className="rounded-card shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden />
              Scheduled reports
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage recurring exports for leadership reviews.
            </p>
          </div>
          {onCreate && (
            <Button
              size="sm"
              className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
            <Table aria-label="Scheduled reports">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Cadence</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Last run</TableHead>
                  <TableHead>Next run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeReports.length === 0 ? (
                <TableEmpty
                  colSpan={7}
                  message="No scheduled reports"
                  description="Create a scheduled report to automate exports."
                  actionLabel={onCreate ? 'Create report' : undefined}
                  onAction={onCreate ? () => setCreateOpen(true) : undefined}
                />
                ) : (
                  safeReports.map((report) => (
                    <TableRow key={report?.id ?? ''}>
                      <TableCell className="font-medium">
                        {report?.name ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground capitalize">
                        {report?.cadence ?? '—'}
                      </TableCell>
                      <TableCell>{report?.format ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {report?.lastRun
                          ? format(new Date(report.lastRun), 'MMM d, yyyy HH:mm')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {report?.nextRun
                          ? format(new Date(report.nextRun), 'MMM d, yyyy HH:mm')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report?.status === 'active' ? 'success' : 'secondary'
                          }
                        >
                          {report?.status ?? '—'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Actions"
                              className="rounded-lg"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {report?.status === 'active' ? (
                              <DropdownMenuItem
                                onClick={() => onPause?.(report?.id ?? '')}
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => onResume?.(report?.id ?? '')}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => openEdit(report as ScheduledExport)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(report?.id ?? '')}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scheduled report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop the recurring export. You can create a new one later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {onCreate && (
        <CreateScheduledReportDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={(payload) => {
            onCreate(payload)
            setCreateOpen(false)
          }}
        />
      )}

      {editReport && onUpdate && (
        <EditScheduledReportDialog
          key={editReport.id}
          report={editReport}
          open={!!editReport}
          onOpenChange={(open) => !open && setEditReport(null)}
          onSubmit={(payload) => {
            onUpdate(editReport.id, payload)
            setEditReport(null)
          }}
        />
      )}
    </>
  )
}

function CreateScheduledReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (p: Omit<ScheduledExport, 'id' | 'lastRun' | 'nextRun' | 'status'>) => void
}) {
  const [name, setName] = useState('')
  const [cadence, setCadence] = useState<ScheduledExport['cadence']>('weekly')
  const [timeframe, setTimeframe] = useState('last_30_days')
  const [format, setFormat] = useState<ScheduledExport['format']>('PDF')
  const [metrics, setMetrics] = useState<Set<string>>(new Set(['mau', 'throughput']))

  const toggleMetric = (m: string) => {
    setMetrics((prev) => {
      const next = new Set(prev)
      if (next.has(m)) next.delete(m)
      else next.add(m)
      return next
    })
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    if (metrics.size === 0) return
    onSubmit({
      name: name.trim(),
      cadence,
      timeframe,
      format,
      metrics: Array.from(metrics),
    })
    setName('')
    setCadence('weekly')
    setTimeframe('last_30_days')
    setFormat('PDF')
    setMetrics(new Set(['mau', 'throughput']))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-card max-w-md">
        <DialogHeader>
          <DialogTitle>Create scheduled report</DialogTitle>
          <DialogDescription>
            Define a recurring export for leadership reviews.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">Name</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekly leadership report"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>Cadence</Label>
            <Select value={cadence} onValueChange={(v) => setCadence(v as ScheduledExport['cadence'])}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CADENCE_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAME_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ScheduledExport['format'])}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Metrics</Label>
            <div className="flex flex-wrap gap-4">
              {METRIC_OPTIONS.map((m) => (
                <div key={m} className="flex items-center space-x-2">
                  <Checkbox
                    id={`create-metric-${m}`}
                    checked={metrics.has(m)}
                    onCheckedChange={() => toggleMetric(m)}
                    aria-label={`Include ${m}`}
                  />
                  <Label htmlFor={`create-metric-${m}`} className="text-sm font-normal cursor-pointer capitalize">
                    {m}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || metrics.size === 0}
            className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditScheduledReportDialog({
  report,
  open,
  onOpenChange,
  onSubmit,
}: {
  report: ScheduledExport
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (p: Partial<ScheduledExport>) => void
}) {
  const [name, setName] = useState(report?.name ?? '')
  const [status, setStatus] = useState(report?.status ?? 'active')

  const handleSubmit = () => {
    onSubmit({ name: name.trim() || report?.name, status })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-card max-w-md">
        <DialogHeader>
          <DialogTitle>Edit scheduled report</DialogTitle>
          <DialogDescription>
            Update name or status.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'active' | 'paused')}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
