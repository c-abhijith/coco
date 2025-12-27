# Reusable Components Guide

This guide explains how to use the reusable components for building management pages (Driver, Vehicle, Rider, etc.) without code duplication.

## Overview

Instead of creating separate hardcoded pages for each entity type, use these configurable components:

1. **EntityManagementLayout** - Main page layout with header and tabs
2. **DataTable** - Configurable data table for listings
3. **ProfileSection** - Configurable profile display
4. **MetricsGridLayout** - Metrics grid display
5. **FilterBar** - Filter controls

## Quick Start Example

### 1. Create Table Configuration

```javascript
// src/features/drivers/config/driverTableConfig.js

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
    key: 'status',
    label: 'Status',
    render: (driver) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        driver.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {driver.status}
      </span>
    )
  }
]
```

### 2. Build Management Page

```javascript
// src/features/drivers/pages/DriverManagementPage.jsx

import { EntityManagementLayout } from '../../../shared/components/EntityManagementLayout'
import { DataTable } from '../../../shared/components/DataTable'
import { MetricsGridLayout } from '../../../shared/components/MetricsGridLayout'
import { ProfileSection } from '../../../shared/components/ProfileSection'
import { driverTableColumns } from '../config/driverTableConfig'
import { drivers } from '../../../shared/data/driversData'

export const DriverManagementPage = () => {
  const [selectedDriver, setSelectedDriver] = useState(drivers[0])

  const tabs = [
    {
      id: 'details',
      label: 'Driver Details',
      content: () => (
        <div className="space-y-6">
          {/* Metrics */}
          <MetricsGridLayout
            metrics={[
              { label: 'Total Drivers', value: drivers.length },
              { label: 'Online Now', value: drivers.filter(d => d.onlineStatus === 'Online').length }
            ]}
            columns={6}
          />

          {/* Profile */}
          <ProfileSection
            title="Driver Profile"
            imageUrl={selectedDriver.profileImage}
            fields={[
              {
                title: 'Basic Information',
                fields: [
                  { label: 'Name', value: selectedDriver.name },
                  { label: 'Mobile', value: selectedDriver.mobile },
                  { label: 'Email', value: selectedDriver.email }
                ]
              }
            ]}
            gridCols={3}
          />
        </div>
      )
    },
    {
      id: 'list',
      label: 'Driver List',
      content: () => (
        <DataTable
          title="All Drivers"
          description="Manage and view all drivers"
          data={drivers}
          columns={driverTableColumns}
          onRowClick={setSelectedDriver}
          showCreateButton
          createButtonLabel="Create Driver"
          onCreateClick={() => navigate('/drivers/create')}
        />
      )
    }
  ]

  return (
    <EntityManagementLayout
      title="Driver Management"
      description="Manage drivers, view performance metrics, and track driver status"
      tabs={tabs}
      defaultTab="details"
    />
  )
}
```

## Component API Reference

### EntityManagementLayout

Main page layout component with header and tabs.

```javascript
<EntityManagementLayout
  title="Page Title"
  description="Page description"
  headerActions={<button>Action</button>} // Optional
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content</div> }
  ]}
  defaultTab="tab1"
/>
```

### DataTable

Configurable table for displaying lists of data.

```javascript
<DataTable
  title="Table Title"
  description="Table description"
  data={[{ id: 1, name: 'Item 1' }]}
  columns={[
    { key: 'name', label: 'Name' },
    {
      key: 'status',
      label: 'Status',
      render: (row, value) => <span>{value}</span>
    }
  ]}
  onRowClick={(row) => console.log(row)}
  showCreateButton
  createButtonLabel="Create New"
  onCreateClick={() => {}}
  actions={[
    {
      label: 'Edit',
      onClick: (row) => {},
      className: 'custom-class',
      visible: (row) => true // Optional
    }
  ]}
  emptyMessage="No data available"
/>
```

### ProfileSection

Display entity profile information.

```javascript
<ProfileSection
  title="Profile Title"
  imageUrl="https://example.com/image.jpg"
  imagePlaceholder="No Image"
  fields={[
    {
      title: 'Section Title', // Optional
      fields: [
        { label: 'Field 1', value: 'Value 1' },
        {
          label: 'Field 2',
          value: 'Value 2',
          render: (value) => <strong>{value}</strong> // Optional
        }
      ]
    }
  ]}
  actions={[
    {
      label: 'Edit',
      onClick: () => {},
      className: 'custom-class'
    }
  ]}
  gridCols={3} // 1-6
/>
```

### MetricsGridLayout

Display metrics in a grid.

```javascript
<MetricsGridLayout
  title="Metrics Title"
  description="Metrics description"
  metrics={[
    { label: 'Total', value: 100 },
    { label: 'Active', value: 75, helperText: '75%' },
    {
      label: 'Clickable',
      value: 50,
      onClick: () => console.log('clicked')
    }
  ]}
  columns={6} // 1-6
  showBorder={false}
/>
```

### FilterBar

Filter controls with pill-style buttons.

```javascript
<FilterBar
  filters={[
    {
      label: 'Status',
      options: [
        { label: 'All', value: 'all', color: 'yellow' },
        { label: 'Active', value: 'active', color: 'green', count: 10 }
      ],
      value: 'all',
      onChange: (value) => setStatus(value)
    },
    {
      label: 'Type',
      options: [
        { label: 'Type A', value: 'a' },
        { label: 'Type B', value: 'b' }
      ],
      value: ['a'],
      onChange: (values) => setTypes(values),
      allowMultiple: true
    }
  ]}
/>
```

## Benefits

✅ **No Code Duplication** - Write configuration, not repetitive code
✅ **Consistent UI** - All management pages look and behave the same
✅ **Easy Maintenance** - Fix bugs once, affects all pages
✅ **Flexible** - Highly configurable for different use cases
✅ **Type Safety** - Clear prop definitions
✅ **Scalable** - Easy to add new entity types

## Migration Guide

### Before (Static/Hardcoded)

```javascript
// 300+ lines of hardcoded JSX
<div className="bg-white rounded-lg border">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Mobile</th>
        // ... many columns
      </tr>
    </thead>
    <tbody>
      {drivers.map(driver => (
        <tr>
          <td>{driver.name}</td>
          <td>{driver.mobile}</td>
          // ... many cells
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### After (Reusable/Configurable)

```javascript
// ~50 lines with configuration
<DataTable
  data={drivers}
  columns={driverTableColumns}
  onRowClick={handleClick}
/>
```

## Tips

1. **Keep configuration separate** - Create `config/` folder for table columns and field definitions
2. **Use render functions** - Customize display without modifying components
3. **Compose components** - Combine multiple components for complex UIs
4. **Share configurations** - Reuse similar configurations across entities
5. **Extend carefully** - Only add new props when truly needed

## Examples

See implementation examples in:
- `src/features/drivers/pages/DriverManagementPage.jsx`
- `src/features/vehicles/pages/VehicleManagementPage.jsx`
- `src/features/drivers/config/driverTableConfig.js`
- `src/features/vehicles/config/vehicleTableConfig.js`
