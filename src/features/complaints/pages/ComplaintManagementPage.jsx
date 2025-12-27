import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { trips as tripsData } from '../../../shared/data/tripsData'
import { complaints as complaintsData } from '../../../shared/data/complaints'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TabNavigation } from '../../../shared/components/TabNavigation'
import { ComplaintDropdown } from '../../../shared/components/ComplaintDropdown'
import { ComplaintDetails } from '../components/ComplaintDetails'

const COMPLAINT_TABS = [
  { id: 'details', label: 'Complaint details' },
  { id: 'list', label: 'Complaint list' },
]

/**
 * ComplaintManagementPage
 *
 * Central page for viewing and managing all complaints across the system
 * Shows complaints from all trips with filtering capabilities
 */
export function ComplaintManagementPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('details')
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [complaintByFilter, setComplaintByFilter] = useState('all')
  const [complaintAgainstFilter, setComplaintAgainstFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    const complaintId = searchParams.get('complaintId')
    if (tab) setActiveTab(tab)
    if (complaintId) setSelectedComplaintId(complaintId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Get all complaints and enrich with trip data
  const allComplaints = useMemo(() => {
    return complaintsData.map((complaint) => {
      const trip = tripsData.find((t) => t.id === complaint.tripId)
      return {
        ...complaint,
        driverId: trip?.driverId,
        driverName: trip?.driverName,
        riderName: trip?.riderName,
        createdTime: trip?.createdTime,
      }
    }).sort((a, b) =>
      (b.complaintDate || '').localeCompare(a.complaintDate || '')
    )
  }, [])

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

  const distinctTypes = useMemo(() => {
    return Array.from(new Set(allComplaints.map((c) => c.complaintType).filter(Boolean)))
  }, [allComplaints])

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    let filtered = [...allComplaints]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.id?.toLowerCase().includes(query) ||
          c.tripId?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query) ||
          c.complaintType?.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    if (complaintByFilter !== 'all') {
      filtered = filtered.filter((c) => c.complaintBy === complaintByFilter)
    }

    if (complaintAgainstFilter !== 'all') {
      filtered = filtered.filter((c) => c.complaintAgainst === complaintAgainstFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((c) => c.complaintType === typeFilter)
    }

    return filtered
  }, [allComplaints, searchQuery, statusFilter, complaintByFilter, complaintAgainstFilter, typeFilter])

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

  // Selected complaint object
  const selectedComplaint = useMemo(
    () => allComplaints.find((c) => c.id === selectedComplaintId) || null,
    [allComplaints, selectedComplaintId]
  )

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    if (selectedComplaintId) next.set('complaintId', selectedComplaintId)
    setSearchParams(next, { replace: true })
  }

  const handleComplaintSelect = (id) => {
    setSelectedComplaintId(id)
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    if (id) next.set('complaintId', id)
    setSearchParams(next, { replace: true })
  }

  const handleComplaintClick = (complaint) => {
    setSelectedComplaintId(complaint.id)
    setActiveTab('details')
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    next.set('complaintId', complaint.id)
    setSearchParams(next, { replace: true })
  }

  const handleViewTrip = (tripId) => {
    navigate(`/trips?tab=details&tripId=${tripId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header + tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Complaint Management"
          description="View and manage all complaints across trips, drivers, riders, vehicles and platform."
        >
          {/* Complaint Dropdown (only on details tab) */}
          {activeTab === 'details' && (
            <ComplaintDropdown
              complaints={allComplaints}
              selectedComplaintId={selectedComplaintId}
              onChange={handleComplaintSelect}
            />
          )}

          {/* Search Controls (only on list tab) */}
          {activeTab === 'list' && (
            <div className="flex gap-2 items-center justify-end">
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setComplaintByFilter('all')
                  setComplaintAgainstFilter('all')
                  setTypeFilter('all')
                }}
                className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          )}
        </PageHeader>

        <TabNavigation
          tabs={COMPLAINT_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </section>

      {/* TAB: Complaint details */}
      {activeTab === 'details' && (
        <ComplaintDetails complaint={selectedComplaint} />
      )}

      {/* TAB: Complaint list */}
      {activeTab === 'list' && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">All Complaints</h3>
            <p className="text-xs text-slate-600">Complete list of complaints from all sources</p>
          </div>
          <div className="text-xs text-slate-600">
            Showing <span className="font-semibold">{filteredComplaints.length}</span> of{' '}
            <span className="font-semibold">{allComplaints.length}</span> complaints
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
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

          <div>
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

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
            >
              <option value="all">All</option>
              {distinctTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
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
                <th className="px-4 py-3">Resolution</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-sm text-slate-500">
                    {searchQuery.trim()
                      ? `No complaints match your search "${searchQuery}".`
                      : 'No complaints found for the selected filters.'}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr
                    key={`${complaint.tripId}-${complaint.id}`}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
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
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={complaint.resolution}>
                      {complaint.resolution || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleComplaintClick(complaint)}
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
        </section>
      )}
    </div>
  )
}

export default ComplaintManagementPage
