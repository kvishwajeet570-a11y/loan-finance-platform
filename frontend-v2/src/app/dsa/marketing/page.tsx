"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function MarketingPage() {
  return (
    <DsaShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Marketing
        </h1>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold">Marketing Overview</h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage marketing activities.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold">Marketing Materials</h2>
            <p className="mt-2 text-sm text-slate-500">
              Access marketing resources.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold">Banners & Posters</h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage promotional creatives.
            </p>
          </div>
        </div>
      </div>
    </DsaShell>
  );
}
