import React, { useMemo, useState } from 'react'
import { riderDetails } from '../../../shared/data/riderDetails'

/**
 * RiderListTable Component
 *
 * Displays all riders in a table format
 * Supports search by phone number and email
 *
 * @param {Function} onViewRider - Callback when user clicks to view rider details
 */
export function RiderListTable({ onViewRider }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')

  // Get unique values for filters
  const distinctStatuses = useMemo(() => {
    return Array.from(new Set(riderDetails.map((r) => r.current_status).filter(Boolean)))
  }, [])

  const distinctTags = useMemo(() => {
    return Array.from(new Set(riderDetails.map((r) => r.tag).filter(Boolean)))
  }, [])

  // Filter riders
  const filteredRiders = useMemo(() => {
    let filtered = [...riderDetails]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.id?.toLowerCase().includes(query) ||
          r.name?.toLowerCase().includes(query) ||
          r.mobile?.toLowerCase().includes(query) ||
          r.email?.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.current_status === statusFilter)
    }

    if (tagFilter !== 'all') {
      filtered = filtered.filter((r) => r.tag === tagFilter)
    }

    return filtered
  }, [searchQuery, statusFilter, tagFilter])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-700 bg-green-50'
      case 'blocked':
        return 'text-red-700 bg-red-50'
      case 'inactive':
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
          <h3 className="text-base font-semibold text-slate-900 mb-2">All Riders</h3>
          <p className="text-xs text-slate-600">View and search all registered riders</p>
        </div>
        <div className="text-xs text-slate-600">
          Showing <span className="font-semibold">{filteredRiders.length}</span> of{' '}
          <span className="font-semibold">{riderDetails.length}</span> riders
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by ID, name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          <button
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setTagFilter('all')
            }}
            className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
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

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tag</label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
            >
              <option value="all">All</option>
              {distinctTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th className="px-4 py-3">Rider ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Outstanding Due</th>
              <th className="px-4 py-3">Last Logged</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRiders.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-sm text-slate-500">
                  {searchQuery.trim()
                    ? `No riders match your search "${searchQuery}".`
                    : 'No riders found for the selected filters.'}
                </td>
              </tr>
            ) : (
              filteredRiders.map((rider) => (
                <tr key={rider.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700 font-medium">{rider.id}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{rider.name}</td>
                  <td className="px-4 py-3 text-slate-700">{rider.mobile}</td>
                  <td className="px-4 py-3 text-slate-700">{rider.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusColor(
                        rider.current_status
                      )}`}
                    >
                      {rider.current_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
                      {rider.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {rider.total_points_till_today}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        rider.outstanding_due > 0 ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      ₹{rider.outstanding_due.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(rider.last_logged_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewRider(rider)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Details
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
