import React from 'react'
import { MetricCard } from '../../../shared/components/MetricCard'

export function DriverMetricsGrid({ metrics, currentLogoff, onMetricClick }) {
  if (!metrics) return null

  return (
    <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard
        label="Total Drivers"
        value={metrics.totalDrivers}
        onClick={onMetricClick ? () => onMetricClick('totalDrivers') : undefined}
      />
      <MetricCard
        label="Total Active Drivers"
        value={metrics.totalActiveDrivers}
        onClick={onMetricClick ? () => onMetricClick('totalActiveDrivers') : undefined}
      />
      <MetricCard
        label="Online Now"
        value={metrics.onlineNow}
        onClick={onMetricClick ? () => onMetricClick('onlineNow') : undefined}
      />
      <MetricCard
        label="Driver's own trip"
        value={metrics.idleOnlineDrivers}
        onClick={onMetricClick ? () => onMetricClick('idleOnlineDrivers') : undefined}
      />
      <MetricCard
        label="Drivers Who Drove Today"
        value={metrics.driversWhoDroveToday}
        onClick={onMetricClick ? () => onMetricClick('driversWhoDroveToday') : undefined}
      />
      <MetricCard
        label="Drivers with Complaints"
        value={metrics.driversWithComplaints}
        onClick={onMetricClick ? () => onMetricClick('driversWithComplaints') : undefined}
      />
      <MetricCard
        label="Drivers with High Cancellation Rate"
        value={metrics.driversWithHighCancellation}
        onClick={onMetricClick ? () => onMetricClick('driversWithHighCancellation') : undefined}
      />
      <MetricCard
        label="Overall Average Driver Rating"
        value={metrics.overallAvgRating}
        onClick={onMetricClick ? () => onMetricClick('overallAvgRating') : undefined}
      />
      <MetricCard
        label="Average Trips per Driver"
        value={metrics.avgTripsPerDriver}
        onClick={onMetricClick ? () => onMetricClick('avgTripsPerDriver') : undefined}
      />
      <MetricCard
        label="Average Acceptance Rate"
        value={`${metrics.avgAcceptanceRate}%`}
        onClick={onMetricClick ? () => onMetricClick('avgAcceptanceRate') : undefined}
      />
      <MetricCard
        label="Average Cancellation Rate"
        value={`${metrics.avgCancellationRate}%`}
        onClick={onMetricClick ? () => onMetricClick('avgCancellationRate') : undefined}
      />
      <MetricCard
        label="Avg Complaints per 100 Trips"
        value={metrics.avgComplaintsPer100Trips}
        onClick={onMetricClick ? () => onMetricClick('avgComplaintsPer100Trips') : undefined}
      />
      <MetricCard
        label="Average No-show Count"
        value={metrics.avgNoShowCount}
        onClick={onMetricClick ? () => onMetricClick('avgNoShowCount') : undefined}
      />
    </section>
  )
}

export function DriverPerformanceMetrics({ driver, currentLogoff }) {
  if (!driver) return null

  return (
    <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
      <MetricCard label="Avg Rating" value={driver.rating} />
      <MetricCard
        label="Driver Utilization %"
        value={`${driver.driverUtilizationPct ?? '-'}%`}
      />
      <MetricCard
        label="Total Trips Completed"
        value={driver.totalTripsCompleted}
      />
      <MetricCard
        label="Active Today"
        value={driver.droveToday ? 'Yes' : 'No'}
      />
      <MetricCard
        label="Online Now"
        value={
          currentLogoff?.isLoggedOff
            ? 'No (logged off)'
            : driver.onlineStatus === 'Online'
            ? 'Yes'
            : 'No'
        }
      />
      <MetricCard label="Trips Today" value={driver.tripsToday} />
      <MetricCard
        label="Online hours today"
        value={
          driver.onlineHoursToday != null
            ? `${driver.onlineHoursToday} hrs`
            : '-'
        }
      />
      <MetricCard
        label="Acceptance Rate"
        value={`${driver.acceptanceRatePct ?? 0}%`}
      />
      <MetricCard
        label="Cancellation Rate"
        value={`${driver.cancellationRatePct ?? 0}%`}
      />
      <MetricCard
        label="Complaints per 100 Trips"
        value={driver.complaintsPer100Trips ?? 0}
      />
      <MetricCard
        label="Total Complaints"
        value={driver.complaintsCount ?? 0}
      />
      <MetricCard label="No-show Count" value={driver.noShowCount ?? 0} />
      <MetricCard
        label="Last Trip Rating"
        value={driver.lastTripRating ?? '-'}
      />
      <MetricCard
        label="Last Trip Rating (7 days)"
        value={driver.lastTripRating7Days ?? '-'}
      />
      <MetricCard
        label="Last Trip Rating (30 days)"
        value={driver.lastTripRating30Days ?? '-'}
      />
      <MetricCard
        label="Trips / Online Hour"
        value={driver.tripsPerOnlineHour ?? '-'}
      />
      <MetricCard
        label="Total Earnings (lifetime)"
        value={
          driver.totalEarningsLifetime != null
            ? `₹${driver.totalEarningsLifetime.toLocaleString('en-IN')}`
            : '-'
        }
      />
      <MetricCard
        label="Earnings (last 7 days)"
        value={
          driver.earningsLast7Days != null
            ? `₹${driver.earningsLast7Days.toLocaleString('en-IN')}`
            : '-'
        }
      />
      <MetricCard
        label="Earnings (last 30 days)"
        value={
          driver.earningsLast30Days != null
            ? `₹${driver.earningsLast30Days.toLocaleString('en-IN')}`
            : '-'
        }
      />
      <MetricCard
        label="Cash from rider (today)"
        value={`₹${driver.cashCollectToday ?? 0}`}
      />
      <MetricCard
        label="Cash from rider (yesterday)"
        value={`₹${driver.cashCollectYesterday ?? 0}`}
      />
      <MetricCard
        label="Cash from rider (day before yesterday)"
        value={`₹${driver.cashCollectDayBeforeYesterday ?? 0}`}
      />
    </div>
  )
}

