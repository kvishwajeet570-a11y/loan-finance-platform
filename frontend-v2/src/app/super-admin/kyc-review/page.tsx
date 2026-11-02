"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search, RefreshCw, ShieldCheck, Clock3, XCircle, Users,
  Eye, FileText, User, MapPin, CalendarDays, ExternalLink,
  ChevronLeft, ChevronRight, X, AlertCircle, CheckCircle2,
  Check, Ban, Mail, Phone, CreditCard, ArrowUpRight,
  Loader2, ShieldAlert, Fingerprint, Building2
} from "lucide-react";
import api from "@/lib/api";

type KYC = {
  id: string;
  userId: string;
  fullName: string;
  panNumber: string;
  dob: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
  approvedAt?: string | null;
  panVerificationStatus?: string;
  aadhaarVerificationStatus?: string;
  bankVerificationStatus?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phoneNo?: string;
  };
};

type DocumentItem = {
  id: string;
  userId?: string | null;
  documentType: string;
  documentName: string;
  fileUrl: string;
  status: string;
  createdAt: string;
};

type Stats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  APPROVED: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  REJECTED: "bg-rose-400/10 text-rose-300 border-rose-400/20",
  UNDER_REVIEW: "bg-violet-400/10 text-violet-300 border-violet-400/20"
};

const pretty = (value?: string | null) =>
  value
    ? value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : "Not available";

const dateLabel = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
      });
};

function Status({ value }: { value: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusStyle[value] || "border-white/10 bg-white/5 text-slate-300"}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {pretty(value)}
    </span>
  );
}

