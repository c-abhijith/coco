import React from 'react'

export function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Welcome to the Coco Cab Dashboard
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Use the <span className="font-semibold text-brand-dark">Users</span> tab in the left
          menu to view driver details. This is a simple, reusable React dashboard layout using
          <span className="font-semibold text-yellow-600"> Tailwind CSS</span> with a white and yellow theme.
        </p>
      </section>
    </div>
  )
}
