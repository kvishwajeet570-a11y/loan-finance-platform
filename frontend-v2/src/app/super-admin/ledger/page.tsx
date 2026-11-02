"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen, Wallet, Plus, Minus, Coins, Search, RefreshCw,
  CalendarDays, Download, Eye, ChevronLeft, ChevronRight,
  Filter, X, Activity
} from "lucide-react";
import api from "@/lib/api";

type Tx = {
  id?: string;
  transactionId?: string;
  referenceId?: string;
  type?: string;
  category?: string;
  amount?: number | string;
  fee?: number | string;
  status?: string;
  description?: string;
  remark?: string;
  createdAt?: string;
  user?: { id?: string; name?: string; email?: string };
  wallet?: { balance?: number | string };
};

const money = (v: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  }).format(Number(v) || 0);

const statusStyle = (s: string) => {
  const v = s.toLowerCase();
  if (["success", "completed", "approved"].includes(v))
    return "border-emerald-500 bg-emerald-500/15 text-emerald-300";
  if (["pending", "processing", "processed"].includes(v))
    return "border-cyan-500 bg-cyan-500/15 text-cyan-300";
  if (["failed", "rejected", "cancelled"].includes(v))
    return "border-red-500 bg-red-500/15 text-red-300";
  return "border-slate-500 bg-slate-500/15 text-slate-300";
};

