// src/utils/driverMetrics.js

// Keep this logic in one place so it can be reused across pages/components.
export function computeGlobalMetrics(drivers) {
  const totalDrivers = drivers.length
  const totalActiveDrivers = drivers.filter((d) => d.status === 'Active').length
  const onlineNow = drivers.filter((d) => d.onlineStatus === 'Online').length
  const idleOnlineDrivers = drivers.filter(
    (d) => d.onlineStatus === 'Online' && d.isIdleOnline,
  ).length
  const driversWhoDroveToday = drivers.filter((d) => d.droveToday).length
  const driversWithComplaints = drivers.filter(
    (d) => (d.complaintsCount || 0) > 0,
  ).length
  const driversWithHighCancellation = drivers.filter(
    (d) => (d.cancellationRatePct || 0) >= 10,
  ).length

  const totalTrips = drivers.reduce(
    (sum, d) => sum + (d.totalTripsCompleted || 0),
    0,
  )
  const avgTripsPerDriver =
    totalDrivers > 0 ? (totalTrips / totalDrivers).toFixed(1) : '0.0'

  const overallAvgRating =
    totalDrivers > 0
      ? (
          drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / totalDrivers
        ).toFixed(2)
      : '0.00'

  const avgAcceptanceRate =
    totalDrivers > 0
      ? (
          drivers.reduce((sum, d) => sum + (d.acceptanceRatePct || 0), 0) /
          totalDrivers
        ).toFixed(1)
      : '0.0'

  const avgCancellationRate =
    totalDrivers > 0
      ? (
          drivers.reduce((sum, d) => sum + (d.cancellationRatePct || 0), 0) /
          totalDrivers
        ).toFixed(1)
      : '0.0'

  const avgComplaintsPer100Trips =
    totalDrivers > 0
      ? (
          drivers.reduce(
            (sum, d) => sum + (d.complaintsPer100Trips || 0),
            0,
          ) / totalDrivers
        ).toFixed(1)
      : '0.0'

  const avgNoShowCount =
    totalDrivers > 0
      ? (
          drivers.reduce((sum, d) => sum + (d.noShowCount || 0), 0) /
          totalDrivers
        ).toFixed(1)
      : '0.0'

  return {
    totalDrivers,
    totalActiveDrivers,
    onlineNow,
    idleOnlineDrivers,
    driversWhoDroveToday,
    driversWithComplaints,
    driversWithHighCancellation,
    avgTripsPerDriver,
    overallAvgRating,
    avgAcceptanceRate,
    avgCancellationRate,
    avgComplaintsPer100Trips,
    avgNoShowCount,
  }
}
