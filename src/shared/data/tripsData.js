import { gmap } from '../utils/mapHelpers'

export const trips = [
  {
    // Basic trip identity
    id: 'T10001',
    driverId: 'D1001',
    riderId: 'R1001',
    vehicleId: 'V001',
    riderName: 'Anand Kumar',
    driverName: 'Rahul Das',
    vehicleNo: 'KL-07-AB-1234',

    // Trip status & timing
    tripStatus: 'Completed',
    tripRequestedAt: '2025-01-10T09:15:00',
    createdTime: '2025-01-10T09:15:00',
    tripAcceptedTime: '2025-01-10T09:16:30',
    driverAssignedTime: '2025-01-10T09:16:30',
    driverArrivalTime: '2025-01-10T09:23:00',
    pickTime: '2025-01-10T09:25:00',
    tripStopTime: '2025-01-10T09:45:00',
    paymentCompletedTime: '2025-01-10T09:46:00',

    // Payment details
    paymentType: 'ONLINE',
    estimatedFare: 240,
    finalFare: 250,
    totalFare: 250,
    driverCollectedAmount: 0,

    // Distance & pricing
    estimatedKm: 12.0,
    distanceKm: 12.4,

    // Location details
    pickLocationAddress: 'MG Road, Kochi',
    pickLocationMap: gmap('MG Road, Kochi'),
    dropLocationAddress: 'Infopark Phase 1, Kakkanad',
    pickedLocation: 'MG Road, Kochi',
    droppedLocation: 'Infopark Phase 1, Kakkanad',
    pickHubDetails: 'MG Road Hub - Zone A',
    dropHubDetails: 'Infopark Hub - Zone B',

    // Trip type & scheduling
    tripType: 'Instant',
    scheduledTrip: false,
    scheduledBookingDate: 'N/A',
    scheduleStatus: 'N/A',
    scheduleTime: 'N/A',
    multiStop: false,

    // OTP verification
    otp: '4321',
    tripStartOtp: '4321',
    tripEndOtp: '4322',
    tripStopOtp: '4323',

    // Rider payment gateway
    riderRazorpayTxnId: 'RP_TXN_10001',
    riderRazorpayStatus: 'SUCCESS',
    razorpayTxnAmount: 250,

    // Driver payment gateway
    driverRazorpayTxnId: 'RP_DRV_TXN_10001',
    driverRazorpayStatus: 'SETTLED',

    // Fees & charges
    riderPickupFee: 0,
    riderWaitingFee: 0,
    riderAwaitingFee: 0,
    riderAdvance: 0,
    driverAdvance: 0,
    driverLateArrivalFee: 0,

    // Cancellation info
    didCancelTrip: false,
    cancelReason: 'N/A',
    cancelTime: 'N/A',
    tripStatusDuringCancel: 'N/A',
    riderCancellationFee: 0,
    driverCancellationFee: 0,
    riderNoShow: false,

    // Driver assignment metrics
    noOfDriversInterested: 3,
    noOfDriversReassigned: 0,

    // Ratings
    ratingGivenByRider: 5,
    ratingGivenByDriver: 5,

    // Miscellaneous
    isCarrierRequested: false,
    bookedVia: 'Playstore',

    // Vehicle type
    cabTypeRequested: 'Sedan',
    cabTypeArrived: 'Sedan',

    // Settlement & financial breakdown
    driverReceivedAmount: 220,
    cocoReceivedAmount: 30,
    gstAmount: 12,
    driverSettled: true,
    driverSettledAmount: 220,
    driverSettledWhen: '2025-01-10T10:00:00',
    driverAdjustmentAmount: 0,
    driverAdjustedAt: 'N/A',
    driverAdjustedTrip: false,
    riderSettlementAdjustmentAmount: 0,

    // Refund details
    triggerRefund: false,
    riderRefundedAmount: 0,
    driverRefundedAmount: 0,

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 250,
      driverGet: 185,
      adminGet: 30,
      vehicleOwnerGet: 35,
      tax: 12,
    },

    // Complaints & links
    riderComplaintLink: '/complaints/C001',
    driverComplaintLink: 'N/A',
    complaintIds: ['C001'],

    // Entity status
    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',

    // Aggregate statistics (calculated fields)
    totalTrips: 5,
    completedTrips: 4,
    cancelledTrips: 1,
    riderCancelledTrips: 1,
    noShowTrips: 0,
    tripCompletionRate: 80,
    cancellationRate: 20,
  },

  {
    // Basic trip identity
    id: 'T10002',
    driverId: 'D1001',
    riderId: 'R1002',
    vehicleId: 'V001',
    riderName: 'Bhavana Nair',
    driverName: 'Rahul Das',
    vehicleNo: 'KL-07-AB-1234',

    // Trip status & timing
    tripStatus: 'Completed',
    tripRequestedAt: '2025-01-11T18:40:00',
    createdTime: '2025-01-11T18:40:00',
    tripAcceptedTime: '2025-01-11T18:41:10',
    driverAssignedTime: '2025-01-11T18:41:10',
    driverArrivalTime: '2025-01-11T18:49:00',
    pickTime: '2025-01-11T18:50:00',
    tripStopTime: '2025-01-11T19:05:00',
    paymentCompletedTime: '2025-01-11T19:06:00',

    // Payment details
    paymentType: 'CASH',
    estimatedFare: 210,
    finalFare: 220,
    totalFare: 220,
    driverCollectedAmount: 220,

    // Distance & pricing
    estimatedKm: 10.0,
    distanceKm: 10.1,

    // Location details
    pickLocationAddress: 'Vytilla Mobility Hub, Kochi',
    pickLocationMap: gmap('Vytilla Mobility Hub, Kochi'),
    dropLocationAddress: 'Lulu Mall, Edappally',
    pickedLocation: 'Vytilla Mobility Hub, Kochi',
    droppedLocation: 'Lulu Mall, Edappally',
    pickHubDetails: 'Vytilla Hub - Zone C',
    dropHubDetails: 'Lulu Mall Hub - Zone D',

    // Trip type & scheduling
    tripType: 'Instant',
    scheduledTrip: false,
    scheduledBookingDate: 'N/A',
    scheduleStatus: 'N/A',
    scheduleTime: 'N/A',
    multiStop: false,

    // OTP verification
    otp: '1188',
    tripStartOtp: '1188',
    tripEndOtp: '1189',
    tripStopOtp: '1190',

    // Rider payment gateway
    riderRazorpayTxnId: 'N/A',
    riderRazorpayStatus: 'N/A',
    razorpayTxnAmount: 0,

    // Driver payment gateway
    driverRazorpayTxnId: 'N/A',
    driverRazorpayStatus: 'N/A',

    // Fees & charges
    riderPickupFee: 0,
    riderWaitingFee: 5,
    riderAwaitingFee: 5,
    riderAdvance: 0,
    driverAdvance: 0,
    driverLateArrivalFee: 0,

    // Cancellation info
    didCancelTrip: false,
    cancelReason: 'N/A',
    cancelTime: 'N/A',
    tripStatusDuringCancel: 'N/A',
    riderCancellationFee: 0,
    driverCancellationFee: 0,
    riderNoShow: false,

    // Driver assignment metrics
    noOfDriversInterested: 2,
    noOfDriversReassigned: 0,

    // Ratings
    ratingGivenByRider: 4,
    ratingGivenByDriver: 5,

    // Miscellaneous
    isCarrierRequested: false,
    bookedVia: 'Appstore',

    // Vehicle type
    cabTypeRequested: 'Sedan',
    cabTypeArrived: 'Sedan',

    // Settlement & financial breakdown
    driverReceivedAmount: 220,
    cocoReceivedAmount: 0,
    gstAmount: 0,
    driverSettled: true,
    driverSettledAmount: 220,
    driverSettledWhen: '2025-01-11T19:30:00',
    driverAdjustmentAmount: 0,
    driverAdjustedAt: 'N/A',
    driverAdjustedTrip: false,
    riderSettlementAdjustmentAmount: 0,

    // Refund details
    triggerRefund: false,
    riderRefundedAmount: 0,
    driverRefundedAmount: 0,

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 220,
      driverGet: 180,
      adminGet: 0,
      vehicleOwnerGet: 40,
      tax: 0,
    },

    // Complaints & links
    riderComplaintLink: 'N/A',
    driverComplaintLink: 'N/A',
    complaintIds: [],

    // Entity status
    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',

    // Aggregate statistics (calculated fields)
    totalTrips: 3,
    completedTrips: 3,
    cancelledTrips: 0,
    riderCancelledTrips: 0,
    noShowTrips: 0,
    tripCompletionRate: 100,
    cancellationRate: 0,
  },
  {
    // Basic trip identity
    id: 'T10003',
    driverId: 'D1002',
    riderId: 'R1004',
    vehicleId: 'V002',
    riderName: 'Divya Menon',
    driverName: 'Sajith Pillai',
    vehicleNo: 'KL-07-CD-5678',

    // Trip status & timing
    tripStatus: 'Completed',
    tripRequestedAt: '2025-01-13T08:10:00',
    createdTime: '2025-01-13T08:10:00',
    tripAcceptedTime: '2025-01-13T08:11:00',
    driverAssignedTime: '2025-01-13T08:11:00',
    driverArrivalTime: '2025-01-13T08:18:00',
    pickTime: '2025-01-13T08:19:30',
    tripStopTime: '2025-01-13T08:35:00',
    paymentCompletedTime: '2025-01-13T08:36:00',

    // Payment details
    paymentType: 'ONLINE',
    estimatedFare: 170,
    finalFare: 180,
    totalFare: 180,
    driverCollectedAmount: 0,

    // Distance & pricing
    estimatedKm: 8.3,
    distanceKm: 8.6,

    // Location details
    pickLocationAddress: 'Kaloor, Kochi',
    pickLocationMap: gmap('Kaloor, Kochi'),
    dropLocationAddress: 'Marine Drive, Kochi',
    pickedLocation: 'Kaloor, Kochi',
    droppedLocation: 'Marine Drive, Kochi',
    pickHubDetails: 'Kaloor Hub - Zone E',
    dropHubDetails: 'Marine Drive Hub - Zone F',

    // Trip type & scheduling
    tripType: 'Instant',
    scheduledTrip: false,
    scheduledBookingDate: 'N/A',
    scheduleStatus: 'N/A',
    scheduleTime: 'N/A',
    multiStop: false,

    // OTP verification
    otp: '3344',
    tripStartOtp: '3344',
    tripEndOtp: '3345',
    tripStopOtp: '3346',

    // Rider payment gateway
    riderRazorpayTxnId: 'RP_TXN_10003',
    riderRazorpayStatus: 'SUCCESS',
    razorpayTxnAmount: 180,

    // Driver payment gateway
    driverRazorpayTxnId: 'N/A',
    driverRazorpayStatus: 'N/A',

    // Fees & charges
    riderPickupFee: 0,
    riderWaitingFee: 0,
    riderAwaitingFee: 0,
    riderAdvance: 0,
    driverAdvance: 0,
    driverLateArrivalFee: 0,

    // Cancellation info
    didCancelTrip: false,
    cancelReason: 'N/A',
    cancelTime: 'N/A',
    tripStatusDuringCancel: 'N/A',
    riderCancellationFee: 0,
    driverCancellationFee: 0,
    riderNoShow: false,

    // Driver assignment metrics
    noOfDriversInterested: 2,
    noOfDriversReassigned: 0,

    // Ratings
    ratingGivenByRider: 5,
    ratingGivenByDriver: 5,

    // Miscellaneous
    isCarrierRequested: false,
    bookedVia: 'Playstore',

    // Vehicle type
    cabTypeRequested: 'Hatchback',
    cabTypeArrived: 'Hatchback',

    // Settlement & financial breakdown
    driverReceivedAmount: 155,
    cocoReceivedAmount: 25,
    gstAmount: 9,
    driverSettled: true,
    driverSettledAmount: 155,
    driverSettledWhen: '2025-01-13T09:00:00',
    driverAdjustmentAmount: 0,
    driverAdjustedAt: 'N/A',
    driverAdjustedTrip: false,
    riderSettlementAdjustmentAmount: 0,

    // Refund details
    triggerRefund: false,
    riderRefundedAmount: 0,
    driverRefundedAmount: 0,

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 180,
      driverGet: 130,
      adminGet: 25,
      vehicleOwnerGet: 25,
      tax: 9,
    },

    // Complaints & links
    riderComplaintLink: '/complaints/C002',
    driverComplaintLink: '/complaints/C003',
    complaintIds: ['C002', 'C003'],

    // Entity status
    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',

    // Aggregate statistics (calculated fields)
    totalTrips: 6,
    completedTrips: 5,
    cancelledTrips: 1,
    riderCancelledTrips: 0,
    noShowTrips: 1,
    tripCompletionRate: 83,
    cancellationRate: 17,
  },

  {
    // Basic trip identity
    id: 'T10004',
    driverId: 'D1003',
    riderId: 'R1005',
    vehicleId: 'V003',
    riderName: 'Arjun Pillai',
    driverName: 'Meera Joseph',
    vehicleNo: 'KL-07-EF-9012',

    // Trip status & timing
    tripStatus: 'Cancelled',
    tripRequestedAt: '2025-01-14T19:20:00',
    createdTime: '2025-01-14T19:20:00',
    tripAcceptedTime: '2025-01-14T19:22:00',
    driverAssignedTime: '2025-01-14T19:22:00',
    driverArrivalTime: 'N/A',
    pickTime: 'N/A',
    tripStopTime: 'N/A',
    paymentCompletedTime: 'N/A',

    // Payment details
    paymentType: 'ONLINE',
    estimatedFare: 260,
    finalFare: 0,
    totalFare: 0,
    driverCollectedAmount: 0,

    // Distance & pricing
    estimatedKm: 14.2,
    distanceKm: 0,

    // Location details
    pickLocationAddress: 'Aluva Metro Station',
    pickLocationMap: gmap('Aluva Metro Station'),
    dropLocationAddress: 'Infopark Phase 2, Kakkanad',
    pickedLocation: 'Aluva Metro Station',
    droppedLocation: 'Infopark Phase 2, Kakkanad',
    pickHubDetails: 'Aluva Hub - Zone G',
    dropHubDetails: 'Infopark Phase 2 Hub - Zone H',

    // Trip type & scheduling
    tripType: 'Instant',
    scheduledTrip: false,
    scheduledBookingDate: 'N/A',
    scheduleStatus: 'N/A',
    scheduleTime: 'N/A',
    multiStop: false,

    // OTP verification
    otp: '5566',
    tripStartOtp: 'N/A',
    tripEndOtp: 'N/A',
    tripStopOtp: 'N/A',

    // Rider payment gateway
    riderRazorpayTxnId: 'RP_TXN_10004',
    riderRazorpayStatus: 'REFUNDED',
    razorpayTxnAmount: 20,

    // Driver payment gateway
    driverRazorpayTxnId: 'N/A',
    driverRazorpayStatus: 'N/A',

    // Fees & charges
    riderPickupFee: 0,
    riderWaitingFee: 0,
    riderAwaitingFee: 0,
    riderAdvance: 0,
    driverAdvance: 0,
    driverLateArrivalFee: 0,

    // Cancellation info
    didCancelTrip: true,
    cancelReason: 'Rider cancelled before pickup',
    cancelTime: '2025-01-14T19:25:00',
    tripStatusDuringCancel: 'Driver Assigned',
    riderCancellationFee: 20,
    driverCancellationFee: 10,
    riderNoShow: false,

    // Driver assignment metrics
    noOfDriversInterested: 4,
    noOfDriversReassigned: 1,

    // Ratings
    ratingGivenByRider: 0,
    ratingGivenByDriver: 0,

    // Miscellaneous
    isCarrierRequested: false,
    bookedVia: 'Appstore',

    // Vehicle type
    cabTypeRequested: 'SUV',
    cabTypeArrived: 'N/A',

    // Settlement & financial breakdown
    driverReceivedAmount: 10,
    cocoReceivedAmount: 10,
    gstAmount: 0,
    driverSettled: false,
    driverSettledAmount: 0,
    driverSettledWhen: 'N/A',
    driverAdjustmentAmount: 0,
    driverAdjustedAt: 'N/A',
    driverAdjustedTrip: false,
    riderSettlementAdjustmentAmount: 0,

    // Refund details
    triggerRefund: true,
    riderRefundedAmount: 240,
    driverRefundedAmount: 0,

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 20,
      driverGet: 10,
      adminGet: 10,
      vehicleOwnerGet: 0,
      tax: 0,
    },

    // Complaints & links
    riderComplaintLink: '/complaints/C004',
    driverComplaintLink: null,
    complaintIds: ['C004'],

    // Entity status
    riderStatus: 'Cancelled',
    driverStatus: 'Cancelled',
    vehicleStatus: 'Active',

    // Aggregate statistics (calculated fields)
    totalTrips: 2,
    completedTrips: 1,
    cancelledTrips: 1,
    riderCancelledTrips: 1,
    noShowTrips: 0,
    tripCompletionRate: 50,
    cancellationRate: 50,
  },

  {
    // Basic trip identity
    id: 'T10005',
    driverId: 'D1001',
    riderId: 'R1006',
    vehicleId: 'V001',
    riderName: 'Priya Sharma',
    driverName: 'Rahul Das',
    vehicleNo: 'KL-07-AB-1234',

    // Trip status & timing
    tripStatus: 'Completed',
    tripRequestedAt: '2025-01-15T06:45:00',
    createdTime: '2025-01-15T06:45:00',
    tripAcceptedTime: '2025-01-15T06:46:00',
    driverAssignedTime: '2025-01-15T06:46:00',
    driverArrivalTime: '2025-01-15T06:55:00',
    pickTime: '2025-01-15T06:57:00',
    tripStopTime: '2025-01-15T07:20:00',
    paymentCompletedTime: '2025-01-15T07:21:00',

    // Payment details
    paymentType: 'CASH',
    estimatedFare: 300,
    finalFare: 320,
    totalFare: 320,
    driverCollectedAmount: 320,

    // Distance & pricing
    estimatedKm: 18.0,
    distanceKm: 18.9,

    // Location details
    pickLocationAddress: 'Palarivattom, Kochi',
    pickLocationMap: gmap('Palarivattom, Kochi'),
    dropLocationAddress: 'Cochin Airport (CIAL)',
    pickedLocation: 'Palarivattom, Kochi',
    droppedLocation: 'Cochin Airport (CIAL)',
    pickHubDetails: 'Palarivattom Hub - Zone I',
    dropHubDetails: 'Airport Hub - Zone J',

    // Trip type & scheduling
    tripType: 'Instant',
    scheduledTrip: false,
    scheduledBookingDate: 'N/A',
    scheduleStatus: 'N/A',
    scheduleTime: 'N/A',
    multiStop: false,

    // OTP verification
    otp: '8899',
    tripStartOtp: '8899',
    tripEndOtp: '8900',
    tripStopOtp: '8901',

    // Rider payment gateway
    riderRazorpayTxnId: 'N/A',
    riderRazorpayStatus: 'N/A',
    razorpayTxnAmount: 0,

    // Driver payment gateway
    driverRazorpayTxnId: 'N/A',
    driverRazorpayStatus: 'N/A',

    // Fees & charges
    riderPickupFee: 0,
    riderWaitingFee: 10,
    riderAwaitingFee: 10,
    riderAdvance: 0,
    driverAdvance: 0,
    driverLateArrivalFee: 0,

    // Cancellation info
    didCancelTrip: false,
    cancelReason: 'N/A',
    cancelTime: 'N/A',
    tripStatusDuringCancel: 'N/A',
    riderCancellationFee: 0,
    driverCancellationFee: 0,
    riderNoShow: false,

    // Driver assignment metrics
    noOfDriversInterested: 1,
    noOfDriversReassigned: 0,

    // Ratings
    ratingGivenByRider: 4,
    ratingGivenByDriver: 5,

    // Miscellaneous
    isCarrierRequested: true,
    bookedVia: 'Playstore',

    // Vehicle type
    cabTypeRequested: 'Sedan',
    cabTypeArrived: 'Sedan',

    // Settlement & financial breakdown
    driverReceivedAmount: 320,
    cocoReceivedAmount: 0,
    gstAmount: 0,
    driverSettled: true,
    driverSettledAmount: 320,
    driverSettledWhen: '2025-01-15T08:00:00',
    driverAdjustmentAmount: 0,
    driverAdjustedAt: 'N/A',
    driverAdjustedTrip: false,
    riderSettlementAdjustmentAmount: 0,

    // Refund details
    triggerRefund: false,
    riderRefundedAmount: 0,
    driverRefundedAmount: 0,

    // Amount breakdown
    amountBreakdown: {
      tripAmount: 320,
      driverGet: 265,
      adminGet: 0,
      vehicleOwnerGet: 55,
      tax: 0,
    },

    // Complaints & links
    riderComplaintLink: 'N/A',
    driverComplaintLink: 'N/A',
    complaintIds: [],

    // Entity status
    riderStatus: 'Completed',
    driverStatus: 'Completed',
    vehicleStatus: 'Active',

    // Aggregate statistics (calculated fields)
    totalTrips: 8,
    completedTrips: 7,
    cancelledTrips: 1,
    riderCancelledTrips: 0,
    noShowTrips: 0,
    tripCompletionRate: 88,
    cancellationRate: 12,
  }
]
