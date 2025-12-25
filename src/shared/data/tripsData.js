import { gmap } from '../utils/mapHelpers'

export const trips = [
  {
    id: 'T10001',
    driverId: 'D1001',
    riderId: 'R1001',
    vehicleId: 'V001',
    createdTime: '2025-01-10T09:15:00',
    tripStatus: 'Completed',
    paymentType: 'ONLINE',
    totalFare: 250,
    distanceKm: 12.4,

    // Location info
    pickLocationAddress: 'MG Road, Kochi',
    pickLocationMap: gmap('MG Road, Kochi'),
    dropLocationAddress: 'Infopark Phase 1, Kakkanad',

    // Trip timing
    tripAcceptedTime: '2025-01-10T09:16:30',
    driverArrivalTime: '2025-01-10T09:23:00',
    pickTime: '2025-01-10T09:25:00',
    tripStopTime: '2025-01-10T09:45:00',

    // OTP & trip type
    otp: '4321',
    tripStartOtp: '4321',
    tripEndOtp: null,
    tripType: 'Instant',
    scheduleStatus: null,
    scheduleTime: null,

    // Rating & misc
    ratingGivenByRider: 5,
    isCarrierRequested: false,
  },
  {
    id: 'T10002',
    driverId: 'D1001',
    riderId: 'R1002',
    vehicleId: 'V001',
    createdTime: '2025-01-11T18:40:00',
    tripStatus: 'Completed',
    paymentType: 'CASH',
    totalFare: 220,
    distanceKm: 10.1,

    pickLocationAddress: 'Vytilla Mobility Hub, Kochi',
    pickLocationMap: gmap('Vytilla Mobility Hub, Kochi'),
    dropLocationAddress: 'Lulu Mall, Edappally',

    tripAcceptedTime: '2025-01-11T18:41:10',
    driverArrivalTime: '2025-01-11T18:49:00',
    pickTime: '2025-01-11T18:50:00',
    tripStopTime: '2025-01-11T19:05:00',

    otp: '1188',
    tripStartOtp: '1188',
    tripEndOtp: null,
    tripType: 'Instant',
    scheduleStatus: null,
    scheduleTime: null,

    ratingGivenByRider: 4,
    isCarrierRequested: false,
  },
  {
    id: 'T20001',
    driverId: 'D1002',
    riderId: 'R1003',
    vehicleId: 'V002',
    createdTime: '2025-01-12T21:10:00',
    tripStatus: 'Completed',
    paymentType: 'ONLINE',
    totalFare: 300,
    distanceKm: 15.2,

    pickLocationAddress: 'Edappally, Kochi',
    pickLocationMap: gmap('Edappally, Kochi'),
    dropLocationAddress: 'Fort Kochi, Kochi',

    tripAcceptedTime: '2025-01-12T21:11:30',
    driverArrivalTime: '2025-01-12T21:20:00',
    pickTime: '2025-01-12T21:22:00',
    tripStopTime: '2025-01-12T21:45:00',

    otp: '9090',
    tripStartOtp: '9090',
    tripEndOtp: null,
    tripType: 'Instant',
    scheduleStatus: null,
    scheduleTime: null,

    ratingGivenByRider: 5,
    isCarrierRequested: false,
  },
  {
    id: 'T30001',
    driverId: 'D1003',
    riderId: 'R1002',
    vehicleId: 'V003',
    createdTime: '2025-01-09T07:30:00',
    tripStatus: 'Completed',
    paymentType: 'ONLINE',
    totalFare: 410,
    distanceKm: 20.6,

    pickLocationAddress: 'Tripunithura, Kochi',
    pickLocationMap: gmap('Tripunithura, Kochi'),
    dropLocationAddress: 'Infopark Phase 1, Kakkanad',

    tripAcceptedTime: '2025-01-09T07:31:20',
    driverArrivalTime: '2025-01-09T07:40:00',
    pickTime: '2025-01-09T07:42:00',
    tripStopTime: '2025-01-09T08:05:00',

    otp: '7777',
    tripStartOtp: '7777',
    tripEndOtp: null,
    tripType: 'Instant',
    scheduleStatus: null,
    scheduleTime: null,

    ratingGivenByRider: 5,
    isCarrierRequested: true,
  },
]
