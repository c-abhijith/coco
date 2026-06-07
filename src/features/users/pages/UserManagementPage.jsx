import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { PageHeader } from '../../../shared/components/PageHeader'
import { getUsers, toggleUserStatus } from '../../../api/userApi'

export function UserManagementPage() {
  const navigate = useNavigate()
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterActive, setFilterActive] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    setLoading(true)
    getUsers()
      .then((res) => {
        setUsersList(res.data || [])
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Users',
          html: `<span style="font-size:13px;color:#64748b">${err?.message || 'Unable to fetch users.'}</span>`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleToggleStatus = async (user) => {
    const action = user.is_active ? 'Block' : 'Unblock'
    const confirmed = await Swal.fire({
      icon: 'warning',
      title: `${action} User?`,
      html: `<span style="font-size:13px;color:#64748b">Are you sure you want to ${action.toLowerCase()} <strong>${user.name}</strong>?</span>`,
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: user.is_active ? '#ef4444' : '#22c55e',
    })

    if (!confirmed.isConfirmed) return

    setTogglingId(user.id)
    try {
      await toggleUserStatus(user.id)
      setUsersList((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
      )
      Swal.fire({
        icon: 'success',
        title: `User ${action}ed`,
        html: `<span style="font-size:13px;color:#64748b">${user.name} has been ${action.toLowerCase()}ed successfully.</span>`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: `${action} Failed`,
        html: `<span style="font-size:13px;color:#64748b">${err?.message || 'Unable to update user status.'}</span>`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      })
    } finally {
      setTogglingId(null)
    }
  }

  const filteredUsers = useMemo(() => {
    let list = [...usersList]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.mobile_number?.includes(q) ||
          u.email_id?.toLowerCase().includes(q)
      )
    }
    if (filterActive !== null) {
      list = list.filter((u) => u.is_active === filterActive)
    }
    return list
  }, [usersList, searchQuery, filterActive])

  const formatDate = (iso) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-slate-500">
        Loading users...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="User Management"
          description="View and manage all app users and their accounts."
        >
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search by name, mobile, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg border-2 border-yellow-400 bg-yellow-50 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterActive(null)
              }}
              className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </PageHeader>
      </section>

      {/* User List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">User list</h3>
            <p className="text-xs text-slate-600">Overview of all registered users.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
              <span className="font-semibold">{usersList.length}</span> users
            </div>
            <button
              onClick={() => navigate('/users/create')}
              className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
            >
              + Create user
            </button>
          </div>
        </div>

        {/* Status filter */}
        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filterActive === true}
              onChange={(e) => setFilterActive(e.target.checked ? true : null)}
              className="rounded border-slate-300 text-brand-yellow focus:ring-brand-yellow"
            />
            Active users only
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filterActive === false}
              onChange={(e) => setFilterActive(e.target.checked ? false : null)}
              className="rounded border-slate-300 text-brand-yellow focus:ring-brand-yellow"
            />
            Inactive users only
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created On</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
                    {searchQuery.trim()
                      ? `No users match your search "${searchQuery}".`
                      : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-500 text-xs font-mono">{u.id}</td>
                    <td className="px-4 py-2 font-medium text-slate-800">{u.name || '-'}</td>
                    <td className="px-4 py-2 text-slate-700">{u.mobile_number || '-'}</td>
                    <td className="px-4 py-2 text-slate-700">{u.email_id || '-'}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          u.is_active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-700">{formatDate(u.created_on)}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={togglingId === u.id}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${
                          u.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {togglingId === u.id ? '...' : u.is_active ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagementPage
