/* eslint-disable @typescript-eslint/no-explicit-any */
import { isMobile, sendMessageToParent } from '../src/utils'

describe('utils', () => {
  describe('isMobile', () => {
    beforeEach(() => {
      //reseta a largura da janela antes de cada teste
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true,
        configurable: true,
      })
    })

    it('deve retornar true para dispositivos móveis (width <= 480)', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 480,
        writable: true,
        configurable: true,
      })

      expect(isMobile()).toBe(true)
    })

    it('deve retornar true para dispositivos móveis pequenos (width < 480)', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true,
        configurable: true,
      })

      expect(isMobile()).toBe(true)
    })

    it('deve retornar false para desktop (width > 480)', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true,
        configurable: true,
      })

      expect(isMobile()).toBe(false)
    })

    it('deve retornar false para tablets (width > 480)', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 768,
        writable: true,
        configurable: true,
      })

      expect(isMobile()).toBe(false)
    })
  })

  describe('sendMessageToParent', () => {
    let mockPostMessage: jest.MockedFunction<any>
    let originalPostMessage: any

    beforeEach(() => {
      originalPostMessage = window.parent.postMessage
      mockPostMessage = jest.fn()
      window.parent.postMessage = mockPostMessage
    })

    afterEach(() => {
      window.parent.postMessage = originalPostMessage
    })

    it('deve chamar postMessage com a mensagem correta', () => {
      const message = { type: 'TEST', data: 'test data' }

      sendMessageToParent(message)

      expect(mockPostMessage).toHaveBeenCalledWith(message, '*')
    })

    it('deve chamar postMessage com origem correta', () => {
      const message = { type: 'READY' }

      sendMessageToParent(message)

      expect(mockPostMessage).toHaveBeenCalledWith(message, '*')
    })

    it('deve funcionar com diferentes tipos de mensagem', () => {
      const testMessages = [
        { type: 'SHOW_WIDGET' },
        { type: 'HIDE_WIDGET' },
        { type: 'USER_DATA', userId: 123 },
        { type: 'READY' },
      ]

      testMessages.forEach((message) => {
        sendMessageToParent(message)
        expect(mockPostMessage).toHaveBeenCalledWith(message, '*')
      })
    })
  })
})
