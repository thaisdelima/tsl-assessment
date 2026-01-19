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
    headers.Authorization = `Token ${token}`
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Erro na requisição')
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
