import React from 'react'

/**
 * TabNavigation Component
 *
 * Reusable tab navigation component with consistent styling
 * Displays tabs as pills or underlined buttons based on variant
 *
 * @param {Array} tabs - Array of tab objects with { id, label }
 * @param {string} activeTab - Currently active tab id
 * @param {Function} onTabChange - Callback when tab is clicked
 * @param {string} variant - Style variant: 'pills' or 'underline' (default: 'pills')
 */
export function TabNavigation({ tabs, activeTab, onTabChange, variant = 'pills' }) {
  if (variant === 'underline') {
    return (
      <div className="mt-6 border-b border-slate-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-yellow text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // Pills variant (default)
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={[
            'inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-brand-yellow text-slate-900 border-brand-yellow'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
