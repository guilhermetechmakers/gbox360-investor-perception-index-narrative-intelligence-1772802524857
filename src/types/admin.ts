/** Admin dashboard types — runtime-safe, with explicit defaults */

export interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin?: string
}

/** Alias for admin user list compatibility */
export type User = AdminUser

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

export interface AuditLog {
  id: string
  actorId: string
  action: string
  targetType: string
  targetId: string
  timestamp: string
  details?: string
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
}

export interface ActivateDeactivatePayload {
  userId: string
  action: 'activate' | 'deactivate'
}
