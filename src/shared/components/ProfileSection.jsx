import { InfoField } from './InfoField'

/**
 * Generic ProfileSection Component
 * Reusable profile display component for any entity (driver, vehicle, rider, etc.)
 *
 * Props:
 * - title: Section title
 * - imageUrl: Profile/entity image URL
 * - imagePlaceholder: Placeholder text when no image
 * - fields: Array of field groups
 *   - title: Group title (optional)
 *   - fields: Array of field objects
 *     - label: Field label
 *     - value: Field value
 *     - render: Optional custom render function (value) => JSX
 * - actions: Optional array of action buttons
 *   - label: Button label
 *   - onClick: Click handler
 *   - className: Optional button classes
 *   - icon: Optional icon component
 * - gridCols: Number of columns for field grid (default: 3)
 * - className: Additional classes
 */

export const ProfileSection = ({
  title,
  imageUrl,
  imagePlaceholder = 'No Image',
  fields = [],
  actions = [],
  gridCols = 3,
  className = ''
}) => {
  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6'
  }[gridCols] || 'md:grid-cols-3'

  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
      {/* Header */}
      {(title || actions.length > 0) && (
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
            {actions.length > 0 && (
              <div className="flex items-center gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={
                      action.className ||
                      'px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
                    }
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          {(imageUrl !== undefined || imagePlaceholder) && (
            <div className="flex-shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm border border-slate-200">
                  {imagePlaceholder}
                </div>
              )}
            </div>
          )}

          {/* Fields */}
          <div className="flex-1 space-y-6">
            {fields.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.title && (
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">{group.title}</h3>
                )}
                <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
                  {group.fields.map((field, fieldIndex) => {
                    const content = field.render ? field.render(field.value) : field.value

                    return (
                      <InfoField
                        key={fieldIndex}
                        label={field.label}
                        value={content}
                        className={field.className}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
