/**
 * Driver Metrics Service
 * Calculates all aggregate metrics for drivers from trip data
 */

import { trips } from '../data/tripsData'

/**
 * Calculate all metrics for a specific driver
 * @param {string} driverId - The driver ID
 * @param {object} driverData - The driver core data (for online hours)
 * @returns {object} All calculated metrics for the driver
 */
export const calculateDriverMetrics = (driverId, driverData = {}) => {
  const driverTrips = trips.filter(trip => trip.driverId === driverId)

  // Total trips
  const totalTrips = driverTrips.length
  const completedTrips = driverTrips.filter(trip => trip.tripStatus === 'Completed').length
  const cancelledTrips = driverTrips.filter(trip => trip.tripStatus === 'Cancelled').length

  // Trip IDs
  const tripIds = driverTrips.map(trip => trip.id)

  // Cancellations & No Shows
  const cancellationRatePct = totalTrips > 0
    ? ((cancelledTrips / totalTrips) * 100).toFixed(1)
    : 0

  const noShowCount = driverTrips.filter(trip => trip.riderNoShow).length

  // Acceptance rate (would need trip offer data for accurate calculation)
  const interestedTrips = driverTrips.reduce((sum, trip) => sum + (trip.noOfDriversInterested || 0), 0)
  const acceptanceRatePct = interestedTrips > 0
    ? ((totalTrips / interestedTrips) * 100).toFixed(1)
    : 100 // Default to 100% if no data

  // Complaints
  const complaintsCount = driverTrips.filter(trip => trip.driverComplaintLink).length
  const complaintsPer100Trips = totalTrips > 0
    ? ((complaintsCount / totalTrips) * 100).toFixed(1)
    : 0

  // Ratings
  const ratedTrips = driverTrips.filter(trip => trip.ratingGivenByDriver !== null && trip.ratingGivenByDriver !== undefined)
  const lastTripRating = ratedTrips.length > 0
    ? ratedTrips[ratedTrips.length - 1].ratingGivenByDriver
    : 0

  // Last 7 days rating
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const last7DaysTrips = ratedTrips.filter(trip => new Date(trip.createdTime) >= sevenDaysAgo)
  const lastTripRating7Days = last7DaysTrips.length > 0
    ? (last7DaysTrips.reduce((sum, trip) => sum + trip.ratingGivenByDriver, 0) / last7DaysTrips.length).toFixed(1)
    : 0

  // Last 30 days rating
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const last30DaysTrips = ratedTrips.filter(trip => new Date(trip.createdTime) >= thirtyDaysAgo)
  const lastTripRating30Days = last30DaysTrips.length > 0
    ? (last30DaysTrips.reduce((sum, trip) => sum + trip.ratingGivenByDriver, 0) / last30DaysTrips.length).toFixed(1)
    : 0

  // Utilization metrics
  const onlineHours = driverData.onlineHoursToday || 0
  const tripsPerOnlineHour = onlineHours > 0
    ? (completedTrips / onlineHours).toFixed(1)
    : 0

  // Calculate idle status (online but no recent trips)
  const lastTrip = driverTrips.length > 0 ? driverTrips[driverTrips.length - 1] : null
  const isIdleOnline = false // Would need real-time data to determine this

  // Utilization percentage (ratio of trip time to online time - would need detailed trip timing)
  const totalTripMinutes = completedTrips * 25 // Placeholder: assume 25 min average trip
  const totalOnlineMinutes = onlineHours * 60
  const driverUtilizationPct = totalOnlineMinutes > 0
    ? ((totalTripMinutes / totalOnlineMinutes) * 100).toFixed(1)
    : 0

  return {
    // Trip counts
    totalTrips,
    completedTrips,
    cancelledTrips,
    tripIds,

    // Performance metrics
    isIdleOnline,
    driverUtilizationPct: parseFloat(driverUtilizationPct),
    acceptanceRatePct: parseFloat(acceptanceRatePct),
    cancellationRatePct: parseFloat(cancellationRatePct),
    noShowCount,
    tripsPerOnlineHour: parseFloat(tripsPerOnlineHour),

    // Complaints & ratings
    complaintsCount,
    complaintsPer100Trips: parseFloat(complaintsPer100Trips),
    lastTripRating: parseFloat(lastTripRating),
    lastTripRating7Days: parseFloat(lastTripRating7Days),
    lastTripRating30Days: parseFloat(lastTripRating30Days),
  }
}

/**
 * Get driver with calculated metrics
 * @param {object} driver - The driver core data
 * @returns {object} Driver with all metrics
 */
export const getDriverWithMetrics = (driver) => {
  const metrics = calculateDriverMetrics(driver.id, driver)
  return {
    ...driver,
    ...metrics
  }
}

/**
 * Get all drivers with calculated metrics
 * @param {array} drivers - Array of driver core data
 * @returns {array} Drivers with all metrics
 */
export const getAllDriversWithMetrics = (drivers) => {
  return drivers.map(driver => getDriverWithMetrics(driver))
}
