import React from 'react'
import { InfoField } from '../../../shared/components/InfoField'

/**
 * DriverProfileSection Component
 *
 * Displays the driver's profile information including:
 * - Profile photo (if available)
 * - Basic identity (name, ID, contacts)
 * - Vehicle and employment details
 * - Online/offline status (reflects logoff state)
 *
 * @param {Object} driver - The driver object with all driver details
 * @param {Object} currentLogoff - Current logoff state { isLoggedOff: boolean, comment: string }
 */
export function DriverProfileSection({ driver, currentLogoff }) {
  if (!driver) return null

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Driver profile photo - displays image if available, otherwise shows placeholder */}
      <div className="flex-shrink-0">
        {driver.profileImage ? (
          <img
            src={driver.profileImage}
            alt={`${driver.name} profile`}
            className="w-32 h-32 rounded-2xl border border-slate-200 object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`w-32 h-32 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs ${driver.profileImage ? 'hidden' : ''}`}
        >
          {driver.profileImage ? 'Image not available' : 'No photo'}
        </div>
      </div>

      {/* Main identity block */}
      <div className="flex-1 grid gap-4 md:grid-cols-3">
        <InfoField label="Name" value={driver.name} />
        <InfoField label="Driver ID" value={driver.id} />
        <InfoField label="Mobile" value={driver.mobile} />
        <InfoField label="Email Address" value={driver.email} />
        <InfoField
          label="Emergency Contact"
          value={driver.emergencyContact}
        />
        <InfoField label="Vehicle Number" value={driver.vehicleNumber} />
        <InfoField label="Cab Type" value={driver.cabType} />
        <InfoField label="Gender" value={driver.gender} />
        <InfoField label="Date of Birth" value={driver.dateOfBirth} />
        <InfoField label="Driver Age" value={driver.driverAge} />
        <InfoField label="City" value={driver.city} />
        <InfoField
          label="Address & PIN"
          value={
            driver.address
              ? `${driver.address}, ${driver.pinCode || ''}`
              : ''
          }
        />
        <InfoField label="Joining Date" value={driver.joiningDate} />
        <InfoField label="Onboarded On" value={driver.onboardedOn} />

        {/*
          Online / Offline Status Field
          - If admin has manually logged off the driver, shows "Offline (logged off)"
          - Otherwise shows the driver's natural online status from the system
        */}
        <InfoField
          label="Online / Offline Status"
          value={
            currentLogoff?.isLoggedOff
              ? 'Offline (logged off)'
              : driver.onlineStatus
          }
        />

        <InfoField
          label="Last Active Time"
          value={driver.lastActiveTime}
        />

        <InfoField
          label="When went online today"
          value={driver.whenWentOnlineToday}
        />
      </div>
    </div>
  )
}
