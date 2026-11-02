"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity, ArrowDownUp, ArrowRight, BadgeCheck, BriefcaseBusiness,
  CalendarDays, CheckCircle2, Clock3, CreditCard, FileSearch, Filter,
  GraduationCap, House, Layers3, LoaderCircle, RefreshCw, Search,
  ShieldCheck, SlidersHorizontal, WalletCards, XCircle, CarFront, Coins,
  CircleHelp, ExternalLink, Plus, AlertCircle,
} from "lucide-react";
import api from "@/lib/api";

type Loan = {
  id: string;
  loanType?: string;
  amount?: number | string;
  status?: string;
  fullName?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  tenureMonths?: number;
  interestRate?: number;
  monthlyEMI?: number;
  purpose?: string;
  remarks?: string;
};

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED";

const statusMeta: Record<string, { label: string; className: string; icon: typeof Clock3 }> = {
  PENDING: { label: "Pending review", className: "border-amber-200 bg-amber-50 text-amber-700", icon: Clock3 },
  APPROVED: { label: "Approved", className: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", className: "border-rose-200 bg-rose-50 text-rose-700", icon: XCircle },
  DISBURSED: { label: "Disbursed", className: "border-violet-200 bg-violet-50 text-violet-700", icon: WalletCards },
  UNDER_REVIEW: { label: "Under review", className: "border-blue-200 bg-blue-50 text-blue-700", icon: Activity },
};

function loanIcon(type?: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("home")) return House;
  if (t.includes("car") || t.includes("vehicle")) return CarFront;
  if (t.includes("business")) return BriefcaseBusiness;
  if (t.includes("education")) return GraduationCap;
  if (t.includes("gold")) return Coins;
  return CreditCard;
}

function formatAmount(value?: number | string) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function unwrapLoans(payload: any): Loan[] {
  const candidates = [
    payload?.data?.loans,
    payload?.loans,
    payload?.data?.data?.loans,
    payload?.data,
    payload,
  ];
  const found = candidates.find(Array.isArray);
  return found ? found.filter((item: any) => item && typeof item.id === "string") : [];
}

