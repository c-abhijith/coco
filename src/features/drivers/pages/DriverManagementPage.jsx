// src/pages/DriverManagementPage.jsx
import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getDrivers as fetchDriversList,
  getDriverMetrics,
  getDriverLastTrips,
  getDriverVehicleDetails,
} from '../../../api/driverApi'
import { mapApiDriver } from '../../../api/driverMapper'
import { getDriverLogoffState, setDriverLogoffState } from '../../../shared/data/driverLogoff'
import { DriverDropdown } from '../../../shared/components/DriverDropdown'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TabNavigation } from '../../../shared/components/TabNavigation'
import { SidePopup } from '../../../shared/components/SidePopup'
import { computeGlobalMetrics } from '../utils/driverMetrics'
import {
  DriverMetricsGrid,
  DriverPerformanceMetrics,
  DriverPayoutMetrics,
  DriverComplianceMetrics,
  DriverDeviceMetrics,
} from '../components/DriverMetricsGrid'
import { DriverProfileSection } from '../components/DriverProfileSection'
import { DriverLogoffControl } from '../components/DriverLogoffControl'
import { VehiclesSection } from '../components/VehiclesSection'
import { TripsGrid } from '../components/TripsGrid'
import { DriverListTable } from '../components/DriverListTable'
import {
  getTotalDriversDetails,
  getTotalActiveDriversDetails,
  getOnlineNowDetails,
  getIdleOnlineDriversDetails,
  getDriversWhoDroveTodayDetails,
  getDriversWithComplaintsDetails,
  getDriversWithHighCancellationDetails,
  getOverallAvgRatingDetails,
  getAvgTripsPerDriverDetails,
  getAvgAcceptanceRateDetails,
  getAvgCancellationRateDetails,
  getAvgComplaintsPer100TripsDetails,
  getAvgNoShowCountDetails,
} from '../utils/driverMetricDetails'

const DRIVER_TABS = [
  { id: 'details', label: 'Driver details' },
  { id: 'list', label: 'Driver list' },
]

