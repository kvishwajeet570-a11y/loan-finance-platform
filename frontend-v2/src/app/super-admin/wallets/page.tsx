"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet, Users, Plus, Minus, RefreshCw, CalendarDays, Activity,
  ArrowDownLeft, ArrowUpRight, Coins, Download, SlidersHorizontal,
  Clock, ArrowRight, CreditCard, CircleDollarSign
} from "lucide-react";
import api from "@/lib/api";

type Tx = {
  id?: string;
  transactionId?: string;
  amount?: number | string;
  type?: string;
  status?: string;
  category?: string;
  remark?: string;
  description?: string;
  createdAt?: string;
  user?: { name?: string };
  wallet?: { balance?: number | string };
};

const amount = (v: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  }).format(Number(v) || 0);

const rupees = (v: number) =>
  "₹ " + new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(v);

// Repairs common UTF-8 text that was incorrectly decoded before reaching the UI.
function displayText(value: unknown, fallback = "—"): string {
  if (value == null || value === "") return fallback;
  return String(value)
    .replace(/â€™/g, "’")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€¦/g, "…")
    .replace(/â‚¹/g, "₹")
    .replace(/Â·/g, "·")
    .replace(/Â /g, " ");
}

function getRows(data: any): Tx[] {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.transactions)) return data.transactions;
  return [];
}

