import { useState, type ChangeEvent, type FormEvent } from 'react'
import RegisterFields from './RegisterFields'

export type LoginValues = {
  usernameOrEmail: string
  password: string
}

export type RegisterValues = {
  username: string
  email: string
  password1: string
  password2: string
}

type Props = {
  mode: 'login' | 'register'
  loading?: boolean
  serverError?: string | null
  onLogin: (values: LoginValues) => Promise<void>
  onRegister: (values: RegisterValues) => Promise<void>
  onSwitchMode?: () => void
}

export default function AuthForm(props: Props) {
  const isLogin = props.mode === 'login'
  const [values, setValues] = useState<LoginValues | RegisterValues>(() =>
    isLogin
      ? { usernameOrEmail: '', password: '' }
      : { username: '', email: '', password1: '', password2: '' },
  )
  const [localError, setLocalError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (!isLogin) {
      const data = values as RegisterValues
      if (data.password1 !== data.password2) {
        setLocalError('As senhas não coincidem')
        return
      }
    }
    try {
      if (isLogin) {
        await props.onLogin(values as LoginValues)
      } else {
        await props.onRegister(values as RegisterValues)
      }
      setValues(
        isLogin
          ? { usernameOrEmail: '', password: '' }
          : { username: '', email: '', password1: '', password2: '' },
      )
    } catch {
      // Erros já são tratados externamente
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {props.serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {props.serverError}
        </div>
      )}
      {localError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {localError}
        </div>
      )}

      {isLogin ? (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="usernameOrEmail">
              Username or email
            </label>
            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={(values as LoginValues).usernameOrEmail}
              onChange={handleChange}
              className="rounded-md border text-black border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoComplete="username"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={(values as LoginValues).password}
              onChange={handleChange}
              className="rounded-md border text-black border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1  focus:ring-indigo-500"
              autoComplete="current-password"
              required
            />
          </div>
        </>
      ) : (
        <RegisterFields values={values as RegisterValues} onChange={handleChange} />
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={props.loading}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {props.loading ? 'Sending...' : isLogin ? 'Login' : 'Register'}
        </button>
        {props.onSwitchMode && (
          <button
            type="button"
            onClick={props.onSwitchMode}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {isLogin ? 'Criar conta' : 'Já tenho conta'}
          </button>
        )}
      </div>
    </form>
  )
}