export function DriverManagementPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('details')
  const [selectedDriverId, setSelectedDriverId] = useState(null)

  // ── Driver list state ──────────────────────────────────────
  const [driversList, setDriversList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Per-driver detail state ───────────────────────────────
  const [selectedDriverDetails, setSelectedDriverDetails] = useState(null)
  const [trips, setTrips] = useState([])
  const [driverVehicle, setDriverVehicle] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // ── Filter / search state ─────────────────────────────────
  const [showOnlineDrivers, setShowOnlineDrivers] = useState(false)
  const [showNewDrivers, setShowNewDrivers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // ── Popup state ───────────────────────────────────────────
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupData, setPopupData] = useState({ title: '', items: [] })

  // ── Logoff counter (forces re-render on logoff change) ────
  const [logoffUpdateCounter, setLogoffUpdateCounter] = useState(0)

  // ── Read URL params on mount ──────────────────────────────
  useEffect(() => {
    const tab = searchParams.get('tab')
    const driverId = searchParams.get('driverId')
    if (tab) setActiveTab(tab)
    if (driverId) setSelectedDriverId(driverId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Fetch driver list from API ────────────────────────────
  useEffect(() => {
    setLoading(true)
    fetchDriversList()
      .then((res) => {
        const mapped = (res.data || []).map(mapApiDriver)
        setDriversList(mapped)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load drivers')
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Fetch per-driver data when selection changes ──────────
  useEffect(() => {
    if (!selectedDriverId) return

    setDetailsLoading(true)
    setSelectedDriverDetails(null)
    setTrips([])
    setDriverVehicle(null)

    Promise.all([
      getDriverMetrics(selectedDriverId).catch(() => null),
      getDriverLastTrips(selectedDriverId).catch(() => ({ data: [] })),
      getDriverVehicleDetails(selectedDriverId).catch(() => null),
    ]).then(([metrics, tripsRes, vehicleRes]) => {
      setSelectedDriverDetails(metrics || null)
      setTrips(tripsRes?.data || [])
      setDriverVehicle(vehicleRes || null)
    }).finally(() => setDetailsLoading(false))
  }, [selectedDriverId])

  const handleViewTrip = (trip) => {
    if (!trip || !selectedDriverId) return
    navigate(
      `/trip-details?userId=${encodeURIComponent(
        selectedDriverId,
      )}&tripId=${encodeURIComponent(trip.id)}`,
    )
  }

  const globalMetrics = useMemo(() => computeGlobalMetrics(driversList), [driversList])

  // Merge the base driver (from list) with detailed metrics
  const selectedDriver = useMemo(() => {
    const base = driversList.find((d) => d.id === selectedDriverId) || null
    if (!base) return null
    if (selectedDriverDetails) {
      return { ...base, ...selectedDriverDetails }
    }
    return base
  }, [driversList, selectedDriverId, selectedDriverDetails])

  const currentLogoff = useMemo(() => {
    if (!selectedDriver) return null
    return getDriverLogoffState(selectedDriver.id)
  }, [selectedDriver, logoffUpdateCounter])

  const driverMetrics = useMemo(
    () => (selectedDriver ? computeGlobalMetrics([selectedDriver]) : null),
    [selectedDriver],
  )

  const metrics = selectedDriver ? driverMetrics : globalMetrics

  const onlineDrivers = useMemo(
    () => driversList.filter((d) => d.onlineStatus === 'Online'),
    [driversList],
  )

  const newDrivers = useMemo(() => {
    const today = new Date()
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(today.getDate() - 90)

    return driversList.filter((d) => {
      if (!d.joiningDate) return false
      const joiningDate = new Date(d.joiningDate)
      if (isNaN(joiningDate.getTime())) return false
      return joiningDate >= ninetyDaysAgo && joiningDate <= today
    })
  }, [driversList])

  const filteredDriversList = useMemo(() => {
    let filtered = [...driversList]

    if (searchQuery.trim()) {
      filtered = filtered.filter((d) =>
        d.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (showOnlineDrivers) {
      filtered = filtered.filter((d) => d.onlineStatus === 'Online')
    }

    if (showNewDrivers) {
      const today = new Date()
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(today.getDate() - 90)

      filtered = filtered.filter((d) => {
        if (!d.joiningDate) return false
        const joiningDate = new Date(d.joiningDate)
        if (isNaN(joiningDate.getTime())) return false
        return joiningDate >= ninetyDaysAgo && joiningDate <= today
      })
    }

    return filtered
  }, [driversList, searchQuery, showOnlineDrivers, showNewDrivers])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    if (selectedDriverId) next.set('driverId', selectedDriverId)
    setSearchParams(next, { replace: true })
  }

  const handleDriverSelect = (id) => {
    setSelectedDriverId(id)
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    if (id) next.set('driverId', id)
    setSearchParams(next, { replace: true })
  }

  const handleDriverClick = (id) => {
    setSelectedDriverId(id)
    setActiveTab('details')
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    next.set('driverId', id)
    setSearchParams(next, { replace: true })
  }

  const handleLogoffStateChange = (driverId, newState) => {
    const success = setDriverLogoffState(
      driverId,
      newState.isLoggedOff,
      newState.comment || ''
    )
    if (success) {
      setLogoffUpdateCounter((prev) => prev + 1)
    } else {
      console.error('Failed to save driver logoff state')
    }
  }

  const handleMetricClick = (metricKey) => {
    let title = ''
    let items = []

    switch (metricKey) {
      case 'totalDrivers':
        title = 'Total Drivers'
        items = getTotalDriversDetails(driversList)
        break
      case 'totalActiveDrivers':
        title = 'Total Active Drivers'
        items = getTotalActiveDriversDetails(driversList)
        break
      case 'onlineNow':
        title = 'Drivers Online Now'
        items = getOnlineNowDetails(driversList)
        break
      case 'idleOnlineDrivers':
        title = "Drivers on Own Trip"
        items = getIdleOnlineDriversDetails(driversList)
        break
      case 'driversWhoDroveToday':
        title = 'Drivers Who Drove Today'
        items = getDriversWhoDroveTodayDetails(driversList)
        break
      case 'driversWithComplaints':
        title = 'Drivers with Complaints'
        items = getDriversWithComplaintsDetails(driversList)
        break
      case 'driversWithHighCancellation':
        title = 'Drivers with High Cancellation Rate'
        items = getDriversWithHighCancellationDetails(driversList)
        break
      case 'overallAvgRating':
        title = 'Overall Average Driver Rating'
        items = getOverallAvgRatingDetails(driversList)
        break
      case 'avgTripsPerDriver':
        title = 'Average Trips per Driver'
        items = getAvgTripsPerDriverDetails(driversList)
        break
      case 'avgAcceptanceRate':
        title = 'Average Acceptance Rate'
        items = getAvgAcceptanceRateDetails(driversList)
        break
      case 'avgCancellationRate':
        title = 'Average Cancellation Rate'
        items = getAvgCancellationRateDetails(driversList)
        break
      case 'avgComplaintsPer100Trips':
        title = 'Avg Complaints per 100 Trips'
        items = getAvgComplaintsPer100TripsDetails(driversList)
        break
      case 'avgNoShowCount':
        title = 'Average No-show Count'
        items = getAvgNoShowCountDetails(driversList)
        break
      default:
        return
    }

    setPopupData({ title, items })
    setPopupOpen(true)
  }

  const renderDriverItem = (item) => {
    return (
      <div className="p-4 border-2 border-yellow-400 bg-yellow-50 rounded-xl hover:shadow-lg transition-all">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
              Driver ID
            </div>
            <div className="text-base font-bold text-slate-900">
              {item.driverId || '-'}
            </div>
            <div className="text-sm text-slate-700 mt-1">
              {item.name || '-'}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDriverClick(item.driverId)
              setPopupOpen(false)
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            View
          </button>
        </div>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-slate-500">
        Loading drivers...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header + tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Driver Management"
          description="Monitor driver details, lists and online/new driver activity."
        >
          {activeTab === 'details' && (
            <DriverDropdown
              drivers={driversList}
              selectedDriverId={selectedDriverId}
              onChange={handleDriverSelect}
            />
          )}

          {activeTab === 'list' && (
            <div className="flex gap-2 items-center justify-end">
              <input
                type="text"
                placeholder="Search by driver name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <button
                onClick={() => {
                  setSearchQuery('')
                  setShowOnlineDrivers(false)
                  setShowNewDrivers(false)
                }}
                className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          )}
        </PageHeader>

        <TabNavigation
          tabs={DRIVER_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </section>

      {/* TAB: Driver details */}
      {activeTab === 'details' && (
        <>
          <DriverMetricsGrid metrics={metrics} onMetricClick={handleMetricClick} />

          {detailsLoading && selectedDriverId && (
            <div className="text-xs text-slate-500 px-1">Loading driver details...</div>
          )}

          {selectedDriver && (
            <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-5">
              <DriverProfileSection
                driver={selectedDriver}
                currentLogoff={currentLogoff}
              />

              {currentLogoff && (
                <DriverLogoffControl
                  driver={selectedDriver}
                  currentLogoff={currentLogoff}
                  onLogoffStateChange={handleLogoffStateChange}
                />
              )}

              <DriverPerformanceMetrics
                driver={selectedDriver}
                currentLogoff={currentLogoff}
              />

              <DriverPayoutMetrics driver={selectedDriver} />
              <DriverComplianceMetrics driver={selectedDriver} />
              <DriverDeviceMetrics driver={selectedDriver} />
            </section>
          )}

          {selectedDriver && (
            <VehiclesSection
              driver={selectedDriver}
              vehicle={driverVehicle}
              onNavigate={navigate}
            />
          )}

          {selectedDriver && trips.length > 0 && (
            <TripsGrid
              driver={selectedDriver}
              trips={trips}
              onViewTrip={handleViewTrip}
              onNavigateToTrips={navigate}
            />
          )}
        </>
      )}

      {/* TAB: Driver list */}
      {activeTab === 'list' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Driver list</h3>
              <p className="text-xs text-slate-600">Overview of all registered drivers.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-600">
                Showing <span className="font-semibold">{filteredDriversList.length}</span> of <span className="font-semibold">{driversList.length}</span> drivers
              </div>
              <button
                onClick={() => navigate('/drivers/create')}
                className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
              >
                + Create driver
              </button>
            </div>
          </div>

          {/* Filter Checkboxes */}
          <div className="mb-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={showOnlineDrivers}
                onChange={(e) => setShowOnlineDrivers(e.target.checked)}
                className="rounded border-slate-300 text-brand-yellow focus:ring-brand-yellow"
              />
              Online drivers
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={showNewDrivers}
                onChange={(e) => setShowNewDrivers(e.target.checked)}
                className="rounded border-slate-300 text-brand-yellow focus:ring-brand-yellow"
              />
              New drivers (joined in last 90 days)
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Driver ID</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">City</th>
                  <th className="px-4 py-2">Joined</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDriversList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                      {searchQuery.trim()
                        ? `No drivers match your search "${searchQuery}".`
                        : 'No drivers found.'}
                    </td>
                  </tr>
                ) : (
                  filteredDriversList.map((d) => (
                    <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">
                        <button
                          type="button"
                          onClick={() => handleDriverClick(d.id)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {d.name || '-'}
                        </button>
                      </td>
                      <td className="px-4 py-2 text-slate-500 text-xs font-mono">{d.id ? d.id.slice(0, 8) + '…' : '-'}</td>
                      <td className="px-4 py-2 text-slate-700">{d.mobile || '-'}</td>
                      <td className="px-4 py-2 text-slate-700">{d.city || '-'}</td>
                      <td className="px-4 py-2 text-slate-700">{d.joiningDate || '-'}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          d.onlineStatus === 'Online'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {d.onlineStatus || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Side Popup for Metric Details */}
      <SidePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupData.title}
        data={popupData.items}
        renderItem={renderDriverItem}
        emptyMessage="No data available for this metric"
      />
    </div>
  )
}

export default DriverManagementPage
