import React from 'react'
import { User, Mail, MessageCircle } from 'lucide-react'

import ErrorWidgetState from '../ErrorWidgetState'
import { styles } from './styles'

import type { FormattedUserData } from '../../domain/user'
import type { FormattedUserPost } from '../../domain/posts'

interface WidgetProps {
  isVisible: boolean
  isMobile: boolean
  userId: number | null
  loadingUser: boolean
  loadingPosts: boolean
  loadingRetry: boolean
  error: string | null
  userData: FormattedUserData | null
  posts: FormattedUserPost[]
  postsError: string | null
  hasLoadedData: boolean
  onRetryUser: (error: string) => void
  onRetryPosts: () => void
}

const Widget: React.FC<WidgetProps> = ({
  isVisible,
  isMobile,
  userId,
  loadingUser,
  loadingPosts,
  loadingRetry,
  error,
  userData,
  posts,
  postsError,
  hasLoadedData,
  onRetryUser,
  onRetryPosts,
}) => {
  const visibilityStyles = {
    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? ('visible' as const) : ('hidden' as const),
    pointerEvents: isVisible ? ('auto' as const) : ('none' as const),
  }

  const widgetStyle = isMobile
    ? { ...styles.widget, ...styles.mobileWidget, ...visibilityStyles }
    : { ...styles.widget, ...visibilityStyles }

  const showLoadingUser = loadingUser || (!userId && !hasLoadedData)
  const showUserError = !!error
  const showUserData = userData && !loadingUser && !error

  return (
    <div style={widgetStyle} data-testid="widget">
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <User size={20} />
          Perfil do Usuário
        </div>
      </div>

      <div style={styles.content}>
        {showLoadingUser && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            {userId
              ? 'Carregando perfil do usuário...'
              : 'Aguardando dados do usuário...'}
          </div>
        )}

        {showUserError && (
          <ErrorWidgetState
            message={error!}
            onRetry={() => onRetryUser(error)}
            loadingRetry={loadingRetry}
          />
        )}

        {showUserData && (
          <>
            <div style={styles.userCard}>
              <div style={styles.userName}>{userData.name}</div>
              <div style={styles.userDetail}>
                <Mail size={14} /> {userData.email}
              </div>
            </div>

            <div style={styles.postsSection}>
              <div style={styles.sectionTitle}>
                <MessageCircle size={16} />
                Posts recentes
              </div>

              {loadingPosts && (
                <div style={styles.loading}>
                  <div style={styles.spinner}></div>
                  Carregando posts...
                </div>
              )}

              {!loadingPosts && postsError ? (
                <ErrorWidgetState
                  message={postsError}
                  onRetry={onRetryPosts}
                  loadingRetry={loadingRetry}
                />
              ) : (
                !loadingPosts &&
                (posts.length === 0 ? (
                  <div style={styles.postBody}>
                    Seu usuário não possui posts recentes :(
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.postId + post.title} style={styles.postCard}>
                      <div style={styles.postTitle}>{post.title}</div>
                      <div style={styles.postBody}>{post.body}</div>
                    </div>
                  ))
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Widget
