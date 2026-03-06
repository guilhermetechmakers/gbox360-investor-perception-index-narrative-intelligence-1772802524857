import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface AnalyticsDashboardLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function AnalyticsDashboardLayout({
  title,
  subtitle,
  children,
  className,
}: AnalyticsDashboardLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <header className="flex flex-col gap-1">
        <nav
          className="flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link
            to="/admin"
            className="hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
          >
            Admin
          </Link>
          <span aria-hidden>/</span>
          <Link
            to="/admin/analytics"
            className="hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
          >
            Analytics
          </Link>
        </nav>
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground max-w-2xl">{subtitle}</p>
        )}
      </header>
      <div className="container-narrow max-w-[1200px]">{children}</div>
    </div>
  )
}
