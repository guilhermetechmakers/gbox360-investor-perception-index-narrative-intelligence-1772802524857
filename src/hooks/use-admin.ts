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
  users: ['admin', 'users'] as const,
  auditLogs: ['admin', 'audit-logs'] as const,
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

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users,
    queryFn: adminApi.getUsers,
  })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      adminApi.inviteUser(email, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      qc.invalidateQueries({ queryKey: adminKeys.auditLogs })
      toast.success('Invitation sent successfully')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to invite user')
    },
  })
}

export function useActivateDeactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, action }: { userId: string; action: 'activate' | 'deactivate' }) =>
      adminApi.activateDeactivateUser(userId, action),
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      qc.invalidateQueries({ queryKey: adminKeys.auditLogs })
      toast.success(`User ${action === 'activate' ? 'activated' : 'deactivated'} successfully`)
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Action failed')
    },
  })
}

export function useAuditLogs() {
  return useQuery({
    queryKey: adminKeys.auditLogs,
    queryFn: adminApi.getAuditLogs,
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