export default function LedgerPage() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Tx | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const limit = 10;

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string | number> = { page: p, limit };

      if (search.trim()) params.search = search.trim();
      if (type) params.type = type;
      if (status) params.status = status;

      if (period !== "all") {
        const start = new Date();
        start.setDate(start.getDate() - Number(period));
        start.setHours(0, 0, 0, 0);
        params.startDate = start.toISOString();
        params.endDate = new Date().toISOString();
      }

      const res = await api.get("/transaction", { params });
      const payload = res.data?.data;
      const data = Array.isArray(payload?.transactions)
        ? payload.transactions
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setRows(data);
      setTotal(Number(payload?.total ?? 0));
      setPages(Math.max(1, Number(payload?.totalPages ?? 1)));
      setPage(Number(payload?.page ?? p));
    } catch (e: any) {
      setRows([]);
      setError(e?.response?.data?.message || "Ledger records load nahi ho paye. API response check karein.");
    } finally {
      setLoading(false);
    }
  }, [search, type, status, period]);

  useEffect(() => { load(1); }, [load]);

  const totals = useMemo(() => {
    const credit = rows
      .filter(t => String(t.type).toUpperCase() === "CREDIT")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    const debit = rows
      .filter(t => String(t.type).toUpperCase() === "DEBIT")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    return { credit, debit };
  }, [rows]);

  const exportCSV = () => {
    const header = [
      "Date", "Transaction ID", "User", "Particulars",
      "Type", "Credit", "Debit", "Status"
    ];
    const data = rows.map(t => {
      const isCredit = String(t.type).toUpperCase() === "CREDIT";
      const isDebit = String(t.type).toUpperCase() === "DEBIT";
      return [
        t.createdAt || "",
        t.transactionId || t.id || "",
        t.user?.name || "",
        t.description || t.remark || t.category || "",
        t.type || "",
        isCredit ? Number(t.amount || 0) : "",
        isDebit ? Number(t.amount || 0) : "",
        t.status || ""
      ];
    });

    const csv = [header, ...data].map(r =>
      r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AIFIN-Ledger-Entries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Opening Balance", value: "—", icon: Wallet, color: "cyan", note: "Not provided by current API" },
    { label: "Total Credit", value: money(totals.credit), icon: Plus, color: "green", note: "Current loaded records" },
    { label: "Total Debit", value: money(totals.debit), icon: Minus, color: "red", note: "Current loaded records" },
    { label: "Closing Balance", value: "—", icon: Coins, color: "purple", note: "Requires ledger balance API" }
  ];

  const cardColor: Record<string, string> = {
    cyan: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
    green: "border-emerald-400 bg-emerald-500/10 text-emerald-300",
    red: "border-rose-400 bg-rose-500/10 text-rose-300",
    purple: "border-purple-400 bg-purple-500/10 text-purple-300"
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_rgba(0,112,255,0.18),_transparent_45%),linear-gradient(135deg,#061329,#071a34_55%,#061329)] px-4 pb-8 pt-5 text-white sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* Compact page heading: no decorative banner or illustration */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/50 bg-gradient-to-br from-cyan-400/25 to-blue-700/20 text-cyan-200 shadow-[0_0_25px_rgba(0,170,255,0.25)]">
              <BookOpen size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Ledger <span className="text-yellow-400">Entries</span>
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Financial record of wallet credits, debits and transaction activity.
              </p>
            </div>
          </div>
          <button onClick={() => load(page)} disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-[#10284a] px-5 py-3 text-sm font-extrabold shadow-[0_0_16px_rgba(0,140,255,0.16)] hover:border-cyan-300 disabled:opacity-50">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>
        )}

        {/* Ledger summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label}
                className={`rounded-2xl border-2 ${cardColor[c.color]} bg-gradient-to-br from-[#102747] to-[#091a32] p-5 shadow-[0_0_25px_rgba(0,100,255,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(0,150,255,0.25)]`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-white">{c.label}</p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3"><Icon size={25} /></div>
                </div>
                <p className="mt-3 text-2xl font-black text-white">{loading ? "Loading..." : c.value}</p>
                <p className="mt-2 text-xs text-slate-400">{c.note}</p>
              </div>
            );
          })}
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#102b4e] via-[#0b203d] to-[#08162b] p-5 shadow-[0_0_25px_rgba(0,100,255,0.14)]">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-cyan-300">
            <Filter size={18} /> Ledger Filters
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.1fr_auto_auto]">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Account / Txn ID / User</label>
              <div className="flex items-center gap-2 rounded-xl border border-blue-300/30 bg-[#071a34] px-3 focus-within:border-cyan-400">
                <Search size={17} className="text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && load(1)}
                  placeholder="Search ledger entries..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Transaction Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full rounded-xl border border-blue-300/30 bg-[#071a34] px-3 py-3 text-sm outline-none">
                <option value="">All Types</option><option value="CREDIT">Credit</option><option value="DEBIT">Debit</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full rounded-xl border border-blue-300/30 bg-[#071a34] px-3 py-3 text-sm outline-none">
                <option value="">All Status</option><option value="success">Success</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Date Range</label>
              <div className="flex items-center gap-2 rounded-xl border border-blue-300/30 bg-[#071a34] px-3">
                <CalendarDays size={17} className="text-cyan-300" />
                <select value={period} onChange={e => setPeriod(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm outline-none">
                  <option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="90">Last 90 Days</option><option value="all">All Time</option>
                </select>
              </div>
            </div>
            <button onClick={() => load(1)}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold shadow-[0_0_18px_rgba(0,150,255,0.25)] hover:brightness-110">
              <Search size={17} /> Search
            </button>
            <button onClick={() => { setSearch(""); setType(""); setStatus(""); setPeriod("all"); }}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-slate-400/40 bg-[#142947] px-5 py-3 text-sm font-bold hover:bg-slate-700">
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </section>

        {/* Ledger table */}
        <section className="overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#102747] via-[#0b203c] to-[#07162b] shadow-[0_0_30px_rgba(0,100,255,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-300/20 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <Activity size={21} className="text-cyan-300" /> Ledger Entries
            </h2>
            <button onClick={exportCSV} disabled={!rows.length}
              className="flex items-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40">
              <Download size={15} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead className="bg-gradient-to-r from-[#12345b] to-[#102744] text-xs uppercase tracking-wider text-cyan-100">
                <tr>
                  {["#", "Date & Time", "Txn ID / Reference", "User / Partner", "Particulars / Remark", "Type", "Credit (₹)", "Debit (₹)", "Running Balance (₹)", "Action"].map(h =>
                    <th key={h} className="px-4 py-4 font-bold">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200/15">
                {rows.map((t, i) => {
                  const credit = String(t.type).toUpperCase() === "CREDIT";
                  const debit = String(t.type).toUpperCase() === "DEBIT";
                  return (
                    <tr key={t.id || t.transactionId || i} className="transition hover:bg-cyan-400/[0.06]">
                      <td className="px-4 py-5 text-slate-300">{(page - 1) * limit + i + 1}</td>
                      <td className="whitespace-nowrap px-4 py-5 text-slate-300">
                        {t.createdAt ? new Date(t.createdAt).toLocaleString("en-IN") : "—"}
                      </td>
                      <td className="px-4 py-5">
                        <p className="font-bold text-white">{t.transactionId || t.id || "—"}</p>
                        <p className="mt-1 text-xs text-slate-500">{t.referenceId || ""}</p>
                      </td>
                      <td className="px-4 py-5">
                        <p className="font-bold text-white">{t.user?.name || "—"}</p>
                        <p className="mt-1 text-xs text-slate-400">{t.user?.email || "—"}</p>
                      </td>
                      <td className="px-4 py-5 text-slate-300">{t.description || t.remark || t.category || "—"}</td>
                      <td className="px-4 py-5">
                        <span className={`rounded-full border px-4 py-1.5 text-xs font-extrabold ${credit ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : debit ? "border-red-500 bg-red-500/15 text-red-300" : "border-purple-500 bg-purple-500/15 text-purple-300"}`}>
                          {t.type || "—"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 font-extrabold text-emerald-300">{credit ? `+ ${money(t.amount)}` : "—"}</td>
                      <td className="whitespace-nowrap px-4 py-5 font-extrabold text-red-300">{debit ? `- ${money(t.amount)}` : "—"}</td>
                      <td className="px-4 py-5 font-bold text-slate-300">{t.wallet?.balance != null ? money(t.wallet.balance) : "—"}</td>
                      <td className="px-4 py-5">
                        <button onClick={() => setSelected(t)} title="View entry"
                          className="rounded-xl border border-cyan-400/60 bg-cyan-500/10 p-2.5 text-cyan-200 hover:bg-cyan-500/25 hover:shadow-[0_0_18px_rgba(34,211,238,0.3)]">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-14 text-center text-slate-400">No ledger entries found for selected filters.</td></tr>
                )}
                {loading && (
                  <tr><td colSpan={10} className="px-4 py-14 text-center text-cyan-300">Loading real ledger entries...</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-300/20 px-5 py-4">
            <p className="text-sm text-slate-300">
              Showing {total ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of <strong className="text-white">{total}</strong> entries
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => load(page - 1)} disabled={page <= 1 || loading}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold disabled:opacity-30">
                <ChevronLeft size={15} /> Previous
              </button>
              <span className="rounded-lg border border-cyan-400 bg-blue-600 px-4 py-2 text-sm font-extrabold">{page}</span>
              <span className="text-xs text-slate-400">of {pages}</span>
              <button onClick={() => load(page + 1)} disabled={page >= pages || loading}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold disabled:opacity-30">
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="grid gap-3 border-t border-blue-300/20 bg-[#07172d]/70 p-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-xs text-slate-300">Total Credit · Loaded Page</p>
              <p className="mt-1 text-xl font-black text-emerald-300">{money(totals.credit)}</p>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-slate-300">Total Debit · Loaded Page</p>
              <p className="mt-1 text-xl font-black text-red-300">{money(totals.debit)}</p>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3">
              <p className="text-xs text-slate-300">Net Movement · Loaded Page</p>
              <p className="mt-1 text-xl font-black text-purple-300">{money(totals.credit - totals.debit)}</p>
            </div>
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-xl rounded-2xl border border-cyan-300/60 bg-gradient-to-br from-[#102b4e] to-[#07162b] p-6 shadow-[0_0_45px_rgba(0,150,255,0.3)]" onClick={e => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Ledger Entry Details</p>
                <h3 className="mt-1 text-lg font-extrabold">{selected.transactionId || selected.id || "Entry"}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["User", selected.user?.name || "—"],
                ["Type", selected.type || "—"],
                ["Amount", money(selected.amount)],
                ["Status", selected.status || "—"],
                ["Category", selected.category || "—"],
                ["Fee", money(selected.fee)],
                ["Wallet Balance", selected.wallet?.balance != null ? money(selected.wallet.balance) : "—"],
                ["Date", selected.createdAt ? new Date(selected.createdAt).toLocaleString("en-IN") : "—"]
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-blue-300/15 bg-[#102743] p-3">
                  <p className="text-[11px] text-slate-400">{k}</p>
                  <p className="mt-1 break-words text-sm font-bold text-white">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-blue-300/15 bg-[#102743] p-3">
              <p className="text-[11px] text-slate-400">Particulars / Remark</p>
              <p className="mt-1 text-sm text-white">{selected.description || selected.remark || "—"}</p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-extrabold">Close Details</button>
          </div>
        </div>
      )}
    </main>
  );
}
