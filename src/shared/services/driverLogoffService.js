import { STORAGE_KEYS } from '../constants/storageKeys'

/**
 * Driver Logoff Management Service
 *
 * This module handles the persistence of driver logoff states.
 * When an admin logs off a driver with a reason, that information is stored
 * in localStorage so it persists across page refreshes.
 *
 * Data Structure:
 * {
 *   "D1001": {
 *     isLoggedOff: true,
 *     comment: "Vehicle maintenance scheduled",
 *     timestamp: "2025-01-15T10:30:00Z"
 *   },
 *   "D1002": {
 *     isLoggedOff: false,
 *     comment: "",
 *     timestamp: "2025-01-15T09:00:00Z"
 *   }
 * }
 */

/**
 * Read all driver logoff states from localStorage
 * @returns {Object} Object mapping driver IDs to their logoff states
 */
function readLogoffStates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVER_LOGOFF)
    const parsed = raw ? JSON.parse(raw) : {}
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch (error) {
    console.warn('Failed to read driver logoff states:', error)
    return {}
  }
}

/**
 * Write all driver logoff states to localStorage
 * @param {Object} states - Object mapping driver IDs to their logoff states
 */
function writeLogoffStates(states) {
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVER_LOGOFF, JSON.stringify(states))
  } catch (error) {
    console.error('Failed to write driver logoff states:', error)
  }
}

/**
 * Get the logoff state for a specific driver
 * @param {string} driverId - The driver ID (e.g., "D1001")
 * @returns {Object} Object with { isLoggedOff: boolean, comment: string, timestamp: string }
 */
export function getDriverLogoffState(driverId) {
  if (!driverId) {
    return { isLoggedOff: false, comment: '', timestamp: null }
  }

  const allStates = readLogoffStates()
  const state = allStates[driverId]

  // Return the state if it exists, otherwise return default (not logged off)
  return state || { isLoggedOff: false, comment: '', timestamp: null }
}

/**
 * Set the logoff state for a specific driver
 * @param {string} driverId - The driver ID (e.g., "D1001")
 * @param {boolean} isLoggedOff - Whether the driver is logged off
 * @param {string} comment - The reason for logging off (required if isLoggedOff is true)
 * @returns {boolean} True if successful, false otherwise
 */
export function setDriverLogoffState(driverId, isLoggedOff, comment = '') {
  if (!driverId) {
    console.warn('setDriverLogoffState: driverId is required')
    return false
  }

  try {
    const allStates = readLogoffStates()

    // Update the state for this driver
    allStates[driverId] = {
      isLoggedOff: Boolean(isLoggedOff),
      comment: String(comment || ''),
      timestamp: new Date().toISOString(),
    }

    writeLogoffStates(allStates)
    return true
  } catch (error) {
    console.error('Failed to set driver logoff state:', error)
    return false
  }
}

/**
 * Get all driver logoff states
 * Useful for displaying a list of all logged-off drivers
 * @returns {Object} Object mapping driver IDs to their logoff states
 */
export function getAllDriverLogoffStates() {
  return readLogoffStates()
}

/**
 * Clear the logoff state for a specific driver (mark them as online)
 * @param {string} driverId - The driver ID
 * @returns {boolean} True if successful
 */
export function clearDriverLogoffState(driverId) {
  return setDriverLogoffState(driverId, false, '')
}

/**
 * Clear all driver logoff states (reset everything)
 * USE WITH CAUTION - This will mark all drivers as online
 * @returns {boolean} True if successful
 */
export function clearAllLogoffStates() {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRIVER_LOGOFF)
    return true
  } catch (error) {
    console.error('Failed to clear all logoff states:', error)
    return false
  }
}

/**
 * Get a list of all currently logged-off drivers
 * @returns {Array<Object>} Array of { driverId, comment, timestamp }
 */
export function getLoggedOffDrivers() {
  const allStates = readLogoffStates()
  return Object.entries(allStates)
    .filter(([_, state]) => state.isLoggedOff)
    .map(([driverId, state]) => ({
      driverId,
      comment: state.comment,
      timestamp: state.timestamp,
    }))
}
