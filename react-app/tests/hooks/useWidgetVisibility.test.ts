/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react'
import { useWidgetVisibility } from '../../src/hooks/useWidgetVisibility'

jest.mock('../../src/utils', () => ({
  sendMessageToParent: jest.fn(),
}))

const mockLoggedUserId = 1

describe('useWidgetVisibility', () => {
  let mockSendMessageToParent: jest.MockedFunction<any>

  beforeEach(() => {
    jest.clearAllMocks()

    mockSendMessageToParent = require('../../src/utils').sendMessageToParent

    Object.defineProperty(window, 'loggedUserId', {
      value: mockLoggedUserId,
      writable: true,
    })

    jest.spyOn(window, 'addEventListener').mockImplementation(() => {})
    jest.spyOn(window, 'removeEventListener').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('deve inicializar com valores padrão', () => {
    Object.defineProperty(window, 'loggedUserId', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useWidgetVisibility())

    expect(result.current.isVisible).toBe(false)
    expect(result.current.userId).toBe(null)
    expect(result.current.hasLoadedData).toBe(false)
  })

  it('deve inicializar o widget e enviar mensagens corretas', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    act(() => {
      result.current.initializeWidget()
    })

    expect(mockSendMessageToParent).toHaveBeenCalledWith({ type: 'READY' })
    expect(mockSendMessageToParent).toHaveBeenCalledWith({
      type: 'REQUEST_USER_DATA',
    })
  })

  it('deve definir userId quando loggedUserId estiver disponível', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    act(() => {
      result.current.initializeWidget()
    })

    expect(result.current.userId).toBe(mockLoggedUserId)
  })

  it('deve abrir o widget e enviar mensagem correta', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    act(() => {
      result.current.openWidget()
    })

    expect(result.current.isVisible).toBe(true)
    expect(mockSendMessageToParent).toHaveBeenCalledWith({ type: 'OPEN_WIDGET' })
  })

  it('deve fechar o widget e enviar mensagem correta', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    act(() => {
      result.current.openWidget()
    })

    act(() => {
      result.current.closeWidget()
    })

    expect(result.current.isVisible).toBe(false)
    expect(mockSendMessageToParent).toHaveBeenCalledWith({ type: 'CLOSE_WIDGET' })
  })

  it('deve alternar o widget corretamente', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    act(() => {
      result.current.toggleWidget()
    })

    expect(result.current.isVisible).toBe(true)

    act(() => {
      result.current.toggleWidget()
    })

    expect(result.current.isVisible).toBe(false)
  })

  it('deve definir hasLoadedData quando setHasLoadedData for chamado', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    act(() => {
      result.current.setHasLoadedData(true)
    })

    expect(result.current.hasLoadedData).toBe(true)
  })

  it('deve configurar event listeners na inicialização', () => {
    renderHook(() => useWidgetVisibility())

    expect(window.addEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    )
  })

  it('deve limpar event listeners na desmontagem', () => {
    const { unmount } = renderHook(() => useWidgetVisibility())

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    )
  })

  it('deve lidar com mensagem USER_DATA corretamente', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    const mockEvent = {
      data: {
        type: 'USER_DATA',
        userId: 456,
      },
    } as MessageEvent

    const eventListener = (window.addEventListener as jest.Mock).mock.calls[0][1]

    act(() => {
      eventListener(mockEvent)
    })

    expect(result.current.userId).toBe(456)
    expect(result.current.hasLoadedData).toBe(false)
  })

  it('deve lidar com mensagem SHOW_WIDGET corretamente', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    const mockEvent = {
      data: {
        type: 'SHOW_WIDGET',
      },
    } as MessageEvent

    const eventListener = (window.addEventListener as jest.Mock).mock.calls[0][1]

    act(() => {
      eventListener(mockEvent)
    })

    expect(result.current.isVisible).toBe(true)
  })

  it('deve lidar com mensagem HIDE_WIDGET corretamente', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    const showEvent = {
      data: {
        type: 'SHOW_WIDGET',
      },
    } as MessageEvent

    const eventListener = (window.addEventListener as jest.Mock).mock.calls[0][1]

    act(() => {
      eventListener(showEvent)
    })

    expect(result.current.isVisible).toBe(true)

    const hideEvent = {
      data: {
        type: 'HIDE_WIDGET',
      },
    } as MessageEvent

    act(() => {
      eventListener(hideEvent)
    })

    expect(result.current.isVisible).toBe(false)
  })

  it('deve lidar com mensagem INIT corretamente', () => {
    const { result } = renderHook(() => useWidgetVisibility())

    const mockEvent = {
      data: {
        type: 'INIT',
        userId: 789,
      },
    } as MessageEvent

    const eventListener = (window.addEventListener as jest.Mock).mock.calls[0][1]

    act(() => {
      eventListener(mockEvent)
    })

    expect(result.current.userId).toBe(789)
    expect(result.current.hasLoadedData).toBe(false)
  })
})
