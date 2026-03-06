/**
 * Runtime guards for API response shapes.
 * Use (data ?? []) and Array.isArray checks to avoid runtime errors.
 */

export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  return []
}

export function ensureObject<T extends Record<string, unknown>>(
  value: unknown,
  defaults: T
): T {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return { ...defaults, ...(value as Record<string, unknown>) } as T
  }
  return defaults
}

export function hasString(obj: unknown, key: string): obj is Record<string, string> {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    key in obj &&
    typeof (obj as Record<string, unknown>)[key] === 'string'
  )
}

export function hasOptionalBoolean(obj: unknown, key: string): boolean {
  if (obj === null || typeof obj !== 'object' || !(key in obj)) return false
  const v = (obj as Record<string, unknown>)[key]
  return typeof v === 'boolean'
}
