import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

// GET /coco/trips/scheduled-3-days/
export const getScheduledTrips3Days = () => {
  return apiClient.get(ENDPOINTS.TRIPS_SCHEDULED_3_DAYS)
}
