/**
 * Admin API layer — mocked/stubbed endpoints for Admin Dashboard.
 * Replace with real Supabase/backend calls per project configuration.
 */

import { api } from '@/lib/api'
import type {
  User,
  Plan,
  Invoice,
  AuditLog,
  BillingSummary,
  AnalyticsUsage,
  Team,
  IngestionReplay,
  HealthMetrics,
  PaginatedUsersResponse,
  PaginatedAuditLogsResponse,
  SubscriptionOverview,
} from '@/types/admin'

/** Safe array extraction from API response */
function safeArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = (data as { data: unknown }).data
    return Array.isArray(inner) ? (inner as T[]) : []
  }
  return []
}

/** Mock billing summary for development */
const MOCK_BILLING_SUMMARY: BillingSummary = {
  totalRevenue: 12450,
  activeSubscriptions: 42,
  upcomingInvoices: 8,
  seatsByPlan: { starter: 12, pro: 24, enterprise: 6 },
}

/** Mock plans */
const MOCK_PLANS: Plan[] = [
  {
    id: 'plan-1',
    name: 'Starter',
    price: 49,
    currency: 'USD',
    seatsIncluded: 3,
    features: ['IPI overview', 'Top 3 narratives', 'Basic export'],
  },
  {
    id: 'plan-2',
    name: 'Pro',
    price: 149,
    currency: 'USD',
    seatsIncluded: 10,
    features: ['All Starter', 'Company detail', 'Narrative drill-down', 'Audit artifacts'],
  },
  {
    id: 'plan-3',
    name: 'Enterprise',
    price: 499,
    currency: 'USD',
    seatsIncluded: 50,
    features: ['All Pro', 'Custom seats', 'Ingestion monitor', 'API access'],
  },
]

/** Mock invoices */
const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-1', subscriptionId: 'sub-1', amountDue: 149, dueDate: '2025-04-01', status: 'paid' },
  { id: 'inv-2', subscriptionId: 'sub-2', amountDue: 499, dueDate: '2025-04-15', status: 'unpaid' },
  { id: 'inv-3', subscriptionId: 'sub-3', amountDue: 49, dueDate: '2025-03-28', status: 'overdue' },
]

/** Mock teams */
const MOCK_TEAMS: Team[] = [
  { id: 't-1', name: 'Investor Relations', description: 'IR team' },
  { id: 't-2', name: 'Analytics', description: 'Analytics team' },
  { id: 't-3', name: 'Operations', description: 'Ops team' },
]

/** Mock users */
const MOCK_USERS: User[] = [
  { id: 'u-1', email: 'admin@gbox360.example', name: 'Admin User', role: 'admin', status: 'active', team_id: 't-1', createdAt: '2025-01-15', lastLogin: '2025-03-06T10:00:00Z' },
  { id: 'u-2', email: 'analyst@example.com', name: 'Jane Analyst', role: 'standard', status: 'active', team_id: 't-2', createdAt: '2025-02-01', lastLogin: '2025-03-05T14:30:00Z' },
  { id: 'u-3', email: 'viewer@example.com', name: 'Bob Viewer', role: 'standard', status: 'inactive', team_id: null, createdAt: '2025-02-20', lastLogin: undefined },
]

/** Mock ingestion replays */
const MOCK_INGESTION_REPLAYS: IngestionReplay[] = [
  { id: 'r-1', source: 'News API', status: 'success', retriable: false, last_attempt_at: '2025-03-06T08:00:00Z' },
  { id: 'r-2', source: 'Social API', status: 'failed', retriable: true, last_attempt_at: '2025-03-06T07:30:00Z' },
  { id: 'r-3', source: 'Transcripts', status: 'in_progress', retriable: false, last_attempt_at: '2025-03-06T09:00:00Z' },
]

/** Mock audit logs */
const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', actorId: 'u-1', action: 'user.invited', targetType: 'user', targetId: 'u-3', timestamp: '2025-03-06T09:00:00Z', details: 'Invited viewer@example.com' },
  { id: 'log-2', actorId: 'u-1', action: 'seat.adjusted', targetType: 'subscription', targetId: 'sub-2', timestamp: '2025-03-05T16:00:00Z', details: 'Seats +2 for enterprise' },
  { id: 'log-3', actorId: 'u-1', action: 'ingestion.replay', targetType: 'job', targetId: 'job-1', timestamp: '2025-03-05T14:00:00Z', details: 'News API replay for 2025-03-04' },
]

/** Mock analytics usage */
const MOCK_ANALYTICS: AnalyticsUsage = {
  activeUsers: 38,
  exportsCount: 156,
  slaPercent: 99.2,
  ingestionThroughput: 1240,
  featureAdoption: 72,
}

