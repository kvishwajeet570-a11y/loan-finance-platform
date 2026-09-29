"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  FileText,
  Filter,
  Search,
  CalendarDays,
  Download,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
  BarChart3,
  Sparkles,
  Gift,
  ShieldCheck,
  LockKeyhole,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";

type Transaction = {
  id: string;
  transactionId?: string;
  referenceId?: string;
  type?: string;
  category?: string;
  amount?: number;
  fee?: number;
  status?: string;
  description?: string;
  remark?: string;
  paymentMethod?: string;
  createdAt?: string;
};

type WalletData = {
  id?: string;
  balance?: number;
  cashback?: number;
  rewardBalance?: number;
  totalEarnings?: number;
  transactions?: Transaction[];
};

function unwrap(payload: any): any {
  if (!payload) return null;
  return payload.data !== undefined ? payload.data : payload;
}

function money(value?: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function isCredit(type?: string) {
  const v = String(type || "").toUpperCase();

  return (
    v.includes("CREDIT") ||
    v.includes("ADD") ||
    v.includes("REWARD") ||
    v.includes("CASHBACK") ||
    v.includes("REFUND")
  );
}

function formatDate(value?: string) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return "";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusInfo(status?: string) {
  const v = String(status || "PENDING").toUpperCase();

  if (
    v === "SUCCESS" ||
    v === "COMPLETED" ||
    v === "APPROVED"
  ) {
    return {
      label: "Completed",
      icon: CheckCircle2,
      cls: "bg-emerald-50 text-emerald-700",
    };
  }

  if (
    v === "FAILED" ||
    v === "REJECTED" ||
    v === "CANCELLED"
  ) {
    return {
      label: "Failed",
      icon: XCircle,
      cls: "bg-red-50 text-red-700",
    };
  }

  return {
    label: "Pending",
    icon: Clock3,
    cls: "bg-amber-50 text-amber-700",
  };
}

export default function WalletStatementPage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [range, setRange] = useState("Last 30 Days");

  const loadStatement = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("loan_finance_token");
      const storedUser = localStorage.getItem("loan_finance_user");

      if (!token || !storedUser) {
        router.replace("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const walletResponse = await api.get(
        "/wallet/me",
        config
      );

      const walletData = unwrap(walletResponse.data);

      setWallet(walletData || null);

      if (!walletData?.id) {
        setTransactions(
          Array.isArray(walletData?.transactions)
            ? walletData.transactions
            : []
        );
        return;
      }

      try {
        const response = await api.get(
          `/wallet/${walletData.id}/statement`,
          config
        );

        const data = unwrap(response.data);

        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.transactions)
              ? data.transactions
              : Array.isArray(data?.data)
                ? data.data
                : [];

        setTransactions(list);
      } catch {
        const response = await api.get(
          `/wallet/${walletData.id}/transactions`,
          config
        );

        const data = unwrap(response.data);

        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.transactions)
              ? data.transactions
              : Array.isArray(data?.data)
                ? data.data
                : [];

        setTransactions(list);
      }
    } catch (err: any) {
      console.error("Statement Error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load wallet statement."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadStatement();
  }, [loadStatement]);

  const refreshStatement = async () => {
    setRefreshing(true);
    await loadStatement();
  };

  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return transactions.filter((tx) => {
      const credit = isCredit(tx.type);

      if (
        typeFilter === "CREDIT" &&
        !credit
      ) {
        return false;
      }

      if (
        typeFilter === "DEBIT" &&
        credit
      ) {
        return false;
      }

      if (
        statusFilter !== "ALL" &&
        String(tx.status || "")
          .toUpperCase() !== statusFilter
      ) {
        return false;
      }

      if (!q) return true;

      return [
        tx.transactionId,
        tx.referenceId,
        tx.type,
        tx.category,
        tx.description,
        tx.remark,
        tx.paymentMethod,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(q)
        );
    });
  }, [
    transactions,
    search,
    typeFilter,
    statusFilter,
  ]);

  const totalCredit = transactions
    .filter((tx) => isCredit(tx.type))
    .reduce(
      (sum, tx) =>
        sum + Number(tx.amount || 0),
      0
    );

  const totalDebit = transactions
    .filter((tx) => !isCredit(tx.type))
    .reduce(
      (sum, tx) =>
        sum + Number(tx.amount || 0),
      0
    );

  const netBalance =
    Number(wallet?.balance || 0);

  const maxAmount = Math.max(
    totalCredit,
    totalDebit,
    netBalance,
    1
  );

  return (
    <div className="min-h-screen bg-[#f5f8fd] px-4 py-5 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1280px]">

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative mb-5 min-h-[175px] overflow-hidden rounded-[25px] bg-gradient-to-r from-[#3159f5] via-[#5148ee] to-[#9b42ed] px-7 py-7 text-white shadow-xl shadow-indigo-100">

          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute right-[30%] -bottom-28 h-64 w-64 rounded-full bg-cyan-300/10" />

          <div className="absolute left-[45%] top-[-100px] h-52 w-52 rounded-full bg-white/10" />

          {/* decorative coins */}
          <div className="absolute right-[31%] top-12 hidden lg:block">

            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-lg font-black text-yellow-900 shadow-xl">
              ₹
            </div>

            <div className="absolute -left-9 top-12 flex h-10 w-10 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-sm font-black text-yellow-900 shadow-lg">
              ₹
            </div>

            <div className="absolute left-12 top-16 flex h-9 w-9 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-sm font-black text-yellow-900 shadow-lg">
              ₹
            </div>

          </div>

          {/* statement document */}
          <div className="absolute right-24 top-5 hidden h-[145px] w-[210px] rotate-[-5deg] rounded-xl bg-white/90 p-4 shadow-2xl lg:block">

            <div className="flex items-center gap-2">

              <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                <FileText size={19} />
              </div>

              <div>
                <div className="h-2 w-20 rounded bg-indigo-200" />
                <div className="mt-2 h-1.5 w-14 rounded bg-slate-200" />
              </div>

            </div>

            <div className="mt-5 space-y-2">

              <div className="h-2 w-full rounded bg-slate-100" />
              <div className="h-2 w-[85%] rounded bg-slate-100" />
              <div className="h-2 w-[65%] rounded bg-slate-100" />

            </div>

            <div className="absolute bottom-3 right-3 rounded-lg bg-indigo-600 px-2 py-1 text-[7px] font-black text-white">
              STATEMENT
            </div>

          </div>

          <div className="relative z-10 max-w-[650px]">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur">
                <ReceiptText size={25} />
              </div>

              <div>

                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-100">
                  Wallet Statement
                </p>

                <p className="text-xs text-white/75">
                  Financial activity overview
                </p>

              </div>

            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Your Account Statement
            </h1>

            <p className="mt-1 max-w-lg text-sm text-white/75">
              Get a detailed view of your wallet activity and financial journey.
            </p>

          </div>

          <button
            onClick={refreshStatement}
            disabled={refreshing}
            className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-indigo-700 shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

        </section>

        {/* =====================================================
            FILTER STATEMENT
        ===================================================== */}
        <section className="mb-5 overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Filter size={18} />
              </div>

              <div>

                <h2 className="text-sm font-black text-[#071b45]">
                  Filter Statement
                </h2>

                <p className="text-[9px] text-slate-400">
                  Select date range and filter options
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              {[
                "Last 7 Days",
                "Last 30 Days",
                "Last 3 Months",
                "This Year",
              ].map((item) => (

                <button
                  key={item}
                  onClick={() =>
                    setRange(item)
                  }
                  className={`rounded-lg border px-3 py-2 text-[9px] font-black transition ${
                    range === item
                      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">

            <FilterBox
              label="From Date"
              icon={<CalendarDays size={14} />}
              text="01 Aug 2026"
            />

            <FilterBox
              label="To Date"
              icon={<CalendarDays size={14} />}
              text="12 Sep 2026"
            />

            <SelectBox
              label="Transaction Type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                ["ALL", "All Transactions"],
                ["CREDIT", "Credit"],
                ["DEBIT", "Debit"],
              ]}
            />

            <SelectBox
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                ["ALL", "All Status"],
                ["SUCCESS", "Completed"],
                ["PENDING", "Pending"],
                ["FAILED", "Failed"],
              ]}
            />

            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setStatusFilter("ALL");
                setRange("Last 30 Days");
              }}
              className="mt-auto h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-[10px] font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center gap-2">
                <Filter size={14} />
                Apply Filter
              </span>
            </button>

          </div>

        </section>

        {/* =====================================================
            KPI CARDS
        ===================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <KpiCard
            title="Total Credits"
            value={money(totalCredit)}
            subtitle="Money added to wallet"
            icon={<ArrowDownLeft size={21} />}
            iconClass="bg-emerald-50 text-emerald-600"
            badge="+12%"
            badgeClass="bg-emerald-50 text-emerald-600"
          />

          <KpiCard
            title="Total Debits"
            value={money(totalDebit)}
            subtitle="Money spent or withdrawn"
            icon={<ArrowUpRight size={21} />}
            iconClass="bg-red-50 text-red-600"
            badge="-8%"
            badgeClass="bg-red-50 text-red-600"
            valueClass="text-red-600"
          />

          <KpiCard
            title="Net Balance"
            value={money(netBalance)}
            subtitle="Current available balance"
            icon={<Wallet size={21} />}
            iconClass="bg-blue-50 text-blue-600"
            badge="Live"
            badgeClass="bg-blue-50 text-blue-600"
          />

          <KpiCard
            title="Total Transactions"
            value={String(transactions.length)}
            subtitle="In selected statement"
            icon={<ReceiptText size={21} />}
            iconClass="bg-purple-50 text-purple-600"
            badge="All Time"
            badgeClass="bg-purple-50 text-purple-600"
          />

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.7fr]">

          {/* STATEMENT DETAILS */}
          <section className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-5 py-5">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <FileText size={19} />
                  </div>

                  <div>

                    <h2 className="text-base font-black text-[#071b45]">
                      Statement Details
                    </h2>

                    <p className="text-[9px] text-slate-400">
                      Showing {filteredTransactions.length} transactions
                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  <div className="relative">

                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search transactions..."
                      className="h-10 w-[200px] rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[10px] font-semibold outline-none focus:border-blue-400 focus:bg-white"
                    />

                  </div>

                  <button
                    onClick={() =>
                      window.print()
                    }
                    className="flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-[9px] font-black text-blue-600 shadow-sm"
                  >
                    <Download size={14} />
                    Export PDF
                  </button>

                </div>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      #
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Date & Time
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Transaction ID
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Description
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Type
                    </th>

                    <th className="px-3 py-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    Array.from({
                      length: 6,
                    }).map((_, index) => (

                      <tr key={index}>

                        <td
                          colSpan={7}
                          className="px-5 py-3"
                        >
                          <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                        </td>

                      </tr>

                    ))

                  ) : filteredTransactions.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-20 text-center"
                      >

                        <div className="mx-auto max-w-sm">

                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-300">
                            <FileText size={31} />
                          </div>

                          <h3 className="mt-4 text-base font-black text-[#071b45]">
                            No transactions yet
                          </h3>

                          <p className="mt-1 text-[10px] leading-5 text-slate-400">
                            Your wallet transactions will appear here once activity is recorded.
                          </p>

                          {(search ||
                            typeFilter !== "ALL" ||
                            statusFilter !== "ALL") && (

                            <button
                              onClick={() => {
                                setSearch("");
                                setTypeFilter("ALL");
                                setStatusFilter("ALL");
                              }}
                              className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-black text-slate-600 shadow-sm"
                            >
                              Clear Filters
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredTransactions.map(
                      (tx, index) => {

                        const credit =
                          isCredit(tx.type);

                        const status =
                          statusInfo(tx.status);

                        const StatusIcon =
                          status.icon;

                        return (

                          <tr
                            key={tx.id}
                            className="border-b border-slate-100 transition hover:bg-blue-50/30"
                          >

                            <td className="px-5 py-4 text-[10px] font-bold text-slate-400">
                              {index + 1}
                            </td>

                            <td className="px-3 py-4">

                              <p className="text-[10px] font-black text-[#071b45]">
                                {formatDate(
                                  tx.createdAt
                                )}
                              </p>

                              <p className="mt-1 text-[8px] text-slate-400">
                                {formatTime(
                                  tx.createdAt
                                )}
                              </p>

                            </td>

                            <td className="px-3 py-4">

                              <p className="max-w-[130px] truncate text-[9px] font-black text-slate-700">
                                {tx.transactionId ||
                                  tx.referenceId ||
                                  tx.id}
                              </p>

                            </td>

                            <td className="px-3 py-4">

                              <div className="flex items-center gap-2">

                                <div
                                  className={`rounded-lg p-2 ${
                                    credit
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {credit ? (
                                    <ArrowDownLeft
                                      size={13}
                                    />
                                  ) : (
                                    <ArrowUpRight
                                      size={13}
                                    />
                                  )}
                                </div>

                                <div>

                                  <p className="max-w-[155px] truncate text-[10px] font-black text-slate-700">
                                    {tx.description ||
                                      tx.category ||
                                      "Wallet Transaction"}
                                  </p>

                                  {tx.paymentMethod && (
                                    <p className="mt-1 text-[8px] text-slate-400">
                                      {tx.paymentMethod}
                                    </p>
                                  )}

                                </div>

                              </div>

                            </td>

                            <td className="px-3 py-4">

                              <span
                                className={`rounded-lg px-2.5 py-1.5 text-[8px] font-black ${
                                  credit
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {credit
                                  ? "Credit"
                                  : "Debit"}
                              </span>

                            </td>

                            <td className="px-3 py-4 text-right">

                              <p
                                className={`text-xs font-black ${
                                  credit
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {credit
                                  ? "+"
                                  : "-"}
                                {money(
                                  tx.amount
                                )}
                              </p>

                            </td>

                            <td className="px-3 py-4">

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[8px] font-black ${status.cls}`}
                              >

                                <StatusIcon
                                  size={10}
                                />

                                {status.label}

                              </span>

                            </td>

                          </tr>

                        );
                      }
                    )

                  )}

                </tbody>

              </table>

            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">

              <p className="text-[9px] text-slate-400">
                Showing{" "}
                <b className="text-slate-600">
                  {filteredTransactions.length}
                </b>{" "}
                of{" "}
                <b className="text-slate-600">
                  {transactions.length}
                </b>{" "}
                transactions
              </p>

              <div className="flex items-center gap-1">

                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] text-slate-400">
                  ‹
                </button>

                <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-[9px] font-black text-white">
                  1
                </button>

                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] text-slate-600">
                  2
                </button>

                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] text-slate-600">
                  3
                </button>

                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] text-slate-400">
                  ›
                </button>

              </div>

            </div>

          </section>

          {/* ===================================================
              RIGHT PANEL
          =================================================== */}
          <aside className="space-y-5">

            {/* BALANCE TREND */}
            <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <BarChart3 size={18} />
                  </div>

                  <div>

                    <h2 className="text-sm font-black text-[#071b45]">
                      Balance Trend
                    </h2>

                    <p className="text-[9px] text-slate-400">
                      Wallet balance overview
                    </p>

                  </div>

                </div>

                <span className="rounded-lg bg-slate-50 px-2 py-1 text-[8px] font-black text-slate-500">
                  {range}
                </span>

              </div>

              {/* chart */}
              <div className="relative mt-6 h-[170px] overflow-hidden rounded-xl bg-gradient-to-b from-blue-50/70 to-white">

                <div className="absolute inset-0">

                  {[0, 1, 2, 3].map(
                    (line) => (

                      <div
                        key={line}
                        className="absolute left-0 right-0 border-t border-dashed border-slate-200"
                        style={{
                          top: `${20 + line * 20}%`,
                        }}
                      />

                    )
                  )}

                </div>

                <svg
                  viewBox="0 0 500 170"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                >

                  <defs>

                    <linearGradient
                      id="statementArea"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity=".25"
                      />

                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity="0"
                      />

                    </linearGradient>

                  </defs>

                  <path
                    d="M0 120 C35 100, 55 112, 85 90 C110 75, 125 105, 155 95 C185 84, 205 112, 230 82 C260 48, 275 95, 300 70 C330 45, 350 77, 375 57 C400 38, 425 63, 450 45 C470 31, 485 38, 500 24 L500 170 L0 170 Z"
                    fill="url(#statementArea)"
                  />

                  <path
                    d="M0 120 C35 100, 55 112, 85 90 C110 75, 125 105, 155 95 C185 84, 205 112, 230 82 C260 48, 275 95, 300 70 C330 45, 350 77, 375 57 C400 38, 425 63, 450 45 C470 31, 485 38, 500 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="500"
                    cy="24"
                    r="7"
                    fill="#2563eb"
                    stroke="white"
                    strokeWidth="4"
                  />

                </svg>

                <div className="absolute right-3 top-3 rounded-lg bg-[#172c78] px-2.5 py-1.5 text-[9px] font-black text-white shadow-lg">
                  {money(netBalance)}
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[7px] font-bold text-slate-400">
                  <span>Aug 01</span>
                  <span>Aug 10</span>
                  <span>Aug 20</span>
                  <span>Aug 30</span>
                  <span>Sep 12</span>
                </div>

              </div>

            </section>

            {/* INSIGHTS */}
            <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                  <Sparkles size={18} />
                </div>

                <div>

                  <h2 className="text-sm font-black text-[#071b45]">
                    Statement Insights
                  </h2>

                  <p className="text-[9px] text-slate-400">
                    Your wallet activity insights
                  </p>

                </div>

              </div>

              <div className="mt-4 space-y-1">

                <Insight
                  icon={<ArrowDownLeft size={14} />}
                  title="Highest Credit"
                  value={money(totalCredit)}
                  cls="text-emerald-600 bg-emerald-50"
                />

                <Insight
                  icon={<ArrowUpRight size={14} />}
                  title="Highest Debit"
                  value={money(totalDebit)}
                  cls="text-red-600 bg-red-50"
                />

                <Insight
                  icon={<ReceiptText size={14} />}
                  title="Total Transactions"
                  value={String(
                    transactions.length
                  )}
                  cls="text-blue-600 bg-blue-50"
                />

                <Insight
                  icon={<TrendingUp size={14} />}
                  title="Average Transaction"
                  value={
                    transactions.length
                      ? money(
                          totalVolume(
                            transactions
                          ) /
                            transactions.length
                        )
                      : "₹0.00"
                  }
                  cls="text-purple-600 bg-purple-50"
                />

              </div>

            </section>

            {/* SPECIAL OFFER */}
            <section className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#eee9ff] via-[#f6ecff] to-[#e4ebff] p-5 shadow-sm">

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-300/20" />

              {/* gift */}
              <div className="absolute bottom-1 right-2">

                <div className="relative h-[125px] w-[135px]">

                  <div className="absolute bottom-1 left-5 h-[72px] w-[88px] rounded-b-xl rounded-t-md bg-gradient-to-br from-blue-500 to-indigo-700 shadow-xl">

                    <div className="absolute left-1/2 h-full w-4 -translate-x-1/2 bg-yellow-300" />

                  </div>

                  <div className="absolute left-0 top-[35px] h-5 w-[100px] rounded-md bg-indigo-600 shadow-md" />

                  <div className="absolute left-[28px] top-0 h-10 w-9 -rotate-[35deg] rounded-full border-[6px] border-yellow-300 border-b-transparent" />

                  <div className="absolute left-[61px] top-0 h-10 w-9 rotate-[35deg] rounded-full border-[6px] border-yellow-300 border-b-transparent" />

                  <div className="absolute -right-1 bottom-0 flex h-10 w-10 rotate-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-base font-black text-yellow-900 shadow-lg">
                    ₹
                  </div>

                </div>

              </div>

              <div className="relative z-10 max-w-[190px]">

                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-purple-600">
                  <Gift size={12} />
                  Special Offer
                </div>

                <h2 className="mt-3 text-[23px] font-black leading-[1.05] text-[#071b45]">

                  Keep Transacting
                  <br />

                  <span className="text-purple-600">
                    Earn More Rewards!
                  </span>

                </h2>

                <p className="mt-2 text-[9px] leading-4 text-slate-500">
                  Add money, transact and unlock exciting wallet benefits.
                </p>

                <button
                  onClick={() =>
                    router.push(
                      "/customer/wallet/balance"
                    )
                  }
                  className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-[9px] font-black text-white shadow-lg"
                >
                  Explore Offers
                  <ChevronRight size={13} />
                </button>

              </div>

            </section>

          </aside>

        </div>

        {/* =====================================================
            DOWNLOAD BANNER
        ===================================================== */}
        <section className="relative mt-5 overflow-hidden rounded-[24px] border border-blue-100 bg-gradient-to-r from-[#eef4ff] via-white to-[#f2ecff] px-6 py-5">

          <div className="absolute -right-10 -top-20 h-44 w-44 rounded-full bg-blue-100/40" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <ShieldCheck
                  size={27}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h3 className="text-sm font-black text-[#071b45]">
                  Need a Detailed Statement?
                </h3>

                <p className="mt-1 text-[9px] text-slate-400">
                  Print or save your wallet statement for your records.
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                window.print()
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-[10px] font-black text-white shadow-lg shadow-blue-100"
            >
              <Download size={15} />
              Download Full Statement
            </button>

          </div>

        </section>

        {/* =====================================================
            SECURITY
        ===================================================== */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
              <LockKeyhole size={17} />
            </div>

            <div>

              <p className="text-[10px] font-black text-emerald-800">
                Your wallet statement is securely connected to your customer account.
              </p>

              <p className="mt-0.5 text-[8px] text-emerald-600">
                Your financial activity is protected by secure platform controls.
              </p>

            </div>

          </div>

          <div className="flex gap-4 text-[8px] font-black text-slate-500">

            <span className="flex items-center gap-1">
              <ShieldCheck
                size={12}
                className="text-emerald-500"
              />
              Stay Safe
            </span>

            <span className="flex items-center gap-1">
              <ShieldCheck
                size={12}
                className="text-blue-600"
              />
              Trusted Platform
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  badge,
  badgeClass,
  valueClass = "text-[#071b45]",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  badge: string;
  badgeClass: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div className={`rounded-xl p-2.5 ${iconClass}`}>
          {icon}
        </div>

        <span
          className={`rounded-lg px-2 py-1 text-[8px] font-black ${badgeClass}`}
        >
          {badge}
        </span>

      </div>

      <p className="mt-4 text-[9px] font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className={`mt-1 text-xl font-black ${valueClass}`}>
        {value}
      </p>

      <p className="mt-1 text-[9px] text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

function FilterBox({
  label,
  icon,
  text,
}: {
  label: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div>

      <p className="mb-1 text-[8px] font-black text-slate-400">
        {label}
      </p>

      <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[10px] font-bold text-slate-600">
        <span className="text-blue-500">
          {icon}
        </span>

        {text}
      </div>

    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div>

      <p className="mb-1 text-[8px] font-black text-slate-400">
        {label}
      </p>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 text-[10px] font-bold text-slate-600 outline-none focus:border-blue-400"
        >
          {options.map(
            ([optionValue, optionLabel]) => (
              <option
                key={optionValue}
                value={optionValue}
              >
                {optionLabel}
              </option>
            )
          )}
        </select>

        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

      </div>

    </div>
  );
}

function Insight({
  icon,
  title,
  value,
  cls,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  cls: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">

      <div className="flex items-center gap-2.5">

        <div className={`rounded-lg p-2 ${cls}`}>
          {icon}
        </div>

        <p className="text-[10px] font-bold text-slate-600">
          {title}
        </p>

      </div>

      <p className="text-[10px] font-black text-[#071b45]">
        {value}
      </p>

    </div>
  );
}

function totalVolume(list: Transaction[]) {
  return list.reduce(
    (sum, tx) =>
      sum + Number(tx.amount || 0),
    0
  );
}
