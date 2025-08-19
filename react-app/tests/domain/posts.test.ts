import { userPostsObjectAdapter } from '../../src/domain/posts'
import type { Post } from '../../src/interfaces'

describe('userPostsObjectAdapter', () => {
  it('deve adaptar corretamente um array de posts', () => {
    const mockPosts: Post[] = [
      {
        userId: 1,
        id: 1,
        title: 'Primeiro Post',
        body: 'Conteúdo do primeiro post',
      },
      {
        userId: 1,
        id: 2,
        title: 'Segundo Post',
        body: 'Conteúdo do segundo post',
      },
    ]

    const result = userPostsObjectAdapter(mockPosts)

    expect(result).toEqual([
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
    ])
  })

  it('deve mapear id para postId corretamente', () => {
    const mockPosts: Post[] = [
      {
        userId: 123,
        id: 456,
        title: 'Post de Teste',
        body: 'Corpo do post',
      },
    ]

    const result = userPostsObjectAdapter(mockPosts)

    expect(result[0].postId).toBe(456)
    expect(result[0].postId).toBe(mockPosts[0].id)
  })

  it('deve preservar userId, title e body inalterados', () => {
    const mockPosts: Post[] = [
      {
        userId: 999,
        id: 888,
        title: 'Título Preservado',
        body: 'Corpo preservado',
      },
    ]

    const result = userPostsObjectAdapter(mockPosts)

    expect(result[0].userId).toBe(999)
    expect(result[0].title).toBe('Título Preservado')
    expect(result[0].body).toBe('Corpo preservado')
  })

  it('deve retornar array vazio quando não há posts', () => {
    const mockPosts: Post[] = []

    const result = userPostsObjectAdapter(mockPosts)

    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  it('deve funcionar com um único post', () => {
    const mockPosts: Post[] = [
      {
        userId: 1,
        id: 1,
        title: 'Post Único',
        body: 'Conteúdo único',
      },
    ]

    const result = userPostsObjectAdapter(mockPosts)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      userId: 1,
      postId: 1,
      title: 'Post Único',
      body: 'Conteúdo único',
    })
  })

  it('deve funcionar com muitos posts', () => {
    const mockPosts: Post[] = Array.from({ length: 100 }, (_, index) => ({
      userId: 1,
      id: index + 1,
      title: `Post ${index + 1}`,
      body: `Conteúdo do post ${index + 1}`,
    }))

    const result = userPostsObjectAdapter(mockPosts)

    expect(result).toHaveLength(100)
    expect(result[0].postId).toBe(1)
    expect(result[99].postId).toBe(100)
  })

  it('deve funcionar com diferentes tipos de dados', () => {
    const testCases = [
      {
        input: [{ userId: 0, id: 0, title: '', body: '' }],
        expected: [{ userId: 0, postId: 0, title: '', body: '' }],
      },
      {
        input: [
          { userId: -1, id: -1, title: 'Título Negativo', body: 'Corpo Negativo' },
        ],
        expected: [
          {
            userId: -1,
            postId: -1,
            title: 'Título Negativo',
            body: 'Corpo Negativo',
          },
        ],
      },
      {
        input: [
          {
            userId: 999999,
            id: 888888,
            title: 'Título Muito Longo Para Teste',
            body: 'Corpo muito longo para teste com caracteres especiais: !@#$%^&*()',
          },
        ],
        expected: [
          {
            userId: 999999,
            postId: 888888,
            title: 'Título Muito Longo Para Teste',
            body: 'Corpo muito longo para teste com caracteres especiais: !@#$%^&*()',
          },
        ],
      },
    ]

    testCases.forEach(({ input, expected }) => {
      const result = userPostsObjectAdapter(input)
      expect(result).toEqual(expected)
    })
  })
})
