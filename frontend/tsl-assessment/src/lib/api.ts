const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

type LoginPayload = {
  username?: string
  email?: string
  password: string
}

type RegisterPayload = {
  username: string
  email: string
  password1: string
  password2: string
}

type User = {
  username: string
  email?: string
}

type AuthResponse = {
  key: string
}

const formatErrorPayload = (payload: unknown): string | null => {
  if (!payload) return null
  if (typeof payload === 'string') return payload
  if (Array.isArray(payload)) {
    const joined = payload
      .map((item) => formatErrorPayload(item))
      .filter(Boolean)
      .join(' | ')
    return joined || null
  }
  if (typeof payload === 'object') {
    const parts = Object.entries(payload as Record<string, unknown>)
      .map(([key, value]) => {
        const formatted = formatErrorPayload(value)
        return formatted ? `${key}: ${formatted}` : key
      })
      .filter(Boolean)
    return parts.length ? parts.join(' | ') : null
  }
  return String(payload)
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const url = new URL(path, API_BASE).toString()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    (headers as Record<string, string>).Authorization = `Token ${token}`
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const bodyText = await res.text()
    let message: string | null = null
    if (bodyText) {
      try {
        const parsed = JSON.parse(bodyText)
        message = formatErrorPayload(parsed)
      } catch {
        message = bodyText
      }
    }
    throw new Error(message || 'Error on request')
  }
  return res.json() as Promise<T>
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/registration/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logout(token: string): Promise<void> {
  await request<void>(
    '/api/auth/logout/',
    {
      method: 'POST',
    },
    token,
  )
}

export async function currentUser(token: string): Promise<User> {
  return request<User>('/api/auth/user/', {}, token)
}

export async function listMessages(): Promise<
  Array<{
    id: number
    user: string
    content: string
    created_at: string
  }>
> {
  return request('/api/messages/')
}

export async function createMessage(
  content: string,
  token: string,
): Promise<{
  id: number
  user: string
  content: string
  created_at: string
}> {
  return request(
    '/api/messages/',
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    },
    token,
  )
}
