import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

// GET /coco/drivers/?from_date=&to_date=&status=&city=&cab_type=&search=&page=
export const getDrivers = (filters = {}) => {
  return apiClient.get(ENDPOINTS.DRIVERS, { params: filters })
}

// POST /coco/drivers/add/
export const addDriver = (driverData) => {
  return apiClient.post(ENDPOINTS.DRIVERS_ADD, driverData)
}

// GET /coco/drivers/nearby/?latitude=&longitude=&radius_km=&cab_type=&status=
export const getDriversNearby = ({ latitude, longitude, radius_km = 5, cab_type, status } = {}) => {
  return apiClient.get(ENDPOINTS.DRIVERS_NEARBY, {
    params: { latitude, longitude, radius_km, cab_type, status },
  })
}

// GET /coco/drivers/new-last-90-days/
export const getNewDriversLast90Days = () => {
  return apiClient.get(ENDPOINTS.DRIVERS_NEW_90_DAYS)
}

// GET /coco/drivers/<driver_id>/   → dashboard metrics
export const getDriverMetrics = (driverId) => {
  return apiClient.get(ENDPOINTS.DRIVER_METRICS(driverId))
}

// GET /coco/drivers/<driver_id>/last-trips/
export const getDriverLastTrips = (driverId) => {
  return apiClient.get(ENDPOINTS.DRIVER_LAST_TRIPS(driverId))
}

// GET /coco/drivers/<driver_id>/otp-validation/
export const getDriverOtpValidation = (driverId) => {
  return apiClient.get(ENDPOINTS.DRIVER_OTP_VALIDATION(driverId))
}

// GET /coco/drivers/<driver_id>/vehicle-details/
export const getDriverVehicleDetails = (driverId) => {
  return apiClient.get(ENDPOINTS.DRIVER_VEHICLE_DETAILS(driverId))
}

// GET /coco/drivers/<driver_id>/cancel-history/
export const getDriverCancelHistory = (driverId) => {
  return apiClient.get(ENDPOINTS.DRIVER_CANCEL_HISTORY(driverId))
}

// GET /coco/drivers/<driver_id>/location-history/?from_date=&to_date=
export const getDriverLocationHistory = (driverId, from_date, to_date) => {
  return apiClient.get(ENDPOINTS.DRIVER_LOCATION_HISTORY(driverId), {
    params: { from_date, to_date },
  })
}
