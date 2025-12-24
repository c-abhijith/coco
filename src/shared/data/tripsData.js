const gmap = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

export const trips = [
  {
    id: 'T10001',
    driverId: 'D1001',
    createdTime: '2025-01-10T09:15:00',
    tripStatus: 'Completed',
    paymentType: 'ONLINE',
    totalFare: 250,
    distanceKm: 12.4,

    // Rider info
    riderName: 'Anand Kumar',
    riderMobile: '9998887771',
    riderEmail: 'anand.kumar@example.com',

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

    // Driver info
    assignedDriver: 'Rahul Das',
    driverMobile: '9847000001',
    cabType: 'SEDAN',
    vehicleNumber: 'KL-07-AB-1234',

    // Rating & misc
    ratingGivenByRider: 5,
    isCarrierRequested: false,
  },
  {
    id: 'T10002',
    driverId: 'D1001',
    createdTime: '2025-01-11T18:40:00',
    tripStatus: 'Completed',
    paymentType: 'CASH',
    totalFare: 220,
    distanceKm: 10.1,

    riderName: 'Bhavana Nair',
    riderMobile: '9998887772',
    riderEmail: 'bhavana.nair@example.com',

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

    assignedDriver: 'Rahul Das',
    driverMobile: '9847000001',
    cabType: 'SEDAN',
    vehicleNumber: 'KL-07-AB-1234',

    ratingGivenByRider: 4,
    isCarrierRequested: false,
  },
  {
    id: 'T20001',
    driverId: 'D1002',
    createdTime: '2025-01-12T21:10:00',
    tripStatus: 'Completed',
    paymentType: 'ONLINE',
    totalFare: 300,
    distanceKm: 15.2,

    riderName: 'Salim Rahman',
    riderMobile: '9998887773',
    riderEmail: 'salim.rahman@example.com',

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

    assignedDriver: 'Sajith Pillai',
    driverMobile: '9847000002',
    cabType: 'HATCHBACK',
    vehicleNumber: 'KL-07-CD-5678',

    ratingGivenByRider: 5,
    isCarrierRequested: false,
  },
  {
    id: 'T30001',
    driverId: 'D1003',
    createdTime: '2025-01-09T07:30:00',
    tripStatus: 'Completed',
    paymentType: 'ONLINE',
    totalFare: 410,
    distanceKm: 20.6,

    riderName: 'Bhavana Nair',
    riderMobile: '9998887772',
    riderEmail: 'bhavana.nair@example.com',

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

    assignedDriver: 'Meera Joseph',
    driverMobile: '9847000003',
    cabType: 'SUV',
    vehicleNumber: 'KL-07-EF-9012',

    ratingGivenByRider: 5,
    isCarrierRequested: true,
  },
]
