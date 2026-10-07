"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  RefreshCw,
  Wallet,
  CheckCircle2,
  Clock3,
  XCircle,
  CreditCard,
  ReceiptText,
  Filter,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/api";

type Transaction = {
  id?: string;
  transactionId?: string;
  type?: string;
  category?: string;
  amount?: number | string;
  description?: string;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
  reference?: string;
};

type Mode = "ALL" | "CREDIT" | "DEBIT";

function unwrap(response: any) {
  return response?.data?.data ?? response?.data ?? response;
}

function money(value: number | string | undefined) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function normalizeType(type?: string) {
  return String(type || "").toUpperCase();
}

function isCredit(t: Transaction) {
  return ["CREDIT", "CR", "DEPOSIT", "REFUND", "CASHBACK", "REWARD"].includes(
    normalizeType(t.type)
  );
}

function isDebit(t: Transaction) {
  return ["DEBIT", "DR", "WITHDRAW", "RECHARGE", "PAYMENT"].includes(
    normalizeType(t.type)
  );
}

function statusMeta(status?: string) {
  const s = String(status || "").toLowerCase();

  if (
    s.includes("success") ||
    s.includes("complete") ||
    s === "completed"
  ) {
    return {
      label: "Successful",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    };
  }

  if (s.includes("pending") || s.includes("process")) {
    return {
      label: "Pending",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock3,
    };
  }

  if (
    s.includes("fail") ||
    s.includes("reject") ||
    s.includes("cancel")
  ) {
    return {
      label: "Failed",
      cls: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    };
  }

  return {
    label: status || "Completed",
    cls: "bg-slate-50 text-slate-600 border-slate-200",
    icon: ReceiptText,
  };
}

