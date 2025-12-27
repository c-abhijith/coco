import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { drivers } from '../../../shared/data/driversData'
import { getVehicles, blockVehicle, unblockVehicle } from '../../../shared/data/vehicle'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TabNavigation } from '../../../shared/components/TabNavigation'
import { SidePopup } from '../../../shared/components/SidePopup'
import { computeVehicleMetrics } from '../utils/vehicleMetrics'
import { showSuccess, showError } from '../../../shared/utils/alerts'
import {
  VehicleProfileSection,
} from '../components/VehicleProfileSection'
import { VehicleBlockControl } from '../components/VehicleBlockControl'
import {
  VehicleMetricsGrid,
  VehiclePerformanceMetrics,
  VehicleRevenueMetrics,
  VehicleDocumentsSection,
  VehicleDriverSection,
} from '../components/VehicleMetricsGrid'
import {
  getTotalVehiclesDetails,
  getActiveVehiclesDetails,
  getVehiclesUsedTodayDetails,
  getVehiclesOnlineDetails,
  getVehiclesOfflineDetails,
  getDocumentsExpiringDetails,
  getNoTripsInLast7DaysDetails,
  getVehiclesWithoutDriverDetails,
} from '../utils/vehicleMetricDetails'

/**
 * VehicleManagementPage Component
 *
 * Manages vehicle information with two tabs:
 * 1. Vehicle Details - View detailed information about a selected vehicle
 * 2. Vehicle List - View all vehicles in a table format
 *
 * Similar structure to DriverManagementPage
 * Uses shared PageHeader and TabNavigation components for consistency
 */
