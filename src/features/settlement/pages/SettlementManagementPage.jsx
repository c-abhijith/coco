import React, { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../../shared/components/PageHeader'
import { getNonSettledDrivers } from '../../../api/settlementApi'

const fmt = (val) => {
  const n = Number(val)
  if (!Number.isFinite(n)) return '₹0.00'
  return `₹${n.toFixed(2)}`
}

const statusColor = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'online')  return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'offline') return 'bg-slate-50 text-slate-500 border-slate-200'
  return 'bg-yellow-50 text-yellow-700 border-yellow-200'
}

const activeColor = (val) =>
  val === 'Active'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-red-50 text-red-700 border-red-200'

export function SettlementManagementPage() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    setLoading(true)
    getNonSettledDrivers()
      .then((res) => setData(res?.summary ?? []))
      .catch((err) => setError(err?.message || 'Failed to load settlements'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(
      (d) =>
        d.DriverName?.toLowerCase().includes(q) ||
        d.MobileNumber?.includes(q) ||
        d.EmailId?.toLowerCase().includes(q)
    )
  }, [data, search])

  const totalSettlement = useMemo(
    () => data.reduce((sum, d) => sum + (d.TotalDriverSettlementAmt || 0), 0),
    [data]
  )

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Settlement Management"
          description="Drivers with pending settlements."
        >
          <input
            type="text"
            placeholder="Search by name, mobile or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1.5 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-56"
          />
        </PageHeader>
      </section>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Drivers</div>
          <div className="text-2xl font-bold text-slate-900">{data.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Pending</div>
          <div className="text-2xl font-bold text-slate-900">{fmt(totalSettlement)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Showing</div>
          <div className="text-2xl font-bold text-slate-900">{filtered.length}</div>
        </div>
      </div>

      {/* Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        {loading && (
          <div className="text-center text-slate-500 text-sm py-10">Loading settlements…</div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  {['Driver', 'Mobile', 'Status', 'Active', 'User Fees', 'Driver Fees', 'GST', 'Advance', 'Fine', 'Total'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide pb-3 pr-4 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-slate-500 text-sm">
                      No pending settlements found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d.DriverSettlementToken} className="hover:bg-slate-50 transition">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-slate-800">{d.DriverName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{d.EmailId}</div>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap text-slate-600">{d.MobileNumber}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md border ${statusColor(d.Status)}`}>
                          {d.Status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md border ${activeColor(d.IsActive)}`}>
                          {d.IsActive}
                        </span>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">{fmt(d.UserPlatformFees)}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{fmt(d.DriverPlatformFee)}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{fmt(d.GST)}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{fmt(d.ScheduledTripDriverAdvance)}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{fmt(d.ScheduledTripDriverFine)}</td>
                      <td className="py-3 pr-4 whitespace-nowrap font-bold text-slate-900">{fmt(d.TotalDriverSettlementAmt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default SettlementManagementPage