export default function TransactionHistory({
  mode = "ALL",
}: {
  mode?: Mode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const loadTransactions = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const token = localStorage.getItem("loan_finance_token");
      const storedUser = localStorage.getItem("loan_finance_user");

      if (!token || !storedUser) {
        window.location.href = "/login";
        return;
      }

      const user = JSON.parse(storedUser);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const [walletRes, balanceRes] = await Promise.allSettled([
        api.get("/wallet/me", config),
        api.get("/wallet/balance", config),
      ]);

      let wallet: any = null;

      if (walletRes.status === "fulfilled") {
        wallet = unwrap(walletRes.value);
      }

      if (balanceRes.status === "fulfilled") {
        const balanceData: any = unwrap(balanceRes.value);
        setWalletBalance(
          Number(
            balanceData?.balance ??
              balanceData?.wallet?.balance ??
              wallet?.balance ??
              0
          )
        );
      } else if (wallet) {
        setWalletBalance(Number(wallet?.balance || 0));
      }

      const walletId = wallet?.id;

      if (!walletId) {
        setTransactions([]);
        setError("Wallet information is not available.");
        return;
      }

      const response = await api.get(
        `/wallet/${walletId}/transactions`,
        config
      );

      const data = unwrap(response);

      const list =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.transactions)
          ? data.transactions
          : Array.isArray(data?.items)
          ? data.items
          : [];

      setTransactions(list);
    } catch (err: any) {
      console.error("Transaction Error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("loan_finance_token");
        window.location.href = "/login";
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load transactions right now."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

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
        (t) =>
          String(t.status || "").toUpperCase() === statusFilter
      );
    }

    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((t) =>
        [
          t.transactionId,
          t.reference,
          t.description,
          t.category,
          t.paymentMethod,
          t.type,
          t.amount,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return list;
  }, [transactions, mode, search, statusFilter]);

  const stats = useMemo(() => {
    const source =
      mode === "CREDIT"
        ? transactions.filter(isCredit)
        : mode === "DEBIT"
        ? transactions.filter(isDebit)
        : transactions;

    const total = source.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    const successful = source.filter((t) =>
      String(t.status || "").toLowerCase().includes("success")
    ).length;

    const pending = source.filter((t) =>
      String(t.status || "").toLowerCase().includes("pending")
    ).length;

    return {
      count: source.length,
      total,
      successful,
      pending,
    };
  }, [transactions, mode]);

  const title =
    mode === "CREDIT"
      ? "Credit Transactions"
      : mode === "DEBIT"
      ? "Debit Transactions"
      : "All Transactions";

  const subtitle =
    mode === "CREDIT"
      ? "Track money credited to your wallet."
      : mode === "DEBIT"
      ? "Track recharge, withdrawal and other wallet debits."
      : "View and manage your complete wallet transaction activity.";

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-[#10245c]">
      {/* HEADER */}
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <Link href="/customer/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <ChevronRight size={13} />
            <span>Transactions</span>
            <ChevronRight size={13} />
            <span className="text-blue-600">
              {mode === "ALL" ? "All Transactions" : mode}
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            {title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <button
          onClick={() => loadTransactions(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-400 hover:shadow-md disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* HERO */}
      <section className="relative mb-5 overflow-hidden rounded-[26px] border border-blue-100 bg-gradient-to-br from-[#eef6ff] via-white to-[#f3efff] p-5 shadow-sm md:p-7">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_310px] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-blue-700 shadow-sm">
              <ReceiptText size={13} />
              Smart Wallet Transactions
            </div>

            <h2 className="max-w-2xl text-3xl font-black leading-tight md:text-4xl">
              Every Transaction.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Fully Under Control.
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Keep track of credits, debits, wallet activity and
              payment status from one secure place.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-blue-100 bg-white/90 p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Transactions
                </p>
                <p className="mt-1 text-xl font-black">
                  {stats.count}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white/90 p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Total Value
                </p>
                <p className="mt-1 text-xl font-black">
                  {money(stats.total)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Successful
                </p>
                <p className="mt-1 text-xl font-black text-emerald-600">
                  {stats.successful}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-white/90 p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Pending
                </p>
                <p className="mt-1 text-xl font-black text-amber-600">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          {/* WALLET CARD */}
          <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-100">
                  Wallet Balance
                </p>
                <p className="mt-1 text-3xl font-black">
                  {money(walletBalance)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 p-3">
                <Wallet size={24} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Link
                href="/customer/wallet/balance"
                className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-blue-700 shadow hover:bg-blue-50"
              >
                Manage Wallet
              </Link>

              <span className="text-[10px] font-bold text-blue-100">
                Secure & Protected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="mb-5 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-blue-600" />
          <div>
            <h3 className="text-base font-black">Find a Transaction</h3>
            <p className="text-[11px] text-slate-400">
              Search and filter your wallet activity
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_170px_auto]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transaction, category, reference, amount..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-400"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Successful</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600"
          >
            Clear Filters
          </button>
        </div>

        {/* TRANSACTION TABS */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/customer/transactions/all"
            className={`rounded-xl px-4 py-2 text-xs font-black ${
              mode === "ALL"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            All Transactions
          </Link>

          <Link
            href="/customer/transactions/credit"
            className={`rounded-xl px-4 py-2 text-xs font-black ${
              mode === "CREDIT"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
            }`}
          >
            Credit
          </Link>

          <Link
            href="/customer/transactions/debit"
            className={`rounded-xl px-4 py-2 text-xs font-black ${
              mode === "DEBIT"
                ? "bg-violet-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600"
            }`}
          >
            Debit
          </Link>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          {error}
        </div>
      )}

      {/* TRANSACTIONS */}
      <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black">{title}</h3>
            <p className="text-[11px] text-slate-400">
              {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-14 text-center">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <ReceiptText size={30} className="text-slate-400" />
            </div>

            <h4 className="mt-4 text-lg font-black">
              No transactions found
            </h4>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Your {mode === "CREDIT" ? "credit" : mode === "DEBIT" ? "debit" : ""} transactions
              will appear here once available.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((transaction, index) => {
              const credit = isCredit(transaction);
              const status = statusMeta(transaction.status);
              const StatusIcon = status.icon;

              return (
                <button
                  key={
                    transaction.id ||
                    transaction.transactionId ||
                    `${transaction.createdAt}-${index}`
                  }
                  onClick={() => setSelected(transaction)}
                  className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        credit
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-violet-50 text-violet-600"
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
                        <p className="truncate text-sm font-black text-slate-800">
                          {transaction.description ||
                            transaction.category ||
                            "Wallet Transaction"}
                        </p>

                        <span
                          className={`rounded-full border px-2 py-1 text-[9px] font-black ${status.cls}`}
                        >
                          <StatusIcon
                            size={10}
                            className="mr-1 inline"
                          />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-slate-400">
                        <span>
                          {transaction.category || "WALLET"}
                        </span>

                        {transaction.paymentMethod && (
                          <span>{transaction.paymentMethod}</span>
                        )}

                        {transaction.createdAt && (
                          <span>
                            {new Date(
                              transaction.createdAt
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-base font-black ${
                          credit
                            ? "text-emerald-600"
                            : "text-violet-600"
                        }`}
                      >
                        {credit ? "+" : "-"}
                        {money(transaction.amount)}
                      </p>

                      <p className="mt-1 text-[9px] font-bold text-slate-400">
                        {transaction.transactionId ||
                          transaction.reference ||
                          "Transaction"}
                      </p>
                    </div>

                    <ChevronRight
                      size={17}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* SECURITY FOOTER */}
      <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white px-5 py-4 text-center shadow-sm md:flex-row md:text-left">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-xs font-black">Secure Wallet Transactions</p>
            <p className="text-[10px] text-slate-400">
              Your transaction information is protected.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-600">
          ● Secure & Protected
        </span>
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-[26px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-80">
                    Transaction Details
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    {selected.description ||
                      selected.category ||
                      "Wallet Transaction"}
                  </h3>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-white/15 px-3 py-2 text-xs font-black hover:bg-white/25"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <span className="text-xs font-bold text-slate-500">
                  Amount
                </span>
                <span className="text-xl font-black">
                  {money(selected.amount)}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[9px] font-bold text-slate-400">
                    TYPE
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {selected.type || "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[9px] font-bold text-slate-400">
                    CATEGORY
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {selected.category || "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[9px] font-bold text-slate-400">
                    PAYMENT METHOD
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {selected.paymentMethod || "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[9px] font-bold text-slate-400">
                    STATUS
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {selected.status || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-[9px] font-bold text-slate-400">
                  TRANSACTION ID
                </p>
                <p className="mt-1 break-all text-sm font-black">
                  {selected.transactionId ||
                    selected.reference ||
                    selected.id ||
                    "-"}
                </p>
              </div>

              {selected.createdAt && (
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-[9px] font-bold text-slate-400">
                    DATE & TIME
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {new Date(selected.createdAt).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
