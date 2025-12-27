import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { drivers } from '../../../shared/data/driversData'
import { trips as tripsData } from '../../../shared/data/tripsData'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TabNavigation } from '../../../shared/components/TabNavigation'
import { TripDropdown } from '../../../shared/components/TripDropdown'
import { TripListTable } from '../components/TripListTable'
import { TripDetails } from '../components/TripDetails'

const TRIP_TABS = [
  { id: 'details', label: 'Trip details' },
  { id: 'list', label: 'Trip list' },
]

export function TripManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('details')
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [driverFilter, setDriverFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    const tripId = searchParams.get('tripId')
    if (tab) setActiveTab(tab)
    if (tripId) setSelectedTripId(tripId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // All trips enriched with driver data
  const allTrips = useMemo(() => {
    return (tripsData || []).map((trip) => {
      const driver = drivers.find((d) => String(d.id) === String(trip.driverId)) || {}

      return {
        ...trip,
        driverId: trip.driverId ?? driver.id,
        driverName: driver.name ?? trip.assignedDriver ?? '-',
        cabType: trip.cabType ?? driver.cabType,
        vehicleNumber: trip.vehicleNumber ?? driver.vehicleNumber,
      }
    }).sort((a, b) => (b.createdTime || '').localeCompare(a.createdTime || ''))
  }, [])

  // Selected trip for details view
  const selectedTrip = useMemo(
    () => allTrips.find((t) => t.id === selectedTripId) || null,
    [allTrips, selectedTripId]
  )

  // Driver for selected trip
  const selectedTripDriver = useMemo(() => {
    if (!selectedTrip) return null
    return drivers.find((d) => String(d.id) === String(selectedTrip.driverId)) || null
  }, [selectedTrip])

  // Filtered trips for list view
  const filteredTrips = useMemo(() => {
    let list = [...allTrips]

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      list = list.filter((t) =>
        t.id?.toLowerCase().includes(query) ||
        t.driverName?.toLowerCase().includes(query) ||
        t.riderName?.toLowerCase().includes(query)
      )
    }

    if (driverFilter !== 'all') {
      list = list.filter((t) => String(t.driverId) === String(driverFilter))
    }

    if (statusFilter !== 'all') {
      list = list.filter(
        (t) => (t.tripStatus || '').toLowerCase() === statusFilter.toLowerCase(),
      )
    }

    if (paymentFilter !== 'all') {
      list = list.filter(
        (t) => (t.paymentType || '').toLowerCase() === paymentFilter.toLowerCase(),
      )
    }

    return list
  }, [allTrips, searchQuery, driverFilter, statusFilter, paymentFilter])

  const distinctStatuses = useMemo(() => {
    return Array.from(
      new Set((tripsData || []).map((t) => (t.tripStatus || '').trim()).filter(Boolean)),
    )
  }, [])

  const distinctPayments = useMemo(() => {
    return Array.from(
      new Set((tripsData || []).map((t) => (t.paymentType || '').trim()).filter(Boolean)),
    )
  }, [])

  const distinctDrivers = useMemo(() => {
    const driverIdsInTrips = Array.from(
      new Set((tripsData || []).map((t) => String(t.driverId)).filter(Boolean)),
    )

    return driverIdsInTrips
      .map((id) => {
        const d = drivers.find((x) => String(x.id) === String(id))
        return d ? { id: d.id, name: d.name } : { id, name: id }
      })
      .filter(Boolean)
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    if (selectedTripId) next.set('tripId', selectedTripId)
    setSearchParams(next, { replace: true })
  }

  const handleTripSelect = (id) => {
    setSelectedTripId(id)
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    if (id) next.set('tripId', id)
    setSearchParams(next, { replace: true })
  }

  const handleTripClick = (trip) => {
    setSelectedTripId(trip.id)
    setActiveTab('details')
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    next.set('tripId', trip.id)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="space-y-6">
      {/* Header + tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Trip Management"
          description="Monitor trip details, lists and filter by driver, status and payment type."
        >
          {/* Trip Dropdown (only on details tab) */}
          {activeTab === 'details' && (
            <TripDropdown
              trips={allTrips}
              selectedTripId={selectedTripId}
              onChange={handleTripSelect}
            />
          )}

          {/* Search Controls (only on list tab) */}
          {activeTab === 'list' && (
            <div className="flex gap-2 items-center justify-end">
              <input
                type="text"
                placeholder="Search by trip ID, driver, or rider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <button
                onClick={() => {
                  setSearchQuery('')
                  setDriverFilter('all')
                  setStatusFilter('all')
                  setPaymentFilter('all')
                }}
                className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          )}
        </PageHeader>

        <TabNavigation
          tabs={TRIP_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </section>

      {/* TAB: Trip details */}
      {activeTab === 'details' && (
        <>
          {selectedTrip ? (
            <TripDetails
              driver={selectedTripDriver}
              trip={selectedTrip}
              trips={allTrips}
              onSelectTrip={handleTripSelect}
            />
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <p className="text-sm text-slate-600">
                Please select a trip from the dropdown above to view its details.
              </p>
            </section>
          )}
        </>
      )}

      {/* TAB: Trip list */}
      {activeTab === 'list' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Trip list</h3>
              <p className="text-xs text-slate-600">Overview of all trips across drivers.</p>
            </div>
            <div className="text-xs text-slate-600">
              Showing <span className="font-semibold">{filteredTrips.length}</span> of <span className="font-semibold">{allTrips.length}</span> trips
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Driver
              </label>
              <select
                value={driverFilter}
                onChange={(e) => setDriverFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
              >
                <option value="all">All drivers</option>
                {distinctDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Trip status
              </label>
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
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Payment type
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
              >
                <option value="all">All</option>
                {distinctPayments.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TripListTable trips={filteredTrips} onTripClick={handleTripClick} />
        </div>
      )}
    </div>
  )
}

export default TripManagementPage
