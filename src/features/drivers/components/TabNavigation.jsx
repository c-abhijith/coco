import React from 'react'

export function TabNavigation({ tabs, activeTab, onTabChange }) {
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
