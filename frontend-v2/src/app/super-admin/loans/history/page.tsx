"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Search, RefreshCw, History, CheckCircle2, XCircle,
  Clock3, Landmark, Eye, ChevronLeft, ChevronRight,
  ArrowLeft, CalendarDays, IndianRupee
} from "lucide-react";

type Loan = {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  panNo?: string;
  loanType?: string;
  amount?: number;
  eligibleAmount?: number | null;
  sanctionedAmount?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string | null;
  remarks?: string | null;
  rejectionReason?: string | null;
};

const money = (value?: number | null) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const date = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const statusStyle = (status?: string) => {
  switch (String(status || "PENDING").toUpperCase()) {
    case "APPROVED":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "REJECTED":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "DISBURSED":
      return "border-blue-400/30 bg-blue-400/10 text-blue-300";
    default:
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  }
};

const StatusIcon = ({ status }: { status?: string }) => {
  switch (String(status || "PENDING").toUpperCase()) {
    case "APPROVED": return <CheckCircle2 size={14} />;
    case "REJECTED": return <XCircle size={14} />;
    case "DISBURSED": return <Landmark size={14} />;
    default: return <Clock3 size={14} />;
  }
};

export default function LoanHistoryPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loanType, setLoanType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [notice, setNotice] = useState("");

  const pageSize = 10;

  const loadLoans = useCallback(async () => {
    try {
      setLoading(true);
      setNotice("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("loan_finance_token")
          : null;

      const response = await api.get("/super-admin/loans", {
        params: { page: 1, limit: 1000 },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data;
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.loans)
          ? data.loans
          : [];

      setLoans(records);
    } catch (error: any) {
      setNotice(
        error?.response?.data?.message ||
        "Unable to load loan history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLoans();
  }, [loadLoans]);

  const types = useMemo(
    () => Array.from(
      new Set(loans.map((loan) => loan.loanType).filter(Boolean))
    ) as string[],
    [loans]
  );

  const counts = useMemo(() => ({
    total: loans.length,
    pending: loans.filter(x => String(x.status).toUpperCase() === "PENDING").length,
    approved: loans.filter(x => String(x.status).toUpperCase() === "APPROVED").length,
    rejected: loans.filter(x => String(x.status).toUpperCase() === "REJECTED").length,
    disbursed: loans.filter(x => String(x.status).toUpperCase() === "DISBURSED").length,
  }), [loans]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return loans.filter((loan) => {
      const matchesStatus =
        status === "ALL" ||
        String(loan.status || "PENDING").toUpperCase() === status;

      const matchesType =
        loanType === "ALL" || loan.loanType === loanType;

      const matchesSearch =
        !q ||
        [
          loan.id, loan.fullName, loan.phone,
          loan.email, loan.panNo, loan.loanType
        ].filter(Boolean).some(value =>
          String(value).toLowerCase().includes(q)
        );

      return matchesStatus && matchesType && matchesSearch;
    }).sort((a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
    );
  }, [loans, search, status, loanType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, status, loanType]);

  const cards = [
    { label: "Total Loans", value: counts.total, color: "border-cyan-400/30 text-cyan-300", icon: <History /> },
    { label: "Pending", value: counts.pending, color: "border-amber-400/30 text-amber-300", icon: <Clock3 /> },
    { label: "Approved", value: counts.approved, color: "border-emerald-400/30 text-emerald-300", icon: <CheckCircle2 /> },
    { label: "Rejected", value: counts.rejected, color: "border-rose-400/30 text-rose-300", icon: <XCircle /> },
    { label: "Disbursed", value: counts.disbursed, color: "border-blue-400/30 text-blue-300", icon: <Landmark /> },
  ];

  return (
    <main className="min-h-screen bg-[#050c19] p-3 text-white sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">

        <header className="rounded-3xl border border-blue-400/20 bg-gradient-to-r from-[#152752] via-[#101c3c] to-[#07182c] p-6 shadow-xl">
          <Link
            href="/super-admin/loans"
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-white"
          >
            <ArrowLeft size={15} /> Back to Loan Applications
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
                <History size={28} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">
                  Super Admin / Loan Management
                </p>
                <h1 className="mt-1 text-3xl font-black">Loan History</h1>
                <p className="mt-1 text-sm text-slate-300">
                  Review customer loan applications and their current status.
                </p>
              </div>
            </div>

            <button
              onClick={() => void loadLoans()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh History
            </button>
          </div>
        </header>

        {notice && (
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
            {notice}
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {cards.map(card => (
            <div
              key={card.label}
              className={`rounded-2xl border bg-[#0b192c] p-4 ${card.color}`}
            >
              <div className="flex items-center justify-between">
                {card.icon}
                <span className="text-2xl font-black text-white">
                  {card.value.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{card.label}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-700/70 bg-[#091629]">
          <div className="flex flex-col gap-3 border-b border-white/10 p-4 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, phone, PAN or Loan ID..."
                className="w-full rounded-xl border border-slate-700 bg-[#071321] py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="rounded-xl border border-slate-700 bg-[#10213a] px-3 py-3 text-sm outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="DISBURSED">Disbursed</option>
              </select>

              <select
                value={loanType}
                onChange={e => setLoanType(e.target.value)}
                className="max-w-[180px] rounded-xl border border-slate-700 bg-[#10213a] px-3 py-3 text-sm outline-none"
              >
                <option value="ALL">All Loan Types</option>
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#10213a] text-xs font-bold text-slate-300">
                <tr>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Loan ID / Type</th>
                  <th className="px-4 py-4">Requested</th>
                  <th className="px-4 py-4">Sanctioned</th>
                  <th className="px-4 py-4">Application Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[.07]">
                {loading ? (
                  <tr><td colSpan={7} className="p-12 text-center text-slate-400">Loading loan records...</td></tr>
                ) : visible.length === 0 ? (
                  <tr><td colSpan={7} className="p-12 text-center text-slate-400">No loan history found.</td></tr>
                ) : visible.map(loan => (
                  <tr key={loan.id} className="hover:bg-blue-400/[.04]">
                    <td className="px-4 py-4">
                      <p className="font-bold">{loan.fullName || "Customer"}</p>
                      <p className="mt-1 text-xs text-slate-400">{loan.phone || "—"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs font-semibold text-slate-200">{loan.id}</p>
                      <p className="mt-1 text-xs text-slate-400">{loan.loanType || "—"}</p>
                    </td>
                    <td className="px-4 py-4 font-bold">{money(loan.amount)}</td>
                    <td className="px-4 py-4 font-bold text-emerald-300">
                      {loan.sanctionedAmount != null ? money(loan.sanctionedAmount) : "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={14} className="text-slate-500" />
                        {date(loan.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold ${statusStyle(loan.status)}`}>
                        <StatusIcon status={loan.status} />
                        {loan.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelected(loan)}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-200 hover:bg-blue-500/20"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-700 p-2 disabled:opacity-30"
              >
                <ChevronLeft size={17} />
              </button>
              <span className="px-3 text-sm text-slate-300">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-700 p-2 disabled:opacity-30"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm">
            <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#0c192b] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#122544] p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Application Details</p>
                  <h2 className="mt-1 text-xl font-black">{selected.fullName || "Customer"}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-white/10">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 p-5 text-sm">
                {[
                  ["Loan ID", selected.id],
                  ["Phone", selected.phone || "—"],
                  ["Email", selected.email || "—"],
                  ["PAN", selected.panNo || "—"],
                  ["Loan Type", selected.loanType || "—"],
                  ["Requested Amount", money(selected.amount)],
                  ["Eligible Amount", selected.eligibleAmount != null ? money(selected.eligibleAmount) : "—"],
                  ["Sanctioned Amount", selected.sanctionedAmount != null ? money(selected.sanctionedAmount) : "—"],
                  ["Application Date", date(selected.createdAt)],
                  ["Last Updated", date(selected.updatedAt)],
                  ["Approved Date", date(selected.approvedAt)],
                  ["Current Status", selected.status || "PENDING"],
                ].map(([label, value], index) => {
                  const palettes = [
                    "border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-blue-950/40 text-blue-200",
                    "border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-emerald-950/40 text-emerald-200",
                    "border-purple-400/30 bg-gradient-to-br from-purple-500/20 to-purple-950/40 text-purple-200",
                    "border-amber-400/30 bg-gradient-to-br from-amber-500/20 to-amber-950/40 text-amber-200",
                    "border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-cyan-950/40 text-cyan-200",
                    "border-green-400/30 bg-gradient-to-br from-green-500/20 to-green-950/40 text-green-200",
                    "border-pink-400/30 bg-gradient-to-br from-pink-500/20 to-pink-950/40 text-pink-200",
                    "border-indigo-400/30 bg-gradient-to-br from-indigo-500/20 to-indigo-950/40 text-indigo-200",
                    "border-teal-400/30 bg-gradient-to-br from-teal-500/20 to-teal-950/40 text-teal-200",
                    "border-orange-400/30 bg-gradient-to-br from-orange-500/20 to-orange-950/40 text-orange-200",
                    "border-sky-400/30 bg-gradient-to-br from-sky-500/20 to-sky-950/40 text-sky-200",
                    "border-rose-400/30 bg-gradient-to-br from-rose-500/20 to-rose-950/40 text-rose-200"
                  ];

                  return (
                    <div
                      key={label}
                      className={`min-w-0 rounded-xl border p-3 shadow-lg transition hover:-translate-y-0.5 hover:brightness-125 ${palettes[index % palettes.length]}`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-wider opacity-70">{label}</p>
                      <p className="mt-2 break-words text-sm font-bold">{value}</p>
                    </div>
                  );
                })}
                <div className="col-span-2 rounded-xl border border-slate-700/70 bg-[#081525] p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Admin Remarks / Rejection Reason</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                    {selected.rejectionReason || selected.remarks || "No remarks recorded."}
                  </p>
                </div>
              </div>
              <div className="border-t border-white/10 p-4 text-right">
                <button onClick={() => setSelected(null)} className="rounded-xl bg-slate-700 px-5 py-2.5 text-sm font-bold hover:bg-slate-600">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

