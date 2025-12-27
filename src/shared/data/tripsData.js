import { gmap } from '../utils/mapHelpers'

export const trips = [
  {
    id: 'T10001',
    driverId: 'D1001',
    riderId: 'R1001',
    vehicleId: 'V001',

    createdTime: '2025-01-10T09:15:00',
    tripStatus: 'Completed',
    tripRequestedAt: '2025-01-10T09:15:00',

    paymentType: 'ONLINE',
    totalFare: 250,
    estimatedFare: 240,
    finalFare: 250,
    driverCollectedAmount: 0,

    distanceKm: 12.4,
    estimatedKm: 12.0,

    // Location info
    pickLocationAddress: 'MG Road, Kochi',
    pickLocationMap: gmap('MG Road, Kochi'),
    dropLocationAddress: 'Infopark Phase 1, Kakkanad',
    pickedLocation: 'MG Road, Kochi',
    droppedLocation: 'Infopark Phase 1, Kakkanad',

    // Trip timing
    tripAcceptedTime: '2025-01-10T09:16:30',
    driverArrivalTime: '2025-01-10T09:23:00',
    pickTime: '2025-01-10T09:25:00',
    tripStopTime: '2025-01-10T09:45:00',
    driverAssignedTime: '2025-01-10T09:16:30',
    paymentCompletedTime: '2025-01-10T09:46:00',

    // OTP & trip type
    otp: '4321',
    tripStartOtp: '4321',
    tripEndOtp: null,
    tripType: 'Instant',
    scheduleStatus: null,
    scheduleTime: null,
    scheduledTrip: false,
    multiStop: false,

    // Razorpay
    riderRazorpayTxnId: 'RP_TXN_10001',
    riderRazorpayStatus: 'SUCCESS',
    razorpayTxnAmount: 250,

    // Fees
    riderPickupFee: 0,
    riderWaitingFee: 0,

    // Cancellation
    didCancelTrip: false,
    cancelReason: null,
    cancelTime: null,
    riderCancellationFee: 0,
    driverCancellationFee: 0,
    riderNoShow: false,

    // Driver activity
    noOfDriversInterested: 3,
    noOfDriversReassigned: 0,

    // Rating & misc
    ratingGivenByRider: 5,
    ratingGivenByDriver: 5,
    isCarrierRequested: false,

    // Settlement
    driverReceivedAmount: 220,
    cocoReceivedAmount: 30,
    gstAmount: 12,
    driverSettled: true,
    driverSettledAmount: 220,
    driverSettledWhen: '2025-01-10T10:00:00',

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 250,
      driverGet: 185,
      adminGet: 30,
      vehicleOwnerGet: 35,
      tax: 12,
    },

    // Complaints
    riderComplaintLink: null,
    driverComplaintLink: null,
    complaintIds: ['C001'],

    // Status
    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',
  },

  {
    id: 'T10002',
    driverId: 'D1001',
    riderId: 'R1002',
    vehicleId: 'V001',

    createdTime: '2025-01-11T18:40:00',
    tripStatus: 'Completed',
    tripRequestedAt: '2025-01-11T18:40:00',

    paymentType: 'CASH',
    totalFare: 220,
    estimatedFare: 210,
    finalFare: 220,
    driverCollectedAmount: 220,

    distanceKm: 10.1,
    estimatedKm: 10.0,

    pickLocationAddress: 'Vytilla Mobility Hub, Kochi',
    pickLocationMap: gmap('Vytilla Mobility Hub, Kochi'),
    dropLocationAddress: 'Lulu Mall, Edappally',

    pickedLocation: 'Vytilla Mobility Hub, Kochi',
    droppedLocation: 'Lulu Mall, Edappally',

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
    scheduledTrip: false,
    multiStop: false,

    riderPickupFee: 0,
    riderWaitingFee: 5,

    didCancelTrip: false,
    riderNoShow: false,

    ratingGivenByRider: 4,
    ratingGivenByDriver: 5,
    isCarrierRequested: false,

    driverReceivedAmount: 220,
    cocoReceivedAmount: 0,

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 220,
      driverGet: 180,
      adminGet: 0,
      vehicleOwnerGet: 40,
      tax: 0,
    },

    // Complaints
    complaintIds: [],

    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',
  },
  {
    id: 'T10003',
    driverId: 'D1002',
    riderId: 'R1004',
    vehicleId: 'V002',

    createdTime: '2025-01-13T08:10:00',
    tripRequestedAt: '2025-01-13T08:10:00',
    tripStatus: 'Completed',

    paymentType: 'ONLINE',
    totalFare: 180,
    estimatedFare: 170,
    finalFare: 180,
    driverCollectedAmount: 0,

    distanceKm: 8.6,
    estimatedKm: 8.3,

    pickLocationAddress: 'Kaloor, Kochi',
    pickLocationMap: gmap('Kaloor, Kochi'),
    dropLocationAddress: 'Marine Drive, Kochi',

    pickedLocation: 'Kaloor, Kochi',
    droppedLocation: 'Marine Drive, Kochi',

    tripAcceptedTime: '2025-01-13T08:11:00',
    driverArrivalTime: '2025-01-13T08:18:00',
    pickTime: '2025-01-13T08:19:30',
    tripStopTime: '2025-01-13T08:35:00',

    otp: '3344',
    tripStartOtp: '3344',
    tripEndOtp: null,

    tripType: 'Instant',
    scheduledTrip: false,
    scheduleStatus: null,
    scheduleTime: null,
    multiStop: false,

    riderRazorpayTxnId: 'RP_TXN_10003',
    riderRazorpayStatus: 'SUCCESS',
    razorpayTxnAmount: 180,

    riderPickupFee: 0,
    riderWaitingFee: 0,

    didCancelTrip: false,
    riderNoShow: false,

    noOfDriversInterested: 2,
    noOfDriversReassigned: 0,

    ratingGivenByRider: 5,
    ratingGivenByDriver: 5,
    isCarrierRequested: false,

    driverReceivedAmount: 155,
    cocoReceivedAmount: 25,
    gstAmount: 9,

    driverSettled: true,
    driverSettledAmount: 155,
    driverSettledWhen: '2025-01-13T09:00:00',

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 180,
      driverGet: 130,
      adminGet: 25,
      vehicleOwnerGet: 25,
      tax: 9,
    },

    // Complaints
    complaintIds: ['C002', 'C003'],

    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',
  },

  {
    id: 'T10004',
    driverId: 'D1003',
    riderId: 'R1005',
    vehicleId: 'V003',

    createdTime: '2025-01-14T19:20:00',
    tripRequestedAt: '2025-01-14T19:20:00',
    tripStatus: 'Cancelled',

    paymentType: 'ONLINE',
    totalFare: 0,
    estimatedFare: 260,
    finalFare: 0,
    driverCollectedAmount: 0,

    distanceKm: 0,
    estimatedKm: 14.2,

    pickLocationAddress: 'Aluva Metro Station',
    pickLocationMap: gmap('Aluva Metro Station'),
    dropLocationAddress: 'Infopark Phase 2, Kakkanad',

    pickedLocation: 'Aluva Metro Station',
    droppedLocation: 'Infopark Phase 2, Kakkanad',

    tripAcceptedTime: '2025-01-14T19:22:00',
    driverArrivalTime: null,
    pickTime: null,
    tripStopTime: null,

    otp: '5566',
    tripStartOtp: null,
    tripEndOtp: null,

    tripType: 'Instant',
    scheduledTrip: false,
    multiStop: false,

    didCancelTrip: true,
    cancelReason: 'Rider cancelled before pickup',
    cancelTime: '2025-01-14T19:25:00',
    riderCancellationFee: 20,
    driverCancellationFee: 10,
    riderNoShow: false,

    noOfDriversInterested: 4,
    noOfDriversReassigned: 1,

    ratingGivenByRider: null,
    ratingGivenByDriver: null,
    isCarrierRequested: false,

    driverReceivedAmount: 10,
    cocoReceivedAmount: 10,

    // Amount breakdown (cancelled trip)
    amountBreakdown: {
      tripAmount: 20,
      driverGet: 10,
      adminGet: 10,
      vehicleOwnerGet: 0,
      tax: 0,
    },

    // Complaints
    complaintIds: ['C004'],

    riderStatus: 'Cancelled',
    driverStatus: 'Cancelled',
    vehicleStatus: 'Active',
  },

  {
    id: 'T10005',
    driverId: 'D1001',
    riderId: 'R1006',
    vehicleId: 'V001',

    createdTime: '2025-01-15T06:45:00',
    tripRequestedAt: '2025-01-15T06:45:00',
    tripStatus: 'Completed',

    paymentType: 'CASH',
    totalFare: 320,
    estimatedFare: 300,
    finalFare: 320,
    driverCollectedAmount: 320,

    distanceKm: 18.9,
    estimatedKm: 18.0,

    pickLocationAddress: 'Palarivattom, Kochi',
    pickLocationMap: gmap('Palarivattom, Kochi'),
    dropLocationAddress: 'Cochin Airport (CIAL)',

    pickedLocation: 'Palarivattom, Kochi',
    droppedLocation: 'Cochin Airport (CIAL)',

    tripAcceptedTime: '2025-01-15T06:46:00',
    driverArrivalTime: '2025-01-15T06:55:00',
    pickTime: '2025-01-15T06:57:00',
    tripStopTime: '2025-01-15T07:20:00',

    otp: '8899',
    tripStartOtp: '8899',
    tripEndOtp: null,

    tripType: 'Instant',
    scheduledTrip: false,
    multiStop: false,

    riderPickupFee: 0,
    riderWaitingFee: 10,

    didCancelTrip: false,
    riderNoShow: false,

    ratingGivenByRider: 4,
    ratingGivenByDriver: 5,
    isCarrierRequested: true,

    driverReceivedAmount: 320,
    cocoReceivedAmount: 0,

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 320,
      driverGet: 265,
      adminGet: 0,
      vehicleOwnerGet: 55,
      tax: 0,
    },

    // Complaints
    complaintIds: [],

    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',
  }
]
