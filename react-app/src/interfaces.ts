export interface UserData {
  id: number
  name: string
  email: string
}

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export const PredefinedErrors = {
  invalidUserId: 'ID de usuário inválido:',
}

export const ParentScriptMessages = {
  SHOW_WIDGET: 'SHOW_WIDGET',
  HIDE_WIDGET: 'HIDE_WIDGET',
  OPEN_WIDGET: 'OPEN_WIDGET',
  CLOSE_WIDGET: 'CLOSE_WIDGET',
  READY: 'READY',
  REQUEST_USER_DATA: 'REQUEST_USER_DATA',
  USER_DATA: 'USER_DATA',
} as const
