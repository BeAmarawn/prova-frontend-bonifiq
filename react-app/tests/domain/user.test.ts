import { userObjectAdapter } from '../../src/domain/user'
import type { UserData } from '../../src/interfaces'

describe('userObjectAdapter', () => {
  it('deve adaptar corretamente os dados do usuário', () => {
    const mockUserData: UserData = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
    }

    const result = userObjectAdapter(mockUserData)

    expect(result).toEqual({
      userId: 1,
      name: 'João Silva',
      email: 'joao@example.com',
    })
  })

  it('deve mapear id para userId corretamente', () => {
    const mockUserData: UserData = {
      id: 999,
      name: 'Maria Santos',
      email: 'maria@example.com',
    }

    const result = userObjectAdapter(mockUserData)

    expect(result.userId).toBe(999)
    expect(result.userId).toBe(mockUserData.id)
  })

  it('deve preservar name e email inalterados', () => {
    const mockUserData: UserData = {
      id: 123,
      name: 'Pedro Oliveira',
      email: 'pedro@teste.com',
    }

    const result = userObjectAdapter(mockUserData)

    expect(result.name).toBe('Pedro Oliveira')
    expect(result.email).toBe('pedro@teste.com')
  })

  it('deve funcionar com diferentes tipos de dados', () => {
    const testCases = [
      {
        input: { id: 0, name: '', email: '' },
        expected: { userId: 0, name: '', email: '' },
      },
      {
        input: { id: -1, name: 'Teste', email: 'teste@teste.com' },
        expected: { userId: -1, name: 'Teste', email: 'teste@teste.com' },
      },
      {
        input: {
          id: 999999,
          name: 'Nome Muito Longo Para Teste',
          email: 'email.muito.longo@dominio.muito.longo.com',
        },
        expected: {
          userId: 999999,
          name: 'Nome Muito Longo Para Teste',
          email: 'email.muito.longo@dominio.muito.longo.com',
        },
      },
    ]

    testCases.forEach(({ input, expected }) => {
      const result = userObjectAdapter(input)
      expect(result).toEqual(expected)
    })
  })
})
