import { STORAGE_KEYS } from '../constants/storageKeys'
import { drivers as seedDrivers } from '../data/driversData'
import {
  getDriverWithMetrics,
  getAllDriversWithMetrics,
  getDriverMetrics
} from './metricsService'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStored(list) {
  localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(list))
}

export function getDrivers() {
  const stored = readStored()

  // Merge seed + stored (stored overrides same id)
  const map = new Map()
  seedDrivers.forEach((d) => map.set(d.id, d))
  stored.forEach((d) => map.set(d.id, d))

  // Return drivers with calculated metrics for backward compatibility
  // Pass the driver object directly to avoid lookup issues
  const driversArray = Array.from(map.values())
  return driversArray.map(driver => getDriverWithMetrics(driver))
}

// Re-export metrics functions for convenience
export { getDriverWithMetrics, getAllDriversWithMetrics, getDriverMetrics }

export async function addDriver(newDriver) {
  if (!newDriver?.id) throw new Error('Driver ID is required')

  const id = String(newDriver.id).trim()
  const all = getDrivers()
  if (all.some((d) => d.id === id)) {
    throw new Error(`Driver ID already exists: ${id}`)
  }

  // Save to backend API (which writes to driversData.js)
  try {
    const response = await fetch('http://localhost:3001/api/drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDriver),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save driver')
    }

    // Also save to localStorage as backup
    const stored = readStored()
    stored.push(newDriver)
    writeStored(stored)
  } catch (error) {
    // If API fails, still save to localStorage
    console.warn('API save failed, saving to localStorage only:', error)
    const stored = readStored()
    stored.push(newDriver)
    writeStored(stored)
  }
}

export function clearCreatedDrivers() {
  localStorage.removeItem(STORAGE_KEYS.DRIVERS)
}
