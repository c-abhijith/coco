import React, { useMemo } from 'react'

function safe(v, fallback = '—') {
  if (v === null || v === undefined || v === '') return fallback
  return v
}

function formatINR(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '₹0'
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
}

function formatKm(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0 km'
  return `${n.toLocaleString('en-IN')} km`
}

function Field({ label, value }) {
  return (
    <div className="py-2">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-900">{safe(value)}</div>
    </div>
  )
}

// ✅ Named export (so you can import { TripDetails })
export function TripDetails({ driver, trip, trips = [], onSelectTrip }) {
  const selectedTripId = trip?.id || ''

  const canSelect = useMemo(() => Array.isArray(trips) && trips.length > 0, [trips])

  if (!trip) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 text-sm text-slate-600">
        Trip not found.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
      {/* Top row (trip selector + tiny meta) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{trip.id}</div>
          <div className="text-xs text-slate-500">{safe(trip.createdTime)}</div>
        </div>

        {canSelect && (
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
              Choose Trip
            </div>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              value={selectedTripId}
              onChange={(e) => onSelectTrip?.(e.target.value)}
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Details layout similar to your old UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT column */}
        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="text-sm font-semibold text-slate-900 mb-2">Trip info</div>
          <div className="divide-y divide-slate-100">
            <Field label="Trip Status" value={trip.tripStatus} />
            <Field label="Payment Type" value={trip.paymentType} />
            <Field label="Total Fare" value={formatINR(trip.totalFare)} />
            <Field label="Distance" value={formatKm(trip.distanceKm)} />
            <Field label="OTP" value={trip.otp} />
            <Field label="Rating Given By Rider" value={trip.ratingGivenByRider} />
          </div>
        </div>

        {/* RIGHT column */}
        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="text-sm font-semibold text-slate-900 mb-2">Driver / Rider / Route</div>
          <div className="divide-y divide-slate-100">
            <Field label="Driver" value={driver ? `${driver.name} (${driver.id})` : '—'} />
            <Field label="Cab Type" value={trip.cabType} />
            <Field label="Vehicle Number" value={trip.vehicleNumber} />

            <Field label="Pickup Location" value={trip.pickLocationAddress} />
            <Field label="Drop Location" value={trip.dropLocationAddress} />

            <Field label="Rider Name" value={trip.riderName} />
            <Field label="Rider Mobile" value={trip.riderMobile} />
            <Field label="Rider Email" value={trip.riderEmail} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDetails
