import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import FloatingButton from '../../../src/components/FloatingButton'

describe('FloatingButton', () => {
  const mockOnClick = jest.fn()
  const defaultProps = {
    isVisible: false,
    onClick: mockOnClick,
  }

  beforeEach(() => {
    act(() => {
      jest.clearAllMocks()
      jest.useFakeTimers()
    })
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })
  })

  it('deve renderizar corretamente', () => {
    render(<FloatingButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('deve mostrar o ícone de chat quando isVisible for false', () => {
    render(<FloatingButton {...defaultProps} />)

    expect(screen.getByText('💬')).toBeInTheDocument()
  })

  it('deve mostrar o ícone X quando isVisible for true', () => {
    render(<FloatingButton {...defaultProps} isVisible={true} />)

    expect(screen.getByText('✕')).toBeInTheDocument()
  })

  it('deve ter o aria-label correto baseado no estado isVisible', () => {
    const { rerender } = render(<FloatingButton {...defaultProps} />)

    expect(screen.getByLabelText('Abrir widget')).toBeInTheDocument()

    rerender(<FloatingButton {...defaultProps} isVisible={true} />)
    expect(screen.getByLabelText('Fechar widget')).toBeInTheDocument()
  })

  it('deve chamar onClick quando clicado', () => {
    render(<FloatingButton {...defaultProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('deve aplicar animação de entrada após 1 segundo', () => {
    render(<FloatingButton {...defaultProps} />)

    const button = screen.getByRole('button')

    //começa com scale 0 e opacity 0
    expect(button.style.transform).toBe('scale(0)')
    expect(button.style.opacity).toBe('0')

    //avança para 1 segundo e executa os timers
    act(() => {
      jest.advanceTimersByTime(1000)
      jest.runOnlyPendingTimers()
    })

    //aguarda a animação de entrada
    act(() => {
      jest.runOnlyPendingTimers()
    })

    //deve aplicar a animação
    expect(button.style.transform).toBe('scale(1)')
    expect(button.style.opacity).toBe('1')
  })

  it('deve incluir keyframes CSS para a animação', () => {
    render(<FloatingButton {...defaultProps} />)

    const styleElement = document.querySelector('style')
    expect(styleElement).toBeInTheDocument()
    expect(styleElement?.textContent).toContain('@keyframes bounce-scale')
  })
})
