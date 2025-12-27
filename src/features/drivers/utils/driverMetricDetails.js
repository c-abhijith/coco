/**
 * Driver Metric Details Utilities
 *
 * Functions to get detailed data for each driver metric
 */

/**
 * Get list of all drivers
 */
export function getTotalDriversDetails(drivers) {
  return drivers.map(d => ({
    driverId: d.id,
    name: d.name,
    mobile: d.mobile,
    city: d.city,
    status: d.status,
    onlineStatus: d.onlineStatus,
    rating: d.rating
  }))
}

/**
 * Get list of active drivers
 */
export function getTotalActiveDriversDetails(drivers) {
  return drivers
    .filter(d => d.status === 'Active')
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      city: d.city,
      onlineStatus: d.onlineStatus,
      rating: d.rating,
      totalTrips: d.totalTripsCompleted
    }))
}

/**
 * Get list of drivers online now
 */
export function getOnlineNowDetails(drivers) {
  return drivers
    .filter(d => d.onlineStatus === 'Online')
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      city: d.city,
      rating: d.rating,
      tripsToday: d.tripsToday || 0,
      onlineHours: d.onlineHoursToday || 0
    }))
}

/**
 * Get list of idle online drivers (drivers own trip)
 */
export function getIdleOnlineDriversDetails(drivers) {
  return drivers
    .filter(d => d.onlineStatus === 'Online' && d.isIdleOnline)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      city: d.city,
      rating: d.rating,
      lastTrip: d.lastTripDateTime || 'Never'
    }))
}

/**
 * Get list of drivers who drove today
 */
export function getDriversWhoDroveTodayDetails(drivers) {
  return drivers
    .filter(d => d.droveToday)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      city: d.city,
      tripsToday: d.tripsToday || 0,
      onlineHours: d.onlineHoursToday || 0,
      rating: d.rating
    }))
}

/**
 * Get list of drivers with complaints
 */
export function getDriversWithComplaintsDetails(drivers) {
  return drivers
    .filter(d => (d.complaintsCount || 0) > 0)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      totalComplaints: d.complaintsCount,
      complaintsPer100Trips: d.complaintsPer100Trips,
      totalTrips: d.totalTripsCompleted,
      rating: d.rating
    }))
    .sort((a, b) => b.totalComplaints - a.totalComplaints)
}

/**
 * Get list of drivers with high cancellation rate (>=10%)
 */
export function getDriversWithHighCancellationDetails(drivers) {
  return drivers
    .filter(d => (d.cancellationRatePct || 0) >= 10)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      cancellationRate: `${d.cancellationRatePct}%`,
      totalTrips: d.totalTripsCompleted,
      rating: d.rating,
      city: d.city
    }))
    .sort((a, b) => parseFloat(b.cancellationRate) - parseFloat(a.cancellationRate))
}

/**
 * Get average rating info (shows all drivers sorted by rating)
 */
export function getOverallAvgRatingDetails(drivers) {
  return drivers
    .filter(d => d.rating != null)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      rating: d.rating,
      totalTrips: d.totalTripsCompleted,
      city: d.city,
      onlineStatus: d.onlineStatus
    }))
    .sort((a, b) => b.rating - a.rating)
}

/**
 * Get average trips per driver info (shows all drivers sorted by trips)
 */
export function getAvgTripsPerDriverDetails(drivers) {
  return drivers
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      totalTrips: d.totalTripsCompleted || 0,
      rating: d.rating,
      city: d.city,
      status: d.status
    }))
    .sort((a, b) => b.totalTrips - a.totalTrips)
}

/**
 * Get acceptance rate details (shows all drivers sorted by acceptance rate)
 */
export function getAvgAcceptanceRateDetails(drivers) {
  return drivers
    .filter(d => d.acceptanceRatePct != null)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      acceptanceRate: `${d.acceptanceRatePct}%`,
      totalTrips: d.totalTripsCompleted,
      rating: d.rating,
      city: d.city
    }))
    .sort((a, b) => parseFloat(b.acceptanceRate) - parseFloat(a.acceptanceRate))
}

/**
 * Get cancellation rate details (shows all drivers sorted by cancellation rate)
 */
export function getAvgCancellationRateDetails(drivers) {
  return drivers
    .filter(d => d.cancellationRatePct != null)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      cancellationRate: `${d.cancellationRatePct}%`,
      totalTrips: d.totalTripsCompleted,
      rating: d.rating,
      city: d.city
    }))
    .sort((a, b) => parseFloat(a.cancellationRate) - parseFloat(b.cancellationRate))
}

/**
 * Get complaints per 100 trips details
 */
export function getAvgComplaintsPer100TripsDetails(drivers) {
  return drivers
    .filter(d => d.complaintsPer100Trips != null)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      complaintsPer100Trips: d.complaintsPer100Trips,
      totalComplaints: d.complaintsCount,
      totalTrips: d.totalTripsCompleted,
      rating: d.rating
    }))
    .sort((a, b) => b.complaintsPer100Trips - a.complaintsPer100Trips)
}

/**
 * Get average no-show count details
 */
export function getAvgNoShowCountDetails(drivers) {
  return drivers
    .filter(d => d.noShowCount != null && d.noShowCount > 0)
    .map(d => ({
      driverId: d.id,
      name: d.name,
      mobile: d.mobile,
      noShowCount: d.noShowCount,
      totalTrips: d.totalTripsCompleted,
      rating: d.rating,
      city: d.city
    }))
    .sort((a, b) => b.noShowCount - a.noShowCount)
}
