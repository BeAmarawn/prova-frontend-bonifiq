import React from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { styles } from './styles'

interface ErrorWidgetStateProps {
  message: string
  loadingRetry: boolean
  onRetry: () => void
}

const ErrorWidgetState: React.FC<ErrorWidgetStateProps> = ({
  message,
  onRetry,
  loadingRetry,
}) => {
  return (
    <div style={styles.error}>
      <div style={styles.errorContent}>
        <AlertCircle size={24} color="#ef4444" />
        <div style={styles.errorMessage}>{message}</div>
        <button onClick={onRetry} style={styles.retryButton}>
          <RefreshCw size={16} style={loadingRetry ? styles.spinner : undefined} />
          Tentar novamente
        </button>
      </div>
    </div>
  )
}

export default ErrorWidgetState
