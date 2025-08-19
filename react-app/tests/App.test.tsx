/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../src/App'

//mock dos hooks e repositórios
jest.mock('../src/hooks/useWidgetVisibility', () => ({
  useWidgetVisibility: jest.fn(),
}))

jest.mock('../src/infra/repository/user', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../src/infra/repository/posts', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../src/utils', () => ({
  isMobile: () => false,
}))

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    const mockedUseWidgetVisibility = require('../src/hooks/useWidgetVisibility')
      .useWidgetVisibility as jest.Mock
    mockedUseWidgetVisibility.mockReturnValue({
      isVisible: false,
      userId: 1,
      hasLoadedData: false,
      setHasLoadedData: jest.fn(),
      toggleWidget: jest.fn(),
      initializeWidget: jest.fn(),
    })

    const mockedUseUserRepository = require('../src/infra/repository/user')
      .default as jest.Mock
    mockedUseUserRepository.mockReturnValue({
      user: null,
      getUser: jest.fn(),
      loading: false,
      error: null,
    })

    const mockedUsePostsRepository = require('../src/infra/repository/posts')
      .default as jest.Mock
    mockedUsePostsRepository.mockReturnValue({
      posts: [],
      getPosts: jest.fn(),
      loading: false,
      error: null,
    })
  })

  it('deve renderizar corretamente', () => {
    render(<App />)

    expect(screen.getByRole('button')).toBeInTheDocument()

    expect(screen.getByText('Perfil do Usuário')).toBeInTheDocument()
  })

  it('deve mostrar o botão flutuante', () => {
    render(<App />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('💬')
  })

  it('deve mostrar o widget quando visível', () => {
    const mockedUseWidgetVisibility = require('../src/hooks/useWidgetVisibility')
      .useWidgetVisibility as jest.Mock
    mockedUseWidgetVisibility.mockReturnValue({
      isVisible: true,
      userId: 1,
      hasLoadedData: false,
      setHasLoadedData: jest.fn(),
      toggleWidget: jest.fn(),
      initializeWidget: jest.fn(),
    })

    render(<App />)

    expect(screen.getByText('Perfil do Usuário')).toBeInTheDocument()
  })

  it('deve chamar toggleWidget quando o botão for clicado', async () => {
    const mockToggleWidget = jest.fn()

    const mockedUseWidgetVisibility = require('../src/hooks/useWidgetVisibility')
      .useWidgetVisibility as jest.Mock
    mockedUseWidgetVisibility.mockReturnValue({
      isVisible: false,
      userId: 1,
      hasLoadedData: false,
      setHasLoadedData: jest.fn(),
      toggleWidget: mockToggleWidget,
      initializeWidget: jest.fn(),
    })

    render(<App />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockToggleWidget).toHaveBeenCalled()
    })
  })

  it('deve mostrar loading quando estiver carregando dados do usuário', () => {
    const mockedUseUserRepository = require('../src/infra/repository/user')
      .default as jest.Mock
    mockedUseUserRepository.mockReturnValue({
      user: null,
      getUser: jest.fn(),
      loading: true,
      error: null,
    })

    render(<App />)

    expect(screen.getByText('Carregando perfil do usuário...')).toBeInTheDocument()
  })

  it('deve mostrar loading quando estiver carregando posts', () => {
    const mockedUseWidgetVisibility = require('../src/hooks/useWidgetVisibility')
      .useWidgetVisibility as jest.Mock
    mockedUseWidgetVisibility.mockReturnValue({
      isVisible: true,
      userId: 1,
      hasLoadedData: false,
      setHasLoadedData: jest.fn(),
      toggleWidget: jest.fn(),
      initializeWidget: jest.fn(),
    })

    const mockedUseUserRepository = require('../src/infra/repository/user')
      .default as jest.Mock
    mockedUseUserRepository.mockReturnValue({
      user: { userId: 1, name: 'João Silva', email: 'joao@example.com' },
      getUser: jest.fn(),
      loading: false,
      error: null,
    })

    const mockedUsePostsRepository = require('../src/infra/repository/posts')
      .default as jest.Mock
    mockedUsePostsRepository.mockReturnValue({
      posts: [],
      getPosts: jest.fn(),
      loading: true,
      error: null,
    })

    render(<App />)

    expect(screen.getByText('Carregando posts...')).toBeInTheDocument()
  })

  it('deve mostrar erro quando houver erro no usuário', () => {
    const mockedUseUserRepository = require('../src/infra/repository/user')
      .default as jest.Mock
    mockedUseUserRepository.mockReturnValue({
      user: null,
      getUser: jest.fn(),
      loading: false,
      error: 'Erro ao carregar usuário',
    })

    render(<App />)

    expect(screen.getByText('Erro ao carregar usuário')).toBeInTheDocument()
  })

  it('deve mostrar erro quando houver erro nos posts', () => {
    const mockedUseWidgetVisibility = require('../src/hooks/useWidgetVisibility')
      .useWidgetVisibility as jest.Mock
    mockedUseWidgetVisibility.mockReturnValue({
      isVisible: true,
      userId: 1,
      hasLoadedData: false,
      setHasLoadedData: jest.fn(),
      toggleWidget: jest.fn(),
      initializeWidget: jest.fn(),
    })

    const mockedUseUserRepository = require('../src/infra/repository/user')
      .default as jest.Mock
    mockedUseUserRepository.mockReturnValue({
      user: { userId: 1, name: 'João Silva', email: 'joao@example.com' },
      getUser: jest.fn(),
      loading: false,
      error: null,
    })

    const mockedUsePostsRepository = require('../src/infra/repository/posts')
      .default as jest.Mock
    mockedUsePostsRepository.mockReturnValue({
      posts: [],
      getPosts: jest.fn(),
      loading: false,
      error: 'Erro ao carregar posts',
    })

    render(<App />)

    expect(screen.getByText('Erro ao carregar posts')).toBeInTheDocument()
  })
})
