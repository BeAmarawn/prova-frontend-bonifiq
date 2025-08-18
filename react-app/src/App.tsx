import React, { useState, useEffect } from 'react'

import FloatingButton from './components/FloatingButton'
import Widget from './components/Widget'

import { useWidgetVisibility } from './hooks/useWidgetVisibility'

import useUserRepository from './infra/repository/user'
import usePostsRepository from './infra/repository/posts'

import { isMobile } from './utils'
import { PredefinedErrors } from './interfaces'

const App: React.FC = () => {
  const {
    isVisible,
    userId,
    hasLoadedData,
    setHasLoadedData,
    toggleWidget,
    initializeWidget,
  } = useWidgetVisibility()

  const {
    user,
    getUser,
    loading: userLoading,
    error: userError,
  } = useUserRepository()

  const {
    posts,
    getPosts,
    loading: postsLoading,
    error: postsError,
  } = usePostsRepository()

  const [loadingRetry, setLoadingRetry] = useState(false)

  const handleRetryUser = async (errorMessage: string) => {
    if (errorMessage.includes(PredefinedErrors.invalidUserId)) {
      initializeWidget()
      return
    }
    if (!userId) return
    setLoadingRetry(true)
    try {
      await getUser(userId)
    } finally {
      setLoadingRetry(false)
    }
  }

  const handleRetryPosts = async () => {
    if (!userId) return
    setLoadingRetry(true)
    try {
      await getPosts(userId)
    } finally {
      setLoadingRetry(false)
    }
  }

  const handleButtonClick = () => {
    toggleWidget()

    if (userId && !hasLoadedData && !userError && !postsError) {
      getUser(userId)
      setHasLoadedData(true)
    }
    if (hasLoadedData && user?.userId && !isVisible) {
      getPosts(user?.userId)
    }
  }

  useEffect(() => {
    if (user && user.userId) {
      getPosts(user.userId)
    }
  }, [user, getPosts])

  return (
    <>
      <FloatingButton isVisible={isVisible} onClick={handleButtonClick} />

      <Widget
        isVisible={isVisible}
        isMobile={isMobile}
        userId={userId}
        loadingUser={userLoading}
        loadingPosts={postsLoading}
        loadingRetry={loadingRetry}
        error={userError}
        userData={user}
        posts={posts}
        postsError={postsError}
        hasLoadedData={hasLoadedData}
        onRetryUser={handleRetryUser}
        onRetryPosts={handleRetryPosts}
      />
    </>
  )
}

export default App
