/**
 * Admin React Query hooks — billing, users, audit logs, ingestion, analytics.
 * All data guarded for runtime safety.
 */
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminApi } from '@/api/admin'

export const adminKeys = {
  billingSummary: ['admin', 'billing', 'summary'] as const,
  invoices: (limit?: number, offset?: number) =>
    ['admin', 'billing', 'invoices', limit, offset] as const,
  plans: ['admin', 'subscriptions', 'plans'] as const,
  ingestionHealth: ['admin', 'ingestion', 'health'] as const,
  users: (params?: Record<string, unknown>) => ['admin', 'users', params] as const,
  teams: ['admin', 'teams'] as const,
  auditLogs: (params?: Record<string, unknown>) => ['admin', 'audit-logs', params] as const,
  ingestionReplays: ['admin', 'ingestions', 'replays'] as const,
  health: ['admin', 'health'] as const,
  subscriptions: ['admin', 'subscriptions'] as const,
  analyticsUsage: ['admin', 'analytics', 'usage'] as const,
}

export function useBillingSummary() {
  return useQuery({
    queryKey: adminKeys.billingSummary,
    queryFn: adminApi.getBillingSummary,
  })
}

export function useInvoices(limit = 20, offset = 0) {
  return useQuery({
    queryKey: adminKeys.invoices(limit, offset),
    queryFn: () => adminApi.getInvoices(limit, offset),
  })
}

export function usePlans() {
  return useQuery({
    queryKey: adminKeys.plans,
    queryFn: adminApi.getPlans,
  })
}

export function useSeatAdjust() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ subscriptionId, seatsDelta }: { subscriptionId: string; seatsDelta: number }) =>
      adminApi.adjustSeats(subscriptionId, seatsDelta),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.billingSummary })
      qc.invalidateQueries({ queryKey: adminKeys.invoices() })
      toast.success('Seats updated successfully')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to adjust seats')
    },
  })
}

export function useIngestionHealth() {
  return useQuery({
    queryKey: adminKeys.ingestionHealth,
    queryFn: adminApi.getIngestionHealth,
  })
}

export function useAdminUsers(params?: {
  search?: string
  role?: string
  status?: string
  teamId?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.getUsers(params),
  })
}

/** Legacy: returns users array for backward compatibility */
export function useAdminUsersLegacy() {
  const q = useAdminUsers()
  const data = q.data
  const users = Array.isArray(data?.data) ? data.data : (data as { data?: unknown[] } | undefined)?.data ?? []
  return { ...q, data: users }
}

export function useTeams() {
  return useQuery({
    queryKey: adminKeys.teams,
    queryFn: adminApi.getTeams,
  })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { email: string; role: string; teamId?: string | null; notes?: string }) =>
      adminApi.inviteUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users(undefined) })
      qc.invalidateQueries({ queryKey: adminKeys.auditLogs(undefined) })
      toast.success('Invitation sent successfully')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to invite user')
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string
      payload: { role?: string; status?: 'active' | 'inactive'; teamId?: string | null }
    }) => adminApi.updateUser(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users(undefined) })
      qc.invalidateQueries({ queryKey: adminKeys.auditLogs(undefined) })
      toast.success('User updated successfully')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to update user')
    },
  })
}

export function useActivateDeactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, action }: { userId: string; action: 'activate' | 'deactivate' }) =>
      adminApi.activateDeactivateUser(userId, action),
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: adminKeys.users(undefined) })
      qc.invalidateQueries({ queryKey: adminKeys.auditLogs(undefined) })
      toast.success(`User ${action === 'activate' ? 'activated' : 'deactivated'} successfully`)
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Action failed')
    },
  })
}

export function useAuditLogs(params?: {
  userId?: string
  actionType?: string
  from?: string
  to?: string
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: adminKeys.auditLogs(params),
    queryFn: () => adminApi.getAuditLogs(params),
  })
}

/** Legacy: returns audit logs array for backward compatibility */
export function useAuditLogsLegacy() {
  const q = useAuditLogs()
  const data = q.data
  const logs = Array.isArray(data?.data) ? data.data : (data as { data?: unknown[] } | undefined)?.data ?? []
  return { ...q, data: logs }
}

export function useIngestionReplays() {
  return useQuery({
    queryKey: adminKeys.ingestionReplays,
    queryFn: adminApi.getIngestionReplays,
  })
}

export function useHealth() {
  return useQuery({
    queryKey: adminKeys.health,
    queryFn: adminApi.getHealth,
  })
}

export function useSubscriptions() {
  return useQuery({
    queryKey: adminKeys.subscriptions,
    queryFn: adminApi.getSubscriptions,
  })
}

export function useAnalyticsUsage() {
  return useQuery({
    queryKey: adminKeys.analyticsUsage,
    queryFn: adminApi.getAnalyticsUsage,
  })
}

export function useExportReport() {
  return useMutation({
    mutationFn: ({ type, scope }: { type: 'csv' | 'json'; scope?: string }) =>
      adminApi.exportReport(type, scope),
    onSuccess: (blob, { type }) => {
      const ext = type === 'json' ? 'json' : 'csv'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `admin-report-${Date.now()}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report exported successfully')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Export failed')
    },
  })
}
