"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
  Wallet, Clock3, CheckCircle2, XCircle, RefreshCw, Search,
  Download, IndianRupee, TrendingUp, Activity, Building2,
  ShieldCheck, FileText, Layers, ArrowRight, Eye,
  CalendarDays, Zap, Landmark, ChevronLeft, ChevronRight,
  Check, Ban, PlusCircle, ArrowLeftRight, MoreVertical,
  Bell, Settings, Filter, Menu, X
} from "lucide-react";

type Payout = {
  id: string;
  transactionId: string;
  referenceId?: string;
  userId?: string;
  dsaId?: string;
  amount: number;
  tax: number;
  netAmount: number;
  status: string;
  isApproved: boolean;
  isTestData?: boolean;
  remark?: string | null;
  createdAt: string;
  approvedAt?: string;
  rejectReason?: string | null;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phoneNo?: string;
  };
  bankAccount?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    isVerified?: boolean;
  } | null;
};

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n || 0));

const upper = (s: string) => String(s || "").toUpperCase();

const isPending = (s: string) =>
  ["PENDING", "PROCESSING", "REQUESTED"].includes(upper(s));

const isRejected = (s: string) => upper(s) === "REJECTED";

const isPaid = (s: string) =>
  ["SUCCESS", "PAID", "COMPLETED", "SETTLED"].includes(upper(s));

const isApproved = (p: Payout) =>
  p.isApproved && upper(p.status) === "APPROVED";

const isTest = (p: Payout) =>
  !!p.isTestData || String(p.remark || "").startsWith("TEST_PAYOUT_");

const statusStyle = (s: string) => {
  if (isPaid(s)) return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
  if (upper(s) === "APPROVED") return "border-blue-400/40 bg-blue-400/10 text-blue-300";
  if (isRejected(s)) return "border-rose-400/40 bg-rose-400/10 text-rose-300";
  return "border-amber-400/40 bg-amber-400/10 text-amber-300";
};

const shortDate = (v: string) =>
  v ? new Date(v).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }) : "—";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-35";

