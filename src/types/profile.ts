/**
 * Profile page types. API-ready for future integration.
 * All types support null-safe usage with defaults.
 */

export interface UserProfile {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role: 'admin' | 'standard'
  organization?: string
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface UpdateProfileInput {
  name?: string
  organization?: string
  role?: 'admin' | 'standard'
  avatarUrl?: string
}

export interface NotificationPreferences {
  ingestionAlerts: boolean
  ipiMovementAlerts: boolean
  weeklyDigest: boolean
  systemAlerts?: boolean
}

export interface EnterpriseSeats {
  seatsAllocated: number
  seatsUsed: number
  plan: string
  status: 'active' | 'trial' | 'cancelled'
  invitations?: number
}

export interface LinkedIntegration {
  id: string
  provider: string
  connectedAt: string
  status: 'active' | 'expired' | 'error'
  metadata?: Record<string, unknown>
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface DeleteAccountInput {
  password?: string
  confirmation?: string
}
