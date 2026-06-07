import React, { useState, useMemo, useRef, useEffect } from 'react'
import { drivers as defaultDrivers } from '../data/driversData'

// Searchable driver picker: type to filter, shows max 10 matches.
export function DriverDropdown({
  drivers = defaultDrivers,
  selectedDriverId,
  onChange,
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Keep the textbox showing the selected driver's name when one is chosen
  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || null

  useEffect(() => {
    if (selectedDriver && !open) {
      setQuery(selectedDriver.name)
    }
  }, [selectedDriver, open])

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Filter by typed letters, cap at 10 results
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? drivers.filter((d) => (d.name || '').toLowerCase().includes(q))
      : drivers
    return list.slice(0, 10)
  }, [drivers, query])

  const handleSelect = (d) => {
    onChange(d.id)
    setQuery(d.name)
    setOpen(false)
  }

  const handleClearAll = () => {
    onChange(null)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="space-y-2" ref={wrapRef}>
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-[0.18em]">
        Select Driver
      </label>

      <div className="flex items-start gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              if (!e.target.value) onChange(null)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Type to search drivers…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
          />

          {open && (
            <ul className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
              {matches.length === 0 ? (
                <li className="px-3 py-2 text-sm text-slate-500">No drivers found</li>
              ) : (
                matches.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(d)}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition ${
                        d.id === selectedDriverId ? 'bg-yellow-50 font-semibold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {d.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          className="shrink-0 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
        >
          Clear all
        </button>
      </div>
    </div>
  )
}