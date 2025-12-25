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
function saveBlockedStatus(vehicleId, isBlocked) {
  try {
    const blockedStatus = loadBlockedStatus()
    blockedStatus[vehicleId] = isBlocked
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
    return {
      ...vehicleWithMetrics,
      blocked: blockedStatus[vehicle.id] || false,
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

export async function blockVehicle(vehicleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = baseVehicles.find((v) => v.id === vehicleId)
      if (!vehicle) {
        reject(new Error(`Vehicle ID ${vehicleId} not found`))
      } else {
        saveBlockedStatus(vehicleId, true)
        resolve({ ...vehicle, blocked: true })
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
        saveBlockedStatus(vehicleId, false)
        resolve({ ...vehicle, blocked: false })
      }
    }, 300)
  })
}
