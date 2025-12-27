/**
 * Driver Table Configuration
 * Configuration for driver data table columns and rendering
 */

export const driverTableColumns = [
  {
    key: 'name',
    label: 'Driver Name',
    render: (driver) => (
      <div>
        <div className="font-medium">{driver.name}</div>
        <div className="text-xs text-slate-500">{driver.id}</div>
      </div>
    )
  },
  {
    key: 'mobile',
    label: 'Mobile',
  },
  {
    key: 'vehicleId',
    label: 'Vehicle',
    render: (driver) => driver.vehicleId || <span className="text-slate-400">Not Assigned</span>
  },
  {
    key: 'onlineStatus',
    label: 'Status',
    render: (driver) => (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          driver.onlineStatus === 'Online'
            ? 'bg-green-100 text-green-700'
            : 'bg-slate-100 text-slate-700'
        }`}
      >
        {driver.onlineStatus}
      </span>
    )
  },
  {
    key: 'status',
    label: 'Account',
    render: (driver) => (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          driver.status === 'Active'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {driver.status}
      </span>
    )
  },
  {
    key: 'city',
    label: 'City',
  },
  {
    key: 'joiningDate',
    label: 'Joined',
    render: (driver) => new Date(driver.joiningDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
]

/**
 * Driver actions configuration
 */
export const driverTableActions = (onBlock) => [
  {
    label: 'Block',
    onClick: onBlock,
    className: 'px-3 py-1 text-xs font-medium text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors',
    visible: (driver) => driver.status === 'Active'
  },
  {
    label: 'Unblock',
    onClick: onBlock,
    className: 'px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded hover:bg-green-50 transition-colors',
    visible: (driver) => driver.status !== 'Active'
  }
]
