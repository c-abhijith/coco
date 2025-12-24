// src/pages/RiderManagementPage.jsx

import React, { useState } from 'react'
import { drivers } from '../../../shared/data/driversData'

// Helper: build rider profile + trips from mobile/email
function buildRiderFromQuery(query) {
  if (!query) return null

  const q = query.trim().toLowerCase()
  const trips = []

  for (const driver of drivers) {
    for (const trip of driver.trips || []) {
      const mobile = (trip.riderMobile || '').trim().toLowerCase()
      const email =
        (trip.riderEmail || trip.riderMailId || '').trim().toLowerCase()

      const isMatch =
        (mobile && mobile === q) ||
        (email && email === q)

      if (isMatch) {
        trips.push({
          ...trip,
          driverId: driver.id,
          driverName: driver.name,
          driverMobile: driver.mobile,
          cabType: trip.cabType || driver.cabType,
          vehicleNumber: trip.vehicleNumber || driver.vehicleNumber,
        })
      }
    }
  }

  if (trips.length === 0) return null

  const first = trips[0]
  const riderName = first.riderName || ''
  const riderMobile = first.riderMobile || ''
  const riderEmail = first.riderEmail || first.riderMailId || ''

  const sortedTrips = trips
    .slice()
    .sort((a, b) => (b.createdTime || '').localeCompare(a.createdTime || ''))

  const totalTrips = sortedTrips.length
  const completedTrips = sortedTrips.filter(
    (t) => (t.tripStatus || '').toLowerCase() === 'completed',
  ).length
  const cancelledTrips = sortedTrips.filter(
    (t) => (t.tripStatus || '').toLowerCase() === 'cancelled',
  ).length
  const totalSpend = sortedTrips.reduce(
    (sum, t) => sum + (t.totalFare != null ? Number(t.totalFare) : 0),
    0,
  )

  let lastTripTime = ''
  if (sortedTrips[0]?.createdTime) {
    lastTripTime = sortedTrips[0].createdTime
  }

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const yest = new Date(now)
  yest.setDate(now.getDate() - 1)
  const yesterdayStr = yest.toISOString().slice(0, 10)

  const daysAgo = (n) => {
    const d = new Date(now)
    d.setDate(now.getDate() - n)
    return d
  }

  const tripsToday = sortedTrips.filter((t) => {
    if (!t.createdTime) return false
    const d = new Date(t.createdTime)
    if (isNaN(d)) return false
    return d.toISOString().slice(0, 10) === todayStr
  }).length

  const tripsYesterday = sortedTrips.filter((t) => {
    if (!t.createdTime) return false
    const d = new Date(t.createdTime)
    if (isNaN(d)) return false
    return d.toISOString().slice(0, 10) === yesterdayStr
  }).length

  const tripsLast7Days = sortedTrips.filter((t) => {
    if (!t.createdTime) return false
    const d = new Date(t.createdTime)
    if (isNaN(d)) return false
    return d >= daysAgo(7)
  }).length

  const tripsLast30Days = sortedTrips.filter((t) => {
    if (!t.createdTime) return false
    const d = new Date(t.createdTime)
    if (isNaN(d)) return false
    return d >= daysAgo(30)
  }).length

  const cancellationRate =
    totalTrips > 0 ? ((cancelledTrips / totalTrips) * 100).toFixed(1) : '0.0'

  return {
    riderName,
    riderMobile,
    riderEmail,
    trips: sortedTrips,
    stats: {
      totalTrips,
      completedTrips,
      cancelledTrips,
      cancellationRate,
      totalSpend,
      lastTripTime,
      tripsToday,
      tripsYesterday,
      tripsLast7Days,
      tripsLast30Days,
    },
  }
}

export function RiderManagementPage() {
  const [mobileInput, setMobileInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = () => {
    const query = mobileInput.trim() || emailInput.trim()
    setSearched(true)

    if (!query) {
      setResult(null)
      return
    }

    const rider = buildRiderFromQuery(query)
    setResult(rider)
  }

  const hasResult = !!result

  return (
    <div className="space-y-6">
      {/* Search panel */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Rider Management
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Enter the rider&apos;s mobile number <span className="font-semibold">or</span>{' '}
          email ID to view detailed ride history and metrics.
        </p>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto] items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Enter Rider Mobile Number
            </label>
            <input
              type="text"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
              placeholder="e.g. 9998887771"
            />
          </div>

          {/* OR Divider */}
          <div className="hidden md:flex items-center justify-center pb-2">
            <span className="text-sm font-bold text-black">OR</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Enter Rider Email ID
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow"
              placeholder="e.g. anand.kumar@example.com"
            />
          </div>

          <div className="flex md:justify-end">
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center w-full md:w-auto rounded-xl bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-dark shadow-sm hover:bg-amber-300 transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {searched && !hasResult && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          No rider found for the given mobile/email. Please double-check the value
          and try again.
        </section>
      )}

      {hasResult && (
        <>
          {/* Rider summary */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Name
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {result.riderName || '-'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Mobile
                </div>
                <div className="mt-1 text-sm text-slate-900">
                  {result.riderMobile || '-'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Email
                </div>
                <div className="mt-1 text-sm text-slate-900">
                  {result.riderEmail || '-'}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
              <MetricCard label="Total Trips" value={result.stats.totalTrips} />
              <MetricCard
                label="Completed Trips"
                value={result.stats.completedTrips}
              />
              <MetricCard
                label="Cancelled Trips"
                value={result.stats.cancelledTrips}
              />
              <MetricCard
                label="Cancellation Rate %"
                value={`${result.stats.cancellationRate}%`}
              />
              <MetricCard
                label="Total Spend"
                value={
                  result.stats.totalSpend != null
                    ? `₹${result.stats.totalSpend.toFixed(2)}`
                    : '--'
                }
              />
              <MetricCard
                label="Last Ride Time"
                value={result.stats.lastTripTime || '-'}
              />
              <MetricCard label="Trips Today" value={result.stats.tripsToday} />
              <MetricCard
                label="Trips Yesterday"
                value={result.stats.tripsYesterday}
              />
              <MetricCard
                label="Trips Last 7 Days"
                value={result.stats.tripsLast7Days}
              />
              <MetricCard
                label="Trips Last 30 Days"
                value={result.stats.tripsLast30Days}
              />
            </div>
          </section>

          {/* Rider trips table */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Trips for this rider
                </h3>
                <p className="text-xs text-slate-600">
                  Showing {result.trips.length} trip
                  {result.trips.length > 1 ? 's' : ''} in reverse chronological order.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="px-4 py-3">Trip ID</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Driver Name</th>
                    <th className="px-4 py-3">Vehicle No</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Collected Amount</th>
                    <th className="px-4 py-3">Created Time</th>
                    <th className="px-4 py-3">Pick Location</th>
                    <th className="px-4 py-3">Drop Location</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-2 font-medium text-slate-900">
                        {trip.id}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {trip.tripStatus || '-'}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {trip.driverName || '-'}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {trip.vehicleNumber || '-'}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {trip.paymentType || '-'}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {trip.totalFare != null ? `₹${trip.totalFare}` : '--'}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {trip.createdTime || '-'}
                      </td>
                      <td className="px-4 py-2 text-slate-700 max-w-xs truncate">
                        {trip.pickLocationAddress || '-'}
                      </td>
                      <td className="px-4 py-2 text-slate-700 max-w-xs truncate">
                        {trip.dropLocationAddress || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

export default RiderManagementPage
