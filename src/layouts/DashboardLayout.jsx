import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from '../shared/components/Sidebar'
import { Header } from '../shared/components/Header'

export function DashboardLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const pathname = location.pathname || '/'

  const activePage =
    pathname.startsWith('/drivers') || pathname.startsWith('/users')
      ? 'drivers'
      : pathname.startsWith('/riders')
      ? 'riders'
      : pathname.startsWith('/trips') || pathname.startsWith('/trip-details')
      ? 'trips'
      : pathname.startsWith('/vehicles')
      ? 'vehicles'
      : pathname.startsWith('/complaints')
      ? 'complaints'
      : 'home'

  const handleChangePage = (page) => {
    if (page === 'home') {
      navigate('/')
    } else if (page === 'drivers') {
      navigate('/drivers')
    } else if (page === 'riders') {
      navigate('/riders')
    } else if (page === 'trips') {
      navigate('/trips')
    } else if (page === 'vehicles') {
      navigate('/vehicles')
    } else if (page === 'complaints') {
      navigate('/complaints')
    }
  }

  return (
    // ✅ Full height screen + prevent body scrolling
    <div className="h-screen overflow-hidden flex bg-slate-100">
      {/* ✅ Sidebar stays fixed (no scroll) */}
      <Sidebar activePage={activePage} onChangePage={handleChangePage} />

      {/* Right panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* ✅ Sticky header */}
        <div className="sticky top-0 z-50">
          <Header />
        </div>

        {/* ✅ Only this scrolls */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
