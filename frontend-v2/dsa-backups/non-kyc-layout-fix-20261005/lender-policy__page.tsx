"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function LenderPolicyPage() {
  return (
    <DsaShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Lender Policy
        </h1>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold">All Lender Policies</h2>
            <p className="mt-2 text-sm text-slate-500">
              Browse lender policy information.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold">Lender List</h2>
            <p className="mt-2 text-sm text-slate-500">
              View available lenders.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold">Policy Documents</h2>
            <p className="mt-2 text-sm text-slate-500">
              View lender policy documents.
            </p>
          </div>
        </div>
      </div>
    </DsaShell>
  );
}
