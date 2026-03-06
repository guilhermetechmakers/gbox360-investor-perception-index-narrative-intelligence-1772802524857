/**
 * User model and type definitions.
 * Re-exports from types; use with guards when validating API responses.
 */

import type { User } from '@/types/user'
import { ensureObject } from '@/utils/guards'

export type { User }

const defaultUser: User = {
  id: '',
  email: '',
  emailVerified: false,
  role: 'standard',
  createdAt: '',
  updatedAt: '',
}

/**
 * Safely parse API response to User shape. Returns defaults for missing or invalid fields.
 */
export function parseUser(value: unknown): User {
  const raw = ensureObject(value as Record<string, unknown>, defaultUser as unknown as Record<string, unknown>)
  return {
    id: typeof raw.id === 'string' ? raw.id : defaultUser.id,
    email: typeof raw.email === 'string' ? raw.email : defaultUser.email,
    fullName: typeof raw.fullName === 'string' ? raw.fullName : undefined,
    avatarUrl: typeof raw.avatarUrl === 'string' ? raw.avatarUrl : undefined,
    emailVerified: typeof raw.emailVerified === 'boolean' ? raw.emailVerified : defaultUser.emailVerified,
    role: raw.role === 'admin' ? 'admin' : 'standard',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : defaultUser.createdAt,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : defaultUser.updatedAt,
  }
}
