import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDriver } from '../../../api/driverApi'
import { showError, showSuccess } from '../../../shared/utils/alerts'

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

  const [form, setForm] = useState({
    // Basic
    name: '',
    gender: 'Male',
    dateOfBirth: '',
    city: '',
    address: '',

    // Contacts
    mobile: '',
    email: '',
    emergencyContact: '',

    // License
    drivingLicenseNumber: '',
    licenseExpiryDate: '',

    // Bank (required by backend)
    accountNumber: '',
    ifscCode: '',

    // Employment
    onboardedOn: '',
    status: 'Active',

    // Optional
    profileImage: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const name = form.name.trim()
    const mobile = form.mobile.trim()
    const email = form.email.trim()
    const accountNumber = form.accountNumber.trim()
    const ifscCode = form.ifscCode.trim()
    const licenseNumber = form.drivingLicenseNumber.trim()

    // Validation
    if (!name || !mobile || !email) {
      showError('Required Fields Missing', 'Please fill Name, Mobile, and Email.')
      return
    }
    if (!licenseNumber) {
      showError('License Required', 'Please fill Driving License Number.')
      return
    }
    if (!accountNumber || !ifscCode) {
      showError('Bank Details Required', 'Please fill Account Number and IFSC Code.')
      return
    }
    if (email && !isEmail(email)) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }

    // Map form → API payload (snake_case fields expected by backend)
    const payload = {
      name,
      mobile_number: mobile,
      email_id: email,
      account_number: accountNumber,
      ifsc_code: ifscCode,
      license_number: licenseNumber,
      status: form.status,
      gender: form.gender || null,
      city: form.city || null,
      on_boarded_on: form.onboardedOn || null,
      dob: form.dateOfBirth || null,
      address: form.address || null,
      emergency_contact_no: form.emergencyContact || null,
      driver_photo_url: form.profileImage?.trim() || null,
      is_active: form.status === 'Active',
      // Not collected in this form — sent as null
      vehicle_id: null,
      cab_selection_options: null,
      android_id: null,
      aadhar_number: null,
      driving_lic_no: licenseNumber,
      pan_number: null,
    }

    try {
      setSubmitting(true)
      const res = await addDriver(payload)
      // Backend returns { message, data: { DriverId, Message } }
      const newDriverId = res?.data?.DriverId
      await showSuccess(
        'Driver Created!',
        `Driver ${name} has been created successfully.`
      )
      if (newDriverId) {
        navigate(`/drivers?tab=details&driverId=${encodeURIComponent(newDriverId)}`)
      } else {
        navigate('/drivers?tab=list')
      }
    } catch (ex) {
      showError('Creation Failed', ex?.message || 'Failed to create driver. Please try again.')
    } finally {
      setSubmitting(false)
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
          <Field label="Name*" value={form.name} onChange={set('name')} placeholder="Driver name" />
          <Select label="Gender" value={form.gender} onChange={set('gender')} options={['Male', 'Female', 'Other']} />
          <Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
          <Field label="City" value={form.city} onChange={set('city')} />
          <Field label="Address" value={form.address} onChange={set('address')} />
          <Field
            label="Profile Image URL"
            value={form.profileImage}
            onChange={set('profileImage')}
            placeholder="https://..."
          />
        </Section>

        <Section title="Contact">
          <Field label="Mobile*" value={form.mobile} onChange={set('mobile')} placeholder="9847xxxxxx" />
          <Field label="Email*" value={form.email} onChange={set('email')} placeholder="name@cococabs.in" />
          <Field label="Emergency Contact" value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="Name - 98xxxxxxxx" />
        </Section>

        <Section title="Driving License">
          <Field label="Driving License Number*" value={form.drivingLicenseNumber} onChange={set('drivingLicenseNumber')} />
          <Field label="License Expiry Date" type="date" value={form.licenseExpiryDate} onChange={set('licenseExpiryDate')} />
        </Section>

        <Section title="Bank Details">
          <Field label="Account Number*" value={form.accountNumber} onChange={set('accountNumber')} placeholder="Bank account number" />
          <Field label="IFSC Code*" value={form.ifscCode} onChange={set('ifscCode')} placeholder="SBIN0001234" />
        </Section>

        <Section title="Employment / Status">
          <Field label="Onboarded On" type="date" value={form.onboardedOn} onChange={set('onboardedOn')} />
          <Select label="Status" value={form.status} onChange={set('status')} options={['Active', 'Inactive']} />
        </Section>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create driver'}
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

export default CreateDriverPage
