async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as Record<string, unknown>
    const msg =
      (body?.message as string) ??
      (body?.error as string) ??
      (Array.isArray(body?.errors)
        ? (body.errors as string[]).join(', ')
        : null)
    if (typeof msg === 'string' && msg.trim()) return msg
  } catch {
    // ignore JSON parse errors
  }
  return `Request failed: ${res.status}`
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
  const url = `${base}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  const token = localStorage.getItem('auth_token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const message = await parseErrorResponse(res)
    if (res.status === 401) {
      localStorage.removeItem('auth_token')
      const isAuthPage = ['/login', '/signup', '/password-reset', '/reset-password', '/email-verification'].some(
        (p) => window.location.pathname.startsWith(p)
      )
      if (!isAuthPage) window.location.href = '/login'
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) => {
    const url =
      params && Object.keys(params).length > 0
        ? `${endpoint}?${new URLSearchParams(params).toString()}`
        : endpoint
    return apiRequest<T>(url)
  },
  post: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
}

export class ApiError extends Error {
  status?: number
  code?: string
  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}
