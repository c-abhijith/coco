import React from 'react'
import { drivers as defaultDrivers } from '../data/driversData'

// Reusable dropdown: callers can pass a custom `drivers` list.
export function DriverDropdown({
  drivers = defaultDrivers,
  selectedDriverId,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-[0.18em]">
        Select Driver
      </label>
      <select
        value={selectedDriverId || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      >
        <option value="">Choose a driver</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.id})
          </option>
        ))}
      </select>
    </div>
  )
}
