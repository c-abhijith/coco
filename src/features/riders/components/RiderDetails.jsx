import React from 'react'

function Field({ label, value, badge, badgeClass }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
      {badge ? (
        <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-lg border ${badgeClass}`}>
          {value ?? '-'}
        </span>
      ) : (
        <div className="text-sm text-slate-900 mt-0.5">{value ?? '-'}</div>
      )}
    </div>
  )
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const statusColor = (status) => {
  const s = status?.toLowerCase() ?? ''
  if (s.includes('trip') || s.includes('progress')) return 'bg-blue-50 text-blue-700 border-blue-200'
  if (s.includes('active')) return 'bg-green-50 text-green-700 border-green-200'
  if (s.includes('block')) return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
}

const fmt = (val) => (val != null ? `₹${Number(val).toFixed(2)}` : '-')
const pct = (val) => (val != null ? `${val}%` : '-')

export function RiderDetails({ rider, loading }) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500 text-sm">Fetching rider details…</div>
      </section>
    )
  }

  if (!rider) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500">
          <p className="text-sm">No rider selected</p>
          <p className="text-xs mt-1">Enter a phone number above and press Search</p>
        </div>
      </section>
    )
  }

  const fields = [
    { label: 'Name',                          value: rider['Name'] },
    { label: 'Mobile',                        value: rider['Mobile'] },
    { label: 'Email',                         value: rider['Email'] },
    {
      label: 'Current Status',
      value: rider['Current Status'],
      badge: true,
      badgeClass: statusColor(rider['Current Status']),
    },
    { label: 'Since',                         value: formatDate(rider['Since']) },
    { label: 'Last Logged At',                value: formatDate(rider['Last Logged at']) },
    { label: 'Login OTP',                     value: rider['Login OTP'] },
    { label: 'Tags',                          value: rider['Tags'] },
    { label: 'Rider App Version',             value: rider['Rider App version'] },
    { label: 'Rider Mobile Type',             value: rider['Rider Mobile Type'] },
    { label: 'Last Complaint Status',         value: rider['Last complaint status'] },
    { label: 'Total Trips',                   value: rider['Total Trips'] },
    { label: 'Trips Completed',               value: rider['No of trips completed'] },
    { label: 'Total Cancellations',           value: rider['Total cancellations'] },
    { label: 'Cancellation %',                value: pct(rider['CancellationPercent']) },
    { label: 'Pending Scheduled Trip',        value: rider['Pending Scheduled Trip'] },
    { label: 'No-show Count',                 value: rider['No-show count'] },
    { label: 'Open Complaints',               value: rider['No of Open Complaints'] },
    { label: 'Rider Complaints',              value: rider['No of Rider Complaints'] },
    { label: 'Rides Today',                   value: rider['No of rider in last today'] },
    { label: 'Rides Yesterday',               value: rider['No of rides yesreday'] },
    { label: 'Rides Day Before Yesterday',    value: rider['No of rider day before yesreday'] },
    { label: 'Rides Last 7 Days',             value: rider['No of rides in last 7 days'] },
    { label: 'Rides Last 30 Days',            value: rider['No of rider in last 30 days'] },
    { label: 'Coco Earned Total',             value: fmt(rider['Coco Earned Total']) },
    { label: 'Total Spend',                   value: fmt(rider['Total Spend']) },
    { label: 'Total Spend (till today)',      value: fmt(rider['Total spend (till today)']) },
    { label: 'Outstanding Dues',              value: fmt(rider['Outstanding dues']) },
    { label: 'Pending Amount',                value: fmt(rider['Pending Amount']) },
    { label: 'Total Promo Used',              value: rider['Total Promo Used'] },
    { label: 'Total Promo Saved',             value: fmt(rider['Total Promo saved']) },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Rider Profile</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
        {fields.map((f) => (
          <Field key={f.label} {...f} />
        ))}
      </div>
    </section>
  )
}
