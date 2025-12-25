import { trips } from '../data/tripsData'
import {
  getTripWithDetails,
  getAllTripsWithDetails
} from './metricsService'

export function getTripsByDriverId(driverId) {
  return trips.filter(t => t.driverId === driverId).map(trip => getTripWithDetails(trip.id))
}

export function getTripsByTripIds(tripIds = []) {
  const set = new Set(tripIds)
  return trips.filter(t => set.has(t.id)).map(trip => getTripWithDetails(trip.id))
}

// Re-export trip enrichment functions for convenience
export { getTripWithDetails, getAllTripsWithDetails }