export default function WalletOverviewPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("all");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        api.get("/wallet/analytics"),
        api.get("/wallet/dashboard"),
        api.get("/wallet/live")
      ]);

      if (results[0].status === "fulfilled") {
        setAnalytics(results[0].value.data?.data ?? null);
      } else {
        throw results[0].reason;
      }

      if (results[1].status === "fulfilled") {
        setDashboard(results[1].value.data?.data ?? results[1].value.data ?? null);
      }

      if (results[2].status === "fulfilled") {
        setTransactions(getRows(results[2].value.data));
      } else {
        setTransactions([]);
      }
    } catch (e: any) {
      setError(displayText(e?.response?.data?.message, "Wallet API se data load nahi hua."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    if (period === "all") return transactions;
    const days = Number(period);
    const cutoff = Date.now() - days * 86400000;
    return transactions.filter(t =>
      t.createdAt && new Date(t.createdAt).getTime() >= cutoff
    );
  }, [transactions, period]);

  const sum = (type: string) => filtered
    .filter(t => String(t.type).toUpperCase() === type)
    .reduce((n, t) => n + Number(t.amount || 0), 0);

  const credits = sum("CREDIT");
  const debits = sum("DEBIT");
  const totalBalance = Number(analytics?._sum?.balance ?? dashboard?.totalBalance ?? 0);
  const walletCount = Number(
    analytics?._count?._all ?? analytics?._count ??
    dashboard?.totalWallets ?? 0
  );
  const activeWallets = Number(
    dashboard?.activeWallets ?? dashboard?.data?.activeWallets ?? 0
  );


  const chartDays = useMemo(() => {
    const dates: Date[] = [];

    if (period === "all") {
      const unique = Array.from(new Set(
        filtered
          .filter(t => t.createdAt)
          .map(t => new Date(t.createdAt as string).toDateString())
      ));
      unique.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      unique.forEach(value => dates.push(new Date(value)));
    } else {
      const days = Number(period);
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        dates.push(d);
      }
    }

    return dates.map(d => {
      const key = d.toDateString();
      const dayRows = filtered.filter(t =>
        t.createdAt && new Date(t.createdAt).toDateString() === key
      );
      return {
        label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        credit: dayRows.filter(t => String(t.type).toUpperCase() === "CREDIT")
          .reduce((n, t) => n + Number(t.amount || 0), 0),
        debit: dayRows.filter(t => String(t.type).toUpperCase() === "DEBIT")
          .reduce((n, t) => n + Number(t.amount || 0), 0)
      };
    });
  }, [filtered, period]);

  const maxBar = Math.max(1, ...chartDays.flatMap(d => [d.credit, d.debit]));
  const totalFlow = credits + debits;
  const creditPct = totalFlow ? credits / totalFlow * 100 : 0;
  const debitPct = totalFlow ? debits / totalFlow * 100 : 0;

  const downloadReport = () => {
    const header = ["Transaction ID", "User", "Type", "Amount", "Status", "Date"];
    const rows = filtered.map(t => [
      displayText(t.transactionId || t.id, ""),
      displayText(t.user?.name, ""),
      displayText(t.type, ""),
      t.amount || 0,
      displayText(t.status, ""),
      t.createdAt || ""
    ]);
    const csv = [header, ...rows].map(r =>
      r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallet-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { title: "Total Wallet Balance", value: amount(totalBalance), icon: Wallet, color: "cyan" },
    { title: "Total Credits", value: amount(credits), icon: Plus, color: "green" },
    { title: "Total Debits", value: amount(debits), icon: Minus, color: "red" },
    { title: "Total Wallets", value: walletCount.toLocaleString("en-IN"), icon: Users, color: "purple" }
  ];

  const colorMap: Record<string, string> = {
    cyan: "border-cyan-400 bg-blue-500/10 text-cyan-300",
    green: "border-emerald-400 bg-emerald-500/10 text-emerald-300",
    red: "border-rose-400 bg-rose-500/10 text-rose-300",
    purple: "border-purple-400 bg-purple-500/10 text-purple-300"
  };

  return (
    <main className="min-h-screen bg-[#061329] px-4 pb-7 pt-4 text-white sm:px-5 sm:pt-4 lg:px-7 lg:pt-4">
      <div className="relative mb-4 h-[130px] w-full overflow-hidden rounded-xl border border-cyan-400/50 shadow-[0_0_28px_rgba(0,150,255,0.25)]">
        <img
          src="/images/super-admin/wallet-overview-banner.jpg"
          alt="Wallet Management"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#00112c]/40" />

        <div className="absolute inset-0 flex items-center justify-center px-3">
          <div className="w-full max-w-lg rounded-xl border border-cyan-300/50 bg-[#03152e]/85 px-4 py-3 text-center shadow-[0_0_24px_rgba(34,211,238,0.30)] backdrop-blur-sm">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-300">
              AIFIN · DIGITAL FINANCE
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
              Smart Wallet <span className="text-cyan-300">Management</span>
            </h2>
            <p className="mt-1 text-xs font-semibold text-white sm:text-sm">
              Secure Wallet · Real-time Control
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-blue-500/20 text-cyan-300">
              <Wallet size={34} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Wallet <span className="text-yellow-400">Overview</span>
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Real-time wallet balance, transactions, and payout insights.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-blue-400/40 bg-[#0c2344] px-3 py-3">
              <CalendarDays size={17} className="text-cyan-300" />
              <select
                value={period}
                onChange={e => setPeriod(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white outline-none"
              >
                <option value="7" className="bg-[#0c2344]">Last 7 Days</option>
                <option value="30" className="bg-[#0c2344]">Last 30 Days</option>
                <option value="all" className="bg-[#0c2344]">Loaded Records</option>
              </select>
            </div>
            <button onClick={loadData} disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-blue-400/50 bg-[#10284a] px-5 py-3 text-sm font-semibold hover:bg-blue-900 disabled:opacity-50">
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title}
                className={`rounded-2xl border-2 ${colorMap[item.color]} p-5 shadow-[0_0_26px_rgba(0,120,255,0.20)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(0,150,255,0.28)]`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <div className="rounded-full bg-white/10 p-3"><Icon size={25} /></div>
                </div>
                <p className="mt-3 break-words text-2xl font-extrabold text-white">
                  {loading ? "Loading..." : item.value}
                </p>
                <p className="mt-2 text-xs text-slate-300">
                  {item.title === "Total Credits" || item.title === "Total Debits"
                    ? `Based on ${filtered.length} loaded transactions`
                    : "Live backend data"}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.55fr_1fr_0.95fr]">
          <div className="rounded-2xl border border-blue-400/50 bg-gradient-to-br from-[#0b2445] to-[#07182f] p-5 shadow-[0_0_24px_rgba(0,100,255,0.12)]">
            <h2 className="mb-4 text-base font-extrabold text-white">Wallet Transaction Trend</h2>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-emerald-400" />Credit (In)</span>
                <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-red-400" />Debit (Out)</span>
              </div>
            </div>
            <div className="flex h-[210px] gap-2">
              <div className="flex flex-col justify-between pb-5 text-[10px] text-slate-400">
                <span>{rupees(maxBar)}</span><span>{rupees(maxBar * .75)}</span>
                <span>{rupees(maxBar * .5)}</span><span>{rupees(maxBar * .25)}</span><span>₹0</span>
              </div>
              <div className="relative flex min-w-0 flex-1 items-end justify-around border-b border-l border-blue-300/20 pb-0">
                {totalFlow === 0 && <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b2445]/70 text-sm font-semibold text-slate-300">No CREDIT / DEBIT transactions in selected period</div>}<div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-5">
                  {[0,1,2,3].map(n => <div key={n} className="border-t border-blue-200/10" />)}
                </div>
                {chartDays.filter((_, i) => chartDays.length <= 10 || i % 3 === 0 || i === chartDays.length - 1).map((d, i) => (
                  <div key={d.label} className="relative z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                    <div className="flex h-[165px] items-end gap-[3px]">
                      <div title={`Credit ${amount(d.credit)}`}
                        className="w-3 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-300 sm:w-5"
                        style={{ height: `${Math.max(d.credit ? 3 : 0, d.credit / maxBar * 100)}%` }} />
                      <div title={`Debit ${amount(d.debit)}`}
                        className="w-3 rounded-t-sm bg-gradient-to-t from-red-600 to-red-300 sm:w-5"
                        style={{ height: `${Math.max(d.debit ? 3 : 0, d.debit / maxBar * 100)}%` }} />
                    </div>
                    <span className="mt-2 whitespace-nowrap text-[9px] text-slate-300">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-[10px] text-slate-500">Daily totals from the loaded wallet transaction records.</p>
          </div>

          <div className="rounded-2xl border border-blue-400/50 bg-gradient-to-br from-[#0b2445] to-[#07182f] p-5 shadow-[0_0_24px_rgba(0,100,255,0.12)]">
            <h2 className="mb-4 text-base font-extrabold text-white">Transaction Distribution</h2>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <div className="relative h-40 w-40 shrink-0 rounded-full"
                style={{ background: totalFlow > 0 ? `conic-gradient(#16d99a 0% ${creditPct}%, #fb626b ${creditPct}% 100%)` : "#26364d" }}>
                <div className="absolute inset-[17px] flex flex-col items-center justify-center rounded-full bg-[#0b1e39]">
                  <span className="text-xl font-extrabold">{amount(totalFlow)}</span>
                  <span className="text-xs text-slate-300">Loaded Total</span>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="flex items-center gap-2 font-semibold"><i className="h-3 w-3 rounded-sm bg-emerald-400" />Wallet Credit</p>
                  <p className="ml-5 mt-1 text-slate-300">{creditPct.toFixed(1)}%</p>
                  <p className="ml-5 text-xs text-slate-400">{amount(credits)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-semibold"><i className="h-3 w-3 rounded-sm bg-red-400" />Wallet Debit</p>
                  <p className="ml-5 mt-1 text-slate-300">{debitPct.toFixed(1)}%</p>
                  <p className="ml-5 text-xs text-slate-400">{amount(debits)}</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-slate-500">Distribution of loaded CREDIT and DEBIT records.</p>
          </div>

          <div className="rounded-2xl border border-blue-400/50 bg-gradient-to-br from-[#0b2445] to-[#07182f] p-5 shadow-[0_0_24px_rgba(0,100,255,0.12)]">
            <h2 className="mb-4 text-base font-extrabold text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <a href="/super-admin/wallet-adjustments"
                className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-2xl border border-yellow-500/80 bg-gradient-to-br from-yellow-500/15 to-amber-950/30 p-3 text-center text-sm font-extrabold text-yellow-100 shadow-[0_0_14px_rgba(234,179,8,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:bg-yellow-500/20 hover:shadow-[0_0_28px_rgba(234,179,8,0.35)]">
                <Coins size={34} className="text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] transition-transform group-hover:scale-110" />
                <span>Adjust Wallet</span>
              </a>

              <a href="/super-admin/transactions"
                className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/80 bg-gradient-to-br from-emerald-500/15 to-emerald-950/30 p-3 text-center text-sm font-extrabold text-emerald-100 shadow-[0_0_14px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]">
                <ArrowUpRight size={36} className="text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.9)] transition-transform group-hover:scale-110" />
                <span>Payout Request</span>
              </a>

              <a href="/super-admin/wallet-adjustments"
                className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-2xl border border-blue-500/80 bg-gradient-to-br from-blue-500/15 to-blue-950/30 p-3 text-center text-sm font-extrabold text-blue-100 shadow-[0_0_14px_rgba(59,130,246,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-500/20 hover:shadow-[0_0_28px_rgba(59,130,246,0.35)]">
                <Plus size={38} className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] transition-transform group-hover:scale-110" />
                <span>Add Money</span>
              </a>

              <button onClick={downloadReport}
                className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-2xl border border-purple-500/80 bg-gradient-to-br from-purple-500/15 to-purple-950/30 p-3 text-center text-sm font-extrabold text-purple-100 shadow-[0_0_14px_rgba(168,85,247,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:bg-purple-500/20 hover:shadow-[0_0_28px_rgba(168,85,247,0.35)]">
                <Download size={34} className="text-purple-300 drop-shadow-[0_0_10px_rgba(192,132,252,0.9)] transition-transform group-hover:scale-110" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-blue-400/50 bg-gradient-to-br from-[#0b2445] to-[#07182f] shadow-[0_0_24px_rgba(0,100,255,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-300/20 px-5 py-4">
            <h2 className="text-base font-extrabold text-white">Recent Wallet Transactions</h2>
            <a href="/super-admin/transactions" className="flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-white">
              View All Transactions <ArrowRight size={16} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[#10294a] text-xs text-slate-200">
                <tr>
                  {["Txn ID", "User / Partner", "Type", "Amount", "Balance", "Status", "Date & Time"].map(h =>
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200/15">
                {transactions.slice(0, 10).map((t, i) => {
                  const credit = String(t.type).toUpperCase() === "CREDIT";
                  return (
                    <tr key={t.id || t.transactionId || i} className="hover:bg-blue-400/5">
                      <td className="px-4 py-3 font-semibold text-slate-200">{displayText(t.transactionId || t.id)}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{displayText(t.user?.name)}</div>
                        <div className="text-xs text-slate-400">{displayText(t.category || t.description || t.remark)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-4 py-1 font-semibold ${credit ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : "border-red-500 bg-red-500/15 text-red-300"}`}>
                          {displayText(t.type)}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-bold ${credit ? "text-emerald-300" : "text-red-300"}`}>
                        {credit ? "+" : "-"} {amount(t.amount)}
                      </td>
                      <td className="px-4 py-3 font-semibold">{t.wallet?.balance != null ? amount(t.wallet.balance) : "—"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-1 text-xs font-bold text-emerald-300">
                          {displayText(t.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                        {t.createdAt ? new Date(t.createdAt).toLocaleString("en-IN") : "—"}
                      </td>
                    </tr>
                  );
                })}
                {!loading && transactions.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">No wallet transactions found.</td></tr>
                )}
                {loading && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Loading real transactions...</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 border-t border-blue-300/20 px-5 py-3 text-xs text-slate-400">
            <Clock size={14} /> Showing latest wallet records returned by backend.
          </div>
        </section>
      </div>
    </main>
  );
}






