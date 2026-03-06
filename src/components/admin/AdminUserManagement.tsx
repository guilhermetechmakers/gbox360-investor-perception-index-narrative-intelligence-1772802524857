import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty,
  TableLoading,
} from '@/components/ui/table'
import { useAdminUsers } from '@/hooks/use-admin'
import { UserPlus, Search } from 'lucide-react'

const ROLES = ['admin', 'moderator', 'support', 'viewer', 'standard'] as const
const STATUSES = ['active', 'inactive'] as const
const PAGE_SIZE = 5

export function AdminUserManagement() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: usersResponse, isLoading } = useAdminUsers({
    search: search.trim() || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: 0,
    pageSize: PAGE_SIZE,
  })

  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
  const totalCount = typeof usersResponse?.count === 'number' ? usersResponse.count : users.length

  return (
    <Card className="rounded-card shadow-card">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="font-serif text-lg">User management</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:max-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-lg"
              aria-label="Search users"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[120px] rounded-lg">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link to="/admin/users">
            <Button
              size="sm"
              className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table aria-label="Users">
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading columnCount={4} rowCount={3} />
            ) : users.length === 0 ? (
              <TableEmpty
                colSpan={4}
                message="No users found"
                description="Try adjusting filters or invite users."
                actionLabel="Invite user"
                onAction={() => navigate('/admin/users')}
              />
            ) : (
              users.map((user) => (
                <TableRow key={user?.id ?? ''}>
                  <TableCell className="font-medium">
                    {user?.email ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user?.role ?? '—'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user?.status === 'active' ? 'success' : 'destructive'
                      }
                    >
                      {user?.status ?? '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to="/admin/users">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalCount > PAGE_SIZE && (
          <div className="mt-4 flex justify-end">
            <Link to="/admin/users">
              <Button variant="outline" size="sm" className="rounded-full">
                View all ({totalCount})
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
