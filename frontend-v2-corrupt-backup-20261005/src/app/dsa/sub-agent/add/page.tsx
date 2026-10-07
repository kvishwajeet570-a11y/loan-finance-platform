"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function AddSubAgentPage() {
  return (
    <DsaShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Add New Sub Agent
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register a new sub agent.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            New Sub Agent
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Full Name"
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Mobile Number"
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Email Address"
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="City"
            />
          </div>

          <button className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-md">
            Add Sub Agent
          </button>
        </div>
      </div>
    </DsaShell>
  );
}
