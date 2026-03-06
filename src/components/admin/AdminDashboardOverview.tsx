import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminUsers, useBillingSummary, useAnalyticsUsage } from '@/hooks/use-admin'
import { Users, CreditCard, BarChart3, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'h-5 w-5'

export function AdminDashboardOverview() {
  const { data: usersData, isLoading: usersLoading } = useAdminUsers()
  const { data: billing, isLoading: billingLoading } = useBillingSummary()
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsUsage()

  const userCount = typeof usersData?.count === 'number' ? usersData.count : (usersData?.data?.length ?? 0)
  const activeSubs = billing?.activeSubscriptions ?? 0
  const totalRevenue = billing?.totalRevenue ?? 0
  const activeUsers = typeof analytics?.activeUsers === 'number' ? analytics.activeUsers : 0

  const tiles = [
    {
      label: 'Total users',
      value: userCount,
      icon: Users,
      to: '/admin/users',
      bg: 'bg-[#FBD8C5]/40',
    },
    {
      label: 'Active subscriptions',
      value: activeSubs,
      icon: CreditCard,
      to: '/admin/billing',
      bg: 'bg-[#C8D4C0]/40',
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      to: '/admin/billing',
      bg: 'bg-[#E8DED3]/50',
    },
    {
      label: 'Active users (30d)',
      value: activeUsers,
      icon: BarChart3,
      to: '/admin/analytics',
      bg: 'bg-[#D8C9B0]/40',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ label, value, icon: Icon, to, bg }) => (
        <Link
          key={label}
          to={to}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Card
            className={cn(
              'rounded-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
              bg
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {label}
              </CardTitle>
              <Icon className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
            </CardHeader>
            <CardContent>
              {usersLoading && label === 'Total users' ? (
                <Skeleton className="h-7 w-16" />
              ) : billingLoading && (label === 'Active subscriptions' || label === 'Revenue') ? (
                <Skeleton className="h-7 w-16" />
              ) : analyticsLoading && label === 'Active users (30d)' ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{value}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
