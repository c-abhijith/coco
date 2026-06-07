import axios from 'axios'
import { API_BASE_URL, REQUEST_TIMEOUT } from './config'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('coco_admin_auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`
        }
      } catch {
        // ignore parse errors
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle common errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        localStorage.removeItem('coco_admin_auth')
        window.location.href = '/login'
      }

      return Promise.reject({
        status,
        message: data?.message || data?.error || data?.status_desc || 'Something went wrong',
      })
    }

    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Network error — unable to reach the server',
      })
    }

    return Promise.reject({
      status: 0,
      message: error.message || 'Unexpected error',
    })
  }
)

export default apiClient
