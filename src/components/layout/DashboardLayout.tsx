import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  LayoutGrid,
  Building2,
  FileText,
  History,
  Settings,
  User,
  Users,
  BarChart3,
  CreditCard,
  Menu,
  ChevronLeft,
  LogOut,
  Server,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useSignOut, useCurrentUser } from '@/hooks/use-auth'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/companies', label: 'Companies', icon: Building2 },
  { to: '/dashboard/narratives', label: 'Narratives', icon: FileText },
  { to: '/dashboard/historical', label: 'Historical', icon: History },
]

const adminItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/billing', label: 'Billing', icon: CreditCard },
  { to: '/admin/ingestion', label: 'Ingestion', icon: Server },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const signOut = useSignOut()
  const { data: user } = useCurrentUser()

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => navigate('/login'),
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-card transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          {!collapsed && (
            <Link to="/dashboard" className="font-serif text-lg font-semibold">
              Gbox360
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                location.pathname === to && 'bg-accent text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
          {user?.role === 'admin' &&
            adminItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                  location.pathname.startsWith(to) &&
                    'bg-accent text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            ))}
        </nav>
        <div className="space-y-1 border-t border-border p-2">
          <Link
            to="/dashboard/profile"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              location.pathname === '/dashboard/profile' &&
                'bg-accent text-accent-foreground'
            )}
          >
            <User className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Profile</span>}
          </Link>
          <Link
            to="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              location.pathname === '/dashboard/settings' &&
                'bg-accent text-accent-foreground'
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <div />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {user?.email ?? 'Account'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
