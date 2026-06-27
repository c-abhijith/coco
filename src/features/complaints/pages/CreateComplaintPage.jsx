import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { PageHeader } from '../../../shared/components/PageHeader'
import { getTripDetail } from '../../../api/tripApi'

const COMPLAINT_BY_OPTIONS      = ['Rider', 'Driver', 'Admin']
const COMPLAINT_AGAINST_OPTIONS = ['Rider', 'Driver', 'Vehicle', 'Platform']
const COMPLAINT_TYPE_OPTIONS    = [
  'Behavior',
  'Payment Issue',
  'Route Issue',
  'Vehicle Condition',
  'Safety Concern',
  'App Issue',
  'Other',
]

export function CreateComplaintPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tripId = searchParams.get('tripId') ?? ''

  const [tripData, setTripData]   = useState(null)
  const [tripLoading, setTripLoading] = useState(false)

  const [form, setForm] = useState({
    complaintBy:      'Rider',
    complaintAgainst: 'Driver',
    complaintType:    'Behavior',
    description:      '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!tripId) return
    setTripLoading(true)
    getTripDetail(tripId)
      .then((res) => setTripData(res?.data?.[0] ?? null))
      .catch(() => {})
      .finally(() => setTripLoading(false))
  }, [tripId])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.complaintBy === form.complaintAgainst) {
      Swal.fire({ icon: 'error', title: 'Invalid Selection', text: `"Complaint By" and "Complaint Against" cannot both be "${form.complaintBy}".`, toast: true, position: 'top-end', showConfirmButton: false, timer: 4000, timerProgressBar: true })
      return
    }
    if (!form.description.trim()) {
      Swal.fire({ icon: 'warning', title: 'Description required', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        tripId,
        complaintBy:      form.complaintBy,
        complaintAgainst: form.complaintAgainst,
        complaintType:    form.complaintType,
        description:      form.description.trim(),
        complaintDate:    new Date().toISOString(),
        status:           'Open',
      }
      console.log('Complaint payload:', payload)

      await Swal.fire({
        icon: 'success',
        title: 'Complaint Submitted',
        html: `<span style="font-size:13px;color:#64748b">Complaint has been recorded successfully.</span>`,
        confirmButtonColor: '#eab308',
      })
      navigate(-1)
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Submission Failed', text: err?.message || 'Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5"
  const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow transition"

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Add Complaint"
          description="Submit a complaint related to a trip."
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </PageHeader>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        {/* Trip context */}
        <div className="mb-5 rounded-xl bg-slate-50 border border-slate-100 p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Trip Information</div>
          {tripLoading ? (
            <div className="text-xs text-slate-500">Loading trip details…</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Trip ID</div>
                <div className="font-mono font-medium text-slate-700 truncate">{tripId?.slice(0, 8)}…</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Rider Name</div>
                <div className="font-medium text-slate-800">{tripData?.RiderName ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Rider Mobile</div>
                <div className="font-medium text-slate-800">{tripData?.RiderMobileNumber ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Status</div>
                <div className="font-medium text-slate-800">{tripData?.StatusDescription ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Driver Name</div>
                <div className="font-medium text-slate-800">{tripData?.DriverName ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Driver Mobile</div>
                <div className="font-medium text-slate-800">{tripData?.DriverMobileNumber ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Vehicle</div>
                <div className="font-medium text-slate-800">{tripData?.VehicleNumber ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Cab Type</div>
                <div className="font-medium text-slate-800">{tripData?.CabTypeArrived ?? '-'}</div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {form.complaintBy === form.complaintAgainst && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700 font-medium">
              "Complaint By" and "Complaint Against" cannot be the same.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Complaint By</label>
              <select
                value={form.complaintBy}
                onChange={(e) => set('complaintBy', e.target.value)}
                className={`${inputCls} ${form.complaintBy === form.complaintAgainst ? 'border-red-400 ring-2 ring-red-200' : ''}`}
              >
                {COMPLAINT_BY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Complaint Against</label>
              <select
                value={form.complaintAgainst}
                onChange={(e) => set('complaintAgainst', e.target.value)}
                className={`${inputCls} ${form.complaintBy === form.complaintAgainst ? 'border-red-400 ring-2 ring-red-200' : ''}`}
              >
                {COMPLAINT_AGAINST_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Complaint Type</label>
              <select value={form.complaintType} onChange={(e) => set('complaintType', e.target.value)} className={inputCls}>
                {COMPLAINT_TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description <span className="text-red-500">*</span></label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the complaint in detail…"
              className={`${inputCls} resize-none`}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-yellow hover:bg-yellow-400 text-slate-900 text-sm font-semibold shadow transition disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit Complaint'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default CreateComplaintPage
