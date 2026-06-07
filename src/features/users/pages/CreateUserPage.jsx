import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../../api/userApi'
import { showError, showSuccess } from '../../../shared/utils/alerts'

function isEmail(v) {
  if (!v) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function CreateUserPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    mobile_number: '',
    email_id: '',
    otp: '',
    is_active: true,
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [k]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const name = form.name.trim()
    const mobile = form.mobile_number.trim()
    const email = form.email_id.trim()
    const otp = form.otp.trim()

    if (!name || !mobile || !email) {
      showError('Required Fields Missing', 'Please fill Name, Mobile Number, and Email.')
      return
    }
    if (!isEmail(email)) {
      showError('Invalid Email', 'Please enter a valid email address.')
      return
    }
    if (!/^\d{10}$/.test(mobile)) {
      showError('Invalid Mobile', 'Please enter a valid 10-digit mobile number.')
      return
    }

    const payload = {
      name,
      mobile_number: mobile,
      email_id: email,
      otp,
      role: 'user',
      is_active: form.is_active,
    }

    try {
      setSubmitting(true)
      await createUser(payload)
      await showSuccess('User Created!', `User ${name} has been created successfully.`)
      navigate('/users')
    } catch (ex) {
      showError('Creation Failed', ex?.message || 'Failed to create user. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Create User</h2>
          <p className="text-xs text-slate-600">Add a new user account to the system.</p>
        </div>
        <button
          onClick={() => navigate('/users')}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-6"
      >
        <Section title="Basic Information">
          <Field
            label="Name*"
            value={form.name}
            onChange={set('name')}
            placeholder="Full name"
          />
          <Field
            label="Mobile Number*"
            value={form.mobile_number}
            onChange={set('mobile_number')}
            placeholder="10-digit mobile number"
            type="tel"
          />
          <Field
            label="Email*"
            value={form.email_id}
            onChange={set('email_id')}
            placeholder="user@example.com"
            type="email"
          />
          <Field
            label="OTP"
            value={form.otp}
            onChange={set('otp')}
            placeholder="Enter OTP"
            type="text"
          />
        </Section>

        <Section title="Status">
          <div className="flex items-center gap-3 col-span-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={set('is_active')}
              className="h-4 w-4 rounded border-slate-300 text-brand-yellow focus:ring-brand-yellow"
            />
            <label htmlFor="is_active" className="text-sm text-slate-700">
              Active account
            </label>
          </div>
        </Section>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create user'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/users')}
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

export default CreateUserPage
