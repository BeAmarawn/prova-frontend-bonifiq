/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react'
import usePostsRepository from '../../../src/infra/repository/posts'
import { getPostsByUserId } from '../../../src/infra/services/posts'
import { userPostsObjectAdapter } from '../../../src/domain/posts'

jest.mock('../../../src/infra/services/posts', () => ({
  getPostsByUserId: jest.fn(),
}))

jest.mock('../../../src/domain/posts', () => ({
  userPostsObjectAdapter: jest.fn(),
}))

const mockAxiosError = {
  message: 'Erro de rede',
  isAxiosError: true,
}

const createMockAxiosResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
})

describe('usePostsRepository', () => {
  let mockGetPostsByUserId: jest.MockedFunction<typeof getPostsByUserId>
  let mockUserPostsObjectAdapter: jest.MockedFunction<typeof userPostsObjectAdapter>

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetPostsByUserId = getPostsByUserId as jest.MockedFunction<
      typeof getPostsByUserId
    >
    mockUserPostsObjectAdapter = userPostsObjectAdapter as jest.MockedFunction<
      typeof userPostsObjectAdapter
    >
  })

  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => usePostsRepository())

    expect(result.current.posts).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('deve retornar objeto com propriedades corretas', () => {
    const { result } = renderHook(() => usePostsRepository())

    expect(result.current).toHaveProperty('posts')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('getPosts')
  })

  it('deve fazer chamada para API e retornar posts formatados', async () => {
    const mockPostsData = require('../../fixtures/api/getPostsByUserId.json')
    const mockFormattedPosts = [
      { userId: 1, postId: 1, title: 'Post 1', body: 'Corpo 1' },
      { userId: 1, postId: 2, title: 'Post 2', body: 'Corpo 2' },
    ]

    mockGetPostsByUserId.mockResolvedValue(createMockAxiosResponse(mockPostsData))
    mockUserPostsObjectAdapter.mockReturnValue(mockFormattedPosts)

    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(mockGetPostsByUserId).toHaveBeenCalledWith(1)
    expect(mockUserPostsObjectAdapter).toHaveBeenCalledWith(mockPostsData)
    expect(result.current.posts).toEqual(mockFormattedPosts)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('deve definir loading como true durante a chamada da API', async () => {
    const mockPostsData = require('../../fixtures/api/getPostsByUserId.json')
    const mockFormattedPosts = [
      { userId: 1, postId: 1, title: 'Post 1', body: 'Corpo 1' },
    ]

    mockGetPostsByUserId.mockResolvedValue(createMockAxiosResponse(mockPostsData))
    mockUserPostsObjectAdapter.mockReturnValue(mockFormattedPosts)

    const { result } = renderHook(() => usePostsRepository())

    act(() => {
      result.current.getPosts(1)
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
  })

  it('deve lidar com array vazio de posts', async () => {
    const mockPostsData: any[] = []
    const mockFormattedPosts: any[] = []

    mockGetPostsByUserId.mockResolvedValue(createMockAxiosResponse(mockPostsData))
    mockUserPostsObjectAdapter.mockReturnValue(mockFormattedPosts)

    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.posts).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('deve lidar com erro da API', async () => {
    mockGetPostsByUserId.mockRejectedValue(mockAxiosError)

    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.error).toBe('Erro de rede')
    expect(result.current.posts).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('deve lidar com erro desconhecido da API', async () => {
    const unknownError = { message: undefined }
    mockGetPostsByUserId.mockRejectedValue(unknownError)

    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.error).toBe('Erro desconhecido')
    expect(result.current.posts).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('deve limpar erro anterior antes de nova chamada', async () => {
    const mockPostsData = require('../../fixtures/api/getPostsByUserId.json')
    const mockFormattedPosts = [
      { userId: 1, postId: 1, title: 'Post 1', body: 'Corpo 1' },
    ]

    mockGetPostsByUserId.mockRejectedValueOnce(mockAxiosError)
    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.error).toBe('Erro de rede')

    mockGetPostsByUserId.mockResolvedValue(createMockAxiosResponse(mockPostsData))
    mockUserPostsObjectAdapter.mockReturnValue(mockFormattedPosts)

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.posts).toEqual(mockFormattedPosts)
  })

  it('deve limpar posts anteriores quando houver erro', async () => {
    const mockPostsData = require('../../fixtures/api/getPostsByUserId.json')
    const mockFormattedPosts = [
      { userId: 1, postId: 1, title: 'Post 1', body: 'Corpo 1' },
    ]

    mockGetPostsByUserId.mockResolvedValueOnce(
      createMockAxiosResponse(mockPostsData),
    )
    mockUserPostsObjectAdapter.mockReturnValueOnce(mockFormattedPosts)

    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.posts).toEqual(mockFormattedPosts)

    mockGetPostsByUserId.mockRejectedValueOnce(mockAxiosError)

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe('Erro de rede')
  })

  it('deve funcionar com diferentes userIds', async () => {
    const mockPostsData = [
      { userId: 999, id: 1, title: 'Post do usuário 999', body: 'Corpo do post' },
    ]
    const mockFormattedPosts = [
      {
        userId: 999,
        postId: 1,
        title: 'Post do usuário 999',
        body: 'Corpo do post',
      },
    ]

    mockGetPostsByUserId.mockResolvedValue(createMockAxiosResponse(mockPostsData))
    mockUserPostsObjectAdapter.mockReturnValue(mockFormattedPosts)

    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(999)
    })

    expect(mockGetPostsByUserId).toHaveBeenCalledWith(999)
    expect(result.current.posts).toEqual(mockFormattedPosts)
  })

  it('deve funcionar com muitos posts', async () => {
    const mockPostsData = Array.from({ length: 100 }, (_, index) => ({
      userId: 1,
      id: index + 1,
      title: `Post ${index + 1}`,
      body: `Corpo do post ${index + 1}`,
    }))

    const mockFormattedPosts = Array.from({ length: 100 }, (_, index) => ({
      userId: 1,
      postId: index + 1,
      title: `Post ${index + 1}`,
      body: `Corpo do post ${index + 1}`,
    }))

    mockGetPostsByUserId.mockResolvedValue(createMockAxiosResponse(mockPostsData))
    mockUserPostsObjectAdapter.mockReturnValue(mockFormattedPosts)

    const { result } = renderHook(() => usePostsRepository())

    await act(async () => {
      await result.current.getPosts(1)
    })

    expect(result.current.posts).toHaveLength(100)
    expect(result.current.posts[0].postId).toBe(1)
    expect(result.current.posts[99].postId).toBe(100)
  })
})
