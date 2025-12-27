/**
 * Vehicle Table Configuration
 * Configuration for vehicle data table columns and rendering
 */

export const vehicleTableColumns = [
  {
    key: 'vehicleNumber',
    label: 'Vehicle Number',
    render: (vehicle) => (
      <div>
        <div className="font-medium">{vehicle.vehicleNumber}</div>
        <div className="text-xs text-slate-500">{vehicle.id}</div>
      </div>
    )
  },
  {
    key: 'vehicleName',
    label: 'Vehicle Name',
    render: (vehicle) => (
      <div>
        <div className="font-medium">{vehicle.vehicleName}</div>
        <div className="text-xs text-slate-500">{vehicle.model}</div>
      </div>
    )
  },
  {
    key: 'cabType',
    label: 'Type',
    render: (vehicle) => (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        {vehicle.cabType}
      </span>
    )
  },
  {
    key: 'driverId',
    label: 'Driver',
    render: (vehicle) => vehicle.driverId || <span className="text-slate-400">Not Assigned</span>
  },
  {
    key: 'status',
    label: 'Status',
    render: (vehicle) => (
      <div className="flex items-center gap-2">
        {/* Online/Offline Badge - Match filter button colors */}
        {vehicle.onlineStatus === 'online' ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Online
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            Offline
          </span>
        )}

        {/* Trip Status Badge */}
        {vehicle.isVehicleOnTrip && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            On Trip
          </span>
        )}

        {/* Active/Blocked Badge - Colors match filter buttons */}
        {vehicle.blocked ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            Blocked
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            Active
          </span>
        )}
      </div>
    )
  },
  {
    key: 'isVehicleOnTrip',
    label: 'Trip Status',
    render: (vehicle) => (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          vehicle.isVehicleOnTrip
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {vehicle.isVehicleOnTrip ? 'On Trip' : 'Available'}
      </span>
    )
  },
  {
    key: 'ownerName',
    label: 'Owner',
  },
  {
    key: 'city',
    label: 'City',
  }
]

/**
 * Vehicle actions configuration
 */
export const vehicleTableActions = (onBlock) => [
  {
    label: 'Block',
    onClick: onBlock,
    className: 'px-3 py-1 text-xs font-medium text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors',
    visible: (vehicle) => vehicle.status === 'Active'
  },
  {
    label: 'Unblock',
    onClick: onBlock,
    className: 'px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded hover:bg-green-50 transition-colors',
    visible: (vehicle) => vehicle.status !== 'Active'
  }
]
