import { useCallback, useState } from 'react'
import type { AxiosError } from 'axios'

import { getUserById } from '../services/user'
import { type FormattedUserData } from '../../domain/user'

import { userObjectAdapter } from '../../domain/user'
import { PredefinedErrors, type UserData } from '../../interfaces'

interface UserRepository {
  loading: boolean
  error: string | null
  user: FormattedUserData | null
  getUser: (id: number) => Promise<void>
}

const useUserRepository = (): UserRepository => {
  const [user, setUser] = useState<FormattedUserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUser = useCallback(async (id: number) => {
    if (!(id > 0 && Number.isInteger(id))) {
      setError(`${PredefinedErrors.invalidUserId} ${id}`)
      setUser(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userData: UserData = (await getUserById(id)).data
      const formattedUserData: FormattedUserData = userObjectAdapter(userData)
      setUser(formattedUserData)
    } catch (err) {
      setError((err as AxiosError).message || 'Erro desconhecido')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, loading, error, getUser }
}

export default useUserRepository
