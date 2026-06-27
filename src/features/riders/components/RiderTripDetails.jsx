import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'

const PAGE_SIZE = 10

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const fmt = (val) => (val != null ? `₹${Number(val).toFixed(2)}` : '-')

const statusColor = (status) => {
  const s = status?.toLowerCase() ?? ''
  if (s.includes('complet')) return 'bg-green-50 text-green-700 border-green-200'
  if (s.includes('cancel')) return 'bg-red-50 text-red-700 border-red-200'
  if (s.includes('progress') || s.includes('ongoing')) return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
}

// col key → data field for sorting
const SORT_FIELDS = {
  Created:        'TripCreationTime',
  Scheduled:      'TripScheduleTime',
  'Est. Fare':    'EstimatedTripFare',
  Collected:      'CollectedAmount',
  Coco:           'CocoReceived',
  'Driver Rcvd':  'DriverReceived',
  'Trip Fare':    'TripFare',
  'Platform Fee': 'PlatformFee',
  'User Fee':     'UserPlatformFees',
  GST:            'GST',
}

function SortTh({ label, sort, onSort, className = '' }) {
  const active = sort.col === label
  const toggle = () => onSort(label)
  return (
    <th className={`text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap ${className}`}>
      <button onClick={toggle} className="flex items-center gap-1 hover:text-slate-800 transition">
        {label}
        <span className="flex flex-col leading-none">
          <svg className={`w-2.5 h-2.5 ${active && sort.dir === 'asc' ? 'text-yellow-500' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4l-8 8h16z" />
          </svg>
          <svg className={`w-2.5 h-2.5 ${active && sort.dir === 'desc' ? 'text-yellow-500' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 20l8-8H4z" />
          </svg>
        </span>
      </button>
    </th>
  )
}

export function RiderTripDetails({ trips, loading }) {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ col: 'Created', dir: 'desc' })
  const [statusFilter, setStatusFilter]   = useState('all')
  const [cabFilter, setCabFilter]         = useState('all')
  const [driverFilter, setDriverFilter]   = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')

  // Reset all filters whenever a new trips dataset is loaded
  useEffect(() => {
    setStatusFilter('all')
    setCabFilter('all')
    setDriverFilter('all')
    setVehicleFilter('all')
    setPage(1)
  }, [trips])

  // Each dropdown shows only options valid within the context of ALL other active filters
  const uniqueCabs = useMemo(() => {
    if (!trips?.data) return []
    let r = trips.data
    if (statusFilter  !== 'all') r = r.filter((t) => String(t.StatusDescription ?? '') === statusFilter)
    if (driverFilter  !== 'all') r = r.filter((t) => String(t.DriverName        ?? '') === driverFilter)
    if (vehicleFilter !== 'all') r = r.filter((t) => String(t.VehicleNumber     ?? '') === vehicleFilter)
    return [...new Set(r.map((t) => t.CabType).filter(Boolean).map(String))].sort()
  }, [trips, statusFilter, driverFilter, vehicleFilter])

  const uniqueDrivers = useMemo(() => {
    if (!trips?.data) return []
    let r = trips.data
    if (statusFilter  !== 'all') r = r.filter((t) => String(t.StatusDescription ?? '') === statusFilter)
    if (cabFilter     !== 'all') r = r.filter((t) => String(t.CabType           ?? '') === cabFilter)
    if (vehicleFilter !== 'all') r = r.filter((t) => String(t.VehicleNumber     ?? '') === vehicleFilter)
    return [...new Set(r.map((t) => t.DriverName).filter(Boolean).map(String))].sort()
  }, [trips, statusFilter, cabFilter, vehicleFilter])

  const uniqueVehicles = useMemo(() => {
    if (!trips?.data) return []
    let r = trips.data
    if (statusFilter  !== 'all') r = r.filter((t) => String(t.StatusDescription ?? '') === statusFilter)
    if (cabFilter     !== 'all') r = r.filter((t) => String(t.CabType           ?? '') === cabFilter)
    if (driverFilter  !== 'all') r = r.filter((t) => String(t.DriverName        ?? '') === driverFilter)
    return [...new Set(r.map((t) => t.VehicleNumber).filter(Boolean).map(String))].sort()
  }, [trips, statusFilter, cabFilter, driverFilter])

  const uniqueStatuses = useMemo(() => {
    if (!trips?.data) return []
    let r = trips.data
    if (cabFilter     !== 'all') r = r.filter((t) => String(t.CabType       ?? '') === cabFilter)
    if (driverFilter  !== 'all') r = r.filter((t) => String(t.DriverName    ?? '') === driverFilter)
    if (vehicleFilter !== 'all') r = r.filter((t) => String(t.VehicleNumber ?? '') === vehicleFilter)
    return [...new Set(r.map((t) => t.StatusDescription).filter(Boolean).map(String))].sort()
  }, [trips, cabFilter, driverFilter, vehicleFilter])

  const filtered = useMemo(() => {
    if (!trips?.data) return []
    let result = [...trips.data]
    if (statusFilter !== 'all') result = result.filter((t) => String(t.StatusDescription ?? '') === statusFilter)
    if (cabFilter    !== 'all') result = result.filter((t) => String(t.CabType           ?? '') === cabFilter)
    if (driverFilter !== 'all') result = result.filter((t) => String(t.DriverName        ?? '') === driverFilter)
    if (vehicleFilter !== 'all') result = result.filter((t) => String(t.VehicleNumber    ?? '') === vehicleFilter)

    const field = SORT_FIELDS[sort.col]
    if (field) {
      result.sort((a, b) => {
        const va = a[field] ?? ''
        const vb = b[field] ?? ''
        const na = typeof va === 'string' && va.includes('T') ? new Date(va).getTime() : Number(va)
        const nb = typeof vb === 'string' && vb.includes('T') ? new Date(vb).getTime() : Number(vb)
        const diff = isNaN(na) || isNaN(nb) ? String(va).localeCompare(String(vb)) : na - nb
        return sort.dir === 'asc' ? diff : -diff
      })
    }
    return result
  }, [trips, statusFilter, cabFilter, driverFilter, vehicleFilter, sort])

  const handleSort = (col) => {
    setSort((s) => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' })
    setPage(1)
  }

  const handleStatusFilter  = (val) => { setStatusFilter(val);  setPage(1) }
  const handleCabFilter     = (val) => { setCabFilter(val);     setPage(1) }
  const handleDriverFilter  = (val) => { setDriverFilter(val);  setPage(1) }
  const handleVehicleFilter = (val) => { setVehicleFilter(val); setPage(1) }

  const activeChips = [
    statusFilter  !== 'all' && { label: statusFilter,   clear: () => handleStatusFilter('all') },
    cabFilter     !== 'all' && { label: cabFilter,       clear: () => handleCabFilter('all') },
    driverFilter  !== 'all' && { label: driverFilter,    clear: () => handleDriverFilter('all') },
    vehicleFilter !== 'all' && { label: vehicleFilter,   clear: () => handleVehicleFilter('all') },
  ].filter(Boolean)

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500 text-sm">Loading trip details…</div>
      </section>
    )
  }

  if (!trips) return null

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const dropdownCls = "text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition cursor-pointer"

  const exportToExcel = () => {
    const rows = filtered.map((t) => ({
      'Trip ID':          t.TripID ?? '',
      'Created':          t.TripCreationTime ? new Date(t.TripCreationTime).toLocaleString('en-IN') : '',
      'Scheduled':        t.TripScheduleTime ? new Date(t.TripScheduleTime).toLocaleString('en-IN') : '',
      'Status':           t.StatusDescription ?? '',
      'Cab Type':         t.CabType ?? '',
      'Driver':           t.DriverName ?? '',
      'Vehicle':          t.VehicleNumber ?? '',
      'Distance (km)':    t.GmapTotalDistance ?? '',
      'Est. Fare (₹)':   t.EstimatedTripFare != null ? Number(t.EstimatedTripFare).toFixed(2) : '',
      'Collected (₹)':   t.CollectedAmount   != null ? Number(t.CollectedAmount).toFixed(2)   : '',
      'Coco (₹)':          t.CocoReceived       != null ? Number(t.CocoReceived).toFixed(2)       : '',
      'Driver Rcvd (₹)':  t.DriverReceived     != null ? Number(t.DriverReceived).toFixed(2)     : '',
      'Trip Fare (₹)':    t.TripFare           != null ? Number(t.TripFare).toFixed(2)           : '',
      'Platform Fee (₹)': t.PlatformFee        != null ? Number(t.PlatformFee).toFixed(2)        : '',
      'User Fee (₹)':     t.UserPlatformFees   != null ? Number(t.UserPlatformFees).toFixed(2)   : '',
      'GST (₹)':          t.GST                != null ? Number(t.GST).toFixed(2)                : '',
      'Carrier (₹)':      t.CarrierCharges     != null ? Number(t.CarrierCharges).toFixed(2)     : '',
      'Waiting Fee (₹)':  t.WaitingFee         != null ? Number(t.WaitingFee).toFixed(2)         : '',
      'Pickup Wait (₹)':  t.PickupWaitingFee   != null ? Number(t.PickupWaitingFee).toFixed(2)   : '',
      'Cancel Fee (₹)':   t.CancellationFee    != null ? Number(t.CancellationFee).toFixed(2)    : '',
      'Start OTP':         t.TripStartOtp ?? '',
      'End OTP':           t.TripEndOtp   ?? '',
      'Pickup':            t.PickLocationGMapFullAddress ?? '',
      'Drop':              t.DropLocations ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Trip Details')
    XLSX.writeFile(wb, `trip_details_${Date.now()}.xlsx`)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Trip Details</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Excel
          </button>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
            {trips.count} total trips
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-[10px] text-slate-400 mr-auto">
          {filtered.length} {filtered.length === 1 ? 'trip' : 'trips'} shown
        </span>

        {/* Active filter chips */}
        {activeChips.map((chip) => (
          <button
            key={chip.label}
            onClick={chip.clear}
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 transition"
          >
            {chip.label}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ))}

        <select value={cabFilter}     onChange={(e) => handleCabFilter(e.target.value)}     className={dropdownCls}>
          <option value="all">All Cab Types</option>
          {uniqueCabs.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={driverFilter}  onChange={(e) => handleDriverFilter(e.target.value)}  className={dropdownCls}>
          <option value="all">All Drivers</option>
          {uniqueDrivers.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={vehicleFilter} onChange={(e) => handleVehicleFilter(e.target.value)} className={dropdownCls}>
          <option value="all">All Vehicles</option>
          {uniqueVehicles.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={statusFilter}  onChange={(e) => handleStatusFilter(e.target.value)}  className={dropdownCls}>
          <option value="all">All Statuses</option>
          {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Clear all — appears after Status dropdown, only when a filter is active */}
        {activeChips.length > 0 && (
          <button
            onClick={() => { handleStatusFilter('all'); handleCabFilter('all'); handleDriverFilter('all'); handleVehicleFilter('all') }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-sm transition"
          >
            Clear All
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-6">No trips found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Trip ID</th>
                  <SortTh label="Created"     sort={sort} onSort={handleSort} />
                  <SortTh label="Scheduled"   sort={sort} onSort={handleSort} />
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Status</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Cab Type</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Driver</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Vehicle</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Distance (km)</th>
                  <SortTh label="Est. Fare"   sort={sort} onSort={handleSort} />
                  <SortTh label="Collected"   sort={sort} onSort={handleSort} />
                  <SortTh label="Coco"          sort={sort} onSort={handleSort} />
                  <SortTh label="Driver Rcvd"   sort={sort} onSort={handleSort} />
                  <SortTh label="Trip Fare"     sort={sort} onSort={handleSort} />
                  <SortTh label="Platform Fee"  sort={sort} onSort={handleSort} />
                  <SortTh label="User Fee"      sort={sort} onSort={handleSort} />
                  <SortTh label="GST"           sort={sort} onSort={handleSort} />
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Carrier</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Waiting</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Pickup Wait</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Cancel Fee</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Start OTP</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">End OTP</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Pickup</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((t) => (
                  <tr key={t.TripID} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/trips?tripId=${t.TripID}&tab=details`)}
                        className="font-mono text-[10px] text-yellow-700 hover:text-yellow-900 hover:underline transition"
                        title={t.TripID}
                      >
                        {t.TripID?.slice(0, 8)}…
                      </button>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{formatDate(t.TripCreationTime)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{formatDate(t.TripScheduleTime)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md border ${statusColor(t.StatusDescription)}`}>
                        {t.StatusDescription ?? '-'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{t.CabType ?? '-'}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{t.DriverName ?? '-'}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{t.VehicleNumber ?? '-'}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{t.GmapTotalDistance ?? '-'}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.EstimatedTripFare)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.CollectedAmount)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.CocoReceived)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.DriverReceived)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.TripFare)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.PlatformFee)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.UserPlatformFees)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.GST)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.CarrierCharges)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.WaitingFee)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.PickupWaitingFee)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{fmt(t.CancellationFee)}</td>
                    <td className="py-2.5 pr-4 font-mono whitespace-nowrap">{t.TripStartOtp ?? '-'}</td>
                    <td className="py-2.5 pr-4 font-mono whitespace-nowrap">{t.TripEndOtp ?? '-'}</td>
                    <td className="py-2.5 pr-4 max-w-[180px] truncate" title={t.PickLocationGMapFullAddress}>{t.PickLocationGMapFullAddress ?? '-'}</td>
                    <td className="py-2.5 pr-4 max-w-[180px] truncate" title={t.DropLocations}>{t.DropLocations ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">«</button>
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…'); acc.push(p); return acc }, [])
                .map((item, idx) =>
                  item === '…' ? (
                    <span key={`e-${idx}`} className="px-2 py-1 text-xs text-slate-400">…</span>
                  ) : (
                    <button key={item} onClick={() => setPage(item)} className={`px-2.5 py-1 text-xs rounded-md border transition ${page === item ? 'bg-yellow-400 border-yellow-400 text-yellow-900 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{item}</button>
                  )
                )}
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className="px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">›</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">»</button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
