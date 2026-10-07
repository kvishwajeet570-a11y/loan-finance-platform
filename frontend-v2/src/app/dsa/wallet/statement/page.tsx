"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Filter,
  LockKeyhole,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

type Tx = {
  id: string;
  type: "CREDIT" | "DEBIT";
  description: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  date: string;
  method: string;
};

const transactions: Tx[] = [];

const money = (n: number) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function DsaWalletStatementPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [range, setRange] = useState("Last 30 Days");
  const [menu, setMenu] = useState(false);

  const totalCredit = transactions
    .filter((x) => x.type === "CREDIT")
    .reduce((a, b) => a + b.amount, 0);

  const totalDebit = transactions
    .filter((x) => x.type === "DEBIT")
    .reduce((a, b) => a + b.amount, 0);

  const netBalance = totalCredit - totalDebit;

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase();

    const matchesSearch =
      !q ||
      tx.id.toLowerCase().includes(q) ||
      tx.description.toLowerCase().includes(q) ||
      tx.method.toLowerCase().includes(q);

    const matchesType = type === "ALL" || tx.type === type;
    const matchesStatus = status === "ALL" || tx.status === status;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#071b45]">

      {/* MOBILE MENU */}
      {menu && (
        <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden">
          <div className="h-full w-[285px] bg-[#07172f] p-5 text-white">
            <button
              onClick={() => setMenu(false)}
              className="mb-8 ml-auto block rounded-xl bg-white/10 p-2"
            >
              <X size={20} />
            </button>

            <h2 className="mb-7 text-xl font-black">DSA FINCORP</h2>

            {[
              "Dashboard",
              "Leads",
              "Applications",
              "Customers",
              "Commission",
              "Wallet",
              "Balance",
              "Transaction",
              "Statement",
              "My Payout",
              "Reports",
            ].map((item) => (
              <div
                key={item}
                className={`mb-1 rounded-xl px-4 py-3 text-sm ${
                  item === "Statement"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-[218px] bg-[#07172f] text-white lg:block">

        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
            <Wallet size={21} />
          </div>

          <div>
            <div className="text-[16px] font-black">DSA FINCORP</div>
            <div className="text-[8px] tracking-wider text-blue-300">
              PARTNER PORTAL
            </div>
          </div>
        </div>

        <div className="px-3 py-5">

          {["Dashboard", "Leads", "Applications", "Customers"].map((x) => (
            <div
              key={x}
              className="mb-1 rounded-xl px-3 py-3 text-xs font-semibold text-slate-300"
            >
              {x}
            </div>
          ))}

          <div className="mb-3 mt-6 px-3 text-[9px] font-black tracking-[.2em] text-slate-500">
            FINANCE
          </div>

          <div className="mb-1 rounded-xl px-3 py-3 text-xs text-slate-300">
            Commission
          </div>

          <div className="rounded-xl bg-blue-600/20">

            <div className="flex items-center gap-3 px-3 py-3 text-xs font-bold text-white">
              <Wallet size={17} />
              <span className="flex-1">Wallet</span>
              <ChevronDown size={14} />
            </div>

            <div className="ml-7 border-l border-white/20 pb-2 pl-2">

              <div className="rounded-lg px-3 py-2.5 text-[10px] text-slate-300">
                Balance
              </div>

              <div className="rounded-lg bg-white/15 px-3 py-2.5 text-[10px] font-black text-white">
                Statement
              </div>

              <div className="rounded-lg px-3 py-2.5 text-[10px] text-slate-300">
                Transaction
              </div>

            </div>
          </div>

          {["My Payout", "Transactions", "Reports"].map((x) => (
            <div
              key={x}
              className="mb-1 rounded-xl px-3 py-3 text-xs font-semibold text-slate-300"
            >
              {x}
            </div>
          ))}

          <div className="mb-3 mt-6 px-3 text-[9px] font-black tracking-[.2em] text-slate-500">
            SUPPORT
          </div>

          <div className="rounded-xl px-3 py-3 text-xs text-slate-300">
            Help & Support
          </div>

          <div className="rounded-xl px-3 py-3 text-xs text-slate-300">
            Settings
          </div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="min-h-screen lg:ml-[218px]">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMenu(true)}
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div className="hidden w-[330px] items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 sm:flex">
              <Search size={16} className="text-slate-400" />
              <span className="text-xs text-slate-400">
                Search anything...
              </span>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <div className="text-xs font-black">DSA Partner</div>
              <div className="text-[9px] text-emerald-500">
                ● Active Account
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-black text-white">
              DS
            </div>

          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6">

          {/* HEADER */}
          <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
                Home
                <ChevronRight size={12} />
                Finance
                <ChevronRight size={12} />
                Wallet
                <ChevronRight size={12} />
                <b className="text-blue-600">Statement</b>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-[42px]">
                Wallet Statement
              </h1>

              <p className="mt-2 text-base text-slate-500">
                View, filter and download your complete DSA wallet statement.
              </p>

            </div>

            <div className="flex gap-2">

              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-600">
                <RefreshCw size={15} />
                Refresh
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-blue-200"
              >
                <Download size={15} />
                Export PDF
              </button>

            </div>

          </div>

          {/* HERO */}
          <section className="relative mb-6 overflow-hidden rounded-[26px] bg-gradient-to-r from-[#0758d9] via-[#3049dc] to-[#771eea] p-6 text-white shadow-[0_20px_60px_rgba(30,80,220,.22)] sm:p-8">

            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10" />

            <div className="relative grid gap-6 lg:grid-cols-[1.2fr_.8fr]">

              <div>

                <div className="flex items-center gap-3">

                  <div className="rounded-2xl bg-white/15 p-3">
                    <FileText size={25} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black tracking-[.25em] text-blue-100">
                      DSA WALLET
                    </div>
                    <div className="text-sm text-white/70">
                      Financial Statement
                    </div>
                  </div>

                </div>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  Complete Wallet Statement
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                  Track your credits, debits, wallet balance and complete
                  financial activity from one secure statement.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                  <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold">
                    ✓ Secure Statement
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold">
                    ✓ Verified Transactions
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold">
                    ✓ Download Anytime
                  </span>

                </div>

              </div>

              <div className="hidden items-center justify-center lg:flex">

                <div className="relative h-36 w-52 rotate-[-4deg] rounded-3xl border border-white/30 bg-white/15 p-5 shadow-2xl backdrop-blur">

                  <div className="text-[9px] font-bold text-white/60">
                    CURRENT BALANCE
                  </div>

                  <div className="mt-3 text-3xl font-black">
                    ₹0.00
                  </div>

                  <div className="absolute bottom-4 left-5 h-2 w-16 rounded-full bg-white/30" />

                  <div className="absolute right-5 top-5 rounded-xl bg-white/15 p-2">
                    <ShieldCheck size={21} />
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* FILTERS */}
          <section className="mb-6 rounded-[24px] border border-slate-100 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Filter size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    Statement Filters
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select the period and transaction details you want to view.
                  </p>
                </div>

              </div>

            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">

              <FilterField
                label="From Date"
                value="01 Aug 2026"
                icon={<CalendarDays size={16} />}
              />

              <FilterField
                label="To Date"
                value="06 Oct 2026"
                icon={<CalendarDays size={16} />}
              />

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Transaction Type
                </label>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-blue-400"
                >
                  <option value="ALL">All Transactions</option>
                  <option value="CREDIT">Credit</option>
                  <option value="DEBIT">Debit</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-blue-400"
                >
                  <option value="ALL">All Status</option>
                  <option value="SUCCESS">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setType("ALL");
                  setStatus("ALL");
                  setRange("Last 30 Days");
                }}
                className="mt-auto flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-black text-white shadow-lg shadow-blue-100"
              >
                <Filter size={15} />
                Apply Filter
              </button>

            </div>

            <div className="flex flex-wrap gap-2 px-6 pb-6">

              {["Today", "7 Days", "30 Days", "This Month", "This Year"].map(
                (x) => (
                  <button
                    key={x}
                    onClick={() => setRange(x)}
                    className={`rounded-full px-5 py-2.5 text-[10px] font-black ${
                      range === x
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {x}
                  </button>
                )
              )}

            </div>

          </section>

          {/* KPI */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Kpi
              title="Total Credits"
              value={money(totalCredit)}
              subtitle="Money added to wallet"
              icon={<ArrowDownLeft />}
              color="green"
            />

            <Kpi
              title="Total Debits"
              value={money(totalDebit)}
              subtitle="Money spent or withdrawn"
              icon={<ArrowUpRight />}
              color="red"
            />

            <Kpi
              title="Net Balance"
              value={money(netBalance)}
              subtitle="Current available balance"
              icon={<Wallet />}
              color="blue"
            />

            <Kpi
              title="Total Transactions"
              value={String(transactions.length)}
              subtitle="In selected statement"
              icon={<FileText />}
              color="purple"
            />

          </div>

          {/* CONTENT */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_.72fr]">

            {/* STATEMENT TABLE */}
            <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                  <div>
                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <FileText size={20} />
                      </div>

                      <div>
                        <h2 className="text-xl font-black">
                          Statement Details
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                          Showing {filtered.length} transactions
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="flex gap-2">

                    <div className="relative">

                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search transactions..."
                        className="h-11 w-[230px] rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold outline-none focus:border-blue-400 focus:bg-white"
                      />

                    </div>

                    <button
                      onClick={() => window.print()}
                      className="flex h-11 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-xs font-black text-blue-600"
                    >
                      <Download size={15} />
                      Export
                    </button>

                  </div>

                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px]">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50/70">

                      {[
                        "#",
                        "Date & Time",
                        "Transaction ID",
                        "Description",
                        "Type",
                        "Amount",
                        "Status",
                      ].map((x) => (
                        <th
                          key={x}
                          className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400"
                        >
                          {x}
                        </th>
                      ))}

                    </tr>

                  </thead>

                  <tbody>

                    {filtered.length === 0 ? (

                      <tr>

                        <td colSpan={7} className="px-6 py-28 text-center">

                          <div className="mx-auto max-w-md">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-300">
                              <FileText size={38} />
                            </div>

                            <h3 className="mt-6 text-xl font-black">
                              No transactions yet
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              Your wallet transactions will appear here once
                              activity is recorded.
                            </p>

                            {(search ||
                              type !== "ALL" ||
                              status !== "ALL") && (
                              <button
                                onClick={() => {
                                  setSearch("");
                                  setType("ALL");
                                  setStatus("ALL");
                                }}
                                className="mt-5 rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-black text-slate-600"
                              >
                                Clear Filters
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    ) : (

                      filtered.map((tx, index) => {

                        const credit = tx.type === "CREDIT";

                        return (
                          <tr
                            key={tx.id}
                            className="border-b border-slate-100 transition hover:bg-blue-50/30"
                          >

                            <td className="px-5 py-5 text-xs font-bold text-slate-400">
                              {index + 1}
                            </td>

                            <td className="px-4 py-5">
                              <div className="text-xs font-black">
                                {tx.date}
                              </div>
                            </td>

                            <td className="px-4 py-5">
                              <div className="max-w-[150px] truncate text-xs font-black">
                                {tx.id}
                              </div>
                            </td>

                            <td className="px-4 py-5">
                              <div className="flex items-center gap-3">

                                <div
                                  className={`rounded-xl p-2.5 ${
                                    credit
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {credit ? (
                                    <ArrowDownLeft size={16} />
                                  ) : (
                                    <ArrowUpRight size={16} />
                                  )}
                                </div>

                                <div>
                                  <div className="text-xs font-black">
                                    {tx.description}
                                  </div>

                                  <div className="mt-1 text-[10px] text-slate-400">
                                    {tx.method}
                                  </div>
                                </div>

                              </div>
                            </td>

                            <td className="px-4 py-5">

                              <span
                                className={`rounded-lg px-3 py-2 text-[10px] font-black ${
                                  credit
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {credit ? "Credit" : "Debit"}
                              </span>

                            </td>

                            <td className="px-4 py-5 text-right">

                              <div
                                className={`text-sm font-black ${
                                  credit
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {credit ? "+" : "-"}
                                {money(tx.amount)}
                              </div>

                            </td>

                            <td className="px-4 py-5">

                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black ${
                                  tx.status === "SUCCESS"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : tx.status === "PENDING"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-red-50 text-red-700"
                                }`}
                              >
                                <CheckCircle2 size={12} />
                                {tx.status}
                              </span>

                            </td>

                          </tr>
                        );
                      })

                    )}

                  </tbody>

                </table>

              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">

                <p className="text-xs text-slate-400">
                  Showing{" "}
                  <b className="text-slate-700">{filtered.length}</b>{" "}
                  transactions
                </p>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-black text-blue-600"
                >
                  <Download size={14} />
                  Download Statement
                </button>

              </div>

            </section>

            {/* RIGHT */}
            <aside className="space-y-6">

              {/* BALANCE TREND */}
              <section className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <BarChart3 size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black">
                      Balance Trend
                    </h2>
                    <p className="text-xs text-slate-400">
                      Wallet balance overview
                    </p>
                  </div>

                </div>

                <div className="relative mt-6 h-[190px] overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50 to-white">

                  {[0, 1, 2, 3].map((x) => (
                    <div
                      key={x}
                      className="absolute left-0 right-0 border-t border-dashed border-slate-200"
                      style={{ top: `${20 + x * 20}%` }}
                    />
                  ))}

                  <svg
                    viewBox="0 0 500 190"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >

                    <defs>

                      <linearGradient
                        id="dsaStatementArea"
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
                      d="M0 145 C55 125 80 140 120 105 C165 65 195 115 230 92 C270 62 305 105 335 75 C375 38 410 72 445 45 C470 30 490 35 500 20 L500 190 L0 190 Z"
                      fill="url(#dsaStatementArea)"
                    />

                    <path
                      d="M0 145 C55 125 80 140 120 105 C165 65 195 115 230 92 C270 62 305 105 335 75 C375 38 410 72 445 45 C470 30 490 35 500 20"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                  </svg>

                  <div className="absolute right-3 top-3 rounded-xl bg-[#172c78] px-3 py-2 text-xs font-black text-white shadow-lg">
                    ₹0.00
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[9px] font-bold text-slate-400">
                    <span>Aug 01</span>
                    <span>Aug 15</span>
                    <span>Aug 30</span>
                    <span>Sep 15</span>
                    <span>Oct 06</span>
                  </div>

                </div>

              </section>

              {/* INSIGHTS */}
              <section className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black">
                      Statement Insights
                    </h2>
                    <p className="text-xs text-slate-400">
                      Your wallet activity insights
                    </p>
                  </div>

                </div>

                <div className="mt-5 space-y-1">

                  <Insight
                    title="Highest Credit"
                    value={money(totalCredit)}
                    icon={<ArrowDownLeft size={16} />}
                    cls="bg-emerald-50 text-emerald-600"
                  />

                  <Insight
                    title="Highest Debit"
                    value={money(totalDebit)}
                    icon={<ArrowUpRight size={16} />}
                    cls="bg-red-50 text-red-600"
                  />

                  <Insight
                    title="Total Transactions"
                    value={String(transactions.length)}
                    icon={<FileText size={16} />}
                    cls="bg-blue-50 text-blue-600"
                  />

                  <Insight
                    title="Average Transaction"
                    value="₹0.00"
                    icon={<TrendingUp size={16} />}
                    cls="bg-purple-50 text-purple-600"
                  />

                </div>

              </section>

              {/* OFFER */}
              <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#eee9ff] via-[#f7efff] to-[#e5ecff] p-6">

                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-purple-300/20" />

                <div className="relative z-10 max-w-[230px]">

                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-purple-600">
                    <Sparkles size={13} />
                    DSA Benefits
                  </div>

                  <h2 className="mt-4 text-2xl font-black leading-tight">
                    Grow Your
                    <br />
                    <span className="text-purple-600">
                      Wallet Earnings
                    </span>
                  </h2>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Track your commissions, wallet activity and financial
                    performance from one place.
                  </p>

                  <button className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-xs font-black text-white shadow-lg">
                    Explore Wallet
                  </button>

                </div>

              </section>

            </aside>

          </div>

          {/* DOWNLOAD */}
          <section className="mt-6 flex flex-col gap-5 rounded-[24px] border border-blue-100 bg-gradient-to-r from-[#eef4ff] via-white to-[#f2ecff] p-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <ShieldCheck size={28} className="text-blue-600" />
              </div>

              <div>
                <h3 className="text-base font-black">
                  Need a Detailed Statement?
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Print or save your wallet statement for your records.
                </p>
              </div>

            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-xs font-black text-white shadow-lg"
            >
              <Download size={16} />
              Download Full Statement
            </button>

          </section>

          {/* SECURITY */}
          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <LockKeyhole size={20} />
              </div>

              <div>
                <p className="text-sm font-black text-emerald-800">
                  Your wallet statement is securely protected.
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                  Your financial activity is protected by secure platform controls.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500">

              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secure Account
              </span>

              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-600" />
                Trusted Platform
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Verified
              </span>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

function Kpi({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: "green" | "red" | "blue" | "purple";
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-[21px] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className={`rounded-xl p-3 ${styles[color]}`}>
          {icon}
        </div>

        <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[9px] font-black text-slate-500">
          LIVE
        </span>

      </div>

      <div className="mt-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-2xl font-black">
        {value}
      </div>

      <div className="mt-1 text-[11px] text-slate-400">
        {subtitle}
      </div>

    </div>
  );
}

function FilterField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-600">
        <span className="text-blue-500">{icon}</span>
        {value}
      </div>
    </div>
  );
}

function Insight({
  title,
  value,
  icon,
  cls,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  cls: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3.5 last:border-0">

      <div className="flex items-center gap-3">

        <div className={`rounded-xl p-2.5 ${cls}`}>
          {icon}
        </div>

        <span className="text-xs font-bold text-slate-600">
          {title}
        </span>

      </div>

      <span className="text-sm font-black">
        {value}
      </span>

    </div>
  );
}

