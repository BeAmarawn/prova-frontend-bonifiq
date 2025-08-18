import { useCallback, useState } from 'react'
import type { AxiosError } from 'axios'

import { getPostsByUserId } from '../services/posts'
import { type FormattedUserPost } from '../../domain/posts'

import { userPostsObjectAdapter } from '../../domain/posts'
import type { Post } from '../../interfaces'

interface PostsRepository {
  loading: boolean
  error: string | null
  posts: FormattedUserPost[] | []
  getPosts: (id: number) => Promise<void>
}

const usePostsRepository = (): PostsRepository => {
  const [posts, setPosts] = useState<FormattedUserPost[] | []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getPosts = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const postsByUserData: Post[] | [] = (await getPostsByUserId(id)).data
      const formattedUserPosts: FormattedUserPost[] | [] =
        userPostsObjectAdapter(postsByUserData)
      setPosts(formattedUserPosts)
    } catch (err) {
      setError((err as AxiosError).message || 'Erro desconhecido')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { posts, loading, error, getPosts }
}

export default usePostsRepository
