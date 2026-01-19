import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthForm from './AuthForm'

describe('AuthForm', () => {
  it('envia login com valores e reseta campos', async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <AuthForm
        mode="login"
        loading={false}
        serverError={null}
        onLogin={onLogin}
        onRegister={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText(/username or email/i), 'alice')
    await user.type(screen.getByLabelText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(onLogin).toHaveBeenCalledWith({ usernameOrEmail: 'alice', password: 'secret' })
    expect(screen.getByLabelText(/username or email/i)).toHaveValue('')
    expect(screen.getByLabelText(/password/i)).toHaveValue('')
  })

  it('mostra erro do servidor quando recebido', () => {
    render(
      <AuthForm
        mode="login"
        loading={false}
        serverError="Falha no servidor"
        onLogin={vi.fn()}
        onRegister={vi.fn()}
      />,
    )

    expect(screen.getByText('Falha no servidor')).toBeInTheDocument()
  })

  it('impede registro com senhas diferentes', async () => {
    const onRegister = vi.fn()
    const user = userEvent.setup()

    render(
      <AuthForm
        mode="register"
        loading={false}
        serverError={null}
        onLogin={vi.fn()}
        onRegister={onRegister}
      />,
    )

    await user.type(screen.getByLabelText(/username/i), 'alice')
    await user.type(screen.getByLabelText(/e-mail/i), 'alice@mail.com')
    await user.type(screen.getByLabelText(/^password$/i), '123456')
    await user.type(screen.getByLabelText(/confirm password/i), '654321')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
    expect(onRegister).not.toHaveBeenCalled()
  })

  it('realiza registro com senhas iguais e reseta campos', async () => {
    const onRegister = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <AuthForm
        mode="register"
        loading={false}
        serverError={null}
        onLogin={vi.fn()}
        onRegister={onRegister}
      />,
    )

    await user.type(screen.getByLabelText(/username/i), 'alice')
    await user.type(screen.getByLabelText(/e-mail/i), 'alice@mail.com')
    await user.type(screen.getByLabelText(/^password$/i), '123456')
    await user.type(screen.getByLabelText(/confirm password/i), '123456')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(onRegister).toHaveBeenCalledWith({
      username: 'alice',
      email: 'alice@mail.com',
      password1: '123456',
      password2: '123456',
    })
    expect(screen.getByLabelText(/username/i)).toHaveValue('')
    expect(screen.getByLabelText(/e-mail/i)).toHaveValue('')
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('')
    expect(screen.getByLabelText(/confirm password/i)).toHaveValue('')
  })
})
