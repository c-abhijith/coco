import { trips } from './tripsData'

export function getTripsByDriverId(driverId) {
  return trips.filter(t => t.driverId === driverId)
}

export function getTripsByTripIds(tripIds = []) {
  const set = new Set(tripIds)
  return trips.filter(t => set.has(t.id))
}