export function DriverPayoutMetrics({ driver }) {
  if (!driver) return null

  return (
    <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
      <MetricCard
        label="Has Pending Payout"
        value={driver.hasPendingPayout ? 'Yes' : 'No'}
      />
      <MetricCard label="Last Payout Date" value={driver.lastPayoutDate} />
      <MetricCard
        label="Last Payout Amount"
        value={
          driver.lastPayoutAmount != null
            ? `₹${driver.lastPayoutAmount.toLocaleString('en-IN')}`
            : '-'
        }
      />
      <MetricCard
        label="Payout Method (Bank / UPI)"
        value={driver.payoutMethod}
      />
      <MetricCard label="IFSC" value={driver.ifsc} />
      <MetricCard
        label="Masked Account No."
        value={driver.bankMaskedAccount}
      />
      <MetricCard
        label="Amount payable (next payout)"
        value={
          driver.amountPayableNextPayout != null
            ? `₹${driver.amountPayableNextPayout.toLocaleString('en-IN')}`
            : '-'
        }
      />
      <MetricCard
        label="Total Penalties Count"
        value={driver.totalPenaltiesCount}
      />
      <MetricCard
        label="Total Penalties Amount"
        value={`₹${driver.totalPenaltiesAmount ?? 0}`}
      />
      <MetricCard
        label="Total Penalties Paid"
        value={`₹${driver.totalPenaltiesPaid ?? 0}`}
      />
      <MetricCard
        label="Total Penalties Pending"
        value={`₹${driver.totalPenaltiesPending ?? 0}`}
      />
    </div>
  )
}

export function DriverComplianceMetrics({ driver }) {
  if (!driver) return null

  return (
    <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
      <MetricCard
        label="Aadhaar / ID Number"
        value={driver.aadhaarNumber}
      />
      <MetricCard
        label="Aadhaar Link"
        value={
          driver.aadhaarLink ? (
            <a
              href={driver.aadhaarLink}
              target="_blank"
              rel="noreferrer"
              className="underline text-xs text-blue-600"
            >
              View Aadhaar
            </a>
          ) : (
            '-'
          )
        }
      />
      <MetricCard label="PAN" value={driver.panNumber} />
      <MetricCard
        label="PAN Image"
        value={
          driver.panImageUrl ? (
            <a
              href={driver.panImageUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-xs text-blue-600"
            >
              View PAN
            </a>
          ) : (
            '-'
          )
        }
      />
      <MetricCard
        label="License Number"
        value={driver.drivingLicenseNumber}
      />
      <MetricCard
        label="License Expiry Date"
        value={driver.licenseExpiryDate}
      />
      <MetricCard
        label="Issuing State"
        value={driver.licenseIssuingState}
      />
      <MetricCard
        label="License Image"
        value={
          driver.licenseImageUrl ? (
            <a
              href={driver.licenseImageUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-xs text-blue-600"
            >
              View License
            </a>
          ) : (
            '-'
          )
        }
      />
      <MetricCard
        label="Police Verification Status"
        value={driver.policeVerificationStatus}
      />
      <MetricCard
        label="Background Verification Status"
        value={driver.backgroundVerificationStatus}
      />
      <MetricCard label="KYC Status" value={driver.kycStatus} />
      <MetricCard
        label="Rejection Reason"
        value={driver.kycRejectionReason || '-'}
      />
      <MetricCard
        label="Docs expiring in next 15 days"
        value={driver.docsExpiringNext15Days ?? 0}
      />
      <MetricCard
        label="Driver on Watchlist / Blocked"
        value={driver.driversOnWatchlistOrBlocked ? 'Yes' : 'No'}
      />
    </div>
  )
}

export function DriverDeviceMetrics({ driver }) {
  if (!driver) return null

  return (
    <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
      <MetricCard
        label="Driver App Version"
        value={driver.driverAppVersion}
      />
      <MetricCard
        label="Last GPS heartbeat"
        value={
          driver.lastGpsHeartbeatUrl ? (
            <a
              href={driver.lastGpsHeartbeatUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-xs text-blue-600"
            >
              Open in Google Maps
            </a>
          ) : (
            '-'
          )
        }
      />
      <MetricCard
        label="Active Account"
        value={driver.activeAccount ? 'Yes' : 'No'}
      />
      <MetricCard label="Login OTP" value={driver.loginOtp || '-'} />
      <MetricCard
        label="Secondary Mobile Number"
        value={driver.secondaryMobile || '-'}
      />
      <MetricCard
        label="Scheduled trips today"
        value={driver.scheduledToday ?? 0}
      />
      <MetricCard
        label="Scheduled trips tomorrow"
        value={driver.scheduledTomorrow ?? 0}
      />
      <MetricCard
        label="Scheduled trips day after tomorrow"
        value={driver.scheduledDayAfter ?? 0}
      />
      <MetricCard
        label="Total Scheduled trips accepted"
        value={driver.totalScheduledTripsAccepted ?? 0}
      />
      <MetricCard
        label="Upcoming scheduled trips"
        value={driver.upcomingScheduledTrips ?? 0}
      />
      <MetricCard
        label="Total Scheduled trips cancelled"
        value={driver.totalScheduledTripsCancelled ?? 0}
      />
      <MetricCard label="Remark" value={driver.remark || '-'} />
    </div>
  )
}
