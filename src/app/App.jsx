import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { DashboardLayout } from '../layouts/DashboardLayout'
import { HomePage } from './HomePage'
import { LoginPage } from '../features/auth/LoginPage'
import { isAuthenticated } from '../shared/utils/auth'

import { DriverManagementPage } from '../features/drivers/pages/DriverManagementPage'
import { CreateDriverPage } from '../features/drivers/pages/CreateDriverPage'
import { RiderManagementPage } from '../features/riders/pages/RiderManagementPage'
import { TripManagementPage } from '../features/trips/pages/TripManagementPage'
import { TripDetailsPage } from '../features/trips/pages/TripDetailsPage'
import VehicleManagementPage from '../features/vehicles/pages/VehicleManagementPage'
import { CreateVehiclePage } from '../features/vehicles/pages/CreateVehiclePage'
import { ComplaintManagementPage } from '../features/complaints/pages/ComplaintManagementPage'

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

/**
 * App Component
 *
 * Main application component with routing.
 * Routes are protected and require authentication except /login.
 */
function App() {
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes: Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Driver Management */}
      <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <DriverManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers/create"
        element={
          <ProtectedRoute>
            <CreateDriverPage />
          </ProtectedRoute>
        }
      />

      {/* Optional: keep old /users path pointing to same page */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DriverManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Rider Management */}
      <Route
        path="/riders"
        element={
          <ProtectedRoute>
            <RiderManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Trip Management */}
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <TripManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trip-details"
        element={
          <ProtectedRoute>
            <TripDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Vehicle Management */}
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <VehicleManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/create"
        element={
          <ProtectedRoute>
            <CreateVehiclePage />
          </ProtectedRoute>
        }
      />

      {/* Complaint Management */}
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <ComplaintManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: Redirect to home or login based on auth status */}
      <Route
        path="*"
        element={
          isAuthenticated() ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App
