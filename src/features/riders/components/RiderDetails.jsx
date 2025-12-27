import React from 'react'

/**
 * RiderDetails Component
 *
 * Displays comprehensive rider information
 * Shows rider profile, account details, and metrics
 *
 * @param {Object} rider - Rider object from riderDetails.js
 */
export function RiderDetails({ rider }) {
  if (!rider) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500">
          <p className="text-sm">No rider selected</p>
          <p className="text-xs mt-1">Please select a rider from the dropdown above</p>
        </div>
      </section>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'blocked':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'inactive':
        return 'bg-slate-50 text-slate-700 border-slate-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-5">
      {/* Rider Profile Card */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Rider Profile</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {rider.image && (
                <img
                  src={rider.image}
                  alt={rider.name}
                  className="w-16 h-16 rounded-full border-2 border-slate-200 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Rider Name
                </div>
                <div className="text-base font-semibold text-slate-900 mt-0.5">
                  {rider.name}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Rider ID
              </div>
              <div className="text-sm font-medium text-slate-900 mt-0.5">
                {rider.id}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Mobile Number
              </div>
              <div className="text-sm text-slate-900 mt-0.5">
                {rider.mobile}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Email Address
              </div>
              <div className="text-sm text-slate-900 mt-0.5">
                {rider.email}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Status
              </div>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                    rider.current_status
                  )}`}
                >
                  {rider.current_status}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Tag
              </div>
              <div className="text-sm text-slate-900 mt-0.5">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
                  {rider.tag}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Account Details */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Member Since
              </div>
              <div className="text-sm text-slate-900 mt-0.5">
                {rider.since || '-'}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Last Logged At
              </div>
              <div className="text-sm text-slate-900 mt-0.5">
                {formatDate(rider.last_logged_at)}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Network Count
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">
                {rider.network_count}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Total Points
              </div>
              <div className="text-sm font-semibold text-green-700 mt-0.5">
                {rider.total_points_till_today}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Pending Scheduled Trips
              </div>
              <div className="text-sm text-slate-900 mt-0.5">
                {rider.pending_scheduled_trips}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Login OTP
              </div>
              <div className="text-sm font-mono text-slate-900 mt-0.5">
                {rider.login_otp || '-'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Information */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Financial Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Outstanding Due
            </div>
            <div className={`text-lg font-bold mt-1 ${rider.outstanding_due > 0 ? 'text-red-700' : 'text-green-700'}`}>
              ₹{rider.outstanding_due.toFixed(2)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Pending Amount
            </div>
            <div className={`text-lg font-bold mt-1 ${rider.pending_amount > 0 ? 'text-orange-700' : 'text-green-700'}`}>
              ₹{rider.pending_amount.toFixed(2)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Total Points Earned
            </div>
            <div className="text-lg font-bold text-blue-700 mt-1">
              {rider.total_points_till_today}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
