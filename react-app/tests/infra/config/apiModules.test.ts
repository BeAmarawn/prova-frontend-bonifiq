import apiModules from '../../../src/infra/config/apiModules'

describe('apiModules', () => {
  it('deve ter a propriedade USERS definida', () => {
    expect(apiModules).toHaveProperty('USERS')
  })

  it('deve ter a propriedade POSTS definida', () => {
    expect(apiModules).toHaveProperty('POSTS')
  })

  it('deve ter apenas as propriedades esperadas', () => {
    const expectedProperties = ['USERS', 'POSTS']
    const actualProperties = Object.keys(apiModules)

    expect(actualProperties).toEqual(expect.arrayContaining(expectedProperties))
    expect(actualProperties).toHaveLength(expectedProperties.length)
  })

  it('deve ter valores de string para as propriedades', () => {
    expect(typeof apiModules.USERS).toBe('string')
    expect(typeof apiModules.POSTS).toBe('string')
  })

  it('deve ter valores não vazios', () => {
    expect(apiModules.USERS).toBeTruthy()
    expect(apiModules.POSTS).toBeTruthy()
  })
})
