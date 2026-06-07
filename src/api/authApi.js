import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

export const loginApi = (credentials) => {
  return apiClient.post(ENDPOINTS.LOGIN, credentials)
}

export const logoutApi = () => {
  return apiClient.post(ENDPOINTS.LOGOUT)
}
