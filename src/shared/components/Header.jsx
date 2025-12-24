import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuIcon } from '../icons/icons'
import { logout, getCurrentUser } from '../utils/auth'
import { showConfirm, showToast } from '../utils/alerts'

/**
 * Header Component
 *
 * Displays the application header with:
 * - App branding
 * - Online status indicator
 * - User profile avatar
 * - Logout button
 */
export function Header() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      'Logout',
      'Are you sure you want to logout?',
      'Yes, logout',
      'Cancel'
    )

    if (confirmed) {
      logout()
      showToast('Logged out successfully', 'success')
      navigate('/login')
    }
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 p-2">
          <MenuIcon className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            COCO CABS
          </p>
          <h1 className="text-sm font-semibold text-slate-800">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Online Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 border border-yellow-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-yellow-900">
            Online
          </span>
        </div>

        {/* User Info */}
        <div className="hidden md:block text-right">
          <p className="text-xs font-medium text-slate-700">
            {currentUser?.username || 'Admin'}
          </p>
          <p className="text-[10px] text-slate-500">Administrator</p>
        </div>

        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center text-xs font-bold">
          {currentUser?.username?.substring(0, 2).toUpperCase() || 'AA'}
        </div>

   
      </div>
    </header>
  )
}
