/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPostsByUserId } from '../../../src/infra/services/posts'
import api from '../../../src/infra/config/apiInstance'

jest.mock('../../../src/infra/config/apiInstance', () => ({
  get: jest.fn(),
}))

jest.mock('../../../src/infra/config/apiModules', () => ({
  POSTS: '/posts',
}))

describe('getPostsByUserId', () => {
  let mockApiGet: jest.MockedFunction<typeof api.get>

  beforeEach(() => {
    jest.clearAllMocks()
    mockApiGet = api.get as jest.MockedFunction<typeof api.get>
  })

  it('deve fazer chamada GET para a API com o endpoint correto', () => {
    const userId = 1
    const mockResponse = {
      data: require('../../fixtures/api/getPostsByUserId.json'),
    }

    mockApiGet.mockReturnValue(mockResponse as any)

    const result = getPostsByUserId(userId)

    expect(mockApiGet).toHaveBeenCalledWith('/posts?userId=1')
    expect(result).toBe(mockResponse)
  })

  it('deve funcionar com diferentes userIds', () => {
    const testCases = [1, 999, 0, -1, 999999]

    testCases.forEach((userId) => {
      const mockResponse = {
        data: [{ userId, id: 1, title: 'Test Post', body: 'Test Body' }],
      }
      mockApiGet.mockReturnValue(mockResponse as any)

      getPostsByUserId(userId)

      expect(mockApiGet).toHaveBeenCalledWith(`/posts?userId=${userId}`)
    })
  })

  it('deve usar o módulo POSTS correto', () => {
    const userId = 456
    getPostsByUserId(userId)

    expect(mockApiGet).toHaveBeenCalledWith('/posts?userId=456')
  })

  it('deve retornar a resposta da API', () => {
    const userId = 789
    const mockResponse = {
      data: [
        { userId: 789, id: 1, title: 'Post do usuário 789', body: 'Corpo do post' },
      ],
      status: 200,
      headers: {},
    }

    mockApiGet.mockReturnValue(mockResponse as any)

    const result = getPostsByUserId(userId)

    expect(result).toBe(mockResponse)
  })

  it('deve lidar com array vazio de posts', async () => {
    const userId = 999
    const mockResponse = { data: [] }

    mockApiGet.mockReturnValue(mockResponse as any)

    const result = await getPostsByUserId(userId)

    expect(result.data).toEqual([])
  })

  it('deve construir a query string corretamente', () => {
    const userId = 123
    getPostsByUserId(userId)

    expect(mockApiGet).toHaveBeenCalledWith('/posts?userId=123')
  })
})
