import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDriver, getDrivers } from '../../../shared/data/driver'
import { showError, showSuccess, showToast } from '../../../shared/utils/alerts'

function calcAge(dob) {
  if (!dob) return null
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return null
  const diff = Date.now() - d.getTime()
  const ageDt = new Date(diff)
  return Math.abs(ageDt.getUTCFullYear() - 1970)
}

function isEmail(v) {
  if (!v) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function CreateDriverPage() {
  const navigate = useNavigate()
  const existingIds = useMemo(() => new Set(getDrivers().map((d) => d.id)), [])

  const [form, setForm] = useState({
    // Basic
    id: '',
    name: '',
    gender: 'Male',
    dateOfBirth: '',
    city: '',
    address: '',
    pinCode: '',
    profileImage: '', // URL like /images/drivers/D1004.jpg

    // Contacts
    mobile: '',
    secondaryMobile: '',
    email: '',
    emergencyContact: '',

    // License (vehicle details not required at creation)
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    licenseIssuingState: 'Kerala',

    // Employment
    joiningDate: '',
    onboardedOn: '',
    status: 'Active',
    onlineStatus: 'Offline',

    // Remark
    remark: '',
  })

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const id = form.id.trim()
    const name = form.name.trim()
    const mobile = form.mobile.trim()

    // ✅ Validation (required fields only)
    if (!id || !name || !mobile) {
      showError('Required Fields Missing', 'Please fill Driver ID, Name, and Mobile.')
      return
    }
    if (existingIds.has(id)) {
      showError('Duplicate Driver ID', `Driver ID already exists: ${id}`)
      return
    }
    if (!form.drivingLicenseNumber.trim()) {
      showError('License Required', 'Please fill Driving License Number.')
      return
    }
    if (!form.licenseExpiryDate) {
      showError('Date Required', 'Please select License Expiry Date.')
      return
    }
    if (!form.joiningDate) {
      showError('Date Required', 'Please select Joining Date.')
      return
    }
    if (form.email.trim() && !isEmail(form.email.trim())) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }

    // ✅ Create driver record in the SAME SHAPE as driversData.js
    const newDriver = {
      // Basic identity
      id,
      name,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth || '',
      driverAge: calcAge(form.dateOfBirth),
      city: form.city || '',
      address: form.address || '',
      pinCode: form.pinCode || '',
      profileImage: form.profileImage?.trim() ? form.profileImage.trim() : null,

      // Contacts
      mobile,
      secondaryMobile: form.secondaryMobile || '',
      email: form.email || '',
      emergencyContact: form.emergencyContact || '',

      // Vehicle / cab (to be assigned later)
      cabType: '',
      vehicleNumber: '',
      drivingLicenseNumber: form.drivingLicenseNumber || '',
      licenseExpiryDate: form.licenseExpiryDate || '',
      licenseIssuingState: form.licenseIssuingState || '',

      // Employment
      joiningDate: form.joiningDate || '',
      onboardedOn: form.onboardedOn || '',
      status: form.status,
      onlineStatus: form.onlineStatus,
      lastActiveTime: '',
      whenWentOnlineToday: '',
      onlineHoursToday: 0,

      // Ratings & complaints
      rating: 0,
      lastTripRating: 0,
      lastTripRating7Days: 0,
      lastTripRating30Days: 0,
      complaintsCount: 0,
      complaintsPer100Trips: 0,

      // Trips & utilisation
      totalTripsCompleted: 0,
      tripsToday: 0,
      tripsLast7Days: 0,
      tripsLast30Days: 0,
      droveToday: false,
      isIdleOnline: false,
      driverUtilizationPct: 0,
      acceptanceRatePct: 0,
      cancellationRatePct: 0,
      noShowCount: 0,
      tripsPerOnlineHour: 0,
      averageTripsPerDriver: null,

      // Earnings + cash
      totalEarningsLifetime: 0,
      earningsLast7Days: 0,
      earningsLast30Days: 0,
      cashCollectToday: 0,
      cashCollectYesterday: 0,
      cashCollectDayBeforeYesterday: 0,

      // Payout & penalties
      hasPendingPayout: false,
      lastPayoutDate: '',
      lastPayoutAmount: 0,
      payoutMethod: 'Bank',
      ifsc: '',
      bankMaskedAccount: '',
      amountPayableNextPayout: 0,
      totalPenaltiesCount: 0,
      totalPenaltiesAmount: 0,
      totalPenaltiesPaid: 0,
      totalPenaltiesPending: 0,

      // Compliance / KYC
      aadhaarNumber: '',
      aadhaarLink: '',
      panNumber: '',
      panImageUrl: null,
      licenseImageUrl: null,
      policeVerificationStatus: 'Pending',
      backgroundVerificationStatus: 'Pending',
      kycStatus: 'Pending',
      kycRejectionReason: '',
      driversOnWatchlistOrBlocked: false,

      // Device / app / GPS
      driverAppVersion: '',
      lastGpsHeartbeatUrl: null,
      onlineNow: form.onlineStatus === 'Online',
      activeAccount: true,
      loginOtp: '****',

      // Docs / misc
      docsExpiringNext15Days: 0,
      remark: form.remark || '',

      // Scheduled trips
      scheduledToday: 0,
      scheduledTomorrow: 0,
      scheduledDayAfter: 0,
      totalScheduledTripsAccepted: 0,
      upcomingScheduledTrips: 0,
      totalScheduledTripsCancelled: 0,

      // Aggregation helpers
      totalDriversSnapshot: null,

      // ✅ Trip references (empty for new driver)
      tripIds: [],
    }

    try {
      await addDriver(newDriver)
      await showSuccess(
        'Driver Created!',
        `Driver ${name} (${id}) has been created successfully.`
      )
      navigate(`/drivers?tab=details&driverId=${encodeURIComponent(id)}`)
    } catch (ex) {
      showError('Creation Failed', ex?.message || 'Failed to create driver. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Create Driver</h2>
          <p className="text-xs text-slate-600">
            Add driver details and save. Driver will appear in Driver list.
          </p>
        </div>
        <button
          onClick={() => navigate('/drivers')}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-6"
      >
        <Section title="Basic">
          <Field label="Driver ID*" value={form.id} onChange={set('id')} placeholder="D1004" />
          <Field label="Name*" value={form.name} onChange={set('name')} placeholder="Driver name" />
          <Select label="Gender" value={form.gender} onChange={set('gender')} options={['Male', 'Female', 'Other']} />
          <Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
          <Field label="City" value={form.city} onChange={set('city')} />
          <Field label="Address" value={form.address} onChange={set('address')} />
          <Field label="Pin code" value={form.pinCode} onChange={set('pinCode')} />
          <Field
            label="Profile Image URL"
            value={form.profileImage}
            onChange={set('profileImage')}
            placeholder="/images/drivers/D1004.jpg"
          />
        </Section>

        <Section title="Contact">
          <Field label="Mobile*" value={form.mobile} onChange={set('mobile')} placeholder="9847xxxxxx" />
          <Field label="Secondary Mobile" value={form.secondaryMobile} onChange={set('secondaryMobile')} />
          <Field label="Email" value={form.email} onChange={set('email')} placeholder="name@cococabs.in" />
          <Field label="Emergency Contact" value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="Name - 98xxxxxxxx" />
        </Section>

        <Section title="Driving License">
          <Field label="Driving License Number*" value={form.drivingLicenseNumber} onChange={set('drivingLicenseNumber')} />
          <Field label="License Expiry Date*" type="date" value={form.licenseExpiryDate} onChange={set('licenseExpiryDate')} />
          <Field label="License Issuing State" value={form.licenseIssuingState} onChange={set('licenseIssuingState')} />
        </Section>

        <Section title="Employment / Status">
          <Field label="Joining Date*" type="date" value={form.joiningDate} onChange={set('joiningDate')} />
          <Field label="Onboarded On" type="date" value={form.onboardedOn} onChange={set('onboardedOn')} />
          <Select label="Status" value={form.status} onChange={set('status')} options={['Active', 'Inactive']} />
          <Select label="Online status" value={form.onlineStatus} onChange={set('onlineStatus')} options={['Online', 'Offline']} />
        </Section>

        <Section title="Remark">
          <Textarea label="Remark" value={form.remark} onChange={set('remark')} />
        </Section>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
          >
            Create driver
          </button>
          <button
            type="button"
            onClick={() => navigate('/drivers')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-500">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      />
    </div>
  )
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-1 md:col-span-2">
      <label className="block text-xs font-medium text-slate-500">{label}</label>
      <textarea
        value={value ?? ''}
        onChange={onChange}
        rows={3}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      />
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  const normalized =
    options?.length && typeof options[0] === 'object'
      ? options
      : options.map((x) => ({ label: x, value: x }))

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-500">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      >
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
