import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

export const getRiders = () => {
  return apiClient.get(ENDPOINTS.RIDERS)
}

export const getRiderById = (id) => {
  return apiClient.get(ENDPOINTS.RIDER_BY_ID(id))
}

export const getRiderMetrics = (id) => {
  return apiClient.get(ENDPOINTS.RIDER_METRICS(id))
}

export const getRiderDetailsByPhone = (phone) => {
  return apiClient.get(ENDPOINTS.RIDER_DETAILS_BY_PHONE(phone))
}

export const getRiderTripDetails = (phone) => {
  return apiClient.get(ENDPOINTS.RIDER_TRIP_DETAILS(phone))
}

export const getRiderPendingAmount = (phone) => {
  return apiClient.get(ENDPOINTS.RIDER_PENDING_AMOUNT(phone))
}
