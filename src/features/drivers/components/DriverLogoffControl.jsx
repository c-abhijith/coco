import React, { useState } from 'react'
import { showConfirm, showWarning, showToast } from '../../../shared/utils/alerts'

/**
 * DriverLogoffControl Component
 *
 * Provides UI controls for admin users to manually log off a driver with a reason.
 * This is useful for scenarios like:
 * - Vehicle maintenance
 * - Driver requested time off
 * - Safety concerns
 * - Administrative reasons
 *
 * Features:
 * - Log off driver with mandatory reason/comment
 * - Undo logoff (mark driver as online again)
 * - Persistent state across page refreshes (via localStorage)
 * - Visual feedback with color-coded buttons (green = online, red = logged off)
 * - SweetAlert2 notifications for better UX
 *
 * @param {Object} driver - The driver object with all driver details
 * @param {Object} currentLogoff - Current logoff state { isLoggedOff: boolean, comment: string }
 * @param {Function} onLogoffStateChange - Callback to update logoff state (driverId, newState)
 */
export function DriverLogoffControl({
  driver,
  currentLogoff,
  onLogoffStateChange,
}) {
  // Local state to show/hide the reason input form
  const [showLogoffReasonInput, setShowLogoffReasonInput] = useState(false)

  // Draft text for the logoff reason (before submission)
  const [logoffReasonDraft, setLogoffReasonDraft] = useState('')

  // Don't render if driver or logoff state is missing
  if (!driver || !currentLogoff) return null

  /**
   * Handle the main logoff toggle button click
   * If driver is currently logged off (red button) -> confirm and undo the logoff
   * If driver is currently online (green button) -> show the reason input form
   */
  const handleLogoffToggle = async () => {
    if (currentLogoff.isLoggedOff) {
      // Driver is already logged off (red button showing)
      // Clicking it will undo the logoff and mark driver as online again
      const confirmed = await showConfirm(
        'Mark Driver Online?',
        'Are you sure you want to mark this driver as online again and clear the log-off reason?',
        'Yes, mark online',
        'Cancel'
      )

      if (confirmed) {
        // Call parent callback to update state to online
        onLogoffStateChange(driver.id, {
          isLoggedOff: false,
          comment: '',
        })
        showToast('Driver marked as online', 'success')
      }
    } else {
      // Driver is currently online (green button showing)
      // Clicking it will show the reason input form
      setShowLogoffReasonInput(true)
    }
  }

  /**
   * Handle the form submission when admin enters a logoff reason
   * Validates that a reason is provided, then updates the logoff state
   * @param {Event} e - Form submit event
   */
  const handleSubmitLogoff = async (e) => {
    e.preventDefault()

    // Validate that a reason was entered
    if (!logoffReasonDraft.trim()) {
      await showWarning('Reason Required', 'Please enter a reason for logging off this driver.')
      return
    }

    // Call parent callback to update state to logged off with the reason
    onLogoffStateChange(driver.id, {
      isLoggedOff: true,
      comment: logoffReasonDraft.trim(),
    })

    // Reset local form state
    setLogoffReasonDraft('')
    setShowLogoffReasonInput(false)

    // Show success message
    showToast('Driver logged off successfully', 'success')
  }

  /**
   * Handle cancellation of the logoff action
   * Hides the reason input form and clears any draft text
   */
  const handleCancelLogoff = () => {
    setShowLogoffReasonInput(false)
    setLogoffReasonDraft('')
  }

  return (
    <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-700">
            Driver log off control
          </div>
          <div className="text-[11px] text-slate-500">
            {currentLogoff.isLoggedOff
              ? `Driver is logged off. Reason: ${currentLogoff.comment || '—'}`
              : 'Driver is currently online. You can log off this driver with a reason.'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogoffToggle}
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold border ${
            currentLogoff.isLoggedOff
              ? 'bg-red-50 text-red-700 border-red-300'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}
        >
          {currentLogoff.isLoggedOff
            ? 'Logged off (tap to undo)'
            : 'Log off'}
        </button>
      </div>

      {/* Reason input appears only when going from online -> logoff */}
      {!currentLogoff.isLoggedOff && showLogoffReasonInput && (
        <form onSubmit={handleSubmitLogoff} className="mt-3 space-y-2">
          <label className="block text-[11px] font-medium text-slate-600">
            Why are you logging off this driver?
          </label>
          <textarea
            value={logoffReasonDraft}
            onChange={(e) => setLogoffReasonDraft(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow/70"
            placeholder="Enter reason here..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelLogoff}
              className="rounded-xl border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand-yellow px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-yellow-400"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
