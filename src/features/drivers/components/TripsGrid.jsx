import React, { useState } from 'react'

export function TripsGrid({ driver, trips, onViewTrip, onNavigateToTrips }) {
  const [showAllTrips, setShowAllTrips] = useState(false)

  if (!driver || !trips || trips.length === 0) return null

  const INITIAL_DISPLAY_COUNT = 6
  const displayedTrips = showAllTrips ? trips : trips.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMoreTrips = trips.length > INITIAL_DISPLAY_COUNT

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Trips for {driver.name}
          </h3>
          <p className="text-xs text-slate-500">
            {showAllTrips ? `Showing all ${trips.length}` : `Showing ${Math.min(INITIAL_DISPLAY_COUNT, trips.length)} of ${trips.length}`} trip{trips.length > 1 ? 's' : ''}
          </p>
        </div>

        {hasMoreTrips && (
          <button
            type="button"
            onClick={() => setShowAllTrips(!showAllTrips)}
            className="inline-flex items-center rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {showAllTrips ? 'Show less' : 'See all'}
          </button>
        )}
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {displayedTrips
          .slice()
          .sort((a, b) =>
            (b.createdTime || '').localeCompare(a.createdTime || ''),
          )
          .map((trip) => (
            <article
              key={trip.id}
              className="rounded-xl border border-slate-200 bg-white p-3 hover:border-brand-yellow hover:bg-slate-50 transition cursor-pointer"
              onClick={() => onViewTrip(trip)}
            >
              {/* Compact Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-xs font-semibold text-slate-900">
                  #{trip.id}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      (trip.tripStatus || '').toLowerCase() === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : (trip.tripStatus || '').toLowerCase() === 'cancelled'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {trip.tripStatus || 'Unknown'}
                  </span>
                  <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-800">
                    {trip.paymentType || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Compact Locations */}
              <div className="space-y-1 text-xs mb-2">
                <div className="flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div className="text-slate-700 line-clamp-1 text-[11px]">
                    {trip.pickLocationAddress || '-'}
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 rounded-full bg-rose-500 flex-shrink-0" />
                  <div className="text-slate-700 line-clamp-1 text-[11px]">
                    {trip.dropLocationAddress || '-'}
                  </div>
                </div>
              </div>

              {/* Compact Footer */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                <div className="text-slate-600 truncate flex-1">
                  {trip.riderName || 'No rider'}
                </div>
                <div className="font-bold text-slate-900 ml-2">
                  {trip.totalFare != null ? `₹${trip.totalFare}` : '--'}
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  )
}
