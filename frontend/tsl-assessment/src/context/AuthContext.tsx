import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  currentUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '../lib/api'

type AuthUser = {
  username: string
  email?: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
  login: (payload: { username?: string; email?: string; password: string }) => Promise<void>
  register: (payload: {
    username: string
    email: string
    password1: string
    password2: string
  }) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'authToken'

type Props = {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(STORAGE_KEY)
  })
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState<boolean>(!!token)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false
    const load = async () => {
      try {
        const me = await currentUser(token)
        if (cancelled) return
        setUser(me)
      } catch (err) {
        if (cancelled) return
        console.error('Error loading user', err)
        sessionStorage.removeItem(STORAGE_KEY)
        setToken(null)
        setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const persistToken = useCallback((value: string | null) => {
    setToken(value)
    if (typeof window === 'undefined') return
    if (value) {
      sessionStorage.setItem(STORAGE_KEY, value)
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const handleLogin: AuthContextValue['login'] = useCallback(async (payload) => {
    setError(null)
    setLoading(true)
    try {
      const res = await apiLogin(payload)
      persistToken(res.key)
      const me = await currentUser(res.key)
      setUser(me)
    } catch (err) {
      console.error('Error logging in', err)
      setUser(null)
      persistToken(null)
      const message = err instanceof Error ? err.message : 'Error logging in'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [persistToken])

  const handleRegister: AuthContextValue['register'] = useCallback(async (payload) => {
    setError(null)
    setLoading(true)
    try {
      const res = await apiRegister(payload)
      persistToken(res.key)
      const me = await currentUser(res.key)
      setUser(me)
    } catch (err) {
      console.error('Error registering', err)
      setUser(null)
      persistToken(null)
      const message = err instanceof Error ? err.message : 'Error registering'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [persistToken])

  const handleLogout = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      if (token) {
        await apiLogout(token)
      }
    } catch (err) {
      console.warn('Error logging out', err)
    } finally {
      setUser(null)
      persistToken(null)
      setLoading(false)
    }
  }, [persistToken, token])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      token,
      loading,
      error,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      clearError,
    }
  }, [user, token, loading, error, handleLogin, handleRegister, handleLogout, clearError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth should be used within AuthProvider')
  }
  return ctx
}
