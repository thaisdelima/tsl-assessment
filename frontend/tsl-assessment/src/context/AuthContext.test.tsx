import { act, render, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import {
  login as apiLogin,
  register as apiRegister,
  currentUser,
  logout as apiLogout,
} from '../lib/api'

vi.mock('../lib/api', () => ({
  currentUser: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}))

type AuthState = ReturnType<typeof useAuth> | null

describe('AuthContext', () => {
  let capturedAuth: AuthState = null

  function Consumer() {
    const auth = useAuth()
    capturedAuth = auth
    return <div data-testid="user">{auth.user?.username ?? 'anon'}</div>
  }

  const getAuth = () => {
    if (!capturedAuth) throw new Error('Auth não inicializado')
    return capturedAuth
  }

  beforeEach(() => {
    capturedAuth = null
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('carrega usuário existente quando há token no storage', async () => {
    sessionStorage.setItem('authToken', 'token-123')
    vi.mocked(currentUser).mockResolvedValue({ username: 'alice' })

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    await waitFor(() => expect(getAuth().loading).toBe(false))
    expect(getAuth().user).toEqual({ username: 'alice' })
    expect(sessionStorage.getItem('authToken')).toBe('token-123')
  })

  it('realiza login com sucesso e persiste token', async () => {
    vi.mocked(apiLogin).mockResolvedValue({ key: 'abc' })
    vi.mocked(currentUser).mockResolvedValue({ username: 'bob' })

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    await act(async () => {
      await getAuth().login({ username: 'bob', password: 'pw' })
    })

    await waitFor(() => expect(getAuth().user).toEqual({ username: 'bob' }))
    expect(getAuth().error).toBeNull()
    expect(sessionStorage.getItem('authToken')).toBe('abc')
  })

  it('propaga erro de login e limpa token/usuário', async () => {
    vi.mocked(apiLogin).mockRejectedValue(new Error('fail'))
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    await act(async () => {
      await expect(
        getAuth().login({ username: 'bob', password: 'pw' }),
      ).rejects.toThrow('fail')
    })

    await waitFor(() => expect(getAuth().user).toBeNull())
    expect(getAuth().error).toBe('fail')
    expect(sessionStorage.getItem('authToken')).toBeNull()
    consoleErrorSpy.mockRestore()
  })

  it('faz logout limpando usuário e token', async () => {
    sessionStorage.setItem('authToken', 'token-logout')
    vi.mocked(currentUser).mockResolvedValue({ username: 'carol' })
    vi.mocked(apiLogout).mockResolvedValue()

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    await waitFor(() => expect(getAuth().user).not.toBeNull())

    await act(async () => {
      await getAuth().logout()
    })

    await waitFor(() => expect(getAuth().loading).toBe(false))
    expect(getAuth().user).toBeNull()
    expect(sessionStorage.getItem('authToken')).toBeNull()
  })
})
