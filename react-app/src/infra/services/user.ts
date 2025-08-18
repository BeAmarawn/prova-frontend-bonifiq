import api from '../config/apiInstance'
import apiModules from '../config/apiModules'
import { type UserData } from '../../interfaces'

const getUserById = (id: number) => api.get<UserData>(`${apiModules.USERS}/${id}`)

export { getUserById }
