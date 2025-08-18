import { type UserData } from '../interfaces'

export interface FormattedUserData {
  userId: number
  name: string
  email: string
}

const userObjectAdapter = (userData: UserData): FormattedUserData => ({
  userId: userData.id,
  name: userData.name,
  email: userData.email,
})

export { userObjectAdapter }