export default function SuperAdminPayoutPage() {
  const [records, setRecords] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [tab, setTab] = useState<"requests" | "approved" | "settlements" | "batch">("requests");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dsaFilter, setDsaFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("30");
  const [sort, setSort] = useState("NEWEST");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [rejectItem, setRejectItem] = useState<Payout | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailItem, setDetailItem] = useState<Payout | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/super-admin/payouts");
      const data = response.data?.data || response.data || {};
      setRecords(Array.isArray(data.payouts) ? data.payouts : []);
      setSelected([]);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Unable to load payout records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const pending = useMemo(
    () => records.filter(p => isPending(p.status)),
    [records]
  );
  const approved = useMemo(
    () => records.filter(isApproved),
    [records]
  );
  const paid = useMemo(
    () => records.filter(p => isPaid(p.status)),
    [records]
  );
  const rejected = useMemo(
    () => records.filter(p => isRejected(p.status)),
    [records]
  );

  const totalGross = records.reduce((s, p) => s + Number(p.amount || 0), 0);
  const pendingGross = pending.reduce((s, p) => s + Number(p.amount || 0), 0);
  const approvedGross = approved.reduce((s, p) => s + Number(p.amount || 0), 0);
  const paidNet = paid.reduce((s, p) => s + Number(p.netAmount || 0), 0);
  const rejectedGross = rejected.reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalTds = records.reduce((s, p) => s + Number(p.tax || 0), 0);

  const dsaNames = useMemo(
    () => [...new Set(records.map(p => p.user?.name || "Unknown User"))].sort(),
    [records]
  );

  const baseRows = useMemo(() => {
    if (tab === "requests" || tab === "batch") return pending;
    if (tab === "settlements") return paid;
    return approved;
  }, [tab, pending, approved, paid]);

  const filtered = useMemo(() => {
    let rows = [...baseRows];
    const q = search.trim().toLowerCase();

    if (q) {
      rows = rows.filter(p => [
        p.transactionId, p.referenceId, p.user?.name,
        p.user?.email, p.user?.phoneNo, p.bankAccount?.bankName
      ].some(v => String(v || "").toLowerCase().includes(q)));
    }

    if (statusFilter !== "ALL") {
      rows = rows.filter(p => upper(p.status) === statusFilter);
    }

    if (dsaFilter !== "ALL") {
      rows = rows.filter(p => (p.user?.name || "Unknown User") === dsaFilter);
    }

    if (dateFilter !== "ALL") {
      const cutoff = Date.now() - Number(dateFilter) * 86400000;
      rows = rows.filter(p => new Date(p.createdAt).getTime() >= cutoff);
    }

    rows.sort((a, b) => sort === "NEWEST"
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return rows;
  }, [baseRows, search, statusFilter, dsaFilter, dateFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setPage(1); }, [tab, search, statusFilter, dsaFilter, dateFilter, sort]);

  const months = useMemo(() => {
    const result: { label: string; amount: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const matching = records.filter(p => {
        const x = new Date(p.createdAt);
        return x.getMonth() === d.getMonth() && x.getFullYear() === d.getFullYear();
      });
      result.push({
        label: d.toLocaleString("en-IN", { month: "short" }),
        amount: matching.reduce((s, p) => s + Number(p.amount || 0), 0),
        count: matching.length
      });
    }
    return result;
  }, [records]);

  const maxMonth = Math.max(1, ...months.map(m => m.amount));
  const recent = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Test records use local simulation only. Real records use protected backend APIs.
  const simulateTestAction = (item: Payout, status: "APPROVED" | "REJECTED", reason = "") => {
    setRecords(old => old.map(p => p.id === item.id ? {
      ...p,
      status,
      isApproved: status === "APPROVED",
      approvedAt: status === "APPROVED" ? new Date().toISOString() : undefined,
      rejectReason: status === "REJECTED" ? reason : null
    } : p));
  };

  const approveOne = async (item: Payout) => {
    if (!isPending(item.status)) return;

    if (isTest(item)) {
      if (!window.confirm("TEST MODE: Simulate approval? No database or wallet balance will change.")) return;
      simulateTestAction(item, "APPROVED");
      setNotice("Test payout simulated as APPROVED. No database changes were made.");
      return;
    }

    if (!item.bankAccount?.isVerified) {
      setError("Verified bank account is required.");
      return;
    }

    if (!window.confirm(`Approve payout ${money(item.amount)} for ${item.user?.name || "this user"}?`)) return;

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api.patch(`/super-admin/payouts/${item.id}/approve`);
      setNotice(result.data?.message || "Payout approval submitted.");
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Payout approval failed.");
    } finally {
      setBusy(false);
    }
  };

  const rejectOne = async () => {
    if (!rejectItem || !isPending(rejectItem.status) || rejectReason.trim().length < 3) return;

    if (isTest(rejectItem)) {
      simulateTestAction(rejectItem, "REJECTED", rejectReason.trim());
      setNotice("Test payout simulated as REJECTED. No database changes were made.");
      setRejectItem(null);
      setRejectReason("");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api.patch(
        `/super-admin/payouts/${rejectItem.id}/reject`,
        { reason: rejectReason.trim() }
      );
      setNotice(result.data?.message || "Payout rejected.");
      setRejectItem(null);
      setRejectReason("");
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Payout rejection failed.");
    } finally {
      setBusy(false);
    }
  };

  const bulkApprove = async () => {
    const targets = pending.filter(p => selected.includes(p.id));
    if (!targets.length) {
      setError("Select at least one pending payout request.");
      return;
    }

    const testTargets = targets.filter(isTest);
    const realTargets = targets.filter(p => !isTest(p) && p.bankAccount?.isVerified);

    if (!realTargets.length && !testTargets.length) {
      setError("No eligible payout requests selected.");
      return;
    }

    if (!window.confirm(`Run safe bulk approval for ${targets.length} selected request(s)? Test records will only be simulated.`)) return;

    setBusy(true);
    setError("");
    let success = 0;
    const failures: string[] = [];

    try {
      for (const item of realTargets) {
        try {
          await api.patch(`/super-admin/payouts/${item.id}/approve`);
          success++;
        } catch (e: any) {
          failures.push(`${item.id}: ${e?.response?.data?.message || e.message || "Approval failed"}`);
        }
      }

      if (realTargets.length) await load();

      for (const item of testTargets) {
        simulateTestAction(item, "APPROVED");
        success++;
      }

      setSelected([]);
      setNotice(`${success} request(s) approved or simulated. Test records were not saved to the database.`);
      if (failures.length) setError(failures.slice(0, 4).join(" | "));
    } finally {
      setBusy(false);
    }
  };

  const bulkReject = async () => {
    const targets = pending.filter(p => selected.includes(p.id));
    if (!targets.length) {
      setError("Select at least one pending payout request.");
      return;
    }

    const reason = window.prompt("Enter rejection reason (minimum 3 characters):");
    if (!reason || reason.trim().length < 3) return;

    const testTargets = targets.filter(isTest);
    const realTargets = targets.filter(p => !isTest(p));

    if (!window.confirm(`Reject ${targets.length} selected request(s)? Test records will only be simulated.`)) return;

    setBusy(true);
    setError("");
    let success = 0;
    const failures: string[] = [];

    try {
      for (const item of realTargets) {
        try {
          await api.patch(`/super-admin/payouts/${item.id}/reject`, { reason: reason.trim() });
          success++;
        } catch (e: any) {
          failures.push(`${item.id}: ${e?.response?.data?.message || e.message || "Rejection failed"}`);
        }
      }

      if (realTargets.length) await load();

      for (const item of testTargets) {
        simulateTestAction(item, "REJECTED", reason.trim());
        success++;
      }

      setSelected([]);
      setNotice(`${success} request(s) rejected or simulated. Test records were not saved to the database.`);
      if (failures.length) setError(failures.slice(0, 4).join(" | "));
    } finally {
      setBusy(false);
    }
  };

  const exportCSV = (rows = filtered) => {
    const headers = [
      "Transaction ID", "Reference ID", "DSA Name", "Email", "Phone",
      "Bank", "Account", "IFSC", "Gross Amount", "TDS", "Net Amount",
      "Status", "Request Date"
    ];
    const body = rows.map(p => [
      p.transactionId, p.referenceId, p.user?.name, p.user?.email,
      p.user?.phoneNo, p.bankAccount?.bankName, p.bankAccount?.accountNumber,
      p.bankAccount?.ifscCode, p.amount, p.tax, p.netAmount, p.status, p.createdAt
    ]);

    const csv = [headers, ...body].map(row =>
      row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\r\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "AIFIN-Payout-Records.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedAll = visible.length > 0 && visible.every(p => selected.includes(p.id));

  const toggleAll = () => {
    if (selectedAll) {
      setSelected(old => old.filter(id => !visible.some(p => p.id === id)));
    } else {
      setSelected(old => [...new Set([...old, ...visible.map(p => p.id)])]);
    }
  };

  const cards = [
    { label: "Total Payouts", value: money(totalGross), count: records.length, icon: Wallet, color: "cyan", note: "Gross transaction value" },
    { label: "Payout Requests", value: money(pendingGross), count: pending.length, icon: Clock3, color: "amber", note: "Awaiting admin review" },
    { label: "Approved Payouts", value: money(approvedGross), count: approved.length, icon: CheckCircle2, color: "green", note: "Approved transactions" },
    { label: "Paid Payouts", value: money(paidNet), count: paid.length, icon: Landmark, color: "violet", note: "Confirmed paid value" },
    { label: "Rejected", value: money(rejectedGross), count: rejected.length, icon: XCircle, color: "rose", note: "Rejected requests" }
  ];

  const cardColors: Record<string, string> = {
    cyan: "border-cyan-400/50 from-cyan-500/20 to-blue-700/20 text-cyan-300",
    amber: "border-amber-300/50 from-amber-400/20 to-yellow-700/20 text-amber-300",
    green: "border-emerald-400/50 from-emerald-400/20 to-teal-700/20 text-emerald-300",
    violet: "border-violet-400/50 from-violet-500/20 to-indigo-700/20 text-violet-300",
    rose: "border-rose-400/50 from-rose-500/20 to-red-700/20 text-rose-300"
  };

  const statusCounts = [
    { label: "Paid", value: paid.length, color: "#10d99a" },
    { label: "Approved", value: approved.length, color: "#168cff" },
    { label: "Pending", value: pending.length, color: "#ffd52e" },
    { label: "Rejected", value: rejected.length, color: "#ff5575" }
  ];

  const distribution = statusCounts.reduce((s, x) => s + x.value, 0);
  let angle = 0;
  const donut = statusCounts.map(x => {
    const start = angle;
    angle += distribution ? x.value / distribution * 360 : 0;
    return `${x.color} ${start}deg ${angle}deg`;
  }).join(", ");

  return (
    <main className="min-h-screen space-y-5 bg-[#030a19] p-3 text-white md:p-5">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-[#082958] via-[#0b1d42] to-[#15143c] p-5 shadow-[0_0_30px_rgba(0,175,255,.16)]">
        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-cyan-300/60 bg-cyan-400/10 p-3 shadow-[0_0_25px_rgba(0,190,255,.35)]">
              <Wallet size={34} className="text-cyan-300" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[.3em] text-cyan-300">AIFIN · SUPER ADMIN CONTROL</p>
              <h1 className="mt-1 text-2xl font-black md:text-3xl">Payout Management</h1>
              <p className="mt-1 text-xs text-blue-200 md:text-sm">Review, approve and manage DSA payout requests.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live Database
            </span>
            <button onClick={() => void load()} disabled={loading} className={`${buttonBase} border-cyan-300/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20`}>
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={() => exportCSV(records)} className={`${buttonBase} border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20`}>
              <Download size={15} /> Export
            </button>
          </div>
        </div>
      </header>

      {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">{notice}</div>}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${cardColors[c.color]} p-4 shadow-[0_0_20px_rgba(0,140,255,.10)] transition hover:-translate-y-1`}>
              <div className="absolute -right-6 -top-7 h-24 w-24 rounded-full bg-white/5 blur-xl" />
              <div className="relative flex items-center justify-between">
                <p className="text-xs font-bold text-white/90">{c.label}</p>
                <Icon size={21} />
              </div>
              <p className="relative mt-3 text-xl font-black text-white">{c.value}</p>
              <div className="relative mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-300">{c.note}</span>
                <span className="rounded-full bg-black/25 px-2 py-1 text-[11px] font-black text-white">{c.count}</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
        <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#0a2348] to-[#07172f] p-4 shadow-[0_0_18px_rgba(0,180,255,.08)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black">Payout Trend</h2>
              <p className="mt-1 text-[10px] text-slate-400">Last 6 months · Database transactions</p>
            </div>
            <TrendingUp className="text-cyan-300" size={19} />
          </div>
          <div className="mt-5 flex h-40 items-end gap-3 border-b border-l border-blue-300/20 px-3">
            {months.map(m => (
              <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[9px] text-cyan-200">{m.amount ? money(m.amount) : "₹0"}</span>
                <div className="w-full max-w-12 rounded-t-md bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-300 shadow-[0_0_13px_rgba(0,200,255,.35)]" style={{ height: `${Math.max(3, m.amount / maxMonth * 100)}%` }} />
                <span className="text-[10px] text-slate-400">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-slate-400">
            <span>Monthly gross payout amount</span>
            <span>{records.length} records</span>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-br from-[#0b2347] to-[#07172e] p-4">
          <h2 className="text-sm font-black">Payout Status Distribution</h2>
          <p className="mt-1 text-[10px] text-slate-400">Current database status mix</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: distribution ? `conic-gradient(${donut})` : "#26364e" }}>
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-[#0a1d3b]">
                <span className="text-2xl font-black">{records.length}</span>
                <span className="text-[9px] text-slate-400">Transactions</span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              {statusCounts.map(s => (
                <div key={s.label} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.label}</span>
                  <b className="text-white">{s.value}</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-[#151b4c] to-[#081a36] p-4">
          <h2 className="text-sm font-black">Payout Processing Flow</h2>
          <p className="mt-1 text-[10px] text-slate-400">Request to payout workflow</p>
          <div className="mt-7 flex items-center justify-between gap-1">
            {[
              { label: "Request", sub: "DSA", icon: FileText, color: "text-violet-300" },
              { label: "Approve", sub: "Admin", icon: ShieldCheck, color: "text-emerald-300" },
              { label: "Process", sub: "Payment", icon: IndianRupee, color: "text-cyan-300" },
              { label: "Paid", sub: "Completed", icon: CheckCircle2, color: "text-emerald-300" }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex min-w-0 flex-1 flex-col items-center">
                  <div className={`rounded-full border border-current/30 bg-white/5 p-3 ${s.color} shadow-[0_0_16px_rgba(0,180,255,.15)]`}><Icon size={21} /></div>
                  <span className="mt-2 text-[10px] font-bold">{s.label}</span>
                  <span className="text-[9px] text-slate-500">{s.sub}</span>
                  {i < 3 && <ArrowRight className="absolute hidden" />}
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg border border-amber-400/20 bg-amber-400/5 p-2 text-[10px] text-amber-200">
            Bank transfer must be confirmed separately. Approval does not mean paid.
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_255px]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-blue-400/30 bg-[#081a35] shadow-[0_0_22px_rgba(0,150,255,.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-300/15 p-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "requests", label: "Payout Requests", count: pending.length, icon: FileText },
                { id: "approved", label: "Approved Payouts", count: approved.length, icon: ShieldCheck },
                { id: "settlements", label: "Settlements", count: paid.length, icon: Landmark },
                { id: "batch", label: "Batch Processing", count: pending.length, icon: Layers }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => { setTab(t.id as any); setSelected([]); }} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${tab === t.id ? "border-cyan-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,190,255,.3)]" : "border-blue-300/20 bg-[#102746] text-slate-300 hover:border-cyan-300/40"}`}>
                    <Icon size={15} /> {t.label} ({t.count})
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-emerald-300"><Activity size={12} className="mr-1 inline" /> Database connected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-blue-300/15 bg-[#091d39] p-3">
            <div className="relative min-w-52 flex-1">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Txn ID, DSA name, phone, bank..." className="w-full rounded-lg border border-blue-300/20 bg-[#06152c] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-cyan-400" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-blue-300/20 bg-[#102746] px-3 py-2.5 text-xs outline-none">
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="APPROVED">Approved</option>
              <option value="SUCCESS">Success</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select value={dsaFilter} onChange={e => setDsaFilter(e.target.value)} className="max-w-36 rounded-lg border border-blue-300/20 bg-[#102746] px-3 py-2.5 text-xs outline-none">
              <option value="ALL">All DSAs</option>
              {dsaNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="rounded-lg border border-blue-300/20 bg-[#102746] px-3 py-2.5 text-xs outline-none">
              <option value="ALL">All Dates</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-lg border border-blue-300/20 bg-[#102746] px-3 py-2.5 text-xs outline-none">
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
            <button onClick={() => { setSearch(""); setStatusFilter("ALL"); setDsaFilter("ALL"); setDateFilter("30"); setSort("NEWEST"); }} className="rounded-lg border border-blue-300/20 px-3 py-2.5 text-xs text-cyan-200 hover:bg-cyan-400/10">Reset</button>
            <button onClick={() => exportCSV()} className="flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-2.5 text-xs font-bold text-emerald-300"><Download size={14} /> CSV</button>
          </div>

          {loading ? (
            <div className="p-16 text-center text-cyan-200"><RefreshCw className="mx-auto mb-3 animate-spin" />Loading live payout records...</div>
          ) : visible.length === 0 ? (
            <div className="p-14 text-center">
              <Wallet size={32} className="mx-auto mb-3 text-slate-500" />
              <p className="font-bold text-slate-300">No matching payout records</p>
              <p className="mt-1 text-xs text-slate-500">Try changing filters or refresh the database records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-xs">
                <thead className="bg-gradient-to-r from-[#102d55] to-[#112348] text-[10px] uppercase tracking-wide text-blue-200">
                  <tr>
                    <th className="p-3"><input type="checkbox" checked={selectedAll} onChange={toggleAll} aria-label="Select all visible requests" /></th>
                    <th className="p-3"># / Transaction ID</th>
                    <th className="p-3">DSA / Partner</th>
                    <th className="p-3">Bank Details</th>
                    <th className="p-3">Gross Amount</th>
                    <th className="p-3">TDS</th>
                    <th className="p-3">Net Payout</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Request Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p, i) => (
                    <tr key={p.id} className="border-t border-blue-300/10 transition hover:bg-cyan-400/[0.045]">
                      <td className="p-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => setSelected(old => old.includes(p.id) ? old.filter(x => x !== p.id) : [...old, p.id])} aria-label={`Select ${p.transactionId}`} /></td>
                      <td className="p-3">
                        <span className="text-slate-500">{(currentPage - 1) * pageSize + i + 1}</span>
                        <p className="mt-1 font-bold text-cyan-300">{p.transactionId}</p>
                        <p className="mt-1 text-[9px] text-slate-500">{p.referenceId || p.id}</p>
                        {isTest(p) && <span className="mt-1 inline-block rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] text-amber-300">TEST RECORD</span>}
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-white">{p.user?.name || "Unknown User"}</p>
                        <p className="mt-1 text-[10px] text-slate-400">{p.user?.phoneNo || "—"}</p>
                        <p className="text-[10px] text-slate-500">{p.user?.email || "—"}</p>
                      </td>
                      <td className="p-3">
                        {p.bankAccount ? <>
                          <p className="flex items-center gap-1 font-semibold text-slate-200"><Building2 size={12} />{p.bankAccount.bankName || "Bank"}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{p.bankAccount.accountNumber}</p>
                          <p className="text-[10px] text-slate-500">IFSC: {p.bankAccount.ifscCode}</p>
                          <p className={`mt-1 text-[9px] ${p.bankAccount.isVerified ? "text-emerald-300" : "text-rose-300"}`}>{p.bankAccount.isVerified ? "Verified" : "Not verified"}</p>
                        </> : <span className="text-rose-300">Bank details unavailable</span>}
                      </td>
                      <td className="p-3 font-bold text-white">{money(p.amount)}</td>
                      <td className="p-3 text-amber-300">{money(p.tax)}</td>
                      <td className="p-3 font-black text-emerald-300">{money(p.netAmount)}</td>
                      <td className="p-3"><span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyle(p.status)}`}>{p.status}</span></td>
                      <td className="whitespace-nowrap p-3 text-[10px] text-slate-400">{shortDate(p.createdAt)}</td>
                      <td className="p-3">
                        {isPending(p.status) ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => void approveOne(p)} disabled={busy || (!isTest(p) && !p.bankAccount?.isVerified)} title={isTest(p) ? "Test record protected" : !p.bankAccount?.isVerified ? "Verified bank account required" : "Approve payout"} className="flex items-center gap-1 rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2 py-1.5 text-[10px] font-bold text-emerald-300 disabled:opacity-40"><Check size={12} />Approve</button>
                            <button onClick={() => { setRejectItem(p); setRejectReason(""); }} disabled={busy} title={isTest(p) ? "Test Mode: local simulation only" : "Reject payout"} className="flex items-center gap-1 rounded-md border border-rose-400/40 bg-rose-500/15 px-2 py-1.5 text-[10px] font-bold text-rose-300 disabled:opacity-40"><Ban size={12} />Reject</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">{p.approvedAt ? shortDate(p.approvedAt) : "Processed"}</span>
                            <button onClick={() => setDetailItem(p)} title="View details" className="rounded-md border border-cyan-400/30 p-1.5 text-cyan-300 hover:bg-cyan-400/10"><Eye size={14} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-300/15 bg-[#07172e] p-3">
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
              <span>{selected.length} selected</span>
              <button onClick={() => void bulkApprove()} disabled={!selected.length || busy || tab !== "requests"} className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1.5 font-bold text-emerald-300 disabled:opacity-40">Approve Selected</button>
              <button onClick={() => void bulkReject()} disabled={!selected.length || busy || tab !== "requests"} className="rounded-md border border-rose-400/30 bg-rose-500/10 px-2.5 py-1.5 font-bold text-rose-300 disabled:opacity-40">Reject Selected</button>
              <button onClick={() => exportCSV(visible.filter(p => selected.includes(p.id)))} disabled={!selected.length} className="rounded-md border border-blue-300/30 px-2.5 py-1.5 text-cyan-200 disabled:opacity-40">Export Selected</button>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{filtered.length} records</span>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-md border border-blue-300/20 p-1.5 disabled:opacity-30"><ChevronLeft size={15} /></button>
              <span className="rounded-md border border-cyan-400 bg-cyan-500/20 px-3 py-1.5 text-white">{currentPage}</span>
              <span>/ {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-md border border-blue-300/20 p-1.5 disabled:opacity-30"><ChevronRight size={15} /></button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#0d2b53] to-[#101b40] p-4 shadow-[0_0_18px_rgba(0,170,255,.12)]">
            <h2 className="flex items-center gap-2 text-sm font-black"><Zap size={17} className="text-cyan-300" /> Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <button onClick={() => void load()} disabled={loading} className="flex w-full items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2.5 text-left text-xs font-bold hover:bg-cyan-400/20"><RefreshCw size={15} /> Refresh Payout Data</button>
              <button onClick={() => void bulkApprove()} disabled={!selected.length || busy || tab !== "requests"} className="flex w-full items-center gap-2 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-3 py-2.5 text-left text-xs font-bold text-emerald-200 disabled:opacity-40"><CheckCircle2 size={15} /> Bulk Approve Requests</button>
              <button onClick={() => void bulkReject()} disabled={!selected.length || busy || tab !== "requests"} className="flex w-full items-center gap-2 rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-2.5 text-left text-xs font-bold text-rose-200 disabled:opacity-40"><XCircle size={15} /> Bulk Reject Requests</button>
              <button onClick={() => exportCSV(records)} className="flex w-full items-center gap-2 rounded-lg border border-blue-300/30 bg-blue-400/10 px-3 py-2.5 text-left text-xs font-bold text-blue-200"><Download size={15} /> Download Full Report</button>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-[#191d50] to-[#0a1b38] p-4">
            <h2 className="flex items-center gap-2 text-sm font-black"><Activity size={17} className="text-violet-300" /> Payout Insights</h2>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between gap-2"><span className="text-slate-400">Average Gross</span><b>{money(records.length ? totalGross / records.length : 0)}</b></div>
              <div className="flex justify-between gap-2"><span className="text-slate-400">Total TDS</span><b className="text-amber-300">{money(totalTds)}</b></div>
              <div className="flex justify-between gap-2"><span className="text-slate-400">Paid Count</span><b className="text-emerald-300">{paid.length}</b></div>
              <div className="flex justify-between gap-2"><span className="text-slate-400">Pending Value</span><b className="text-amber-300">{money(pendingGross)}</b></div>
              <div className="flex justify-between gap-2"><span className="text-slate-400">Unique DSA Users</span><b>{dsaNames.length}</b></div>
              <div className="border-t border-violet-300/15 pt-3">
                <p className="text-[10px] text-slate-500">Metrics calculated from loaded payout transactions.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-br from-[#0c2548] to-[#091a35] p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black">Recent Activity</h2>
              <button onClick={() => { setTab("requests"); setSearch(""); setStatusFilter("ALL"); setDsaFilter("ALL"); setDateFilter("30"); setSort("NEWEST"); setPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-[10px] text-cyan-300 hover:underline">View All Requests</button>
            </div>
            <div className="mt-4 space-y-4">
              {recent.length ? recent.map(p => (
                <div key={p.id} onClick={() => setDetailItem(p)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setDetailItem(p); }} title="View payout details" className="flex cursor-pointer items-start gap-3 rounded-lg p-1 transition hover:bg-cyan-400/10">
                  <span className={`rounded-full p-2 ${isPaid(p.status) ? "bg-emerald-400/15 text-emerald-300" : isRejected(p.status) ? "bg-rose-400/15 text-rose-300" : "bg-amber-400/15 text-amber-300"}`}>
                    {isPaid(p.status) ? <CheckCircle2 size={15} /> : isRejected(p.status) ? <XCircle size={15} /> : <Clock3 size={15} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{isPaid(p.status) ? "Payout Paid" : isRejected(p.status) ? "Payout Rejected" : isApproved(p) ? "Payout Approved" : "Payout Request"}</p>
                    <p className="mt-1 truncate text-[10px] text-slate-400">{p.user?.name || "Unknown User"} · {money(p.amount)}</p>
                    <p className="mt-1 text-[9px] text-slate-500">{shortDate(p.createdAt)}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-slate-500">No activity records found.</p>}
            </div>
          </div>
        </aside>
      </section>

      {rejectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-300/30 bg-[#0a1d3a] p-6 shadow-[0_0_35px_rgba(255,50,100,.2)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Reject Payout Request</h2>
              <button onClick={() => setRejectItem(null)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10"><X size={18} /></button>
            </div>
            <p className="mt-2 text-xs text-slate-400">{rejectItem.user?.name} · {money(rejectItem.amount)}</p>
            <label className="mt-5 block text-xs font-bold text-slate-300">Rejection Reason</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} maxLength={500} rows={4} placeholder="Enter a clear rejection reason..." className="mt-2 w-full rounded-xl border border-blue-300/20 bg-[#041329] p-3 text-sm outline-none focus:border-cyan-400" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setRejectItem(null)} className="rounded-xl border border-slate-600 px-4 py-2 text-xs">Cancel</button>
              <button onClick={() => void rejectOne()} disabled={busy || rejectReason.trim().length < 3} className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold disabled:opacity-40">{busy ? "Processing..." : "Confirm Rejection"}</button>
            </div>
          </div>
        </div>
      )}

      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-cyan-300/30 bg-[#0a1d3a] p-6 shadow-[0_0_35px_rgba(0,160,255,.2)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Payout Details</h2>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10"><X size={18} /></button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div><p className="text-slate-400">Transaction ID</p><b className="mt-1 block text-cyan-300">{detailItem.transactionId}</b></div>
              <div><p className="text-slate-400">Status</p><b className="mt-1 block">{detailItem.status}</b></div>
              <div><p className="text-slate-400">DSA</p><b className="mt-1 block">{detailItem.user?.name || "—"}</b></div>
              <div><p className="text-slate-400">Phone</p><b className="mt-1 block">{detailItem.user?.phoneNo || "—"}</b></div>
              <div><p className="text-slate-400">Gross Amount</p><b className="mt-1 block">{money(detailItem.amount)}</b></div>
              <div><p className="text-slate-400">TDS</p><b className="mt-1 block text-amber-300">{money(detailItem.tax)}</b></div>
              <div><p className="text-slate-400">Net Amount</p><b className="mt-1 block text-emerald-300">{money(detailItem.netAmount)}</b></div>
              <div><p className="text-slate-400">Request Date</p><b className="mt-1 block">{shortDate(detailItem.createdAt)}</b></div>
              <div className="col-span-2"><p className="text-slate-400">Rejection Reason</p><b className="mt-1 block">{detailItem.rejectReason || "—"}</b></div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}




