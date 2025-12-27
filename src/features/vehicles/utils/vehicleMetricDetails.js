/**
 * Vehicle Metric Details Utilities
 *
 * Functions to get detailed data for each vehicle metric
 */

/**
 * Get list of all vehicles
 */
export function getTotalVehiclesDetails(vehicles) {
  return vehicles.map(v => ({
    vehicleNumber: v.vehicleNumber,
    vehicleName: v.vehicleName,
    brand: v.brand,
    model: v.model,
    cabType: v.cabType,
    status: v.onlineStatus,
    blocked: v.blocked
  }))
}

/**
 * Get list of active vehicles
 */
export function getActiveVehiclesDetails(vehicles) {
  return vehicles
    .filter(v => v.status === 'Active')
    .map(v => ({
      vehicleNumber: v.vehicleNumber,
      vehicleName: v.vehicleName,
      brand: v.brand,
      model: v.model,
      cabType: v.cabType,
      status: v.onlineStatus,
      driver: v.driverName || 'None'
    }))
}

/**
 * Get list of vehicles used today
 */
export function getVehiclesUsedTodayDetails(vehicles) {
  const today = new Date().toISOString().split('T')[0]
  return vehicles
    .filter(v => {
      if (!v.lastTripDateTime) return false
      const lastTripDate = v.lastTripDateTime.split(' ')[0] // Get date part
      return lastTripDate === today
    })
    .map(v => ({
      vehicleNumber: v.vehicleNumber,
      vehicleName: v.vehicleName,
      lastTrip: v.lastTripDateTime,
      driver: v.driverName || 'None',
      totalTrips: v.totalTripsCompleted
    }))
}

/**
 * Get list of online vehicles (vehicles on trip)
 */
export function getVehiclesOnlineDetails(vehicles) {
  return vehicles
    .filter(v => v.isVehicleOnTrip)
    .map(v => ({
      vehicleNumber: v.vehicleNumber,
      vehicleName: v.vehicleName,
      brand: v.brand,
      model: v.model,
      driver: v.driverName || 'None',
      onTrip: 'Yes'
    }))
}

/**
 * Get list of offline vehicles (vehicles not on trip)
 */
export function getVehiclesOfflineDetails(vehicles) {
  return vehicles
    .filter(v => !v.isVehicleOnTrip)
    .map(v => ({
      vehicleNumber: v.vehicleNumber,
      vehicleName: v.vehicleName,
      brand: v.brand,
      model: v.model,
      driver: v.driverName || 'None',
      lastTrip: v.lastTripDateTime || 'Never'
    }))
}

/**
 * Get list of vehicles with documents expiring in 15 days
 */
export function getDocumentsExpiringDetails(vehicles) {
  const today = new Date()
  const fifteenDaysFromNow = new Date()
  fifteenDaysFromNow.setDate(today.getDate() + 15)

  const results = []

  vehicles.forEach(v => {
    const expiringDocs = []

    // Check each document
    const docs = [
      { name: 'Insurance', date: v.insuranceExpiry },
      { name: 'Pollution Certificate', date: v.pollutionCertificateExpiry },
      { name: 'Road Tax', date: v.roadTaxValidity },
      { name: 'Fitness Certificate', date: v.fitnessCertificateExpiry },
      { name: 'Permit', date: v.permitExpiry }
    ]

    docs.forEach(doc => {
      if (doc.date) {
        const expiryDate = new Date(doc.date)
        if (expiryDate >= today && expiryDate <= fifteenDaysFromNow) {
          expiringDocs.push(`${doc.name} (${doc.date})`)
        }
      }
    })

    if (expiringDocs.length > 0) {
      results.push({
        vehicleNumber: v.vehicleNumber,
        vehicleName: v.vehicleName,
        expiringDocuments: expiringDocs.join(', '),
        count: expiringDocs.length
      })
    }
  })

  return results
}

/**
 * Get list of vehicles with no trips in last 7 days
 */
export function getNoTripsInLast7DaysDetails(vehicles) {
  return vehicles
    .filter(v => v.tripsInLast7Days === 0)
    .map(v => ({
      vehicleNumber: v.vehicleNumber,
      vehicleName: v.vehicleName,
      brand: v.brand,
      model: v.model,
      lastTrip: v.lastTripDateTime || 'Never',
      driver: v.driverName || 'None',
      status: v.onlineStatus
    }))
}

/**
 * Get list of vehicles without assigned driver
 */
export function getVehiclesWithoutDriverDetails(vehicles) {
  return vehicles
    .filter(v => !v.driverId || v.driverId === 'None')
    .map(v => ({
      vehicleNumber: v.vehicleNumber,
      vehicleName: v.vehicleName,
      brand: v.brand,
      model: v.model,
      cabType: v.cabType,
      owner: v.ownerName,
      status: v.onlineStatus,
      lastDriver: v.lastAssignedDriver || 'None'
    }))
}
