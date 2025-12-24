import React, { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { drivers } from '../../../shared/data/driversData'
import { trips as allTrips } from '../../../shared/data/tripsData'
import { TripDetails } from '../components/TripDetails'

function safe(v, fallback = '—') {
  if (v === null || v === undefined || v === '') return fallback
  return v
}

// get trips for a driver using tripIds OR fallback driverId
function getTripsForDriver(driver) {
  if (!driver) return []

  if (Array.isArray(driver.tripIds) && driver.tripIds.length) {
    const set = new Set(driver.tripIds)
    return allTrips.filter((t) => set.has(t.id))
  }

  // fallback if you keep driverId in trips
  return allTrips.filter((t) => t.driverId === driver.id)
}

function findDriverById(driverId) {
  return drivers.find((d) => d.id === driverId) || null
}

function findDriverForTrip(trip) {
  if (!trip) return null

  // If trip has driverId
  if (trip.driverId) return findDriverById(trip.driverId)

  // Else: infer by tripIds
  return drivers.find((d) => Array.isArray(d.tripIds) && d.tripIds.includes(trip.id)) || null
}

function formatINR(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '₹0'
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
}

function TripListTable({ trips, onOpenTrip }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900">Trips</div>
        <div className="text-xs text-slate-500">Click a row to open trip details</div>
      </div>

      {(!trips || trips.length === 0) ? (
        <div className="p-6 text-sm text-slate-600">No trips found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                {['Trip ID', 'Driver', 'Time', 'Status', 'Payment', 'Fare'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {trips.map((t) => {
                const drv = findDriverForTrip(t)
                return (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => onOpenTrip(t, drv)}
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{t.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {drv ? `${drv.name} (${drv.id})` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{safe(t.createdTime)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{safe(t.tripStatus)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{safe(t.paymentType)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatINR(t.totalFare)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function TripDetailsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const userId = searchParams.get('userId')   // D1001
  const tripId = searchParams.get('tripId')   // T10002

  const driver = useMemo(() => {
    if (!userId) return null
    return findDriverById(userId)
  }, [userId])

  const tripsForView = useMemo(() => {
    // 1) No params -> show ALL trips list
    if (!userId && !tripId) return allTrips

    // 2) userId only -> show that driver's trips list
    if (userId && !tripId) return getTripsForDriver(driver)

    // 3) tripId exists -> we will show detail below, list not required
    return []
  }, [userId, tripId, driver])

  const selectedTrip = useMemo(() => {
    if (!tripId) return null
    return allTrips.find((t) => t.id === tripId) || null
  }, [tripId])

  const selectedTripDriver = useMemo(() => {
    if (driver) return driver
    return selectedTrip ? findDriverForTrip(selectedTrip) : null
  }, [driver, selectedTrip])

  const openTrip = (trip, drv) => {
    // keep consistent with your URL format
    const dId = (drv?.id) || userId || ''
    navigate(`/trip-details?userId=${encodeURIComponent(dId)}&tripId=${encodeURIComponent(trip.id)}`)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to Users
      </button>

      {/* Header card (same style as your screenshot) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Trip details</h2>
        <p className="text-sm text-slate-600">
          Driver:{' '}
          {selectedTripDriver
            ? `${selectedTripDriver.name} (${selectedTripDriver.id})`
            : (userId ? userId : 'All drivers')}
        </p>
      </div>

      {/* CASE A: No query params -> show list of ALL trips */}
      {!userId && !tripId && (
        <TripListTable trips={tripsForView} onOpenTrip={openTrip} />
      )}

      {/* CASE B: userId only -> show list of trips for that driver */}
      {userId && !tripId && (
        <TripListTable trips={tripsForView} onOpenTrip={openTrip} />
      )}

      {/* CASE C: tripId exists -> show detail UI */}
      {tripId && (
        <TripDetails
          driver={selectedTripDriver}
          trip={selectedTrip}
          // you can optionally show dropdown list inside details too
          trips={
            selectedTripDriver
              ? getTripsForDriver(selectedTripDriver)
              : []
          }
          onSelectTrip={(nextTripId) => {
            const dId = selectedTripDriver?.id || userId || ''
            navigate(`/trip-details?userId=${encodeURIComponent(dId)}&tripId=${encodeURIComponent(nextTripId)}`)
          }}
        />
      )}
    </div>
  )
}

export default TripDetailsPage
