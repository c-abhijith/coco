// src/pages/DriverManagementPage.jsx
import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getDrivers } from '../../../shared/data/driver'
import { getDriverLogoffState, setDriverLogoffState } from '../../../shared/data/driverLogoff'
import { DriverDropdown } from '../../../shared/components/DriverDropdown'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TabNavigation } from '../../../shared/components/TabNavigation'
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
   * State to control the visibility of the logoff control panel
   * When true, the DriverLogoffControl component is displayed below the driver profile
   */
  const [showLogoffControls, setShowLogoffControls] = useState(false)

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

  const trips = selectedDriver?.trips || []

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
   * Filter drivers based on selected checkboxes
   */
  const filteredDriversList = useMemo(() => {
    let filtered = [...driversList]

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
  }, [driversList, showOnlineDrivers, showNewDrivers])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    if (selectedDriverId) next.set('driverId', selectedDriverId)
    setSearchParams(next, { replace: true })
  }

  const handleDriverSelect = (id) => {
    setSelectedDriverId(id)
    setShowLogoffControls(false)
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
          <DriverMetricsGrid metrics={metrics} />

          {/* Selected driver profile */}
          {selectedDriver && (
            <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-5">
              <DriverProfileSection
                driver={selectedDriver}
                currentLogoff={currentLogoff}
                onToggleLogoffControls={() =>
                  setShowLogoffControls((prev) => !prev)
                }
              />

              {/* NEW: Log off control panel */}
              {currentLogoff && showLogoffControls && (
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

          {selectedDriver && (
            <VehiclesSection driver={selectedDriver} onNavigate={navigate} />
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
            <div className="text-xs text-slate-600">
              Total drivers: <span className="font-semibold">{filteredDriversList.length}</span>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
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
            <button
              onClick={() => navigate('/drivers/create')}
              className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
            >
              + Create driver
            </button>
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
                      No drivers found.
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
    </div>
  )

}

// So App.jsx can do: import { DriverManagementPage } from './pages/DriverManagementPage'
export default DriverManagementPage
