"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, Users, UserCheck, UserX, Clock3, Download,
  RefreshCw, Eye, X, ShieldCheck, Ban, CheckCircle2,
  AlertCircle, Mail, Phone, CalendarDays, ChevronLeft,
  ChevronRight, Building2
} from "lucide-react";

type Partner = {
  sourceType?: "DSA" | "PARTNER";
  id: string;
  name?: string;
  fullName?: string;
  partnerName?: string;
  businessName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  phoneNo?: string;
  mobile?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("loan_finance_token") || "";
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
    throw new Error(
      result.message || result.error || `API Error ${response.status}`
    );
  }

  return result;
}

function partnerName(p: Partner) {
  return p.companyName || p.partnerName || p.name || p.fullName ||
    p.businessName || p.companyName || "Unnamed Partner";
}

function partnerPhone(p: Partner) {
  return p.phone || p.phoneNo || p.mobile || "â€”";
}

function partnerStatus(p: Partner) {
  if (p.isBlocked === true || String(p.status).toLowerCase() === "blocked") {
    return "Blocked";
  }
  if (p.isVerified === true || ["verified", "approved"].includes(String(p.status).toLowerCase())) {
    return "Verified";
  }
  return "Pending";
}

function dateFormat(value?: string) {
  if (!value) return "â€”";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "â€”"
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

export default function PartnerManagementPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [busyId, setBusyId] = useState("");
  const pageSize = 8;

  const loadPartners = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [partnerResult, dsaResult] = await Promise.all([
        apiRequest("/super-admin/partners"),
        apiRequest("/super-admin/dsa"),
      ]);

      const partnerData = Array.isArray(partnerResult)
        ? partnerResult
        : partnerResult.data || partnerResult.partners || [];

      const dsaData = Array.isArray(dsaResult)
        ? dsaResult
        : dsaResult.data || dsaResult.dsas || dsaResult.users || [];

      if (!Array.isArray(partnerData) || !Array.isArray(dsaData)) {
        throw new Error("Unexpected Partner or DSA API response.");
      }

      const partnersWithType = partnerData.map((p: Partner) => ({
        ...p,
        sourceType: "PARTNER" as const,
      }));

      const dsasAsPartners = dsaData.map((d: Partner) => ({
        ...d,
        sourceType: "DSA" as const,
        partnerName: d.name || d.fullName || "Unnamed DSA",
        businessName: "DSA Account",
      }));

      setPartners([...partnersWithType, ...dsasAsPartners]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load partners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPartners();
  }, [loadPartners]);

  const stats = useMemo(() => ({
    total: partners.length,
    verified: partners.filter(p => partnerStatus(p) === "Verified").length,
    pending: partners.filter(p => partnerStatus(p) === "Pending").length,
    blocked: partners.filter(p => partnerStatus(p) === "Blocked").length,
  }), [partners]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return partners.filter(p => {
      const matchesSearch = [
        partnerName(p),
        p.email || "",
        partnerPhone(p),
        p.id,
        p.businessName || "",
        p.companyName || "",
      ].some(v => String(v).toLowerCase().includes(q));

      return matchesSearch &&
        (filter === "All" || partnerStatus(p) === filter);
    });
  }, [partners, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function updatePartner(p: Partner, action: "verify" | "block") {
    const actionText = action === "verify" ? "verify" : "block";

    if (!window.confirm(`Are you sure you want to ${actionText} this partner?`)) {
      return;
    }

    setBusyId(p.id);
    setError("");

    try {
      const endpoint = p.sourceType === "DSA" ? "dsa" : "partners";
      await apiRequest(`/super-admin/${endpoint}/${p.id}/${action}`, {
        method: "PATCH",
      });

      await loadPartners();
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Partner update failed.");
    } finally {
      setBusyId("");
    }
  }

  function exportCSV() {
    const rows = [
      ["Record Type", "Partner ID", "Partner Name", "Email", "Phone", "Business", "Joined", "Status"],
      ...filtered.map(p => [
        p.sourceType || "PARTNER",
        p.id,
        partnerName(p),
        p.email || "",
        partnerPhone(p),
        p.businessName || p.companyName || "",
        dateFormat(p.createdAt),
        partnerStatus(p),
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
    a.download = "partner-management.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { label: "Total Partners", value: stats.total, icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Verified Partners", value: stats.verified, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pending Approvals", value: stats.pending, icon: Clock3, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Blocked Partners", value: stats.blocked, icon: UserX, color: "text-rose-400", bg: "bg-rose-400/10" },
  ];

  return (
    <main className="partner-premium-page min-h-screen space-y-6 bg-[#071713] p-4 text-[#e6edf5] sm:p-6 lg:p-8">
      <style jsx global>{`
  .partner-premium-page {
    background:
      radial-gradient(ellipse at 10% 0%, rgba(16,185,129,.12), transparent 38%),
      radial-gradient(ellipse at 95% 15%, rgba(20,184,166,.09), transparent 32%),
      #080f1b !important;
  }

  .partner-premium-page > div:nth-of-type(2) > div {
    position: relative;
    overflow: hidden;
    background: linear-gradient(145deg, rgba(20,35,54,.98), rgba(12,24,39,.96)) !important;
    border: 1px solid rgba(52,211,153,.22) !important;
    border-radius: 18px !important;
    box-shadow: 0 12px 35px rgba(0,0,0,.16);
    transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
  }

  .partner-premium-page > div:nth-of-type(2) > div:hover {
    transform: translateY(-4px);
    border-color: rgba(52,211,153,.48) !important;
    box-shadow: 0 15px 38px rgba(5,150,105,.14);
  }

  .partner-premium-page section {
    border: 1px solid rgba(83,155,190,.24) !important;
    border-radius: 18px !important;
    overflow: hidden;
    background: linear-gradient(150deg, #111e2e, #0d1928) !important;
    box-shadow: 0 18px 45px rgba(0,0,0,.20);
  }

  .partner-premium-page input,
  .partner-premium-page select {
    border-color: rgba(91,139,170,.32) !important;
    background-color: rgba(5,15,28,.82) !important;
    transition: border-color .2s ease, box-shadow .2s ease;
  }

  .partner-premium-page input:focus,
  .partner-premium-page select:focus {
    border-color: #34d399 !important;
    box-shadow: 0 0 0 3px rgba(52,211,153,.10);
  }

  .partner-premium-page tbody tr {
    transition: background .2s ease;
  }

  .partner-premium-page tbody tr:hover {
    background: rgba(52,211,153,.05) !important;
  }

  .partner-premium-page button {
    transition: all .2s ease;
  }

  .partner-premium-page button:active {
    transform: scale(.97);
  }

  .partner-premium-page thead th {
    letter-spacing: .12em;
    color: #8eabc5 !important;
  }

  .partner-premium-page h1 {
    letter-spacing: -.035em;
    text-shadow: 0 3px 25px rgba(52,211,153,.12);
  }

  @media (max-width: 640px) {
    .partner-premium-page {
      padding: 14px !important;
    }
  }
`}</style>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7892a8]">
            Super Admin <span className="mx-2 text-slate-600">/</span> Partner Management
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Partner Management
          </h1>
          <p className="mt-2 text-sm text-[#8fa1b5]">
            Manage business partners, review applications and control partner accounts.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => void loadPartners()} disabled={loading}
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

      <section className="relative isolate overflow-hidden rounded-[26px] border border-emerald-400/20 bg-gradient-to-br from-[#0d2a25] via-[#10231f] to-[#0b1918] p-6 shadow-[0_22px_60px_rgba(5,150,105,.16)] sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.35fr_.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-emerald-200">
              <Building2 size={13} /> Business partner network
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">Partner Relationship Hub</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Manage business relationships, review partner onboarding and maintain a trusted distribution network.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-emerald-100">Business onboarding</span>
              <span className="rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-2 text-teal-100">Partner approval</span>
              <span className="rounded-lg border border-lime-300/20 bg-lime-300/10 px-3 py-2 text-lime-100">Network governance</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Partner network</p>
              <p className="mt-2 text-3xl font-black text-white">{stats.total}</p>
              <p className="mt-1 text-xs text-slate-400">Loaded partner records</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200">Needs approval</p>
              <p className="mt-2 text-3xl font-black text-white">{stats.pending}</p>
              <p className="mt-1 text-xs text-slate-400">Pending partner review</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label}
              className="rounded-xl border border-[#263649] bg-[#111b29] p-5 transition hover:border-[#40586d]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9aabba]">{card.label}</span>
                <span className={`rounded-lg p-2.5 ${card.bg} ${card.color}`}>
                  <Icon size={19} />
                </span>
              </div>
              <div className="mt-4 text-3xl font-bold text-white">{card.value}</div>
              <div className="mt-1 text-xs text-[#77899c]">Based on loaded partner records</div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Partner API Error</p>
            <p className="mt-1 break-words">{error}</p>
          </div>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={17} />
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-[#263649] bg-[#111b29]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#263649] p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-base font-semibold text-white">Partner Directory</h2>
            <p className="mt-1 text-xs text-[#8193a7]">
              Search and manage registered business partners
            </p>
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
              <option value="All">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#263649] bg-[#0e1825] px-5 py-3">
          <div className="flex flex-wrap gap-2">
            {["All", "Verified", "Pending", "Blocked"].map(s => (
              <button key={s}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  filter === s
                    ? "bg-[#1c3d40] text-[#a4d9cd]"
                    : "text-[#8497aa] hover:bg-[#1b2938] hover:text-white"
                }`}>
                {s}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#8193a7]">{filtered.length} records found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#0d1723]">
              <tr className="text-[11px] uppercase tracking-wider text-[#8294a8]">
                <th className="px-5 py-4">Partner</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Business</th>
                <th className="px-5 py-4">Partner ID</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#263649]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-[#8fa1b5]">
                    <RefreshCw className="mx-auto mb-3 animate-spin" size={22} />
                    Loading live partner records...
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Building2 className="mx-auto mb-3 text-[#52677c]" size={30} />
                    <p className="text-sm font-semibold text-slate-300">No partners found</p>
                    <p className="mt-1 text-xs text-[#8193a7]">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              ) : visible.map(p => {
                const status = partnerStatus(p);
                return (
                  <tr key={p.id} className="transition hover:bg-[#172536]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#34485c] bg-[#1c2b3c] text-sm font-bold text-[#b7c8d7]">
                          {partnerName(p).split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#e5edf5]">{partnerName(p)}</p>
                          <p className="mt-1 text-xs text-[#8294a8]">{p.email || "No email"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#b3c1cf]">{partnerPhone(p)}</td>
                    <td className="px-5 py-4 text-sm text-[#91a6ba]">
                      {p.businessName || p.companyName || "â€”"}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#91a6ba]">{p.id}</td>
                    <td className="px-5 py-4 text-sm text-[#91a6ba]">{dateFormat(p.createdAt)}</td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelected(p)} title="View details"
                          className="rounded-lg border border-[#34475b] p-2 text-slate-300 hover:bg-[#24364a]">
                          <Eye size={15} />
                        </button>

                        {status === "Pending" && (
                          <button disabled={busyId === p.id}
                            onClick={() => void updatePartner(p, "verify")}
                            className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">
                            Verify
                          </button>
                        )}

                        {status !== "Blocked" && (
                          <button disabled={busyId === p.id}
                            onClick={() => void updatePartner(p, "block")}
                            title="Block partner"
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 disabled:opacity-50">
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
            Page {page} of {totalPages} Â· {filtered.length} records
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-lg border border-[#34475b] p-2 text-slate-300 hover:bg-[#24364a] disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg border border-[#34475b] p-2 text-slate-300 hover:bg-[#24364a] disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setSelected(null);
          }}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#34475b] bg-[#111b29] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#263649] p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8193a7]">Partner Profile</p>
                <h3 className="mt-1 text-lg font-bold text-white">Partner Details</h3>
              </div>
              <button onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-[#24364a]">
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1c3d40] text-lg font-bold text-[#a4d9cd]">
                  {partnerName(selected).slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{partnerName(selected)}</p>
                  <p className="text-xs text-[#8193a7]">{selected.id}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <Mail size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Email</p>
                  <p className="mt-1 break-all text-sm text-slate-200">{selected.email || "â€”"}</p>
                </div>

                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <Phone size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Phone</p>
                  <p className="mt-1 text-sm text-slate-200">{partnerPhone(selected)}</p>
                </div>

                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <Building2 size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Business</p>
                  <p className="mt-1 text-sm text-slate-200">
                    {selected.businessName || selected.companyName || "â€”"}
                  </p>
                </div>

                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3">
                  <CalendarDays size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Registration Date</p>
                  <p className="mt-1 text-sm text-slate-200">{dateFormat(selected.createdAt)}</p>
                </div>

                <div className="rounded-lg border border-[#263649] bg-[#0c1521] p-3 sm:col-span-2">
                  <ShieldCheck size={15} className="mb-2 text-sky-400" />
                  <p className="text-xs text-[#8193a7]">Account Status</p>
                  <p className="mt-1 text-sm text-slate-200">{partnerStatus(selected)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {partnerStatus(selected) === "Pending" && (
                  <button disabled={busyId === selected.id}
                    onClick={() => void updatePartner(selected, "verify")}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                    <CheckCircle2 className="mr-2 inline" size={16} />
                    Verify Partner
                  </button>
                )}

                {partnerStatus(selected) !== "Blocked" && (
                  <button disabled={busyId === selected.id}
                    onClick={() => void updatePartner(selected, "block")}
                    className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/20 disabled:opacity-50">
                    <Ban className="mr-2 inline" size={16} />
                    Block Partner
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



