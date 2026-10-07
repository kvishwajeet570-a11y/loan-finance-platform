"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function PayoutChartPage() {
 return (
 <DsaShell>
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-extrabold text-slate-900">
 Payout Chart
 </h1>
 <p className="mt-1 text-sm text-slate-500">
 Analyze your payout performance.
 </p>
 </div>

 <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
 <h2 className="text-lg font-bold text-slate-800">
 Payout Performance
 </h2>

 <div className="mt-8 flex h-72 items-end gap-6 rounded-xl bg-slate-50 p-6">
 {[35, 55, 42, 75, 60, 90, 70].map((height, index) => (
 <div
 key={index}
 className="flex flex-1 flex-col items-center justify-end gap-2"
 >
 <div
 className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400"
 style={{ height: `${height}%` }}
 />
 <span className="text-xs font-semibold text-slate-500">
 {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </DsaShell>
 );
}

