import { type Post } from '../interfaces'

export interface FormattedUserPost {
  userId: number
  postId: number
  title: string
  body: string
}

const userPostsObjectAdapter = (postData: Post[]): FormattedUserPost[] =>
  postData.map((post: Post) => ({
    userId: post.userId,
    postId: post.id,
    title: post.title,
    body: post.body,
  }))

export { userPostsObjectAdapter }
