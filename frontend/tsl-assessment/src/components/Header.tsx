import { useState } from 'react'
import AuthForm from './AuthForm'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, loading, error, login, register, logout, clearError } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)

  const closePanel = () => {
    setOpen(false)
    clearError()
  }

  const handleLogin = async (values: { usernameOrEmail: string; password: string }) => {
    setSubmitting(true)
    clearError()
    const { usernameOrEmail, password } = values
    const payload = usernameOrEmail.includes('@')
      ? { email: usernameOrEmail, password }
      : { username: usernameOrEmail, password }
    try {
      await login(payload)
      closePanel()
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (values: {
    username: string
    email: string
    password1: string
    password2: string
  }) => {
    setSubmitting(true)
    clearError()
    try {
      await register(values)
      closePanel()
    } finally {
      setSubmitting(false)
    }
  }

  const togglePanel = () => {
    if (open) {
      closePanel()
    } else {
      setOpen(true)
    }
  }

  const switchMode = () => {
    clearError()
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
  }

  const handleLogout = async () => {
    await logout()
    closePanel()
  }

  return (
    <header className="border-b border-blue-200 bg-blue-100">
      <div className="relative mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <span className="text-xl font-bold text-gray-900">Wall App</span>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Hello, {user.username}</span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Logout...' : 'Logout'}
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={togglePanel}
              className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login or create account
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-blue-200 bg-white p-4 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    {mode === 'login' ? 'Login' : 'Register'}
                  </h2>
                  <button
                    type="button"
                    onClick={togglePanel}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
                <AuthForm
                  mode={mode}
                  loading={submitting || loading}
                  serverError={error}
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  onSwitchMode={switchMode}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header