import React from 'react'
import { drivers } from '../../../shared/data/driversData'

export function DriverDetailsCard({ driverId, onViewTrip }) {
  if (!driverId) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        Select a driver to see details.
      </div>
    )
  }

  const driver = drivers.find((u) => u.id === driverId)
  if (!driver) {
    return null
  }

  const trips = driver.trips || []
  let lastTrip = null
  if (trips.length > 0) {
    lastTrip = [...trips].sort(
      (a, b) => new Date(b.createdTime) - new Date(a.createdTime),
    )[0]
  }

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,3fr]">
      {/* Driver basic details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Driver details
        </h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Name</dt>
            <dd className="font-medium text-slate-900">{driver.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Mobile</dt>
            <dd className="font-medium text-slate-900">{driver.mobile}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Cab type</dt>
            <dd className="font-medium text-slate-900">{driver.cabType}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Vehicle</dt>
            <dd className="font-medium text-slate-900">
              {driver.vehicleName} ({driver.vehicleNumber})
            </dd>
          </div>
          {driver.rating != null && (
            <div className="flex justify-between">
              <dt className="text-slate-600">Rating</dt>
              <dd className="font-semibold text-emerald-700">
                {driver.rating.toFixed ? driver.rating.toFixed(1) : driver.rating} ⭐
              </dd>
            </div>
          )}
          {driver.lastTripAt && (
            <div className="flex justify-between text-xs text-slate-600 pt-1">
              <span>Last trip</span>
              <span>{driver.lastTripAt}</span>
            </div>
          )}
        </dl>
      </div>

      {/* Last trip summary */}
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Last trip summary
          </h3>
          {lastTrip && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-900 border border-yellow-300">
              {lastTrip.tripStatus}
            </span>
          )}
        </div>

        {!lastTrip && (
          <p className="text-sm text-slate-600">
            No trips available for this driver.
          </p>
        )}

        {lastTrip && (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Trip ID</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.id}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Created time</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.createdTime}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Cab type</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.cabType}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Drop location</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.dropLocationAddress}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Trip type</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.tripType}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Schedule status</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.scheduleStatus}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Schedule time</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.scheduleTime}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Trip status</span>
                <span className="font-medium text-slate-900">
                  {lastTrip.tripStatus}
                </span>
              </div>
            </dl>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onViewTrip && onViewTrip(lastTrip.id)}
                className="inline-flex items-center rounded-xl bg-yellow-400 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:brightness-95"
              >
                View details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
