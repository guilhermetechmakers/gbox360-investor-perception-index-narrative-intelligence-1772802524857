import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBanner, ValidationMessage, SSOButton } from '@/components/auth'
import { isValidEmail, getPasswordStrength, getConfirmPasswordError } from '@/utils/validation'
import { ensureArray, ensureObject } from '@/utils/guards'

describe('ValidationMessage', () => {
  it('renders nothing when message is empty', () => {
    const { container } = render(<ValidationMessage message="" />)
    expect(container.firstChild).toBeNull()
  })
  it('renders message when provided', () => {
    render(<ValidationMessage message="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })
})

describe('ErrorBanner', () => {
  it('renders nothing when message is empty', () => {
    const { container } = render(<ErrorBanner message="" />)
    expect(container.firstChild).toBeNull()
  })
  it('renders error message', () => {
    render(<ErrorBanner message="Server error" />)
    expect(screen.getByText('Server error')).toBeInTheDocument()
  })
  it('calls onDismiss when dismiss button clicked', async () => {
    const onDismiss = vi.fn()
    render(<ErrorBanner message="Error" onDismiss={onDismiss} />)
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

describe('SSOButton', () => {
  it('renders Google label', () => {
    render(<SSOButton provider="google" />)
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })
  it('renders Microsoft label', () => {
    render(<SSOButton provider="microsoft" />)
    expect(screen.getByText('Continue with Microsoft')).toBeInTheDocument()
  })
  it('is disabled when disabled prop is true', () => {
    render(<SSOButton provider="google" disabled />)
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeDisabled()
  })
})

describe('validation utils', () => {
  it('isValidEmail returns true for valid email', () => {
    expect(isValidEmail('a@b.co')).toBe(true)
    expect(isValidEmail('user@example.com')).toBe(true)
  })
  it('isValidEmail returns false for invalid email', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@.com')).toBe(false)
  })
  it('getPasswordStrength returns strength label', () => {
    expect(getPasswordStrength('').valid).toBe(false)
    expect(getPasswordStrength('short').valid).toBe(false)
    // valid requires 12+ chars, mixed case, digit, symbol
    expect(getPasswordStrength('LongEnough1!').valid).toBe(true)
    expect(getPasswordStrength('LongEnough1!').label).toBe('Strong')
  })
  it('getConfirmPasswordError returns null when match', () => {
    expect(getConfirmPasswordError('abc', 'abc')).toBeNull()
  })
  it('getConfirmPasswordError returns message when mismatch', () => {
    expect(getConfirmPasswordError('abc', 'ab')).not.toBeNull()
  })
})

describe('guards', () => {
  it('ensureArray returns array for array input', () => {
    expect(ensureArray([1, 2])).toEqual([1, 2])
  })
  it('ensureArray returns empty array for non-array', () => {
    expect(ensureArray(null)).toEqual([])
    expect(ensureArray(undefined)).toEqual([])
    expect(ensureArray('x')).toEqual([])
  })
  it('ensureObject returns merged object', () => {
    const def = { a: 1, b: 2 }
    expect(ensureObject({ a: 3 }, def)).toEqual({ a: 3, b: 2 })
  })
  it('ensureObject returns defaults for null', () => {
    const def = { a: 1 }
    expect(ensureObject(null, def)).toEqual({ a: 1 })
  })
})
