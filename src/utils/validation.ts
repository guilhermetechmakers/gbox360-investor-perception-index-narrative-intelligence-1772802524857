/**
 * Validation helpers for auth forms: email pattern, password strength, etc.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export const MIN_PASSWORD_LENGTH = 12

export interface PasswordStrength {
  /** 0-4 scale for criteria met */
  score: number
  /** Qualitative label: Weak | Fair | Good | Strong */
  label: 'Weak' | 'Fair' | 'Good' | 'Strong'
  /** Meets minimum: 12+ chars, mixed case, number, symbol */
  valid: boolean
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password || password.length === 0) {
    return { score: 0, label: 'Weak', valid: false }
  }
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  const valid =
    password.length >= MIN_PASSWORD_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^a-zA-Z0-9]/.test(password)

  let label: PasswordStrength['label'] = 'Weak'
  if (score >= 4) label = 'Strong'
  else if (score >= 3) label = 'Good'
  else if (score >= 2) label = 'Fair'

  return { score, label, valid }
}

export function getConfirmPasswordError(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}
