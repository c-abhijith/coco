// All backend API endpoint paths (base: /coco/)
export const ENDPOINTS = {
  // ── Drivers ──────────────────────────────────────────────────────────────
  // GET  /coco/drivers/?from_date=&to_date=&status=&city=&cab_type=&search=&page=
  DRIVERS: '/coco/drivers/',

  // POST /coco/drivers/add/
  DRIVERS_ADD: '/coco/drivers/add/',

  // GET  /coco/drivers/nearby/?latitude=&longitude=&radius_km=&cab_type=&status=
  DRIVERS_NEARBY: '/coco/drivers/nearby/',

  // GET  /coco/drivers/new-last-90-days/
  DRIVERS_NEW_90_DAYS: '/coco/drivers/new-last-90-days/',

  // GET  /coco/drivers/<driver_id>/
  DRIVER_METRICS: (driverId) => `/coco/drivers/${driverId}/`,

  // GET  /coco/drivers/<driver_id>/last-trips/
  DRIVER_LAST_TRIPS: (driverId) => `/coco/drivers/${driverId}/last-trips/`,

  // GET  /coco/drivers/<driver_id>/otp-validation/
  DRIVER_OTP_VALIDATION: (driverId) => `/coco/drivers/${driverId}/otp-validation/`,

  // GET  /coco/drivers/<driver_id>/vehicle-details/
  DRIVER_VEHICLE_DETAILS: (driverId) => `/coco/drivers/${driverId}/vehicle-details/`,

  // GET  /coco/drivers/<driver_id>/cancel-history/
  DRIVER_CANCEL_HISTORY: (driverId) => `/coco/drivers/${driverId}/cancel-history/`,

  // GET  /coco/drivers/<driver_id>/location-history/?from_date=&to_date=
  DRIVER_LOCATION_HISTORY: (driverId) => `/coco/drivers/${driverId}/location-history/`,

  // ── Vehicles ─────────────────────────────────────────────────────────────
  // GET  /coco/vehicles/<vehicle_id>/details/
  VEHICLE_DETAILS: (vehicleId) => `/coco/vehicles/${vehicleId}/details/`,

  // ── Riders ───────────────────────────────────────────────────────────────
  // GET  /coco/riders/<phone>/details/
  RIDER_DETAILS_BY_PHONE: (phone) => `/coco/riders/${phone}/details/`,

  // GET  /coco/riders/<phone>/trip-details/
  RIDER_TRIP_DETAILS: (phone) => `/coco/riders/${phone}/trip-details/`,

  // GET  /coco/riders/<phone>/pending-amount/
  RIDER_PENDING_AMOUNT: (phone) => `/coco/riders/${phone}/pending-amount/`,

  // ── Trips ─────────────────────────────────────────────────────────────────
  // GET  /coco/trips/scheduled-3-days/
  TRIPS_SCHEDULED_3_DAYS: '/coco/trips/scheduled-3-days/',

  // GET  /coco/trips/<trip_id>
  TRIP_DETAIL: (tripId) => `/coco/trips/${tripId}`,

  // GET  /coco/trips/<trip_id>/driver-queue/
  TRIP_DRIVER_QUEUE: (tripId) => `/coco/trips/${tripId}/driver-queue/`,

  // GET  /coco/trips/<trip_id>/location-sync/
  TRIP_LOCATION_SYNC: (tripId) => `/coco/trips/${tripId}/location-sync/`,

  // ── Auth ──────────────────────────────────────────────────────────────────
  // POST /coco/users/login/
  LOGIN: '/coco/users/login/',

  // ── Users ─────────────────────────────────────────────────────────────────
  // GET  /coco/users/
  // POST /coco/users/
  USERS: '/coco/users/',

  // POST /coco/users/<id>/toggle-status/
  USER_TOGGLE_STATUS: (id) => `/coco/users/${id}/toggle-status/`,
}
