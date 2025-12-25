# Normalization Error Fix

## Error That Occurred
```
TypeError: Cannot read properties of null (reading 'status')
at driverMetrics.js:6:54
```

## Root Cause

After normalization, the application had two issues:

1. **Driver Lookup Issue**: `metricsService` was importing drivers from `driversData.js` (seed only), but `driverService.getDrivers()` merges seed + localStorage drivers. When looking up drivers by ID, newly added drivers (stored in localStorage) couldn't be found.

2. **Missing Operational Fields**: During normalization, we removed fields that are actually **operational data** (not calculated from trips), such as:
   - `isIdleOnline`
   - `acceptanceRatePct`
   - `cancellationRatePct`
   - `complaintsCount`
   - `noShowCount`

## Solution

### 1. Fixed Driver Lookup
Updated `getDriverWithMetrics()` to accept both driver ID and driver object:

**Before:**
```javascript
export function getDriverWithMetrics(driverId) {
  const driver = drivers.find(d => d.id === driverId)  // Only finds seed drivers
  // ...
}
```

**After:**
```javascript
export function getDriverWithMetrics(driverOrId) {
  const driver = typeof driverOrId === 'string'
    ? drivers.find(d => d.id === driverOrId)
    : driverOrId  // Accept driver object directly
  // ...
}
```

And updated `driverService` to pass driver objects:
```javascript
return driversArray.map(driver => getDriverWithMetrics(driver))  // Pass object, not ID
```

### 2. Re-added Operational Fields

These fields cannot be calculated from current trip data (they require acceptance/rejection/complaint data), so they remain as core operational data in `driversData.js`:

```javascript
// Employment & Status
status: 'Active',
onlineStatus: 'Online',
whenWentOnlineToday: '2025-01-15T07:45:00',
onlineHoursToday: 2.5,

// Performance metrics (not calculable from trips alone)
isIdleOnline: false,
driverUtilizationPct: 78,
acceptanceRatePct: 94,
cancellationRatePct: 6,
noShowCount: 0,
tripsPerOnlineHour: 1.2,

// Complaints & ratings
complaintsCount: 1,
complaintsPer100Trips: 2.5,
lastTripRating: 4.9,
lastTripRating7Days: 4.8,
lastTripRating30Days: 4.7,
```

### 3. Added Derived Field
Added `droveToday` as a calculated field in `metricsService`:
```javascript
droveToday: metrics.tripsToday > 0,
```

## Updated Normalization Approach

### What's Still Normalized ✅
- **Trips**: No duplicate rider/driver/vehicle data (uses IDs only)
- **Trip Metrics**: Calculated from trips (totalTripsCompleted, earnings, etc.)
- **Vehicle Metrics**: Calculated from trips
- **Rider Metrics**: Calculated from trips

### What's Kept as Operational Data
- **Driver Status**: Online/offline, active/inactive
- **Driver Performance**: Acceptance rate, cancellation rate, utilization
- **Complaints**: Count and rate per 100 trips
- **Real-time State**: When went online, hours online today

## Why These Fields Aren't Normalized

These fields require data sources we don't have in the normalized trips table:

| Field | Requires |
|-------|----------|
| `acceptanceRatePct` | Trip offers that were rejected |
| `cancellationRatePct` | Trips cancelled by driver (vs completed) |
| `complaintsCount` | Separate complaints table |
| `noShowCount` | No-show events tracking |
| `isIdleOnline` | Real-time driver state |
| `onlineHoursToday` | Session tracking data |

## Result

✅ **Build Status**: PASSING
✅ **Driver Lookup**: Fixed - works with localStorage drivers
✅ **Component Errors**: Resolved - all fields available
✅ **Normalization**: Maintained for calculable metrics
✅ **Backward Compatibility**: 100%

## Files Modified

1. `src/shared/services/metricsService.js` - Accept driver object
2. `src/shared/services/driverService.js` - Pass driver object
3. `src/shared/data/driversData.js` - Re-added operational fields

## Lessons Learned

**Not Everything Should Be Normalized**

Some fields are genuinely operational/state data and cannot be derived from transactional data. These should remain in the entity table:

- Real-time status (online, idle)
- Session data (hours online today)
- Performance metrics requiring external data (acceptance rate)
- Complaint data (requires separate tracking)

**Hybrid Approach**

The final structure uses a hybrid approach:
- **Normalized**: Trip data, vehicle references, calculated metrics
- **Denormalized**: Operational state, performance metrics, real-time data

This is acceptable and common in real-world applications where some data cannot be calculated from existing tables.
