import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addVehicle, getVehicles } from '../../../shared/data/vehicle'
import { getDrivers } from '../../../shared/data/driver'
import { showError, showSuccess } from '../../../shared/utils/alerts'

export function CreateVehiclePage() {
  const navigate = useNavigate()
  const existingIds = useMemo(() => new Set(getVehicles().map((v) => v.id)), [])
  const existingVehicleNumbers = useMemo(
    () => new Set(getVehicles().map((v) => v.vehicleNumber)),
    []
  )
  const drivers = useMemo(() => getDrivers(), [])

  const [form, setForm] = useState({
    id: '',
    driverId: '',
    vehicleName: '',
    vehicleNumber: '',
    cabType: 'SEDAN',
  })

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const id = form.id.trim()
    const vehicleName = form.vehicleName.trim()
    const vehicleNumber = form.vehicleNumber.trim()
    const driverId = form.driverId.trim()

    // Validation
    if (!id || !vehicleName || !vehicleNumber) {
      showError('Required Fields Missing', 'Please fill Vehicle ID, Vehicle Name, and Vehicle Number.')
      return
    }
    if (existingIds.has(id)) {
      showError('Duplicate Vehicle ID', `Vehicle ID already exists: ${id}`)
      return
    }
    if (existingVehicleNumbers.has(vehicleNumber)) {
      showError('Duplicate Vehicle Number', `Vehicle number already exists: ${vehicleNumber}`)
      return
    }

    // Create vehicle record
    const newVehicle = {
      id,
      driverId: driverId || null,
      vehicleName,
      vehicleNumber,
      cabType: form.cabType,
    }

    try {
      await addVehicle(newVehicle)
      await showSuccess(
        'Vehicle Created!',
        `Vehicle ${vehicleName} (${vehicleNumber}) has been created successfully.`
      )
      navigate(`/vehicles?tab=details&vehicleNumber=${encodeURIComponent(vehicleNumber)}`)
    } catch (ex) {
      showError('Creation Failed', ex?.message || 'Failed to create vehicle. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Create Vehicle</h2>
          <p className="text-xs text-slate-600">
            Add vehicle details and save. Vehicle will appear in Vehicle list.
          </p>
        </div>
        <button
          onClick={() => navigate('/vehicles')}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-6"
      >
        <Section title="Vehicle Information">
          <Field label="Vehicle ID*" value={form.id} onChange={set('id')} placeholder="V004" />
          <Field
            label="Vehicle Name*"
            value={form.vehicleName}
            onChange={set('vehicleName')}
            placeholder="Toyota Innova"
          />
          <Field
            label="Vehicle Number*"
            value={form.vehicleNumber}
            onChange={set('vehicleNumber')}
            placeholder="KL-07-AB-1234"
          />
          <Select
            label="Cab Type"
            value={form.cabType}
            onChange={set('cabType')}
            options={['SEDAN', 'HATCHBACK', 'SUV', 'MINI']}
          />
          <Select
            label="Assign Driver (Optional)"
            value={form.driverId}
            onChange={set('driverId')}
            options={[
              { label: 'No Driver', value: '' },
              ...drivers.map((d) => ({
                label: `${d.name} (${d.id})`,
                value: d.id,
              })),
            ]}
          />
        </Section>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
          >
            Create vehicle
          </button>
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
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

export default CreateVehiclePage
