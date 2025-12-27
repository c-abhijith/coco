import React from 'react'
import { trips as defaultTrips } from '../data/tripsData'

/**
 * TripDropdown Component
 *
 * Reusable dropdown for selecting trips
 * Similar to DriverDropdown but for trip selection
 *
 * @param {Array} trips - Array of trip objects (defaults to all trips)
 * @param {string} selectedTripId - Currently selected trip ID
 * @param {Function} onChange - Callback when selection changes
 */
export function TripDropdown({
  trips = defaultTrips,
  selectedTripId,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-[0.18em]">
        Select Trip
      </label>
      <select
        value={selectedTripId || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      >
        <option value="">Choose a trip</option>
        {trips.map((t) => (
          <option key={t.id} value={t.id}>
            {t.id} - {t.riderName || 'Unknown'} ({t.tripStatus || 'N/A'})
          </option>
        ))}
      </select>
    </div>
  )
}
