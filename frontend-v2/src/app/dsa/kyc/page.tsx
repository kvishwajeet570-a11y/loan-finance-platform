"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DsaShell from "@/components/dsa/DsaShell";
import {
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  Check,
  X,
  FileCheck2,
  CreditCard,
  Building2,
  UserRound,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  LockKeyhole,
  Fingerprint,
  BadgeCheck,
  FileText,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type KycRecord = {
  id: string;
  userId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  panNo?: string;
  panNumber?: string;
  aadhaarNo?: string;
  aadhaarNumber?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: string;
  state?: string;
  address?: string;
  panVerified?: boolean;
  aadhaarVerified?: boolean;
  bankVerified?: boolean;
  bankAccountVerified?: boolean;
  documentVerified?: boolean;
  [key: string]: any;
};

type DashboardStats = {
  total?: number;
  totalKyc?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  underReview?: number;
  [key: string]: any;
};

function getAuth() {
  if (typeof window === "undefined") {
    return { user: null, headers: {} as Record<string, string> };
  }

  const raw = localStorage.getItem("loan_finance_user");
  const token = localStorage.getItem("loan_finance_token");

  let user: any = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { user, headers };
}

function normaliseStatus(status?: string) {
  return String(status || "PENDING")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mask(value?: string) {
  if (!value) return "Not available";

  if (value.length <= 4) return value;

  return `${"•".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

function statusLabel(status?: string) {
  const value = normaliseStatus(status);

  if (value === "UNDER_REVIEW" || value === "IN_REVIEW") {
    return "Under Review";
  }

  if (value === "APPROVED" || value === "VERIFIED") {
    return "Approved";
  }

  if (value === "REJECTED") {
    return "Rejected";
  }

  return "Pending";
}

function statusStyle(status?: string) {
  const value = normaliseStatus(status);

  if (value === "APPROVED" || value === "VERIFIED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value === "REJECTED") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (value === "UNDER_REVIEW" || value === "IN_REVIEW") {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function extractList(json: any): KycRecord[] {
  const candidates = [
    json?.data,
    json?.data?.data,
    json?.data?.kyc,
    json?.data?.kycs,
    json?.kyc,
    json?.kycs,
    json?.records,
    json?.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function extractStats(json: any): DashboardStats {
  return (
    json?.data?.stats ||
    json?.stats ||
    json?.data ||
    {}
  );
}

export default function DsaKycPage() {
  const router = useRouter();

  const [records, setRecords] = useState<KycRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selected, setSelected] = useState<KycRecord | null>(null);
  const [actionLoading, setActionLoading] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [error, setError] = useState("");

  const loadKyc = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const { headers } = getAuth();

      const [kycResponse, dashboardResponse] = await Promise.all([
        fetch(`${API}/kyc`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${API}/kyc/dashboard`, {
          headers,
          cache: "no-store",
        }),
      ]);

      if (!kycResponse.ok) {
        throw new Error(`KYC API returned ${kycResponse.status}`);
      }

      const kycJson = await kycResponse.json();

      let dashboardJson: any = {};

      if (dashboardResponse.ok) {
        dashboardJson = await dashboardResponse.json();
      }

      setRecords(extractList(kycJson));
      setStats(extractStats(dashboardJson));
    } catch (err: any) {
      setError(err?.message || "Unable to load KYC records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadKyc();
  }, []);

  const counts = useMemo(() => {
    const result = {
      ALL: records.length,
      PENDING: 0,
      UNDER_REVIEW: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    records.forEach((record) => {
      const status = normaliseStatus(record.status);

      if (status === "APPROVED" || status === "VERIFIED") {
        result.APPROVED += 1;
      } else if (status === "REJECTED") {
        result.REJECTED += 1;
      } else if (
        status === "UNDER_REVIEW" ||
        status === "IN_REVIEW"
      ) {
        result.UNDER_REVIEW += 1;
      } else {
        result.PENDING += 1;
      }
    });

    return result;
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();

    return records.filter((record) => {
      const status = normaliseStatus(record.status);

      const matchesTab =
        activeTab === "ALL" ||
        (activeTab === "APPROVED" &&
          (status === "APPROVED" || status === "VERIFIED")) ||
        (activeTab === "REJECTED" && status === "REJECTED") ||
        (activeTab === "UNDER_REVIEW" &&
          (status === "UNDER_REVIEW" || status === "IN_REVIEW")) ||
        (activeTab === "PENDING" &&
          !["APPROVED", "VERIFIED", "REJECTED", "UNDER_REVIEW", "IN_REVIEW"].includes(status));

      if (!matchesTab) return false;

      if (!q) return true;

      const haystack = [
        record.fullName,
        record.name,
        record.email,
        record.phone,
        record.panNo,
        record.panNumber,
        record.id,
        record.userId,
        record.city,
        record.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [records, query, activeTab]);

  const totalKyc =
    Number(stats.totalKyc ?? stats.total ?? counts.ALL) || 0;

  const pending =
    Number(stats.pending ?? counts.PENDING) || 0;

  const approved =
    Number(stats.approved ?? counts.APPROVED) || 0;

  const rejected =
    Number(stats.rejected ?? counts.REJECTED) || 0;

  const underReview =
    Number(stats.underReview ?? counts.UNDER_REVIEW) || 0;

  const approvalRate =
    totalKyc > 0 ? Math.round((approved / totalKyc) * 100) : 0;

  const approveKyc = async (record: KycRecord) => {
    setActionLoading(`approve-${record.id}`);

    try {
      const { user, headers } = getAuth();

      const response = await fetch(`${API}/kyc/${record.id}/approve`, {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user?.id,
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          json?.message || "Unable to approve KYC."
        );
      }

      setSelected(null);
      await loadKyc(true);
    } catch (err: any) {
      setError(err?.message || "Unable to approve KYC.");
    } finally {
      setActionLoading("");
    }
  };

  const rejectKyc = async () => {
    if (!selected) return;

    setActionLoading(`reject-${selected.id}`);

    try {
      const { headers } = getAuth();

      const response = await fetch(`${API}/kyc/${selected.id}/reject`, {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: rejectReason.trim() || "KYC verification rejected.",
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          json?.message || "Unable to reject KYC."
        );
      }

      setShowReject(false);
      setRejectReason("");
      setSelected(null);
      await loadKyc(true);
    } catch (err: any) {
      setError(err?.message || "Unable to reject KYC.");
    } finally {
      setActionLoading("");
    }
  };

  const statCards = [
    {
      title: "Total KYC",
      value: totalKyc,
      subtitle: "Verification records",
      icon: ShieldCheck,
      iconBox: "bg-blue-50 text-blue-600",
      accent: "from-blue-600 to-cyan-500",
    },
    {
      title: "Pending",
      value: pending,
      subtitle: "Waiting for review",
      icon: Clock3,
      iconBox: "bg-amber-50 text-amber-600",
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Approved",
      value: approved,
      subtitle: `${approvalRate}% approval rate`,
      icon: CheckCircle2,
      iconBox: "bg-emerald-50 text-emerald-600",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      title: "Rejected",
      value: rejected,
      subtitle: "Verification rejected",
      icon: XCircle,
      iconBox: "bg-rose-50 text-rose-600",
      accent: "from-rose-500 to-red-500",
    },
  ];

  const tabs = [
    ["ALL", "All KYC", counts.ALL],
    ["PENDING", "Pending", counts.PENDING],
    ["UNDER_REVIEW", "Under Review", counts.UNDER_REVIEW],
    ["APPROVED", "Approved", counts.APPROVED],
    ["REJECTED", "Rejected", counts.REJECTED],
  ] as const;

  return (
    <DsaShell>
      <div className="min-h-screen bg-[#f5f8fc] text-slate-900">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">

          {/* HERO */}
          <section className="relative mb-6 overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#0b1f4d] via-[#123d88] to-[#087f9b] px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,55,110,0.20)] sm:px-8">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
                  <Sparkles size={13} />
                  Secure Verification Center
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  KYC Verification
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                  Review customer identity documents, verify submitted
                  information and manage KYC decisions from one secure workspace.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur md:block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/15 p-2.5">
                      <LockKeyhole size={21} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                        Verification
                      </p>
                      <p className="text-sm font-bold">Secure & Active</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => loadKyc(true)}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                >
                  <RefreshCw
                    size={17}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </section>

          {/* SEARCH + QUICK INFO */}
          <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_10px_35px_rgba(15,23,42,0.05)] lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customer, PAN, phone, email or KYC ID..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
              <SlidersHorizontal size={17} />
              Filters
            </button>

            <div className="flex h-12 items-center gap-2 rounded-xl bg-slate-50 px-4 text-xs font-semibold text-slate-500">
              <Fingerprint size={17} className="text-blue-600" />
              {filteredRecords.length} records
            </div>
          </section>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-bold">Unable to load or update KYC</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="rounded-lg p-1 hover:bg-rose-100"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* KPI CARDS */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
                  />

                  <div className="flex items-start justify-between">
                    <div className={`rounded-2xl p-3 ${card.iconBox}`}>
                      <Icon size={21} />
                    </div>

                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                      LIVE
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-3xl font-black tracking-tight text-slate-950">
                      {loading ? "—" : card.value}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {card.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* SECONDARY INSIGHT */}
          <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                      <BadgeCheck size={18} />
                    </div>
                    <h2 className="text-base font-black text-slate-900">
                      Verification Overview
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Current KYC distribution from the verification system
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                    Pending {pending}
                  </span>
                  <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">
                    Review {underReview}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                    Approved {approved}
                  </span>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(0, approvalRate))}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400">
                <span>Verification progress</span>
                <span>{approvalRate}% approved</span>
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200/80 bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white shadow-[0_15px_40px_rgba(15,23,42,0.14)]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2.5">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-black">Secure KYC</p>
                  <p className="text-[10px] text-blue-200">
                    Protected verification workflow
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-blue-300">
                    Total
                  </p>
                  <p className="mt-1 text-xl font-black">{totalKyc}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-blue-300">
                    Review
                  </p>
                  <p className="mt-1 text-xl font-black">{pending + underReview}</p>
                </div>
              </div>
            </div>
          </section>

          {/* TABS */}
          <section className="mb-4 overflow-x-auto rounded-[20px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="flex min-w-max items-center gap-1 p-2">
              {tabs.map(([value, label, count]) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`relative rounded-xl px-4 py-3 text-xs font-black transition ${
                    activeTab === value
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {label}
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] ${
                      activeTab === value
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* QUEUE */}
          <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCheck2 size={19} className="text-blue-600" />
                    <h2 className="text-base font-black text-slate-950">
                      KYC Verification Queue
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {filteredRecords.length} verification record
                    {filteredRecords.length === 1 ? "" : "s"} found
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live database
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-3 p-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileText size={27} />
                </div>
                <h3 className="mt-4 text-base font-black text-slate-800">
                  No KYC records found
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
                  No records match the current search or verification filter.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredRecords.map((record) => {
                  const name =
                    record.fullName ||
                    record.name ||
                    "Customer";

                  const status = normaliseStatus(record.status);

                  const panVerified =
                    Boolean(record.panVerified) ||
                    Boolean(record.documentVerified);

                  const bankVerified =
                    Boolean(record.bankVerified) ||
                    Boolean(record.bankAccountVerified);

                  const busy =
                    actionLoading === `approve-${record.id}`;

                  return (
                    <div
                      key={record.id}
                      className="group p-4 transition hover:bg-slate-50/80 sm:p-5"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 ring-1 ring-blue-100">
                            <UserRound size={21} />
                            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-black text-slate-900">
                                {name}
                              </h3>

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${statusStyle(
                                  status
                                )}`}
                              >
                                {statusLabel(status)}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <CreditCard size={13} />
                                PAN {mask(record.panNo || record.panNumber)}
                              </span>

                              <span className="inline-flex items-center gap-1">
                                <CalendarDays size={13} />
                                {formatDate(record.createdAt)}
                              </span>

                              {record.email && (
                                <span className="inline-flex items-center gap-1">
                                  <Mail size={13} />
                                  {record.email}
                                </span>
                              )}

                              {record.phone && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone size={13} />
                                  {record.phone}
                                </span>
                              )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[9px] font-bold ${
                                  panVerified
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {panVerified ? (
                                  <CheckCircle2 size={12} />
                                ) : (
                                  <Clock3 size={12} />
                                )}
                                PAN {panVerified ? "Verified" : "Pending"}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[9px] font-bold ${
                                  record.aadhaarVerified
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {record.aadhaarVerified ? (
                                  <CheckCircle2 size={12} />
                                ) : (
                                  <Clock3 size={12} />
                                )}
                                Aadhaar{" "}
                                {record.aadhaarVerified
                                  ? "Verified"
                                  : "Pending"}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[9px] font-bold ${
                                  bankVerified
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {bankVerified ? (
                                  <CheckCircle2 size={12} />
                                ) : (
                                  <Building2 size={12} />
                                )}
                                Bank {bankVerified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                          <button
                            onClick={() => setSelected(record)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-black text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          {!["APPROVED", "VERIFIED", "REJECTED"].includes(
                            status
                          ) && (
                            <>
                              <button
                                onClick={() => approveKyc(record)}
                                disabled={busy}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Check
                                  size={15}
                                  className={busy ? "animate-pulse" : ""}
                                />
                                {busy ? "Approving..." : "Approve"}
                              </button>

                              <button
                                onClick={() => {
                                  setSelected(record);
                                  setShowReject(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-3.5 py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                              >
                                <X size={15} />
                                Reject
                              </button>
                            </>
                          )}

                          <ChevronRight
                            size={17}
                            className="hidden text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500 xl:block"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* DETAILS MODAL */}
        {selected && !showReject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.30)]">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1f4d] via-[#123d88] to-[#087f9b] p-6 text-white">
                <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-cyan-200">
                      <ShieldCheck size={15} />
                      KYC VERIFICATION
                    </div>
                    <h2 className="text-2xl font-black">
                      {selected.fullName || selected.name || "Customer"}
                    </h2>
                    <p className="mt-1 text-xs text-blue-200">
                      KYC ID: {selected.id}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-xl bg-white/10 p-2.5 transition hover:bg-white/20"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[62vh] overflow-y-auto p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      PAN Number
                    </p>
                    <p className="mt-2 text-sm font-black text-slate-900">
                      {mask(selected.panNo || selected.panNumber)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Aadhaar Number
                    </p>
                    <p className="mt-2 text-sm font-black text-slate-900">
                      {mask(
                        selected.aadhaarNo || selected.aadhaarNumber
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Email
                    </p>
                    <p className="mt-2 break-all text-sm font-bold text-slate-900">
                      {selected.email || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Phone
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {selected.phone || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <FileCheck2 size={17} className="text-blue-600" />
                    <p className="text-sm font-black text-slate-900">
                      Verification Documents
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["PAN", selected.panVerified],
                      ["Aadhaar", selected.aadhaarVerified],
                      [
                        "Bank",
                        selected.bankVerified ||
                          selected.bankAccountVerified,
                      ],
                    ].map(([label, verified]) => (
                      <div
                        key={String(label)}
                        className={`rounded-xl border p-3 ${
                          verified
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-amber-200 bg-amber-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">
                            {label}
                          </span>
                          {verified ? (
                            <CheckCircle2
                              size={16}
                              className="text-emerald-600"
                            />
                          ) : (
                            <Clock3
                              size={16}
                              className="text-amber-600"
                            />
                          )}
                        </div>
                        <p className="mt-1 text-[10px] font-bold opacity-70">
                          {verified ? "Verified" : "Pending verification"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {(selected.city || selected.state || selected.address) && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 text-blue-600" />
                      <div>
                        <p className="text-xs font-black text-slate-900">
                          Address
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {[selected.address, selected.city, selected.state]
                            .filter(Boolean)
                            .join(", ") || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!["APPROVED", "VERIFIED", "REJECTED"].includes(
                normaliseStatus(selected.status)
              ) && (
                <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 p-4 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => {
                      setShowReject(true);
                    }}
                    className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-xs font-black text-rose-600 hover:bg-rose-50"
                  >
                    Reject KYC
                  </button>

                  <button
                    onClick={() => approveKyc(selected)}
                    disabled={actionLoading === `approve-${selected.id}`}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-xs font-black text-white shadow-md hover:shadow-lg disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Check size={15} />
                      Approve KYC
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REJECT MODAL */}
        {selected && showReject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex rounded-xl bg-rose-50 p-3 text-rose-600">
                    <XCircle size={22} />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-slate-950">
                    Reject KYC
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Provide a reason for rejecting this verification request.
                  </p>
                </div>

                <button
                  onClick={() => setShowReject(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Enter rejection reason..."
                className="mt-5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowReject(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={rejectKyc}
                  disabled={actionLoading === `reject-${selected.id}`}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-3 text-xs font-black text-white shadow-md disabled:opacity-60"
                >
                  {actionLoading === `reject-${selected.id}`
                    ? "Rejecting..."
                    : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DsaShell>
  );
}

