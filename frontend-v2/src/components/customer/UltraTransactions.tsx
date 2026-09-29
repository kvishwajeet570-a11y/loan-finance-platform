"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Mode = "ALL" | "CREDIT" | "DEBIT";

type Transaction = {
  id?: string;
  transactionId?: string;
  type?: string;
  category?: string;
  amount?: number | string;
  balanceAfter?: number | string;
  description?: string;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  reference?: string;
  remark?: string;
};

type Props = {
  mode?: Mode;
  title?: string;
  subtitle?: string;
};

const creditTypes = [
  "CREDIT",
  "CR",
  "DEPOSIT",
  "REFUND",
  "CASHBACK",
  "REWARD",
];

const debitTypes = [
  "DEBIT",
  "DR",
  "WITHDRAW",
  "RECHARGE",
  "PAYMENT",
];

function money(value: number | string | undefined) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function shortMoney(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function getType(tx: Transaction) {
  return String(tx.type || "").toUpperCase();
}

function isCredit(tx: Transaction) {
  return creditTypes.includes(getType(tx));
}

function isDebit(tx: Transaction) {
  return debitTypes.includes(getType(tx));
}

function getStatus(status?: string) {
  const s = String(status || "SUCCESS").toUpperCase();

  if (s === "SUCCESS" || s === "COMPLETED") {
    return {
      label: "Success",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    };
  }

  if (s === "PENDING" || s === "PROCESSING") {
    return {
      label: "Pending",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock3,
    };
  }

  if (s === "FAILED" || s === "CANCELLED") {
    return {
      label: "Failed",
      cls: "bg-red-50 text-red-700 border-red-200",
      icon: X,
    };
  }

  if (s === "REFUNDED") {
    return {
      label: "Refunded",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      icon: RefreshCw,
    };
  }

  return {
    label: s,
    cls: "bg-slate-50 text-slate-700 border-slate-200",
    icon: Activity,
  };
}

function formatDate(date?: string) {
  if (!date) return "—";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dateOnly(date?: string) {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  return d.toISOString().slice(0, 10);
}

export default function UltraTransactions({
  mode = "ALL",
  title,
  subtitle,
}: Props) {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");

  const [selected, setSelected] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("loan_finance_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setLoading(true);

      const walletResponse = await api.get("/wallet/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const walletData =
        walletResponse?.data?.data ||
        walletResponse?.data?.wallet ||
        walletResponse?.data;

      setWallet(walletData || null);

      const walletId = walletData?.id;

      if (!walletId) {
        setTransactions([]);
        return;
      }

      const txResponse = await api.get(
        `/wallet/${walletId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const raw =
        txResponse?.data?.data ||
        txResponse?.data?.transactions ||
        txResponse?.data?.data?.transactions ||
        [];

      setTransactions(Array.isArray(raw) ? raw : []);
    } catch (error: any) {
      console.error("Transactions load error:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        router.replace("/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (mode === "CREDIT") {
      list = list.filter(isCredit);
    }

    if (mode === "DEBIT") {
      list = list.filter(isDebit);
    }

    if (statusFilter !== "ALL") {
      list = list.filter(
        (tx) =>
          String(tx.status || "SUCCESS").toUpperCase() ===
          statusFilter
      );
    }

    if (dateFilter !== "ALL") {
      const now = new Date();
      let cutoff = new Date(now);

      if (dateFilter === "7D") {
        cutoff.setDate(now.getDate() - 7);
      }

      if (dateFilter === "30D") {
        cutoff.setDate(now.getDate() - 30);
      }

      if (dateFilter === "90D") {
        cutoff.setDate(now.getDate() - 90);
      }

      list = list.filter((tx) => {
        if (!tx.createdAt) return false;

        const d = new Date(tx.createdAt);
        return d >= cutoff;
      });
    }

    if (fromDate) {
      list = list.filter((tx) => dateOnly(tx.createdAt) >= fromDate);
    }

    if (toDate) {
      list = list.filter((tx) => dateOnly(tx.createdAt) <= toDate);
    }

    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((tx) => {
        const haystack = [
          tx.transactionId,
          tx.id,
          tx.description,
          tx.category,
          tx.paymentMethod,
          tx.status,
          tx.reference,
          tx.remark,
          tx.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
    }

    list.sort((a, b) => {
      const aa = new Date(a.createdAt || 0).getTime();
      const bb = new Date(b.createdAt || 0).getTime();

      return sortOrder === "DESC" ? bb - aa : aa - bb;
    });

    return list;
  }, [
    transactions,
    mode,
    statusFilter,
    dateFilter,
    search,
    sortOrder,
    fromDate,
    toDate,
  ]);

  const stats = useMemo(() => {
    const all = transactions;

    const credits = all
      .filter(isCredit)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const debits = all
      .filter(isDebit)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const success = all.filter((tx) => {
      const s = String(tx.status || "SUCCESS").toUpperCase();
      return s === "SUCCESS" || s === "COMPLETED";
    }).length;

    const successRate =
      all.length > 0
        ? Math.round((success / all.length) * 100)
        : 0;

    return {
      total: all.length,
      credits,
      debits,
      successRate,
    };
  }, [transactions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const exportCSV = () => {
    if (!filtered.length) return;

    const header = [
      "Transaction ID",
      "Date",
      "Type",
      "Category",
      "Amount",
      "Status",
      "Payment Method",
      "Description",
    ];

    const rows = filtered.map((tx) => [
      tx.transactionId || tx.id || "",
      formatDate(tx.createdAt),
      tx.type || "",
      tx.category || "",
      Number(tx.amount || 0),
      tx.status || "SUCCESS",
      tx.paymentMethod || "",
      tx.description || "",
    ]);

    const csv = [
      header,
      ...rows,
    ]
      .map((row) =>
        row
          .map((cell) =>
            `"${String(cell).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `transactions-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const pageTitle =
    title ||
    (mode === "CREDIT"
      ? "Credit Transactions"
      : mode === "DEBIT"
      ? "Debit Transactions"
      : "All Transactions");

  const pageSubtitle =
    subtitle ||
    (mode === "CREDIT"
      ? "Track every amount added to your wallet."
      : mode === "DEBIT"
      ? "Track every payment and amount deducted from your wallet."
      : "Track your complete wallet activity in one place.");

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-slate-900">
      <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-[#eaf4ff] via-white to-[#eef1ff] p-6 shadow-[0_15px_45px_rgba(37,99,235,0.08)] sm:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                <Activity size={14} />
                WALLET ACTIVITY CENTER
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#102a56] sm:text-4xl lg:text-5xl">
                {pageTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {pageSubtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#165dff] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-[#0f4fe0] disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>

                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* WALLET CARD */}
            <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-gradient-to-br from-[#172b68] via-[#1749a9] to-[#245dff] p-6 text-white shadow-[0_20px_45px_rgba(23,73,169,0.28)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-cyan-300/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-100">
                    Available Wallet Balance
                  </span>
                  <div className="rounded-xl bg-white/10 p-2">
                    <Wallet size={20} />
                  </div>
                </div>

                <div className="mt-5 text-3xl font-black sm:text-4xl">
                  {money(wallet?.balance)}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                    <p className="text-[11px] text-blue-100">
                      Cashback
                    </p>
                    <p className="mt-1 font-bold">
                      {money(wallet?.cashback)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                    <p className="text-[11px] text-blue-100">
                      Rewards
                    </p>
                    <p className="mt-1 font-bold">
                      {money(wallet?.rewardBalance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <FileText size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400">
                RECORDS
              </span>
            </div>

            <p className="mt-5 text-2xl font-black text-[#102a56]">
              {stats.total}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total Transactions
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <ArrowDownLeft size={20} />
              </div>
              <TrendingUp
                size={18}
                className="text-emerald-500"
              />
            </div>

            <p className="mt-5 text-2xl font-black text-emerald-700">
              {shortMoney(stats.credits)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total Credit
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                <ArrowUpRight size={20} />
              </div>
              <TrendingDown
                size={18}
                className="text-red-500"
              />
            </div>

            <p className="mt-5 text-2xl font-black text-red-700">
              {shortMoney(stats.debits)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total Debit
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <ShieldCheck size={20} />
              </div>
              <Zap size={18} className="text-indigo-500" />
            </div>

            <p className="mt-5 text-2xl font-black text-indigo-700">
              {stats.successRate}%
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Success Rate
            </p>
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transaction, category, payment method..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-400"
              >
                <option value="ALL">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-400"
              >
                <option value="ALL">All Time</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="90D">Last 90 Days</option>
              </select>

              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${
                  showFilters
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <Filter size={16} />
                More
              </button>

              <button
                onClick={() =>
                  setSortOrder((v) =>
                    v === "DESC" ? "ASC" : "DESC"
                  )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"
              >
                {sortOrder === "DESC" ? "Newest" : "Oldest"}
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500">
                  From Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500">
                  To Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setDateFilter("ALL");
                  setSortOrder("DESC");
                  setFromDate("");
                  setToDate("");
                }}
                className="mt-auto h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Reset Filters
              </button>

              <div className="flex items-end">
                <div className="flex w-full items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700">
                  <Zap size={15} />
                  Smart filtering enabled
                </div>
              </div>
            </div>
          )}
        </section>

        {/* TRANSACTION LIST */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-[#102a56]">
                Transaction History
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filtered.length} of {transactions.length} transactions
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
              {mode === "ALL"
                ? "All Activity"
                : mode === "CREDIT"
                ? "Credit Only"
                : "Debit Only"}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-slate-100" />
                    <div className="flex-1">
                      <div className="h-4 w-48 rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
                    </div>
                    <div className="h-5 w-24 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#102a56]">
                No transactions found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are no transactions matching your current filters.
                Try changing the search or filter options.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((tx, index) => {
                const credit = isCredit(tx);
                const status = getStatus(tx.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={tx.id || tx.transactionId || index}
                    className="group px-4 py-4 transition hover:bg-[#f8fbff] sm:px-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          credit
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {credit ? (
                          <ArrowDownLeft size={22} />
                        ) : (
                          <ArrowUpRight size={22} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-black text-[#102a56] sm:text-base">
                            {tx.description ||
                              tx.category ||
                              (credit ? "Wallet Credit" : "Wallet Debit")}
                          </h3>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${
                              credit
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            {credit ? "CREDIT" : "DEBIT"}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>
                            {formatDate(tx.createdAt)}
                          </span>

                          <span>
                            {tx.category || "Wallet"}
                          </span>

                          {tx.paymentMethod && (
                            <span>
                              {tx.paymentMethod}
                            </span>
                          )}
                        </div>

                        {(tx.transactionId || tx.id) && (
                          <p className="mt-1.5 truncate text-[11px] font-medium text-slate-400">
                            ID: {tx.transactionId || tx.id}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-5 lg:justify-end">
                        <div className="text-left lg:text-right">
                          <p
                            className={`text-lg font-black ${
                              credit
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {credit ? "+" : "-"}
                            {money(tx.amount)}
                          </p>

                          {tx.balanceAfter !== undefined && (
                            <p className="mt-1 text-[11px] text-slate-400">
                              Balance: {money(tx.balanceAfter)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`hidden items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:inline-flex ${status.cls}`}
                          >
                            <StatusIcon size={12} />
                            {status.label}
                          </span>

                          <button
                            onClick={() => setSelected(tx)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            Your wallet transaction history is securely managed.
          </div>

          <div className="text-xs font-bold text-slate-400">
            Powered by Loan Finance
          </div>
        </div>
      </main>

      {/* DETAIL MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Transaction Details
                </p>

                <h3 className="mt-1 text-xl font-black text-[#102a56]">
                  {selected.description ||
                    selected.category ||
                    "Wallet Transaction"}
                </h3>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div
                className={`rounded-2xl p-5 ${
                  isCredit(selected)
                    ? "bg-emerald-50"
                    : "bg-red-50"
                }`}
              >
                <p className="text-xs font-bold text-slate-500">
                  Transaction Amount
                </p>

                <p
                  className={`mt-2 text-3xl font-black ${
                    isCredit(selected)
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {isCredit(selected) ? "+" : "-"}
                  {money(selected.amount)}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Transaction ID
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-slate-700">
                    {selected.transactionId ||
                      selected.id ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {getStatus(selected.status).label}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Category
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {selected.category || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Payment Method
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {selected.paymentMethod || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Date & Time
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Balance After
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {selected.balanceAfter !== undefined
                      ? money(selected.balanceAfter)
                      : "—"}
                  </p>
                </div>
              </div>

              {selected.remark && (
                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-[11px] font-bold uppercase text-blue-500">
                    Remark
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blue-900">
                    {selected.remark}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-5 w-full rounded-xl bg-[#165dff] py-3 text-sm font-black text-white transition hover:bg-[#0f4fe0]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
