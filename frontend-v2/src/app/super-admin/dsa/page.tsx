"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, Users, UserCheck, UserX, Clock3, Download,
  RefreshCw, Eye, X, ShieldCheck, Ban, CheckCircle2,
  AlertCircle, Mail, Phone, CalendarDays, ChevronLeft,
  ChevronRight, Building2
} from "lucide-react";

type DSA = {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  phoneNo?: string;
  phone?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt?: string;
  role?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Confirm your application's actual token storage key here if required.
const TOKEN_STORAGE_KEY = "loan_finance_token";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
}

async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || result.error || `Request failed (${response.status})`);
  }

  return result;
}

function getName(d: DSA) {
  return d.name || d.fullName || "Unnamed DSA";
}

function getStatus(d: DSA) {
  if (d.isBlocked) return "Blocked";
  if (d.isVerified) return "Verified";
  return "Pending";
}

function formatDate(value?: string) {
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

const statusStyles: Record<string, string> = {
  Verified: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Blocked: "border-rose-500/20 bg-rose-500/10 text-rose-400",
};

export default function DsaManagementPage() {
  const [records, setRecords] = useState<DSA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<DSA | null>(null);
  const [busyId, setBusyId] = useState("");
  const pageSize = 8;

  const loadDSAs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/super-admin/dsa");
      const data = Array.isArray(result)
        ? result
        : result.data || result.dsas || result.users || [];

      if (!Array.isArray(data)) {
        throw new Error("Unexpected DSA API response format.");
      }

      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load DSA records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDSAs();
  }, [loadDSAs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return records.filter((d) => {
      const matchesSearch = [
        getName(d), d.email || "", d.phoneNo || d.phone || "", d.id,
      ].some((v) => String(v).toLowerCase().includes(q));

      return matchesSearch &&
        (filter === "All" || getStatus(d) === filter);
    });
  }, [records, search, filter]);

  const stats = useMemo(() => ({
    total: records.length,
    verified: records.filter(d => d.isVerified && !d.isBlocked).length,
    pending: records.filter(d => !d.isVerified && !d.isBlocked).length,
    blocked: records.filter(d => d.isBlocked).length,
  }), [records]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function updateDSA(d: DSA, action: "verify" | "block" | "unblock") {
    const labels = {
      verify: "verify this DSA",
      block: "block this DSA",
      unblock: "unblock this DSA",
    };

    if (!window.confirm(`Are you sure you want to ${labels[action]}?`)) return;

    setBusyId(d.id);
    setError("");

    try {
      const path = action === "verify"
        ? `/super-admin/dsa/${d.id}/verify`
        : `/super-admin/dsa/${d.id}/block`;

      await apiRequest(path, { method: "PATCH" });

      if (action === "unblock") {
        // The currently documented backend route list does not confirm
        // an unblock endpoint. Do not send an invented API request.
        throw new Error("Unblock API route is not configured in the backend yet.");
      }

      await loadDSAs();
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyId("");
    }
  }

  function exportCSV() {
    const rows = [
      ["DSA ID", "Name", "Email", "Phone", "Joined", "Status"],
      ...filtered.map(d => [
        d.id, getName(d), d.email || "", d.phoneNo || d.phone || "",
        formatDate(d.createdAt), getStatus(d),
      ]),
    ];

    const csv = rows
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "dsa-management.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { label: "Total DSA", value: stats.total, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Verified DSA", value: stats.verified, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pending Review", value: stats.pending, icon: Clock3, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Blocked DSA", value: stats.blocked, icon: UserX, color: "text-rose-400", bg: "bg-rose-400/10" },
  ];

  return (
    <main className="dsa-command-page min-h-screen space-y-6 bg-[#080f1c] p-4 text-[#e6edf5] sm:p-6 lg:p-8">
      <style jsx global>{`
        .dsa-command-page {
          background:
            radial-gradient(ellipse at 8% 0%, rgba(99,102,241,.13), transparent 34%),
            radial-gradient(ellipse at 95% 12%, rgba(6,182,212,.08), transparent 30%),
            #080f1c !important;
        }
        .dsa-command-page > section:not(:first-of-type) {
          border-color: rgba(99,102,241,.20);
        }
        .dsa-command-page h1 { text-shadow: 0 0 28px rgba(99,102,241,.18); }
        .dsa-command-page input:focus, .dsa-command-page select:focus {
          border-color: #818cf8 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,.12);
        }
        .dsa-command-page tbody tr:hover { background: rgba(99,102,241,.07) !important; }
      `}</style>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7892a8]">
            Super Admin <span className="mx-2 text-slate-600">/</span> DSA Management
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">DSA Management</h1>
          <p className="mt-2 text-sm text-[#8fa1b5]">
            Manage DSA partners, review verification and monitor account status.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => void loadDSAs()} disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#34475b] bg-[#152233] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-[#1b3040] disabled:opacity-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-[#34475b] bg-[#152233] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-[#1b3040]">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <section className="relative isolate overflow-hidden rounded-[26px] border border-indigo-400/20 bg-gradient-to-br from-[#101d3b] via-[#111b32] to-[#0c1425] p-6 shadow-[0_22px_60px_rgba(49,46,129,.20)] sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/25 bg-indigo-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-indigo-200">
              <ShieldCheck size={13} /> DSA command centre
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">Direct Selling Agent Operations</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Review registrations, monitor verification status and manage your DSA account network from one control point.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-lg border border-indigo-300/20 bg-indigo-300/10 px-3 py-2 text-indigo-100">Registration control</span>
              <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-cyan-100">Identity verification</span>
              <span className="rounded-lg border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-violet-100">Account governance</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Network size</p>
              <p className="mt-2 text-3xl font-black text-white">{stats.total}</p>
              <p className="mt-1 text-xs text-slate-400">Registered DSA</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">Awaiting review</p>
              <p className="mt-2 text-3xl font-black text-white">{stats.pending}</p>
              <p className="mt-1 text-xs text-slate-400">Pending verification</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-[#263649] bg-[#111b29] p-5 transition hover:border-[#40586d]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9aabba]">{card.label}</span>
                <span className={`rounded-lg p-2.5 ${card.bg} ${card.color}`}>
                  <Icon size={19} />
                </span>
              </div>
              <div className="mt-4 text-3xl font-bold text-white">{card.value}</div>
              <div className="mt-1 text-xs text-[#77899c]">Based on loaded DSA records</div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">DSA API Error</p>
            <p className="mt-1 break-words">{error}</p>
          </div>
          <button onClick={() => setError("")} aria-label="Dismiss error"><X size={17} /></button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-[#263649] bg-[#111b29]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#263649] p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-base font-semibold text-white">DSA Directory</h2>
            <p className="mt-1 text-xs text-[#8193a7]">Search and manage registered DSA accounts</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71869a]" size={16} />
              <input value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, email, phone, ID..."
                className="w-full rounded-lg border border-[#304257] bg-[#0c1521] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#64778b] focus:border-[#4e918b]" />
            </div>
            <select value={filter}
              onChange={e => { setFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-[#304257] bg-[#0c1521] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-[#4e918b]">
              <option>All</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Blocked</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#263649] bg-[#0e1825] px-5 py-3">
          <div className="flex flex-wrap gap-2">
            {["All", "Verified", "Pending", "Blocked"].map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  filter === s ? "bg-[#1c3d40] text-[#a4d9cd]" : "text-[#8497aa] hover:bg-[#1b2938] hover:text-white"
                }`}>{s}</button>
            ))}
          </div>
          <span className="text-xs text-[#8193a7]">{filtered.length} records found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#0d1723]">
              <tr className="text-[11px] uppercase tracking-wider text-[#8294a8]">
                <th className="px-5 py-4">DSA Partner</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">DSA ID</th>
                <th className="px-5 py-4">Joined Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263649]">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-[#8fa1b5]">
                  <RefreshCw className="mx-auto mb-3 animate-spin" size={22} />
                  Loading live DSA records...
                </td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center">
                  <Users className="mx-auto mb-3 text-[#52677c]" size={30} />
                  <p className="text-sm font-semibold text-slate-300">No DSA records found</p>
                  <p className="mt-1 text-xs text-[#8193a7]">Try changing your search or status filter.</p>
                </td></tr>
              ) : visible.map(d => {
                const status = getStatus(d);
                return (
                  <tr key={d.id} className="transition hover:bg-[#172536]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#34485c] bg-[#1c2b3c] text-sm font-bold text-[#b7c8d7]">
                          {getName(d).split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#e5edf5]">{getName(d)}</p>
                          <p className="mt-1 text-xs text-[#8294a8]">{d.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#b3c1cf]">{d.phoneNo || d.phone || "—"}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#91a6ba]">{d.id}</td>
                    <td className="px-5 py-4 text-sm text-[#91a6ba]">{formatDate(d.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelected(d)} title="View details"
                          className="rounded-lg border border-[#34475b] p-2 text-slate-300 hover:bg-[#24364a]">
                          <Eye size={15} />
                        </button>
                        {!d.isVerified && !d.isBlocked && (
                          <button disabled={busyId === d.id} onClick={() => void updateDSA(d, "verify")}
                            className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">
                            Verify
                          </button>
                        )}
                        {!d.isBlocked && (
                          <button disabled={busyId === d.id} onClick={() => void updateDSA(d, "block")}
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 disabled:opacity-50"
                            title="Block DSA">
                            <Ban size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#263649] px-5 py-4">
          <span className="text-xs text-[#8193a7]">
            Page {page} of {totalPages} · {filtered.length} records
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="rounded-lg border border-[#34475b] p-2 text-slate-300 hover:bg-[#24364a] disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="rounded-lg border border-[#34475b] p-2 text-slate-300 hover:bg-[#24364a] disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#34475b] bg-[#111b29] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#263649] p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8193a7]">Partner Profile</p>
                <h3 className="mt-1 text-lg font-bold text-white">DSA Details</h3>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-[#24364a]">
                <X size={19} />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1c3d40] text-lg font-bold text-[#a4d9cd]">
                  {getName(selected).slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{getName(selected)}</p>
                  <p className="text-xs text-[#8193a7]">{selected.id}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <Mail size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Email</p>
                  <p className="mt-1 break-all text-sm text-slate-200">{selected.email || "—"}</p>
                </div>
                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <Phone size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Phone</p>
                  <p className="mt-1 text-sm text-slate-200">{selected.phoneNo || selected.phone || "—"}</p>
                </div>
                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <CalendarDays size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Registration Date</p>
                  <p className="mt-1 text-sm text-slate-200">{formatDate(selected.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <ShieldCheck size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Account Status</p>
                  <p className="mt-1 text-sm text-slate-200">{getStatus(selected)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {!selected.isVerified && !selected.isBlocked && (
                  <button disabled={busyId === selected.id}
                    onClick={() => void updateDSA(selected, "verify")}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                    <CheckCircle2 className="mr-2 inline" size={16} /> Verify DSA
                  </button>
                )}
                {!selected.isBlocked && (
                  <button disabled={busyId === selected.id}
                    onClick={() => void updateDSA(selected, "block")}
                    className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/20 disabled:opacity-50">
                    <Ban className="mr-2 inline" size={16} /> Block Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


