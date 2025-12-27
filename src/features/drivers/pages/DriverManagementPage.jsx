// src/pages/DriverManagementPage.jsx
import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getDrivers } from '../../../shared/data/driver'
import { getDriverLogoffState, setDriverLogoffState } from '../../../shared/data/driverLogoff'
import { getTripsByDriverId } from '../../../shared/data/driverTrips'
import { getVehicleByDriverId } from '../../../shared/data/vehicle'
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
  const [driversList, setDriversList] = useState(() => getDrivers())
  const [showOnlineDrivers, setShowOnlineDrivers] = useState(false)
  const [showNewDrivers, setShowNewDrivers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Popup states
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupData, setPopupData] = useState({ title: '', items: [] })

  useEffect(() => {
    const tab = searchParams.get('tab')
    const driverId = searchParams.get('driverId')
    if (tab) setActiveTab(tab)
    if (driverId) setSelectedDriverId(driverId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Refresh from localStorage (new drivers added)
    setDriversList(getDrivers())
  }, [activeTab])

  /**
   * State counter to force re-render when logoff state changes
   * This ensures that changes to logoff status are immediately reflected in the UI
   */
  const [logoffUpdateCounter, setLogoffUpdateCounter] = useState(0)

  const handleViewTrip = (trip) => {
    if (!trip || !selectedDriverId) return
    navigate(
      `/trip-details?userId=${encodeURIComponent(
        selectedDriverId,
      )}&tripId=${encodeURIComponent(trip.id)}`,
    )
  }

  const globalMetrics = useMemo(() => computeGlobalMetrics(driversList), [driversList])

  const selectedDriver = useMemo(
    () => driversList.find((d) => d.id === selectedDriverId) || null,
    [driversList, selectedDriverId],
  )

  /**
   * Get the current logoff state for the selected driver
   * This reads from persistent localStorage storage, so the state persists across page refreshes
   * The logoffUpdateCounter dependency ensures the UI updates when logoff state changes
   */
  const currentLogoff = useMemo(() => {
    if (!selectedDriver) return null

    // Read the persistent logoff state from localStorage
    return getDriverLogoffState(selectedDriver.id)
  }, [selectedDriver, logoffUpdateCounter])

  const driverMetrics = useMemo(
    () => (selectedDriver ? computeGlobalMetrics([selectedDriver]) : null),
    [selectedDriver],
  )

  // If driver selected -> use driverMetrics, else global
  const metrics = selectedDriver ? driverMetrics : globalMetrics

  // Get trips for selected driver using normalized data
  const trips = useMemo(() => {
    if (!selectedDriver) return []
    return getTripsByDriverId(selectedDriver.id)
  }, [selectedDriver])

  // Get vehicle for selected driver
  const driverVehicle = useMemo(() => {
    if (!selectedDriver) return null
    return getVehicleByDriverId(selectedDriver.id)
  }, [selectedDriver])

  // Helpers for other tabs
  const onlineDrivers = useMemo(
    () => driversList.filter((d) => d.onlineStatus === 'Online'),
    [driversList],
  )

  /**
   * Filter drivers who joined within the last 90 days
   * Uses joiningDate field to determine if driver is "new"
   */
  const newDrivers = useMemo(() => {
    const today = new Date()
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(today.getDate() - 90)

    return driversList.filter((d) => {
      if (!d.joiningDate) return false

      const joiningDate = new Date(d.joiningDate)
      // Check if joining date is valid and within last 90 days
      if (isNaN(joiningDate.getTime())) return false

      return joiningDate >= ninetyDaysAgo && joiningDate <= today
    })
  }, [driversList])

  /**
   * Filter drivers based on selected checkboxes and search query
   */
  const filteredDriversList = useMemo(() => {
    let filtered = [...driversList]

    // Search query filter (by driver name)
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

  /**
   * Handle changes to driver logoff state
   * Saves the new state to persistent localStorage storage
   * @param {string} driverId - The driver ID (e.g., "D1001")
   * @param {Object} newState - Object with { isLoggedOff: boolean, comment: string }
   */
  const handleLogoffStateChange = (driverId, newState) => {
    // Save to persistent storage (localStorage)
    const success = setDriverLogoffState(
      driverId,
      newState.isLoggedOff,
      newState.comment || ''
    )

    if (success) {
      // Force UI re-render to reflect the new logoff state
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

  const renderDriverItem = (item, index) => {
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

  return (
    <div className="space-y-6">
      {/* Header + tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Driver Management"
          description="Monitor driver details, lists and online/new driver activity."
        >
          {/* Driver Dropdown (only on details tab) */}
          {activeTab === 'details' && (
            <DriverDropdown
              drivers={driversList}
              selectedDriverId={selectedDriverId}
              onChange={handleDriverSelect}
            />
          )}

          {/* Search Controls (only on list tab) */}
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

      {/* TAB: Driver details (current driver management page) */}
      {activeTab === 'details' && (
        <>
          {/* Global / Driver metrics row */}
          <DriverMetricsGrid metrics={metrics} onMetricClick={handleMetricClick} />

          {/* Selected driver profile */}
          {selectedDriver && (
            <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-5">
              <DriverProfileSection
                driver={selectedDriver}
                currentLogoff={currentLogoff}
              />

              {/* Driver Log off control panel */}
              {currentLogoff && (
                <DriverLogoffControl
                  driver={selectedDriver}
                  currentLogoff={currentLogoff}
                  onLogoffStateChange={handleLogoffStateChange}
                />
              )}

              {/* Ratings + utilisation row */}
              <DriverPerformanceMetrics
                driver={selectedDriver}
                currentLogoff={currentLogoff}
              />

              {/* Payout & penalties as metric cards */}
              <DriverPayoutMetrics driver={selectedDriver} />

              {/* Compliance / KYC as metric cards (gap continuous) */}
              <DriverComplianceMetrics driver={selectedDriver} />

              {/* Device / GPS / account + schedule as metric cards (gap continuous) */}
              <DriverDeviceMetrics driver={selectedDriver} />
            </section>
          )}

          {/* Driver's Vehicle */}
          {selectedDriver && driverVehicle && (
            <VehiclesSection
              driver={selectedDriver}
              vehicle={driverVehicle}
              onNavigate={navigate}
            />
          )}

          {/* Trips grid for selected driver */}
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
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Online</th>
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
                      <td className="px-4 py-2 text-slate-700">{d.id || '-'}</td>
                      <td className="px-4 py-2 text-slate-700">{d.mobile || '-'}</td>
                      <td className="px-4 py-2 text-slate-700">{d.city || '-'}</td>
                      <td className="px-4 py-2 text-slate-700">{d.status || '-'}</td>
                      <td className="px-4 py-2 text-slate-700">{d.onlineStatus || '-'}</td>
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

// So App.jsx can do: import { DriverManagementPage } from './pages/DriverManagementPage'
export default DriverManagementPage
