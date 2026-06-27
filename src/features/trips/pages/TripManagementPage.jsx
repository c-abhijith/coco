import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getTripDetail } from '../../../api/tripApi'
import { PageHeader } from '../../../shared/components/PageHeader'
import { TripDetails } from '../components/TripDetails'

export function TripManagementPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [selectedTripId, setSelectedTripId] = useState(null)
  const [tripData, setTripData]             = useState(null)
  const [tripLoading, setTripLoading]       = useState(false)
  const [tripError, setTripError]           = useState(null)

  useEffect(() => {
    const tripId = searchParams.get('tripId')
    if (tripId) setSelectedTripId(tripId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedTripId) { setTripData(null); return }
    setTripLoading(true)
    setTripError(null)
    getTripDetail(selectedTripId)
      .then((res) => setTripData(res?.data?.[0] ?? null))
      .catch((err) => { setTripError(err?.message || 'Failed to load trip'); setTripData(null) })
      .finally(() => setTripLoading(false))
  }, [selectedTripId])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Trip Management"
          description="View trip details by selecting a trip from Rider management."
        >
          {tripData && (
            <button
              onClick={() => navigate(`/complaints/create?tripId=${tripData.TripID}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Add Complaint
            </button>
          )}
        </PageHeader>
      </section>

      {tripError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {tripError}
        </div>
      )}

      <TripDetails trip={tripData} loading={tripLoading} />
    </div>
  )
}

export default TripManagementPage
