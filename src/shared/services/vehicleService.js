import { STORAGE_KEYS } from '../constants/storageKeys'
import { baseVehicles } from '../data/vehicleData'
import {
  getVehicleWithMetrics,
  getAllVehiclesWithMetrics,
  getVehicleMetrics
} from './metricsService'

// Load blocked status from localStorage
function loadBlockedStatus() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VEHICLE_BLOCKED_STATUS)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to load blocked status:', error)
    return {}
  }
}

// Save blocked status to localStorage
function saveBlockedStatus(vehicleId, isBlocked, reason = '') {
  try {
    const blockedStatus = loadBlockedStatus()
    blockedStatus[vehicleId] = {
      blocked: isBlocked,
      reason: reason,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEYS.VEHICLE_BLOCKED_STATUS, JSON.stringify(blockedStatus))
  } catch (error) {
    console.error('Failed to save blocked status:', error)
  }
}

// Get vehicles with current blocked status and metrics
function getVehiclesWithStatus() {
  const blockedStatus = loadBlockedStatus()
  return baseVehicles.map((vehicle) => {
    const vehicleWithMetrics = getVehicleWithMetrics(vehicle.id)
    // Handle both old format (boolean) and new format (object)
    const blockData = blockedStatus[vehicle.id]
    let blockInfo
    if (typeof blockData === 'boolean') {
      // Old format: convert to new format
      blockInfo = { blocked: blockData, reason: '', timestamp: null }
    } else if (typeof blockData === 'object' && blockData !== null) {
      // New format: use as is
      blockInfo = blockData
    } else {
      // No data: default values
      blockInfo = { blocked: false, reason: '', timestamp: null }
    }

    return {
      ...vehicleWithMetrics,
      blocked: blockInfo.blocked || false,
      blockedReason: blockInfo.reason || '',
      blockedTimestamp: blockInfo.timestamp || null,
      onlineStatus: vehicle.isVehicleOnTrip ? 'online' : 'offline',
    }
  })
}

export function getVehicles() {
  return getVehiclesWithStatus()
}

// Re-export metrics functions for convenience
export { getVehicleWithMetrics, getAllVehiclesWithMetrics, getVehicleMetrics }

export function getVehicleByDriverId(driverId) {
  const vehicles = getVehiclesWithStatus()
  return vehicles.find((v) => String(v.driverId) === String(driverId)) || null
}

export function getVehicleByNumber(vehicleNumber) {
  const vehicles = getVehiclesWithStatus()
  return (
    vehicles.find((v) => String(v.vehicleNumber) === String(vehicleNumber)) ||
    null
  )
}

export async function addVehicle(vehicle) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicles = getVehiclesWithStatus()
      if (vehicles.some((v) => v.id === vehicle.id)) {
        reject(new Error(`Vehicle ID ${vehicle.id} already exists`))
      } else if (vehicles.some((v) => v.vehicleNumber === vehicle.vehicleNumber)) {
        reject(new Error(`Vehicle number ${vehicle.vehicleNumber} already exists`))
      } else {
        baseVehicles.push(vehicle)
        resolve(vehicle)
      }
    }, 300)
  })
}

export async function blockVehicle(vehicleId, reason = '') {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = baseVehicles.find((v) => v.id === vehicleId)
      if (!vehicle) {
        reject(new Error(`Vehicle ID ${vehicleId} not found`))
      } else {
        saveBlockedStatus(vehicleId, true, reason)
        resolve({ ...vehicle, blocked: true, blockedReason: reason })
      }
    }, 300)
  })
}

export async function unblockVehicle(vehicleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = baseVehicles.find((v) => v.id === vehicleId)
      if (!vehicle) {
        reject(new Error(`Vehicle ID ${vehicleId} not found`))
      } else {
        saveBlockedStatus(vehicleId, false, '')
        resolve({ ...vehicle, blocked: false, blockedReason: '' })
      }
    }, 300)
  })
}
