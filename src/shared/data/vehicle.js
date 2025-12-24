// src/shared/data/vehicle.js

const STORAGE_KEY = 'coco_vehicle_blocked_status'

const baseVehicles = [
  {
    // Basic Information
    id: 'V001',
    vehicleNumber: 'KL-07-AB-1234',
    vehicleName: 'Maruti Dzire',
    brand: 'Maruti Suzuki',
    model: 'Dzire VXI',
    year: 2022,
    cabType: 'SEDAN',
    fuelType: 'Petrol',
    seatCapacity: 4,
    color: 'White',

    // Owner Information
    ownerName: 'Rajesh Kumar',
    ownerPhoto: '/images/owners/owner1.jpg',
    address: '123 MG Road, Kozhikode',
    city: 'Kozhikode',
    state: 'Kerala',
    pincode: '673001',
    mobile1: '9876543210',
    mobile2: '9876543211',

    // Documents & Certificates
    rcImage: '/images/documents/rc_v001.jpg',
    insuranceCopy: '/images/documents/insurance_v001.pdf',
    pollutionCertificateExpiry: '2025-06-15',
    roadTaxValidity: '2026-03-31',
    fitnessCertificate: '/images/documents/fitness_v001.pdf',
    fitnessCertificateExpiry: '2026-12-20',
    permitExpiry: '2026-08-10',
    insuranceExpiry: '2025-09-20',

    // Driver Assignment
    driverId: 'D1001',
    lastAssignedDriver: 'D1001',

    // Vehicle Status & Condition
    isVehicleOnTrip: false,
    vehicleConditionRating: 'Good',
    status: 'Active',

    // Trip & Revenue Analytics
    totalTripsCompleted: 1247,
    tripsInLast7Days: 18,
    tripsInLast30Days: 89,
    totalKmRun: 45230,
    lastTripDateTime: '2025-12-19 18:30:00',
    averageRevenuePerTrip: 450,
    averageDailyRevenueLast30Days: 1340,
    totalRevenueGenerated: 561150,
    cocoEarningsFromVehicle: 84172.5,

    // Platform Information
    dateAddedToPlatform: '2022-01-15',
  },
  {
    // Basic Information
    id: 'V002',
    vehicleNumber: 'KL-07-CD-5678',
    vehicleName: 'Hyundai i20',
    brand: 'Hyundai',
    model: 'i20 Sportz',
    year: 2021,
    cabType: 'HATCHBACK',
    fuelType: 'Diesel',
    seatCapacity: 4,
    color: 'Red',

    // Owner Information
    ownerName: 'Priya Menon',
    ownerPhoto: '/images/owners/owner2.jpg',
    address: '45 Beach Road, Calicut',
    city: 'Calicut',
    state: 'Kerala',
    pincode: '673032',
    mobile1: '9876543220',
    mobile2: '9876543221',

    // Documents & Certificates
    rcImage: '/images/documents/rc_v002.jpg',
    insuranceCopy: '/images/documents/insurance_v002.pdf',
    pollutionCertificateExpiry: '2025-04-10',
    roadTaxValidity: '2026-01-20',
    fitnessCertificate: '/images/documents/fitness_v002.pdf',
    fitnessCertificateExpiry: '2025-11-15',
    permitExpiry: '2026-05-30',
    insuranceExpiry: '2025-07-18',

    // Driver Assignment
    driverId: 'D1002',
    lastAssignedDriver: 'D1002',

    // Vehicle Status & Condition
    isVehicleOnTrip: true,
    vehicleConditionRating: 'Good',
    status: 'Active',

    // Trip & Revenue Analytics
    totalTripsCompleted: 892,
    tripsInLast7Days: 15,
    tripsInLast30Days: 67,
    totalKmRun: 32100,
    lastTripDateTime: '2025-12-20 09:15:00',
    averageRevenuePerTrip: 380,
    averageDailyRevenueLast30Days: 850,
    totalRevenueGenerated: 338960,
    cocoEarningsFromVehicle: 50844,

    // Platform Information
    dateAddedToPlatform: '2022-03-22',
  },
  {
    // Basic Information
    id: 'V003',
    vehicleNumber: 'KL-07-EF-9012',
    vehicleName: 'Toyota Innova Crysta',
    brand: 'Toyota',
    model: 'Innova Crysta GX',
    year: 2023,
    cabType: 'SUV',
    fuelType: 'Diesel',
    seatCapacity: 7,
    color: 'Silver',

    // Owner Information
    ownerName: 'Mohammed Ali',
    ownerPhoto: '/images/owners/owner3.jpg',
    address: '78 Hill View, Malappuram',
    city: 'Malappuram',
    state: 'Kerala',
    pincode: '676505',
    mobile1: '9876543230',
    mobile2: null,

    // Documents & Certificates
    rcImage: '/images/documents/rc_v003.jpg',
    insuranceCopy: '/images/documents/insurance_v003.pdf',
    pollutionCertificateExpiry: '2025-08-25',
    roadTaxValidity: '2027-02-28',
    fitnessCertificate: '/images/documents/fitness_v003.pdf',
    fitnessCertificateExpiry: '2027-10-10',
    permitExpiry: '2027-01-15',
    insuranceExpiry: '2026-03-10',

    // Driver Assignment
    driverId: 'D1003',
    lastAssignedDriver: 'D1003',

    // Vehicle Status & Condition
    isVehicleOnTrip: false,
    vehicleConditionRating: 'Excellent',
    status: 'Active',

    // Trip & Revenue Analytics
    totalTripsCompleted: 456,
    tripsInLast7Days: 12,
    tripsInLast30Days: 52,
    totalKmRun: 18900,
    lastTripDateTime: '2025-12-19 22:45:00',
    averageRevenuePerTrip: 680,
    averageDailyRevenueLast30Days: 1180,
    totalRevenueGenerated: 310080,
    cocoEarningsFromVehicle: 46512,

    // Platform Information
    dateAddedToPlatform: '2023-02-10',
  },
]

