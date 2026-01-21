import { describe, it, expect, beforeEach, afterEach, vi, type MockInstance } from 'vitest'
import { currentUser, createMessage, listMessages, login, register } from './api'

describe('api client', () => {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
  let fetchMock: MockInstance

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sends login request with payload and returns parsed auth response', async () => {
    const payload = { username: 'alice', password: 'secret' }
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ key: 'token-123' }), { status: 200 }),
    )

    const result = await login(payload)

    expect(result).toEqual({ key: 'token-123' })
    expect(fetchMock).toHaveBeenCalledWith(
      `${apiBase}/api/auth/login/`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('attaches Authorization header when token is provided', async () => {
    const token = 'abc-123'
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          user: 'alice',
          content: 'hi there',
          created_at: '2024-01-01T00:00:00Z',
        }),
        { status: 200 },
      ),
    )

    await createMessage('hi there', token)

    expect(fetchMock).toHaveBeenCalledWith(
      `${apiBase}/api/messages/`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ content: 'hi there' }),
        headers: expect.objectContaining({
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('propagates formatted error messages from structured payloads', async () => {
    const errorBody = {
      username: ['taken'],
      password: ['weak', 'short'],
    }
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(errorBody), { status: 400 }),
    )

    await expect(
      register({
        username: 'alice',
        email: 'alice@mail.com',
        password1: '123456',
        password2: '123456',
      }),
    ).rejects.toThrow('username: taken | password: weak | short')
  })

  it('falls back to plain text when the error payload is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('server down', { status: 500 }))

    await expect(listMessages()).rejects.toThrow('server down')
  })

  it('includes auth header on tokenized GET requests', async () => {
    const token = 'token-get'
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ username: 'carol' }), { status: 200 }),
    )

    await currentUser(token)

    expect(fetchMock).toHaveBeenCalledWith(
      `${apiBase}/api/auth/user/`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        }),
      }),
    )
  })
})
