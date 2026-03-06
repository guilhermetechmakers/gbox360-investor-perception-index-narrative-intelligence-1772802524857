/** Admin dashboard types — runtime-safe, with explicit defaults */

export type UserRole = 'admin' | 'moderator' | 'support' | 'viewer' | 'standard'

export interface Team {
  id: string
  name: string
  description?: string
}

export interface AdminUser {
  id: string
  email: string
  name?: string
  display_name?: string
  role: string
  status: 'active' | 'inactive'
  team_id?: string | null
  team?: Team | null
  createdAt: string
  lastLogin?: string
  last_login_at?: string
  invited_by?: string | null
}

/** Alias for admin user list compatibility */
export type User = AdminUser

export interface Invitation {
  id: string
  email: string
  role: string
  team_id?: string | null
  invited_at: string
  status: 'pending' | 'accepted' | 'expired'
  token?: string
}

export interface Plan {
  id: string
  name: string
  price: number
  currency: string
  seatsIncluded: number
  features: string[]
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: string
  startedAt: string
  endsAt?: string
  seats: number
}

export interface Invoice {
  id: string
  subscriptionId: string
  amountDue: number
  dueDate: string
  status: 'paid' | 'unpaid' | 'overdue'
}

export type AuditActionType =
  | 'signin'
  | 'role_change'
  | 'deactivate'
  | 'reactivate'
  | 'invite'
  | 'user.invited'
  | 'seat.adjusted'
  | 'ingestion.replay'

export interface AuditLog {
  id: string
  actorId?: string
  user_id?: string
  action: string
  action_type?: AuditActionType
  targetType: string
  targetId: string
  target_user_id?: string
  timestamp: string
  details?: string
  metadata?: Record<string, unknown>
}

export interface IngestionReplay {
  id: string
  ingestion_id?: string
  source: string
  status: 'success' | 'failed' | 'in_progress'
  retriable?: boolean
  last_attempt_at: string
  details?: Record<string, unknown>
}

export interface HealthMetrics {
  cpu?: number
  memory?: number
  disk?: number
  uptimePct?: number
  apiErrorRate?: number
  storageUsedBytes?: number
}

export interface IngestionJob {
  id: string
  source: string
  status: string
  startedAt: string
  completedAt?: string
  retries: number
  lastError?: string
}

export interface SystemHealth {
  id?: string
  uptimePct: number
  apiErrorRate: number
  storageUsedBytes: number
  reportedAt: string
}

export interface BillingSummary {
  totalRevenue: number
  activeSubscriptions: number
  upcomingInvoices: number
  seatsByPlan: Record<string, number>
}

export interface AnalyticsUsage {
  [key: string]: number
}

export interface SeatAdjustPayload {
  subscriptionId: string
  seatsDelta: number
}

export interface InviteUserPayload {
  email: string
  role: string
  teamId?: string | null
  notes?: string
}

export interface UpdateUserPayload {
  role?: string
  status?: 'active' | 'inactive'
  teamId?: string | null
}

export interface ActivateDeactivatePayload {
  userId: string
  action: 'activate' | 'deactivate'
}

export interface PaginatedUsersResponse {
  data: User[]
  count: number
  page?: number
  pageSize?: number
}

export interface PaginatedAuditLogsResponse {
  data: AuditLog[]
  count: number
  limit?: number
  offset?: number
}

export interface SubscriptionOverview {
  plan_name: string
  status: string
  renewal_date?: string
  seats: number
  revenue?: number
  metrics?: Record<string, number>
}
