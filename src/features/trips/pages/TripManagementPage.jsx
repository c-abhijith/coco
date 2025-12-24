import React, { useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { drivers } from '../../../shared/data/driversData'
import { trips as tripsData } from '../../../shared/data/tripsData'

export function TripManagementPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialDriverId = searchParams.get('driverId') || 'all'

  const [driverFilter, setDriverFilter] = useState(initialDriverId)
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  const trips = useMemo(() => {
    // ✅ MAIN FIX: use tripsData (not driver.trips)
    let list = (tripsData || []).map((trip) => {
      const driver = drivers.find((d) => String(d.id) === String(trip.driverId)) || {}

      return {
        ...trip,
        driverId: trip.driverId ?? driver.id,
        driverName: driver.name ?? trip.assignedDriver ?? '-',
        cabType: trip.cabType ?? driver.cabType,
        vehicleNumber: trip.vehicleNumber ?? driver.vehicleNumber,
      }
    })

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

    return list.sort((a, b) => (b.createdTime || '').localeCompare(a.createdTime || ''))
  }, [driverFilter, statusFilter, paymentFilter])

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

  const openTripDetails = (trip) => {
    // keep your existing route style
    navigate(`/trip-details?userId=${encodeURIComponent(trip.driverId)}&tripId=${encodeURIComponent(trip.id)}`)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Trip Management
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              View and filter all trips across drivers with driver, status and
              payment filters.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
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
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Trip ID</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Rider</th>
                <th className="px-4 py-3">Created time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Cab / Vehicle</th>
                <th className="px-4 py-3">Pickup</th>
                <th className="px-4 py-3">Drop</th>
              </tr>
            </thead>

            <tbody>
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-slate-500">
                    No trips found for the selected filters.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => openTripDetails(trip)}
                    title="Click to open trip details"
                  >
                    <td className="px-4 py-3 text-slate-700">{trip.id || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{trip.driverName || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{trip.riderName || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{trip.createdTime || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{trip.tripStatus || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{trip.paymentType || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {trip.cabType || '-'} / {trip.vehicleNumber || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                      {trip.pickLocationAddress || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                      {trip.dropLocationAddress || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </section>
    </div>
  )
}

export default TripManagementPage
