import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { PageHeader } from '../../../shared/components/PageHeader'
import { RiderDetails } from '../components/RiderDetails'
import { RiderTripDetails } from '../components/RiderTripDetails'
import { RiderPendingAmount } from '../components/RiderPendingAmount'
import { getRiderDetailsByPhone, getRiderTripDetails, getRiderPendingAmount } from '../../../api/riderApi'

export function RiderManagementPage() {
  const [phone, setPhone] = useState('9446753935')
  const [riderData, setRiderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [trips, setTrips] = useState(null)
  const [tripLoading, setTripLoading] = useState(false)
  const [pendingData, setPendingData] = useState(null)
  const [pendingLoading, setPendingLoading] = useState(false)
  // 'trips' | 'pending' | null
  const [activeCard, setActiveCard] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    const trimmed = phone.trim()
    if (!trimmed) return

    setLoading(true)
    setRiderData(null)
    setTrips(null)
    setPendingData(null)
    setActiveCard(null)

    try {
      const res = await getRiderDetailsByPhone(trimmed)

      if (!res?.data || res.data.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Rider Not Found',
          html: `<span style="font-size:13px;color:#64748b">${res?.status_desc || 'No rider found for this number'}</span>`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        })
        return
      }

      setRiderData(res.data[0])
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Search Failed',
        html: `<span style="font-size:13px;color:#64748b">${err?.message || 'Unable to fetch rider details. Please try again.'}</span>`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTripDetails = async () => {
    if (activeCard === 'trips') { setActiveCard(null); return }

    setActiveCard('trips')
    if (trips) return  // already loaded

    setTripLoading(true)
    try {
      const res = await getRiderTripDetails(phone.trim())
      setTrips({ count: res?.count ?? 0, data: res?.data ?? [] })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Trips',
        html: `<span style="font-size:13px;color:#64748b">${err?.message || 'Unable to fetch trip details.'}</span>`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      })
      setActiveCard(null)
    } finally {
      setTripLoading(false)
    }
  }

  const handlePendingAmount = async () => {
    if (activeCard === 'pending') { setActiveCard(null); return }

    setActiveCard('pending')
    if (pendingData) return  // already loaded

    setPendingLoading(true)
    try {
      const res = await getRiderPendingAmount(phone.trim())
      setPendingData(res?.data ?? [])
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Pending Amount',
        html: `<span style="font-size:13px;color:#64748b">${err?.message || 'Unable to fetch pending amount details.'}</span>`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      })
      setActiveCard(null)
    } finally {
      setPendingLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Rider Management"
          description="View and manage all riders, their profiles, and activity."
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-44"
              maxLength={15}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold text-xs px-3 py-1.5 transition disabled:opacity-50"
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </form>
        </PageHeader>
      </section>

      {/* Rider Profile */}
      <RiderDetails rider={riderData} loading={loading} />

      {/* Action buttons — show below profile card once a rider is loaded */}
      {riderData && (
        <div className="flex gap-3">
          <button
            onClick={handleTripDetails}
            disabled={tripLoading}
            className={`rounded-xl font-semibold text-sm px-5 py-2 shadow transition disabled:opacity-50 ${
              activeCard === 'trips'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tripLoading ? 'Loading…' : 'Trip Details'}
          </button>

          <button
            onClick={handlePendingAmount}
            disabled={pendingLoading}
            className={`rounded-xl font-semibold text-sm px-5 py-2 shadow transition disabled:opacity-50 ${
              activeCard === 'pending'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {pendingLoading ? 'Loading…' : 'Pending Amount'}
          </button>
        </div>
      )}

      {/* Content card — switches based on active button */}
      {activeCard === 'trips' && (
        <RiderTripDetails trips={trips} loading={tripLoading} />
      )}
      {activeCard === 'pending' && (
        <RiderPendingAmount data={pendingData} loading={pendingLoading} />
      )}
    </div>
  )
}

export default RiderManagementPage
