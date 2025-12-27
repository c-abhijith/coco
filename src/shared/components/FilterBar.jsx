/**
 * Generic FilterBar Component
 * Reusable filter bar with pill-style buttons
 *
 * Props:
 * - filters: Array of filter groups
 *   - label: Filter group label (optional)
 *   - options: Array of filter options
 *     - label: Option label
 *     - value: Option value
 *     - count: Optional count to display
 *     - color: Optional color class (default: 'yellow')
 *   - value: Current selected value
 *   - onChange: (value) => void
 *   - allowMultiple: Allow multiple selection (default: false)
 * - className: Additional classes
 */

export const FilterBar = ({ filters = [], className = '' }) => {
  const getColorClasses = (color, isActive) => {
    const colors = {
      yellow: {
        active: 'bg-brand-yellow text-slate-900',
        inactive: 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
      },
      green: {
        active: 'bg-green-500 text-white',
        inactive: 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
      },
      blue: {
        active: 'bg-blue-500 text-white',
        inactive: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
      },
      red: {
        active: 'bg-red-500 text-white',
        inactive: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
      },
      gray: {
        active: 'bg-slate-500 text-white',
        inactive: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
      }
    }

    return colors[color]?.[isActive ? 'active' : 'inactive'] || colors.yellow[isActive ? 'active' : 'inactive']
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {filters.map((filterGroup, groupIndex) => (
        <div key={groupIndex} className="flex flex-wrap items-center gap-2">
          {filterGroup.label && (
            <span className="text-sm font-medium text-slate-700 mr-2">
              {filterGroup.label}:
            </span>
          )}
          {filterGroup.options.map((option, optionIndex) => {
            const isActive = filterGroup.allowMultiple
              ? filterGroup.value?.includes(option.value)
              : filterGroup.value === option.value

            return (
              <button
                key={optionIndex}
                onClick={() => {
                  if (filterGroup.allowMultiple) {
                    const currentValues = filterGroup.value || []
                    const newValues = currentValues.includes(option.value)
                      ? currentValues.filter(v => v !== option.value)
                      : [...currentValues, option.value]
                    filterGroup.onChange(newValues)
                  } else {
                    filterGroup.onChange(option.value)
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${getColorClasses(
                  option.color || 'yellow',
                  isActive
                )}`}
              >
                {option.label}
                {option.count !== undefined && ` (${option.count})`}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
