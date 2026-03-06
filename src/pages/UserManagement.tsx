import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AnimatedPage } from '@/components/AnimatedPage'
import { UserPlus } from 'lucide-react'

export default function UserManagement() {
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">User management</h1>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite user
        </Button>
      </div>
      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search users..." className="max-w-sm" />
          <Table aria-label="Users list">
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>admin@gbox360.example</TableCell>
                <TableCell>Admin User</TableCell>
                <TableCell>admin</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
