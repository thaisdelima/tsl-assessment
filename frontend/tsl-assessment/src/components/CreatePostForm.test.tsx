import { type FormEvent, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreatePostForm from './CreatePostForm'

describe('CreatePostForm', () => {
  it('atualiza mensagem e envia submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())

    function Wrapper() {
      const [message, setMessage] = useState('')
      return (
        <CreatePostForm
          newMessage={message}
          posting={false}
          postError={null}
          onSubmit={onSubmit}
          onChangeMessage={setMessage}
        />
      )
    }

    render(<Wrapper />)

    await user.type(screen.getByLabelText(/new post/i), 'Olá mundo')
    await user.click(screen.getByRole('button', { name: /post/i }))

    expect(screen.getByLabelText(/new post/i)).toHaveValue('Olá mundo')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('exibe estado de postagem e desabilita botão', () => {
    render(
      <CreatePostForm
        newMessage="Mensagem"
        posting={true}
        postError={null}
        onSubmit={vi.fn()}
        onChangeMessage={vi.fn()}
      />,
    )

    const button = screen.getByRole('button', { name: /posting/i })
    expect(button).toBeDisabled()
  })

  it('mostra erro de postagem quando presente', () => {
    render(
      <CreatePostForm
        newMessage=""
        posting={false}
        postError="Falha ao postar"
        onSubmit={vi.fn()}
        onChangeMessage={vi.fn()}
      />,
    )

    expect(screen.getByText('Falha ao postar')).toBeInTheDocument()
  })
})