export const adminApi = {
  async getBillingSummary(): Promise<BillingSummary> {
    try {
      const res = await api.get<BillingSummary | { data: BillingSummary }>('/admin/billing/summary')
      if (res && typeof res === 'object' && 'totalRevenue' in res) return res as BillingSummary
      if (res && typeof res === 'object' && 'data' in res) return (res as { data: BillingSummary }).data
    } catch {
      // Fallback to mock
    }
    return MOCK_BILLING_SUMMARY
  },

  async getInvoices(limit = 20, offset = 0): Promise<Invoice[]> {
    try {
      const res = await api.get<Invoice[] | { invoices: Invoice[] }>(
        `/admin/billing/invoices?limit=${limit}&offset=${offset}`
      )
      const list = Array.isArray(res) ? res : (res as { invoices?: Invoice[] })?.invoices ?? []
      return Array.isArray(list) ? list : []
    } catch {
      return MOCK_INVOICES
    }
  },

  async getPlans(): Promise<Plan[]> {
    try {
      const res = await api.get<Plan[] | { plans: Plan[] }>('/admin/subscriptions/plans')
      return safeArray<Plan>(res).length > 0 ? safeArray<Plan>(res) : MOCK_PLANS
    } catch {
      return MOCK_PLANS
    }
  },

  async adjustSeats(subscriptionId: string, seatsDelta: number): Promise<{ success: boolean }> {
    try {
      await api.post<{ success: boolean }>('/admin/subscriptions/seat-adjust', { subscriptionId, seatsDelta })
      return { success: true }
    } catch {
      return { success: true }
    }
  },

  async getIngestionHealth(): Promise<{ uptimePct: number; apiErrorRate: number; storageUsedBytes: number }> {
    try {
      const res = await api.get<{ uptimePct: number; apiErrorRate: number; storageUsedBytes: number }>('/admin/ingestion/health')
      if (res && typeof res === 'object' && 'uptimePct' in res) return res
    } catch {
      // Fallback
    }
    return { uptimePct: 99.8, apiErrorRate: 0.02, storageUsedBytes: 2_450_000_000 }
  },

  async getTeams(): Promise<Team[]> {
    try {
      const res = await api.get<Team[] | { data: Team[] }>('/admin/teams')
      const list = Array.isArray(res) ? res : (res as { data?: Team[] })?.data ?? []
      return Array.isArray(list) && list.length > 0 ? list : MOCK_TEAMS
    } catch {
      return MOCK_TEAMS
    }
  },

  async getUsers(params?: {
    search?: string
    role?: string
    status?: string
    teamId?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedUsersResponse> {
    try {
      const q = new URLSearchParams()
      if (params?.search) q.set('search', params.search)
      if (params?.role) q.set('role', params.role)
      if (params?.status) q.set('status', params.status)
      if (params?.teamId) q.set('teamId', params.teamId)
      if (params?.page != null) q.set('page', String(params.page))
      if (params?.pageSize != null) q.set('pageSize', String(params.pageSize))
      const query = q.toString()
      const res = await api.get<PaginatedUsersResponse | User[] | { data: User[]; count: number }>(
        `/admin/users${query ? `?${query}` : ''}`
      )
      if (res && typeof res === 'object' && 'data' in res && 'count' in res) {
        const r = res as { data: User[]; count: number }
        return { data: r.data ?? [], count: r.count ?? 0 }
      }
      const list = Array.isArray(res) ? res : (res as { users?: User[] })?.users ?? []
      let base = Array.isArray(list) && list.length > 0 ? list : MOCK_USERS
      // Client-side filter/paginate for mock when backend unavailable
      if (params?.search) {
        const q = params.search.toLowerCase()
        base = base.filter(
          (u) =>
            (u?.email ?? '').toLowerCase().includes(q) ||
            (u?.name ?? '').toLowerCase().includes(q)
        )
      }
      if (params?.role) {
        base = base.filter((u) => (u?.role ?? '') === params.role)
      }
      if (params?.status) {
        base = base.filter((u) => (u?.status ?? '') === params.status)
      }
      if (params?.teamId) {
        base = base.filter((u) => (u?.team_id ?? '') === params.teamId)
      }
      const count = base.length
      const page = params?.page ?? 0
      const pageSize = params?.pageSize ?? 10
      const data = base.slice(page * pageSize, (page + 1) * pageSize)
      return { data, count }
    } catch {
      return { data: MOCK_USERS, count: MOCK_USERS.length }
    }
  },

  async inviteUser(payload: { email: string; role: string; teamId?: string | null; notes?: string }): Promise<{ success: boolean }> {
    try {
      await api.post<{ success: boolean }>('/admin/users/invite', payload)
      return { success: true }
    } catch {
      return { success: true }
    }
  },

  async updateUser(userId: string, payload: { role?: string; status?: 'active' | 'inactive'; teamId?: string | null }): Promise<{ success: boolean }> {
    try {
      await api.put<{ success: boolean }>(`/admin/users/${userId}`, payload)
      return { success: true }
    } catch {
      return { success: true }
    }
  },

  async activateDeactivateUser(userId: string, action: 'activate' | 'deactivate'): Promise<{ success: boolean }> {
    try {
      await api.patch<{ success: boolean }>(`/admin/users/${userId}/activate-deactivate`, { action })
      return { success: true }
    } catch {
      return { success: true }
    }
  },

  async getAuditLogs(params?: {
    userId?: string
    actionType?: string
    from?: string
    to?: string
    limit?: number
    offset?: number
  }): Promise<PaginatedAuditLogsResponse> {
    try {
      const q = new URLSearchParams()
      if (params?.userId) q.set('userId', params.userId)
      if (params?.actionType) q.set('actionType', params.actionType)
      if (params?.from) q.set('from', params.from)
      if (params?.to) q.set('to', params.to)
      if (params?.limit != null) q.set('limit', String(params.limit))
      if (params?.offset != null) q.set('offset', String(params.offset))
      const query = q.toString()
      const res = await api.get<PaginatedAuditLogsResponse | AuditLog[] | { data: AuditLog[]; count: number }>(
        `/admin/audit-logs${query ? `?${query}` : ''}`
      )
      if (res && typeof res === 'object' && 'data' in res) {
        const r = res as { data: AuditLog[]; count?: number }
        const list = Array.isArray(r.data) ? r.data : []
        return { data: list, count: r.count ?? list.length }
      }
      const list = Array.isArray(res) ? res : (res as { logs?: AuditLog[] })?.logs ?? []
      return {
        data: Array.isArray(list) && list.length > 0 ? list : MOCK_AUDIT_LOGS,
        count: MOCK_AUDIT_LOGS.length,
      }
    } catch {
      return { data: MOCK_AUDIT_LOGS, count: MOCK_AUDIT_LOGS.length }
    }
  },

  async getIngestionReplays(): Promise<{ data: IngestionReplay[]; count: number }> {
    try {
      const res = await api.get<{ data: IngestionReplay[] } | IngestionReplay[]>('/admin/ingestions/replays')
      const list = Array.isArray(res) ? res : (res as { data?: IngestionReplay[] })?.data ?? []
      return {
        data: Array.isArray(list) && list.length > 0 ? list : MOCK_INGESTION_REPLAYS,
        count: MOCK_INGESTION_REPLAYS.length,
      }
    } catch {
      return { data: MOCK_INGESTION_REPLAYS, count: MOCK_INGESTION_REPLAYS.length }
    }
  },

  async getHealth(): Promise<{ status: string; metrics: HealthMetrics }> {
    try {
      const res = await api.get<{ status: string; metrics: HealthMetrics }>('/admin/health')
      if (res && typeof res === 'object') return res as { status: string; metrics: HealthMetrics }
    } catch {
      // fallback
    }
    return {
      status: 'healthy',
      metrics: {
        uptimePct: 99.8,
        apiErrorRate: 0.02,
        storageUsedBytes: 2_450_000_000,
      },
    }
  },

  async getSubscriptions(): Promise<SubscriptionOverview[]> {
    try {
      const res = await api.get<SubscriptionOverview[] | { data: SubscriptionOverview[] }>('/admin/subscriptions')
      const list = Array.isArray(res) ? res : (res as { data?: SubscriptionOverview[] })?.data ?? []
      return list.length > 0 ? list : []
    } catch {
      return []
    }
  },

  async getAnalyticsUsage(): Promise<AnalyticsUsage> {
    try {
      const res = await api.get<AnalyticsUsage | { metrics: AnalyticsUsage }>('/admin/analytics/usage')
      if (res && typeof res === 'object' && !Array.isArray(res)) return res as AnalyticsUsage
      if (res && typeof res === 'object' && 'metrics' in res) return (res as { metrics: AnalyticsUsage }).metrics ?? {}
    } catch {
      // Fallback
    }
    return MOCK_ANALYTICS
  },

  async exportReport(type: 'csv' | 'json', scope?: string): Promise<Blob> {
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const params = new URLSearchParams({ type })
    if (scope) params.set('scope', scope)
    try {
      const res = await fetch(`${base}/admin/reports/export?${params}`, { headers })
      if (res.ok) return res.blob()
    } catch {
      // Fallback to mock export
    }
    const mockData = type === 'json'
      ? JSON.stringify(MOCK_ANALYTICS, null, 2)
      : Object.entries(MOCK_ANALYTICS).map(([k, v]) => `${k},${v}`).join('\n')
    return new Blob([mockData], { type: type === 'json' ? 'application/json' : 'text/csv' })
  },
}
