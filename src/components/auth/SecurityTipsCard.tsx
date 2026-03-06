import { Link } from 'react-router-dom'
import { Shield, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SecurityTipsCardProps {
  variant?: 'request' | 'confirm'
  className?: string
}

export function SecurityTipsCard({ variant = 'request', className }: SecurityTipsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/40 bg-muted/10 p-4 text-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Shield
          className="h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <div className="space-y-2">
          <p className="font-medium text-foreground">Security tips</p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            {variant === 'request' && (
              <>
                <li>Use a strong, unique password you don&apos;t use elsewhere</li>
                <li>Reset links expire after a short time for your security</li>
                <li>If you didn&apos;t request this, contact support</li>
              </>
            )}
            {variant === 'confirm' && (
              <>
                <li>Use at least 12 characters with mixed case, numbers, and symbols</li>
                <li>Don&apos;t reuse passwords across accounts</li>
                <li>If you didn&apos;t request this reset, contact support</li>
              </>
            )}
          </ul>
          <p className="pt-1">
            <Link
              to="/about"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
