"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function PinCodePage() {
  return (
    <DsaShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Pin Code
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search pin code information.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex max-w-2xl gap-3">
            <input
              placeholder="Enter Pin Code..."
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white">
              Search
            </button>
          </div>
        </div>
      </div>
    </DsaShell>
  );
}