// Load blocked status from localStorage
function loadBlockedStatus() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to load blocked status:', error)
    return {}
  }
}

// Save blocked status to localStorage
function saveBlockedStatus(vehicleId, isBlocked) {
  try {
    const blockedStatus = loadBlockedStatus()
    blockedStatus[vehicleId] = isBlocked
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedStatus))
  } catch (error) {
    console.error('Failed to save blocked status:', error)
  }
}

// Get vehicles with current blocked status from localStorage
function getVehiclesWithStatus() {
  const blockedStatus = loadBlockedStatus()
  return baseVehicles.map((vehicle) => ({
    ...vehicle,
    blocked: blockedStatus[vehicle.id] || false,
    onlineStatus: vehicle.isVehicleOnTrip ? 'online' : 'offline',
  }))
}

export function getVehicles() {
  return getVehiclesWithStatus()
}

export function getVehicleByDriverId(driverId) {
  const vehicles = getVehiclesWithStatus()
  return vehicles.find((v) => String(v.driverId) === String(driverId)) || null
}

export function getVehicleByNumber(vehicleNumber) {
  const vehicles = getVehiclesWithStatus()
  return (
    vehicles.find((v) => String(v.vehicleNumber) === String(vehicleNumber)) ||
    null
  )
}

export async function addVehicle(vehicle) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicles = getVehiclesWithStatus()
      if (vehicles.some((v) => v.id === vehicle.id)) {
        reject(new Error(`Vehicle ID ${vehicle.id} already exists`))
      } else if (vehicles.some((v) => v.vehicleNumber === vehicle.vehicleNumber)) {
        reject(new Error(`Vehicle number ${vehicle.vehicleNumber} already exists`))
      } else {
        baseVehicles.push(vehicle)
        resolve(vehicle)
      }
    }, 300)
  })
}

export async function blockVehicle(vehicleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = baseVehicles.find((v) => v.id === vehicleId)
      if (!vehicle) {
        reject(new Error(`Vehicle ID ${vehicleId} not found`))
      } else {
        saveBlockedStatus(vehicleId, true)
        resolve({ ...vehicle, blocked: true })
      }
    }, 300)
  })
}

export async function unblockVehicle(vehicleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = baseVehicles.find((v) => v.id === vehicleId)
      if (!vehicle) {
        reject(new Error(`Vehicle ID ${vehicleId} not found`))
      } else {
        saveBlockedStatus(vehicleId, false)
        resolve({ ...vehicle, blocked: false })
      }
    }, 300)
  })
}
