import * as React from 'react'
import { Inbox, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

/* --------------------------------------------------------------------------
 * Table (root)
 * Uses design system tokens, optional aria-label/caption for accessibility.
 * -------------------------------------------------------------------------- */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Accessible name for the table (prefer TableCaption when visible caption is desired) */
  'aria-label'?: string
  /** ID of element that labels the table */
  'aria-labelledby'?: string
  /** ID of element that describes the table */
  'aria-describedby'?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => (
    <div
      className="relative w-full overflow-auto rounded-lg border border-border/80 bg-card"
    >
      <table
        ref={ref}
        role="table"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

/* --------------------------------------------------------------------------
 * TableHeader
 * -------------------------------------------------------------------------- */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'border-b border-border/80 bg-muted/30 [&_tr]:border-b [&_tr]:border-border/80',
      className
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

/* --------------------------------------------------------------------------
 * TableBody
 * -------------------------------------------------------------------------- */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

/* --------------------------------------------------------------------------
 * TableFooter
 * -------------------------------------------------------------------------- */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-border/80 bg-muted/30 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

/* --------------------------------------------------------------------------
 * TableRow
 * -------------------------------------------------------------------------- */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border/80 transition-colors duration-200 hover:bg-muted/40 data-[state=selected]:bg-muted',
      'focus-within:bg-muted/30',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

/* --------------------------------------------------------------------------
 * TableHead
 * Uses scope="col" by default for accessibility.
 * -------------------------------------------------------------------------- */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, scope = 'col', ...props }, ref) => (
  <th
    ref={ref}
    scope={scope}
    className={cn(
      'h-12 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-4 [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

/* --------------------------------------------------------------------------
 * TableCell
 * -------------------------------------------------------------------------- */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-3 align-middle text-foreground sm:p-4 [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

/* --------------------------------------------------------------------------
 * TableCaption
 * Semantic label for the table; place at top for best screen reader order.
 * -------------------------------------------------------------------------- */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-left text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

/* --------------------------------------------------------------------------
 * TableEmpty
 * Empty state: icon, message, optional description and action.
 * -------------------------------------------------------------------------- */
export interface TableEmptyProps {
  /** Number of columns to span (required so the cell spans the full width) */
  colSpan: number
  /** Short message (e.g. "No users yet") */
  message: string
  /** Optional longer description */
  description?: string
  /** Optional action label (e.g. "Invite user") */
  actionLabel?: string
  /** Optional action handler */
  onAction?: () => void
  className?: string
}

function TableEmpty({
  colSpan,
  message,
  description,
  actionLabel,
  onAction,
  className,
}: TableEmptyProps) {
  return (
    <TableRow aria-live="polite" className={cn('hover:bg-transparent', className)}>
      <TableCell colSpan={colSpan} className="h-48 text-center">
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground"
            aria-hidden
          >
            <Inbox className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">{message}</p>
            {description && (
              <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
            )}
          </div>
          {actionLabel && onAction && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAction}
              className="mt-2"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

/* --------------------------------------------------------------------------
 * TableLoading
 * Loading state: skeleton rows.
 * -------------------------------------------------------------------------- */
export interface TableLoadingProps {
  /** Number of columns to show in skeleton cells */
  columnCount: number
  /** Number of skeleton rows */
  rowCount?: number
  className?: string
}

function TableLoading({
  columnCount,
  rowCount = 5,
  className,
}: TableLoadingProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRow key={i} aria-busy="true" className={cn('pointer-events-none', className)}>
          {Array.from({ length: columnCount }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-5 w-full min-w-[4rem]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

/* --------------------------------------------------------------------------
 * TableError
 * Error state: message and optional retry.
 * -------------------------------------------------------------------------- */
export interface TableErrorProps {
  /** Number of columns to span */
  colSpan: number
  /** Error message to show */
  message?: string
  /** Retry button label */
  retryLabel?: string
  /** Retry handler */
  onRetry?: () => void
  className?: string
}

function TableError({
  colSpan,
  message = 'Something went wrong loading this data.',
  retryLabel = 'Try again',
  onRetry,
  className,
}: TableErrorProps) {
  return (
    <TableRow
      role="alert"
      aria-live="assertive"
      className={cn('hover:bg-transparent', className)}
    >
      <TableCell colSpan={colSpan} className="h-40 text-center">
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            aria-hidden
          >
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-foreground">{message}</p>
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2"
            >
              {retryLabel}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
  TableLoading,
  TableError,
}
