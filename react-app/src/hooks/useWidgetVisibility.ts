import { useState, useEffect, useCallback } from 'react'
import { ParentScriptMessages } from '../interfaces'
import { sendMessageToParent } from '../utils'

const {
  SHOW_WIDGET,
  HIDE_WIDGET,
  OPEN_WIDGET,
  CLOSE_WIDGET,
  READY,
  REQUEST_USER_DATA,
  USER_DATA,
} = ParentScriptMessages

export function useWidgetVisibility() {
  const [isVisible, setIsVisible] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [hasLoadedData, setHasLoadedData] = useState(false)

  const handleUserDataMessage = useCallback(
    (receivedUserId: number | null) => {
      if (receivedUserId && receivedUserId !== userId) {
        setUserId(receivedUserId)
        setHasLoadedData(false)
      }
    },
    [userId],
  )

  const handleShowWidget = useCallback(() => {
    setIsVisible(true)
  }, [])

  const handleHideWidget = useCallback(() => {
    setIsVisible(false)
  }, [])

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const { type, userId: receivedUserId } = event.data || {}
      switch (type) {
        case 'INIT':
        case USER_DATA:
          handleUserDataMessage(receivedUserId)
          break
        case SHOW_WIDGET:
          handleShowWidget()
          break
        case HIDE_WIDGET:
          handleHideWidget()
          break
      }
    },
    [handleUserDataMessage, handleShowWidget, handleHideWidget],
  )

  const initializeWidget = useCallback(() => {
    const loggedUserId = (window as Window).loggedUserId
    if (loggedUserId && !userId) setUserId(loggedUserId)

    sendMessageToParent({ type: READY })
    sendMessageToParent({ type: REQUEST_USER_DATA })
  }, [userId])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    initializeWidget()
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage, initializeWidget])

  const openWidget = useCallback(() => {
    sendMessageToParent({ type: OPEN_WIDGET })
    setIsVisible(true)
  }, [])

  const closeWidget = useCallback(() => {
    sendMessageToParent({ type: CLOSE_WIDGET })
    setIsVisible(false)
  }, [])

  const toggleWidget = useCallback(() => {
    isVisible ? closeWidget() : openWidget()
  }, [isVisible, openWidget, closeWidget])

  return {
    isVisible,
    userId,
    hasLoadedData,
    setHasLoadedData,
    openWidget,
    closeWidget,
    toggleWidget,
    initializeWidget,
  }
}
