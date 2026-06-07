import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

// GET /coco/users/
export const getUsers = () => {
  return apiClient.get(ENDPOINTS.USERS)
}

// POST /coco/users/
export const createUser = (userData) => {
  return apiClient.post(ENDPOINTS.USERS, userData)
}

// POST /coco/users/<id>/toggle-status/
export const toggleUserStatus = (id) => {
  return apiClient.post(ENDPOINTS.USER_TOGGLE_STATUS(id))
}
