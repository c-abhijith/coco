/**
 * Maps a single driver record from GET /coco/drivers/ response
 * to the frontend shape expected by all driver components.
 *
 * Fields that the list API doesn't return are set to null.
 * Detailed metrics are fetched separately via GET /coco/drivers/<id>/
 * and merged in DriverManagementPage.
 */

function computeAge(dob) {
  if (!dob) return null
  const d = new Date(dob)
  if (isNaN(d.getTime())) return null
  const diff = Date.now() - d.getTime()
  return Math.abs(new Date(diff).getUTCFullYear() - 1970)
}

// API field  →  frontend field
// ─────────────────────────────────────────────────────────────
// DriverId        id
// Name            name
// MobileNumber    mobile
// EmailId         email
// Status          onlineStatus   (Online / Offline)
// Gender          gender
// DOB             dateOfBirth
// City            city
// Address         address
// OnBoardedOn     onboardedOn
// CreationTime    joiningDate
// LastSeen        lastActiveTime
// FirstSeen       whenWentOnlineToday
// drPhoto / DriverPhotoUrl  profileImage
// EmergencyContactNo        emergencyContact
// SecondaryMob    secondaryMobile
// AadharNumber    aadhaarNumber
// AadharURL       aadhaarLink
// PanNumber       panNumber
// PanUrl          panImageUrl
// DrivingLicNo / LicenseNumber   drivingLicenseNumber
// DrvLicExp       licenseExpiryDate
// DrivLicUrl      licenseImageUrl
// PoliceVerfyStatus  policeVerificationStatus
// CabSelectionOptions  cabType

export function mapApiDriver(d) {
  return {
    // ── Identity ─────────────────────────────────────────────
    id: d.DriverId,
    name: d.Name,
    mobile: d.MobileNumber,
    email: d.EmailId,

    // ── Status ───────────────────────────────────────────────
    onlineStatus: d.Status,       // "Online" | "Offline"
    status: null,                 // Active/Inactive — not in list API

    // ── Profile ──────────────────────────────────────────────
    profileImage: d.drPhoto || d.DriverPhotoUrl || null,
    gender: d.Gender || null,
    dateOfBirth: d.DOB ? d.DOB.split('T')[0] : null,
    driverAge: computeAge(d.DOB),

    // ── Location ─────────────────────────────────────────────
    city: d.City || null,
    address: d.Address || null,
    pinCode: null,

    // ── Vehicle (populated separately via vehicle-details API) ─
    cabType: d.CabSelectionOptions || null,
    vehicleNumber: null,
    vehicleId: null,

    // ── Employment ───────────────────────────────────────────
    joiningDate: d.CreationTime ? d.CreationTime.split('T')[0] : null,
    onboardedOn: d.OnBoardedOn ? d.OnBoardedOn.split('T')[0] : null,

    // ── Activity ─────────────────────────────────────────────
    lastActiveTime: d.LastSeen || null,
    whenWentOnlineToday: d.FirstSeen || null,

    // ── Contact ──────────────────────────────────────────────
    emergencyContact: d.EmergencyContactNo || null,
    secondaryMobile: d.SecondaryMob || null,

    // ── Compliance / KYC ─────────────────────────────────────
    aadhaarNumber: d.AadharNumber || null,
    aadhaarLink: d.AadharURL || null,
    panNumber: d.PanNumber || null,
    panImageUrl: d.PanUrl || null,
    drivingLicenseNumber: d.DrivingLicNo || d.LicenseNumber || null,
    licenseExpiryDate: d.DrvLicExp || null,
    licenseIssuingState: null,
    licenseImageUrl: d.DrivLicUrl || null,
    policeVerificationStatus: d.PoliceVerfyStatus || null,
    backgroundVerificationStatus: null,
    kycStatus: null,
    kycRejectionReason: null,
    docsExpiringNext15Days: 0,
    driversOnWatchlistOrBlocked: false,

    // ── Metrics (null — populated by getDriverMetrics API) ───
    rating: null,
    totalTripsCompleted: null,
    driverUtilizationPct: null,
    droveToday: false,
    isIdleOnline: false,
    onlineNow: d.Status === 'Online',
    tripsToday: null,
    onlineHoursToday: null,
    acceptanceRatePct: null,
    cancellationRatePct: null,
    complaintsPer100Trips: null,
    complaintsCount: null,
    noShowCount: null,
    lastTripRating: null,
    lastTripRating7Days: null,
    lastTripRating30Days: null,
    tripsPerOnlineHour: null,
    totalEarningsLifetime: null,
    earningsLast7Days: null,
    earningsLast30Days: null,
    cashCollectToday: 0,
    cashCollectYesterday: 0,
    cashCollectDayBeforeYesterday: 0,

    // ── Payout (null — not in list API) ──────────────────────
    hasPendingPayout: false,
    lastPayoutDate: null,
    lastPayoutAmount: null,
    payoutMethod: null,
    ifsc: null,
    bankMaskedAccount: null,
    amountPayableNextPayout: null,
    totalPenaltiesCount: null,
    totalPenaltiesAmount: 0,
    totalPenaltiesPaid: 0,
    totalPenaltiesPending: 0,

    // ── Device / app (null — not in list API) ────────────────
    driverAppVersion: null,
    lastGpsHeartbeatUrl: null,
    activeAccount: true,
    loginOtp: null,

    // ── Scheduled trips (null — not in list API) ─────────────
    scheduledToday: 0,
    scheduledTomorrow: 0,
    scheduledDayAfter: 0,
    totalScheduledTripsAccepted: 0,
    upcomingScheduledTrips: 0,
    totalScheduledTripsCancelled: 0,

    remark: null,
    tripIds: [],
    totalRecords: d.TotalRecords || 0,
  }
}
