import React from 'react'

export function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      {children && <div className="w-full md:w-72">{children}</div>}
    </div>
  )
}
