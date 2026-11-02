"use client";

import { useMemo, useState } from "react";
import {
  Search, ShieldCheck, Clock3, CheckCircle2, XCircle,
  Eye, X, FileText, UserRound, Phone, Mail, CalendarDays,
  ChevronLeft, ChevronRight, SlidersHorizontal
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  submitted: string;
  status: "Pending" | "Verified" | "Rejected";
  document: string;
};

const initialCustomers: Customer[] = [
  { id: "CUS-1001", name: "Rahul Kumar", email: "rahul@example.com", phone: "+91 98765 43210", pan: "ABCDE1234F", submitted: "31 Oct 2026", status: "Pending", document: "PAN Card" },
  { id: "CUS-1002", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 12345", pan: "FGHIJ5678K", submitted: "30 Oct 2026", status: "Verified", document: "PAN Card" },
  { id: "CUS-1003", name: "Amit Singh", email: "amit@example.com", phone: "+91 91234 56789", pan: "KLMNO9012P", submitted: "29 Oct 2026", status: "Rejected", document: "PAN Card" },
  { id: "CUS-1004", name: "Neha Verma", email: "neha@example.com", phone: "+91 99887 76655", pan: "QRSTU3456V", submitted: "28 Oct 2026", status: "Pending", document: "PAN Card" },
  { id: "CUS-1005", name: "Vikash Gupta", email: "vikash@example.com", phone: "+91 90000 11122", pan: "WXYZA7890B", submitted: "27 Oct 2026", status: "Pending", document: "PAN Card" },
];

const statusStyle: Record<Customer["status"], string> = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Verified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function CustomerVerificationPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  const stats = {
    total: customers.length,
    pending: customers.filter(c => c.status === "Pending").length,
    verified: customers.filter(c => c.status === "Verified").length,
    rejected: customers.filter(c => c.status === "Rejected").length,
  };

  const filtered = useMemo(() => customers.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = [c.name, c.email, c.phone, c.pan, c.id].some(v => v.toLowerCase().includes(q));
    return matchesSearch && (filter === "All" || c.status === filter);
  }), [customers, search, filter]);

  const updateStatus = (id: string, status: Customer["status"]) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(null);
    setShowReject(false);
    setRejectReason("");
  };

  return (
    <div className="min-h-screen bg-[#0b1220] p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
              <ShieldCheck size={15} /> Customer Management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Customer Verification</h1>
            <p className="mt-1 text-sm text-slate-400">Review customer identity details and manage verification status.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <ShieldCheck size={17} className="text-teal-400" />
            Verification Center
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Requests", value: stats.total, icon: UserRound, color: "text-sky-400", bg: "bg-sky-400/10" },
            { label: "Pending Review", value: stats.pending, icon: Clock3, color: "text-amber-400", bg: "bg-amber-400/10" },
            { label: "Verified", value: stats.verified, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-[#111c2d] p-5 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <div className={`rounded-xl p-2.5 ${item.bg}`}><Icon size={19} className={item.color} /></div>
                </div>
                <p className="mt-4 text-3xl font-bold text-white">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">Current demo records</p>
              </div>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111c2d]">
          <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-white">Verification Requests</h2>
              <p className="mt-1 text-xs text-slate-500">Search and review submitted customer details</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, PAN..."
                  className="w-full rounded-xl border border-slate-700 bg-[#0b1525] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-teal-500 sm:w-72" />
              </div>
              <div className="relative">
                <SlidersHorizontal size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={filter} onChange={e => setFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-700 bg-[#0b1525] py-2.5 pl-9 pr-9 text-sm text-slate-200 outline-none focus:border-teal-500 sm:w-40">
                  {["All", "Pending", "Verified", "Rejected"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#0d1727] text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">PAN Number</th>
                  <th className="px-5 py-4 font-medium">Document</th>
                  <th className="px-5 py-4 font-medium">Submitted</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(c => (
                  <tr key={c.id} className="transition hover:bg-slate-800/30">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-100">{c.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{c.id} · {c.phone}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">{c.pan}</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-2 text-slate-300"><FileText size={15} className="text-teal-400" />{c.document}</span></td>
                    <td className="px-5 py-4 text-slate-400">{c.submitted}</td>
                    <td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle[c.status]}`}>{c.status}</span></td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => setSelected(c)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-teal-500 hover:text-teal-300">
                        <Eye size={14} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-slate-500">No verification requests found.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-800 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {filtered.length} of {customers.length} demo records</span>
            <div className="flex items-center gap-2">
              <button disabled className="rounded-lg border border-slate-700 p-2 opacity-40"><ChevronLeft size={15} /></button>
              <span className="rounded-lg bg-teal-500/10 px-3 py-2 text-teal-300">1</span>
              <button disabled className="rounded-lg border border-slate-700 p-2 opacity-40"><ChevronRight size={15} /></button>
            </div>
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-[#111c2d] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div><h3 className="font-semibold text-white">Customer Verification Review</h3><p className="mt-1 text-xs text-slate-500">{selected.id}</p></div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500/10 text-teal-300"><UserRound size={20} /></div>
                <div><p className="font-semibold text-white">{selected.name}</p><p className="text-xs text-slate-400">{selected.id}</p></div>
                <span className={`ml-auto rounded-full border px-2.5 py-1 text-xs ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 p-3"><p className="text-xs text-slate-500"><Mail size={13} className="mr-1 inline" /> Email</p><p className="mt-1 break-all text-sm text-slate-200">{selected.email}</p></div>
                <div className="rounded-xl border border-slate-800 p-3"><p className="text-xs text-slate-500"><Phone size={13} className="mr-1 inline" /> Phone</p><p className="mt-1 text-sm text-slate-200">{selected.phone}</p></div>
                <div className="rounded-xl border border-slate-800 p-3"><p className="text-xs text-slate-500">PAN Number</p><p className="mt-1 font-mono text-sm text-slate-200">{selected.pan}</p></div>
                <div className="rounded-xl border border-slate-800 p-3"><p className="text-xs text-slate-500"><CalendarDays size={13} className="mr-1 inline" /> Submitted</p><p className="mt-1 text-sm text-slate-200">{selected.submitted}</p></div>
              </div>
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-5">
                <div className="flex items-center gap-3"><FileText className="text-teal-400" size={22} /><div><p className="text-sm font-medium text-white">{selected.document}</p><p className="text-xs text-slate-500">Demo document preview placeholder</p></div></div>
                <p className="mt-3 text-xs text-slate-500">Actual document preview will be available after connecting the customer document API.</p>
              </div>
              {showReject && <div><label className="mb-2 block text-xs font-medium text-slate-300">Rejection reason</label><textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Enter reason for rejection..." className="w-full rounded-xl border border-slate-700 bg-[#0b1525] p-3 text-sm text-white outline-none focus:border-rose-500" /></div>}
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-800 p-5 sm:flex-row sm:justify-end">
              <button onClick={() => { setShowReject(true); }} className="rounded-xl border border-rose-500/30 px-4 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/10">Reject</button>
              {showReject && <button disabled={!rejectReason.trim()} onClick={() => updateStatus(selected.id, "Rejected")} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Confirm Reject</button>}
              <button onClick={() => updateStatus(selected.id, "Verified")} className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-400">Approve Verification</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
