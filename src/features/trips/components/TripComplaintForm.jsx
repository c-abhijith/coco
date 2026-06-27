import React, { useState } from 'react'
import Swal from 'sweetalert2'

const COMPLAINT_BY_OPTIONS   = ['Rider', 'Driver', 'Admin']
const COMPLAINT_AGAINST_OPTIONS = ['Rider', 'Driver', 'Vehicle', 'Platform']
const COMPLAINT_TYPE_OPTIONS = [
  'Behavior',
  'Payment Issue',
  'Route Issue',
  'Vehicle Condition',
  'Safety Concern',
  'App Issue',
  'Other',
]

export function TripComplaintForm({ trip, onClose }) {
  const [form, setForm] = useState({
    complaintBy:      'Rider',
    complaintAgainst: 'Driver',
    complaintType:    'Behavior',
    description:      '',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) {
      Swal.fire({ icon: 'warning', title: 'Description required', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
      return
    }

    setSubmitting(true)
    try {
      // TODO: replace with real API call when endpoint is available
      const payload = {
        tripId:           trip.TripID,
        riderName:        trip.RiderName,
        driverName:       trip.DriverName,
        complaintBy:      form.complaintBy,
        complaintAgainst: form.complaintAgainst,
        complaintType:    form.complaintType,
        description:      form.description.trim(),
        complaintDate:    new Date().toISOString(),
        status:           'Open',
      }
      console.log('Complaint payload:', payload)

      Swal.fire({
        icon: 'success',
        title: 'Complaint Submitted',
        html: `<span style="font-size:13px;color:#64748b">Complaint recorded for Trip ${trip.TripID?.slice(0, 8)}…</span>`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
      })
      setForm({ complaintBy: 'Rider', complaintAgainst: 'Driver', complaintType: 'Behavior', description: '' })
      onClose()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Submission Failed', text: err?.message || 'Please try again.', toast: true, position: 'top-end', showConfirmButton: false, timer: 4000 })
    } finally {
      setSubmitting(false)
    }
  }

  const labelCls = "block text-xs font-semibold text-slate-600 mb-1"
  const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/70 focus:border-brand-yellow transition"

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Add Complaint</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">Trip: {trip.TripID?.slice(0, 8)}…</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Trip context */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        <div><span className="text-slate-400 uppercase tracking-wide text-[10px]">Rider</span><div className="font-medium text-slate-800">{trip.RiderName ?? '-'}</div></div>
        <div><span className="text-slate-400 uppercase tracking-wide text-[10px]">Driver</span><div className="font-medium text-slate-800">{trip.DriverName ?? '-'}</div></div>
        <div><span className="text-slate-400 uppercase tracking-wide text-[10px]">Status</span><div className="font-medium text-slate-800">{trip.StatusDescription ?? '-'}</div></div>
        <div><span className="text-slate-400 uppercase tracking-wide text-[10px]">Vehicle</span><div className="font-medium text-slate-800">{trip.VehicleNumber ?? '-'}</div></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelCls}>Complaint By</label>
            <select value={form.complaintBy} onChange={(e) => set('complaintBy', e.target.value)} className={inputCls}>
              {COMPLAINT_BY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Complaint Against</label>
            <select value={form.complaintAgainst} onChange={(e) => set('complaintAgainst', e.target.value)} className={inputCls}>
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

        <div className="mb-5">
          <label className={labelCls}>Description <span className="text-red-500">*</span></label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe the complaint in detail…"
            className={`${inputCls} resize-none`}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-xl bg-brand-yellow hover:bg-yellow-400 text-slate-900 text-sm font-semibold shadow transition disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Complaint'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default TripComplaintForm
