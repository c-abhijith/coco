/**
 * Rider Metrics Service
 * Calculates all aggregate metrics for riders from trip data
 */

import { trips } from '../data/tripsData'

/**
 * Calculate all metrics for a specific rider
 * @param {string} riderId - The rider ID
 * @returns {object} All calculated metrics for the rider
 */
export const calculateRiderMetrics = (riderId) => {
  const riderTrips = trips.filter(trip => trip.riderId === riderId)

  // Total trips
  const total_trips = riderTrips.length
  const no_of_trips_completed = riderTrips.filter(trip => trip.tripStatus === 'Completed').length

  // Cancellations
  const total_cancellations = riderTrips.filter(trip => trip.didCancelTrip).length
  const cancellation_rate_percent = total_trips > 0
    ? ((total_cancellations / total_trips) * 100).toFixed(1)
    : 0

  // Rides by time period
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const dayBeforeYesterday = new Date(now)
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2)
  dayBeforeYesterday.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const no_of_rides_yesterday = riderTrips.filter(trip => {
    const tripDate = new Date(trip.createdTime)
    return tripDate >= yesterday && tripDate < now && tripDate.getDate() === yesterday.getDate()
  }).length

  const no_of_rides_day_before_yesterday = riderTrips.filter(trip => {
    const tripDate = new Date(trip.createdTime)
    return tripDate >= dayBeforeYesterday && tripDate < yesterday
  }).length

  const no_of_rides_last_7_days = riderTrips.filter(trip => {
    const tripDate = new Date(trip.createdTime)
    return tripDate >= sevenDaysAgo
  }).length

  const no_of_rides_last_30_days = riderTrips.filter(trip => {
    const tripDate = new Date(trip.createdTime)
    return tripDate >= thirtyDaysAgo
  }).length

  // Financial metrics
  const total_spend = riderTrips.reduce((sum, trip) => sum + (trip.finalFare || 0), 0)
  const coco_earned_total = riderTrips.reduce((sum, trip) => sum + (trip.cocoReceivedAmount || 0), 0)
  const total_promo_used = riderTrips.reduce((sum, trip) => sum + (trip.riderPickupFee || 0), 0) // Placeholder
  const total_promo_refund = 0 // Would need separate promo data
  const refund_total = 0 // Would need separate refund data

  // Complaints (would need separate complaints data)
  const complaintsTrips = riderTrips.filter(trip => trip.riderComplaintLink)
  const no_of_rider_complaints = complaintsTrips.length
  const no_of_open_complaints = 0 // Would need complaint status data
  const last_complaint_at = complaintsTrips.length > 0
    ? complaintsTrips[complaintsTrips.length - 1].createdTime
    : ""

  // Rating
  const ratedTrips = riderTrips.filter(trip => trip.ratingGivenByRider)
  const averageRating = ratedTrips.length > 0
    ? (ratedTrips.reduce((sum, trip) => sum + trip.ratingGivenByRider, 0) / ratedTrips.length).toFixed(1)
    : 0

  return {
    total_trips,
    no_of_trips_completed,
    total_cancellations,
    cancellation_rate_percent: parseFloat(cancellation_rate_percent),

    no_of_rides_yesterday,
    no_of_rides_day_before_yesterday,
    no_of_rides_last_7_days,
    no_of_rides_last_30_days,

    total_spend,
    coco_earned_total,
    total_promo_used,
    total_promo_refund,
    refund_total,

    no_of_rider_complaints,
    no_of_open_complaints,
    last_complaint_at,

    average_rating: parseFloat(averageRating)
  }
}

/**
 * Get rider with calculated metrics
 * @param {object} rider - The rider core data
 * @returns {object} Rider with all metrics
 */
export const getRiderWithMetrics = (rider) => {
  const metrics = calculateRiderMetrics(rider.id)
  return {
    ...rider,
    ...metrics
  }
}

/**
 * Get all riders with calculated metrics
 * @param {array} riders - Array of rider core data
 * @returns {array} Riders with all metrics
 */
export const getAllRidersWithMetrics = (riders) => {
  return riders.map(rider => getRiderWithMetrics(rider))
}