export default function KycReviewPage() {
  const [records, setRecords] = useState<KYC[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0, pending: 0, approved: 0, rejected: 0
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [selected, setSelected] = useState<KYC | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState("");
  const [preview, setPreview] = useState<DocumentItem | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params: Record<string, string | number> = {
        page,
        limit: 10
      };

      if (status !== "ALL") params.status = status;
      if (search.trim()) params.search = search.trim();

      const [listRes, statsRes] = await Promise.all([
        api.get("/kyc", { params }),
        api.get("/kyc/analytics")
      ]);

      if (!listRes.data?.success || !Array.isArray(listRes.data.kycs)) {
        throw new Error(listRes.data?.message || "Invalid KYC list response");
      }

      const list = listRes.data;
      const analytics = statsRes.data?.data || {};

      setRecords(list.kycs);
      setTotal(Number(list.total || 0));
      setPages(Math.max(1, Number(list.pages || 1)));

      setStats({
        total: Number(analytics.total || 0),
        pending: Number(analytics.pending || 0),
        approved: Number(analytics.approved || 0),
        rejected: Number(analytics.rejected || 0)
      });
    } catch (err: any) {
      setRecords([]);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load KYC records."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timer = window.setTimeout(loadData, 300);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const loadDocuments = async (userId: string) => {
    setDocuments([]);
    setDocumentsError("");
    setDocumentsLoading(true);

    try {
      const res = await api.get("/document", {
        params: { page: 1, limit: 100 }
      });

      const list = res.data?.documents;
      if (!Array.isArray(list)) {
        throw new Error(res.data?.message || "Invalid document response");
      }

      setDocuments(list.filter((doc: DocumentItem) => doc.userId === userId));
    } catch (err: any) {
      setDocumentsError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load documents."
      );
    } finally {
      setDocumentsLoading(false);
    }
  };

  const openDetails = (record: KYC) => {
    setSelected(record);
    setPreview(null);
    setRejectOpen(false);
    loadDocuments(record.userId);
  };

  const closeDetails = () => {
    if (actionLoading) return;
    setSelected(null);
    setDocuments([]);
    setPreview(null);
    setRejectOpen(false);
  };

  const approveKyc = async () => {
    if (!selected || actionLoading) return;

    const confirmed = window.confirm(
      `Approve KYC for ${selected.fullName}? This will update the customer's verification status.`
    );
    if (!confirmed) return;

    setActionLoading(true);
    setNotice("");
    try {
      const res = await api.patch(
        `/kyc/${selected.id}/approve`,
        { adminId: "SYSTEM" }
      );

      if (res.data?.success !== true) {
        throw new Error(res.data?.message || "Approval failed");
      }

      setNotice("KYC approved successfully.");
      setSelected(null);
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "KYC approval failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const rejectKyc = async () => {
    if (!selected || actionLoading || !rejectReason.trim()) return;

    setActionLoading(true);
    setNotice("");
    try {
      const res = await api.patch(
        `/kyc/${selected.id}/reject`,
        {
          reason: rejectReason.trim(),
          adminId: "SYSTEM"
        }
      );

      if (res.data?.success !== true) {
        throw new Error(res.data?.message || "Rejection failed");
      }

      setNotice("KYC rejected successfully.");
      setRejectOpen(false);
      setRejectReason("");
      setSelected(null);
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "KYC rejection failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const cards = [
    {
      label: "Total KYC Records",
      value: stats.total,
      icon: Users,
      gradient: "from-blue-600/30 to-blue-950/20",
      color: "text-blue-300",
      glow: "shadow-blue-500/10"
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock3,
      gradient: "from-violet-600/30 to-purple-950/20",
      color: "text-violet-300",
      glow: "shadow-purple-500/10"
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      gradient: "from-emerald-600/30 to-emerald-950/20",
      color: "text-emerald-300",
      glow: "shadow-emerald-500/10"
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      gradient: "from-rose-600/30 to-rose-950/20",
      color: "text-rose-300",
      glow: "shadow-rose-500/10"
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070d19] p-4 text-white sm:p-6 lg:p-7">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[400px] rounded-full bg-cyan-500/[0.06] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1700px] space-y-6">

        <header className="flex flex-col justify-between gap-5 rounded-[26px] border border-blue-300/15 bg-gradient-to-br from-[#173c69] via-[#102746] to-[#0d1728] p-6 shadow-[0_20px_65px_rgba(0,0,0,0.3)] sm:p-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-blue-500/30 to-cyan-500/10 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
              <ShieldCheck size={29} className="text-cyan-300" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-[0.25em] text-cyan-300">
                COMPLIANCE CONTROL CENTER
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                KYC <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Review</span>
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Review, verify and manage customer identity applications.
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold transition hover:border-blue-300/40 hover:bg-blue-500/15 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            <AlertCircle size={19} className="shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")}><X size={17} /></button>
          </div>
        )}

        {notice && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <CheckCircle2 size={18} />
            {notice}
            <button className="ml-auto" onClick={() => setNotice("")}><X size={17} /></button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`group relative overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br ${card.gradient} p-5 shadow-xl ${card.glow} transition duration-300 hover:-translate-y-1 hover:border-white/20`}
              >
                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl transition group-hover:bg-white/[0.08]" />
                <div className="relative flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-300">{card.label}</p>
                  <div className={`rounded-xl border border-white/10 bg-white/[0.06] p-3 ${card.color}`}>
                    <Icon size={21} />
                  </div>
                </div>
                <div className="relative mt-5 flex items-end justify-between">
                  <p className="text-4xl font-black tracking-tight">
                    {loading ? "—" : card.value.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Live database
                  </span>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full w-2/3 rounded-full ${card.color.replace("text-", "bg-")} opacity-60`} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#12223a] to-[#0b1526] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-white/[0.025] p-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-extrabold">Customer Applications</h2>
              <p className="mt-1 text-xs text-slate-500">
                {total.toLocaleString("en-IN")} records matching the selected filter
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name or PAN..."
                  className="w-full rounded-xl border border-white/10 bg-[#091426] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/10 sm:w-64"
                />
              </div>

              <select
                value={status}
                onChange={e => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-white/10 bg-[#091426] px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-400/60"
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="ALL">All Status</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#091526] text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200/70">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">PAN</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">KYC Status</th>
                  <th className="px-5 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.055]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Loader2 size={27} className="mx-auto animate-spin text-cyan-300" />
                      <p className="mt-3 text-sm text-slate-400">Loading live KYC records...</p>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <FileText size={32} className="mx-auto text-slate-600" />
                      <p className="mt-3 font-semibold text-slate-400">No KYC records found</p>
                      <p className="mt-1 text-xs text-slate-600">Try changing your search or status filter.</p>
                    </td>
                  </tr>
                ) : records.map(record => (
                  <tr key={record.id} className="transition-all duration-200 hover:bg-blue-400/[0.055]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-300/15 bg-gradient-to-br from-blue-500/25 to-cyan-400/10 font-bold text-blue-200">
                          {(record.fullName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{record.fullName}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {record.user?.phoneNo || record.user?.email || "Customer"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-slate-300">
                      {record.panNumber
                        ? `${record.panNumber.slice(0, 2)}*****${record.panNumber.slice(-2)}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {[record.city, record.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {dateLabel(record.createdAt)}
                    </td>
                    <td className="px-5 py-4"><Status value={record.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openDetails(record)}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-3.5 py-2.5 text-xs font-bold text-blue-300 transition hover:border-blue-300/50 hover:bg-blue-500/20"
                      >
                        <Eye size={15} /> Review
                        <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">
              Showing {records.length} records · Page {page} of {pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="rounded-xl border border-white/10 p-2.5 transition hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft size={17} />
              </button>
              <span className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm font-bold text-blue-200">
                {page}
              </span>
              <button
                disabled={page >= pages || loading}
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                className="rounded-xl border border-white/10 p-2.5 transition hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <button
            aria-label="Close details"
            onClick={closeDetails}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-hidden border-l border-blue-300/20 bg-gradient-to-b from-[#152945] via-[#0d192b] to-[#091322] shadow-[-25px_0_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-300">CUSTOMER VERIFICATION</p>
                <h2 className="mt-1 text-xl font-extrabold">KYC Details</h2>
              </div>
              <button onClick={closeDetails} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10">
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <section className="rounded-2xl border border-blue-300/15 bg-gradient-to-br from-[#1c385b] to-[#12233b] p-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-blue-500/20 text-xl font-black text-cyan-200">
                    {selected.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-extrabold">{selected.fullName}</h3>
                    <p className="mt-1 text-xs text-slate-400">Customer ID: {selected.userId}</p>
                  </div>
                  <Status value={selected.status} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                  <p className="flex items-center gap-2 break-all text-xs text-slate-300">
                    <Phone size={15} className="shrink-0 text-cyan-300" />
                    {selected.user?.phoneNo || "Not available"}
                  </p>
                  <p className="flex items-center gap-2 break-all text-xs text-slate-300">
                    <Mail size={15} className="shrink-0 text-cyan-300" />
                    {selected.user?.email || "Not available"}
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111d30] p-5">
                <h3 className="mb-5 flex items-center gap-2 font-bold">
                  <User size={18} className="text-blue-300" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="mt-1 text-sm font-semibold">{selected.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date of Birth</p>
                    <p className="mt-1 text-sm font-semibold">{dateLabel(selected.dob)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">PAN Number</p>
                    <p className="mt-1 font-mono text-sm font-semibold tracking-wider">{selected.panNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Pincode</p>
                    <p className="mt-1 text-sm font-semibold">{selected.pincode || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="mt-1 text-sm text-slate-300">{selected.address || "—"}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {[selected.city, selected.state].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111d30] p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <ShieldCheck size={18} className="text-cyan-300" />
                  Verification Status
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: "PAN Verification", value: selected.panVerificationStatus, icon: CreditCard },
                    { label: "Bank Verification", value: selected.bankVerificationStatus, icon: Building2 }
                  ].map(item => {
                    const Icon = item.icon;
                    const verified = item.value === "VERIFIED" || item.value === "APPROVED";
                    return (
                      <div key={item.label} className="rounded-xl border border-white/10 bg-[#0b1526] p-4">
                        <Icon size={19} className="text-cyan-300" />
                        <p className="mt-3 text-xs text-slate-400">{item.label}</p>
                        <p className={`mt-2 text-sm font-bold ${verified ? "text-emerald-300" : "text-amber-300"}`}>
                          {pretty(item.value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111d30] p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <FileText size={18} className="text-violet-300" />
                  Customer Documents
                </h3>

                {documentsLoading ? (
                  <div className="py-8 text-center text-sm text-slate-400">
                    <Loader2 size={22} className="mx-auto animate-spin" />
                    <p className="mt-2">Loading documents...</p>
                  </div>
                ) : documentsError ? (
                  <p className="text-sm text-rose-300">{documentsError}</p>
                ) : documents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                    <FileText size={26} className="mx-auto text-slate-600" />
                    <p className="mt-2 text-sm text-slate-400">No documents found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-[#0b1526] p-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <FileText size={20} className="shrink-0 text-blue-300" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{doc.documentName}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {pretty(doc.documentType)} · {pretty(doc.status)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPreview(doc)}
                          className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-2.5 text-blue-300 hover:bg-blue-500/20"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {selected.rejectionReason && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                  <p className="text-xs font-bold text-rose-300">Rejection Reason</p>
                  <p className="mt-2 text-sm text-rose-200">{selected.rejectionReason}</p>
                </div>
              )}

              <p className="text-xs text-slate-600">
                Submitted: {dateLabel(selected.createdAt)}
              </p>
            </div>

            <div className="border-t border-white/10 bg-[#091322]/90 p-4">
              {rejectOpen ? (
                <div className="space-y-3">
                  <label className="text-sm font-bold text-rose-200">Rejection reason</label>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Enter the reason for rejecting this KYC..."
                    className="w-full resize-none rounded-xl border border-rose-400/20 bg-[#0b1526] p-3 text-sm outline-none placeholder:text-slate-600 focus:border-rose-400/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setRejectOpen(false);
                        setRejectReason("");
                      }}
                      disabled={actionLoading}
                      className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={rejectKyc}
                      disabled={actionLoading || !rejectReason.trim()}
                      className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/30 disabled:opacity-40"
                    >
                      {actionLoading ? "Processing..." : "Confirm Reject"}
                    </button>
                  </div>
                </div>
              ) : selected.status === "PENDING" || selected.status === "UNDER_REVIEW" ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={approveKyc}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-3 py-3.5 text-sm font-bold shadow-lg shadow-emerald-900/30 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}
                    Approve KYC
                  </button>
                  <button
                    onClick={() => setRejectOpen(true)}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 px-3 py-3.5 text-sm font-bold shadow-lg shadow-rose-900/30 transition hover:brightness-110 disabled:opacity-50"
                  >
                    <Ban size={17} /> Reject KYC
                  </button>
                </div>
              ) : (
                <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs text-slate-400">
                  This KYC application has already been processed.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-blue-300/20 bg-[#101b2d] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <h3 className="font-bold">{preview.documentName}</h3>
                <p className="mt-1 text-xs text-slate-500">{pretty(preview.documentType)}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={preview.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/10 p-2 text-blue-300 hover:bg-white/5"
                >
                  <ExternalLink size={17} />
                </a>
                <button onClick={() => setPreview(null)} className="rounded-lg border border-white/10 p-2">
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="flex min-h-[350px] flex-1 items-center justify-center overflow-auto bg-[#080f1e] p-3">
              {preview.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i) ? (
                <img
                  src={preview.fileUrl}
                  alt={preview.documentName}
                  className="max-h-[75vh] max-w-full rounded-lg object-contain"
                />
              ) : preview.fileUrl.match(/\.pdf(\?|$)/i) ? (
                <iframe
                  src={preview.fileUrl}
                  title={preview.documentName}
                  className="h-[75vh] w-full rounded-lg bg-white"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <FileText size={35} className="mx-auto mb-3" />
                  <p className="text-sm">Preview not available for this file type.</p>
                  <a
                    href={preview.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-blue-300"
                  >
                    Open document <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
