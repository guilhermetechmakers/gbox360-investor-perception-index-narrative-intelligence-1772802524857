import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Users, BarChart3, Server, FileCheck } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Admin dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/users">
          <Card className="rounded-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User management</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Invite, edit, audit log</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/ingestion">
          <Card className="rounded-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingestion monitor</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Source status, retry queue</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/analytics">
          <Card className="rounded-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics & reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Metrics, report builder</p>
            </CardContent>
          </Card>
        </Link>
        <Card className="rounded-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System health</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Events log, quick links</p>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Events log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Platform events and admin actions will appear here.</p>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
