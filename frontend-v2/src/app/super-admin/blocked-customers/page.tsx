"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Search, ShieldBan, Users, UserRound, Phone, Mail, Eye,
  Unlock, RefreshCw, X, MapPin, CalendarDays, AlertCircle,
  ShieldCheck, ArrowUpRight, LockKeyhole, UserCheck, Filter,
  ChevronRight
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  city?: string | null;
  state?: string | null;
  createdAt: string;
};

export default function BlockedCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unblocking, setUnblocking] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/super-admin/users", {
        params: { page: 1, limit: 100, search, status: "Blocked" }
      });
      const result = response.data;
      const rows = result.data || [];
      const blocked = rows.filter((user: Customer) => user.isBlocked);
      setCustomers(blocked);
      setTotal(result.pagination?.total ?? blocked.length);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load blocked customers.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers, refreshKey]);

  const unblockCustomer = async (customer: Customer) => {
    if (!window.confirm(`Unblock ${customer.name}? This will restore their account access.`)) return;
    setUnblocking(customer.id);
    try {
      await api.patch(`/super-admin/users/${customer.id}/unblock`);
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      setTotal(prev => Math.max(0, prev - 1));
      setSelected(null);
    } catch (err: any) {
      window.alert(err?.response?.data?.message || "Unable to unblock this customer.");
    } finally {
      setUnblocking("");
    }
  };

  const verifiedCount = customers.filter(c => c.isVerified).length;
  const unverifiedCount = customers.length - verifiedCount;

  const stats = [
    { label: "Total Blocked", value: total, detail: "Accounts currently restricted", icon: ShieldBan, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/15" },
    { label: "Verified Accounts", value: verifiedCount, detail: "KYC verified customers", icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
    { label: "Unverified Accounts", value: unverifiedCount, detail: "KYC verification pending", icon: LockKeyhole, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15" },
  ];

  return (
    <main className="min-h-screen bg-[#080f1c] p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">

        <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#142238] via-[#101c2e] to-[#0d1727] p-6 sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-400">
                <ShieldBan size={15} /> Customer Management
                <ChevronRight size={13} className="text-slate-600" />
                <span className="text-slate-400">Access Control</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Blocked Customers</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor restricted accounts, review customer information and restore access when appropriate.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Restricted Accounts
              </div>
              <button onClick={() => setRefreshKey(v => v + 1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-teal-400 hover:text-teal-300">
                <RefreshCw size={15} /> Refresh
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`rounded-2xl border ${item.border} bg-[#111d2e] p-5 transition hover:-translate-y-0.5 hover:bg-[#142238]`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{item.label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">{loading ? "—" : item.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${item.bg}`}><Icon size={21} className={item.color} /></div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-500">{item.detail}</span>
                  <ArrowUpRight size={15} className="text-slate-600" />
                </div>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101b2b] shadow-xl shadow-black/10">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-rose-500/10 p-2"><Users size={17} className="text-rose-400" /></div>
                <h2 className="text-base font-semibold text-white">Blocked Account Directory</h2>
              </div>
              <p className="mt-2 text-xs text-slate-500">Review account information and manage customer access.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email or phone..."
                  className="w-full rounded-xl border border-slate-700 bg-[#0a1423] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-500 sm:w-80" />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X size={14} /></button>}
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0a1423] px-3 py-3 text-xs text-slate-400">
                <Filter size={14} /> Blocked only
              </div>
            </div>
          </div>

          {error && (
            <div className="m-5 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={() => setRefreshKey(v => v + 1)} className="ml-auto font-semibold underline">Retry</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[#0b1524] text-[11px] uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer Information</th>
                  <th className="px-5 py-4 font-semibold">Contact Details</th>
                  <th className="px-5 py-4 font-semibold">Account Role</th>
                  <th className="px-5 py-4 font-semibold">KYC Status</th>
                  <th className="px-5 py-4 font-semibold">Registration</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center">
                    <RefreshCw size={22} className="mx-auto animate-spin text-teal-400" />
                    <p className="mt-3 text-sm text-slate-400">Loading account records...</p>
                  </td></tr>
                ) : customers.length === 0 && !error ? (
                  <tr><td colSpan={6} className="px-6 py-16">
                    <div className="mx-auto flex max-w-md flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                        <ShieldCheck size={30} className="text-emerald-400" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-white">No blocked customers</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        There are currently no blocked accounts matching your search. When an account is blocked, it will appear here for review.
                      </p>
                      <button onClick={() => { setSearch(""); setRefreshKey(v => v + 1); }} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-teal-500 hover:text-teal-300">
                        <RefreshCw size={14} /> Refresh directory
                      </button>
                    </div>
                  </td></tr>
                ) : customers.map(customer => (
                  <tr key={customer.id} className="transition hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-gradient-to-br from-slate-700 to-slate-800 text-sm font-bold text-slate-200">
                          {(customer.name || "C").trim().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{customer.name || "Unnamed Customer"}</p>
                          <p className="mt-1 text-[11px] text-slate-500">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-2 text-slate-300"><Phone size={13} className="text-slate-500" />{customer.phoneNo || "—"}</p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Mail size={13} />{customer.email || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300">{customer.role || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${customer.isVerified ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>
                        {customer.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelected(customer)} title="View customer details" className="rounded-lg border border-slate-700 p-2.5 text-slate-300 transition hover:border-teal-500 hover:text-teal-300"><Eye size={15} /></button>
                        <button disabled={unblocking === customer.id} onClick={() => unblockCustomer(customer)} className="inline-flex items-center gap-2 rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300 transition hover:bg-teal-500/20 disabled:opacity-50">
                          <Unlock size={14} /> {unblocking === customer.id ? "Working..." : "Unblock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-800 bg-[#0c1625] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing <strong className="text-slate-300">{customers.length}</strong> loaded records</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Account data from server</span>
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-[#111d2e] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#142238] p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">Restricted Account</p>
                <h3 className="mt-1 text-lg font-bold text-white">Customer Details</h3>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700 text-lg font-bold text-white">{(selected.name || "C").charAt(0).toUpperCase()}</div>
                <div><p className="font-semibold text-white">{selected.name}</p><p className="mt-1 text-xs text-slate-500">{selected.id}</p></div>
                <span className="ml-auto rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">Blocked</span>
              </div>
              {[
                { label: "Email Address", value: selected.email, icon: Mail },
                { label: "Phone Number", value: selected.phoneNo, icon: Phone },
                { label: "Account Role", value: selected.role, icon: UserRound },
                { label: "Location", value: [selected.city, selected.state].filter(Boolean).join(", ") || "—", icon: MapPin },
                { label: "Registration Date", value: selected.createdAt ? new Date(selected.createdAt).toLocaleString("en-IN") : "—", icon: CalendarDays },
              ].map(item => {
                const Icon = item.icon;
                return <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-800 p-3.5">
                  <Icon size={16} className="text-teal-400" />
                  <div><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 break-all text-sm text-slate-200">{item.value || "—"}</p></div>
                </div>;
              })}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 p-3.5">
                <span className="text-sm text-slate-400">KYC Verification</span>
                <span className={`text-xs font-semibold ${selected.isVerified ? "text-emerald-400" : "text-amber-400"}`}>{selected.isVerified ? "Verified" : "Pending"}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-800 bg-[#0d1727] p-5">
              <button onClick={() => setSelected(null)} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800">Close</button>
              <button disabled={unblocking === selected.id} onClick={() => unblockCustomer(selected)} className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-teal-400 disabled:opacity-50">
                <Unlock size={15} /> {unblocking === selected.id ? "Unblocking..." : "Unblock Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
