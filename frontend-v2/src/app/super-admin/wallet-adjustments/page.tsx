"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet, Plus, Minus, Coins, Search, RefreshCw, Download,
  Eye, ChevronLeft, ChevronRight, X, Info, FileText, UserRound
} from "lucide-react";
import api from "@/lib/api";

type WalletRecord = {
  id: string;
  balance?: number | string;
  userId?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phoneNo?: string;
    role?: string;
  };
};

type Adjustment = {
  id?: string;
  transactionId?: string;
  type?: string;
  amount?: number | string;
  status?: string;
  category?: string;
  description?: string;
  remark?: string;
  createdAt?: string;
  user?: { name?: string; email?: string; role?: string };
  wallet?: { user?: { name?: string; email?: string; role?: string } };
};

const money = (v: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  }).format(Number(v) || 0);

function extractArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.wallets)) return payload.data.wallets;
  if (Array.isArray(payload?.wallets)) return payload.wallets;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

export default function WalletAdjustmentsPage() {
  const [wallets, setWallets] = useState<WalletRecord[]>([]);
  const [records, setRecords] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [kind, setKind] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Adjustment | null>(null);
  const limit = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [walletResult, activityResult] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/live")
      ]);

      const walletRows = extractArray(walletResult.data);
      const activityRows = extractArray(activityResult.data);

      setWallets(walletRows);
      setRecords(activityRows);

      if (!walletId && walletRows.length) {
        setWalletId(walletRows[0].id);
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        "Wallet data load nahi ho paya. Backend connection check karein."
      );
    } finally {
      setLoading(false);
    }
  }, [walletId]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedWallet = wallets.find(w => w.id === walletId);

  const totals = useMemo(() => {
    const adjustments = records.filter(r =>
      ["CREDIT", "DEBIT"].includes(String(r.type).toUpperCase())
    );

    const credit = adjustments
      .filter(r => String(r.type).toUpperCase() === "CREDIT")
      .reduce((s, r) => s + Number(r.amount || 0), 0);

    const debit = adjustments
      .filter(r => String(r.type).toUpperCase() === "DEBIT")
      .reduce((s, r) => s + Number(r.amount || 0), 0);

    return {
      count: adjustments.length,
      credit,
      debit,
      net: credit - debit
    };
  }, [records]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return records;
    return records.filter(r => {
      const name = r.user?.name || r.wallet?.user?.name || "";
      const id = r.transactionId || r.id || "";
      const text = r.description || r.remark || r.category || "";
      return `${name} ${id} ${text} ${r.type} ${r.status}`.toLowerCase().includes(q);
    });
  }, [records, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / limit));
  const pageRows = filtered.slice((page - 1) * limit, page * limit);

  const submitAdjustment = async () => {
    setError("");
    setSuccess("");

    const value = Number(amount);

    if (!walletId) {
      setError("Please select a customer or DSA wallet.");
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (!remark.trim()) {
      setError("Adjustment remark is required.");
      return;
    }

    if (kind === "DEBIT" && selectedWallet && value > Number(selectedWallet.balance || 0)) {
      setError("Insufficient wallet balance for this debit.");
      return;
    }

    const confirmed = window.confirm(
      `${kind === "CREDIT" ? "CREDIT" : "DEBIT"} ${money(value)} ${kind === "CREDIT" ? "to" : "from"} ${selectedWallet?.user?.name || "selected wallet"}?\n\nThis action will change the actual wallet balance.`
    );

    if (!confirmed) return;

    setSubmitting(true);
    try {
      const endpoint = `/wallet/${walletId}/${kind === "CREDIT" ? "credit" : "debit"}`;

      await api.patch(endpoint, {
        amount: value,
        description: remark.trim()
      });

      setSuccess(`${kind} adjustment submitted successfully.`);
      setAmount("");
      setRemark("");
      await load();
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        "Adjustment failed. Please verify wallet and backend response."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const exportCSV = () => {
    const header = ["Date", "Transaction ID", "User", "Type", "Amount", "Remark", "Status"];
    const data = filtered.map(r => [
      r.createdAt || "",
      r.transactionId || r.id || "",
      r.user?.name || r.wallet?.user?.name || "",
      r.type || "",
      r.amount || 0,
      r.description || r.remark || "",
      r.status || ""
    ]);

    const csv = [header, ...data].map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AIFIN-Wallet-Adjustments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Total Adjustments", value: String(totals.count), icon: Wallet, color: "cyan" },
    { label: "Total Credit", value: money(totals.credit), icon: Plus, color: "green" },
    { label: "Total Debit", value: money(totals.debit), icon: Minus, color: "red" },
    { label: "Net Adjustment", value: money(totals.net), icon: Coins, color: "purple" }
  ];

  const cardColors: Record<string, string> = {
    cyan: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
    green: "border-emerald-400 bg-emerald-500/10 text-emerald-300",
    red: "border-rose-400 bg-rose-500/10 text-rose-300",
    purple: "border-purple-400 bg-purple-500/10 text-purple-300"
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_15%_10%,_rgba(0,190,255,0.18),_transparent_32%),radial-gradient(ellipse_at_85%_15%,_rgba(105,0,255,0.16),_transparent_35%),linear-gradient(135deg,#020817,#061a36_55%,#020817)] px-4 pb-8 pt-5 text-white sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* Compact heading - no banner */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/50 bg-gradient-to-br from-cyan-400/25 to-blue-700/20 text-cyan-200 shadow-[0_0_25px_rgba(0,170,255,0.25)]">
              <Coins size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight drop-shadow-[0_0_18px_rgba(0,170,255,0.35)] sm:text-4xl">
                Wallet <span className="text-yellow-400">Adjustments</span>
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Manually credit or debit user and partner wallets with controlled access.
              </p>
            </div>
          </div>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-[#10284a] px-5 py-3 text-sm font-extrabold hover:border-cyan-300 disabled:opacity-50">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        {success && <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{success}</div>}

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label}
                className={`rounded-2xl border-2 ${cardColors[c.color]} bg-gradient-to-br from-[#102747] to-[#091a32] p-5 shadow-[0_0_30px_rgba(0,150,255,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(0,190,255,0.38)] backdrop-blur-xl`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{c.label}</p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3"><Icon size={25} /></div>
                </div>
                <p className="mt-3 text-2xl font-black text-white">{loading ? "Loading..." : c.value}</p>
                <p className="mt-2 text-xs text-slate-400">Based on loaded wallet activity records</p>
              </div>
            );
          })}
        </section>

        {/* Adjustment form and quick info */}
        <section className="grid gap-5 xl:grid-cols-[2fr_0.95fr]">
          <div className="rounded-2xl border border-cyan-300/70 bg-gradient-to-br from-[#10345c]/95 via-[#092344]/95 to-[#06152c]/95 p-6 shadow-[0_0_35px_rgba(0,170,255,0.24)] backdrop-blur-xl">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold">
              <Wallet className="text-cyan-300" size={22} /> Create Wallet Adjustment
            </h2>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-slate-300">Adjustment Type</span>
              <button onClick={() => setKind("CREDIT")}
                className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition ${kind === "CREDIT" ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.2)]" : "border-slate-500/50 text-slate-300"}`}>
                <Plus size={17} /> Credit (Add Money)
              </button>
              <button onClick={() => setKind("DEBIT")}
                className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition ${kind === "DEBIT" ? "border-red-400 bg-red-500/20 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.2)]" : "border-slate-500/50 text-slate-300"}`}>
                <Minus size={17} /> Debit (Deduct Money)
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Select User / Partner <span className="text-red-400">*</span></label>
                <select value={walletId} onChange={e => setWalletId(e.target.value)}
                  className="w-full rounded-xl border border-blue-300/40 bg-[#071a34] px-3 py-3.5 text-sm text-white outline-none focus:border-cyan-400">
                  <option value="">Choose wallet...</option>
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>
                      {(w.user?.name || "Unnamed User")} · {w.user?.email || w.userId || w.id} · Balance {money(w.balance)}
                    </option>
                  ))}
                </select>
                {selectedWallet && (
                  <p className="mt-2 text-xs text-cyan-300">
                    Current balance: {money(selectedWallet.balance)}
                  </p>
                )}
                {!loading && wallets.length === 0 && (
                  <p className="mt-2 text-xs text-amber-300">No wallets returned by backend.</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Amount (₹) <span className="text-red-400">*</span></label>
                <input type="number" min="0.01" step="0.01" value={amount}
                  onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
                  className="w-full rounded-xl border border-blue-300/40 bg-[#071a34] px-3 py-3.5 text-sm text-white outline-none focus:border-cyan-400" />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-slate-200">Remark / Particulars <span className="text-red-400">*</span></label>
              <textarea value={remark} maxLength={200} onChange={e => setRemark(e.target.value)}
                placeholder="Enter adjustment remark (e.g. bonus, reversal, correction...)"
                rows={3}
                className="w-full resize-y rounded-xl border border-blue-300/40 bg-[#071a34] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400" />
              <p className="mt-1 text-right text-xs text-slate-400">{remark.length} / 200</p>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button onClick={() => { setAmount(""); setRemark(""); setError(""); setSuccess(""); }}
                className="flex items-center gap-2 rounded-xl border border-slate-400/40 bg-slate-500/20 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-500/30">
                <RefreshCw size={16} /> Clear
              </button>
              <button onClick={submitAdjustment} disabled={submitting || loading || !wallets.length}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white shadow-[0_0_28px_rgba(0,150,255,0.38)] transition-all duration-300 hover:scale-[1.02] hover:brightness-125 disabled:opacity-50 ${kind === "CREDIT" ? "bg-gradient-to-r from-blue-600 to-cyan-500" : "bg-gradient-to-r from-red-600 to-rose-500"}`}>
                {kind === "CREDIT" ? <Plus size={19} /> : <Minus size={19} />}
                {submitting ? "Processing..." : "Add Adjustment"}
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-cyan-300/60 bg-gradient-to-br from-[#10345c]/95 via-[#092344]/95 to-[#06152c]/95 p-5 shadow-[0_0_32px_rgba(0,170,255,0.20)] backdrop-blur-xl">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold">
              <Info size={21} className="text-cyan-300" /> Quick Info
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="h-fit rounded-full bg-emerald-500/20 p-2 text-emerald-300"><Plus size={20} /></div>
                <div><p className="text-sm font-bold text-white">Credit Adjustment</p><p className="mt-1 text-xs text-slate-300">Add money to the selected user or partner wallet.</p></div>
              </div>
              <div className="flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="h-fit rounded-full bg-red-500/20 p-2 text-red-300"><Minus size={20} /></div>
                <div><p className="text-sm font-bold text-white">Debit Adjustment</p><p className="mt-1 text-xs text-slate-300">Deduct money from the selected wallet. Insufficient balance is rejected.</p></div>
              </div>
              <div className="flex gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div className="h-fit rounded-full bg-purple-500/20 p-2 text-purple-300"><FileText size={20} /></div>
                <div><p className="text-sm font-bold text-white">Transaction Records</p><p className="mt-1 text-xs text-slate-300">Wallet credit and debit operations create transaction records.</p></div>
              </div>
            </div>
          </aside>
        </section>

        {/* Recent adjustments */}
        <section className="overflow-hidden rounded-2xl border border-cyan-300/70 bg-gradient-to-br from-[#102e52] via-[#091f3b] to-[#041329] shadow-[0_0_38px_rgba(0,160,255,0.25)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-300/20 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><FileText size={21} className="text-cyan-300" /> Recent Adjustments</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-blue-300/30 bg-[#071a34] px-3">
                <Search size={15} className="text-slate-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search records..." className="w-36 bg-transparent py-2 text-xs outline-none placeholder:text-slate-500" />
              </div>
              <button onClick={exportCSV} disabled={!filtered.length}
                className="flex items-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40">
                <Download size={15} /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-gradient-to-r from-[#07518a] via-[#123e70] to-[#28165b] text-xs uppercase tracking-widest text-cyan-100">
                <tr>
                  {["#", "Date & Time", "User / Partner", "Type", "Amount (₹)", "Remark / Particulars", "Status", "Action"].map(h =>
                    <th key={h} className="px-4 py-4 font-bold">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200/15">
                {pageRows.map((r, i) => {
                  const credit = String(r.type).toUpperCase() === "CREDIT";
                  const user = r.user || r.wallet?.user;
                  return (
                    <tr key={r.id || r.transactionId || i} className="transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400/[0.12] hover:to-blue-500/[0.08]">
                      <td className="px-4 py-4 text-slate-300">{(page - 1) * limit + i + 1}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-300">{r.createdAt ? new Date(r.createdAt).toLocaleString("en-IN") : "—"}</td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-white">{user?.name || "—"}</p>
                        <p className="mt-1 text-xs text-slate-400">{user?.email || "—"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full border px-4 py-1.5 text-xs font-extrabold ${credit ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : "border-red-500 bg-red-500/15 text-red-300"}`}>{r.type || "—"}</span>
                      </td>
                      <td className={`whitespace-nowrap px-4 py-4 font-extrabold ${credit ? "text-emerald-300" : "text-red-300"}`}>{credit ? "+ " : "- "}{money(r.amount)}</td>
                      <td className="px-4 py-4 text-slate-300">{r.description || r.remark || r.category || "—"}</td>
                      <td className="px-4 py-4"><span className="rounded-full border border-emerald-500 bg-emerald-500/15 px-3 py-1.5 text-xs font-extrabold text-emerald-300">{r.status || "—"}</span></td>
                      <td className="px-4 py-4">
                        <button onClick={() => setSelected(r)} className="rounded-xl border border-cyan-400/60 bg-cyan-500/10 p-2.5 text-cyan-200 hover:bg-cyan-500/25"><Eye size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
                {!loading && pageRows.length === 0 && <tr><td colSpan={8} className="px-4 py-14 text-center text-slate-400">No adjustment records found.</td></tr>}
                {loading && <tr><td colSpan={8} className="px-4 py-14 text-center text-cyan-300">Loading wallet activity...</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-300/20 px-5 py-4">
            <p className="text-sm text-slate-300">Showing {filtered.length ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, filtered.length)} of {filtered.length} loaded records</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold disabled:opacity-30"><ChevronLeft size={15} /> Previous</button>
              <span className="rounded-lg border border-cyan-400 bg-blue-600 px-4 py-2 text-sm font-extrabold">{page}</span>
              <span className="text-xs text-slate-400">of {pageCount}</span>
              <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page >= pageCount}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold disabled:opacity-30">Next <ChevronRight size={15} /></button>
            </div>
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-cyan-300/60 bg-gradient-to-br from-[#102b4e] to-[#07162b] p-6 shadow-[0_0_45px_rgba(0,150,255,0.3)]" onClick={e => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Adjustment Details</p><h3 className="mt-1 text-lg font-extrabold">{selected.transactionId || selected.id || "Wallet Transaction"}</h3></div>
              <button onClick={() => setSelected(null)} className="rounded-full border border-white/10 p-2 text-slate-300"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["User", selected.user?.name || selected.wallet?.user?.name || "—"],
                ["Type", selected.type || "—"],
                ["Amount", money(selected.amount)],
                ["Status", selected.status || "—"],
                ["Category", selected.category || "—"],
                ["Date", selected.createdAt ? new Date(selected.createdAt).toLocaleString("en-IN") : "—"]
              ].map(([k, v]) => <div key={k} className="rounded-xl border border-blue-300/15 bg-[#102743] p-3"><p className="text-[11px] text-slate-400">{k}</p><p className="mt-1 break-words text-sm font-bold text-white">{v}</p></div>)}
            </div>
            <div className="mt-3 rounded-xl border border-blue-300/15 bg-[#102743] p-3"><p className="text-[11px] text-slate-400">Remark</p><p className="mt-1 text-sm text-white">{selected.description || selected.remark || "—"}</p></div>
            <button onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-extrabold">Close Details</button>
          </div>
        </div>
      )}
    </main>
  );
}
