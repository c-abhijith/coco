import React from 'react'
import { riderDetails as defaultRiders } from '../data/riderDetails'

/**
 * RiderDropdown Component
 *
 * Reusable dropdown for selecting a rider from a list
 * Displays rider ID, name, and status
 *
 * @param {Array} riders - Array of rider objects
 * @param {string|null} selectedRiderId - Currently selected rider ID
 * @param {Function} onChange - Callback when selection changes
 */
export function RiderDropdown({ riders = defaultRiders, selectedRiderId, onChange }) {
  return (
    <select
      value={selectedRiderId || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
    >
      <option value="">Choose a rider</option>
      {riders.map((rider) => (
        <option key={rider.id} value={rider.id}>
          {rider.id} - {rider.name} ({rider.status || 'N/A'})
        </option>
      ))}
    </select>
  )
}
