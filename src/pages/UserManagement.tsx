import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  InviteUserModal,
  EditUserModal,
  AuditLogViewer,
} from '@/components/admin'
import {
  useAdminUsers,
  useTeams,
  useActivateDeactivateUser,
} from '@/hooks/use-admin'
import { UserPlus, Search, UserX, UserCheck, Pencil, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User, Team } from '@/types/admin'

const ROLES = ['admin', 'moderator', 'support', 'viewer', 'standard'] as const
const STATUSES = ['active', 'inactive'] as const
const PAGE_SIZE = 10

export default function UserManagement() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [teamFilter, setTeamFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deactivateUserId, setDeactivateUserId] = useState<string | null>(null)
  const [activateUserId, setActivateUserId] = useState<string | null>(null)

  const { data: usersResponse, isLoading: usersLoading } = useAdminUsers({
    search: search.trim() || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    teamId: teamFilter !== 'all' ? teamFilter : undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const { data: teams = [] } = useTeams()
  const safeTeams = Array.isArray(teams) ? teams : []
  const activateDeactivate = useActivateDeactivateUser()

  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
  const totalCount = typeof usersResponse?.count === 'number' ? usersResponse.count : users.length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(users.map((u) => u?.id ?? '').filter(Boolean)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleDeactivate = (userId: string) => {
    activateDeactivate.mutate(
      { userId, action: 'deactivate' },
      { onSuccess: () => setDeactivateUserId(null) }
    )
  }

  const handleActivate = (userId: string) => {
    activateDeactivate.mutate(
      { userId, action: 'activate' },
      { onSuccess: () => setActivateUserId(null) }
    )
  }

  const openEdit = (user: User) => {
    setEditUser(user)
    setEditOpen(true)
  }

  const allSelected = users.length > 0 && selectedIds.size === users.length
  const someSelected = selectedIds.size > 0

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          User management
        </h1>
        <Button
          size="sm"
          className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite user
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="rounded-lg bg-muted/60 p-1">
          <TabsTrigger value="users" className="rounded-md">
            Users
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-md">
            Audit log
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <Card className="rounded-card">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <CardTitle className="font-serif text-lg">Users</CardTitle>
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(0)
                    }}
                    className="pl-9 rounded-lg"
                    aria-label="Search users"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(0) }}>
                    <SelectTrigger className="w-[130px] rounded-lg">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roles</SelectItem>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
                    <SelectTrigger className="w-[130px] rounded-lg">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={teamFilter} onValueChange={(v) => { setTeamFilter(v); setPage(0) }}>
                    <SelectTrigger className="w-[140px] rounded-lg">
                      <SelectValue placeholder="Team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All teams</SelectItem>
                      {(safeTeams as Team[]).map((t) => (
                        <SelectItem key={t?.id ?? ''} value={t?.id ?? ''}>{t?.name ?? '—'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {someSelected && (
                <div className="flex items-center gap-2 pt-2 border-t border-border/60 mt-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedIds.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIds(new Set())}
                    className="rounded-full"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Table aria-label="Users list">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all users"
                      />
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    <TableLoading columnCount={8} rowCount={5} />
                  ) : users.length === 0 ? (
                    <TableEmpty
                      colSpan={8}
                      message="No users found"
                      description="Invite users to get started."
                      actionLabel="Invite user"
                      onAction={() => setInviteOpen(true)}
                    />
                  ) : (
                    users.map((user) => (
                      <TableRow key={user?.id ?? ''}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(user?.id ?? '')}
                            onCheckedChange={(c) => handleSelectOne(user?.id ?? '', !!c)}
                            aria-label={`Select ${user?.email ?? 'user'}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user?.email ?? '—'}</TableCell>
                        <TableCell>{user?.name ?? user?.display_name ?? '—'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user?.role ?? '—'}</Badge>
                        </TableCell>
                        <TableCell>
                          {(safeTeams as Team[]).find((t) => t?.id === user?.team_id)?.name ?? '—'}
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
                        <TableCell className="text-muted-foreground text-xs">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Actions">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {user?.status === 'active' ? (
                                <DropdownMenuItem
                                  onClick={() => setDeactivateUserId(user?.id ?? '')}
                                  className="text-destructive"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => setActivateUserId(user?.id ?? '')}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages} · {totalCount} total
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="rounded-full"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="rounded-full"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit" className="space-y-4">
          <AuditLogViewer />
        </TabsContent>
      </Tabs>

      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <EditUserModal open={editOpen} onOpenChange={setEditOpen} user={editUser} />

      <AlertDialog
        open={!!deactivateUserId}
        onOpenChange={(open) => !open && setDeactivateUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate user?</AlertDialogTitle>
            <AlertDialogDescription>
              The user will lose access to the platform. You can reactivate them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deactivateUserId && handleDeactivate(deactivateUserId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!activateUserId}
        onOpenChange={(open) => !open && setActivateUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate user?</AlertDialogTitle>
            <AlertDialogDescription>
              The user will regain access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => activateUserId && handleActivate(activateUserId)}
            >
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatedPage>
  )
}