export function VehicleManagementPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('details')
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all')
  const [cabTypeFilter, setCabTypeFilter] = useState('all')
  const [tripStatusFilter, setTripStatusFilter] = useState('all')
  const [blockedFilter, setBlockedFilter] = useState('all')

  // Popup states
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupData, setPopupData] = useState({ title: '', items: [] })

  useEffect(() => {
    const tab = searchParams.get('tab')
    const vehicleNumber = searchParams.get('vehicleNumber')
    if (tab) setActiveTab(tab)
    if (vehicleNumber) setSelectedVehicleNumber(vehicleNumber)
  }, [searchParams])

  // Get all vehicles from the data
  const allVehicles = useMemo(() => {
    const vehiclesData = getVehicles()
    return vehiclesData.map((vehicle) => {
      const driver = drivers.find((d) => d.id === vehicle.driverId)
      return {
        ...vehicle,
        driverName: driver?.name || '',
        driverMobile: driver?.mobile || '',
      }
    })
  }, [refreshKey])

  // Get selected vehicle details
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleNumber) return null
    return allVehicles.find((v) => v.vehicleNumber === selectedVehicleNumber) || null
  }, [allVehicles, selectedVehicleNumber])

  // Compute global metrics for all vehicles
  const globalMetrics = useMemo(() => computeVehicleMetrics(allVehicles), [allVehicles])

  // Compute metrics for selected vehicle (single vehicle array)
  const vehicleMetrics = useMemo(
    () => (selectedVehicle ? computeVehicleMetrics([selectedVehicle]) : null),
    [selectedVehicle]
  )

  // If vehicle selected -> use vehicleMetrics, else global
  const metrics = selectedVehicle ? vehicleMetrics : globalMetrics

  // Filter vehicles based on search query and all filters
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((v) => {
      // Search query filter
      if (searchQuery.trim() && !v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Status filter (online/offline)
      if (statusFilter !== 'all') {
        if (statusFilter === 'online' && v.onlineStatus !== 'online') return false
        if (statusFilter === 'offline' && v.onlineStatus !== 'offline') return false
      }

      // Cab type filter
      if (cabTypeFilter !== 'all' && v.cabType !== cabTypeFilter) {
        return false
      }

      // Trip status filter
      if (tripStatusFilter !== 'all') {
        if (tripStatusFilter === 'on_trip' && !v.isVehicleOnTrip) return false
        if (tripStatusFilter === 'available' && v.isVehicleOnTrip) return false
      }

      // Blocked filter
      if (blockedFilter !== 'all') {
        if (blockedFilter === 'blocked' && !v.blocked) return false
        if (blockedFilter === 'unblocked' && v.blocked) return false
      }

      return true
    })
  }, [allVehicles, searchQuery, statusFilter, cabTypeFilter, tripStatusFilter, blockedFilter])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    if (selectedVehicleNumber) next.set('vehicleNumber', selectedVehicleNumber)
    setSearchParams(next, { replace: true })
  }

  const handleVehicleSelect = (vehicleNumber) => {
    setSelectedVehicleNumber(vehicleNumber)
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    if (vehicleNumber) next.set('vehicleNumber', vehicleNumber)
    setSearchParams(next, { replace: true })
  }

  const handleVehicleClick = (vehicleNumber) => {
    setSelectedVehicleNumber(vehicleNumber)
    setActiveTab('details')
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    next.set('vehicleNumber', vehicleNumber)
    setSearchParams(next, { replace: true })
  }

  /**
   * Handle block/unblock state change from VehicleBlockControl component
   * @param {string} vehicleId - The vehicle ID
   * @param {boolean} isBlocked - Whether to block or unblock
   * @param {string} reason - The reason for blocking (empty for unblock)
   */
  const handleBlockStateChange = async (vehicleId, isBlocked, reason) => {
    try {
      if (isBlocked) {
        await blockVehicle(vehicleId, reason)
      } else {
        await unblockVehicle(vehicleId)
      }
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error('Failed to update vehicle block status:', error)
      showError('Error', `Failed to update vehicle: ${error.message}`)
      throw error // Re-throw so the component knows it failed
    }
  }

  const handleMetricClick = (metricKey) => {
    let title = ''
    let items = []

    switch (metricKey) {
      case 'totalVehicles':
        title = 'Total Vehicles'
        items = getTotalVehiclesDetails(allVehicles)
        break
      case 'activeVehicles':
        title = 'Active Vehicles'
        items = getActiveVehiclesDetails(allVehicles)
        break
      case 'vehiclesUsedToday':
        title = 'Vehicles Used Today'
        items = getVehiclesUsedTodayDetails(allVehicles)
        break
      case 'vehiclesOnline':
        title = 'Vehicles Online'
        items = getVehiclesOnlineDetails(allVehicles)
        break
      case 'vehiclesOffline':
        title = 'Vehicles Offline'
        items = getVehiclesOfflineDetails(allVehicles)
        break
      case 'documentsExpiringIn15Days':
        title = 'Documents Expiring in 15 Days'
        items = getDocumentsExpiringDetails(allVehicles)
        break
      case 'noTripsInLast7Days':
        title = 'No Trips in Last 7 Days'
        items = getNoTripsInLast7DaysDetails(allVehicles)
        break
      case 'vehiclesWithoutAssignedDriver':
        title = 'Vehicles Without Assigned Driver'
        items = getVehiclesWithoutDriverDetails(allVehicles)
        break
      default:
        return
    }

    setPopupData({ title, items })
    setPopupOpen(true)
  }

  const renderVehicleItem = (item, index) => {
    return (
      <div className="p-4 border-2 border-yellow-400 bg-yellow-50 rounded-xl hover:shadow-lg transition-all">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
              Vehicle Number
            </div>
            <div className="text-base font-bold text-slate-900">
              {item.vehicleNumber || '-'}
            </div>
            <div className="text-sm text-slate-700 mt-1">
              {item.vehicleName || item.brand || '-'}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleVehicleClick(item.vehicleNumber)
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

  const VEHICLE_TABS = [
    { id: 'details', label: 'Vehicle details' },
    { id: 'list', label: 'Vehicle list' },
  ]

  return (
    <div className="space-y-6">
      {/* Header + Tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Vehicle Management"
          description="Monitor vehicle details and view all registered vehicles."
        >
          {/* Vehicle Dropdown (only on details tab) */}
          {activeTab === 'details' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Select Vehicle
              </label>
              <select
                value={selectedVehicleNumber || ''}
                onChange={(e) => handleVehicleSelect(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
              >
                <option value="">Choose a vehicle</option>
                {allVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.vehicleNumber}>
                    {vehicle.vehicleNumber} - {vehicle.vehicleName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Controls (only on list tab) */}
          {activeTab === 'list' && (
            <div className="flex gap-2 items-center justify-end">
              <input
                type="text"
                placeholder="Search by vehicle number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setCabTypeFilter('all')
                  setTripStatusFilter('all')
                  setBlockedFilter('all')
                }}
                className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          )}
        </PageHeader>

        {/* Tab Navigation - using underline variant */}
        <TabNavigation
          tabs={VEHICLE_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="underline"
        />
      </section>

      {/* TAB: Vehicle Details */}
      {activeTab === 'details' && (
        <>
          {/* Vehicle Metrics Grid */}
          <VehicleMetricsGrid metrics={metrics} onMetricClick={handleMetricClick} />
          {!selectedVehicle ? (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <p className="text-sm text-slate-600">
                Please select a vehicle from the dropdown above to view details.
              </p>
            </section>
          ) : (
            <>
              {/* Vehicle Profile Section */}
              <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-5">
                <VehicleProfileSection vehicle={selectedVehicle} />

                {/* Vehicle Block Control */}
                <VehicleBlockControl
                  vehicle={selectedVehicle}
                  onBlockStateChange={handleBlockStateChange}
                />

                {/* Trip & Performance Metrics */}
                <VehiclePerformanceMetrics
                  vehicle={selectedVehicle}
                  navigate={navigate}
                />

                {/* Revenue Metrics */}
                <VehicleRevenueMetrics vehicle={selectedVehicle} />

                {/* Driver Assignment Section */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Driver Assignment
                  </h4>
                  <VehicleDriverSection vehicle={selectedVehicle} />
                </div>

                {/* Documents & Certificates Section */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Documents & Certificates
                  </h4>
                  <VehicleDocumentsSection vehicle={selectedVehicle} />
                </div>
              </section>
            </>
          )}
        </>
      )}

      {/* TAB: Vehicle List */}
      {activeTab === 'list' && (
        <>
          {/* Filter Controls */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
            {/* Online/Offline Status Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <button
                  onClick={() => {
                    setStatusFilter('all')
                    setCabTypeFilter('all')
                    setTripStatusFilter('all')
                    setBlockedFilter('all')
                  }}
                  className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-brand-yellow text-slate-900'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === 'online'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => setStatusFilter('offline')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === 'offline'
                      ? 'bg-slate-500 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>

            {/* Cab Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Cab Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setCabTypeFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    cabTypeFilter === 'all'
                      ? 'bg-brand-yellow text-slate-900'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setCabTypeFilter('SEDAN')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    cabTypeFilter === 'SEDAN'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  Sedan
                </button>
                <button
                  onClick={() => setCabTypeFilter('SUV')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    cabTypeFilter === 'SUV'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  SUV
                </button>
                <button
                  onClick={() => setCabTypeFilter('HATCHBACK')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    cabTypeFilter === 'HATCHBACK'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  Hatchback
                </button>
              </div>
            </div>

            {/* Trip Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Trip Status</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTripStatusFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    tripStatusFilter === 'all'
                      ? 'bg-brand-yellow text-slate-900'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTripStatusFilter('on_trip')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    tripStatusFilter === 'on_trip'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  On Trip
                </button>
                <button
                  onClick={() => setTripStatusFilter('available')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    tripStatusFilter === 'available'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}
                >
                  Available
                </button>
              </div>
            </div>

            {/* Blocked Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Blocked Status</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBlockedFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    blockedFilter === 'all'
                      ? 'bg-brand-yellow text-slate-900'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setBlockedFilter('unblocked')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    blockedFilter === 'unblocked'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setBlockedFilter('blocked')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    blockedFilter === 'blocked'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  Blocked
                </button>
              </div>
            </div>

            {/* Active Filter Summary - Colors match filter buttons */}
            {(statusFilter !== 'all' || cabTypeFilter !== 'all' || tripStatusFilter !== 'all' || blockedFilter !== 'all') && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-600">Active filters:</span>
                  {statusFilter !== 'all' && (
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      statusFilter === 'online'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      Status: {statusFilter}
                    </span>
                  )}
                  {cabTypeFilter !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      Type: {cabTypeFilter}
                    </span>
                  )}
                  {tripStatusFilter !== 'all' && (
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      tripStatusFilter === 'on_trip'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Trip: {tripStatusFilter.replace('_', ' ')}
                    </span>
                  )}
                  {blockedFilter !== 'all' && (
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      blockedFilter === 'blocked'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {blockedFilter}
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Create Vehicle Button */}
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filteredVehicles.length}</span> of <span className="font-semibold text-slate-900">{allVehicles.length}</span> vehicles
            </div>
            <button
              onClick={() => navigate('/vehicles/create')}
              className="rounded-lg bg-brand-yellow px-4 py-1.5 text-sm font-semibold text-slate-900 hover:opacity-95 transition-opacity"
            >
              + Create Vehicle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Vehicle Number</th>
                  <th className="px-4 py-3">Brand & Model</th>
                  <th className="px-4 py-3">Cab Type</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total Trips</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                      {searchQuery ? 'No vehicles match your search.' : 'No vehicles found.'}
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleVehicleClick(vehicle.vehicleNumber)}
                      title="Click to view details"
                    >
                      <td className="px-4 py-3 text-slate-700 font-semibold">{vehicle.vehicleNumber}</td>
                      <td className="px-4 py-3 text-slate-700">{vehicle.brand} {vehicle.model}</td>
                      <td className="px-4 py-3 text-slate-700">{vehicle.cabType}</td>
                      <td className="px-4 py-3 text-slate-700">{vehicle.ownerName}</td>
                      <td className="px-4 py-3 text-slate-700">{vehicle.driverName || 'None'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Online/Offline Badge - Match filter button colors */}
                          {vehicle.onlineStatus === 'online' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                              Offline
                            </span>
                          )}

                          {/* Trip Status Badge */}
                          {vehicle.isVehicleOnTrip && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z"/>
                              </svg>
                              Trip
                            </span>
                          )}

                          {/* Active/Blocked Status Badge */}
                          {vehicle.blocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                              </svg>
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{vehicle.totalTripsCompleted}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        </>
      )}

      {/* Side Popup for Metric Details */}
      <SidePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupData.title}
        data={popupData.items}
        renderItem={renderVehicleItem}
        emptyMessage="No data available for this metric"
      />
    </div>
  )
}

export default VehicleManagementPage
