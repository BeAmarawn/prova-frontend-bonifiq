import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorWidgetState from '../../../src/components/ErrorWidgetState'

describe('ErrorWidgetState', () => {
  const mockOnRetry = jest.fn()
  const defaultProps = {
    message: 'Erro de teste',
    loadingRetry: false,
    onRetry: mockOnRetry,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar corretamente com a mensagem de erro', () => {
    render(<ErrorWidgetState {...defaultProps} />)

    expect(screen.getByText('Erro de teste')).toBeInTheDocument()
    expect(screen.getByText('Tentar novamente')).toBeInTheDocument()
  })

  it('deve chamar onRetry quando o botão for clicado', () => {
    render(<ErrorWidgetState {...defaultProps} />)

    const retryButton = screen.getByText('Tentar novamente')
    fireEvent.click(retryButton)

    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it('deve mostrar o ícone de alerta', () => {
    render(<ErrorWidgetState {...defaultProps} />)

    const alertIcon = document.querySelector('svg.lucide-circle-alert')
    expect(alertIcon).toBeInTheDocument()
  })

  it('deve mostrar o ícone de refresh no botão', () => {
    render(<ErrorWidgetState {...defaultProps} />)

    const refreshIcon = document.querySelector('svg.lucide-refresh-cw')
    expect(refreshIcon).toBeInTheDocument()
  })

  it('deve aplicar estilo de spinner quando loadingRetry for true', () => {
    render(<ErrorWidgetState {...defaultProps} loadingRetry={true} />)

    const refreshIcon = document.querySelector(
      'svg.lucide-refresh-cw',
    ) as SVGElement | null
    expect(refreshIcon).toBeInTheDocument()
    expect(refreshIcon?.getAttribute('style') || '').toContain(
      'animation: spin 1s linear infinite',
    )
  })
})
