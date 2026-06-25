import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTripDetail, getTripDriverQueue } from '../../../api/tripApi'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TripDetails } from '../components/TripDetails'

const formatDate = (val) => {
  if (!val) return '-'
  return new Date(val).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export function TripManagementPage() {
  const [searchParams] = useSearchParams()

  const [selectedTripId, setSelectedTripId] = useState(null)
  const [tripData, setTripData]             = useState(null)
  const [tripLoading, setTripLoading]       = useState(false)
  const [tripError, setTripError]           = useState(null)

  const [queueData, setQueueData]           = useState(null)
  const [queueLoading, setQueueLoading]     = useState(false)
  const [queueError, setQueueError]         = useState(null)
  const [showQueue, setShowQueue]           = useState(false)

  // Read tripId from URL on mount
  useEffect(() => {
    const tripId = searchParams.get('tripId')
    if (tripId) setSelectedTripId(tripId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch trip detail whenever selectedTripId changes
  useEffect(() => {
    if (!selectedTripId) { setTripData(null); return }
    setTripLoading(true)
    setTripError(null)
    setQueueData(null)
    setShowQueue(false)
    getTripDetail(selectedTripId)
      .then((res) => setTripData(res?.data?.[0] ?? null))
      .catch((err) => { setTripError(err?.message || 'Failed to load trip'); setTripData(null) })
      .finally(() => setTripLoading(false))
  }, [selectedTripId])

  const handleToggleQueue = async () => {
    if (showQueue) { setShowQueue(false); return }

    setShowQueue(true)
    if (queueData) return  // already loaded

    setQueueLoading(true)
    setQueueError(null)
    try {
      const res = await getTripDriverQueue(selectedTripId)
      setQueueData(res?.data ?? [])
    } catch (err) {
      setQueueError(err?.message || 'Failed to load driver queue')
      setQueueData([])
    } finally {
      setQueueLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Trip Management"
          description="View trip details by selecting a trip from Rider management."
        />
      </section>

      {tripError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {tripError}
        </div>
      )}

      <TripDetails trip={tripData} loading={tripLoading} />

      {/* Driver Queue — only show button when a trip is loaded */}
      {tripData && (
        <>
          <div className="flex">
            <button
              onClick={handleToggleQueue}
              disabled={queueLoading}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold shadow transition disabled:opacity-50 ${
                showQueue
                  ? 'bg-slate-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {queueLoading ? 'Loading…' : showQueue ? 'Hide Driver Queue' : 'Driver Queue'}
            </button>
          </div>

          {showQueue && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Driver Queue</h3>

              {queueError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  {queueError}
                </div>
              )}

              {queueLoading && (
                <div className="text-sm text-slate-500 text-center py-6">Loading driver queue…</div>
              )}

              {!queueLoading && queueData && queueData.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-6">No drivers in queue for this trip.</div>
              )}

              {!queueLoading && queueData && queueData.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        {['#', 'Driver', 'Pickup', 'Drop', 'Window Start', 'Window Expire'].map((h) => (
                          <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {queueData.map((q, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="py-3 pr-4">
                            <span className="w-6 h-6 rounded-full bg-brand-yellow text-slate-900 text-[10px] font-bold flex items-center justify-center">
                              {q.QueueNumber}
                            </span>
                          </td>
                          <td className="py-3 pr-4 font-medium text-slate-800 whitespace-nowrap">{q.DriverName ?? '-'}</td>
                          <td className="py-3 pr-4 text-slate-600 max-w-[180px] truncate" title={q.PickLocationGMapFullAddress}>
                            {q.PickLocationGMapFullAddress ?? '-'}
                          </td>
                          <td className="py-3 pr-4 text-slate-600 max-w-[200px] truncate" title={q.DropLocations}>
                            {q.DropLocations ?? '-'}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap text-slate-600">{formatDate(q.PaymentWindowStarting)}</td>
                          <td className="py-3 pr-4 whitespace-nowrap text-slate-600">{formatDate(q.PaymentWindowExpire)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default TripManagementPage
