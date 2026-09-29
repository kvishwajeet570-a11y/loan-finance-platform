"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
  RefreshCw,
  Search,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Plus,
  Download,
  Gift,
  ShieldCheck,
  LockKeyhole,
  BarChart3,
  Zap,
  CheckCircle2,
  XCircle,
  Clock3,
  Sparkles,
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

const unwrap = (payload: any) =>
  payload?.data !== undefined ? payload.data : payload;

const money = (value?: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const isCredit = (type?: string) => {
  const v = String(type || "").toUpperCase();
  return (
    v.includes("CREDIT") ||
    v.includes("ADD") ||
    v.includes("REWARD") ||
    v.includes("CASHBACK") ||
    v.includes("REFUND")
  );
};

const dateText = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const timeText = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function statusData(status?: string) {
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
      dot: "bg-emerald-500",
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
      dot: "bg-red-500",
    };
  }

  return {
    label: "Pending",
    icon: Clock3,
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  };
}

export default function WalletTransactionsPage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("loan_finance_token");
      const user = localStorage.getItem("loan_finance_user");

      if (!token || !user) {
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
        setTransactions(walletData?.transactions || []);
        return;
      }

      const response = await api.get(
        `/wallet/${walletData.id}/transactions`,
        config
      );

      const data = unwrap(response.data);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.transactions)
          ? data.transactions
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setTransactions(list);
    } catch (err: any) {
      console.error("Wallet transactions error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        localStorage.removeItem("loan_finance_user");
        router.replace("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load wallet transactions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return transactions.filter((tx) => {
      const credit = isCredit(tx.type);

      if (typeFilter === "CREDIT" && !credit)
        return false;

      if (typeFilter === "DEBIT" && credit)
        return false;

      if (dateFilter && tx.createdAt) {
        const d = new Date(tx.createdAt)
          .toISOString()
          .slice(0, 10);

        if (d !== dateFilter) return false;
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
        tx.status,
      ]
        .filter(Boolean)
        .some((x) =>
          String(x).toLowerCase().includes(q)
        );
    });
  }, [
    transactions,
    search,
    typeFilter,
    dateFilter,
  ]);

  const totalCredit = transactions
    .filter((x) => isCredit(x.type))
    .reduce(
      (sum, x) => sum + Number(x.amount || 0),
      0
    );

  const totalDebit = transactions
    .filter((x) => !isCredit(x.type))
    .reduce(
      (sum, x) => sum + Number(x.amount || 0),
      0
    );

  const total = totalCredit + totalDebit;

  const creditPercent =
    total > 0
      ? Math.round((totalCredit / total) * 100)
      : 0;

  const debitPercent =
    total > 0
      ? Math.round((totalDebit / total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#f4f7fc] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">

        {/* =====================================================
            PREMIUM HERO
        ===================================================== */}
        <section className="relative mb-5 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0758d9] via-[#1556dc] to-[#9146e8] px-7 py-6 text-white shadow-xl shadow-blue-100 sm:px-9 sm:py-7">

          {/* background circles */}
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute right-[27%] -bottom-32 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute left-[45%] -top-28 h-56 w-56 rounded-full bg-cyan-300/10" />

          {/* floating coins */}
          <div className="absolute right-[18%] top-5 hidden lg:block">

            <div className="absolute left-16 top-0 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-xl font-black text-yellow-900 shadow-xl">
              ₹
            </div>

            <div className="absolute left-0 top-14 flex h-11 w-11 -rotate-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-lg font-black text-yellow-900 shadow-xl">
              ₹
            </div>

            <div className="absolute left-28 top-20 flex h-10 w-10 rotate-6 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-base font-black text-yellow-900 shadow-lg">
              ₹
            </div>

          </div>

          {/* wallet illustration */}
          <div className="absolute right-7 top-8 hidden h-[135px] w-[220px] lg:block">

            <div className="absolute left-10 top-12 h-[76px] w-[118px] rotate-[-5deg] rounded-2xl border-2 border-white/50 bg-gradient-to-br from-cyan-300 to-blue-500 shadow-2xl">

              <div className="absolute left-0 top-5 h-3 w-full bg-white/20" />

              <div className="absolute right-5 top-8 h-7 w-10 rounded-lg border-2 border-white/80" />

              <div className="absolute bottom-4 left-5 h-2 w-10 rounded-full bg-white/40" />

            </div>

            <div className="absolute left-[118px] top-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-xl font-black shadow-lg">
              ₹
            </div>

          </div>

          <div className="relative z-10 max-w-[590px]">

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur">
                <ReceiptText size={25} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-100">
                  Digital Wallet
                </p>

                <p className="text-xs font-semibold text-white/75">
                  Wallet Management
                </p>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Transactions
            </h1>

            <p className="mt-1 max-w-md text-sm text-white/75">
              View, track and manage all your wallet transactions in one place.
            </p>

          </div>

          <button
            onClick={refresh}
            disabled={refreshing}
            className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#1646b7] shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
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

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
            <span className="text-xs font-black text-red-700">
              {error}
            </span>

            <button
              onClick={refresh}
              className="rounded-lg bg-red-600 px-4 py-2 text-[10px] font-black text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            title="Available Balance"
            value={money(wallet?.balance)}
            subtitle="Current wallet balance"
            icon={<Wallet size={21} />}
            iconClass="bg-blue-50 text-blue-600"
            badge="Current"
            badgeClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            title="Total Credit"
            value={money(totalCredit)}
            subtitle="Money received in wallet"
            icon={<ArrowDownLeft size={21} />}
            iconClass="bg-emerald-50 text-emerald-600"
            badge={`+${creditPercent}%`}
            badgeClass="bg-emerald-50 text-emerald-600"
            valueClass="text-emerald-600"
          />

          <SummaryCard
            title="Total Debit"
            value={money(totalDebit)}
            subtitle="Money spent or withdrawn"
            icon={<ArrowUpRight size={21} />}
            iconClass="bg-red-50 text-red-600"
            badge={`-${debitPercent}%`}
            badgeClass="bg-red-50 text-red-600"
            valueClass="text-red-600"
          />

          <SummaryCard
            title="Total Transactions"
            value={String(transactions.length)}
            subtitle="All wallet transactions"
            icon={<ReceiptText size={21} />}
            iconClass="bg-purple-50 text-purple-600"
            badge="All Time"
            badgeClass="bg-purple-50 text-purple-600"
          />

        </div>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.58fr_.72fr]">

          {/* ===================================================
              TRANSACTION HISTORY
          =================================================== */}
          <section className="overflow-hidden rounded-[25px] border border-slate-100 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                      <ReceiptText size={19} />
                    </div>

                    <div>
                      <h2 className="text-base font-black text-[#071b45]">
                        Transaction History
                      </h2>

                      <p className="text-[10px] text-slate-400">
                        Your complete wallet activity
                      </p>
                    </div>

                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search transactions..."
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-semibold outline-none focus:border-blue-400 focus:bg-white sm:w-[195px]"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) =>
                        setTypeFilter(e.target.value)
                      }
                      className="h-10 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 text-[11px] font-black text-slate-600 outline-none"
                    >
                      <option value="ALL">
                        All Transactions
                      </option>
                      <option value="CREDIT">
                        Credit
                      </option>
                      <option value="DEBIT">
                        Debit
                      </option>
                    </select>

                    <ChevronDown
                      size={13}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <CalendarDays
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) =>
                        setDateFilter(e.target.value)
                      }
                      className="h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-semibold text-slate-600 outline-none"
                    />
                  </div>

                </div>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      #
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Transaction ID
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Type
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Description
                    </th>

                    <th className="px-3 py-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    Array.from({ length: 5 }).map(
                      (_, i) => (
                        <tr key={i}>
                          <td
                            colSpan={7}
                            className="px-5 py-3"
                          >
                            <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                          </td>
                        </tr>
                      )
                    )
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-20 text-center"
                      >

                        <div className="mx-auto flex max-w-sm flex-col items-center">

                          <div className="rounded-2xl bg-blue-50 p-5 text-blue-300">
                            <ReceiptText size={35} />
                          </div>

                          <h3 className="mt-4 text-base font-black text-[#071b45]">
                            No transactions yet
                          </h3>

                          <p className="mt-1 text-[11px] leading-5 text-slate-400">
                            Your wallet activity will appear here once you make a transaction.
                          </p>

                          {(search ||
                            typeFilter !== "ALL" ||
                            dateFilter) ? (
                            <button
                              onClick={() => {
                                setSearch("");
                                setTypeFilter("ALL");
                                setDateFilter("");
                              }}
                              className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-black text-slate-600 shadow-sm"
                            >
                              Clear Filters
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                router.push(
                                  "/customer/wallet/balance"
                                )
                              }
                              className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-blue-200"
                            >
                              <Plus size={15} />
                              Add Money Now
                            </button>
                          )}

                        </div>

                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx, index) => {

                      const credit =
                        isCredit(tx.type);

                      const status =
                        statusData(tx.status);

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
                            <p className="max-w-[145px] truncate text-[10px] font-black text-[#071b45]">
                              {tx.transactionId ||
                                tx.referenceId ||
                                tx.id}
                            </p>

                            {tx.referenceId && (
                              <p className="mt-1 text-[8px] text-slate-400">
                                Ref: {tx.referenceId}
                              </p>
                            )}
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
                                    size={14}
                                  />
                                ) : (
                                  <ArrowUpRight
                                    size={14}
                                  />
                                )}
                              </div>

                              <span className="text-[10px] font-black text-slate-700">
                                {credit
                                  ? "Credit"
                                  : "Debit"}
                              </span>

                            </div>

                          </td>

                          <td className="px-3 py-4">

                            <p className="max-w-[170px] truncate text-[10px] font-bold text-slate-700">
                              {tx.description ||
                                tx.category ||
                                "Wallet Transaction"}
                            </p>

                            {tx.paymentMethod && (
                              <p className="mt-1 text-[8px] text-slate-400">
                                {tx.paymentMethod}
                              </p>
                            )}

                          </td>

                          <td className="px-3 py-4 text-right">

                            <p
                              className={`text-xs font-black ${
                                credit
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {credit ? "+" : "-"}
                              {money(tx.amount)}
                            </p>

                          </td>

                          <td className="px-3 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[8px] font-black ${status.cls}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                              />
                              <StatusIcon size={10} />
                              {status.label}
                            </span>

                          </td>

                          <td className="px-3 py-4">

                            <p className="text-[10px] font-bold text-slate-700">
                              {dateText(
                                tx.createdAt
                              )}
                            </p>

                            <p className="mt-1 text-[8px] text-slate-400">
                              {timeText(
                                tx.createdAt
                              )}
                            </p>

                          </td>

                        </tr>
                      );
                    })
                  )}

                </tbody>

              </table>

            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">

              <p className="text-[9px] font-semibold text-slate-400">
                Showing{" "}
                <b className="text-slate-600">
                  {filtered.length}
                </b>{" "}
                transactions
              </p>

              <button
                onClick={() =>
                  router.push(
                    "/customer/wallet/statement"
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-[9px] font-black text-blue-600 shadow-sm"
              >
                <Download size={13} />
                Download Statement
              </button>

            </div>

          </section>

          {/* ===================================================
              RIGHT SIDE
          =================================================== */}
          <aside className="space-y-5">

            {/* ANALYTICS */}
            <section className="rounded-[25px] border border-slate-100 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <BarChart3 size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-black text-[#071b45]">
                    Spending Analytics
                  </h2>

                  <p className="text-[9px] text-slate-400">
                    Overview of your transactions
                  </p>
                </div>

              </div>

              <div className="mt-5 flex items-center gap-5">

                <div
                  className="relative flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#16a34a ${creditPercent}%, #ef4444 ${creditPercent}% ${creditPercent + debitPercent}%, #dbe4f0 ${creditPercent + debitPercent}% 100%)`,
                  }}
                >

                  <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-white">
                    <p className="text-base font-black text-[#071b45]">
                      {money(totalDebit)}
                    </p>

                    <p className="text-[8px] font-bold text-slate-400">
                      Total Spent
                    </p>
                  </div>

                </div>

                <div className="flex-1 space-y-4">

                  <AnalyticsRow
                    label="Credits"
                    value={money(totalCredit)}
                    percent={`${creditPercent}%`}
                    dot="bg-emerald-500"
                  />

                  <AnalyticsRow
                    label="Debits"
                    value={money(totalDebit)}
                    percent={`${debitPercent}%`}
                    dot="bg-red-500"
                  />

                  <AnalyticsRow
                    label="Others"
                    value="₹0"
                    percent="0%"
                    dot="bg-blue-500"
                  />

                </div>

              </div>

            </section>

            {/* QUICK ACTIONS */}
            <section className="rounded-[25px] border border-slate-100 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                  <Zap size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-black text-[#071b45]">
                    Quick Actions
                  </h2>

                  <p className="text-[9px] text-slate-400">
                    Manage your wallet easily
                  </p>
                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">

                <Action
                  title="Add Money"
                  subtitle="Instantly add funds"
                  icon={<Plus size={15} />}
                  cls="bg-emerald-50 text-emerald-700"
                  iconCls="bg-emerald-500 text-white"
                  onClick={() =>
                    router.push(
                      "/customer/wallet/balance"
                    )
                  }
                />

                <Action
                  title="Withdraw"
                  subtitle="Transfer to bank"
                  icon={<ArrowUpRight size={15} />}
                  cls="bg-purple-50 text-purple-700"
                  iconCls="bg-purple-500 text-white"
                  onClick={() =>
                    router.push(
                      "/customer/wallet/balance"
                    )
                  }
                />

                <Action
                  title="View Statement"
                  subtitle="Download statement"
                  icon={<Download size={15} />}
                  cls="bg-blue-50 text-blue-700"
                  iconCls="bg-blue-500 text-white"
                  onClick={() =>
                    router.push(
                      "/customer/wallet/statement"
                    )
                  }
                />

                <Action
                  title="Filter"
                  subtitle="Advanced search"
                  icon={<Search size={15} />}
                  cls="bg-rose-50 text-rose-700"
                  iconCls="bg-rose-500 text-white"
                  onClick={() =>
                    document
                      .querySelector("input")
                      ?.focus()
                  }
                />

              </div>

            </section>

            {/* SPECIAL OFFER */}
            <section className="relative min-h-[245px] overflow-hidden rounded-[25px] bg-gradient-to-br from-[#eef0ff] via-[#f7efff] to-[#e7edff] p-5 shadow-sm">

              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-purple-300/20" />

              <div className="absolute right-3 bottom-1">

                {/* gift */}
                <div className="relative h-[130px] w-[145px]">

                  <div className="absolute bottom-2 left-4 h-[82px] w-[98px] rounded-b-2xl rounded-t-md bg-gradient-to-br from-blue-500 to-indigo-700 shadow-xl">

                    <div className="absolute left-1/2 h-full w-4 -translate-x-1/2 bg-yellow-300" />

                  </div>

                  <div className="absolute left-0 top-[30px] h-5 w-[112px] rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md" />

                  <div className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-1">

                    <div className="h-11 w-10 -rotate-35 rounded-full border-[7px] border-yellow-300 border-b-transparent" />

                    <div className="h-11 w-10 rotate-35 rounded-full border-[7px] border-yellow-300 border-b-transparent" />

                  </div>

                  <div className="absolute -right-2 bottom-0 flex h-11 w-11 rotate-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-lg font-black text-yellow-900 shadow-lg">
                    ₹
                  </div>

                  <div className="absolute -left-2 bottom-4 flex h-9 w-9 -rotate-12 items-center justify-center rounded-full border-4 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-500 text-base font-black text-yellow-900 shadow-lg">
                    ₹
                  </div>

                </div>

              </div>

              <div className="relative z-10 max-w-[190px]">

                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-purple-600">
                  <Gift size={12} />
                  Special Offer
                </div>

                <h2 className="mt-3 text-[24px] font-black leading-[1.05] text-[#071b45]">
                  Do More with
                  <br />
                  Your{" "}
                  <span className="text-purple-600">
                    Wallet!
                  </span>
                </h2>

                <p className="mt-2 text-[10px] leading-4 text-slate-500">
                  Add money, transact and earn exciting rewards.
                </p>

                <button className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-[9px] font-black text-white shadow-lg">
                  Explore Offers
                  <ChevronRight size={13} />
                </button>

              </div>

            </section>

          </aside>

        </div>

        {/* SECURITY */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-blue-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
              <LockKeyhole size={18} />
            </div>

            <div>
              <p className="text-[11px] font-black text-emerald-800">
                Your wallet information is securely connected to your customer account.
              </p>

              <p className="mt-0.5 text-[9px] text-emerald-600">
                We use industry-standard encryption to keep your data safe.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 text-[9px] font-black text-slate-500">

            <span className="flex items-center gap-1.5">
              <ShieldCheck
                size={13}
                className="text-emerald-500"
              />
              Stay Safe
            </span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck
                size={13}
                className="text-blue-600"
              />
              Trusted Platform
            </span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck
                size={13}
                className="text-emerald-500"
              />
              100% Secure
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

function SummaryCard({
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

        <span className={`rounded-lg px-2 py-1 text-[8px] font-black ${badgeClass}`}>
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

function AnalyticsRow({
  label,
  value,
  percent,
  dot,
}: {
  label: string;
  value: string;
  percent: string;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div>
        <p className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          {label}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[10px] font-black text-slate-700">
          {value}
        </p>
        <p className="text-[8px] text-slate-400">
          {percent}
        </p>
      </div>

    </div>
  );
}

function Action({
  title,
  subtitle,
  icon,
  cls,
  iconCls,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  cls: string;
  iconCls: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${cls}`}
    >

      <div className="flex items-center gap-2">

        <div className={`rounded-lg p-1.5 ${iconCls}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-black">
            {title}
          </p>

          <p className="truncate text-[8px] opacity-70">
            {subtitle}
          </p>
        </div>

      </div>

    </button>
  );
}
