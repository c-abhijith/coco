// src/shared/utils/alerts.js
/**
 * SweetAlert2 Utility Module
 *
 * Provides consistent alert/notification styling across the application
 * using SweetAlert2 library for better UX than native browser alerts.
 */

import Swal from 'sweetalert2'

/**
 * Show a success notification
 * @param {string} title - The title text
 * @param {string} message - The message text (optional)
 */
export function showSuccess(title, message = '') {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#facc15',
    confirmButtonText: 'OK',
  })
}

/**
 * Show an error notification
 * @param {string} title - The title text
 * @param {string} message - The message text (optional)
 */
export function showError(title, message = '') {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#facc15',
    confirmButtonText: 'OK',
  })
}

/**
 * Show a warning notification
 * @param {string} title - The title text
 * @param {string} message - The message text (optional)
 */
export function showWarning(title, message = '') {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#facc15',
    confirmButtonText: 'OK',
  })
}

/**
 * Show an info notification
 * @param {string} title - The title text
 * @param {string} message - The message text (optional)
 */
export function showInfo(title, message = '') {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#facc15',
    confirmButtonText: 'OK',
  })
}

/**
 * Show a confirmation dialog
 * Returns a promise that resolves to true if confirmed, false if cancelled
 * @param {string} title - The title text
 * @param {string} message - The message text
 * @param {string} confirmText - Text for confirm button (default: 'Yes')
 * @param {string} cancelText - Text for cancel button (default: 'No')
 */
export async function showConfirm(
  title,
  message = '',
  confirmText = 'Yes',
  cancelText = 'No'
) {
  const result = await Swal.fire({
    icon: 'question',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#facc15',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  })

  return result.isConfirmed
}

/**
 * Show a delete confirmation dialog
 * Returns a promise that resolves to true if confirmed, false if cancelled
 * @param {string} title - The title text
 * @param {string} message - The message text
 */
export async function showDeleteConfirm(title, message = '') {
  const result = await Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
  })

  return result.isConfirmed
}

/**
 * Show a loading notification
 * Useful for async operations
 * Call Swal.close() to dismiss
 * @param {string} title - The title text
 */
export function showLoading(title = 'Please wait...') {
  Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

/**
 * Show a toast notification (small popup at top)
 * @param {string} title - The title text
 * @param {string} icon - Icon type: 'success', 'error', 'warning', 'info'
 */
export function showToast(title, icon = 'success') {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  Toast.fire({
    icon: icon,
    title: title,
  })
}

/**
 * Close any currently open SweetAlert
 */
export function closeAlert() {
  Swal.close()
}
