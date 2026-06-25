import React from 'react'
import { PageHeader } from '../../../shared/components/PageHeader'

export function SettlementManagementPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <PageHeader
          title="Settlement Management"
          description="Manage and track driver and rider settlements."
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="text-center text-slate-500">
          <p className="text-sm">Settlement management coming soon.</p>
        </div>
      </section>
    </div>
  )
}

export default SettlementManagementPage
