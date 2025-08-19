import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Widget from '../../../src/components/Widget'
import type { FormattedUserData } from '../../../src/domain/user'
import type { FormattedUserPost } from '../../../src/domain/posts'

jest.mock('../../../src/components/ErrorWidgetState', () => {
  return function MockErrorWidgetState({ message, onRetry }: unknown) {
    return (
      <div data-testid="error-widget-state">
        <span>{message}</span>
        <button onClick={onRetry}>Retry</button>
      </div>
    )
  }
})

describe('Widget', () => {
  const mockUserData: FormattedUserData = {
    userId: 1,
    name: 'João Silva',
    email: 'joao@example.com',
  }

  const mockPosts: FormattedUserPost[] = [
    {
      userId: 1,
      postId: 1,
      title: 'Primeiro Post',
      body: 'Conteúdo do primeiro post',
    },
    {
      userId: 1,
      postId: 2,
      title: 'Segundo Post',
      body: 'Conteúdo do segundo post',
    },
  ]

  const defaultProps = {
    isVisible: true,
    isMobile: false,
    userId: 1,
    loadingUser: false,
    loadingPosts: false,
    loadingRetry: false,
    error: null,
    userData: mockUserData,
    posts: mockPosts,
    postsError: null,
    hasLoadedData: true,
    onRetryUser: jest.fn(),
    onRetryPosts: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar corretamente quando visível', () => {
    render(<Widget {...defaultProps} />)

    expect(screen.getByText('Perfil do Usuário')).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@example.com')).toBeInTheDocument()
    expect(screen.getByText('Posts recentes')).toBeInTheDocument()
  })

  it('deve aplicar estilos de visibilidade baseado em isVisible', async () => {
    const { rerender } = render(<Widget {...defaultProps} />)

    let widget = screen.getByTestId('widget') as HTMLElement
    await waitFor(() => {
      expect(widget.style.transform).toBe('scale(1) translateY(0)')
      expect(widget.style.opacity).toBe('1')
      expect(widget.style.visibility).toBe('visible')
    })

    rerender(<Widget {...defaultProps} isVisible={false} />)
    widget = screen.getByTestId('widget') as HTMLElement
    await waitFor(() => {
      expect(widget.style.transform).toBe('scale(0.8) translateY(20px)')
      expect(widget.style.opacity).toBe('0')
      expect(widget.style.visibility).toBe('hidden')
    })
  })

  it('deve aplicar estilos mobile quando isMobile for true', async () => {
    render(<Widget {...defaultProps} isMobile={true} />)

    const widget = screen.getByTestId('widget') as HTMLElement
    await waitFor(() => {
      expect(widget.style.transform).toBe('scale(1) translateY(0)')
      expect(widget.style.opacity).toBe('1')
      expect(widget.style.visibility).toBe('visible')
    })
  })

  it('deve mostrar loading do usuário quando loadingUser for true', () => {
    render(<Widget {...defaultProps} loadingUser={true} />)

    expect(screen.getByText('Carregando perfil do usuário...')).toBeInTheDocument()
  })

  it('deve mostrar loading aguardando dados quando não há userId', () => {
    render(<Widget {...defaultProps} userId={null} hasLoadedData={false} />)

    expect(screen.getByText('Aguardando dados do usuário...')).toBeInTheDocument()
  })

  it('deve mostrar erro do usuário quando error existir', () => {
    render(<Widget {...defaultProps} error="Erro ao carregar usuário" />)

    expect(screen.getByTestId('error-widget-state')).toBeInTheDocument()
    expect(screen.getByText('Erro ao carregar usuário')).toBeInTheDocument()
  })

  it('deve mostrar dados do usuário quando disponível', () => {
    render(<Widget {...defaultProps} />)

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@example.com')).toBeInTheDocument()
  })

  it('deve mostrar loading dos posts quando loadingPosts for true', () => {
    render(<Widget {...defaultProps} loadingPosts={true} />)

    expect(screen.getByText('Carregando posts...')).toBeInTheDocument()
  })

  it('deve mostrar erro dos posts quando postsError existir', () => {
    render(<Widget {...defaultProps} postsError="Erro ao carregar posts" />)

    expect(screen.getByTestId('error-widget-state')).toBeInTheDocument()
    expect(screen.getByText('Erro ao carregar posts')).toBeInTheDocument()
  })

  it('deve mostrar posts quando disponíveis', () => {
    render(<Widget {...defaultProps} />)

    expect(screen.getByText('Primeiro Post')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do primeiro post')).toBeInTheDocument()
    expect(screen.getByText('Segundo Post')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do segundo post')).toBeInTheDocument()
  })

  it('deve mostrar mensagem quando não há posts', () => {
    render(<Widget {...defaultProps} posts={[]} />)

    expect(
      screen.getByText('Seu usuário não possui posts recentes :('),
    ).toBeInTheDocument()
  })

  it('deve chamar onRetryUser quando retry do usuário for clicado', () => {
    const mockOnRetryUser = jest.fn()
    render(<Widget {...defaultProps} error="Erro" onRetryUser={mockOnRetryUser} />)

    const retryButton = screen.getByText('Retry')
    retryButton.click()

    expect(mockOnRetryUser).toHaveBeenCalledWith('Erro')
  })

  it('deve chamar onRetryPosts quando retry dos posts for clicado', () => {
    const mockOnRetryPosts = jest.fn()
    render(
      <Widget
        {...defaultProps}
        postsError="Erro posts"
        onRetryPosts={mockOnRetryPosts}
      />,
    )

    const retryButton = screen.getByText('Retry')
    retryButton.click()

    expect(mockOnRetryPosts).toHaveBeenCalled()
  })
})
