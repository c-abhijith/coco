// ─────────────────────────────────────────────────────────────────────────────
// Single entry point for all backend API calls.
// Import from here instead of individual files:
//   import { getDrivers, getDriverMetrics, getVehicleDetails } from '@/api'
// ─────────────────────────────────────────────────────────────────────────────

export * from './driverApi'
export * from './vehicleApi'
export * from './tripApi'
export * from './authApi'
export * from './userApi'
export { ENDPOINTS } from './endpoints'
export { mapApiDriver } from './driverMapper'
