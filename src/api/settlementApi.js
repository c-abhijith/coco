import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

// GET /coco/settlements/drivers-non-settled/
export const getNonSettledDrivers = () => {
  return apiClient.get(ENDPOINTS.SETTLEMENTS_DRIVERS_NON_SETTLED)
}
