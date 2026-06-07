import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

export const getComplaints = () => {
  return apiClient.get(ENDPOINTS.COMPLAINTS)
}

export const getComplaintById = (id) => {
  return apiClient.get(ENDPOINTS.COMPLAINT_BY_ID(id))
}
