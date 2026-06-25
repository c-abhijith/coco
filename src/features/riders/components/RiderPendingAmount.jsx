import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'

const PAGE_SIZE = 10

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const fmt = (val) => (val != null ? `₹${Number(val).toFixed(2)}` : '-')

const settlementColor = (status) => {
  const s = status?.toLowerCase() ?? ''
  if (s.includes('credit'))  return 'bg-green-50 text-green-700 border-green-200'
  if (s.includes('pending')) return 'bg-orange-50 text-orange-700 border-orange-200'
  if (s.includes('debit'))   return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
}

const SORT_FIELDS = {
  Amount:        'Amount',
  'Settled Time':'SettledTime',
}

function SortTh({ label, sort, onSort }) {
  const active = sort.col === label
  return (
    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">
      <button onClick={() => onSort(label)} className="flex items-center gap-1 hover:text-slate-800 transition">
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

export function RiderPendingAmount({ data, loading }) {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState({ col: null, dir: 'asc' })

  const uniqueStatuses = useMemo(() => {
    if (!data) return []
    return [...new Set(data.map((r) => r.SettlementStatus).filter(Boolean))].sort()
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    let result = statusFilter === 'all' ? [...data] : data.filter((r) => r.SettlementStatus === statusFilter)

    const field = SORT_FIELDS[sort.col]
    if (field) {
      result.sort((a, b) => {
        const va = a[field] ?? ''
        const vb = b[field] ?? ''
        const na = field === 'SettledTime' ? new Date(va).getTime() : Number(va)
        const nb = field === 'SettledTime' ? new Date(vb).getTime() : Number(vb)
        const diff = isNaN(na) || isNaN(nb) ? String(va).localeCompare(String(vb)) : na - nb
        return sort.dir === 'asc' ? diff : -diff
      })
    }
    return result
  }, [data, statusFilter, sort])

  const handleSort = (col) => {
    setSort((s) => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' })
    setPage(1)
  }

  const handleStatusChange = (val) => { setStatusFilter(val); setPage(1) }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500 text-sm">Loading pending amount…</div>
      </section>
    )
  }

  if (!data) return null

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const exportToExcel = () => {
    const rows = filtered.map((r) => ({
      'Trip ID':           r.TripId ?? '',
      'Status':            r.StatusDescription ?? '',
      'Comments':          r.Comments ?? '',
      'Amount (₹)':        r.Amount != null ? Number(r.Amount).toFixed(2) : '',
      'Settlement Status': r.SettlementStatus ?? '',
      'Settled Time':      r.SettledTime ? new Date(r.SettledTime).toLocaleString('en-IN') : '',
      'Settled Trip':      r.SettledTrip ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Pending Amount')
    XLSX.writeFile(wb, `pending_amount_${Date.now()}.xlsx`)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Pending Amount</h3>
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
            {data.length} record{data.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-end gap-3 mb-4">
        <span className="text-[10px] text-slate-400 mr-auto">
          {filtered.length} {filtered.length === 1 ? 'record' : 'records'} shown
        </span>

        {statusFilter !== 'all' && (
          <button
            onClick={() => handleStatusChange('all')}
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 transition"
          >
            {statusFilter}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-6">No pending amount records</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  {['Trip ID', 'Status', 'Comments'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                  <SortTh label="Amount"       sort={sort} onSort={handleSort} />
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Settlement Status</th>
                  <SortTh label="Settled Time" sort={sort} onSort={handleSort} />
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4 whitespace-nowrap">Settled Trip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((row, idx) => (
                  <tr key={row.TripId ?? idx} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/trips?tripId=${row.TripId}&tab=details`)}
                        className="font-mono text-[10px] text-yellow-700 hover:text-yellow-900 hover:underline transition"
                        title={row.TripId}
                      >
                        {row.TripId?.slice(0, 8)}…
                      </button>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{row.StatusDescription ?? '-'}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{row.Comments ?? '-'}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap font-semibold text-slate-800">{fmt(row.Amount)}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md border ${settlementColor(row.SettlementStatus)}`}>
                        {row.SettlementStatus ?? '-'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{formatDate(row.SettledTime)}</td>
                    <td className="py-2.5 pr-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {row.SettledTrip ? `${row.SettledTrip.slice(0, 8)}…` : '-'}
                    </td>
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
