import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

// GET /coco/vehicles/<vehicle_id>/details/
export const getVehicleDetails = (vehicleId) => {
  return apiClient.get(ENDPOINTS.VEHICLE_DETAILS(vehicleId))
}
