const sendMessageToParent = (message: { type: string }) => {
  try {
    window.parent.postMessage(message, '*')
  } catch (error) {
    /* istanbul ignore next */
    console.warn('Widget error: Erro ao enviar mensagem:', error)
  }
}

const isMobile = () => window.innerWidth <= 480

export { sendMessageToParent, isMobile }
