import React from 'react'

/**
 * ComplaintDropdown Component
 *
 * Reusable dropdown for selecting complaints
 * Similar to DriverDropdown and TripDropdown
 *
 * @param {Array} complaints - Array of complaint objects
 * @param {string} selectedComplaintId - Currently selected complaint ID
 * @param {Function} onChange - Callback when selection changes
 */
export function ComplaintDropdown({
  complaints = [],
  selectedComplaintId,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-[0.18em]">
        Select Complaint
      </label>
      <select
        value={selectedComplaintId || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      >
        <option value="">Choose a complaint</option>
        {complaints.map((c) => (
          <option key={c.id} value={c.id}>
            {c.id} - {c.complaintType} ({c.status})
          </option>
        ))}
      </select>
    </div>
  )
}
