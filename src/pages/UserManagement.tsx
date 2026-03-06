import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { AuditLogCard } from '@/components/admin'
import {
  useAdminUsers,
  useInviteUser,
  useActivateDeactivateUser,
  useAuditLogs,
} from '@/hooks/use-admin'
import { UserPlus, Search, UserX, UserCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'standard']),
})

type InviteFormValues = z.infer<typeof inviteSchema>

export default function UserManagement() {
  const [search, setSearch] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [deactivateUserId, setDeactivateUserId] = useState<string | null>(null)
  const [activateUserId, setActivateUserId] = useState<string | null>(null)

  const { data: users = [], isLoading: usersLoading } = useAdminUsers()
  const { data: auditLogs = [], isLoading: logsLoading } = useAuditLogs()
  const inviteUser = useInviteUser()
  const activateDeactivate = useActivateDeactivateUser()

  const safeUsers = Array.isArray(users) ? users : []
  const safeLogs = Array.isArray(auditLogs) ? auditLogs : []

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return safeUsers
    const q = search.toLowerCase()
    return safeUsers.filter(
      (u) =>
        (u?.email ?? '').toLowerCase().includes(q) ||
        (u?.name ?? '').toLowerCase().includes(q)
    )
  }, [safeUsers, search])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'standard' },
  })

  const roleValue = watch('role')

  const onInvite = (data: InviteFormValues) => {
    inviteUser.mutate(
      { email: data.email, role: data.role },
      {
        onSuccess: () => {
          reset()
          setInviteOpen(false)
        },
      }
    )
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

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          User management
        </h1>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite user
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite user</DialogTitle>
              <DialogDescription>
                Send an invitation to join the platform. They will receive an email with signup instructions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="user@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={roleValue}
                  onValueChange={(v) => setValue('role', v as 'admin' | 'standard')}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={inviteUser.isPending}>
                  {inviteUser.isPending ? 'Sending...' : 'Send invitation'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <Card className="rounded-card">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <CardTitle className="font-serif text-lg">Users</CardTitle>
                <div className="relative flex-1 sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table aria-label="Users list">
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    <TableLoading columnCount={5} rowCount={5} />
                  ) : filteredUsers.length === 0 ? (
                    <TableEmpty
                      colSpan={5}
                      message="No users found"
                      description="Invite users to get started."
                      actionLabel="Invite user"
                      onAction={() => setInviteOpen(true)}
                    />
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user?.id ?? ''}>
                        <TableCell className="font-medium">{user?.email ?? '—'}</TableCell>
                        <TableCell>{user?.name ?? '—'}</TableCell>
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
                          {user?.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeactivateUserId(user?.id ?? '')}
                            >
                              <UserX className="mr-1 h-4 w-4" />
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActivateUserId(user?.id ?? '')}
                            >
                              <UserCheck className="mr-1 h-4 w-4" />
                              Activate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit" className="space-y-4">
          <Card className="rounded-card">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Audit log</CardTitle>
              <p className="text-sm text-muted-foreground">
                Recent admin actions and user management events.
              </p>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/40" />
                  ))}
                </div>
              ) : safeLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <p className="font-medium text-foreground">No audit entries yet</p>
                  <p className="text-sm text-muted-foreground">
                    Admin actions will appear here when they occur.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {safeLogs.map((log) => (
                    <AuditLogCard key={log?.id ?? ''} log={log} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
