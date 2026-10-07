"use client";

import DsaShell from "@/components/dsa/DsaShell";

export default function PayoutOverviewPage() {
 return (
 <DsaShell>
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-extrabold text-slate-900">
 Payout Overview
 </h1>
 <p className="mt-1 text-sm text-slate-500">
 View your payout summary and transaction details.
 </p>
 </div>

 <div className="grid gap-5 md:grid-cols-3">
 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
 <p className="text-sm font-semibold text-slate-500">
 Total Payout
 </p>
 <p className="mt-2 text-3xl font-extrabold text-slate-900">
 ₹0
 </p>
 </div>

 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
 <p className="text-sm font-semibold text-slate-500">
 Pending Payout
 </p>
 <p className="mt-2 text-3xl font-extrabold text-orange-500">
 ₹0
 </p>
 </div>

 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
 <p className="text-sm font-semibold text-slate-500">
 Paid Amount
 </p>
 <p className="mt-2 text-3xl font-extrabold text-green-600">
 ₹0
 </p>
 </div>
 </div>

 <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
 <h2 className="text-lg font-bold text-slate-800">
 Payout Overview
 </h2>

 <p className="mt-2 text-sm text-slate-500">
 Your payout records will appear here.
 </p>
 </div>
 </div>
 </DsaShell>
 );
}

