import React from 'react'

export function DriverListTable({
  title,
  description,
  drivers,
  columns,
  emptyMessage,
  showCreateButton,
  onDriverClick,
  onCreateClick,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-xs text-slate-600 mb-4">{description}</p>

      {showCreateButton && (
        <div className="mb-4 flex items-center justify-between">
          <div />
          <button
            onClick={onCreateClick}
            className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
          >
            + Create driver
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  {emptyMessage || 'No drivers found.'}
                </td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 text-slate-700">
                      {col.key === 'name' ? (
                        <button
                          type="button"
                          onClick={() => onDriverClick(d.id)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {col.render ? col.render(d) : d[col.key] || '-'}
                        </button>
                      ) : col.render ? (
                        col.render(d)
                      ) : (
                        d[col.key] || '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
