import React from 'react'

/**
 * TripListTable Component
 *
 * Displays a list of trips in a table format
 * Used in the Trip Management page's "Trip list" tab
 *
 * @param {Array} trips - Array of trip objects to display
 * @param {Function} onTripClick - Callback when a trip row is clicked
 */
export function TripListTable({ trips, onTripClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <th className="px-4 py-3">Trip ID</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Rider</th>
            <th className="px-4 py-3">Created time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Cab / Vehicle</th>
            <th className="px-4 py-3">Pickup</th>
            <th className="px-4 py-3">Drop</th>
          </tr>
        </thead>

        <tbody>
          {trips.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-6 text-center text-sm text-slate-500">
                No trips found for the selected filters.
              </td>
            </tr>
          ) : (
            trips.map((trip) => (
              <tr
                key={trip.id}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                onClick={() => onTripClick(trip)}
                title="Click to view trip details"
              >
                <td className="px-4 py-3 text-slate-700">{trip.id || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{trip.driverName || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{trip.riderName || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{trip.createdTime || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{trip.tripStatus || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{trip.paymentType || '-'}</td>
                <td className="px-4 py-3 text-slate-700">
                  {trip.cabType || '-'} / {trip.vehicleNumber || '-'}
                </td>
                <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                  {trip.pickLocationAddress || '-'}
                </td>
                <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                  {trip.dropLocationAddress || '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
