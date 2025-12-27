/**
 * Complaints Data
 *
 * Central repository for all complaints across the system
 * Complaints can be filed by: Rider, Driver, Vehicle Owner, Platform
 * Complaints can be against: Rider, Driver, Vehicle, Platform
 */

export const complaints = [
  {
    id: 'C001',
    tripId: 'T10001',
    complaintBy: 'Rider',
    complaintAgainst: 'Driver',
    complaintType: 'Behavior',
    description: 'Driver was rude and unprofessional',
    complaintDate: '2025-01-10T10:00:00',
    status: 'Resolved',
    resolution: 'Driver warned about behavior',
  },
  {
    id: 'C002',
    tripId: 'T10003',
    complaintBy: 'Driver',
    complaintAgainst: 'Rider',
    complaintType: 'No Show',
    description: 'Rider took too long to come to pickup point',
    complaintDate: '2025-01-13T08:40:00',
    status: 'Open',
    resolution: null,
  },
  {
    id: 'C003',
    tripId: 'T10003',
    complaintBy: 'Rider',
    complaintAgainst: 'Vehicle',
    complaintType: 'Cleanliness',
    description: 'Vehicle was not clean',
    complaintDate: '2025-01-13T08:50:00',
    status: 'Resolved',
    resolution: 'Vehicle owner fined and instructed to maintain cleanliness',
  },
  {
    id: 'C004',
    tripId: 'T10004',
    complaintBy: 'Platform',
    complaintAgainst: 'Rider',
    complaintType: 'Repeated Cancellations',
    description: 'Rider has cancelled multiple trips in the last hour',
    complaintDate: '2025-01-14T19:26:00',
    status: 'Open',
    resolution: null,
  },
]

/**
 * Get all complaints
 */
export function getComplaints() {
  return [...complaints]
}

/**
 * Get complaints by trip ID
 */
export function getComplaintsByTripId(tripId) {
  if (!tripId) return []
  return complaints.filter((c) => c.tripId === tripId)
}

/**
 * Get complaint by ID
 */
export function getComplaintById(complaintId) {
  if (!complaintId) return null
  return complaints.find((c) => c.id === complaintId) || null
}

/**
 * Get complaints by status
 */
export function getComplaintsByStatus(status) {
  if (!status) return []
  return complaints.filter((c) => c.status === status)
}

/**
 * Get complaints by who complained
 */
export function getComplaintsByComplaintBy(complaintBy) {
  if (!complaintBy) return []
  return complaints.filter((c) => c.complaintBy === complaintBy)
}

/**
 * Get complaints against specific entity
 */
export function getComplaintsByComplaintAgainst(complaintAgainst) {
  if (!complaintAgainst) return []
  return complaints.filter((c) => c.complaintAgainst === complaintAgainst)
}
