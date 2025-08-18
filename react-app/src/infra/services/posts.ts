import api from '../config/apiInstance'
import apiModules from '../config/apiModules'
import { type Post } from '../../interfaces'

const getPostsByUserId = (id: number) =>
  api.get<Post[]>(`${apiModules.POSTS}?userId=${id}`)

export { getPostsByUserId }
