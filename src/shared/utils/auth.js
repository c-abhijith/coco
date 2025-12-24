// src/shared/utils/auth.js
/**
 * Authentication Utility Module
 *
 * Handles user authentication using localStorage for session persistence.
 * Simple credential-based authentication for admin users.
 *
 * Credentials:
 * - Username: admin
 * - Password: password
 */

const AUTH_STORAGE_KEY = 'coco_admin_auth'

// Hard-coded credentials (in production, this would be server-side)
const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'password'

/**
 * Attempt to login with username and password
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {boolean} True if login successful, false otherwise
 */
export function login(username, password) {
  // Validate credentials
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    // Create auth session
    const authData = {
      isAuthenticated: true,
      username: username,
      loginTime: new Date().toISOString(),
    }

    // Store in localStorage
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
      return true
    } catch (error) {
      console.error('Failed to store auth data:', error)
      return false
    }
  }

  return false
}

/**
 * Logout the current user
 * Clears authentication data from localStorage
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
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAuthenticated() {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!authData) return false

    const parsed = JSON.parse(authData)
    return parsed?.isAuthenticated === true
  } catch (error) {
    console.error('Failed to check auth status:', error)
    return false
  }
}

/**
 * Get current user information
 * @returns {Object|null} User data or null if not authenticated
 */
export function getCurrentUser() {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!authData) return null

    const parsed = JSON.parse(authData)
    if (parsed?.isAuthenticated) {
      return {
        username: parsed.username,
        loginTime: parsed.loginTime,
      }
    }

    return null
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}
