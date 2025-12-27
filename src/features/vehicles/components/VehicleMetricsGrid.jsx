import React from 'react'
import { MetricCard } from '../../../shared/components/MetricCard'
import { InfoField } from '../../../shared/components/InfoField'

/**
 * VehicleMetricsGrid Component
 *
 * Displays top-level vehicle metrics (global or specific vehicle)
 */
export function VehicleMetricsGrid({ metrics, onMetricClick }) {
  if (!metrics) return null

  return (
    <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard
        label="Total Vehicles"
        value={metrics.totalVehicles}
        onClick={onMetricClick ? () => onMetricClick('totalVehicles') : undefined}
      />
      <MetricCard
        label="Active Vehicles"
        value={metrics.activeVehicles}
        onClick={onMetricClick ? () => onMetricClick('activeVehicles') : undefined}
      />
      <MetricCard
        label="Vehicles Used Today"
        value={metrics.vehiclesUsedToday}
        onClick={onMetricClick ? () => onMetricClick('vehiclesUsedToday') : undefined}
      />
      <MetricCard
        label="Vehicle Online"
        value={metrics.vehiclesOnline}
        onClick={onMetricClick ? () => onMetricClick('vehiclesOnline') : undefined}
      />
      <MetricCard
        label="Vehicle Offline"
        value={metrics.vehiclesOffline}
        onClick={onMetricClick ? () => onMetricClick('vehiclesOffline') : undefined}
      />
      <MetricCard
        label="Documents Expiring in 15 Days"
        value={metrics.documentsExpiringIn15Days}
        onClick={onMetricClick ? () => onMetricClick('documentsExpiringIn15Days') : undefined}
      />
      <MetricCard
        label="No Trips in Last 7 Days"
        value={metrics.noTripsInLast7Days}
        onClick={onMetricClick ? () => onMetricClick('noTripsInLast7Days') : undefined}
      />
      <MetricCard
        label="Vehicles Without Assigned Driver"
        value={metrics.vehiclesWithoutAssignedDriver}
        onClick={onMetricClick ? () => onMetricClick('vehiclesWithoutAssignedDriver') : undefined}
      />
    </section>
  )
}

/**
 * VehiclePerformanceMetrics Component
 *
 * Displays vehicle performance and trip analytics
 */
export function VehiclePerformanceMetrics({ vehicle, navigate }) {
  if (!vehicle) return null

  return (
    <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
      <MetricCard
        label="Total Trips Completed"
        value={vehicle.totalTripsCompleted}
      />
      <div
        className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => navigate(`/trips?vehicleId=${vehicle.id}&days=7`)}
      >
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          Trips in Last 7 Days
        </div>
        <div className="mt-1 text-sm font-semibold text-blue-600">
          {vehicle.tripsInLast7Days} →
        </div>
      </div>
      <div
        className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => navigate(`/trips?vehicleId=${vehicle.id}&days=30`)}
      >
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          Trips in Last 30 Days
        </div>
        <div className="mt-1 text-sm font-semibold text-blue-600">
          {vehicle.tripsInLast30Days} →
        </div>
      </div>
      <MetricCard
        label="Total KM Run"
        value={`${vehicle.totalKmRun} km`}
      />
      <MetricCard
        label="On Trip"
        value={vehicle.isVehicleOnTrip ? 'Yes' : 'No'}
      />
      <MetricCard
        label="Last Trip"
        value={vehicle.lastTripDateTime || '-'}
      />
    </div>
  )
}

/**
 * VehicleRevenueMetrics Component
 *
 * Displays vehicle revenue and financial analytics
 */
export function VehicleRevenueMetrics({ vehicle }) {
  if (!vehicle) return null

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <MetricCard
        label="Total Revenue Generated"
        value={`₹${vehicle.totalRevenueGenerated?.toLocaleString()}`}
      />
      <MetricCard
        label="Avg Revenue Per Trip"
        value={`₹${vehicle.averageRevenuePerTrip}`}
      />
      <MetricCard
        label="Avg Daily Revenue (30d)"
        value={`₹${vehicle.averageDailyRevenueLast30Days}`}
      />
      <MetricCard
        label="Coco Earnings"
        value={`₹${vehicle.cocoEarningsFromVehicle?.toLocaleString()}`}
      />
    </div>
  )
}

/**
 * VehicleDocumentsSection Component
 *
 * Displays vehicle documents and certificate expiry dates
 */
export function VehicleDocumentsSection({ vehicle }) {
  if (!vehicle) return null

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <InfoField
        label="Insurance Expiry"
        value={vehicle.insuranceExpiry}
      />
      <InfoField
        label="Pollution Certificate Expiry"
        value={vehicle.pollutionCertificateExpiry}
      />
      <InfoField
        label="Road Tax Validity"
        value={vehicle.roadTaxValidity}
      />
      <InfoField
        label="Fitness Certificate Expiry"
        value={vehicle.fitnessCertificateExpiry}
      />
      <InfoField label="Permit Expiry" value={vehicle.permitExpiry} />
      <div>
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          RC Image
        </div>
        <a
          href={vehicle.rcImage}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View Document
        </a>
      </div>
      <div>
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          Insurance Copy
        </div>
        <a
          href={vehicle.insuranceCopy}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View Document
        </a>
      </div>
      <div>
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          Fitness Certificate
        </div>
        <a
          href={vehicle.fitnessCertificate}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View Document
        </a>
      </div>
    </div>
  )
}

/**
 * VehicleDriverSection Component
 *
 * Displays driver assignment information
 */
export function VehicleDriverSection({ vehicle }) {
  if (!vehicle) return null

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <InfoField
        label="Assigned Driver ID"
        value={vehicle.driverId || 'None'}
      />
      <InfoField label="Driver Name" value={vehicle.driverName} />
      <InfoField label="Driver Mobile" value={vehicle.driverMobile} />
      <InfoField
        label="Last Assigned Driver"
        value={vehicle.lastAssignedDriver || 'None'}
      />
    </div>
  )
}
