import React from 'react'

export function VehiclesSection({ driver, onNavigate }) {
  if (!driver) return null

  const vehicles =
    Array.isArray(driver?.vehicles) && driver.vehicles.length
      ? driver.vehicles
      : driver
      ? [
          {
            vehicleId: `V-${driver.id}-01`,
            cabType: driver.cabType,
            vehicleNumber: driver.vehicleNumber,
            status: 'Active',
            remark: 'Primary vehicle',
          },
        ]
      : []

  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em] mb-3">
        Vehicles
      </div>

      {vehicles.length === 0 ? (
        <div className="text-sm text-slate-600">No vehicles added.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vehicles.map((v) => (
            <button
              key={v.vehicleId}
              type="button"
              onClick={() =>
                onNavigate(
                  `/vehicles?driverId=${encodeURIComponent(driver.id)}&vehicleId=${encodeURIComponent(v.vehicleId)}`,
                )
              }
              className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-slate-900">
                  {v.vehicleNumber}
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 text-slate-600">
                  {v.cabType}
                </span>
              </div>

              <div className="mt-2 text-sm text-slate-700">
                Status: <span className="font-semibold">{v.status || '—'}</span>
              </div>

              {v.remark ? (
                <div className="mt-1 text-xs text-slate-500">{v.remark}</div>
              ) : null}

              <div className="mt-3 text-xs font-semibold text-slate-600">
                Click to view vehicle details →
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
