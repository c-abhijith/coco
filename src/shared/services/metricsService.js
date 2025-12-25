import { trips } from '../data/tripsData'
import { drivers } from '../data/driversData'
import { baseVehicles } from '../data/vehicleData'
import { riderDetails } from '../data/riderDetails'

/**
 * Metrics Service
 *
 * Calculates aggregate metrics on-demand from normalized data.
 * This ensures data consistency and single source of truth.
 */

// ============================================================================
// DRIVER METRICS
// ============================================================================

/**
 * Calculate all metrics for a driver
 */
export function getDriverMetrics(driverId) {
  const driverTrips = trips.filter(t => t.driverId === driverId)

  const totalTrips = driverTrips.length
  const totalEarnings = driverTrips.reduce((sum, t) => sum + (t.totalFare || 0), 0)
  const totalKm = driverTrips.reduce((sum, t) => sum + (t.distanceKm || 0), 0)
  const avgRating = driverTrips.length > 0
    ? driverTrips.reduce((sum, t) => sum + (t.ratingGivenByRider || 0), 0) / driverTrips.filter(t => t.ratingGivenByRider).length
    : 0

  // Time-based metrics
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const tripsToday = driverTrips.filter(t => new Date(t.createdTime) >= today).length
  const tripsLast7Days = driverTrips.filter(t => new Date(t.createdTime) >= last7Days).length
  const tripsLast30Days = driverTrips.filter(t => new Date(t.createdTime) >= last30Days).length

  const earningsLast7Days = driverTrips
    .filter(t => new Date(t.createdTime) >= last7Days)
    .reduce((sum, t) => sum + (t.totalFare || 0), 0)

  const earningsLast30Days = driverTrips
    .filter(t => new Date(t.createdTime) >= last30Days)
    .reduce((sum, t) => sum + (t.totalFare || 0), 0)

  return {
    totalTripsCompleted: totalTrips,
    tripsToday,
    tripsLast7Days,
    tripsLast30Days,
    totalEarningsLifetime: totalEarnings,
    earningsLast7Days,
    earningsLast30Days,
    totalKmRun: totalKm,
    rating: avgRating,
    averageRevenuePerTrip: totalTrips > 0 ? totalEarnings / totalTrips : 0,
  }
}

/**
 * Get driver with calculated metrics
 * @param {string|object} driverOrId - Driver ID or driver object
 */
export function getDriverWithMetrics(driverOrId) {
  // Support both driver object and driver ID
  const driver = typeof driverOrId === 'string'
    ? drivers.find(d => d.id === driverOrId)
    : driverOrId

  if (!driver) return null

  const metrics = getDriverMetrics(driver.id)
  const vehicle = baseVehicles.find(v => v.id === driver.vehicleId)

  return {
    ...driver,
    ...metrics,
    // Add vehicle info for convenience (still referencing, not duplicating)
    vehicleNumber: vehicle?.vehicleNumber || null,
    cabType: vehicle?.cabType || null,
    // Add droveToday flag
    droveToday: metrics.tripsToday > 0,
  }
}

/**
 * Get all drivers with metrics
 */
export function getAllDriversWithMetrics() {
  return drivers.map(driver => getDriverWithMetrics(driver.id))
}

// ============================================================================
// VEHICLE METRICS
// ============================================================================

/**
 * Calculate all metrics for a vehicle
 */
