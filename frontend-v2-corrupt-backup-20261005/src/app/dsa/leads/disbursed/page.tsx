"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function DisbursedLeadsPage() {
  return (
    <DsaShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Disbursed Leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View leads whose loans have been disbursed.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total Disbursed
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              This Month
            </p>
            <p className="mt-2 text-3xl font-black text-blue-600">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Payout
            </p>
            <p className="mt-2 text-3xl font-black text-emerald-600">
              ₹0
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            Disbursed Lead Records
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Disbursed lead records will appear here.
          </p>
        </div>
      </div>
    </DsaShell>
  );
}
