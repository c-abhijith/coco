import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../shared/utils/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('mobile') // 'mobile' | 'otp'
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleMobileSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (mobileNumber.trim().length < 10) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    setStep('otp')
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(mobileNumber.trim(), otp.trim())

    if (result.success) {
      navigate('/')
    } else {
      setError(result.message || 'Invalid OTP. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-yellow mb-4">
            <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Coco Cabs Admin</h1>
          <p className="text-sm text-slate-600 mt-2">
            {step === 'mobile' ? 'Enter your mobile number to continue' : `OTP sent to +91 ${mobileNumber}`}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 'mobile' ? 'bg-brand-yellow text-slate-900' : 'bg-green-500 text-white'}`}>
              {step === 'otp' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : '1'}
            </div>
            <div className={`flex-1 h-px ${step === 'otp' ? 'bg-green-400' : 'bg-slate-200'}`} />
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 'otp' ? 'bg-brand-yellow text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
              2
            </div>
          </div>

          {/* Step 1 — Mobile number */}
          {step === 'mobile' && (
            <form onSubmit={handleMobileSubmit} className="space-y-5">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-brand-yellow focus-within:border-brand-yellow transition-all">
                  <span className="flex items-center px-4 text-sm text-slate-500 bg-slate-50 border-r border-slate-200 font-medium">
                    +91
                  </span>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 text-sm bg-white focus:outline-none"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-yellow px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 transition-all"
              >
                Send OTP
              </button>
            </form>
          )}

          {/* Step 2 — OTP */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-2">
                  One-Time Password
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm tracking-widest text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all"
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length < 4}
                className="w-full rounded-xl bg-brand-yellow px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('mobile'); setOtp(''); setError('') }}
                className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Change number
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-8 text-xs text-slate-500">
          <p>&copy; 2026 Coco Cabs. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
