import React from 'react'
import { MetricCard } from '../../../shared/components/MetricCard'

/**
 * TripMetrics Component
 *
 * Displays overall trip statistics and amount breakdown
 * Shown when no specific trip is selected in Trip Management
 * Layout matches driver details page style
 *
 * @param {Array} trips - Array of trip objects to calculate metrics from
 * @param {Function} onMetricClick - Callback when a metric card is clicked
 */
export function TripMetrics({ trips = [], onMetricClick }) {
  // Calculate metrics
  const totalTrips = trips.length
  const completedTrips = trips.filter((t) => t.tripStatus === 'Completed').length
  const cancelledTrips = trips.filter((t) => t.tripStatus === 'Cancelled').length
  const ongoingTrips = trips.filter(
    (t) => t.tripStatus !== 'Completed' && t.tripStatus !== 'Cancelled'
  ).length

  // Calculate total distance and fare
  const totalDistance = trips.reduce((sum, t) => sum + (t.distanceKm || 0), 0)
  const totalFare = trips.reduce((sum, t) => sum + (t.totalFare || 0), 0)
  const avgFare = totalTrips > 0 ? totalFare / totalTrips : 0

  // Calculate amount breakdown totals
  const amountTotals = trips.reduce(
    (acc, trip) => {
      if (trip.amountBreakdown) {
        acc.tripAmount += trip.amountBreakdown.tripAmount || 0
        acc.driverGet += trip.amountBreakdown.driverGet || 0
        acc.adminGet += trip.amountBreakdown.adminGet || 0
        acc.vehicleOwnerGet += trip.amountBreakdown.vehicleOwnerGet || 0
        acc.tax += trip.amountBreakdown.tax || 0
      }
      return acc
    },
    { tripAmount: 0, driverGet: 0, adminGet: 0, vehicleOwnerGet: 0, tax: 0 }
  )

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard
        label="Total Trips"
        value={totalTrips}
        onClick={onMetricClick ? () => onMetricClick('totalTrips') : undefined}
      />
      <MetricCard
        label="Completed Trips"
        value={completedTrips}
        onClick={onMetricClick ? () => onMetricClick('completedTrips') : undefined}
      />
      <MetricCard
        label="Cancelled Trips"
        value={cancelledTrips}
        onClick={onMetricClick ? () => onMetricClick('cancelledTrips') : undefined}
      />
      <MetricCard
        label="Ongoing Trips"
        value={ongoingTrips}
        onClick={onMetricClick ? () => onMetricClick('ongoingTrips') : undefined}
      />
      <MetricCard label="Total Distance (km)" value={totalDistance.toFixed(1)} />
      <MetricCard label="Average Fare" value={formatCurrency(avgFare)} />
      <MetricCard label="Trip Amount (Total)" value={formatCurrency(amountTotals.tripAmount)} />
      <MetricCard label="Driver Gets" value={formatCurrency(amountTotals.driverGet)} />
      <MetricCard label="Admin Gets" value={formatCurrency(amountTotals.adminGet)} />
      <MetricCard label="Vehicle Owner Gets" value={formatCurrency(amountTotals.vehicleOwnerGet)} />
      <MetricCard label="Tax (GST)" value={formatCurrency(amountTotals.tax)} />
    </section>
  )
}
