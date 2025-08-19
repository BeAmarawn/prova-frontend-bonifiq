import '@testing-library/jest-dom'

Object.defineProperty(window, 'loggedUserId', {
  value: 1,
  writable: true,
  configurable: true,
})

declare global {
  interface Window {
    loggedUserId: number
  }
}

//mock do ResizeObserver
global.ResizeObserver =
  global.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

//mock do IntersectionObserver
global.IntersectionObserver =
  global.IntersectionObserver ||
  jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

//mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

//mock do scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
})

//mock do getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: jest.fn().mockReturnValue({
    getPropertyValue: jest.fn(),
  }),
})
