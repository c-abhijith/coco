/**
 * Generic DataTable Component
 * Reusable table component for displaying any type of data
 *
 * Props:
 * - title: Table title
 * - description: Table description
 * - data: Array of data objects
 * - columns: Array of column configurations
 *   - key: Property name in data object
 *   - label: Column header label
 *   - render: Optional custom render function (row, value) => JSX
 *   - className: Optional column-specific classes
 * - onRowClick: Optional row click handler (row) => void
 * - emptyMessage: Message when no data
 * - showCreateButton: Show create button
 * - createButtonLabel: Label for create button
 * - onCreateClick: Create button click handler
 * - actions: Optional array of action configurations
 *   - label: Action label
 *   - onClick: (row) => void
 *   - className: Optional button classes
 *   - visible: Optional (row) => boolean to show/hide action
 */

export const DataTable = ({
  title,
  description,
  data = [],
  columns = [],
  onRowClick,
  emptyMessage = 'No data available',
  showCreateButton = false,
  createButtonLabel = 'Create New',
  onCreateClick,
  actions = [],
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
            {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
          </div>
          {showCreateButton && onCreateClick && (
            <button
              onClick={onCreateClick}
              className="px-4 py-2 bg-brand-yellow text-slate-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              {createButtonLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider ${column.headerClassName || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''
                  } transition-colors`}
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.key]
                    const content = column.render ? column.render(row, value) : value

                    return (
                      <td
                        key={column.key || colIndex}
                        className={`px-4 py-3 text-sm text-slate-900 ${column.className || ''}`}
                      >
                        {content}
                      </td>
                    )
                  })}
                  {actions.length > 0 && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => {
                          const isVisible = action.visible ? action.visible(row) : true
                          if (!isVisible) return null

                          return (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation()
                                action.onClick(row)
                              }}
                              className={action.className || 'px-3 py-1 text-xs font-medium rounded hover:bg-slate-100 transition-colors'}
                            >
                              {action.label}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
