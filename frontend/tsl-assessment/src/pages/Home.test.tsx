import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './Home'
import { useAuth } from '../context/AuthContext'
import { listMessages, createMessage } from '../lib/api'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../lib/api', () => ({
  listMessages: vi.fn(),
  createMessage: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)
const mockedListMessages = vi.mocked(listMessages)
const mockedCreateMessage = vi.mocked(createMessage)

const renderWithClient = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={client}>
      <Home />
    </QueryClientProvider>,
  )
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseAuth.mockReturnValue({ user: null, token: null } as any)
    mockedListMessages.mockResolvedValue([])
  })

  it('exibe loading e depois posts carregados', async () => {
    mockedListMessages.mockResolvedValue([
      { id: 1, user: 'Ana', content: 'Olá', created_at: '2024-01-01T00:00:00Z' },
    ])

    renderWithClient()

    expect(screen.getByText(/loading posts/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(/loading posts/i)).not.toBeInTheDocument())
    expect(screen.getByText('Olá')).toBeInTheDocument()
    expect(screen.getByText(/Ana/)).toBeInTheDocument()
  })

  it('mostra erro ao falhar carregamento', async () => {
    mockedListMessages.mockRejectedValue(new Error('falhou'))

    renderWithClient()

    await waitFor(() => expect(screen.getByText('falhou')).toBeInTheDocument())
  })

  it('mostra mensagem quando não há posts', async () => {
    mockedListMessages.mockResolvedValue([])

    renderWithClient()

    await waitFor(() => expect(screen.getByText(/no posts found/i)).toBeInTheDocument())
  })

  it('bloqueia criação de post sem token', async () => {
    mockedUseAuth.mockReturnValue({ user: { username: 'Ana' }, token: null } as any)
    mockedListMessages.mockResolvedValue([])
    const user = userEvent.setup()

    renderWithClient()

    await user.type(screen.getByLabelText(/new post/i), 'sem token')
    await user.click(screen.getByRole('button', { name: /post/i }))

    await waitFor(() =>
      expect(screen.getByText('You need to be authenticated to post.')).toBeInTheDocument(),
    )
    expect(mockedCreateMessage).not.toHaveBeenCalled()
  })

  it('valida mensagem vazia', async () => {
    mockedUseAuth.mockReturnValue({ user: { username: 'Ana' }, token: 't1' } as any)
    mockedListMessages.mockResolvedValue([])
    const user = userEvent.setup()

    renderWithClient()

    await user.type(screen.getByLabelText(/new post/i), '   ')
    await user.click(screen.getByRole('button', { name: /post/i }))

    expect(screen.getByText('Enter a message to post.')).toBeInTheDocument()
    expect(mockedCreateMessage).not.toHaveBeenCalled()
  })

  it('cria post com sucesso e limpa textarea', async () => {
    mockedUseAuth.mockReturnValue({ user: { username: 'Ana' }, token: 'token-123' } as any)
    mockedListMessages.mockResolvedValue([])
    mockedCreateMessage.mockResolvedValue({
      id: 10,
      user: 'Ana',
      content: 'Novo post',
      created_at: '2024-01-01T00:00:00Z',
    })
    const user = userEvent.setup()

    renderWithClient()

    await user.type(screen.getByLabelText(/new post/i), 'Novo post')
    await user.click(screen.getByRole('button', { name: /post/i }))

    await waitFor(() => expect(mockedCreateMessage).toHaveBeenCalledWith('Novo post', 'token-123'))
    expect(await screen.findByText('Novo post')).toBeInTheDocument()
    expect(screen.getByLabelText(/new post/i)).toHaveValue('')
  })
})
