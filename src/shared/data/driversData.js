// Drivers - Normalized core data only (aggregate metrics calculated from trips)

export const drivers = [
  {
    // Basic identity
    id: 'D1001',
    name: 'Rahul Das',
    gender: 'Male',
    dateOfBirth: '1989-05-10',
    driverAge: 35,
    city: 'Kochi',
    address: 'Flat 2B, MG Road, Kochi',
    pinCode: '682016',
    profileImage: null,

    // Contacts
    mobile: '9847000001',
    secondaryMobile: '9847000009',
    email: 'rahul.das@cococabs.in',
    emergencyContact: 'Anu Das - 9895001122',

    // Vehicle assignment
    vehicleId: 'V001',

    // License
    drivingLicenseNumber: 'KL0720110001234',
    licenseExpiryDate: '2028-03-31',
    licenseIssuingState: 'Kerala',

    // Employment & Status
    joiningDate: '2023-02-01',
    onboardedOn: '2023-02-05',
    status: 'Active',
    onlineStatus: 'Online',
    lastActiveTime: '2025-01-15T10:05:00',
    whenWentOnlineToday: '2025-01-15T07:45:00',
    onlineHoursToday: 2.5,

    // Compliance / KYC
    aadhaarNumber: 'XXXX-XXXX-1234',
    aadhaarLink: 'https://aadhaar.example.com/rahul',
    panNumber: 'ABCDE1234F',
    panImageUrl: null,
    licenseImageUrl: null,
    policeVerificationStatus: 'Completed',
    backgroundVerificationStatus: 'Completed',
    kycStatus: 'Approved',
    kycRejectionReason: '',

    // Payout info
    payoutMethod: 'Bank',
    ifsc: 'KKBK0009123',
    bankMaskedAccount: 'XXXXXXXX1234',

    // Device / app
    driverAppVersion: '2.5.1',
    lastGpsHeartbeatUrl: 'https://maps.google.com/?q=9.9312,76.2673',
    onlineNow: true,
    activeAccount: true,
    loginOtp: '****',

    // Misc
    remark: 'Reliable for corporate morning trips.',
  },

  {
    id: 'D1002',
    name: 'Sajith Pillai',
    gender: 'Male',
    dateOfBirth: '1991-09-22',
    driverAge: 33,
    city: 'Kochi',
    address: 'House 12, Vennala, Kochi',
    pinCode: '682028',
    profileImage: null,

    mobile: '9847000002',
    secondaryMobile: '',
    email: 'sajith.pillai@cococabs.in',
    emergencyContact: 'Father - 9847001111',

    vehicleId: 'V002',

    drivingLicenseNumber: 'KL0720120005678',
    licenseExpiryDate: '2027-11-30',
    licenseIssuingState: 'Kerala',

    joiningDate: '2023-03-10',
    onboardedOn: '2023-03-15',
    status: 'Active',
    onlineStatus: 'Offline',
    lastActiveTime: '2025-01-14T22:05:00',
    whenWentOnlineToday: null,
    onlineHoursToday: 0,

    aadhaarNumber: 'XXXX-XXXX-5678',
    aadhaarLink: '',
    panNumber: 'PQRSX5678Z',
    panImageUrl: null,
    licenseImageUrl: null,
    policeVerificationStatus: 'Pending',
    backgroundVerificationStatus: 'In Progress',
    kycStatus: 'Pending',
    kycRejectionReason: '',

    payoutMethod: 'UPI',
    ifsc: 'HDFC0001234',
    bankMaskedAccount: 'XXXXXXXX9988',

    driverAppVersion: '2.5.0',
    lastGpsHeartbeatUrl: null,
    onlineNow: false,
    activeAccount: true,
    loginOtp: '****',

    remark: 'Needs follow-up on police verification.',
  },

  {
    id: 'D1003',
    name: 'Meera Joseph',
    gender: 'Female',
    dateOfBirth: '1993-01-15',
    driverAge: 32,
    city: 'Kochi',
    address: 'Villa 9, Kakkanad, Kochi',
    pinCode: '682030',
    profileImage: null,

    mobile: '9847000003',
    secondaryMobile: '',
    email: 'meera.joseph@cococabs.in',
    emergencyContact: 'Mother - 9847002222',

    vehicleId: 'V003',

    drivingLicenseNumber: 'KL0720130009012',
    licenseExpiryDate: '2029-01-31',
    licenseIssuingState: 'Kerala',

    joiningDate: '2023-06-01',
    onboardedOn: '2023-06-03',
    status: 'Active',
    onlineStatus: 'Online',
    lastActiveTime: '2025-01-15T09:55:00',
    whenWentOnlineToday: '2025-01-15T06:30:00',
    onlineHoursToday: 3.2,

    aadhaarNumber: 'XXXX-XXXX-9012',
    aadhaarLink: '',
    panNumber: 'LMNOP9012Q',
    panImageUrl: null,
    licenseImageUrl: null,
    policeVerificationStatus: 'Completed',
    backgroundVerificationStatus: 'Completed',
    kycStatus: 'Approved',
    kycRejectionReason: '',

    payoutMethod: 'Bank',
    ifsc: 'SBI0004567',
    bankMaskedAccount: 'XXXXXXXX7766',

    driverAppVersion: '2.5.1',
    lastGpsHeartbeatUrl: 'https://maps.google.com/?q=9.9825,76.2999',
    onlineNow: true,
    activeAccount: true,
    loginOtp: '****',

    remark: 'Top-rated SUV driver.',
  },

  {
    id: 'D1004',
    name: 'ABHIJITH CHANDRANPILLAI',
    gender: 'Male',
    dateOfBirth: '1999-02-09',
    driverAge: 26,
    city: 'fsdf',
    address: 'fasdfasd',
    pinCode: '3453453',
    profileImage: null,

    mobile: '1234567890',
    secondaryMobile: '1234567890',
    email: 'abhijithabhipgmr@gamil.com',
    emergencyContact: '1234567890',

    vehicleId: null,

    drivingLicenseNumber: '1234rtyhui90-',
    licenseExpiryDate: '2028-06-06',
    licenseIssuingState: 'Kerala',

    joiningDate: '2025-12-02',
    onboardedOn: '2026-01-22',
    status: 'Active',
    onlineStatus: 'Online',
    lastActiveTime: '',
    whenWentOnlineToday: '',
    onlineHoursToday: 0,

    aadhaarNumber: '',
    aadhaarLink: '',
    panNumber: '',
    panImageUrl: null,
    licenseImageUrl: null,
    policeVerificationStatus: 'Pending',
    backgroundVerificationStatus: 'Pending',
    kycStatus: 'Pending',
    kycRejectionReason: '',

    payoutMethod: 'Bank',
    ifsc: '',
    bankMaskedAccount: '',

    driverAppVersion: '',
    lastGpsHeartbeatUrl: null,
    onlineNow: true,
    activeAccount: true,
    loginOtp: '****',

    remark: 'afjdsjhfkljasdklfj',
  },
]
