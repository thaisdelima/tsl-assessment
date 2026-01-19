import type { ChangeEvent, FC } from 'react'
import type { RegisterValues } from './AuthForm'

type RegisterFieldsProps = {
  values: RegisterValues
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const RegisterFields: FC<RegisterFieldsProps> = ({ values, onChange }) => (
  <>
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700" htmlFor="username">
        Username
      </label>
      <input
        id="username"
        name="username"
        value={values.username}
        onChange={onChange}
        className="rounded-md border text-black border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        autoComplete="username"
        required
      />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700" htmlFor="email">
        E-mail
      </label>
      <input
        id="email"
        type="email"
        name="email"
        value={values.email}
        onChange={onChange}
        className="rounded-md border text-black border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        autoComplete="email"
        required
      />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700" htmlFor="password1">
        Password
      </label>
      <input
        id="password1"
        type="password"
        name="password1"
        value={values.password1}
        onChange={onChange}
        className="rounded-md border text-black border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        autoComplete="new-password"
        required
      />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700" htmlFor="password2">
        Confirm password
      </label>
      <input
        id="password2"
        type="password"
        name="password2"
        value={values.password2}
        onChange={onChange}
        className="rounded-md border text-black border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        autoComplete="new-password"
        required
      />
    </div>
  </>
)

export default RegisterFields
