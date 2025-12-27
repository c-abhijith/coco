/**
 * Vehicle Metrics Utility
 * Computes aggregate metrics for vehicles
 */

/**
 * Compute global metrics from a list of vehicles
 * @param {Array} vehicles - Array of vehicle objects
 * @returns {Object} Computed metrics
 */
export function computeVehicleMetrics(vehicles) {
  if (!vehicles || vehicles.length === 0) {
    return {
      totalVehicles: 0,
      activeVehicles: 0,
      vehiclesUsedToday: 0,
      vehiclesOnline: 0,
      vehiclesOffline: 0,
      documentsExpiringIn15Days: 0,
      noTripsInLast7Days: 0,
      vehiclesWithoutAssignedDriver: 0,
    }
  }

  const today = new Date()
  const fifteenDaysFromNow = new Date()
  fifteenDaysFromNow.setDate(today.getDate() + 15)

  // Get today's date string for comparison (YYYY-MM-DD format)
  const todayStr = today.toISOString().split('T')[0]

  let activeCount = 0
  let vehiclesUsedTodayCount = 0
  let onlineCount = 0
  let offlineCount = 0
  let docsExpiringCount = 0
  let noTripsLast7DaysCount = 0
  let noDriverCount = 0

  vehicles.forEach((vehicle) => {
    // Active vehicles
    if (vehicle.status === 'Active') {
      activeCount++
    }

    // Vehicles used today - check if last trip was today
    if (vehicle.lastTripDateTime) {
      const lastTripDate = vehicle.lastTripDateTime.split(' ')[0] // Get date part
      if (lastTripDate === todayStr) {
        vehiclesUsedTodayCount++
      }
    }

    // Online/Offline - based on isVehicleOnTrip
    if (vehicle.isVehicleOnTrip) {
      onlineCount++
    } else {
      offlineCount++
    }

    // Documents expiring in next 15 days - count vehicles with at least one expiring doc
    const documentsToCheck = [
      vehicle.insuranceExpiry,
      vehicle.pollutionCertificateExpiry,
      vehicle.roadTaxValidity,
      vehicle.fitnessCertificateExpiry,
      vehicle.permitExpiry,
    ]

    let hasExpiringDoc = false
    documentsToCheck.forEach((docDate) => {
      if (docDate && !hasExpiringDoc) {
        const expiryDate = new Date(docDate)
        if (expiryDate >= today && expiryDate <= fifteenDaysFromNow) {
          hasExpiringDoc = true
        }
      }
    })

    if (hasExpiringDoc) {
      docsExpiringCount++
    }

    // No trips in last 7 days
    if (vehicle.tripsInLast7Days === 0) {
      noTripsLast7DaysCount++
    }

    // Vehicles without assigned driver
    if (!vehicle.driverId || vehicle.driverId === 'None') {
      noDriverCount++
    }
  })

  return {
    totalVehicles: vehicles.length,
    activeVehicles: activeCount,
    vehiclesUsedToday: vehiclesUsedTodayCount,
    vehiclesOnline: onlineCount,
    vehiclesOffline: offlineCount,
    documentsExpiringIn15Days: docsExpiringCount,
    noTripsInLast7Days: noTripsLast7DaysCount,
    vehiclesWithoutAssignedDriver: noDriverCount,
  }
}
