"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Filter,
  IndianRupee,
  LockKeyhole,
  PieChart,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DsaSidebar from "@/components/dsa/DsaSidebar";

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
  remark?: string;
};

const CREDIT = [
  "CREDIT",
  "CR",
  "DEPOSIT",
  "REFUND",
  "CASHBACK",
  "REWARD",
];

const isCredit = (t: Transaction) =>
  CREDIT.includes(String(t.type || "").toUpperCase());

const money = (v: any) =>
  `₹${Number(v || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const shortMoney = (v: number) =>
  `₹${Math.round(v).toLocaleString("en-IN")}`;

const formatDate = (v?: string) => {
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

function statusStyle(status?: string) {
  const s = String(status || "SUCCESS").toUpperCase();

  if (s === "SUCCESS" || s === "COMPLETED")
    return "bg-emerald-50 text-emerald-700 border-emerald-100";

  if (s === "PENDING" || s === "PROCESSING")
    return "bg-amber-50 text-amber-700 border-amber-100";

  if (s === "FAILED" || s === "CANCELLED")
    return "bg-red-50 text-red-700 border-red-100";

  if (s === "REFUNDED")
    return "bg-blue-50 text-blue-700 border-blue-100";

  return "bg-slate-50 text-slate-600 border-slate-100";
}

export default function AllTransactionsPage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [period, setPeriod] = useState("ALL");

  const [selected, setSelected] =
    useState<Transaction | null>(null);

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("loan_finance_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    try {
      setLoading(true);

      const walletRes = await api.get(
        "/wallet/me",
        config
      );

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

      const txData =
        txRes?.data?.data ||
        txRes?.data?.transactions ||
        txRes?.data?.data?.transactions ||
        [];

      setTransactions(
        Array.isArray(txData) ? txData : []
      );
    } catch (error: any) {
      console.error("All Transactions:", error);

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

  const stats = useMemo(() => {
    const credit = transactions
      .filter(isCredit)
      .reduce(
        (sum, x) => sum + Number(x.amount || 0),
        0
      );

    const debit = transactions
      .filter(x => !isCredit(x))
      .reduce(
        (sum, x) => sum + Number(x.amount || 0),
        0
      );

    const successful = transactions.filter(x => {
      const s = String(
        x.status || "SUCCESS"
      ).toUpperCase();

      return s === "SUCCESS" || s === "COMPLETED";
    }).length;

    const currentMonth = transactions
      .filter(x => {
        if (!x.createdAt) return false;

        const d = new Date(x.createdAt);
        const now = new Date();

        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce(
        (sum, x) => sum + Number(x.amount || 0),
        0
      );

    return {
      count: transactions.length,
      credit,
      debit,
      successRate: transactions.length
        ? Math.round(
            (successful / transactions.length) * 100
          )
        : 0,
      currentMonth,
    };
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];

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

      list = list.filter(
        x => new Date(x.createdAt || 0) >= cutoff
      );
    }

    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter(x =>
        [
          x.transactionId,
          x.id,
          x.description,
          x.category,
          x.paymentMethod,
          x.status,
          x.type,
          x.remark,
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
    search,
    status,
    period,
  ]);

  const recent = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5),
    [transactions]
  );

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};

    transactions
      .filter(x => !isCredit(x))
      .forEach(x => {
        const key =
          String(
            x.category ||
              x.description ||
              "Other"
          ).trim();

        map[key] =
          (map[key] || 0) +
          Number(x.amount || 0);
      });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [transactions]);

  const exportCSV = () => {
    if (!filtered.length) return;

    const rows = [
      [
        "Transaction ID",
        "Date",
        "Description",
        "Type",
        "Category",
        "Amount",
        "Status",
        "Payment Method",
      ],
      ...filtered.map(x => [
        x.transactionId || x.id || "",
        formatDate(x.createdAt),
        x.description || "",
        x.type || "",
        x.category || "",
        Number(x.amount || 0),
        x.status || "SUCCESS",
        x.paymentMethod || "",
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
    a.download = "all-transactions.csv";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-[#102450]">

      <DsaSidebar />

      <div className="lg:pl-[278px]">
      <main className="mx-auto max-w-[1550px] px-4 py-5 sm:px-6 lg:px-8">

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#dbeaff] via-[#eeeaff] to-[#e6ddff] shadow-[0_25px_70px_rgba(68,91,170,.14)]">

          <div className="absolute -left-20 top-[-100px] h-80 w-80 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute right-[-70px] bottom-[-130px] h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute right-[32%] top-[-120px] h-72 w-72 rounded-full bg-purple-300/25 blur-3xl" />

          <div className="relative grid min-h-[360px] lg:grid-cols-[1fr_500px]">

            {/* HERO TEXT */}

            <div className="p-7 sm:p-9 lg:p-11">

              <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-[#65779e]">
                <span>Dashboard</span>
                <ChevronRight size={12} />
                <span>Transactions</span>
                <ChevronRight size={12} />
                <span className="text-[#155eef]">
                  All Transactions
                </span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[12px] font-black tracking-wider text-[#155eef] shadow-sm">
                <Sparkles size={13} />
                SMART FINANCIAL HUB
              </div>

              <h1 className="mt-4 max-w-[700px] text-4xl font-black tracking-tight text-[#102b63] sm:text-5xl lg:text-[57px] lg:leading-[1.02]">
                All{" "}
                <span className="bg-gradient-to-r from-[#155eef] via-[#345ff5] to-[#7547ee] bg-clip-text text-transparent">
                  Transactions
                </span>
              </h1>

              <p className="mt-4 max-w-[670px] text-sm font-medium leading-6 text-[#52658c] sm:text-base">
                Your complete financial journey in one place.
                Track every wallet activity, payment, credit
                and debit with powerful filters and detailed insights.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Feature
                  icon={<ShieldCheck size={16} />}
                  title="Secure & Encrypted"
                  text="Your data stays safe"
                />

                <Feature
                  icon={<Zap size={16} />}
                  title="Real-time Updates"
                  text="Instant tracking"
                />

                <Feature
                  icon={<Activity size={16} />}
                  title="Complete History"
                  text="All financial activity"
                />

              </div>

            </div>

            {/* AI STYLE WALLET ART */}

            <div className="relative min-h-[340px] overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-blue-200/20" />

              {/* floating transaction card */}

              <div className="absolute left-[4%] top-[34px] z-20 rotate-[-7deg] rounded-2xl border border-white/90 bg-white/90 px-4 py-3 shadow-[0_18px_35px_rgba(46,78,160,.15)] backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <TrendingUp size={14} />
                  </div>

                  <div>
                    <p className="text-[13px] font-black text-slate-400">
                      TOTAL TRANSACTIONS
                    </p>

                    <p className="text-base font-black text-[#102b63]">
                      {stats.count}
                    </p>
                  </div>
                </div>

                <p className="mt-1 text-[13px] font-bold text-emerald-600">
                  +12% this month
                </p>
              </div>

              {/* stars */}

              <Sparkles
                size={22}
                className="absolute right-[42%] top-[38px] text-white"
              />

              <Sparkles
                size={13}
                className="absolute right-[20%] top-[75px] text-white"
              />

              {/* wallet illustration */}

              <div className="absolute left-[25%] top-[94px] h-[185px] w-[245px]">

                <div className="absolute left-[35px] top-[38px] h-[105px] w-[175px] rotate-[-9deg] rounded-[24px] border-4 border-blue-700 bg-gradient-to-br from-[#265de9] via-[#3f5cf1] to-[#7048e9] shadow-[0_25px_45px_rgba(39,76,200,.35)]">

                  <div className="absolute right-[20px] top-[20px] h-8 w-8 rounded-full border border-white/30 bg-white/20" />

                  <div className="absolute bottom-[17px] left-[19px] h-2 w-14 rounded-full bg-white/35" />

                  <div className="absolute bottom-[17px] right-[19px] h-2 w-8 rounded-full bg-white/25" />

                </div>

                <div className="absolute left-[65px] top-[15px] h-[110px] w-[100px] rotate-[29deg] rounded-[18px] border-2 border-white/40 bg-gradient-to-br from-[#16c79a] to-[#05a77f] shadow-[0_18px_35px_rgba(0,0,0,.18)]">

                  <div className="absolute left-4 top-4 h-8 w-10 rounded-md bg-white/20" />

                  <div className="absolute bottom-4 left-4 h-2 w-12 rounded-full bg-white/35" />

                </div>

                <div className="absolute right-[2px] top-[55px] h-[88px] w-[94px] rotate-[19deg] rounded-[17px] border-2 border-white/40 bg-gradient-to-br from-[#7350ec] to-[#4734bf] shadow-[0_20px_35px_rgba(42,31,150,.25)]">

                  <div className="absolute right-4 top-4 h-7 w-7 rounded-full bg-white/15" />

                  <div className="absolute bottom-4 left-4 h-2 w-10 rounded-full bg-white/30" />

                </div>

                {/* coin 1 */}

                <div className="absolute bottom-[-3px] left-[25px] flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-full border-4 border-orange-300 bg-gradient-to-br from-orange-300 to-yellow-500 text-xl font-black text-white shadow-lg">
                  ₹
                </div>

                {/* coin 2 */}

                <div className="absolute bottom-[-5px] right-[13px] flex h-12 w-12 rotate-[13deg] items-center justify-center rounded-full border-4 border-orange-300 bg-gradient-to-br from-yellow-300 to-orange-500 text-lg font-black text-white shadow-lg">
                  ₹
                </div>

              </div>

              {/* hand-written style label */}

              <div className="absolute right-[7%] top-[55px] rotate-[-8deg] text-center text-[#4739aa]">
                <p className="text-[17px] font-black italic">
                  Track
                </p>
                <p className="text-[17px] font-black italic">
                  Manage
                </p>
                <p className="text-[17px] font-black italic">
                  Grow
                </p>
              </div>

              <div className="absolute right-[15%] top-[105px] h-10 w-12 rotate-[38deg] border-b-2 border-l-2 border-[#4739aa]" />

              {/* wallet balance */}

              <div className="absolute bottom-[30px] right-[3%] z-30 w-[260px] rounded-[23px] border border-white/90 bg-white/90 p-5 shadow-[0_20px_45px_rgba(48,70,145,.16)] backdrop-blur-xl">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <Wallet size={16} />
                    </div>

                    <span className="text-xs font-black text-[#172f5c]">
                      Wallet Balance
                    </span>
                  </div>

                  <Eye
                    size={16}
                    className="text-blue-500"
                  />
                </div>

                <p className="mt-4 text-3xl font-black text-[#102b63]">
                  {money(wallet?.balance)}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      router.push("/dsa/wallet/balance")
                    }
                    className="flex-1 rounded-lg bg-[#155eef] py-2 text-[12px] font-black text-white"
                  >
                    Manage Wallet
                  </button>

                  <button
                    onClick={() =>
                      router.push("/dsa/wallet/balance")
                    }
                    className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[12px] font-black text-blue-600"
                  >
                    + Add
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= KPI ================= */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <KPI
            icon={<Activity size={20} />}
            value={String(stats.count)}
            label="Total Transactions"
            bg="bg-indigo-50"
            text="text-indigo-600"
          />

          <KPI
            icon={<ArrowDownLeft size={20} />}
            value={shortMoney(stats.credit)}
            label="Money In (Credit)"
            bg="bg-emerald-50"
            text="text-emerald-600"
          />

          <KPI
            icon={<ArrowUpRight size={20} />}
            value={shortMoney(stats.debit)}
            label="Money Out (Debit)"
            bg="bg-red-50"
            text="text-red-600"
          />

          <KPI
            icon={<Sparkles size={20} />}
            value={`${stats.successRate}%`}
            label="Success Rate"
            bg="bg-amber-50"
            text="text-amber-600"
          />

          <KPI
            icon={<BarChart3 size={20} />}
            value={shortMoney(stats.currentMonth)}
            label="Current Month"
            bg="bg-cyan-50"
            text="text-cyan-600"
          />

        </section>

        {/* ================= MAIN CONTENT ================= */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_365px]">

          {/* TRANSACTION PANEL */}

          <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(40,70,130,.06)]">

            <div className="border-b border-slate-100 p-5">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-xl font-black text-[#102b63]">
                    Transaction History
                  </h2>

                  <p className="mt-1 text-[13px] text-slate-400">
                    Showing your complete wallet activity
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={exportCSV}
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[12px] font-black text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  >
                    <Download size={14} />
                    Export
                  </button>

                  <select
                    value={period}
                    onChange={e =>
                      setPeriod(e.target.value)
                    }
                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-600 outline-none"
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

                  <button
                    onClick={refresh}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>

                </div>

              </div>

              <div className="mt-4 flex flex-col gap-3 md:flex-row">

                <div className="relative flex-1">

                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={e =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by transaction ID, description, category..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-[#f7f9fd] pl-10 pr-4 text-[13px] font-semibold outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <select
                  value={status}
                  onChange={e =>
                    setStatus(e.target.value)
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-600"
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

                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-[12px] font-black text-slate-600">
                  <Filter size={14} />
                  Filters
                </button>

              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

                {[
                  ["ALL", "All"],
                  ["SUCCESS", "Success"],
                  ["PENDING", "Pending"],
                  ["FAILED", "Failed"],
                  ["REFUNDED", "Refunded"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() =>
                      setStatus(value)
                    }
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-black transition ${
                      status === value
                        ? "bg-[#155eef] text-white shadow-md shadow-blue-100"
                        : "bg-[#f4f7fc] text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-[#fafcff] text-left text-[13px] font-black uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">#</th>
                    <th className="px-3 py-3">
                      Details
                    </th>
                    <th className="px-3 py-3">
                      Type
                    </th>
                    <th className="px-3 py-3">
                      Amount
                    </th>
                    <th className="px-3 py-3">
                      Status
                    </th>
                    <th className="px-3 py-3">
                      Date & Time
                    </th>
                    <th className="px-3 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center"
                      >
                        <RefreshCw
                          size={22}
                          className="mx-auto animate-spin text-blue-500"
                        />
                        <p className="mt-3 text-xs font-bold text-slate-400">
                          Loading wallet activity...
                        </p>
                      </td>
                    </tr>
                  ) : !filtered.length ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center"
                      >
                        <Activity
                          size={28}
                          className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 text-sm font-black text-slate-500">
                          No transactions found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Try changing your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx, index) => {
                      const incoming =
                        isCredit(tx);

                      return (
                        <tr
                          key={
                            tx.id ||
                            tx.transactionId ||
                            index
                          }
                          className="group border-b border-slate-50 transition hover:bg-[#f8fbff]"
                        >

                          <td className="px-5 py-4 text-[12px] font-bold text-slate-300">
                            {index + 1}
                          </td>

                          <td className="px-3 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                  incoming
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-rose-50 text-rose-600"
                                }`}
                              >
                                {incoming ? (
                                  <ArrowDownLeft size={17} />
                                ) : (
                                  <ArrowUpRight size={17} />
                                )}
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[230px] truncate text-[13px] font-black text-[#162c55]">
                                  {tx.description ||
                                    tx.category ||
                                    (incoming
                                      ? "Money Added"
                                      : "Wallet Payment")}
                                </p>

                                <p className="mt-1 max-w-[230px] truncate text-[13px] text-slate-400">
                                  {tx.transactionId ||
                                    tx.id ||
                                    "Transaction"}
                                </p>

                                {tx.paymentMethod && (
                                  <p className="mt-0.5 text-[13px] text-slate-400">
                                    {tx.paymentMethod}
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="px-3 py-4">

                            <span
                              className={`rounded-lg px-2.5 py-1 text-[13px] font-black ${
                                incoming
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {incoming
                                ? "CREDIT"
                                : "DEBIT"}
                            </span>

                          </td>

                          <td className="px-3 py-4">

                            <p
                              className={`text-[12px] font-black ${
                                incoming
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              {incoming ? "+" : "-"}
                              {money(tx.amount)}
                            </p>

                            {tx.balanceAfter !==
                              undefined && (
                              <p className="mt-1 text-[13px] text-slate-400">
                                Bal:{" "}
                                {money(
                                  tx.balanceAfter
                                )}
                              </p>
                            )}

                          </td>

                          <td className="px-3 py-4">

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[13px] font-black ${statusStyle(
                                tx.status
                              )}`}
                            >
                              {String(
                                tx.status ||
                                  "SUCCESS"
                              )}
                            </span>

                          </td>

                          <td className="px-3 py-4">

                            <p className="text-[13px] font-bold text-slate-600">
                              {formatDate(
                                tx.createdAt
                              )}
                            </p>

                          </td>

                          <td className="px-3 py-4 text-right">

                            <button
                              onClick={() =>
                                setSelected(tx)
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye size={14} />
                            </button>

                          </td>

                        </tr>
                      );
                    })
                  )}

                </tbody>

              </table>

            </div>

            {!loading && filtered.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

                <p className="text-[13px] font-semibold text-slate-400">
                  Showing {filtered.length} transactions
                </p>

                <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
                  <CheckCircle2
                    size={13}
                    className="text-emerald-500"
                  />
                  Secure wallet sync
                </div>

              </div>
            )}

          </section>

          {/* ================= RIGHT COLUMN ================= */}

          <aside className="space-y-5">

            {/* SPENDING */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(40,70,130,.06)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-black text-[#102b63]">
                    Spending Overview
                  </h2>

                  <p className="mt-1 text-[13px] text-slate-400">
                    Debit activity breakdown
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <PieChart size={17} />
                </div>

              </div>

              <div className="mt-6 flex justify-center">

                <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#3975ed_0deg_150deg,#8655eb_150deg_255deg,#ec4a98_255deg_312deg,#a5b3c9_312deg_360deg)]">

                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <p className="text-xl font-black text-[#102b63]">
                      {shortMoney(stats.debit)}
                    </p>

                    <p className="text-[13px] text-slate-400">
                      Total Spent
                    </p>
                  </div>

                </div>

              </div>

              <div className="mt-5 space-y-3">

                {categoryData.length ? (
                  categoryData.map(
                    ([category, amount], i) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >

                        <div className="flex min-w-0 items-center gap-2">

                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              i === 0
                                ? "bg-blue-500"
                                : i === 1
                                ? "bg-purple-500"
                                : i === 2
                                ? "bg-pink-500"
                                : "bg-slate-400"
                            }`}
                          />

                          <span className="truncate text-[12px] font-semibold text-slate-600">
                            {category}
                          </span>

                        </div>

                        <span className="text-[12px] font-black text-slate-700">
                          {shortMoney(
                            Number(amount)
                          )}
                        </span>

                      </div>
                    )
                  )
                ) : (
                  <p className="rounded-xl bg-slate-50 p-4 text-center text-[12px] text-slate-400">
                    No spending data available
                  </p>
                )}

              </div>

            </section>

            {/* RECENT */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(40,70,130,.06)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-black text-[#102b63]">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-[13px] text-slate-400">
                    Latest wallet movements
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("ALL");
                    setPeriod("ALL");
                  }}
                  className="text-[12px] font-black text-blue-600"
                >
                  View All
                </button>

              </div>

              <div className="mt-4 divide-y divide-slate-100">

                {recent.length ? (
                  recent.map((tx, index) => {
                    const incoming =
                      isCredit(tx);

                    return (
                      <button
                        key={
                          tx.id ||
                          tx.transactionId ||
                          index
                        }
                        onClick={() =>
                          setSelected(tx)
                        }
                        className="flex w-full items-center gap-3 py-3 text-left"
                      >

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            incoming
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {incoming ? (
                            <ArrowDownLeft size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-[12px] font-black text-[#172d55]">
                            {tx.description ||
                              tx.category ||
                              (incoming
                                ? "Money Added"
                                : "Payment")}
                          </p>

                          <p className="mt-1 text-[12px] text-slate-400">
                            {formatDate(
                              tx.createdAt
                            )}
                          </p>

                        </div>

                        <p
                          className={`whitespace-nowrap text-[12px] font-black ${
                            incoming
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {incoming ? "+" : "-"}
                          {money(tx.amount)}
                        </p>

                      </button>
                    );
                  })
                ) : (
                  <p className="py-8 text-center text-[12px] text-slate-400">
                    No recent activity
                  </p>
                )}

              </div>

            </section>

            {/* SECURITY */}

            <section className="rounded-[23px] border border-blue-100 bg-gradient-to-br from-[#edf5ff] to-[#f4efff] p-5">

              <div className="flex gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <p className="text-xs font-black text-[#173565]">
                    Bank-grade security
                  </p>

                  <p className="mt-1 text-[13px] leading-4 text-slate-500">
                    Your financial activity is protected
                    with secure account access.
                  </p>
                </div>

              </div>

            </section>

          </aside>

        </section>

      </main>
      </div>

      {/* ================= DETAIL MODAL ================= */}

      {selected && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#07142f]/45 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >

          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-[30px] bg-white shadow-[0_30px_100px_rgba(0,0,0,.25)]"
          >

            <div className="bg-gradient-to-br from-[#155eef] to-[#7148ed] p-6 text-white">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[13px] font-black uppercase tracking-[.18em] text-blue-100">
                    Transaction Details
                  </p>

                  <h3 className="mt-2 text-lg font-black">
                    {selected.description ||
                      selected.category ||
                      "Wallet Transaction"}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"
                >
                  <X size={17} />
                </button>

              </div>

              <p className="mt-6 text-3xl font-black">
                {isCredit(selected)
                  ? "+"
                  : "-"}
                {money(selected.amount)}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 p-6">

              <Detail
                label="Transaction ID"
                value={
                  selected.transactionId ||
                  selected.id ||
                  "—"
                }
              />

              <Detail
                label="Type"
                value={
                  isCredit(selected)
                    ? "CREDIT"
                    : "DEBIT"
                }
              />

              <Detail
                label="Status"
                value={String(
                  selected.status ||
                    "SUCCESS"
                )}
              />

              <Detail
                label="Category"
                value={
                  selected.category ||
                  "—"
                }
              />

              <Detail
                label="Payment Method"
                value={
                  selected.paymentMethod ||
                  "—"
                }
              />

              <Detail
                label="Date & Time"
                value={formatDate(
                  selected.createdAt
                )}
              />

              <Detail
                label="Balance After"
                value={
                  selected.balanceAfter !==
                  undefined
                    ? money(
                        selected.balanceAfter
                      )
                    : "—"
                }
              />

              <Detail
                label="Amount"
                value={money(
                  selected.amount
                )}
              />

            </div>

            <div className="px-6 pb-6">

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="w-full rounded-xl bg-[#102450] py-3 text-xs font-black text-white"
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

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/60 px-3 py-2.5 shadow-sm backdrop-blur">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-[13px] font-black text-[#183565]">
          {title}
        </p>

        <p className="mt-0.5 text-[12px] text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

function KPI({
  icon,
  value,
  label,
  bg,
  text,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
  text: string;
}) {
  return (
    <div className="rounded-[21px] border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(40,70,130,.05)] transition hover:-translate-y-0.5">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${text}`}
        >
          {icon}
        </div>

        <BarChart3
          size={14}
          className="text-slate-200"
        />

      </div>

      <p className="mt-4 truncate text-xl font-black text-[#102b63]">
        {value}
      </p>

      <p className="mt-1 text-[13px] font-semibold text-slate-400">
        {label}
      </p>

    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#f7f9fc] p-3">
      <p className="text-[12px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-[12px] font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}


