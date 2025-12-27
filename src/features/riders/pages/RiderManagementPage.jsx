import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { riderDetails } from '../../../shared/data/riderDetails'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TabNavigation } from '../../../shared/components/TabNavigation'
import { RiderDropdown } from '../../../shared/components/RiderDropdown'
import { RiderDetails } from '../components/RiderDetails'
import { RiderListTable } from '../components/RiderListTable'

const RIDER_TABS = [
  { id: 'details', label: 'Rider details' },
  { id: 'list', label: 'Rider list' },
]

/**
 * RiderManagementPage
 *
 * Central page for viewing and managing all riders
 * Shows rider details and list with search capabilities
 */
export function RiderManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('details')
  const [selectedRiderId, setSelectedRiderId] = useState(null)

  useEffect(() => {
    const tab = searchParams.get('tab')
    const riderId = searchParams.get('riderId')
    if (tab) setActiveTab(tab)
    if (riderId) setSelectedRiderId(riderId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Get selected rider object
  const selectedRider = useMemo(
    () => riderDetails.find((r) => r.id === selectedRiderId) || null,
    [selectedRiderId]
  )

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    if (selectedRiderId) next.set('riderId', selectedRiderId)
    setSearchParams(next, { replace: true })
  }

  const handleRiderSelect = (id) => {
    setSelectedRiderId(id)
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    if (id) next.set('riderId', id)
    setSearchParams(next, { replace: true })
  }

  const handleViewRider = (rider) => {
    setSelectedRiderId(rider.id)
    setActiveTab('details')
    const next = new URLSearchParams(searchParams)
    next.set('tab', 'details')
    next.set('riderId', rider.id)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="space-y-6">
      {/* Header + tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Rider Management"
          description="View and manage all riders, their profiles, and activity."
        >
          {/* Rider Dropdown (only on details tab) */}
          {activeTab === 'details' && (
            <RiderDropdown
              riders={riderDetails}
              selectedRiderId={selectedRiderId}
              onChange={handleRiderSelect}
            />
          )}
        </PageHeader>

        <TabNavigation
          tabs={RIDER_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </section>

      {/* TAB: Rider details */}
      {activeTab === 'details' && <RiderDetails rider={selectedRider} />}

      {/* TAB: Rider list */}
      {activeTab === 'list' && <RiderListTable onViewRider={handleViewRider} />}
    </div>
  )
}

export default RiderManagementPage
