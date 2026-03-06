import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BarChart3, Server, CreditCard, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'h-5 w-5'

const tiles = [
  {
    to: '/admin/users',
    label: 'User management',
    description: 'Invite, edit, audit log',
    icon: Users,
  },
  {
    to: '/admin/billing',
    label: 'Billing',
    description: 'Plans, invoices, seats',
    icon: CreditCard,
  },
  {
    to: '/admin/analytics',
    label: 'Analytics & reports',
    description: 'Metrics, report builder',
    icon: BarChart3,
  },
  {
    to: '/admin/ingestion',
    label: 'Ingestion monitor',
    description: 'Source status, retry queue',
    icon: Server,
  },
  {
    to: '/about',
    label: 'Help',
    description: 'Methodology, FAQ, support',
    icon: HelpCircle,
  },
] as const

export function QuickAccessTiles() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {tiles.map(({ to, label, description, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Card className="rounded-card bg-card text-card-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {label}
              </CardTitle>
              <Icon className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
