"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Wallet,
  X,
  Zap,
  Smartphone,
  Car,
  ReceiptText,
  Send,
  CreditCard,
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

const CREDIT_TYPES = [
  "CREDIT",
  "CR",
  "DEPOSIT",
  "REFUND",
  "CASHBACK",
  "REWARD",
];

const isDebit = (t: Transaction) =>
  !CREDIT_TYPES.includes(
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

const getDebitIcon = (t: Transaction) => {
  const text = `${t.category || ""} ${
    t.description || ""
  }`.toUpperCase();

  if (
    text.includes("RECHARGE") ||
    text.includes("MOBILE")
  )
    return <Smartphone size={19} />;

  if (
    text.includes("FASTAG") ||
    text.includes("VEHICLE") ||
    text.includes("TOLL")
  )
    return <Car size={19} />;

  if (
    text.includes("LOAN") ||
    text.includes("EMI")
  )
    return <CreditCard size={19} />;

  if (
    text.includes("TRANSFER") ||
    text.includes("BANK")
  )
    return <Send size={19} />;

  if (
    text.includes("BILL") ||
    text.includes("PAYMENT")
  )
    return <ReceiptText size={19} />;

  return <ArrowUpRight size={19} />;
};

export default function DebitTransactionsPage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("ALL");
  const [category, setCategory] = useState("ALL");

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
          ? txData.filter(isDebit)
          : []
      );
    } catch (error: any) {
      console.error(
        "Debit Transactions:",
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

    return {
      count: transactions.length,
      total,
      thisMonth,
      successRate: transactions.length
        ? Math.round(
            (successful /
              transactions.length) *
              100
          )
        : 0,
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

    if (category !== "ALL") {
      list = list.filter(t => {
        const text =
          `${t.category || ""} ${
            t.description || ""
          }`.toUpperCase();

        return text.includes(
          category
        );
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
    category,
    search,
  ]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};

    transactions.forEach(t => {
      const raw =
        `${t.category || ""} ${
          t.description || ""
        }`.toUpperCase();

      let key = "Other";

      if (
        raw.includes("LOAN") ||
        raw.includes("EMI")
      ) {
        key = "Loan EMI";
      } else if (
        raw.includes("BILL") ||
        raw.includes("ELECTRICITY") ||
        raw.includes("PAYMENT")
      ) {
        key = "Bill Payments";
      } else if (
        raw.includes("RECHARGE") ||
        raw.includes("MOBILE")
      ) {
        key = "Recharges";
      } else if (
        raw.includes("TRANSFER") ||
        raw.includes("BANK")
      ) {
        key = "Money Transfer";
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
        .slice(0, 5),
    [transactions]
  );

  const exportCSV = () => {
    if (!filtered.length) return;

    const rows = [
      [
        "Transaction ID",
        "Date",
        "Description",
        "Category",
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
      "debit-transactions.csv";

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
    <div className="min-h-screen bg-[#f3f7ff] text-[#102b63]">

      <DsaSidebar />

      <div className="lg:pl-[278px]">
      <main className="mx-auto max-w-[1550px] px-4 py-5 sm:px-6 lg:px-8">

        {/* =====================================================
            DEBIT HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e8f0ff] via-[#eef1ff] to-[#eee5ff] shadow-[0_25px_70px_rgba(61,91,170,.13)]">

          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/80 blur-3xl" />

          <div className="absolute right-[-100px] bottom-[-130px] h-96 w-96 rounded-full bg-blue-300/25 blur-3xl" />

          <div className="absolute right-[35%] top-[-100px] h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="relative grid min-h-[390px] lg:grid-cols-[1fr_540px]">

            {/* LEFT */}

            <div className="p-7 sm:p-9 lg:p-11">

              <div className="flex items-center gap-2 text-[12px] font-bold text-[#65769a]">
                <span>Dashboard</span>
                <ChevronRight size={13} />
                <span>Transactions</span>
                <ChevronRight size={13} />
                <span className="text-[#155eef]">
                  Debit Transactions
                </span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[12px] font-black tracking-wide text-red-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
                  ↓
                </span>
                DEBIT TRANSACTIONS
              </div>

              <h1 className="mt-5 max-w-[780px] text-4xl font-black tracking-tight text-[#0a285d] sm:text-5xl lg:text-[57px] lg:leading-[1.03]">

                Spend Smart,{" "}

                <span className="bg-gradient-to-r from-[#155eef] via-[#315df0] to-[#7549e8] bg-clip-text text-transparent">
                  Stay in Control!
                </span>

              </h1>

              <p className="mt-4 text-lg font-black text-[#102e61] sm:text-xl">
                Track all your debit transactions in one place.
              </p>

              <p className="mt-2 max-w-[710px] text-[15px] leading-7 text-[#53688e]">
                Every payment, recharge, loan EMI, transfer and
                money-out activity — secure, transparent and
                always available for smarter financial control.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">

                <HeroFeature
                  icon={<Zap size={18} />}
                  title="Instant Updates"
                  text="Real-time tracking"
                />

                <HeroFeature
                  icon={<ShieldCheck size={18} />}
                  title="100% Secure"
                  text="Your data is protected"
                />

                <HeroFeature
                  icon={<Activity size={18} />}
                  title="Complete History"
                  text="All your debits at one place"
                />

              </div>

            </div>

            {/* RIGHT AI ART */}

            <div className="relative min-h-[360px] overflow-hidden">

              {/* PAYMENT SENT CARD */}

              <div className="absolute left-[2%] top-[42px] z-30 rotate-[-9deg] rounded-[18px] border border-white bg-white/95 px-5 py-3 shadow-[0_20px_40px_rgba(39,77,166,.18)] backdrop-blur">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-slate-500">
                      Payment Sent
                    </p>

                    <p className="text-lg font-black text-[#102e5d]">
                      - ₹2,500
                    </p>
                  </div>

                </div>

              </div>

              <Sparkles
                size={22}
                className="absolute right-[44%] top-[27px] text-white"
              />

              <Sparkles
                size={14}
                className="absolute right-[22%] top-[67px] text-blue-300"
              />

              {/* DECORATIVE LEAVES */}

              <div className="absolute left-[20%] top-[138px]">

                <div className="h-20 w-10 rotate-[-30deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#428ff4] to-[#155eef]" />

                <div className="ml-8 mt-[-37px] h-16 w-8 rotate-[31deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#78b6ff] to-[#4c78e9]" />

              </div>

              {/* WALLET */}

              <div className="absolute left-[30%] top-[91px] h-[195px] w-[260px]">

                <div className="absolute left-[32px] top-[45px] h-[119px] w-[195px] rotate-[-8deg] rounded-[26px] border-[5px] border-[#174fd5] bg-gradient-to-br from-[#2869ed] via-[#155eef] to-[#4b3ed1] shadow-[0_28px_48px_rgba(35,79,185,.35)]">

                  <div className="absolute right-[18px] top-[20px] h-9 w-9 rounded-full border border-white/30 bg-white/15" />

                  <div className="absolute bottom-[19px] left-[20px] h-2.5 w-16 rounded-full bg-white/35" />

                  <div className="absolute bottom-[19px] right-[20px] h-2.5 w-10 rounded-full bg-white/25" />

                </div>

                {/* BLUE CARD */}

                <div className="absolute left-[70px] top-[12px] h-[120px] w-[106px] rotate-[28deg] rounded-[20px] border-2 border-white/45 bg-gradient-to-br from-[#378cf4] to-[#155eef] shadow-[0_20px_38px_rgba(36,79,175,.27)]">

                  <div className="absolute left-4 top-4 h-9 w-11 rounded-md bg-white/20" />

                  <div className="absolute bottom-4 left-4 h-2 w-12 rounded-full bg-white/30" />

                </div>

                {/* PURPLE CARD */}

                <div className="absolute right-[0px] top-[58px] h-[94px] w-[100px] rotate-[20deg] rounded-[18px] border-2 border-white/45 bg-gradient-to-br from-[#8258ed] to-[#4935c2] shadow-[0_20px_38px_rgba(57,42,158,.28)]">

                  <div className="absolute right-4 top-4 h-7 w-7 rounded-full bg-white/15" />

                  <div className="absolute bottom-4 left-4 h-2 w-11 rounded-full bg-white/30" />

                </div>

                {/* RUPEE COINS */}

                <div className="absolute bottom-[-5px] left-[10px] flex h-[63px] w-[63px] rotate-[-10deg] items-center justify-center rounded-full border-[5px] border-[#f3c45d] bg-gradient-to-br from-[#ffd15b] to-[#e99721] text-[25px] font-black text-white shadow-[0_16px_28px_rgba(206,137,26,.30)]">
                  ₹
                </div>

                <div className="absolute bottom-[-8px] right-[10px] flex h-[51px] w-[51px] rotate-[13deg] items-center justify-center rounded-full border-[4px] border-[#f4c35c] bg-gradient-to-br from-[#ffd76b] to-[#ed9520] text-xl font-black text-white shadow-lg">
                  ₹
                </div>

              </div>

              {/* PLAN CONTROL SAVE */}

              <div className="absolute right-[7%] top-[48px] rotate-[-7deg] text-[#182d83]">

                <p className="text-[19px] font-black italic">
                  Plan
                </p>

                <p className="text-[19px] font-black italic">
                  Control
                </p>

                <p className="text-[19px] font-black italic">
                  Save
                </p>

              </div>

              <div className="absolute right-[14%] top-[115px] h-12 w-14 rotate-[37deg] border-b-2 border-l-2 border-[#182d83]" />

              {/* TOTAL MONEY OUT */}

              <div className="absolute bottom-[28px] right-[4%] z-40 w-[290px] rounded-[24px] border border-white/90 bg-white/95 p-5 shadow-[0_22px_50px_rgba(39,77,166,.18)] backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <ArrowUpRight size={19} />
                  </div>

                  <p className="text-[13px] font-black text-[#17335f]">
                    Total Money Out
                  </p>

                </div>

                <p className="mt-3 text-3xl font-black text-[#102d58]">
                  {money(stats.total)}
                </p>

                <div className="mt-2 inline-flex rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-600">
                  ↓ {stats.thisMonth > 0 ? "Active" : "0"} this month
                </div>

                <p className="mt-3 text-[11px] font-medium italic text-[#596a8d]">
                  “Every smart expense takes you closer to a better tomorrow.”
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* ================= KPI ================= */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <DebitKPI
            icon={<Wallet size={22} />}
            value={String(stats.count)}
            label="Total Debit Transactions"
            bg="bg-red-100"
            text="text-red-600"
          />

          <DebitKPI
            icon={<ArrowUpRight size={22} />}
            value={money(stats.total)}
            label="Total Amount Spent"
            bg="bg-rose-100"
            text="text-rose-600"
          />

          <DebitKPI
            icon={<CalendarDays size={22} />}
            value={money(stats.thisMonth)}
            label="This Month"
            bg="bg-purple-100"
            text="text-purple-600"
          />

          <DebitKPI
            icon={<TrendingDown size={22} />}
            value={`${stats.successRate}%`}
            label="Successful Debits"
            bg="bg-emerald-100"
            text="text-emerald-600"
          />

        </section>

        {/* ================= CONTENT ================= */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_365px]">

          {/* TABLE */}

          <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(40,70,130,.06)]">

            <div className="border-b border-slate-100 p-5">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-xl font-black text-[#102d58]">
                    Debit Transaction History
                  </h2>

                  <p className="mt-1 text-[12px] text-slate-400">
                    Showing all payments, recharges, loan
                    disbursements and debit entries
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={exportCSV}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  >
                    <Download size={15} />
                    Download
                  </button>

                  <select
                    value={period}
                    onChange={e =>
                      setPeriod(e.target.value)
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-600"
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
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600"
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

              {/* SEARCH */}

              <div className="mt-4 flex flex-col gap-3 lg:flex-row">

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
                    placeholder="Search by transaction ID, description, category..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-[#f8faff] pl-11 pr-4 text-[13px] font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[12px] font-black text-slate-600">
                  <Filter size={16} />
                  Filters
                </button>

              </div>

              {/* CATEGORY PILLS */}

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

                {[
                  ["ALL", "All"],
                  ["PAYMENT", "Payment"],
                  ["RECHARGE", "Recharge"],
                  ["LOAN", "Loan"],
                  ["TRANSFER", "Transfer"],
                  ["OTHER", "Other"],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setCategory(value)
                      }
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-black transition ${
                        category === value
                          ? "bg-[#155eef] text-white shadow-lg shadow-blue-100"
                          : "bg-[#f2f6fc] text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* TRANSACTION TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[930px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-[#fbfcff] text-left text-[10px] font-black uppercase tracking-wider text-slate-400">

                    <th className="px-5 py-4">
                      #
                    </th>

                    <th className="px-3 py-4">
                      Details
                    </th>

                    <th className="px-3 py-4">
                      Category
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
                          size={26}
                          className="mx-auto animate-spin text-blue-500"
                        />

                        <p className="mt-4 text-sm font-bold text-slate-400">
                          Loading debit transactions...
                        </p>
                      </td>
                    </tr>
                  ) : !filtered.length ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-20 text-center"
                      >

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                          <ArrowUpRight size={29} />
                        </div>

                        <p className="mt-4 text-base font-black text-slate-600">
                          No debit transactions found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Your payments and money-out activity will appear here.
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
                          className="group border-b border-slate-50 transition hover:bg-[#f7f9ff]"
                        >

                          <td className="px-5 py-5 text-[11px] font-bold text-slate-300">
                            {index + 1}
                          </td>

                          <td className="px-3 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                {getDebitIcon(tx)}
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[260px] truncate text-[13px] font-black text-[#142f58]">
                                  {tx.description ||
                                    tx.category ||
                                    "Wallet Payment"}
                                </p>

                                <p className="mt-1 text-[10px] font-medium text-slate-400">
                                  {tx.transactionId ||
                                    tx.id ||
                                    "Transaction"}
                                </p>

                                {tx.paymentMethod && (
                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    {tx.paymentMethod}
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="px-3 py-5">

                            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-black text-blue-600">
                              {tx.category ||
                                "PAYMENT"}
                            </span>

                          </td>

                          <td className="px-3 py-5">

                            <p className="text-[14px] font-black text-red-500">
                              -{money(tx.amount)}
                            </p>

                            {tx.balanceAfter !==
                              undefined && (
                              <p className="mt-1 text-[10px] text-slate-400">
                                Bal:{" "}
                                {money(
                                  tx.balanceAfter
                                )}
                              </p>
                            )}

                          </td>

                          <td className="px-3 py-5">

                            <span
                              className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${statusClass(
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

                            <p className="text-[11px] font-bold text-slate-600">
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
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
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

                  <p className="text-[10px] font-semibold text-slate-400">
                    Showing {filtered.length} debit transactions
                  </p>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500"
                    />
                    Secure wallet sync
                  </div>

                </div>
              )}

          </section>

          {/* ================= RIGHT SIDEBAR ================= */}

          <aside className="space-y-5">

            {/* CATEGORY BREAKDOWN */}

            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(40,70,130,.06)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-black text-[#102d58]">
                    Debit Category Breakdown
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Where your money is going
                  </p>
                </div>

                <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-600">
                  <option>
                    This Month
                  </option>
                  <option>
                    All Time
                  </option>
                </select>

              </div>

              <div className="mt-6 flex justify-center">

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-[conic-gradient(#ef476f_0deg_108deg,#3b82f6_108deg_195deg,#9747e8_195deg_260deg,#f5b335_260deg_318deg,#13ad84_318deg_360deg)]">

                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">

                    <p className="text-xl font-black text-[#102d58]">
                      {shortMoney(
                        stats.total
                      )}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Total Debits
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-6 space-y-3">

                {categoryData.length ? (
                  categoryData.map(
                    ([name, amount], i) => (
                      <div
                        key={name}
                        className="flex items-center justify-between"
                      >

                        <div className="flex items-center gap-2.5">

                          <span
                            className={`h-3 w-3 rounded-full ${
                              i === 0
                                ? "bg-[#ef476f]"
                                : i === 1
                                ? "bg-blue-500"
                                : i === 2
                                ? "bg-purple-500"
                                : i === 3
                                ? "bg-amber-400"
                                : "bg-emerald-500"
                            }`}
                          />

                          <span className="text-[11px] font-semibold text-slate-600">
                            {name}
                          </span>

                        </div>

                        <span className="text-[11px] font-black text-slate-700">
                          {shortMoney(
                            Number(amount)
                          )}
                        </span>

                      </div>
                    )
                  )
                ) : (
                  <p className="py-6 text-center text-[11px] text-slate-400">
                    No debit category data
                  </p>
                )}

              </div>

            </section>

            {/* RECENT DEBIT */}

            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(40,70,130,.06)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-black text-[#102d58]">
                    Recent Debit Activity
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Latest money-out activity
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("ALL");
                    setPeriod("ALL");
                  }}
                  className="text-[11px] font-black text-blue-600"
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

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          {getDebitIcon(tx)}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-[11px] font-black text-[#172f59]">
                            {tx.description ||
                              tx.category ||
                              "Payment"}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-400">
                            {formatDate(
                              tx.createdAt
                            )}
                          </p>

                        </div>

                        <p className="whitespace-nowrap text-[11px] font-black text-red-500">
                          -{" "}
                          {money(
                            tx.amount
                          )}
                        </p>

                      </button>
                    )
                  )
                ) : (
                  <p className="py-8 text-center text-[11px] text-slate-400">
                    No recent debit activity
                  </p>
                )}

              </div>

            </section>

            {/* SECURITY BANNER */}

            <section className="relative overflow-hidden rounded-[25px] border border-blue-100 bg-gradient-to-br from-[#eaf2ff] via-[#f1f4ff] to-[#e9e2ff] p-5">

              <Sparkles
                size={18}
                className="absolute right-5 top-5 text-blue-300"
              />

              <div className="flex gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>

                <div>

                  <p className="text-sm font-black text-[#17355f]">
                    Safe. Secure. Transparent.
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    All your debit transactions are protected
                    and organized for smarter spending decisions.
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </section>

        {/* ================= BOTTOM CONTROL STRIP ================= */}

        <section className="mt-5 overflow-hidden rounded-[25px] border border-blue-100 bg-gradient-to-r from-[#e8f1ff] via-[#edf3ff] to-[#efe8ff]">

          <div className="grid md:grid-cols-2">

            <div className="flex items-center gap-4 p-5 sm:p-6">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-[14px] font-black text-[#17355f]">
                  Safe. Secure. Transparent.
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Your debit transactions are encrypted and protected.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 border-t border-blue-100 p-5 md:border-l md:border-t-0 sm:p-6">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <TrendingDown size={22} />
              </div>

              <div className="flex-1">

                <p className="text-[14px] font-black text-[#17355f]">
                  Manage Your Spending Better
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Keep track, stay in control, and build a stronger financial future.
                </p>

              </div>

              <button
                onClick={() =>
                  router.push(
                    "/dsa/wallet/balance"
                  )
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm hover:bg-blue-50"
              >
                <ChevronRight size={19} />
              </button>

            </div>

          </div>

        </section>

      </main>
      </div>

      {/* ================= DETAIL MODAL ================= */}

      {selected && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#07142f]/50 p-4 backdrop-blur-sm"
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

            <div className="bg-gradient-to-br from-[#155eef] to-[#7148ed] p-6 text-white">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-blue-100">
                    Debit Transaction
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    {selected.description ||
                      selected.category ||
                      "Money Spent"}
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
                -{money(
                  selected.amount
                )}
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
                value="DEBIT"
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
                label="Amount Spent"
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
                className="w-full rounded-xl bg-[#102d58] py-3.5 text-[12px] font-black text-white"
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

function HeroFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/90 bg-white/70 px-3.5 py-3 shadow-sm backdrop-blur">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-black text-[#17355f]">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
          {text}
        </p>
      </div>

    </div>
  );
}

function DebitKPI({
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
    <div className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_32px_rgba(40,70,130,.06)]">

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

      <p className="mt-1 text-[11px] font-semibold text-slate-400">
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
    <div className="rounded-xl bg-[#f6f8fc] p-3.5">

      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-[11px] font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
}

