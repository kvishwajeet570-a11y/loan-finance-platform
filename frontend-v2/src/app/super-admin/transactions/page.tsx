"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText, Wallet, Plus, Minus, Coins, Search, RefreshCw,
  CalendarDays, Download, Eye, ChevronLeft, ChevronRight,
  X, ArrowUpRight, ArrowDownLeft, Filter, Activity
} from "lucide-react";
import api from "@/lib/api";

type Transaction = {
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
  paymentMethod?: string;
  createdAt?: string;
  user?: { id?: string; name?: string; email?: string; phoneNo?: string };
  wallet?: { balance?: number | string };
};

const money = (v: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(v) || 0);

const num = (v: unknown) =>
  new Intl.NumberFormat("en-IN").format(Number(v) || 0);

const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s === "success" || s === "completed" || s === "approved")
    return "border-emerald-500 bg-emerald-500/15 text-emerald-300";
  if (s === "pending" || s === "processing" || s === "processed")
    return "border-cyan-500 bg-cyan-500/15 text-cyan-300";
  if (s === "failed" || s === "rejected" || s === "cancelled")
    return "border-red-500 bg-red-500/15 text-red-300";
  if (s === "refunded")
    return "border-purple-500 bg-purple-500/15 text-purple-300";
  return "border-slate-500 bg-slate-500/15 text-slate-300";
};

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("30");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const loadTransactions = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError("");

    try {
      const params: Record<string, string | number> = {
        page: targetPage,
        limit
      };

      if (search.trim()) params.search = search.trim();
      if (type) params.type = type;
      if (status) params.status = status;

      if (dateRange !== "all") {
        const start = new Date();
        start.setDate(start.getDate() - Number(dateRange));
        start.setHours(0, 0, 0, 0);

        params.startDate = start.toISOString();
        params.endDate = new Date().toISOString();
      }

      const [listResult, dashboardResult] = await Promise.all([
        api.get("/transaction", { params }),
        api.get("/transaction/dashboard")
      ]);

      const payload = listResult.data?.data;
      const rows = Array.isArray(payload?.transactions)
        ? payload.transactions
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setTransactions(rows);
      setTotal(Number(payload?.total ?? 0));
      setTotalPages(Math.max(1, Number(payload?.totalPages ?? 1)));
      setPage(Number(payload?.page ?? targetPage));

      setDashboard(dashboardResult.data?.data ?? null);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        "Transactions load nahi ho paye. API connection check karein."
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [search, type, status, dateRange]);

  useEffect(() => {
    loadTransactions(1);
  }, [loadTransactions]);

  const credits = transactions
    .filter(t => String(t.type).toUpperCase() === "CREDIT")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const debits = transactions
    .filter(t => String(t.type).toUpperCase() === "DEBIT")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const cards = [
    {
      label: "Total Transactions",
      value: num(dashboard?.totalTransactions ?? total),
      icon: Wallet,
      color: "cyan"
    },
    {
      label: "Total Credits",
      value: money(credits),
      icon: Plus,
      color: "green"
    },
    {
      label: "Total Debits",
      value: money(debits),
      icon: Minus,
      color: "red"
    },
    {
      label: "Total Transaction Amount",
      value: money(dashboard?.totalAmount),
      icon: Coins,
      color: "purple"
    }
  ];

  const colors: Record<string, string> = {
    cyan: "border-cyan-400 bg-blue-500/10 text-cyan-300",
    green: "border-emerald-400 bg-emerald-500/10 text-emerald-300",
    red: "border-rose-400 bg-rose-500/10 text-rose-300",
    purple: "border-purple-400 bg-purple-500/10 text-purple-300"
  };

  const exportCSV = () => {
    const header = [
      "Transaction ID", "User", "Type", "Category",
      "Amount", "Status", "Date"
    ];

    const rows = transactions.map(t => [
      t.transactionId || t.id || "",
      t.user?.name || "",
      t.type || "",
      t.category || "",
      t.amount || 0,
      t.status || "",
      t.createdAt || ""
    ]);

    const csv = [header, ...rows].map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AIFIN-transaction-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setType("");
    setStatus("");
    setDateRange("30");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_rgba(0,112,255,0.18),_transparent_45%),linear-gradient(135deg,#061329,#071a34_55%,#061329)] px-4 pb-8 pt-5 text-white sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">


        {/* PAGE HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-blue-500/20 text-cyan-300 shadow-[0_0_22px_rgba(0,150,255,0.2)]">
              <FileText size={34} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] sm:text-4xl">
                Transaction <span className="text-yellow-400">History</span>
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                View and manage all transactions with detailed records.
              </p>
            </div>
          </div>

          <button
            onClick={() => loadTransactions(page)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-blue-400/50 bg-[#10284a] px-5 py-3 text-sm font-bold hover:bg-blue-900 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-2xl border-2 ${colors[item.color]} bg-gradient-to-br from-[#102747] to-[#091a32] p-5 shadow-[0_0_28px_rgba(0,100,255,0.20)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(0,150,255,0.30)]`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <div className="rounded-full bg-white/10 p-3">
                    <Icon size={25} />
                  </div>
                </div>
                <p className="mt-3 break-words text-2xl font-extrabold text-white">
                  {loading ? "Loading..." : item.value}
                </p>
                <p className="mt-2 text-xs text-slate-300">
                  {item.label === "Total Credits" || item.label === "Total Debits"
                    ? "Current filtered page"
                    : "Live backend data"}
                </p>
              </div>
            );
          })}
        </section>

        {/* FILTER PANEL */}
        <section className="rounded-2xl border border-blue-400/50 bg-gradient-to-br from-[#102b4e] via-[#0b203d] to-[#08162b] p-5 shadow-[0_0_28px_rgba(0,100,255,0.18)]">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyan-300">
            <Filter size={17} /> Transaction Filters
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.1fr_auto_auto]">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                Transaction ID / Keyword
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-blue-400/40 bg-[#071a34] px-3">
                <Search size={17} className="shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && loadTransactions(1)}
                  placeholder="Search transaction..."
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Transaction Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full rounded-xl border border-blue-400/40 bg-[#071a34] px-3 py-3 text-sm text-white outline-none"
              >
                <option value="">All Types</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full rounded-xl border border-blue-400/40 bg-[#071a34] px-3 py-3 text-sm text-white outline-none"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Date Range</label>
              <div className="flex items-center gap-2 rounded-xl border border-blue-400/40 bg-[#071a34] px-3">
                <CalendarDays size={17} className="shrink-0 text-cyan-300" />
                <select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-white outline-none"
                >
                  <option value="7" className="bg-[#071a34]">Last 7 Days</option>
                  <option value="30" className="bg-[#071a34]">Last 30 Days</option>
                  <option value="90" className="bg-[#071a34]">Last 90 Days</option>
                  <option value="all" className="bg-[#071a34]">All Time</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => loadTransactions(1)}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-[0_0_18px_rgba(0,150,255,0.25)] hover:brightness-110"
            >
              <Search size={17} /> Search
            </button>

            <button
              onClick={resetFilters}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-slate-400/50 bg-[#142947] px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </section>

        {/* TRANSACTION TABLE */}
        <section className="overflow-hidden rounded-2xl border border-blue-400/50 bg-gradient-to-br from-[#102747] via-[#0b203c] to-[#07162b] shadow-[0_0_30px_rgba(0,100,255,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-300/20 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <Activity className="text-cyan-300" size={22} />
              Transaction Records
            </h2>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportCSV}
                disabled={!transactions.length}
                className="flex items-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40"
              >
                <Download size={15} /> Export CSV
              </button>
              <button
                onClick={exportCSV}
                disabled={!transactions.length}
                className="flex items-center gap-2 rounded-full border border-purple-500/70 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 disabled:opacity-40"
              >
                <Download size={15} /> Download Report
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-gradient-to-r from-[#12345b] to-[#102744] text-xs uppercase tracking-wider text-cyan-100">
                <tr>
                  {["#", "Txn ID", "User / Partner", "Type", "Amount", "Balance", "Status", "Date & Time", "Action"].map(h => (
                    <th key={h} className="px-4 py-4 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-200/15">
                {transactions.map((t, i) => {
                  const txType = String(t.type || "").toUpperCase();
                  const isCredit = txType === "CREDIT";
                  const isDebit = txType === "DEBIT";

                  return (
                    <tr
                      key={t.id || t.transactionId || i}
                      className="transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400/[0.08] hover:to-blue-500/[0.04]"
                    >
                      <td className="px-4 py-4 text-slate-300">
                        {(page - 1) * limit + i + 1}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-100">
                          {t.transactionId || t.id || "—"}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {t.referenceId || ""}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-white">
                          {t.user?.name || "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {t.user?.email || t.category || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-extrabold ${
                          isCredit
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                            : isDebit
                              ? "border-red-500 bg-red-500/15 text-red-300"
                              : "border-purple-500 bg-purple-500/15 text-purple-300"
                        }`}>
                          {t.type || "—"}
                        </span>
                      </td>

                      <td className={`whitespace-nowrap px-4 py-4 font-extrabold ${
                        isCredit ? "text-emerald-300" : isDebit ? "text-red-300" : "text-white"
                      }`}>
                        {isCredit ? "+ " : isDebit ? "- " : ""}
                        {money(t.amount)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-200">
                        {t.wallet?.balance != null ? money(t.wallet.balance) : "—"}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-extrabold ${getStatusColor(String(t.status || ""))}`}>
                          {t.status || "—"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-300">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleString("en-IN")
                          : "—"}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelected(t)}
                          title="View transaction details"
                          className="rounded-full border border-cyan-500/70 bg-cyan-500/10 p-2 text-cyan-300 transition hover:bg-cyan-500/25 hover:shadow-[0_0_14px_rgba(34,211,238,0.35)]"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!loading && transactions.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-14 text-center text-slate-400">
                      No transactions found for the selected filters.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-14 text-center text-cyan-300">
                      Loading real transactions...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-300/20 px-5 py-4">
            <p className="text-sm text-slate-300">
              Showing {total === 0 ? 0 : (page - 1) * limit + 1}
              {" "}to{" "}
              {Math.min(page * limit, total)}
              {" "}of{" "}
              <strong className="text-white">{num(total)}</strong>
              {" "}transactions
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => loadTransactions(page - 1)}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold text-slate-200 hover:bg-blue-800 disabled:opacity-30"
              >
                <ChevronLeft size={15} /> Previous
              </button>

              <span className="rounded-lg border border-cyan-400 bg-blue-600 px-4 py-2 text-sm font-extrabold">
                {page}
              </span>

              <span className="px-1 text-xs text-slate-400">
                of {totalPages}
              </span>

              <button
                onClick={() => loadTransactions(page + 1)}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1 rounded-lg border border-blue-400/30 bg-[#10294a] px-3 py-2 text-xs font-bold text-slate-200 hover:bg-blue-800 disabled:opacity-30"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* TRANSACTION DETAIL MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-cyan-300/60 bg-gradient-to-br from-[#102b4e] to-[#07162b] p-6 shadow-[0_0_45px_rgba(0,150,255,0.3)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Transaction Details
                </p>
                <h3 className="mt-1 text-lg font-extrabold">
                  {selected.transactionId || selected.id || "Transaction"}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["User", selected.user?.name || "—"],
                ["Type", selected.type || "—"],
                ["Amount", money(selected.amount)],
                ["Status", selected.status || "—"],
                ["Category", selected.category || "—"],
                ["Payment Method", selected.paymentMethod || "—"],
                ["Fee", money(selected.fee)],
                ["Wallet Balance", selected.wallet?.balance != null ? money(selected.wallet.balance) : "—"],
                ["Reference ID", selected.referenceId || "—"],
                ["Date", selected.createdAt ? new Date(selected.createdAt).toLocaleString("en-IN") : "—"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-blue-300/15 bg-[#102743] p-3">
                  <p className="text-[11px] text-slate-400">{label}</p>
                  <p className="mt-1 break-words text-sm font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-blue-300/15 bg-[#102743] p-3">
              <p className="text-[11px] text-slate-400">Description / Remark</p>
              <p className="mt-1 text-sm text-white">
                {selected.description || selected.remark || "—"}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-extrabold text-white hover:brightness-110"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
