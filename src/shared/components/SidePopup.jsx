import React, { useEffect } from 'react'

/**
 * SidePopup Component
 *
 * A reusable side panel that slides in from the right to display detailed data
 *
 * @param {boolean} isOpen - Whether the popup is visible
 * @param {function} onClose - Callback to close the popup
 * @param {string} title - Title of the popup
 * @param {Array} data - Array of items to display
 * @param {function} renderItem - Function to render each item (receives item and index)
 * @param {string} emptyMessage - Message to show when data is empty
 */
export function SidePopup({ isOpen, onClose, title, data = [], renderItem, emptyMessage = 'No data available' }) {

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200"
            aria-label="Close popup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500 text-sm">{emptyMessage}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index}>
                  {renderItem ? renderItem(item, index) : (
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <pre className="text-xs text-slate-600 overflow-auto">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total items: <strong>{data.length}</strong></span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