export function getVehicleMetrics(vehicleId) {
  const vehicleTrips = trips.filter(t => t.vehicleId === vehicleId)

  const totalTrips = vehicleTrips.length
  const totalRevenue = vehicleTrips.reduce((sum, t) => sum + (t.totalFare || 0), 0)
  const totalKm = vehicleTrips.reduce((sum, t) => sum + (t.distanceKm || 0), 0)

  // Time-based metrics
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const tripsLast7Days = vehicleTrips.filter(t => new Date(t.createdTime) >= last7Days).length
  const tripsLast30Days = vehicleTrips.filter(t => new Date(t.createdTime) >= last30Days).length

  const revenueLast30Days = vehicleTrips
    .filter(t => new Date(t.createdTime) >= last30Days)
    .reduce((sum, t) => sum + (t.totalFare || 0), 0)

  const lastTrip = vehicleTrips.sort((a, b) =>
    new Date(b.createdTime) - new Date(a.createdTime)
  )[0]

  return {
    totalTripsCompleted: totalTrips,
    tripsInLast7Days: tripsLast7Days,
    tripsInLast30Days: tripsLast30Days,
    totalKmRun: totalKm,
    lastTripDateTime: lastTrip?.createdTime || null,
    averageRevenuePerTrip: totalTrips > 0 ? totalRevenue / totalTrips : 0,
    averageDailyRevenueLast30Days: revenueLast30Days / 30,
    totalRevenueGenerated: totalRevenue,
    cocoEarningsFromVehicle: totalRevenue * 0.15, // Assuming 15% commission
  }
}

/**
 * Get vehicle with calculated metrics
 */
export function getVehicleWithMetrics(vehicleId) {
  const vehicle = baseVehicles.find(v => v.id === vehicleId)
  if (!vehicle) return null

  const metrics = getVehicleMetrics(vehicleId)
  return {
    ...vehicle,
    ...metrics,
  }
}

/**
 * Get all vehicles with metrics
 */
export function getAllVehiclesWithMetrics() {
  return baseVehicles.map(vehicle => getVehicleWithMetrics(vehicle.id))
}

// ============================================================================
// RIDER METRICS
// ============================================================================

/**
 * Calculate all metrics for a rider
 */
export function getRiderMetrics(riderId) {
  const riderTrips = trips.filter(t => t.riderId === riderId)

  const totalTrips = riderTrips.length
  const completedTrips = riderTrips.filter(t => t.tripStatus === 'Completed').length
  const cancelledTrips = totalTrips - completedTrips
  const totalSpend = riderTrips.reduce((sum, t) => sum + (t.totalFare || 0), 0)

  const avgRating = riderTrips.length > 0
    ? riderTrips.reduce((sum, t) => sum + (t.ratingGivenByRider || 0), 0) / riderTrips.filter(t => t.ratingGivenByRider).length
    : 0

  const lastTrip = riderTrips.sort((a, b) =>
    new Date(b.createdTime) - new Date(a.createdTime)
  )[0]

  return {
    totalTrips,
    completedTrips,
    cancelledTrips,
    totalSpend,
    rating: avgRating,
    lastTripAt: lastTrip?.createdTime || null,
    lastPickup: lastTrip?.pickLocationAddress || null,
    lastDrop: lastTrip?.dropLocationAddress || null,
  }
}

/**
 * Get rider with calculated metrics
 */
export function getRiderWithMetrics(riderId) {
  const rider = riderDetails.find(r => r.id === riderId)
  if (!rider) return null

  const metrics = getRiderMetrics(riderId)
  return {
    ...rider,
    ...metrics,
  }
}

/**
 * Get all riders with metrics
 */
export function getAllRidersWithMetrics() {
  return riderDetails.map(rider => getRiderWithMetrics(rider.id))
}

// ============================================================================
// TRIP ENRICHMENT
// ============================================================================

/**
 * Get trip with related entity data (driver, rider, vehicle)
 */
export function getTripWithDetails(tripId) {
  const trip = trips.find(t => t.id === tripId)
  if (!trip) return null

  const driver = drivers.find(d => d.id === trip.driverId)
  const rider = riderDetails.find(r => r.id === trip.riderId)
  const vehicle = baseVehicles.find(v => v.id === trip.vehicleId)

  return {
    ...trip,
    // Add related entity info for display
    assignedDriver: driver?.name || null,
    driverMobile: driver?.mobile || null,
    riderName: rider?.name || null,
    riderMobile: rider?.mobile || null,
    riderEmail: rider?.email || null,
    cabType: vehicle?.cabType || null,
    vehicleNumber: vehicle?.vehicleNumber || null,
  }
}

/**
 * Get all trips with related entity data
 */
export function getAllTripsWithDetails() {
  return trips.map(trip => getTripWithDetails(trip.id))
}
