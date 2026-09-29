"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function Page() {
  return (
    <DsaShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">
          ADVISOR TRAINING
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Advisor training resources and videos.
        </p>
      </div>
    </DsaShell>
  );
}
