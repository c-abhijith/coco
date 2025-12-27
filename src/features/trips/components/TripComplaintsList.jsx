import React, { useMemo, useState } from 'react'
import { complaints as complaintsData } from '../../../shared/data/complaints'

/**
 * TripComplaintsList Component
 *
 * Displays all complaints across trips in a table format
 * Used in the Complaints tab of Trip Management
 *
 * @param {Array} trips - Array of trip objects with complaintIds
 * @param {Function} onViewTrip - Callback when user clicks to view trip
 */
export function TripComplaintsList({ trips = [], onViewTrip }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [complaintByFilter, setComplaintByFilter] = useState('all')
  const [complaintAgainstFilter, setComplaintAgainstFilter] = useState('all')

  // Get all complaints and enrich with trip data
  const allComplaints = useMemo(() => {
    return complaintsData.map((complaint) => {
      const trip = trips.find((t) => t.id === complaint.tripId)
      return {
        ...complaint,
        driverId: trip?.driverId,
        driverName: trip?.driverName,
        riderName: trip?.riderName,
      }
    })
  }, [trips])

  // Get unique values for filters
  const distinctStatuses = useMemo(() => {
    return Array.from(new Set(allComplaints.map((c) => c.status).filter(Boolean)))
  }, [allComplaints])

  const distinctComplaintBy = useMemo(() => {
    return Array.from(new Set(allComplaints.map((c) => c.complaintBy).filter(Boolean)))
  }, [allComplaints])

  const distinctComplaintAgainst = useMemo(() => {
    return Array.from(new Set(allComplaints.map((c) => c.complaintAgainst).filter(Boolean)))
  }, [allComplaints])

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    let filtered = [...allComplaints]

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    if (complaintByFilter !== 'all') {
      filtered = filtered.filter((c) => c.complaintBy === complaintByFilter)
    }

    if (complaintAgainstFilter !== 'all') {
      filtered = filtered.filter((c) => c.complaintAgainst === complaintAgainstFilter)
    }

    return filtered
  }, [allComplaints, statusFilter, complaintByFilter, complaintAgainstFilter])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'text-green-700 bg-green-50'
      case 'open':
        return 'text-yellow-700 bg-yellow-50'
      case 'closed':
        return 'text-slate-700 bg-slate-50'
      default:
        return 'text-slate-700 bg-slate-50'
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">All Complaints</h3>
          <p className="text-xs text-slate-600">View and filter complaints across all trips</p>
        </div>
        <div className="text-xs text-slate-600">
          Showing <span className="font-semibold">{filteredComplaints.length}</span> of{' '}
          <span className="font-semibold">{allComplaints.length}</span> complaints
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
          >
            <option value="all">All</option>
            {distinctStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Complaint By</label>
          <select
            value={complaintByFilter}
            onChange={(e) => setComplaintByFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
          >
            <option value="all">All</option>
            {distinctComplaintBy.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Complaint Against</label>
          <select
            value={complaintAgainstFilter}
            onChange={(e) => setComplaintAgainstFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
          >
            <option value="all">All</option>
            {distinctComplaintAgainst.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setStatusFilter('all')
              setComplaintByFilter('all')
              setComplaintAgainstFilter('all')
            }}
            className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th className="px-4 py-3">Complaint ID</th>
              <th className="px-4 py-3">Trip ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Complaint By</th>
              <th className="px-4 py-3">Against</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-sm text-slate-500">
                  No complaints found for the selected filters.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr key={`${complaint.tripId}-${complaint.id}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700 font-medium">{complaint.id}</td>
                  <td className="px-4 py-3 text-slate-700">{complaint.tripId}</td>
                  <td className="px-4 py-3 text-slate-700">{complaint.complaintType}</td>
                  <td className="px-4 py-3 text-blue-700 font-medium">{complaint.complaintBy}</td>
                  <td className="px-4 py-3 text-red-700 font-medium">{complaint.complaintAgainst}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={complaint.description}>
                    {complaint.description}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(complaint.complaintDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewTrip({ id: complaint.tripId })}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Trip
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
