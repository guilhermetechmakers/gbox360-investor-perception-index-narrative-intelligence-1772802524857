import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BackToLoginLinkProps {
  className?: string
}

export function BackToLoginLink({ className }: BackToLoginLinkProps) {
  return (
    <Link
      to="/login"
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 -mx-2 -my-1',
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back to sign in
    </Link>
  )
}
