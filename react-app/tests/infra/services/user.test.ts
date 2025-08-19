/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserById } from '../../../src/infra/services/user'
import api from '../../../src/infra/config/apiInstance'

jest.mock('../../../src/infra/config/apiInstance', () => ({
  get: jest.fn(),
}))

jest.mock('../../../src/infra/config/apiModules', () => ({
  USERS: '/users',
}))

describe('getUserById', () => {
  let mockApiGet: jest.MockedFunction<typeof api.get>

  beforeEach(() => {
    jest.clearAllMocks()
    mockApiGet = api.get as jest.MockedFunction<typeof api.get>
  })

  it('deve fazer chamada GET para a API com o endpoint correto', () => {
    const userId = 1
    const mockResponse = { data: require('../../fixtures/api/getUserById.json') }

    mockApiGet.mockReturnValue(mockResponse as any)

    const result = getUserById(userId)

    expect(mockApiGet).toHaveBeenCalledWith('/users/1')
    expect(result).toBe(mockResponse)
  })

  it('deve funcionar com diferentes userIds', () => {
    const testCases = [1, 999, 0, -1, 999999]

    testCases.forEach((userId) => {
      const mockResponse = { data: require('../../fixtures/api/getUserById.json') }
      mockApiGet.mockReturnValue(mockResponse as any)

      getUserById(userId)

      expect(mockApiGet).toHaveBeenCalledWith(`/users/${userId}`)
    })
  })

  it('deve usar o módulo USERS correto', () => {
    const userId = 456
    getUserById(userId)

    expect(mockApiGet).toHaveBeenCalledWith('/users/456')
  })

  it('deve retornar a resposta da API', () => {
    const userId = 789
    const mockResponse = {
      data: { id: 789, name: 'Maria', email: 'maria@example.com' },
      status: 200,
      headers: {},
    }

    mockApiGet.mockReturnValue(mockResponse as any)

    const result = getUserById(userId)

    expect(result).toBe(mockResponse)
  })
})
