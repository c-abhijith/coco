import React from 'react'

export function InfoField({ label, value, className }) {
  return (
    <div className={className ?? ''}>
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-sm text-slate-800">
        {value !== undefined && value !== null && value !== '' ? value : '-'}
      </div>
    </div>
  )
}

export default InfoField