export default function CustomerLoansPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sort, setSort] = useState("newest");

  const loadLoans = useCallback(async (manual = false) => {
    try {
      if (manual) setRefreshing(true); else setLoading(true);
      setError("");
      const token = localStorage.getItem("loan_finance_token");
      const rawUser = localStorage.getItem("loan_finance_user");
      if (!token || !rawUser) {
        router.replace("/login");
        return;
      }
      let user: any;
      try { user = JSON.parse(rawUser); } catch { user = null; }
      const userId = user?.id;
      if (!userId) {
        setError("Your customer session could not be verified. Please sign in again.");
        return;
      }
      // Existing backend route found during audit: GET /api/customer/user/:userId
      const response = await api.get(`/customer/user/${encodeURIComponent(userId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = response?.data;
      const records = unwrapLoans(body?.data ?? body);
      setLoans(records);
    } catch (err: any) {
      console.error("CUSTOMER LOANS ERROR:", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }
      setError(err?.response?.data?.message || "We couldn't load your applications right now. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { void loadLoans(); }, [loadLoans]);

  const counts = useMemo(() => {
    const count = (key: string) => loans.filter((loan) => String(loan.status || "").toUpperCase() === key).length;
    return { all: loans.length, pending: count("PENDING"), approved: count("APPROVED"), rejected: count("REJECTED"), disbursed: count("DISBURSED") };
  }, [loans]);

  const filteredLoans = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = loans.filter((loan) => {
      const normalizedStatus = String(loan.status || "").toUpperCase();
      const matchesStatus = status === "ALL" || normalizedStatus === status;
      const searchable = [loan.id, loan.loanType, loan.status, loan.fullName, loan.purpose, loan.amount].filter(Boolean).join(" ").toLowerCase();
      return matchesStatus && (!query || searchable.includes(query));
    });
    return result.sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sort === "amount-high") return Number(b.amount || 0) - Number(a.amount || 0);
      if (sort === "amount-low") return Number(a.amount || 0) - Number(b.amount || 0);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [loans, search, status, sort]);

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "ALL", label: "All applications", count: counts.all },
    { key: "PENDING", label: "Pending", count: counts.pending },
    { key: "APPROVED", label: "Approved", count: counts.approved },
    { key: "REJECTED", label: "Rejected", count: counts.rejected },
    { key: "DISBURSED", label: "Disbursed", count: counts.disbursed },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_#dbeafe_0%,_#f6f9ff_38%,_#f8fafc_75%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-blue-700 shadow-sm">
              <ShieldCheck size={14} /> Customer workspace
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">My Loan Applications</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Track your applications, review the latest status, and open the details whenever you need them.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => void loadLoans(true)} disabled={loading || refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:opacity-60">
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
            <Link href="/apply" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-blue-300">
              <Plus size={18} /> Apply for a Loan <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertCircle className="mt-0.5 shrink-0" size={18} /><div className="flex-1"><p className="font-bold">Unable to load applications</p><p className="mt-1">{error}</p></div><button type="button" onClick={() => void loadLoans()} className="font-bold underline underline-offset-2">Retry</button></div>}

        <section aria-label="Application summary" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "Total applications", value: counts.all, caption: "Your recorded applications", icon: Layers3, color: "from-blue-500 to-indigo-500", glow: "bg-blue-50" },
            { label: "Pending", value: counts.pending, caption: "Awaiting a decision", icon: Clock3, color: "from-amber-400 to-orange-500", glow: "bg-amber-50" },
            { label: "Approved", value: counts.approved, caption: "Approved applications", icon: CheckCircle2, color: "from-emerald-400 to-teal-500", glow: "bg-emerald-50" },
            { label: "Rejected", value: counts.rejected, caption: "Review application details", icon: XCircle, color: "from-rose-400 to-pink-500", glow: "bg-rose-50" },
            { label: "Disbursed", value: counts.disbursed, caption: "Marked as disbursed", icon: WalletCards, color: "from-violet-500 to-purple-500", glow: "bg-violet-50" },
          ].map((card) => {
            const Icon = card.icon;
            return <div key={card.label} className="group relative overflow-hidden rounded-2xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_-18px_rgba(15,23,42,.35)] transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${card.glow}`}><Icon size={21} className={`bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} /></div>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">{card.label}</p>
              <div className="mt-1 text-3xl font-black tracking-tight text-slate-950">{loading ? <span className="inline-block h-8 w-8 animate-pulse rounded-lg bg-slate-100" /> : card.value}</div>
              <p className="mt-2 text-[11px] leading-4 text-slate-500 sm:text-xs">{card.caption}</p>
              <div className={`absolute -right-5 -top-5 h-20 w-20 rounded-full ${card.glow} opacity-70 blur-2xl transition group-hover:opacity-100`} />
            </div>;
          })}
        </section>

        <section className="overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_18px_60px_-35px_rgba(15,23,42,.35)] backdrop-blur">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><h2 className="text-lg font-extrabold text-slate-900">Application directory</h2><p className="mt-1 text-xs text-slate-500">Search, filter and open a record for more information.</p></div>
              <div className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500"><Activity size={15} className="text-blue-600" /> {loading ? "Syncing records…" : `${filteredLoans.length} of ${loans.length} records`}</div>
            </div>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex gap-1 overflow-x-auto pb-1">
                {tabs.map((tab) => <button key={tab.key} type="button" onClick={() => setStatus(tab.key)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition sm:px-4 ${status === tab.key ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "border border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"}`}>
                  {tab.label}<span className={`rounded-md px-1.5 py-0.5 text-[10px] ${status === tab.key ? "bg-white/20 text-white" : "bg-white text-slate-500"}`}>{tab.count}</span>
                </button>)}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 sm:min-w-[260px]">
                  <Search size={16} className="shrink-0 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, type, status…" className="w-full min-w-0 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" />
                  {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><XCircle size={14} className="text-slate-400" /></button>}
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"><ArrowDownUp size={15} className="text-slate-400" /><span className="sr-only">Sort applications</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="max-w-full bg-transparent font-semibold outline-none"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="amount-high">Amount: high to low</option><option value="amount-low">Amount: low to high</option></select></label>
              </div>
            </div>
          </div>

          {loading ? <div className="grid gap-3 p-4 sm:p-6">{[1, 2, 3].map((n) => <div key={n} className="flex animate-pulse items-center gap-4 rounded-2xl border border-slate-100 p-4"><div className="h-12 w-12 rounded-xl bg-slate-100" /><div className="flex-1"><div className="mb-2 h-4 w-1/3 rounded bg-slate-100" /><div className="h-3 w-1/2 rounded bg-slate-50" /></div><div className="h-7 w-20 rounded-full bg-slate-100" /></div>)}</div> : filteredLoans.length === 0 ? <div className="px-5 py-16 text-center sm:py-20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600"><FileSearch size={30} /></div>
            <h3 className="text-lg font-extrabold text-slate-900">{loans.length === 0 ? "No applications to show yet" : "No matching applications"}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{loans.length === 0 ? "When loan applications are linked to your account, they will appear here. You can start a new application whenever you're ready." : "Try a different search term or select another status filter."}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">{(search || status !== "ALL") && <button type="button" onClick={() => { setSearch(""); setStatus("ALL"); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><Filter size={15} /> Clear filters</button>}{loans.length === 0 && <Link href="/apply" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"><Plus size={16} /> Apply for a loan</Link>}</div>
          </div> : <div className="grid gap-3 p-4 sm:p-6 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredLoans.map((loan) => {
              const normalized = String(loan.status || "").toUpperCase();
              const meta = statusMeta[normalized] || { label: loan.status || "Status unavailable", className: "border-slate-200 bg-slate-50 text-slate-600", icon: Clock3 };
              const StatusIcon = meta.icon;
              const LoanIcon = loanIcon(loan.loanType);
              return <article key={loan.id} className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_35px_-25px_rgba(37,99,235,.6)]">
                <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 opacity-80" />
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 ring-1 ring-blue-100"><LoanIcon size={23} /></div>
                      <div className="min-w-0"><h3 className="truncate font-extrabold text-slate-900">{loan.loanType || "Loan application"}</h3><p className="mt-1 truncate text-[11px] text-slate-500">ID: <span className="font-semibold text-slate-700">{loan.id}</span></p></div>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] font-extrabold ${meta.className}`}><StatusIcon size={12} />{meta.label}</span>
                  </div>
                  <div className="my-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50/80 p-3.5">
                    <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requested amount</p><p className="mt-1 text-xl font-black tracking-tight text-slate-950">{formatAmount(loan.amount)}</p></div>
                    <div className="border-l border-slate-200 pl-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applied on</p><p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-700"><CalendarDays size={13} className="text-slate-400" />{formatDate(loan.createdAt)}</p></div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><BadgeCheck size={14} className="text-blue-500" /> Current record</div>
                    <Link href={`/customer/loans/${encodeURIComponent(loan.id)}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-2.5 text-xs font-extrabold text-blue-700 transition hover:bg-blue-600 hover:text-white">View details <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </article>;
            })}
          </div>}
        </section>

        <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/80 p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm"><CircleHelp size={19} /></div><div><p className="text-sm font-extrabold text-slate-800">Need help with an application?</p><p className="mt-1 text-xs leading-5 text-slate-500">Keep your application ID handy when contacting support.</p></div></div>
          <Link href="/customer/documents" className="inline-flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 sm:self-auto">View my documents <ExternalLink size={13} /></Link>
        </div>
        <p className="mt-4 text-center text-[10px] leading-5 text-slate-400">Application status is shown as returned by the server. Final approval and disbursement are subject to lender confirmation.</p>
      </div>
    </main>
  );
}
