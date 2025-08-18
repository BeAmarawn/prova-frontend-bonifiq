import React, { useEffect } from 'react'
import { styles } from './styles'

interface FloatingButtonProps {
  isVisible: boolean
  onClick: () => void
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ isVisible, onClick }) => {
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const scaleBounceStyle: React.CSSProperties = {
    transform: mounted ? 'scale(1)' : 'scale(0)',
    opacity: mounted ? 1 : 0,
    animation: mounted
      ? 'bounce-scale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      : undefined,
  }

  const bounceAnimationKeyframes = `
  @keyframes bounce-scale {
    0% { transform: scale(0); filter: blur(0.5px); }
    50% { transform: scale(1.2); filter: blur(1px); }
    70% { transform: scale(0.8); filter: blur(0.5px); }
    100% { transform: scale(1); filter: blur(0px); }
  }
`

  return (
    <>
      <style>{bounceAnimationKeyframes}</style>
      <button
        style={{ ...styles.floatingButton, ...scaleBounceStyle }}
        onClick={onClick}
        aria-label={isVisible ? 'Fechar widget' : 'Abrir widget'}
      >
        {isVisible ? '✕' : '💬'}
      </button>
    </>
  )
}

export default FloatingButton
