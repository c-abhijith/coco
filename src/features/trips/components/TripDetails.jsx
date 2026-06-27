import React from 'react'
import { DropLocationsMap } from './DropLocationsMap'

function Field({ label, value, badge, badgeClass }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
      {badge ? (
        <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-lg border ${badgeClass}`}>
          {value ?? '-'}
        </span>
      ) : (
        <div className="text-sm text-slate-900 mt-0.5">{value ?? '-'}</div>
      )}
    </div>
  )
}

const formatDate = (val) => {
  if (!val) return '-'
  return new Date(val).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const fmt = (val) => {
  const n = Number(val)
  if (!Number.isFinite(n)) return '-'
  return `₹${n.toFixed(2)}`
}

const statusColor = (status) => {
  const s = (status || '').toLowerCase()
  if (s.includes('complet')) return 'bg-green-50 text-green-700 border-green-200'
  if (s.includes('cancel'))  return 'bg-red-50 text-red-700 border-red-200'
  if (s.includes('progress') || s.includes('ongoing')) return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-slate-50 text-slate-600 border-slate-200'
}

export function TripDetails({ trip, loading }) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500 text-sm">Loading trip details…</div>
      </section>
    )
  }

  if (!trip) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500">
          <p className="text-sm">No trip selected</p>
          <p className="text-xs mt-1">Click a Trip ID from Rider Management to view details</p>
        </div>
      </section>
    )
  }

  const fields = [
    // Rider (top — most important)
    { label: 'Rider Name',           value: trip.RiderName },
    { label: 'Rider Mobile',         value: trip.RiderMobileNumber },
    { label: 'Rider Status',         value: trip.RiderStatus },
    { label: 'Rider Rating',         value: trip.RiderRating },
    { label: 'Rider No Show',        value: trip.RiderNoShow },

    // Driver
    { label: 'Driver Name',          value: trip.DriverName },
    { label: 'Driver Mobile',        value: trip.DriverMobileNumber },
    { label: 'Driver Status',        value: trip.DriverStatus },
    { label: 'Driver Rating',        value: trip.DriverRating },
    { label: 'Vehicle No.',          value: trip.VehicleNumber },

    // Trip overview
    { label: 'Trip ID',              value: trip.TripID },
    { label: 'Status',               value: trip.StatusDescription, badge: true, badgeClass: statusColor(trip.StatusDescription) },
    { label: 'Cab Requested',        value: trip.CabTypeRequested },
    { label: 'Cab Arrived',          value: trip.CabTypeArrived },

    // Route
    { label: 'Pickup Location',      value: trip.PickLocationGMapFullAddress },
    { label: 'Pickup Hub',           value: trip.PickupHub },
    { label: 'Drop Hub',             value: trip.DropHub },
    { label: 'Multi Drop',           value: trip.IsMultiDrop },

    // Timing
    { label: 'Created',              value: formatDate(trip.TripCreationTime) },
    { label: 'Accepted',             value: formatDate(trip.TripAcceptedTime) },
    { label: 'Pickup Time',          value: formatDate(trip.PickupTime) },
    { label: 'Dropped Time',         value: formatDate(trip.DropedTime) },

    { label: 'Driver Arrival',        value: formatDate(trip.DriverArrivalTime) },
    { label: 'Scheduled Trip',        value: trip.ScheduledTrip },
    { label: 'Scheduled Time',        value: formatDate(trip.TripScheduleTime) },
    { label: 'Expected Distance',     value: trip.ExpectedTripDistance != null ? `${trip.ExpectedTripDistance} km` : '-' },
    { label: 'Actual Distance',       value: trip.TotalKM != null ? `${trip.TotalKM} km` : '-' },
    { label: 'Drivers Reassigned',    value: trip.DriversReassigned },

    // Financials
    { label: 'Payment Type',         value: trip.PaymentType },
    { label: 'Est. Fare',            value: fmt(trip.EstimatedTripFare) },
    { label: 'Total Trip Fare',      value: fmt(trip.TotalTripFare) },
    { label: 'Collected',            value: fmt(trip.DriverCollectedPrice) },

    { label: 'Driver Received',       value: fmt(trip.DriverReceived) },
    { label: 'Coco Received',        value: fmt(trip.CocoReceived) },
    { label: 'GST',                  value: fmt(trip.GST) },
    { label: 'Rider Advance',        value: fmt(trip.RiderTripAdvance) },

    { label: 'Trip Fare',            value: fmt(trip.TripFare) },
    { label: 'Platform Fee',         value: fmt(trip.PlatformFee) },
    { label: 'User Platform Fee',    value: fmt(trip.UserPlatformFees) },
    { label: 'Carrier Charges',      value: fmt(trip.CarrierCharges) },

    { label: 'Refund Amount',        value: fmt(trip.RiderRefundAmount) },
    { label: 'Rider Settlement Adj', value: fmt(trip.RiderSettlementAdjustementAmount) },
    { label: 'Amount Settled',       value: trip.TripAmountSettled },
    { label: 'Settlement Amount',    value: fmt(trip.TotalDriverSettlementAmt) },

    { label: 'Settlement Time',      value: formatDate(trip.DriverSettlementTime) },
    { label: 'Driver Cancel Fee',    value: fmt(trip.DriverCancellationFees) },
    { label: 'Vehicle Status',       value: trip.VehicleStatus },
    { label: 'Carrier Requested',    value: trip.IsCarrierRequested },

    // OTP & Cancellation
    { label: 'Start OTP',            value: trip.TripStartOTP },
    { label: 'End OTP',              value: trip.TripEndOTP },
    { label: 'Cancelled',            value: trip.CancelledTrip },
    { label: 'Cancellation Reason',  value: trip.CancellationReason },

    { label: 'Cancellation Time',    value: formatDate(trip.CancellationTime) },
    { label: 'Cancellation Fee',     value: fmt(trip.CancellationFee) },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Trip Details</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
        {fields.map((f) => (
          <Field key={f.label} {...f} />
        ))}
      </div>

      <DropLocationsMap
        dropDetailsJSON={trip.DropDetailsJSON}
        dropLocationsRaw={trip.DropLocations}
        pickupAddress={trip.PickLocationGMapFullAddress}
        tripId={trip.TripID}
        tripInfo={{
          pickupTime:           trip.PickupTime,
          dropedTime:           trip.DropedTime,
          totalKM:              trip.TotalKM,
          estimatedTripFare:    trip.EstimatedTripFare,
          totalTripFare:        trip.TotalTripFare,
          driverCollectedPrice: trip.DriverCollectedPrice,
          driverReceived:       trip.DriverReceived,
          cocoReceived:         trip.CocoReceived,
          riderPickupFee:       trip.RiderPickupFee,
          riderAwaittingFee:    trip.RiderAwaittingFee,
        }}
      />
    </section>
  )
}

export default TripDetails
