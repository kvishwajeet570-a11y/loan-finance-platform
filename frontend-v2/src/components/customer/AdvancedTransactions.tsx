"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Download,
  Filter,
  IndianRupee,
  PieChart,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Tx = {
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
  remark?: string;
};

type Mode = "ALL" | "CREDIT" | "DEBIT";

const CREDIT = [
  "CREDIT",
  "CR",
  "DEPOSIT",
  "REFUND",
  "CASHBACK",
  "REWARD",
];

const DEBIT = [
  "DEBIT",
  "DR",
  "WITHDRAW",
  "RECHARGE",
  "PAYMENT",
];

const money = (v: any) =>
  `₹${Number(v || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const compact = (v: number) =>
  `₹${Math.round(v).toLocaleString("en-IN")}`;

const credit = (t: Tx) =>
  CREDIT.includes(String(t.type || "").toUpperCase());

const debit = (t: Tx) =>
  DEBIT.includes(String(t.type || "").toUpperCase());

const dateText = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusClass = (s?: string) => {
  const v = String(s || "SUCCESS").toUpperCase();

  if (v === "SUCCESS" || v === "COMPLETED")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";

  if (v === "PENDING" || v === "PROCESSING")
    return "border-amber-200 bg-amber-50 text-amber-700";

  if (v === "FAILED" || v === "CANCELLED")
    return "border-red-200 bg-red-50 text-red-700";

  return "border-blue-200 bg-blue-50 text-blue-700";
};

export default function AdvancedTransactions({
  mode = "ALL",
}: {
  mode?: Mode;
}) {
  const router = useRouter();

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [period, setPeriod] = useState("ALL");
  const [selected, setSelected] = useState<Tx | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem("loan_finance_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const walletRes = await api.get("/wallet/me", config);

      const walletData =
        walletRes?.data?.data ||
        walletRes?.data?.wallet ||
        walletRes?.data;

      setWallet(walletData);

      if (!walletData?.id) {
        setTransactions([]);
        return;
      }

      const txRes = await api.get(
        `/wallet/${walletData.id}/transactions`,
        config
      );

      const data =
        txRes?.data?.data ||
        txRes?.data?.transactions ||
        txRes?.data?.data?.transactions ||
        [];

      setTransactions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Transactions error:", error);

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
    load();
  }, [load]);

  const visible = useMemo(() => {
    let list = [...transactions];

    if (mode === "CREDIT")
      list = list.filter(credit);

    if (mode === "DEBIT")
      list = list.filter(debit);

    if (status !== "ALL") {
      list = list.filter(
        x =>
          String(x.status || "SUCCESS").toUpperCase() ===
          status
      );
    }

    if (period !== "ALL") {
      const cutoff = new Date();
      cutoff.setDate(
        cutoff.getDate() - Number(period)
      );

      list = list.filter(x => {
        const d = new Date(x.createdAt || 0);
        return d >= cutoff;
      });
    }

    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter(x =>
        [
          x.transactionId,
          x.id,
          x.category,
          x.description,
          x.paymentMethod,
          x.status,
          x.remark,
          x.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return list.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  }, [
    transactions,
    mode,
    status,
    period,
    search,
  ]);

  const totals = useMemo(() => {
    const incoming = transactions
      .filter(credit)
      .reduce(
        (sum, x) => sum + Number(x.amount || 0),
        0
      );

    const outgoing = transactions
      .filter(debit)
      .reduce(
        (sum, x) => sum + Number(x.amount || 0),
        0
      );

    const success = transactions.filter(x => {
      const s = String(
        x.status || "SUCCESS"
      ).toUpperCase();

      return (
        s === "SUCCESS" ||
        s === "COMPLETED"
      );
    }).length;

    return {
      incoming,
      outgoing,
      count: transactions.length,
      success: transactions.length
        ? Math.round(
            (success / transactions.length) * 100
          )
        : 0,
    };
  }, [transactions]);

  const exportCSV = () => {
    if (!visible.length) return;

    const rows = [
      [
        "Transaction ID",
        "Date",
        "Type",
        "Category",
        "Amount",
        "Status",
        "Payment Method",
        "Description",
      ],
      ...visible.map(x => [
        x.transactionId || x.id || "",
        dateText(x.createdAt),
        x.type || "",
        x.category || "",
        Number(x.amount || 0),
        x.status || "SUCCESS",
        x.paymentMethod || "",
        x.description || "",
      ]),
    ];

    const csv = rows
      .map(row =>
        row
          .map(v =>
            `"${String(v).replace(/"/g, '""')}"`
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
    a.download = `loan-finance-${mode.toLowerCase()}-transactions.csv`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const refresh = async () => {
    setRefreshing(true);
    await load();
  };

  if (mode === "ALL") {
    return (
      <div className="min-h-screen bg-[#f3f7fc] text-slate-900">
        <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          <section className="relative overflow-hidden rounded-[32px] bg-[#102f63] p-7 text-white shadow-[0_25px_70px_rgba(16,47,99,.22)] sm:p-10">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_400px] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black">
                  <Activity size={14} />
                  FINANCIAL COMMAND CENTER
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  All Transactions
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                  Complete visibility of your wallet movement,
                  payments, credits and debits in one intelligent
                  transaction center.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={refresh}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#102f63]"
                  >
                    <RefreshCw
                      size={16}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />
                    Refresh
                  </button>

                  <button
                    onClick={exportCSV}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-100">
                    Available Balance
                  </span>

                  <Wallet size={22} />
                </div>

                <p className="mt-5 text-4xl font-black">
                  {money(wallet?.balance)}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-black/10 p-4">
                    <p className="text-xs text-blue-100">
                      Money In
                    </p>
                    <p className="mt-1 font-black">
                      {compact(totals.incoming)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/10 p-4">
                    <p className="text-xs text-blue-100">
                      Money Out
                    </p>
                    <p className="mt-1 font-black">
                      {compact(totals.outgoing)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi
              icon={<Activity size={19} />}
              label="Transactions"
              value={String(totals.count)}
            />

            <Kpi
              icon={<TrendingUp size={19} />}
              label="Money In"
              value={compact(totals.incoming)}
            />

            <Kpi
              icon={<TrendingDown size={19} />}
              label="Money Out"
              value={compact(totals.outgoing)}
            />

            <Kpi
              icon={<ShieldCheck size={19} />}
              label="Success Rate"
              value={`${totals.success}%`}
            />
          </section>

          <FilterBar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            period={period}
            setPeriod={setPeriod}
          />

          <section className="mt-6 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
              <div>
                <h2 className="text-xl font-black text-[#102f63]">
                  Activity Timeline
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {visible.length} transaction
                  {visible.length !== 1 ? "s" : ""}
                </p>
              </div>

              <BarChart3
                size={21}
                className="text-blue-500"
              />
            </div>

            {loading ? (
              <Loading />
            ) : !visible.length ? (
              <Empty />
            ) : (
              <TransactionList
                data={visible}
                onSelect={setSelected}
                tone="blue"
              />
            )}
          </section>
        </main>

        <Detail
          tx={selected}
          close={() => setSelected(null)}
        />
      </div>
    );
  }

  if (mode === "CREDIT") {
    const credits = visible.filter(credit);

    const average = credits.length
      ? totals.incoming / credits.length
      : 0;

    return (
      <div className="min-h-screen bg-[#f1f8f3] text-slate-900">
        <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          <section className="overflow-hidden rounded-[34px] border border-emerald-100 bg-[#fffdf6] shadow-[0_25px_65px_rgba(22,163,74,.08)]">
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <div className="p-7 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
                  <ArrowDownLeft size={14} />
                  MONEY IN
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight text-[#173d2b] sm:text-5xl">
                  Credit Activity
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                  See every amount added to your wallet,
                  including deposits, refunds, cashback and rewards.
                </p>

                <div className="mt-8">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Total Received
                  </p>

                  <p className="mt-2 text-4xl font-black text-emerald-600">
                    {money(totals.incoming)}
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={refresh}
                    className="rounded-xl bg-[#16875a] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100"
                  >
                    <RefreshCw
                      size={16}
                      className={`mr-2 inline ${
                        refreshing
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    Update Credits
                  </button>

                  <button
                    onClick={exportCSV}
                    className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-black text-emerald-700"
                  >
                    <Download
                      size={16}
                      className="mr-2 inline"
                    />
                    Report
                  </button>
                </div>
              </div>

              <div className="relative flex min-h-[330px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#d8f7e5] via-[#effff4] to-[#fff4c9] p-8">
                <div className="absolute h-72 w-72 rounded-full border-[35px] border-white/70" />
                <div className="absolute h-48 w-48 rounded-full border-[25px] border-emerald-200/60" />

                <div className="relative w-full max-w-sm rounded-[30px] bg-white/90 p-6 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                      <Wallet size={24} />
                    </div>

                    <Sparkles
                      size={21}
                      className="text-amber-500"
                    />
                  </div>

                  <p className="mt-6 text-xs font-black uppercase tracking-wider text-slate-400">
                    Wallet Balance
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#173d2b]">
                    {money(wallet?.balance)}
                  </p>

                  <div className="mt-6 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">
                      Credit entries
                    </span>

                    <span className="text-emerald-600">
                      {credits.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <GreenStat
              icon={<TrendingUp size={19} />}
              title="Total Credit"
              value={compact(totals.incoming)}
            />

            <GreenStat
              icon={<Activity size={19} />}
              title="Credit Entries"
              value={String(credits.length)}
            />

            <GreenStat
              icon={<IndianRupee size={19} />}
              title="Average Credit"
              value={compact(average)}
            />
          </section>

          <section className="mt-6 rounded-[25px] border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400"
                />

                <input
                  value={search}
                  onChange={e =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search credit, refund, cashback, reward..."
                  className="h-11 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 pl-10 pr-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white"
                />
              </div>

              <select
                value={period}
                onChange={e =>
                  setPeriod(e.target.value)
                }
                className="h-11 rounded-xl border border-emerald-100 bg-white px-4 text-sm font-bold"
              >
                <option value="ALL">
                  All Incoming
                </option>
                <option value="7">
                  Last 7 Days
                </option>
                <option value="30">
                  Last 30 Days
                </option>
                <option value="90">
                  Last 90 Days
                </option>
              </select>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[330px_1fr]">
            <aside className="rounded-[28px] bg-[#173d2b] p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-emerald-200">
                <PieChart size={19} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Credit Snapshot
                </span>
              </div>

              <p className="mt-8 text-sm text-emerald-100">
                Total incoming
              </p>

              <p className="mt-2 text-3xl font-black">
                {compact(totals.incoming)}
              </p>

              <div className="mt-8 space-y-4">
                <Snapshot
                  label="Cashback"
                  value={credits
                    .filter(x =>
                      String(
                        x.category ||
                          x.description ||
                          ""
                      )
                        .toUpperCase()
                        .includes("CASH")
                    )
                    .reduce(
                      (s, x) =>
                        s +
                        Number(x.amount || 0),
                      0
                    )}
                />

                <Snapshot
                  label="Refund"
                  value={credits
                    .filter(x =>
                      String(
                        x.category ||
                          x.description ||
                          ""
                      )
                        .toUpperCase()
                        .includes("REFUND")
                    )
                    .reduce(
                      (s, x) =>
                        s +
                        Number(x.amount || 0),
                      0
                    )}
                />

                <Snapshot
                  label="Rewards"
                  value={credits
                    .filter(x =>
                      String(
                        x.category ||
                          x.description ||
                          ""
                      )
                        .toUpperCase()
                        .includes("REWARD")
                    )
                    .reduce(
                      (s, x) =>
                        s +
                        Number(x.amount || 0),
                      0
                    )}
                />
              </div>
            </aside>

            <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-50 px-5 py-5">
                <h2 className="text-xl font-black text-[#173d2b]">
                  Incoming Timeline
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Credit activity from your wallet
                </p>
              </div>

              {loading ? (
                <Loading />
              ) : !credits.length ? (
                <Empty />
              ) : (
                <TransactionList
                  data={credits}
                  onSelect={setSelected}
                  tone="green"
                />
              )}
            </section>
          </section>
        </main>

        <Detail
          tx={selected}
          close={() => setSelected(null)}
        />
      </div>
    );
  }

  const debits = visible.filter(debit);

  const rechargeTotal = debits
    .filter(x =>
      String(
        x.category ||
          x.description ||
          ""
      )
        .toUpperCase()
        .includes("RECHARGE")
    )
    .reduce(
      (s, x) => s + Number(x.amount || 0),
      0
    );

  const paymentTotal = debits
    .filter(x =>
      String(
        x.category ||
          x.description ||
          ""
      )
        .toUpperCase()
        .includes("PAYMENT")
    )
    .reduce(
      (s, x) => s + Number(x.amount || 0),
      0
    );

  const highest = debits.reduce(
    (m, x) =>
      Math.max(
        m,
        Number(x.amount || 0)
      ),
    0
  );

  return (
    <div className="min-h-screen bg-[#fff7f2] text-slate-900">
      <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

        <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#461b15] via-[#762c20] to-[#a33e20] p-7 text-white shadow-[0_25px_70px_rgba(124,45,32,.22)] sm:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-rose-300/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/20 bg-white/10 px-3 py-1.5 text-xs font-black text-orange-100">
                <ArrowUpRight size={14} />
                MONEY OUT
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Debit Activity
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-orange-100 sm:text-base">
                Track every outgoing payment, recharge,
                withdrawal and wallet deduction from one
                powerful spending dashboard.
              </p>

              <div className="mt-8">
                <p className="text-xs font-black uppercase tracking-widest text-orange-200">
                  Total Money Spent
                </p>

                <p className="mt-2 text-4xl font-black">
                  {money(totals.outgoing)}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={refresh}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-black text-[#762c20]"
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 inline ${
                      refreshing
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  Refresh Spending
                </button>

                <button
                  onClick={exportCSV}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black"
                >
                  <Download
                    size={16}
                    className="mr-2 inline"
                  />
                  Export Report
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-black/15 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-orange-100">
                  Spending Overview
                </span>

                <TrendingDown size={21} />
              </div>

              <div className="mt-7">
                <div className="flex items-end justify-between">
                  <span className="text-xs text-orange-100">
                    Wallet utilisation
                  </span>

                  <span className="text-sm font-black">
                    {debits.length} debits
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-300 to-rose-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          5,
                          (
                            totals.outgoing /
                            Math.max(
                              totals.outgoing +
                                Number(
                                  wallet?.balance ||
                                    0
                                ),
                              1
                            )
                          ) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-orange-100">
                    Highest
                  </p>

                  <p className="mt-1 font-black">
                    {compact(highest)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-orange-100">
                    Balance
                  </p>

                  <p className="mt-1 font-black">
                    {compact(
                      Number(
                        wallet?.balance || 0
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <OrangeStat
            title="Total Debit"
            value={compact(totals.outgoing)}
            icon={<ArrowUpRight size={19} />}
          />

          <OrangeStat
            title="Recharge Spending"
            value={compact(rechargeTotal)}
            icon={<Zap size={19} />}
          />

          <OrangeStat
            title="Payment Spending"
            value={compact(paymentTotal)}
            icon={<IndianRupee size={19} />}
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[330px_1fr]">
          <aside className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter
                size={18}
                className="text-orange-600"
              />

              <h2 className="font-black text-[#461b15]">
                Spending Filters
              </h2>
            </div>

            <div className="mt-6">
              <label className="text-xs font-bold text-slate-500">
                Search debit
              </label>

              <div className="relative mt-2">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={e =>
                    setSearch(e.target.value)
                  }
                  placeholder="Recharge, payment, withdrawal..."
                  className="h-10 w-full rounded-xl border border-orange-100 bg-orange-50/30 pl-9 pr-3 text-sm outline-none focus:border-orange-400"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs font-bold text-slate-500">
                Time Period
              </label>

              <select
                value={period}
                onChange={e =>
                  setPeriod(e.target.value)
                }
                className="mt-2 h-10 w-full rounded-xl border border-orange-100 bg-white px-3 text-sm font-bold"
              >
                <option value="ALL">
                  All Time
                </option>
                <option value="7">
                  Last 7 Days
                </option>
                <option value="30">
                  Last 30 Days
                </option>
                <option value="90">
                  Last 90 Days
                </option>
              </select>
            </div>

            <div className="mt-6 rounded-2xl bg-[#fff3ea] p-4">
              <p className="text-xs font-black uppercase tracking-wider text-orange-500">
                Current Wallet
              </p>

              <p className="mt-2 text-2xl font-black text-[#461b15]">
                {money(wallet?.balance)}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <ShieldCheck
                  size={15}
                  className="text-emerald-500"
                />
                Secure wallet tracking
              </div>
            </div>

            <button
              onClick={exportCSV}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#762c20] text-sm font-black text-white"
            >
              <Download size={16} />
              Export Debit Report
            </button>
          </aside>

          <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-orange-50 px-5 py-5">
              <div>
                <h2 className="text-xl font-black text-[#461b15]">
                  Spending Timeline
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {debits.length} outgoing transaction
                  {debits.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                <Activity size={19} />
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : !debits.length ? (
              <Empty />
            ) : (
              <TransactionList
                data={debits}
                onSelect={setSelected}
                tone="orange"
              />
            )}
          </section>
        </section>
      </main>

      <Detail
        tx={selected}
        close={() => setSelected(null)}
      />
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          {icon}
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Overview
        </span>
      </div>

      <p className="mt-5 text-2xl font-black text-[#102f63]">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

function GreenStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[23px] border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <p className="mt-5 text-2xl font-black text-[#173d2b]">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {title}
      </p>
    </div>
  );
}

function OrangeStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[23px] border border-orange-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        {icon}
      </div>

      <p className="mt-5 text-2xl font-black text-[#461b15]">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {title}
      </p>
    </div>
  );
}

function Snapshot({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <span className="text-sm text-emerald-100">
        {label}
      </span>

      <span className="font-black">
        {compact(value)}
      </span>
    </div>
  );
}

function FilterBar({
  search,
  setSearch,
  status,
  setStatus,
  period,
  setPeriod,
}: any) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
            placeholder="Search transaction ID, category, payment..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold outline-none focus:border-blue-400 focus:bg-white"
          />
        </div>

        <select
          value={status}
          onChange={e =>
            setStatus(e.target.value)
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold"
        >
          <option value="ALL">
            All Status
          </option>
          <option value="SUCCESS">
            Success
          </option>
          <option value="PENDING">
            Pending
          </option>
          <option value="FAILED">
            Failed
          </option>
          <option value="REFUNDED">
            Refunded
          </option>
        </select>

        <select
          value={period}
          onChange={e =>
            setPeriod(e.target.value)
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold"
        >
          <option value="ALL">
            All Time
          </option>
          <option value="7">
            7 Days
          </option>
          <option value="30">
            30 Days
          </option>
          <option value="90">
            90 Days
          </option>
        </select>
      </div>
    </section>
  );
}

function TransactionList({
  data,
  onSelect,
  tone,
}: {
  data: Tx[];
  onSelect: (x: Tx) => void;
  tone: "blue" | "green" | "orange";
}) {
  const iconBg =
    tone === "green"
      ? "bg-emerald-50 text-emerald-600"
      : tone === "orange"
      ? "bg-orange-50 text-orange-600"
      : "bg-blue-50 text-blue-600";

  return (
    <div className="divide-y divide-slate-100">
      {data.map((tx, i) => {
        const incoming = credit(tx);

        return (
          <button
            key={
              tx.id ||
              tx.transactionId ||
              i
            }
            onClick={() => onSelect(tx)}
            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
            >
              {incoming ? (
                <ArrowDownLeft size={21} />
              ) : (
                <ArrowUpRight size={21} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-black text-slate-800">
                  {tx.description ||
                    tx.category ||
                    (incoming
                      ? "Wallet Credit"
                      : "Wallet Debit")}
                </p>

                {tx.category && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-500">
                    {tx.category}
                  </span>
                )}
              </div>

              <p className="mt-1 truncate text-xs text-slate-400">
                {dateText(tx.createdAt)}
                {tx.paymentMethod
                  ? ` • ${tx.paymentMethod}`
                  : ""}
              </p>

              <p className="mt-1 truncate text-[10px] text-slate-300">
                ID:{" "}
                {tx.transactionId ||
                  tx.id ||
                  "—"}
              </p>
            </div>

            <div className="text-right">
              <p
                className={`font-black ${
                  incoming
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {incoming ? "+" : "-"}
                {money(tx.amount)}
              </p>

              <span
                className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-black ${statusClass(
                  tx.status
                )}`}
              >
                {String(
                  tx.status || "SUCCESS"
                )}
              </span>
            </div>

            <ChevronRight
              size={17}
              className="hidden text-slate-300 sm:block"
            />
          </button>
        );
      })}
    </div>
  );
}

function Loading() {
  return (
    <div className="p-10 text-center">
      <RefreshCw
        size={22}
        className="mx-auto animate-spin text-blue-500"
      />

      <p className="mt-3 text-sm font-semibold text-slate-400">
        Loading transactions...
      </p>
    </div>
  );
}

function Empty() {
  return (
    <div className="p-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FileIcon />
      </div>

      <p className="mt-4 font-black text-slate-600">
        No transactions found
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Try changing your filters or search.
      </p>
    </div>
  );
}

function FileIcon() {
  return <Activity size={27} />;
}

function Detail({
  tx,
  close,
}: {
  tx: Tx | null;
  close: () => void;
}) {
  if (!tx) return null;

  const incoming = credit(tx);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        onClick={e =>
          e.stopPropagation()
        }
        className="w-full max-w-lg overflow-hidden rounded-[30px] bg-white shadow-2xl"
      >
        <div
          className={`p-6 text-white ${
            incoming
              ? "bg-gradient-to-br from-emerald-600 to-teal-700"
              : "bg-gradient-to-br from-orange-600 to-rose-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Transaction Details
              </p>

              <h3 className="mt-2 text-xl font-black">
                {tx.description ||
                  tx.category ||
                  "Wallet Transaction"}
              </h3>
            </div>

            <button
              onClick={close}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"
            >
              <X size={17} />
            </button>
          </div>

          <p className="mt-6 text-3xl font-black">
            {incoming ? "+" : "-"}
            {money(tx.amount)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-6">
          <Info
            label="Transaction ID"
            value={
              tx.transactionId ||
              tx.id ||
              "—"
            }
          />

          <Info
            label="Status"
            value={String(
              tx.status || "SUCCESS"
            )}
          />

          <Info
            label="Category"
            value={tx.category || "—"}
          />

          <Info
            label="Payment Method"
            value={
              tx.paymentMethod || "—"
            }
          />

          <Info
            label="Date & Time"
            value={dateText(
              tx.createdAt
            )}
          />

          <Info
            label="Balance After"
            value={
              tx.balanceAfter !==
              undefined
                ? money(
                    tx.balanceAfter
                  )
                : "—"
            }
          />
        </div>

        {tx.remark && (
          <div className="mx-6 mb-6 rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Remark
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {tx.remark}
            </p>
          </div>
        )}

        <div className="px-6 pb-6">
          <button
            onClick={close}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-black text-white"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}
