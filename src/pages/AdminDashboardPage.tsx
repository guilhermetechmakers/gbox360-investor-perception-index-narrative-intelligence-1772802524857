import { AnimatedPage } from '@/components/AnimatedPage'
import {
  AdminUserManagement,
  BillingOverview,
  PlatformAnalyticsTiles,
} from '@/components/admin'
import { Link } from 'react-router-dom'

export default function AdminDashboardPage() {
  return (
    <AnimatedPage className="space-y-6">
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
          <span className="text-foreground">Dashboard</span>
        </nav>
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Admin dashboard
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          User management, billing overview, and platform analytics at a glance.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <PlatformAnalyticsTiles />
        </div>
        <AdminUserManagement />
        <BillingOverview />
      </div>
    </AnimatedPage>
  )
}
