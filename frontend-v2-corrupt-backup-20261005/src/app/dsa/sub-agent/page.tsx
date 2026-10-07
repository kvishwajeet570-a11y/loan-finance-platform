"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function MySubAgentPage() {
  return (
    <DsaShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Sub Agent</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your sub agents.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">My Sub Agents</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sub agent list will appear here.
          </p>
        </div>
      </div>
    </DsaShell>
  );
}
