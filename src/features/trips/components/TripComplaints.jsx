import React, { useState, useMemo } from 'react'
import { getComplaintsByTripId } from '../../../shared/data/complaints'

/**
 * TripComplaints Component
 *
 * Displays complaints section for a trip
 * Shows complaints list and details
 *
 * @param {Object} trip - Trip object with complaintIds array
 */
export function TripComplaints({ trip }) {
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)

  // Get complaints for this trip using complaintIds
  const complaints = useMemo(() => {
    if (!trip || !trip.id) return []
    return getComplaintsByTripId(trip.id)
  }, [trip])

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId)

  if (!trip) {
    return null
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

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Complaints</h3>
        <p className="text-xs text-slate-500 mt-1">
          {complaints.length === 0
            ? 'No complaints for this trip'
            : `${complaints.length} complaint${complaints.length > 1 ? 's' : ''} recorded`}
        </p>
      </div>

      {complaints.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Complaints List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Complaint List
            </h4>
            <div className="space-y-2">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => setSelectedComplaintId(complaint.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedComplaintId === complaint.id
                      ? 'border-yellow-400 bg-yellow-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900">
                        {complaint.complaintType}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        <span className="font-medium">{complaint.complaintBy}</span>
                        <span className="mx-1">→</span>
                        <span className="font-medium">{complaint.complaintAgainst}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDate(complaint.complaintDate)}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-[10px] font-semibold rounded-lg border ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Details */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
              Complaint Details
            </h4>
            {selectedComplaint ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Complaint ID
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {selectedComplaint.id}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Type
                  </div>
                  <div className="text-sm font-medium text-slate-900 mt-0.5">
                    {selectedComplaint.complaintType}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Who Complained Against Whom
                  </div>
                  <div className="text-sm font-medium text-slate-900 mt-0.5">
                    <span className="text-blue-700">{selectedComplaint.complaintBy}</span>
                    <span className="mx-2">→</span>
                    <span className="text-red-700">{selectedComplaint.complaintAgainst}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Description
                  </div>
                  <div className="text-sm text-slate-700 mt-0.5">
                    {selectedComplaint.description || '-'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Date
                  </div>
                  <div className="text-sm text-slate-700 mt-0.5">
                    {formatDate(selectedComplaint.complaintDate)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                        selectedComplaint.status
                      )}`}
                    >
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>

                {selectedComplaint.resolution && (
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      Resolution
                    </div>
                    <div className="text-sm text-green-700 mt-0.5 bg-green-50 p-2 rounded-lg">
                      {selectedComplaint.resolution}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">
                  Select a complaint from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
