import React, { useState } from 'react'
import { showConfirm, showWarning, showToast } from '../../../shared/utils/alerts'

/**
 * VehicleBlockControl Component
 *
 * Provides UI controls for admin users to block/unblock a vehicle with a reason.
 * This is useful for scenarios like:
 * - Vehicle maintenance required
 * - Safety concerns
 * - Document expiration
 * - Administrative reasons
 *
 * Features:
 * - Block vehicle with mandatory reason/comment
 * - Unblock vehicle with confirmation
 * - Visual feedback with color-coded buttons (green = active, red = blocked)
 * - SweetAlert2 notifications for better UX
 *
 * @param {Object} vehicle - The vehicle object with all vehicle details
 * @param {Function} onBlockStateChange - Callback to update block state (vehicleId, isBlocked, reason)
 */
export function VehicleBlockControl({ vehicle, onBlockStateChange }) {
  // Local state to show/hide the reason input form
  const [showBlockReasonInput, setShowBlockReasonInput] = useState(false)

  // Draft text for the block reason (before submission)
  const [blockReasonDraft, setBlockReasonDraft] = useState('')

  // Don't render if vehicle is missing
  if (!vehicle) return null

  /**
   * Handle the main block/unblock toggle button click
   * If vehicle is currently blocked (red button) -> confirm and unblock
   * If vehicle is currently active (green button) -> show the reason input form
   */
  const handleBlockToggle = async () => {
    if (vehicle.blocked) {
      // Vehicle is already blocked (red button showing)
      // Clicking it will unblock the vehicle
      const confirmed = await showConfirm(
        'Unblock Vehicle?',
        'Are you sure you want to unblock this vehicle? It will be able to accept new trips.',
        'Yes, Unblock',
        'Cancel'
      )

      if (confirmed) {
        // Call parent callback to unblock
        await onBlockStateChange(vehicle.id, false, '')
        showToast('Vehicle unblocked successfully', 'success')
      }
    } else {
      // Vehicle is currently active (green button showing)
      // Clicking it will show the reason input form
      setShowBlockReasonInput(true)
    }
  }

  /**
   * Handle the form submission when admin enters a block reason
   * Validates that a reason is provided, then blocks the vehicle
   * @param {Event} e - Form submit event
   */
  const handleSubmitBlock = async (e) => {
    e.preventDefault()

    // Validate that a reason was entered
    if (!blockReasonDraft.trim()) {
      await showWarning('Reason Required', 'Please enter a reason for blocking this vehicle.')
      return
    }

    // Call parent callback to block vehicle with reason
    await onBlockStateChange(vehicle.id, true, blockReasonDraft.trim())

    // Reset local form state
    setBlockReasonDraft('')
    setShowBlockReasonInput(false)

    // Show success message
    showToast('Vehicle blocked successfully', 'success')
  }

  /**
   * Handle cancellation of the block action
   * Hides the reason input form and clears any draft text
   */
  const handleCancelBlock = () => {
    setShowBlockReasonInput(false)
    setBlockReasonDraft('')
  }

  return (
    <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-700">
            Vehicle block control
          </div>
          <div className="text-[11px] text-slate-500">
            {vehicle.blocked
              ? `Vehicle is blocked. Reason: ${vehicle.blockedReason || '—'}`
              : 'Vehicle is currently active. You can block this vehicle with a reason.'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleBlockToggle}
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold border ${
            vehicle.blocked
              ? 'bg-red-50 text-red-700 border-red-300'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}
        >
          {vehicle.blocked
            ? 'Blocked (tap to unblock)'
            : 'Block vehicle'}
        </button>
      </div>

      {/* Reason input appears only when going from active -> blocked */}
      {!vehicle.blocked && showBlockReasonInput && (
        <form onSubmit={handleSubmitBlock} className="mt-3 space-y-2">
          <label className="block text-[11px] font-medium text-slate-600">
            Why are you blocking this vehicle?
          </label>
          <textarea
            value={blockReasonDraft}
            onChange={(e) => setBlockReasonDraft(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow/70"
            placeholder="Enter reason here... (e.g., Maintenance required, Safety issue, Documents expired)"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelBlock}
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
