import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

// GET /coco/trips/scheduled-3-days/
export const getScheduledTrips3Days = () => {
  return apiClient.get(ENDPOINTS.TRIPS_SCHEDULED_3_DAYS)
}

// GET /coco/trips/<trip_id>
export const getTripDetail = (tripId) => {
  return apiClient.get(ENDPOINTS.TRIP_DETAIL(tripId))
}

// GET /coco/trips/<trip_id>/driver-queue/
export const getTripDriverQueue = (tripId) => {
  return apiClient.get(ENDPOINTS.TRIP_DRIVER_QUEUE(tripId))
}

// GET /coco/trips/<trip_id>/location-sync/
export const getTripLocationSync = (tripId) => {
  return apiClient.get(ENDPOINTS.TRIP_LOCATION_SYNC(tripId))
}
