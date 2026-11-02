"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search, Users, UserCheck, UserX, Download, SlidersHorizontal,
  ChevronDown, ChevronLeft, ChevronRight, Eye, X, Mail, Phone,
  CalendarDays, Clock3, ShieldCheck, RefreshCw, ShieldBan, Unlock
} from "lucide-react";
import api from "@/lib/api";

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phoneNo: string | null;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  city?: string | null;
  state?: string | null;
  createdAt: string;
};

type Stats = {
  total: number;
  active: number;
  pending: number;
  blocked: number;
};

const statusStyles = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Blocked: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function getStatus(c: Customer): keyof typeof statusStyles {
  if (c.isBlocked) return "Blocked";
  return c.isVerified ? "Active" : "Pending";
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function AllCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0, active: 0, pending: 0, blocked: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState("");

  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/super-admin/users", {
          params: { page, limit: pageSize, search: search.trim(), status },
        });

        if (cancelled) return;

        const result = response.data;
        if (!result?.success || !Array.isArray(result.data)) {
          throw new Error(result?.message || "Invalid customer response");
        }

        setCustomers(result.data);
        setStats(result.stats || {
          total: 0, active: 0, pending: 0, blocked: 0,
        });
        setTotal(result.pagination?.total ?? result.data.length);
        setTotalPages(Math.max(1, result.pagination?.totalPages ?? 1));
      } catch (err: any) {
        if (!cancelled) {
          setCustomers([]);
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Unable to load customers. Please check your login and API server."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [page, search, status]);

  const toggleCustomerBlock = async (customer: Customer) => {
    const shouldBlock = !customer.isBlocked;

    const confirmed = window.confirm(
      shouldBlock
        ? `Block ${customer.name || "this customer"}? Their account access will be restricted.`
        : `Unblock ${customer.name || "this customer"}? Their account access will be restored.`
    );

    if (!confirmed) return;

    setProcessingId(customer.id);

    try {
      const endpoint = `/super-admin/users/${customer.id}/${shouldBlock ? "block" : "unblock"}`;
      await api.patch(endpoint);

      setCustomers(prev =>
        prev.map(c => c.id === customer.id ? { ...c, isBlocked: shouldBlock } : c)
      );

      setStats(prev => ({
        ...prev,
        blocked: Math.max(0, prev.blocked + (shouldBlock ? 1 : -1)),
        active: Math.max(0, prev.active + (shouldBlock ? (customer.isVerified ? -1 : 0) : (customer.isVerified ? 1 : 0))),
        pending: Math.max(0, prev.pending + (shouldBlock ? (customer.isVerified ? 0 : -1) : (customer.isVerified ? 0 : 1))),
      }));

      if (selected?.id === customer.id) {
        setSelected({ ...customer, isBlocked: shouldBlock });
      }

      window.alert(shouldBlock ? "Customer blocked successfully." : "Customer unblocked successfully.");
    } catch (err: any) {
      window.alert(
        err?.response?.data?.message || "Unable to update customer account status."
      );
    } finally {
      setProcessingId("");
    }
  };
  const exportCsv = () => {
    const rows = [
      ["Customer ID", "Name", "Email", "Phone", "Joined", "Status", "City", "State"],
      ...customers.map(c => [
        c.id, c.name || "", c.email || "", c.phoneNo || "",
        formatDate(c.createdAt), getStatus(c), c.city || "", c.state || "",
      ]),
    ];

    const csv = rows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    { label: "Total Customers", value: stats.total, note: "Registered accounts", icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Active Customers", value: stats.active, note: "Verified accounts", icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pending Review", value: stats.pending, note: "Awaiting verification", icon: Clock3, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Blocked Accounts", value: stats.blocked, note: "Restricted accounts", icon: UserX, color: "text-rose-400", bg: "bg-rose-400/10" },
  ];

  const showingFrom = total ? (page - 1) * pageSize + 1 : 0;
  const showingTo = Math.min(page * pageSize, total);

  return (
    <div className="min-h-screen space-y-6 bg-[#0b111b] p-4 text-[#e6edf5] sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7892a8]">
            Super Admin <span className="mx-2 text-slate-600">/</span> Customer Management
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">All Customers</h1>
          <p className="mt-2 text-sm text-[#8fa1b5]">
            Manage customer accounts, review profiles and monitor account activity.
          </p>
        </div>
        <button onClick={exportCsv} disabled={!customers.length}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#34475b] bg-[#152233] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-[#548b8a] disabled:opacity-40">
          <Download size={16} /> Export Current Page
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[#263649] bg-[#111b29] p-5 transition hover:border-[#40586d]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9aabba]">{s.label}</span>
                <span className={`rounded-lg p-2.5 ${s.bg} ${s.color}`}><Icon size={19} /></span>
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight text-white">
                {loading && !stats.total ? "—" : s.value.toLocaleString("en-IN")}
              </div>
              <div className="mt-1 text-xs text-[#77899c]">{s.note}</div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#263649] bg-[#111b29]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#263649] p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-base font-semibold text-white">Customer Directory</h2>
            <p className="mt-1 text-xs text-[#8193a7]">Live customer records from database</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[220px] flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71869a]" size={16} />
              <input value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, email, phone..."
                className="w-full rounded-lg border border-[#304257] bg-[#0c1521] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#64778b] focus:border-[#4e918b]" />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8295a8]" size={15} />
              <select value={status}
                onChange={e => { setStatus(e.target.value); setPage(1); }}
                className="appearance-none rounded-lg border border-[#304257] bg-[#0c1521] py-2.5 pl-9 pr-9 text-sm text-slate-200 outline-none focus:border-[#4e918b]">
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8295a8]" size={14} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#263649] bg-[#0e1825] px-5 py-3">
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Pending", "Blocked"].map(s => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${status === s ? "bg-[#1c3d40] text-[#a4d9cd]" : "text-[#8497aa] hover:bg-[#1b2938] hover:text-white"}`}>
                {s}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#8193a7]">{total.toLocaleString("en-IN")} records found</span>
        </div>

        {error && (
          <div className="m-5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <p>{error}</p>
            <button onClick={() => setPage(p => p)} className="mt-2 inline-flex items-center gap-2 underline">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#0d1723]">
              <tr className="text-[11px] uppercase tracking-wider text-[#8294a8]">
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">Customer ID</th>
                <th className="px-5 py-4 font-semibold">Joined Date</th>
                <th className="px-5 py-4 font-semibold">Location</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263649]">
              {loading && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-[#8fa1b5]">
                  Loading live customer records...
                </td></tr>
              )}
              {!loading && !error && customers.map(c => {
                const currentStatus = getStatus(c);
                return (
                  <tr key={c.id} className="transition hover:bg-[#172536]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#34485c] bg-[#1c2b3c] text-sm font-bold text-[#b7c8d7]">
                          {(c.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#e5edf5]">{c.name || "Unnamed Customer"}</p>
                          <p className="mt-0.5 text-xs text-[#8193a7]">{c.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#aebdca]">{c.phoneNo || "—"}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#9bb0c2]">{c.id}</td>
                    <td className="px-5 py-4 text-sm text-[#aebdca]">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-4 text-sm text-[#aebdca]">{[c.city, c.state].filter(Boolean).join(", ") || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[currentStatus]}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />{currentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelected(c)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#35495c] px-3 py-2 text-xs font-semibold text-[#c4d1dd] transition hover:border-[#548b8a] hover:bg-[#1c3439] hover:text-white">
                          <Eye size={14} /> View
                        </button>
                        <button
                          disabled={processingId === c.id}
                          onClick={() => toggleCustomerBlock(c)}
                          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                            c.isBlocked
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              : "border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                          }`}
                        >
                          {c.isBlocked ? <Unlock size={14} /> : <ShieldBan size={14} />}
                          {processingId === c.id ? "Working..." : c.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && !error && customers.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-16 text-center">
                  <Users className="mx-auto mb-3 text-[#667b90]" size={30} />
                  <p className="text-sm font-semibold text-slate-300">No customers found</p>
                  <p className="mt-1 text-xs text-[#8193a7]">Try another search term or status filter.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-[#263649] px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-[#8294a8]">
            Showing {showingFrom}–{showingTo} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)}
              className="rounded-md border border-[#34475b] p-2 text-slate-300 hover:bg-[#1b2938] disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-xs text-slate-300">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages || loading} onClick={() => setPage(p => p + 1)}
              className="rounded-md border border-[#34475b] p-2 text-slate-300 hover:bg-[#1b2938] disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[#34475b] bg-[#111b29] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#263649] p-5">
              <div>
                <h3 className="font-semibold text-white">Customer Profile</h3>
                <p className="mt-1 text-xs text-[#8294a8]">Customer ID · {selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-md p-2 text-slate-400 hover:bg-[#263649] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#203b42] text-lg font-bold text-[#a9d7cc]">
                  {(selected.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{selected.name || "Unnamed Customer"}</h4>
                  <p className="mt-1 text-xs text-[#8294a8]">{selected.id}</p>
                  <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[getStatus(selected)]}`}>{getStatus(selected)}</span>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-[#c0ccd7]">
                <div className="flex items-center gap-3"><Mail size={16} className="text-[#7f9aab]" />{selected.email || "No email"}</div>
                <div className="flex items-center gap-3"><Phone size={16} className="text-[#7f9aab]" />{selected.phoneNo || "No phone"}</div>
                <div className="flex items-center gap-3"><CalendarDays size={16} className="text-[#7f9aab]" />Joined {formatDate(selected.createdAt)}</div>
                <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-[#7f9aab]" />Role: {selected.role}</div>
                <div className="text-xs text-[#8294a8]">{[selected.city, selected.state].filter(Boolean).join(", ") || "Location not available"}</div>
              </div>
              <button onClick={() => setSelected(null)} className="mt-7 w-full rounded-lg bg-[#176b66] py-2.5 text-sm font-semibold text-white transition hover:bg-[#208078]">Close Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

