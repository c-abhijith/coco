import React from 'react'

export function VehiclesSection({ driver, vehicle, onNavigate }) {
  if (!driver) return null

  // If no vehicle provided, try to get it from driver object
  const vehicleData = vehicle || (driver.vehicleNumber ? {
    id: driver.vehicleId,
    vehicleNumber: driver.vehicleNumber,
    cabType: driver.cabType,
    status: 'Active'
  } : null)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em] mb-3">
        Driver's Vehicle
      </div>

      {!vehicleData ? (
        <div className="text-sm text-slate-600 py-2 text-center">
          No vehicle assigned to this driver.
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            onNavigate(
              `/vehicles?vehicleNumber=${encodeURIComponent(vehicleData.vehicleNumber)}`,
            )
          }
          className="w-full text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-brand-yellow hover:bg-slate-50 transition-all"
        >
          {/* Compact Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-sm font-bold text-slate-900">
              {vehicleData.vehicleNumber}
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-yellow text-slate-900">
              {vehicleData.cabType}
            </span>
          </div>

          {/* Compact Details */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {vehicleData.vehicleName && (
              <div className="text-slate-600">
                <span className="text-slate-500">Model:</span> {vehicleData.vehicleName}
              </div>
            )}
            {vehicleData.brand && (
              <div className="text-slate-600">
                <span className="text-slate-500">Brand:</span> {vehicleData.brand}
              </div>
            )}
            <div className="text-emerald-600 font-medium">
              {vehicleData.status || 'Active'}
            </div>
            {vehicleData.color && (
              <div className="text-slate-600">
                <span className="text-slate-500">Color:</span> {vehicleData.color}
              </div>
            )}
          </div>

          {/* Compact Call to Action */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">View details</span>
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      )}
    </div>
  )
}
