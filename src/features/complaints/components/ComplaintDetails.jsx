import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * ComplaintDetails Component
 *
 * Displays detailed information about a single complaint
 * Shows who complained against whom, description, status, resolution, etc.
 *
 * @param {Object} complaint - Complaint object with all details
 */
export function ComplaintDetails({ complaint }) {
  const navigate = useNavigate()

  if (!complaint) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <p className="text-sm text-slate-600">
          Please select a complaint from the dropdown above to view its details.
        </p>
      </section>
    )
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'open':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'closed':
        return 'bg-slate-50 text-slate-700 border-slate-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const handleViewTrip = () => {
    if (complaint.tripId) {
      navigate(`/trips?tab=details&tripId=${complaint.tripId}`)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Complaint Details</h3>
        <p className="text-xs text-slate-500 mt-1">Complete information about the complaint</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT column - Basic Info */}
        <div className="rounded-2xl border border-slate-100 p-4 space-y-4">
          <div className="text-sm font-semibold text-slate-900 mb-3">Basic Information</div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Complaint ID
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              {complaint.id || '-'}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Trip ID
            </div>
            <div className="text-sm font-medium text-slate-900 mt-0.5">
              {complaint.tripId || '-'}
              {complaint.tripId && (
                <button
                  onClick={handleViewTrip}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Trip
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Complaint Type
            </div>
            <div className="text-sm font-medium text-slate-900 mt-0.5">
              {complaint.complaintType || '-'}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Who Complained Against Whom
            </div>
            <div className="text-sm font-medium text-slate-900 mt-0.5 flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                {complaint.complaintBy || '-'}
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                {complaint.complaintAgainst || '-'}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Complaint Date
            </div>
            <div className="text-sm text-slate-700 mt-0.5">
              {formatDate(complaint.complaintDate)}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Status
            </div>
            <div className="mt-1">
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT column - Description & Resolution */}
        <div className="rounded-2xl border border-slate-100 p-4 space-y-4">
          <div className="text-sm font-semibold text-slate-900 mb-3">
            Description & Resolution
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Description
            </div>
            <div className="text-sm text-slate-700 mt-1 p-3 bg-slate-50 rounded-lg">
              {complaint.description || 'No description provided'}
            </div>
          </div>

          {complaint.resolution && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Resolution
              </div>
              <div className="text-sm text-green-700 mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
                {complaint.resolution}
              </div>
            </div>
          )}

          {!complaint.resolution && complaint.status?.toLowerCase() === 'open' && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-xs font-semibold text-yellow-700">
                Pending Resolution
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                This complaint is still open and awaiting resolution.
              </div>
            </div>
          )}

          {/* Related Information */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Related Information
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              {complaint.driverName && (
                <div>
                  <span className="font-medium">Driver:</span> {complaint.driverName}
                </div>
              )}
              {complaint.riderName && (
                <div>
                  <span className="font-medium">Rider:</span> {complaint.riderName}
                </div>
              )}
              {complaint.createdTime && (
                <div>
                  <span className="font-medium">Trip Date:</span> {formatDate(complaint.createdTime)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
