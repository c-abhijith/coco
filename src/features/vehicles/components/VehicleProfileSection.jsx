import React from 'react'
import { InfoField } from '../../../shared/components/InfoField'

/**
 * VehicleProfileSection Component
 *
 * Displays the vehicle's profile information including:
 * - Owner photo (if available)
 * - Basic vehicle identity (number, brand, model)
 * - Owner and driver details
 * - Vehicle specifications
 *
 * @param {Object} vehicle - The vehicle object with all vehicle details
 */
export function VehicleProfileSection({ vehicle }) {
  if (!vehicle) return null

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Owner profile photo - displays image if available, otherwise shows placeholder */}
      <div className="flex-shrink-0">
        {vehicle.ownerPhoto ? (
          <img
            src={vehicle.ownerPhoto}
            alt={`${vehicle.ownerName} photo`}
            className="w-32 h-32 rounded-2xl border border-slate-200 object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`w-32 h-32 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs ${vehicle.ownerPhoto ? 'hidden' : ''}`}
        >
          {vehicle.ownerPhoto ? 'Image not available' : 'No photo'}
        </div>
      </div>

      {/* Main identity block */}
      <div className="flex-1 grid gap-4 md:grid-cols-3">
        <InfoField label="Vehicle Number" value={vehicle.vehicleNumber} />
        <InfoField label="Vehicle ID" value={vehicle.id} />
        <InfoField label="Brand" value={vehicle.brand} />
        <InfoField label="Model" value={vehicle.model} />
        <InfoField label="Year" value={vehicle.year} />
        <InfoField label="Cab Type" value={vehicle.cabType} />
        <InfoField label="Fuel Type" value={vehicle.fuelType} />
        <InfoField label="Seat Capacity" value={vehicle.seatCapacity} />
        <InfoField label="Color" value={vehicle.color} />
        <InfoField label="Owner Name" value={vehicle.ownerName} />
        <InfoField label="Mobile 1" value={vehicle.mobile1} />
        <InfoField label="Mobile 2" value={vehicle.mobile2} />
        <InfoField label="City" value={vehicle.city} />
        <InfoField label="State" value={vehicle.state} />
        <InfoField
          label="Address & PIN"
          value={
            vehicle.address
              ? `${vehicle.address}, ${vehicle.pincode || ''}`
              : ''
          }
        />
        <InfoField
          label="Date Added to Platform"
          value={vehicle.dateAddedToPlatform}
        />
        <InfoField
          label="Vehicle Condition"
          value={vehicle.vehicleConditionRating}
        />
        <InfoField
          label="On Trip"
          value={vehicle.isVehicleOnTrip ? 'Yes' : 'No'}
        />
      </div>
    </div>
  )
}
