"use client";

import { Building2 } from "lucide-react";
import DsaShell from "@/components/dsa/DsaShell";

export default function CompanyPage() {
 return (
 <DsaShell>
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-extrabold text-slate-900">
 Company Search
 </h1>
 <p className="mt-1 text-sm text-slate-500">
 Enter a company name to find its corresponding code.
 </p>
 </div>

 <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
 <div className="mx-auto max-w-2xl text-center">
 <Building2 className="mx-auto h-14 w-14 text-purple-600" />

 <h2 className="mt-5 text-3xl font-extrabold text-slate-900">
 Company Search
 </h2>

 <div className="mt-8 flex rounded-full border border-purple-200 p-1">
 <input
 placeholder="Search company here..."
 className="flex-1 rounded-full px-5 py-3 outline-none"
 />

 <button className="rounded-full bg-purple-600 px-6 py-3 font-bold text-white">
 Search
 </button>
 </div>
 </div>
 </div>
 </div>
 </DsaShell>
 );
}

