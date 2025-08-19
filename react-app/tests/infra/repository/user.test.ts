/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react'
import useUserRepository from '../../../src/infra/repository/user'
import { getUserById } from '../../../src/infra/services/user'
import { userObjectAdapter } from '../../../src/domain/user'
import { PredefinedErrors } from '../../../src/interfaces'

// Mock dos serviços
jest.mock('../../../src/infra/services/user', () => ({
  getUserById: jest.fn(),
}))

jest.mock('../../../src/domain/user', () => ({
  userObjectAdapter: jest.fn(),
}))

// Mock do axios error
const mockAxiosError = {
  message: 'Erro de rede',
  isAxiosError: true,
}

// Mock da resposta Axios
const createMockAxiosResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
})

describe('useUserRepository', () => {
  let mockGetUserById: jest.MockedFunction<typeof getUserById>
  let mockUserObjectAdapter: jest.MockedFunction<typeof userObjectAdapter>

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserById = getUserById as jest.MockedFunction<typeof getUserById>
    mockUserObjectAdapter = userObjectAdapter as jest.MockedFunction<
      typeof userObjectAdapter
    >
  })

  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => useUserRepository())

    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('deve retornar objeto com propriedades corretas', () => {
    const { result } = renderHook(() => useUserRepository())

    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('getUser')
  })

  it('deve validar userId válido e fazer chamada para API', async () => {
    const mockUserData = require('../../fixtures/api/getUserById.json')
    const mockFormattedUser = { userId: 1, name: 'João', email: 'joao@example.com' }

    mockGetUserById.mockResolvedValue(createMockAxiosResponse(mockUserData))
    mockUserObjectAdapter.mockReturnValue(mockFormattedUser)

    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(1)
    })

    expect(mockGetUserById).toHaveBeenCalledWith(1)
    expect(mockUserObjectAdapter).toHaveBeenCalledWith(mockUserData)
    expect(result.current.user).toEqual(mockFormattedUser)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('deve definir loading como true durante a chamada da API', async () => {
    const mockUserData = require('../../fixtures/api/getUserById.json')
    const mockFormattedUser = { userId: 1, name: 'João', email: 'joao@example.com' }

    mockGetUserById.mockResolvedValue(createMockAxiosResponse(mockUserData))
    mockUserObjectAdapter.mockReturnValue(mockFormattedUser)

    const { result } = renderHook(() => useUserRepository())

    // Inicia a chamada
    act(() => {
      result.current.getUser(1)
    })

    // Durante a chamada, loading deve ser true
    expect(result.current.loading).toBe(true)

    // Aguarda a conclusão
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // Após a conclusão, loading deve ser false
    expect(result.current.loading).toBe(false)
  })

  it('deve retornar erro para userId inválido (não inteiro)', async () => {
    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(1.5)
    })

    expect(result.current.error).toBe(`${PredefinedErrors.invalidUserId} 1.5`)
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(mockGetUserById).not.toHaveBeenCalled()
  })

  it('deve retornar erro para userId inválido (zero)', async () => {
    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(0)
    })

    expect(result.current.error).toBe(`${PredefinedErrors.invalidUserId} 0`)
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(mockGetUserById).not.toHaveBeenCalled()
  })

  it('deve retornar erro para userId inválido (negativo)', async () => {
    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(-1)
    })

    expect(result.current.error).toBe(`${PredefinedErrors.invalidUserId} -1`)
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(mockGetUserById).not.toHaveBeenCalled()
  })

  it('deve lidar com erro da API', async () => {
    mockGetUserById.mockRejectedValue(mockAxiosError)

    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(1)
    })

    expect(result.current.error).toBe('Erro de rede')
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  it('deve lidar com erro desconhecido da API', async () => {
    const unknownError = { message: undefined }
    mockGetUserById.mockRejectedValue(unknownError)

    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(1)
    })

    expect(result.current.error).toBe('Erro desconhecido')
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  it('deve limpar erro anterior antes de nova chamada', async () => {
    const mockUserData = require('../../fixtures/api/getUserById.json')
    const mockFormattedUser = { userId: 1, name: 'João', email: 'joao@example.com' }

    // Primeira chamada com erro
    mockGetUserById.mockRejectedValueOnce(mockAxiosError)
    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(1)
    })

    expect(result.current.error).toBe('Erro de rede')

    // Segunda chamada com sucesso
    mockGetUserById.mockResolvedValue(createMockAxiosResponse(mockUserData))
    mockUserObjectAdapter.mockReturnValue(mockFormattedUser)

    await act(async () => {
      await result.current.getUser(1)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.user).toEqual(mockFormattedUser)
  })

  it('deve limpar usuário anterior quando houver erro', async () => {
    const mockUserData = require('../../fixtures/api/getUserById.json')
    const mockFormattedUser = { userId: 1, name: 'João', email: 'joao@example.com' }

    // Primeira chamada com sucesso
    mockGetUserById.mockResolvedValueOnce(createMockAxiosResponse(mockUserData))
    mockUserObjectAdapter.mockReturnValueOnce(mockFormattedUser)

    const { result } = renderHook(() => useUserRepository())

    await act(async () => {
      await result.current.getUser(1)
    })

    expect(result.current.user).toEqual(mockFormattedUser)

    // Segunda chamada com erro
    mockGetUserById.mockRejectedValueOnce(mockAxiosError)

    await act(async () => {
      await result.current.getUser(1)
    })

    expect(result.current.user).toBe(null)
    expect(result.current.error).toBe('Erro de rede')
  })
})
