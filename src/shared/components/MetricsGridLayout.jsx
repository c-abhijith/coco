import { MetricCard } from './MetricCard'

/**
 * Generic MetricsGridLayout Component
 * Reusable metrics grid layout for displaying metric cards
 *
 * Props:
 * - title: Section title
 * - description: Section description
 * - metrics: Array of metric configurations
 *   - label: Metric label
 *   - value: Metric value
 *   - helperText: Optional helper text
 *   - onClick: Optional click handler
 *   - className: Optional additional classes
 * - columns: Number of columns (1-6, default: 6)
 * - showBorder: Show border around section (default: false)
 * - className: Additional classes for container
 */

export const MetricsGridLayout = ({
  title,
  description,
  metrics = [],
  columns = 6,
  showBorder = false,
  className = ''
}) => {
  const columnClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    5: 'md:grid-cols-3 lg:grid-cols-5',
    6: 'md:grid-cols-3 lg:grid-cols-6'
  }[columns] || 'md:grid-cols-3 lg:grid-cols-6'

  const containerClasses = showBorder
    ? 'bg-white rounded-lg border border-slate-200 shadow-sm'
    : ''

  const contentPadding = showBorder ? 'p-6' : ''

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className={showBorder ? 'px-6 pt-6 pb-4' : 'mb-4'}>
          {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
          {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
        </div>
      )}

      {/* Metrics Grid */}
      <div className={contentPadding}>
        <div className={`grid grid-cols-1 ${columnClass} gap-3`}>
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              helperText={metric.helperText}
              onClick={metric.onClick}
              className={metric.className}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
