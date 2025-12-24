import React from 'react'

export function TripsGrid({ driver, trips, onViewTrip, onNavigateToTrips }) {
  if (!driver || !trips || trips.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            All trips for {driver.name}
          </h3>
          <p className="text-xs text-slate-600">
            Showing {trips.length} trip{trips.length > 1 ? 's' : ''} in reverse
            chronological order.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onNavigateToTrips(
              `/trips?driverId=${encodeURIComponent(driver.id)}`,
            )
          }
          className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          See more in Trip Management
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trips
          .slice()
          .sort((a, b) =>
            (b.createdTime || '').localeCompare(a.createdTime || ''),
          )
          .map((trip) => (
            <article
              key={trip.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition cursor-pointer"
              onClick={() => onViewTrip(trip)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Trip #{trip.id}
                  </div>
                  <div className="mt-1 text-sm text-slate-700">
                    {trip.createdTime || '-'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      (trip.tripStatus || '').toLowerCase() === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : (trip.tripStatus || '').toLowerCase() === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {trip.tripStatus || 'Unknown'}
                  </span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    {trip.paymentType || 'Payment N/A'}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">
                      Pickup
                    </div>
                    <div className="text-slate-800 line-clamp-2">
                      {trip.pickLocationAddress || '-'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">
                      Drop
                    </div>
                    <div className="text-slate-800 line-clamp-2">
                      {trip.dropLocationAddress || '-'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wide text-slate-500">
                    Rider
                  </span>
                  <span>
                    {trip.riderName || '-'}{' '}
                    {trip.riderMobile ? `(${trip.riderMobile})` : ''}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] uppercase tracking-wide text-slate-500">
                    Fare
                  </span>
                  <span className="font-semibold text-slate-900">
                    {trip.totalFare != null ? `₹${trip.totalFare}` : '--'}
                  </span>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  )
}
