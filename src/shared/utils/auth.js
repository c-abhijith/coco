import { loginApi } from '../../api/authApi'

const AUTH_STORAGE_KEY = 'coco_admin_auth'

/**
 * Login with mobile number and OTP via API
 * @param {string} mobileNumber
 * @param {string} otp
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function login(mobileNumber, otp) {
  try {
    const data = await loginApi({ mobile_number: mobileNumber, otp })

    if (data?.success) {
      const authData = {
        isAuthenticated: true,
        mobileNumber,
        token: data.token || null,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
      return { success: true }
    }

    return { success: false, message: data?.message || 'Login failed' }
  } catch (error) {
    return { success: false, message: error?.message || 'Login failed' }
  }
}

/**
 * Logout the current user
 */
export function logout() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to remove auth data:', error)
  }
}

/**
 * Check if user is currently authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!authData) return false
    const parsed = JSON.parse(authData)
    return parsed?.isAuthenticated === true
  } catch {
    return false
  }
}

/**
 * Get current user information
 * @returns {Object|null}
 */
export function getCurrentUser() {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!authData) return null
    const parsed = JSON.parse(authData)
    if (parsed?.isAuthenticated) {
      return { mobileNumber: parsed.mobileNumber, loginTime: parsed.loginTime }
    }
    return null
  } catch {
    return null
  }
}
