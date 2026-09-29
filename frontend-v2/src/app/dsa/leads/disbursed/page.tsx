"use client";

import { useEffect, useMemo, useState } from "react";
import DsaShell from "@/components/dsa/DsaShell"
import DisbursedHero from "@/components/dsa/DisbursedHero";
import {
  Search,
  RefreshCw,
  Eye,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  IndianRupee,
  CalendarDays,
  Download,
  Filter,
  RotateCcw,
  MoreVertical,
  TrendingUp,
  WalletCards,
  Building2,
} from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

type Lead = {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  loanType?: string;
  amount?: number | string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: string;
  state?: string;
  companyName?: string;
  assignedTo?: string;
  address?: string;
  zipCode?: string;
  panNo?: string;
  dob?: string;
  employmentType?: string;
  monthlyIncome?: number | string;
  existingEmi?: number | string;
  interestRate?: number | string;
  tenureMonths?: number | string;
  monthlyEMI?: number | string;
  purpose?: string;
  remarks?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  source?: string;
  referralCode?: string;
  commissions?: Array<any>;
  documents?: Array<any>;
  user?: any;
  partner?: any;
};

function rupee(value: unknown) {
  const n = Number(value || 0);

  return `${String.fromCharCode(0x20b9)}${n.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cleanLoanType(value?: string) {
  return String(value || "—")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (x) => x.toUpperCase());
}

function getLocation(lead: Lead) {
  return [lead.city, lead.state].filter(Boolean).join(", ") || "—";
}

export default function DisbursedLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [loanType, setLoanType] = useState("ALL");
  const [lender, setLender] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Lead | null>(null);

  async function loadDisbursedLeads() {
    setLoading(true);
    setError("");

    try {
      const storedUser = localStorage.getItem("loan_finance_user");
      const token = localStorage.getItem("loan_finance_token") || "";

      if (!storedUser) {
        throw new Error("DSA login session not found. Please login again.");
      }

      let user: any;

      try {
        user = JSON.parse(storedUser);
      } catch {
        throw new Error("Invalid DSA login session.");
      }

      if (!user?.id) {
        throw new Error("DSA user ID is missing from login session.");
      }

      const endpoint =
        `${API}/dsa/${encodeURIComponent(user.id)}/loans`;

      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const responseText = await response.text();

      let json: any = {};

      try {
        json = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Backend returned invalid JSON. HTTP ${response.status}`
        );
      }

      if (!response.ok || json?.success === false) {
        throw new Error(
          json?.message ||
            `Disbursed Leads API failed. HTTP ${response.status}`
        );
      }

      const rows =
        Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.loans)
          ? json.data.loans
          : Array.isArray(json?.data?.leads)
          ? json.data.leads
          : [];

      const disbursed = rows.filter((item: Lead) =>
        String(item?.status || "")
          .toUpperCase()
          .includes("DISBURSED")
      );

      setLeads(disbursed);
      setPage(1);

      console.log("[DISBURSED LEADS]", {
        endpoint,
        dsaId: user.id,
        records: disbursed.length,
      });
    } catch (err: any) {
      console.error("[DISBURSED LEADS ERROR]", err);

      setLeads([]);

      setError(
        err?.message ||
          "Unable to load disbursed leads from backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDisbursedLeads();
  }, []);

  const loanTypes = useMemo(
    () =>
      Array.from(
        new Set(
          leads
            .map((x) => x.loanType)
            .filter(Boolean)
            .map(String)
        )
      ).sort(),
    [leads]
  );

  const lenders = useMemo(
    () =>
      Array.from(
        new Set(
          leads
            .map((x) => x.companyName)
            .filter(Boolean)
            .map(String)
        )
      ).sort(),
    [leads]
  );

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const searchMatch =
        !q ||
        [
          lead.id,
          lead.fullName,
          lead.phone,
          lead.email,
          lead.loanType,
          lead.companyName,
          lead.city,
          lead.state,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(q)
          );

      const typeMatch =
        loanType === "ALL" ||
        String(lead.loanType || "") === loanType;

      const lenderMatch =
        lender === "ALL" ||
        String(lead.companyName || "") === lender;

      let dateMatch = true;

      if (dateRange !== "ALL" && lead.createdAt) {
        const created = new Date(lead.createdAt);
        const now = new Date();

        if (dateRange === "TODAY") {
          dateMatch =
            created.toDateString() === now.toDateString();
        }

        if (dateRange === "7") {
          dateMatch =
            now.getTime() - created.getTime() <=
            7 * 24 * 60 * 60 * 1000;
        }

        if (dateRange === "30") {
          dateMatch =
            now.getTime() - created.getTime() <=
            30 * 24 * 60 * 60 * 1000;
        }
      }

      return (
        searchMatch &&
        typeMatch &&
        lenderMatch &&
        dateMatch
      );
    });
  }, [
    leads,
    search,
    loanType,
    lender,
    dateRange,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / pageSize)
  );

  const currentLeads = filteredLeads.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const stats = useMemo(() => {
    const totalAmount = leads.reduce(
      (sum, lead) =>
        sum + Number(lead.amount || 0),
      0
    );

    const now = new Date();

    const thisMonth = leads.filter((lead) => {
      if (!lead.createdAt) return false;

      const d = new Date(lead.createdAt);

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length;

    const lastMonth = leads.filter((lead) => {
      if (!lead.createdAt) return false;

      const d = new Date(lead.createdAt);

      const lastMonthDate =
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

      return (
        d.getMonth() === lastMonthDate.getMonth() &&
        d.getFullYear() === lastMonthDate.getFullYear()
      );
    }).length;

    return {
      total: leads.length,
      thisMonth,
      lastMonth,
      totalAmount,
    };
  }, [leads]);

  function resetFilters() {
    setSearch("");
    setLoanType("ALL");
    setLender("ALL");
    setDateRange("ALL");
    setPage(1);
  }

  function exportCSV() {
    const columns = [
      "id",
      "fullName",
      "phone",
      "loanType",
      "companyName",
      "amount",
      "status",
      "city",
      "state",
      "createdAt",
      "updatedAt",
    ];

    const csv = [
      columns.join(","),
      ...filteredLeads.map((lead) =>
        columns
          .map((key) => {
            const value =
              (lead as any)[key] ?? "";

            return `"${String(value).replaceAll('"', '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "dsa-disbursed-leads.csv";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <DsaShell>
      <div className="min-h-screen bg-[#f6f7fc]">

        {/* TOP BAR */}
        <div className="sticky top-0 z-30 border-b border-white/10 bg-[#17124f] text-white shadow-xl">
          <div className="flex items-center gap-4 px-4 py-4 lg:px-7">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Users size={21} />
            </div>

            <div className="relative hidden max-w-xl flex-1 md:block">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
              />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by customer name, phone, loan type, lender, city..."
                className="h-11 w-full rounded-full border border-white/10 bg-white/10 pl-11 pr-5 text-xs font-semibold text-white outline-none placeholder:text-white/45 focus:border-white/30"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={loadDisbursedLeads}
                className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-xs font-black hover:bg-white/20"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

          </div>
        </div>

        <main className="mx-auto max-w-[1700px] space-y-5 px-4 py-5 lg:px-7">

          {/* BREADCRUMB */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-400">
              Dashboard
              <span className="mx-2">›</span>
              Leads
              <span className="mx-2">›</span>
              <span className="font-black text-violet-700">
                Disbursed Leads
              </span>
            </div>

            <button
              onClick={exportCSV}
              disabled={!filteredLeads.length}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-40"
            >
              <Download size={15} />
              Export
            </button>
          </div>
          {/* HERO */}
          <section className="relative min-h-[150px] overflow-hidden rounded-[22px] bg-gradient-to-r from-[#1714a6] via-[#3024d9] to-[#6424e8] px-7 py-6 text-white shadow-xl lg:px-9">

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
              <div className="absolute left-[35%] -top-36 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl" />
              <div className="absolute right-[15%] -bottom-40 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl" />
              <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1400 180" preserveAspectRatio="none">
                <path d="M0 125 C170 15 290 175 470 75 S790 20 980 90 S1200 150 1400 55" fill="none" stroke="#38bdf8" strokeWidth="42" />
                <path d="M0 150 C190 55 300 185 500 95 S820 35 1010 105 S1220 165 1400 75" fill="none" stroke="#8b5cf6" strokeWidth="34" opacity="0.7" />
              </svg>
            </div>

            <div className="relative z-10 flex h-full items-center justify-between gap-6">

              <div className="max-w-[52%]">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100">
                  <span>DSA FINCORP</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[8px] tracking-wider backdrop-blur">
                    REAL-TIME
                  </span>
                </div>

                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                  Disbursed <span className="text-yellow-300">Leads</span>
                </h1>

                <p className="mt-1 text-sm font-medium text-white/90">
                  Track all successfully disbursed loan applications and your earnings.
                </p>
              </div>

              <div className="hidden shrink-0 items-center gap-3 lg:flex">

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[10px] font-bold backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[11px] text-violet-900">⚡</span>
                    Real-time updates
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[10px] font-bold backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">₹</span>
                    Track your earnings
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[10px] font-bold backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">▣</span>
                    Complete customer history
                  </div>
                </div>

                <div className="relative h-32 w-64">

                  <div className="absolute right-16 top-1 h-28 w-28 rounded-full bg-orange-300/20 blur-2xl" />

                  <svg className="absolute right-14 top-0 h-32 w-28 drop-shadow-2xl" viewBox="0 0 140 160" fill="none">
                    <path d="M50 28C50 15 61 7 70 7C79 7 90 15 90 28" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round" />
                    <path d="M52 29H88L96 48H44L52 29Z" fill="#F59E0B" />
                    <path d="M43 44C25 57 18 78 21 109C25 139 44 153 70 153C96 153 115 139 119 109C122 78 115 57 97 44H43Z" fill="url(#moneyBag)" stroke="#FDE68A" strokeWidth="3" />
                    <text x="70" y="111" textAnchor="middle" fontSize="54" fontWeight="900" fill="#7C2D12">₹</text>
                    <defs>
                      <linearGradient id="moneyBag" x1="20" y1="40" x2="120" y2="155">
                        <stop stopColor="#FDE68A" />
                        <stop offset="0.5" stopColor="#F59E0B" />
                        <stop offset="1" stopColor="#EA580C" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute right-3 top-8 flex h-14 w-14 rotate-6 items-center justify-center rounded-full border-4 border-white/70 bg-emerald-500 shadow-2xl">
                    <svg width="31" height="31" viewBox="0 0 40 40">
                      <path d="M8 21L16 29L33 11" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 right-20 h-16 w-12 rotate-6 rounded-lg border-2 border-white/50 bg-white p-1.5 shadow-2xl">
                    <div className="h-1.5 w-7 rounded bg-violet-500" />
                    <div className="mt-2 h-1 w-8 rounded bg-slate-300" />
                    <div className="mt-1.5 h-1 w-6 rounded bg-slate-300" />
                    <div className="mt-1.5 h-1 w-7 rounded bg-slate-300" />
                    <div className="mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-black text-emerald-600">✓</div>
                  </div>

                  <div className="absolute bottom-0 right-0 flex items-end gap-1">
                    <span className="h-5 w-5 rounded-full border-2 border-yellow-100 bg-yellow-400 shadow-lg" />
                    <span className="h-8 w-8 rounded-full border-2 border-yellow-100 bg-yellow-500 shadow-lg" />
                    <span className="h-5 w-5 rounded-full border-2 border-yellow-100 bg-yellow-300 shadow-lg" />
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* KPI CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="relative rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-gradient-to-r from-violet-600 to-blue-500 px-2.5 py-1 text-[9px] font-black tracking-wide text-white shadow-md shadow-violet-500/20">
                ✦ AI
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Total Disbursed</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{stats.total}</p>
                  <p className="mt-1 text-[10px] font-bold text-emerald-600">↑ {stats.lastMonth > 0 ? "Active" : "Live"} records</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Users size={22} />
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-gradient-to-r from-violet-600 to-blue-500 px-2.5 py-1 text-[9px] font-black tracking-wide text-white shadow-md shadow-violet-500/20">
                ✦ AI
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">This Month</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{stats.thisMonth}</p>
                  <p className="mt-1 text-[10px] font-bold text-emerald-600">↑ Current month</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <CalendarDays size={22} />
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-gradient-to-r from-violet-600 to-blue-500 px-2.5 py-1 text-[9px] font-black tracking-wide text-white shadow-md shadow-violet-500/20">
                ✦ AI
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Total Disbursed Amount</p>
                  <p className="mt-2 text-2xl font-black text-emerald-600">{rupee(stats.totalAmount)}</p>
                  <p className="mt-1 text-[10px] font-bold text-emerald-600">↑ Live DB amount</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <IndianRupee size={22} />
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-gradient-to-r from-violet-600 to-blue-500 px-2.5 py-1 text-[9px] font-black tracking-wide text-white shadow-md shadow-violet-500/20">
                ✦ AI
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Commission</p>
                  <p className="mt-2 text-lg font-black text-slate-700">Admin Managed</p>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">Rate will be configured by Super Admin</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <WalletCards size={22} />
                </div>
              </div>
            </div>

          </section>
          {/* FILTERS */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Filter size={18} />
                </div>

                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Disbursed Lead Filters
                  </h2>

                  <p className="text-[11px] font-medium text-slate-500">
                    Search, filter and export your disbursed records.
                  </p>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center gap-2 self-start rounded-xl bg-slate-100 px-4 py-2.5 text-[11px] font-black text-slate-600 hover:bg-violet-50 hover:text-violet-700 lg:self-auto"
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>

            </div>

            <div className="grid gap-3 xl:grid-cols-[1.7fr_1fr_1fr_1fr_auto]">

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search customer, phone, loan type, lender, city or ID..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <select
                value={loanType}
                onChange={(e) => {
                  setLoanType(e.target.value);
                  setPage(1);
                }}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 outline-none focus:border-violet-500"
              >
                <option value="ALL">All Loan Types</option>

                {loanTypes.map((type) => (
                  <option key={type} value={type}>
                    {cleanLoanType(type)}
                  </option>
                ))}
              </select>

              <select
                value={lender}
                onChange={(e) => {
                  setLender(e.target.value);
                  setPage(1);
                }}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 outline-none focus:border-violet-500"
              >
                <option value="ALL">All Lenders</option>

                {lenders.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setPage(1);
                }}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 outline-none focus:border-violet-500"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </select>

              <button
                onClick={() => setPage(1)}
                className="h-12 rounded-xl bg-violet-600 px-6 text-xs font-black text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700"
              >
                <Search size={15} className="mx-auto" />
              </button>

            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="text-sm font-black text-red-700">
                Disbursed Leads API Error
              </p>

              <p className="mt-1 text-xs font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* TABLE */}
          <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-900">
                  Disbursed Lead Records
                </h2>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-[11px] font-black text-violet-700">
                  {filteredLeads.length}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                Show

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-black text-slate-700"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                entries
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[350px] items-center justify-center">
                <div className="text-center">
                  <RefreshCw
                    size={30}
                    className="mx-auto animate-spin text-violet-600"
                  />

                  <p className="mt-4 text-sm font-black text-slate-600">
                    Loading disbursed leads...
                  </p>
                </div>
              </div>
            ) : currentLeads.length === 0 ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-50 text-violet-500">
                  <WalletCards size={34} />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-800">
                  No Disbursed Leads Found
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Successfully disbursed applications assigned to your DSA
                  account will appear here automatically.
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1450px]">

                  <thead className="bg-gradient-to-r from-[#2b146e] to-[#4d249e]">

                    <tr className="text-left text-[10px] font-black uppercase tracking-wider text-white">

                      <th className="px-5 py-4">#</th>
                      <th className="px-5 py-4">Action</th>
                      <th className="px-5 py-4">Customer Name</th>
                      <th className="px-5 py-4">Product</th>
                      <th className="px-5 py-4">Lender</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Disbursed Date</th>
                      <th className="px-5 py-4">Advisor Details</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">More</th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {currentLeads.map((lead, index) => (
                      <tr
                        key={lead.id}
                        className="group transition hover:bg-violet-50/40"
                      >

                        <td className="px-5 py-5 text-xs font-black text-slate-400">
                          {(page - 1) * pageSize + index + 1}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-1.5">

                            <button
                              onClick={() => setSelected(lead)}
                              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-[10px] font-black text-white hover:bg-violet-700"
                            >
                              <Eye size={12} />
                              View
                            </button>

                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-[10px] font-black text-white hover:bg-emerald-600"
                              >
                                <Phone size={12} />
                                Call
                              </a>
                            )}

                            {lead.phone && (
                              <a
                                href={`https://wa.me/91${lead.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600"
                                title="WhatsApp"
                              >
                                <MessageCircle size={14} />
                              </a>
                            )}

                          </div>
                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700">
                              {(lead.fullName || "L")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-black text-slate-900">
                                {lead.fullName || "Unnamed Customer"}
                              </p>

                              <p className="mt-1 text-[11px] font-semibold text-slate-400">
                                {lead.phone || "—"}
                              </p>
                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <p className="font-black text-orange-600">
                            {cleanLoanType(lead.loanType)}
                          </p>

                          <p className="mt-1 text-[10px] font-bold text-slate-400">
                            Loan Application
                          </p>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <Building2 size={15} />
                            </div>

                            <span className="text-xs font-black text-slate-800">
                              {lead.companyName || "—"}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-5">
                          <span className="text-sm font-black text-slate-900">
                            {rupee(lead.amount)}
                          </span>
                        </td>

                        <td className="px-5 py-5">

                          <p className="text-xs font-black text-slate-700">
                            {formatDate(
                              lead.updatedAt ||
                              lead.createdAt
                            )}
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-slate-400">
                            Applied: {formatDate(lead.createdAt)}
                          </p>

                        </td>

                        <td className="px-5 py-5">

                          <p className="font-black text-slate-800">
                            DSA Agent
                          </p>

                          <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-black text-red-500">
                            Agent
                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-700">
                            Disbursed
                          </span>

                        </td>

                        <td className="px-5 py-5">

                          <button
                            onClick={() => setSelected(lead)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <MoreVertical size={17} />
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              </div>
            )}

            {/* PAGINATION */}
            {!loading && filteredLeads.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-[11px] font-bold text-slate-500">
                  Showing{" "}
                  {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(
                    page * pageSize,
                    filteredLeads.length
                  )}{" "}
                  of {filteredLeads.length} entries
                </p>

                <div className="flex items-center gap-2">

                  <button
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((p) =>
                        Math.max(1, p - 1)
                      )
                    }
                    className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-500 disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </button>

                  <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-violet-600 px-3 text-xs font-black text-white">
                    {page}
                  </div>

                  <button
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          totalPages,
                          p + 1
                        )
                      )
                    }
                    className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>

                </div>

              </div>
            )}

          </section>

        </main>

        {/* ADVANCED LARGE TEXT LOAN DETAIL VIEW */}
        {selected && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 p-2 backdrop-blur-xl sm:p-5 lg:p-7">
            <div className="mx-auto my-2 w-full max-w-[1400px] overflow-hidden rounded-[34px] border border-white/20 bg-[#f4f6fb] shadow-[0_40px_140px_rgba(0,0,0,0.5)] sm:my-5">

              {/* PREMIUM HEADER */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#12082f] via-[#382080] to-[#7627df] text-white">
                <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                  <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex min-w-0 items-center gap-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-white/15 text-2xl font-black shadow-2xl ring-1 ring-white/25 backdrop-blur-xl sm:h-20 sm:w-20 sm:text-3xl">
                        {(selected.fullName || "C").trim().charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                            Loan Details
                          </span>
                          <span className="rounded-full bg-emerald-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-950 shadow-lg">
                            {selected.status || "DISBURSED"}
                          </span>
                        </div>

                        <h2 className="mt-3 truncate text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                          {selected.fullName || "Customer"}
                        </h2>

                        <p className="mt-2 truncate text-xs font-bold text-violet-200 sm:text-sm">
                          Application ID · {selected.id}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/15 bg-white/10 px-6 py-5 shadow-2xl backdrop-blur-xl lg:min-w-[270px]">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">
                        Disbursed Amount
                      </p>
                      <p className="mt-1 text-3xl font-black sm:text-4xl">
                        {rupee(selected.amount)}
                      </p>
                      <p className="mt-2 text-xs font-bold text-violet-200">
                        {cleanLoanType(selected.loanType)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ["Customer Mobile", selected.phone || "—"],
                      ["Lender", selected.companyName || "—"],
                      ["Loan Product", cleanLoanType(selected.loanType)],
                      ["Applied Date", formatDate(selected.createdAt)],
                    ].map(([label,value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.09] px-5 py-4 backdrop-blur-md">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-200">{label}</p>
                        <p className="mt-2 truncate text-base font-black text-white sm:text-lg">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT */}
              <div className="space-y-6 p-4 sm:p-7 lg:p-9">

                {/* CUSTOMER */}
                <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">01 · Customer</p>
                      <h3 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">Customer Details</h3>
                    </div>
                    <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-blue-700">
                      Profile
                    </span>
                  </div>

                  <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["Full Name", selected.fullName],
                      ["Mobile Number", selected.phone],
                      ["Email Address", selected.email],
                      ["Date of Birth", selected.dob],
                      ["PAN Number", selected.panNo],
                      ["Pincode", selected.zipCode],
                      ["City", selected.city],
                      ["State", selected.state],
                      ["Address", selected.address],
                    ].map(([label,value],i) => (
                      <div key={label} className={`border-b border-slate-100 px-6 py-5 ${i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}`}>
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="mt-2 break-words text-base font-bold leading-6 text-slate-800 sm:text-[17px]">
                          {value || "Not available"}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ADVISOR + STATUS */}
                <div className="grid gap-6 lg:grid-cols-5">

                  <section className="lg:col-span-3 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white px-6 py-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">02 · Assignment</p>
                      <h3 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">Advisor / DSA Details</h3>
                    </div>

                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                      {[
                        ["Assigned DSA ID", selected.assignedTo],
                        ["Source", selected.source],
                        ["Referral Code", selected.referralCode],
                        ["Partner ID", selected.partner?.id],
                      ].map(([label,value]) => (
                        <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
                          <p className="mt-2 break-all text-base font-black text-slate-800">{value || "Not available"}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="lg:col-span-2 rounded-[26px] bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 p-6 text-white shadow-xl shadow-violet-200">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">Current Status</p>
                    <div className="mt-5 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
                        ✓
                      </div>
                      <div>
                        <p className="text-2xl font-black">{selected.status || "DISBURSED"}</p>
                        <p className="mt-1 text-sm font-semibold text-violet-200">Loan successfully processed</p>
                      </div>
                    </div>

                    <div className="mt-7 rounded-2xl border border-white/10 bg-white/10 p-5">
                      <p className="text-[10px] font-black uppercase tracking-wide text-violet-200">Last Updated</p>
                      <p className="mt-2 text-lg font-black">{formatDate(selected.updatedAt)}</p>
                    </div>
                  </section>

                </div>

                {/* LENDER */}
                <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600">03 · Finance</p>
                      <h3 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">Lender & Loan Details</h3>
                    </div>
                    <span className="w-fit rounded-full bg-indigo-100 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                      {cleanLoanType(selected.loanType)}
                    </span>
                  </div>

                  <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ["Lender Name", selected.companyName],
                      ["Loan Type", cleanLoanType(selected.loanType)],
                      ["Loan Amount", rupee(selected.amount)],
                      ["Employment Type", selected.employmentType],
                      ["Monthly Income", selected.monthlyIncome ? rupee(selected.monthlyIncome) : "—"],
                      ["Existing EMI", selected.existingEmi ? rupee(selected.existingEmi) : "—"],
                      ["Interest Rate", selected.interestRate ? `${selected.interestRate}%` : "—"],
                      ["Loan Tenure", selected.tenureMonths ? `${selected.tenureMonths} Months` : "—"],
                      ["Monthly EMI", selected.monthlyEMI ? rupee(selected.monthlyEMI) : "—"],
                      ["Loan Purpose", selected.purpose],
                    ].map(([label,value]) => (
                      <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="mt-2 truncate text-base font-black text-slate-800">{value || "Not recorded"}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* JOURNEY */}
                <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] sm:p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">04 · Tracking</p>
                      <h3 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">Loan Journey</h3>
                    </div>
                    <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      Completed
                    </span>
                  </div>

                  <div className="relative mt-9 grid gap-6 md:grid-cols-3">
                    <div className="absolute left-[16%] right-[16%] top-7 hidden h-1 rounded-full bg-gradient-to-r from-blue-300 via-emerald-300 to-emerald-500 md:block" />

                    {[
                      ["01","Applied",selected.createdAt,"Application created"],
                      ["02","Approved",selected.approvedAt,selected.approvedBy ? `Approved by ${selected.approvedBy}` : "Approval information"],
                      ["03","Disbursed",selected.updatedAt,"Loan marked as disbursed"],
                    ].map(([no,title,date,remark]) => (
                      <div key={title} className="relative">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sm font-black text-emerald-700 shadow-xl ring-4 ring-emerald-50">
                          {no}
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
                          <p className="text-lg font-black text-slate-950">{title}</p>
                          <p className="mt-1 text-xs font-bold text-slate-400">{formatDate(date)}</p>
                          <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                            {remark || "Not recorded"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selected.remarks && (
                    <div className="mt-6 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-600">Remarks</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-amber-950">{selected.remarks}</p>
                    </div>
                  )}
                </section>

                {/* COMMISSION */}
                <section className="overflow-hidden rounded-[26px] border border-orange-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-col gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-600">05 · Earnings</p>
                      <h3 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">Advisor Commission</h3>
                    </div>
                    <span className="w-fit rounded-full bg-orange-100 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-orange-700">
                      Admin Managed
                    </span>
                  </div>

                  <div className="p-6">
                    {selected.commissions?.length ? (
                      <div className="space-y-4">
                        {selected.commissions.map((commission:any,index:number) => (
                          <div key={commission.id || index} className="overflow-hidden rounded-2xl border border-slate-200">
                            <div className="grid gap-5 bg-slate-50 p-6 sm:grid-cols-2 lg:grid-cols-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Loan Amount</p>
                                <p className="mt-2 text-lg font-black text-slate-900">{rupee(commission.loanAmount || selected.amount)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Commission Amount</p>
                                <p className="mt-2 text-2xl font-black text-orange-600">{rupee(commission.commissionAmount ?? commission.amount)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Commission Status</p>
                                <p className="mt-2 text-base font-black text-slate-900">{commission.status || "PENDING"}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Created Date</p>
                                <p className="mt-2 text-base font-bold text-slate-700">{formatDate(commission.createdAt)}</p>
                              </div>
                            </div>

                            <div className="grid gap-5 border-t border-slate-100 p-6 sm:grid-cols-3">
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Source</p>
                                <p className="mt-2 text-sm font-bold text-slate-700">{commission.source || "Not recorded"}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Approved Date</p>
                                <p className="mt-2 text-sm font-bold text-slate-700">{formatDate(commission.approvedAt)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Loan Type</p>
                                <p className="mt-2 text-sm font-bold text-slate-700">{cleanLoanType(selected.loanType)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-xl font-black text-orange-600">
                          ₹
                        </div>
                        <p className="mt-4 text-lg font-black text-slate-800">Commission Not Generated</p>
                        <p className="mx-auto mt-2 max-w-lg text-sm font-semibold leading-6 text-slate-400">
                          Commission rate and payout will be configured and managed by Super Admin.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

              </div>

              {/* FOOTER */}
              <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Application ID</p>
                  <p className="mt-1 truncate text-sm font-black text-slate-700">{selected.id}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selected.phone && (
                    <>
                      <a
                        href={`tel:${selected.phone}`}
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-slate-800"
                      >
                        <Phone size={15} />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/91${selected.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-emerald-600"
                      >
                        <MessageCircle size={15} />
                        WhatsApp
                      </a>
                    </>
                  )}

                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    Close Details
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>    </DsaShell>
  );
}














