/**
 * Trip Metric Details Utilities
 *
 * Functions to get detailed trip lists for each metric
 * Used in the SidePopup when clicking on metric cards
 */

/**
 * Get all trips
 */
export function getTotalTripsDetails(trips) {
  return trips.map((trip) => ({
    tripId: trip.id,
    driverId: trip.driverId,
    driverName: trip.driverName,
    riderName: trip.riderName,
    status: trip.tripStatus,
    fare: trip.totalFare,
    createdTime: trip.createdTime,
  }))
}

/**
 * Get completed trips
 */
export function getCompletedTripsDetails(trips) {
  return trips
    .filter((trip) => trip.tripStatus === 'Completed')
    .map((trip) => ({
      tripId: trip.id,
      driverId: trip.driverId,
      driverName: trip.driverName,
      riderName: trip.riderName,
      status: trip.tripStatus,
      fare: trip.totalFare,
      createdTime: trip.createdTime,
    }))
}

/**
 * Get cancelled trips
 */
export function getCancelledTripsDetails(trips) {
  return trips
    .filter((trip) => trip.tripStatus === 'Cancelled')
    .map((trip) => ({
      tripId: trip.id,
      driverId: trip.driverId,
      driverName: trip.driverName,
      riderName: trip.riderName,
      status: trip.tripStatus,
      cancelReason: trip.cancelReason,
      createdTime: trip.createdTime,
    }))
}

/**
 * Get ongoing trips (not completed or cancelled)
 */
export function getOngoingTripsDetails(trips) {
  return trips
    .filter((trip) => trip.tripStatus !== 'Completed' && trip.tripStatus !== 'Cancelled')
    .map((trip) => ({
      tripId: trip.id,
      driverId: trip.driverId,
      driverName: trip.driverName,
      riderName: trip.riderName,
      status: trip.tripStatus,
      estimatedFare: trip.estimatedFare,
      createdTime: trip.createdTime,
    }))
}
