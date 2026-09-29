"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Gift,
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

const CREDIT_TYPES = [
  "CREDIT",
  "CR",
  "DEPOSIT",
  "REFUND",
  "CASHBACK",
  "REWARD",
];

const isCredit = (t: Transaction) =>
  CREDIT_TYPES.includes(
    String(t.type || "").toUpperCase()
  );

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

const statusClass = (status?: string) => {
  const s = String(
    status || "SUCCESS"
  ).toUpperCase();

  if (s === "SUCCESS" || s === "COMPLETED")
    return "border-emerald-100 bg-emerald-50 text-emerald-700";

  if (s === "PENDING" || s === "PROCESSING")
    return "border-amber-100 bg-amber-50 text-amber-700";

  if (s === "FAILED" || s === "CANCELLED")
    return "border-red-100 bg-red-50 text-red-700";

  if (s === "REFUNDED")
    return "border-blue-100 bg-blue-50 text-blue-700";

  return "border-slate-100 bg-slate-50 text-slate-600";
};

export default function CreditTransactionsPage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("ALL");
  const [source, setSource] = useState("ALL");

  const [selected, setSelected] =
    useState<Transaction | null>(null);

  const loadData = useCallback(async () => {
    const token = localStorage.getItem(
      "loan_finance_token"
    );

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
        Array.isArray(txData)
          ? txData.filter(isCredit)
          : []
      );
    } catch (error: any) {
      console.error(
        "Credit Transactions:",
        error
      );

      if (error?.response?.status === 401) {
        localStorage.removeItem(
          "loan_finance_token"
        );
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
    const total = transactions.reduce(
      (sum, t) =>
        sum + Number(t.amount || 0),
      0
    );

    const thisMonth = transactions
      .filter(t => {
        if (!t.createdAt) return false;

        const d = new Date(t.createdAt);
        const n = new Date();

        return (
          d.getMonth() === n.getMonth() &&
          d.getFullYear() === n.getFullYear()
        );
      })
      .reduce(
        (sum, t) =>
          sum + Number(t.amount || 0),
        0
      );

    const successful = transactions.filter(
      t => {
        const s = String(
          t.status || "SUCCESS"
        ).toUpperCase();

        return (
          s === "SUCCESS" ||
          s === "COMPLETED"
        );
      }
    ).length;

    const successRate = transactions.length
      ? Math.round(
          (successful /
            transactions.length) *
            100
        )
      : 0;

    return {
      count: transactions.length,
      total,
      thisMonth,
      successRate,
    };
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (period !== "ALL") {
      const cutoff = new Date();

      cutoff.setDate(
        cutoff.getDate() -
          Number(period)
      );

      list = list.filter(
        t =>
          new Date(
            t.createdAt || 0
          ) >= cutoff
      );
    }

    if (source !== "ALL") {
      list = list.filter(t => {
        const value = `${t.category || ""} ${
          t.description || ""
        }`.toUpperCase();

        return value.includes(source);
      });
    }

    const q = search
      .trim()
      .toLowerCase();

    if (q) {
      list = list.filter(t =>
        [
          t.transactionId,
          t.id,
          t.description,
          t.category,
          t.paymentMethod,
          t.status,
          t.remark,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return list.sort(
      (a, b) =>
        new Date(
          b.createdAt || 0
        ).getTime() -
        new Date(
          a.createdAt || 0
        ).getTime()
    );
  }, [
    transactions,
    period,
    source,
    search,
  ]);

  const sourceStats = useMemo(() => {
    const map: Record<string, number> = {};

    transactions.forEach(t => {
      const raw = String(
        t.category ||
          t.description ||
          "Other"
      ).toUpperCase();

      let key = "Other";

      if (
        raw.includes("LOAN") ||
        raw.includes("DISBURSE")
      ) {
        key = "Loan Disbursement";
      } else if (
        raw.includes("TOP") ||
        raw.includes("ADD") ||
        raw.includes("DEPOSIT")
      ) {
        key = "Top-Up";
      } else if (
        raw.includes("REFUND")
      ) {
        key = "Refund";
      } else if (
        raw.includes("CASHBACK")
      ) {
        key = "Cashback";
      } else if (
        raw.includes("REWARD")
      ) {
        key = "Reward";
      }

      map[key] =
        (map[key] || 0) +
        Number(t.amount || 0);
    });

    return Object.entries(map)
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 5);
  }, [transactions]);

  const recent = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ).getTime() -
            new Date(
              a.createdAt || 0
            ).getTime()
        )
        .slice(0, 4),
    [transactions]
  );

  const exportCSV = () => {
    if (!filtered.length) return;

    const rows = [
      [
        "Transaction ID",
        "Date",
        "Description",
        "Source",
        "Amount",
        "Status",
        "Payment Method",
      ],
      ...filtered.map(t => [
        t.transactionId ||
          t.id ||
          "",
        formatDate(t.createdAt),
        t.description ||
          "",
        t.category ||
          "",
        Number(
          t.amount || 0
        ),
        t.status ||
          "SUCCESS",
        t.paymentMethod ||
          "",
      ]),
    ];

    const csv = rows
      .map(row =>
        row
          .map(v =>
            `"${String(v).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "credit-transactions.csv";

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
    <div className="min-h-screen bg-[#f2fbf8] text-[#10294f]">

      <main className="mx-auto max-w-[1550px] px-4 py-5 sm:px-6 lg:px-8">

        {/* =====================================================
            CREDIT AI HERO — SAME MINT / GREEN VISUAL LANGUAGE
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e9fff6] via-[#edfbfa] to-[#dff7ee] shadow-[0_25px_70px_rgba(22,137,105,.12)]">

          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/80 blur-3xl" />

          <div className="absolute right-[-80px] bottom-[-120px] h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="absolute right-[34%] top-[-120px] h-72 w-72 rounded-full bg-teal-200/25 blur-3xl" />

          <div className="relative grid min-h-[390px] lg:grid-cols-[1fr_540px]">

            {/* LEFT CONTENT */}

            <div className="p-7 sm:p-9 lg:p-11">

              <div className="flex items-center gap-2 text-[13px] font-bold text-[#668278]">
                <span>Dashboard</span>

                <ChevronRight size={12} />

                <span>Transactions</span>

                <ChevronRight size={12} />

                <span className="text-[#079669]">
                  Credit Transactions
                </span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-[#d9fff0] px-3.5 py-1.5 text-[13px] font-black tracking-wide text-[#049568] shadow-sm">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0ab981] text-white">
                  ₹
                </span>

                CREDIT TRANSACTIONS
              </div>

              <h1 className="mt-5 max-w-[760px] text-4xl font-black tracking-tight text-[#09295b] sm:text-5xl lg:text-[57px] lg:leading-[1.02]">

                Money In,{" "}

                <span className="bg-gradient-to-r from-[#008d61] via-[#079c6d] to-[#15b783] bg-clip-text text-transparent">
                  Growth On!
                </span>

              </h1>

              <p className="mt-3 text-lg font-black text-[#122e5e] sm:text-xl">
                Track all your credit transactions in one place.
              </p>

              <p className="mt-2 max-w-[690px] text-sm leading-6 text-[#587368] sm:text-[15px]">
                Every top-up, refund, cashback and amount received —
                secure, transparent and always updated in real-time.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">

                <HeroMini
                  icon={<Zap size={17} />}
                  title="Instant Updates"
                  text="Real-time credit tracking"
                />

                <HeroMini
                  icon={<ShieldCheck size={17} />}
                  title="100% Secure"
                  text="Your data is protected"
                />

                <HeroMini
                  icon={<Activity size={17} />}
                  title="Complete History"
                  text="All your credits at one place"
                />

              </div>

            </div>

            {/* RIGHT AI ILLUSTRATION */}

            <div className="relative min-h-[360px] overflow-hidden">

              {/* floating money card */}

              <div className="absolute left-[2%] top-[42px] z-30 rotate-[-8deg] rounded-[18px] border border-white bg-white/95 px-5 py-3 shadow-[0_20px_40px_rgba(32,112,88,.18)] backdrop-blur">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <p className="text-[13px] font-bold text-slate-500">
                      Money Added
                    </p>

                    <p className="text-lg font-black text-[#102d58]">
                      + ₹5,000
                    </p>
                  </div>

                </div>

              </div>

              {/* decorative stars */}

              <Sparkles
                size={22}
                className="absolute right-[43%] top-[28px] text-white"
              />

              <Sparkles
                size={14}
                className="absolute right-[22%] top-[65px] text-[#76d9bd]"
              />

              {/* leaves */}

              <div className="absolute left-[22%] top-[130px]">

                <div className="h-20 w-10 rotate-[-28deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#4bd09d] to-[#0a9c70]" />

                <div className="ml-8 mt-[-38px] h-16 w-8 rotate-[31deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#75dfae] to-[#12a477]" />

              </div>

              {/* MAIN WALLET */}

              <div className="absolute left-[31%] top-[92px] h-[190px] w-[250px]">

                {/* wallet body */}

                <div className="absolute left-[34px] top-[43px] h-[116px] w-[190px] rotate-[-8deg] rounded-[26px] border-[5px] border-[#008b68] bg-gradient-to-br from-[#0dbd8d] via-[#079f78] to-[#087b67] shadow-[0_28px_45px_rgba(0,110,79,.30)]">

                  <div className="absolute right-[18px] top-[20px] h-9 w-9 rounded-full border border-white/30 bg-white/15" />

                  <div className="absolute bottom-[18px] left-[19px] h-2.5 w-16 rounded-full bg-white/35" />

                  <div className="absolute bottom-[18px] right-[20px] h-2.5 w-9 rounded-full bg-white/25" />

                </div>

                {/* cards */}

                <div className="absolute left-[72px] top-[14px] h-[118px] w-[103px] rotate-[27deg] rounded-[20px] border-2 border-white/50 bg-gradient-to-br from-[#16c89a] to-[#087c67] shadow-[0_20px_35px_rgba(0,88,70,.24)]">

                  <div className="absolute left-4 top-4 h-9 w-11 rounded-md bg-white/20" />

                  <div className="absolute bottom-4 left-4 h-2 w-12 rounded-full bg-white/30" />

                </div>

                <div className="absolute right-[1px] top-[60px] h-[92px] w-[98px] rotate-[20deg] rounded-[18px] border-2 border-white/50 bg-gradient-to-br from-[#218fdd] to-[#3559dc] shadow-[0_20px_35px_rgba(36,79,170,.24)]">

                  <div className="absolute right-4 top-4 h-7 w-7 rounded-full bg-white/15" />

                  <div className="absolute bottom-4 left-4 h-2 w-11 rounded-full bg-white/30" />

                </div>

                {/* rupee coin */}

                <div className="absolute bottom-[-5px] left-[15px] flex h-[62px] w-[62px] rotate-[-10deg] items-center justify-center rounded-full border-[5px] border-[#f6c55d] bg-gradient-to-br from-[#ffc95a] to-[#e99422] text-[25px] font-black text-white shadow-[0_15px_25px_rgba(210,139,24,.30)]">
                  ₹
                </div>

                <div className="absolute bottom-[-7px] right-[12px] flex h-[51px] w-[51px] rotate-[13deg] items-center justify-center rounded-full border-[4px] border-[#f8c75b] bg-gradient-to-br from-[#ffd76b] to-[#ee9821] text-xl font-black text-white shadow-lg">
                  ₹
                </div>

              </div>

              {/* SAVE INVEST GROW */}

              <div className="absolute right-[8%] top-[48px] rotate-[-7deg] text-[#0b7059]">
                <p className="text-[19px] font-black italic">
                  Save
                </p>

                <p className="text-[19px] font-black italic">
                  Invest
                </p>

                <p className="text-[19px] font-black italic">
                  Grow
                </p>
              </div>

              <div className="absolute right-[14%] top-[112px] h-12 w-14 rotate-[36deg] border-b-2 border-l-2 border-[#0b7059]" />

              {/* TOTAL MONEY IN CARD */}

              <div className="absolute bottom-[28px] right-[4%] z-40 w-[285px] rounded-[24px] border border-white/90 bg-white/95 p-5 shadow-[0_22px_50px_rgba(35,110,89,.18)] backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <TrendingUp size={18} />
                  </div>

                  <p className="text-xs font-black text-[#17335f]">
                    Total Money In
                  </p>

                </div>

                <p className="mt-3 text-3xl font-black text-[#102d58]">
                  {money(stats.total)}
                </p>

                <div className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[14px] font-black text-emerald-600">
                  ↑ {stats.thisMonth > 0 ? "Active" : "0"} this month
                </div>

                <p className="mt-3 text-[13px] font-medium italic text-[#527365]">
                  “Every credit moves you closer to your bigger goals.”
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* ================= KPI CARDS ================= */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <CreditKPI
            icon={<Wallet size={22} />}
            value={String(stats.count)}
            label="Total Credit Transactions"
            bg="bg-emerald-100"
            text="text-emerald-600"
          />

          <CreditKPI
            icon={<ArrowDownLeft size={22} />}
            value={money(stats.total)}
            label="Total Amount Received"
            bg="bg-blue-100"
            text="text-blue-600"
          />

          <CreditKPI
            icon={<CalendarDays size={22} />}
            value={money(stats.thisMonth)}
            label="This Month"
            bg="bg-purple-100"
            text="text-purple-600"
          />

          <CreditKPI
            icon={<TrendingUp size={22} />}
            value={`${stats.successRate}%`}
            label="Successful Credits"
            bg="bg-emerald-100"
            text="text-emerald-600"
          />

        </section>

        {/* ================= CONTENT ================= */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_365px]">

          {/* HISTORY */}

          <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(34,110,88,.06)]">

            <div className="border-b border-slate-100 p-5">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-xl font-black text-[#102d58]">
                    Credit Transaction History
                  </h2>

                  <p className="mt-1 text-[14px] text-slate-400">
                    Showing all money received, top-ups,
                    refunds and credit entries
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={exportCSV}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-black text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
                  >
                    <Download size={15} />
                    Export
                  </button>

                  <select
                    value={period}
                    onChange={e =>
                      setPeriod(e.target.value)
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-black text-slate-600 outline-none"
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
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-emerald-600"
                  >
                    <RefreshCw
                      size={15}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>

                </div>

              </div>

              <div className="mt-4 flex flex-col gap-3 lg:flex-row">

                <div className="relative flex-1">

                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={e =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by transaction ID, description, source..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-[#f8fbfa] pl-10 pr-4 text-[14px] font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                  />

                </div>

                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-black text-slate-600">
                  <Filter size={15} />
                  Filters
                </button>

              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

                {[
                  ["ALL", "All"],
                  ["LOAN", "Loan"],
                  ["TOP", "Top-Up"],
                  ["REFUND", "Refund"],
                  ["CASHBACK", "Cashback"],
                  ["REWARD", "Reward"],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSource(value)
                      }
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-black transition ${
                        source === value
                          ? "bg-[#0bad78] text-white shadow-lg shadow-emerald-100"
                          : "bg-[#f3f8f6] text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-[#fbfdfc] text-left text-[14px] font-black uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-4">#</th>
                    <th className="px-3 py-4">
                      Details
                    </th>
                    <th className="px-3 py-4">
                      Source
                    </th>
                    <th className="px-3 py-4">
                      Amount
                    </th>
                    <th className="px-3 py-4">
                      Status
                    </th>
                    <th className="px-3 py-4">
                      Date & Time
                    </th>
                    <th className="px-3 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-20 text-center"
                      >
                        <RefreshCw
                          size={25}
                          className="mx-auto animate-spin text-emerald-500"
                        />

                        <p className="mt-3 text-sm font-bold text-slate-400">
                          Loading credit transactions...
                        </p>
                      </td>
                    </tr>
                  ) : !filtered.length ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-20 text-center"
                      >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                          <ArrowDownLeft size={28} />
                        </div>

                        <p className="mt-4 text-base font-black text-slate-600">
                          No credit transactions found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Your received-money activity will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(
                      (tx, index) => (
                        <tr
                          key={
                            tx.id ||
                            tx.transactionId ||
                            index
                          }
                          className="group border-b border-slate-50 transition hover:bg-[#f6fcf9]"
                        >

                          <td className="px-5 py-5 text-[13px] font-bold text-slate-300">
                            {index + 1}
                          </td>

                          <td className="px-3 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                {String(
                                  tx.description ||
                                    ""
                                )
                                  .toUpperCase()
                                  .includes(
                                    "CASHBACK"
                                  ) ? (
                                  <Gift size={19} />
                                ) : (
                                  <Wallet size={19} />
                                )}
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[250px] truncate text-[14px] font-black text-[#142f58]">
                                  {tx.description ||
                                    tx.category ||
                                    "Money Added"}
                                </p>

                                <p className="mt-1 text-[14px] font-medium text-slate-400">
                                  {tx.transactionId ||
                                    tx.id ||
                                    "Transaction"}
                                </p>

                                {tx.paymentMethod && (
                                  <p className="mt-0.5 text-[14px] text-slate-400">
                                    {tx.paymentMethod}
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="px-3 py-5">

                            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[14px] font-black text-blue-600">
                              {tx.category ||
                                "CREDIT"}
                            </span>

                          </td>

                          <td className="px-3 py-5">

                            <p className="text-[14px] font-black text-emerald-600">
                              +{money(tx.amount)}
                            </p>

                            {tx.balanceAfter !==
                              undefined && (
                              <p className="mt-1 text-[14px] text-slate-400">
                                Bal:{" "}
                                {money(
                                  tx.balanceAfter
                                )}
                              </p>
                            )}

                          </td>

                          <td className="px-3 py-5">

                            <span
                              className={`rounded-full border px-3 py-1.5 text-[14px] font-black ${statusClass(
                                tx.status
                              )}`}
                            >
                              {String(
                                tx.status ||
                                  "SUCCESS"
                              )}
                            </span>

                          </td>

                          <td className="px-3 py-5">

                            <p className="text-[14px] font-bold text-slate-600">
                              {formatDate(
                                tx.createdAt
                              )}
                            </p>

                          </td>

                          <td className="px-3 py-5 text-right">

                            <button
                              onClick={() =>
                                setSelected(tx)
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <Eye size={15} />
                            </button>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

            {!loading &&
              filtered.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

                  <p className="text-[14px] font-semibold text-slate-400">
                    Showing {filtered.length} credit transactions
                  </p>

                  <div className="flex items-center gap-2 text-[14px] font-bold text-slate-400">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500"
                    />
                    Secure wallet sync
                  </div>

                </div>
              )}

          </section>

          {/* RIGHT */}

          <aside className="space-y-5">

            {/* SOURCE BREAKDOWN */}

            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(34,110,88,.06)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-black text-[#102d58]">
                    Credit Source Breakdown
                  </h2>

                  <p className="mt-1 text-[14px] text-slate-400">
                    Where your money came from
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                  <BarChart3 size={18} />
                </div>

              </div>

              <div className="mt-6 flex justify-center">

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-[conic-gradient(#14b889_0deg_173deg,#3676ed_173deg_274deg,#9b52e9_274deg_318deg,#f6b51f_318deg_345deg,#ef4d89_345deg_360deg)]">

                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">

                    <p className="text-xl font-black text-[#102d58]">
                      {shortMoney(
                        stats.total
                      )}
                    </p>

                    <p className="text-[14px] text-slate-400">
                      Total Credits
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-6 space-y-3">

                {sourceStats.length ? (
                  sourceStats.map(
                    ([name, amount], i) => (
                      <div
                        key={name}
                        className="flex items-center justify-between"
                      >

                        <div className="flex items-center gap-2">

                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              i === 0
                                ? "bg-emerald-500"
                                : i === 1
                                ? "bg-blue-500"
                                : i === 2
                                ? "bg-purple-500"
                                : i === 3
                                ? "bg-amber-400"
                                : "bg-pink-500"
                            }`}
                          />

                          <span className="text-[13px] font-semibold text-slate-600">
                            {name}
                          </span>

                        </div>

                        <span className="text-[13px] font-black text-slate-700">
                          {shortMoney(
                            Number(amount)
                          )}
                        </span>

                      </div>
                    )
                  )
                ) : (
                  <p className="py-6 text-center text-[13px] text-slate-400">
                    No credit source data
                  </p>
                )}

              </div>

            </section>

            {/* RECENT CREDIT */}

            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(34,110,88,.06)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-black text-[#102d58]">
                    Recent Credit Activity
                  </h2>

                  <p className="mt-1 text-[14px] text-slate-400">
                    Latest money received
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearch("");
                    setSource("ALL");
                    setPeriod("ALL");
                  }}
                  className="text-[13px] font-black text-emerald-600"
                >
                  View All
                </button>

              </div>

              <div className="mt-4 divide-y divide-slate-100">

                {recent.length ? (
                  recent.map(
                    (tx, index) => (
                      <button
                        key={
                          tx.id ||
                          tx.transactionId ||
                          index
                        }
                        onClick={() =>
                          setSelected(tx)
                        }
                        className="flex w-full items-center gap-3 py-3.5 text-left"
                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          {String(
                            tx.description ||
                              ""
                          )
                            .toUpperCase()
                            .includes(
                              "CASHBACK"
                            ) ? (
                            <Gift size={17} />
                          ) : (
                            <Wallet size={17} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-[13px] font-black text-[#172f59]">
                            {tx.description ||
                              tx.category ||
                              "Money Added"}
                          </p>

                          <p className="mt-1 text-[13px] text-slate-400">
                            {formatDate(
                              tx.createdAt
                            )}
                          </p>

                        </div>

                        <p className="whitespace-nowrap text-[13px] font-black text-emerald-600">
                          +{" "}
                          {money(
                            tx.amount
                          )}
                        </p>

                      </button>
                    )
                  )
                ) : (
                  <p className="py-8 text-center text-[13px] text-slate-400">
                    No recent credit activity
                  </p>
                )}

              </div>

            </section>

            {/* MOTIVATIONAL CARD */}

            <section className="relative overflow-hidden rounded-[25px] border border-emerald-100 bg-gradient-to-br from-[#eafff5] via-[#f1fffa] to-[#e5f7ff] p-5">

              <Sparkles
                size={18}
                className="absolute right-5 top-5 text-emerald-300"
              />

              <div className="flex gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <TrendingUp size={20} />
                </div>

                <div>

                  <p className="text-sm font-black text-[#17355f]">
                    Keep Growing
                  </p>

                  <p className="mt-1 text-[14px] leading-5 text-slate-500">
                    Every successful credit adds more power
                    to your financial journey.
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </section>

      </main>

      {/* ================= DETAIL MODAL ================= */}

      {selected && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#071d25]/45 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            onClick={e =>
              e.stopPropagation()
            }
            className="w-full max-w-lg overflow-hidden rounded-[30px] bg-white shadow-[0_30px_100px_rgba(0,0,0,.25)]"
          >

            <div className="bg-gradient-to-br from-[#079a6b] to-[#0bc493] p-6 text-white">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[14px] font-black uppercase tracking-[.18em] text-emerald-100">
                    Credit Transaction
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    {selected.description ||
                      selected.category ||
                      "Money Received"}
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
                +{money(selected.amount)}
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
                value="CREDIT"
              />

              <Detail
                label="Status"
                value={String(
                  selected.status ||
                    "SUCCESS"
                )}
              />

              <Detail
                label="Source"
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
                label="Amount Received"
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
                className="w-full rounded-xl bg-[#102d58] py-3 text-xs font-black text-white"
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

function HeroMini({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/90 bg-white/65 px-3 py-2.5 shadow-sm backdrop-blur">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8faed] text-[#07986c]">
        {icon}
      </div>

      <div>
        <p className="text-[13px] font-black text-[#17355f]">
          {title}
        </p>

        <p className="mt-0.5 text-[13px] font-medium text-slate-500">
          {text}
        </p>
      </div>

    </div>
  );
}

function CreditKPI({
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
    <div className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_32px_rgba(35,110,90,.06)]">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${text}`}
        >
          {icon}
        </div>

        <BarChart3
          size={16}
          className="text-slate-200"
        />

      </div>

      <p className="mt-4 truncate text-2xl font-black text-[#102d58]">
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
    <div className="rounded-xl bg-[#f6faf8] p-3.5">

      <p className="text-[13px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-[13px] font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
}

