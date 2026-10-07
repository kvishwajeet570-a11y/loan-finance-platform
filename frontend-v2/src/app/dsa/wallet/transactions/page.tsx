"use client";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Download,
  FileText,
  LayoutDashboard,
  List,
  LockKeyhole,
  Menu,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type Transaction = {
  id: string;
  transactionId: string;
  referenceId?: string;
  type: "CREDIT" | "DEBIT";
  description: string;
  amount: number;
  paymentMethod: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "PROCESSING";
  createdAt: string;
};

const transactions: Transaction[] = [];

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function DsaWalletTransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const credit = transactions
    .filter((x) => x.type === "CREDIT")
    .reduce((a, b) => a + b.amount, 0);

  const debit = transactions
    .filter((x) => x.type === "DEBIT")
    .reduce((a, b) => a + b.amount, 0);

  const totalVolume = credit + debit;

  const creditPercent =
    totalVolume > 0 ? Math.round((credit / totalVolume) * 100) : 0;

  const debitPercent =
    totalVolume > 0 ? Math.round((debit / totalVolume) * 100) : 0;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return transactions.filter((tx) => {
      if (type !== "ALL" && tx.type !== type) return false;

      if (date && tx.createdAt.slice(0, 10) !== date) return false;

      if (q) {
        return [
          tx.transactionId,
          tx.referenceId,
          tx.type,
          tx.description,
          tx.paymentMethod,
          tx.status,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      }

      return true;
    });
  }, [search, type, date]);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#07183d]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[218px] overflow-hidden bg-[#06172f] text-white lg:block">
        <div className="flex h-[70px] items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Wallet size={22} />
          </div>
          <div>
            <div className="text-[16px] font-black">DSA FINCORP</div>
            <div className="text-[8px] text-blue-300">
              Your Growth, Our Priority
            </div>
          </div>
        </div>

        <div className="px-3 py-5">
          {[
            ["Dashboard", <LayoutDashboard size={18} />],
            ["Leads", <CreditCard size={18} />],
            ["Applications", <FileText size={18} />],
            ["Customers", <List size={18} />],
          ].map(([label, icon]) => (
            <div
              key={String(label)}
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-slate-300"
            >
              {icon}
              {label}
            </div>
          ))}

          <div className="mb-3 mt-6 px-3 text-[10px] font-bold tracking-widest text-slate-500">
            FINANCE
          </div>

          <SideItem icon={<TrendingUp size={18} />} text="Commission" />

          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700">
            <SideItem
              icon={<Wallet size={18} />}
              text="Wallet"
              active
              arrow
            />

            <div className="ml-7 border-l border-white/20 pb-2 pl-2">
              <Sub text="Balance" />
              <Sub text="Transactions" active />
              <Sub text="Statement" />
            </div>
          </div>

          <SideItem icon={<ArrowUpRight size={18} />} text="My Payout" />
          <SideItem icon={<ReceiptText size={18} />} text="Transactions" />
          <SideItem icon={<BarChart3 size={18} />} text="Reports" />

          <div className="mb-3 mt-6 px-3 text-[10px] font-bold tracking-widest text-slate-500">
            SUPPORT
          </div>

          <SideItem icon={<CircleHelp size={18} />} text="Help & Support" />
          <SideItem icon={<Settings size={18} />} text="Settings" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-yellow-300/30 bg-gradient-to-br from-[#122b54] to-[#101a38] p-4">
          <div className="text-center text-2xl">👑</div>
          <div className="mt-1 text-center text-xs font-black text-yellow-200">
            Premium DSA Panel
          </div>
          <div className="mt-1 text-center text-[9px] leading-4 text-slate-300">
            More Loans
            <br />
            More Earnings
            <br />
            More Growth
          </div>
          <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-yellow-300 to-orange-300 py-2 text-[10px] font-black text-slate-900">
            Upgrade Now →
          </button>
        </div>
      </aside>

      {/* MOBILE MENU */}
      {menu && (
        <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden">
          <div className="h-full w-[285px] bg-[#06172f] p-5 text-white">
            <button
              onClick={() => setMenu(false)}
              className="mb-8 ml-auto block rounded-lg bg-white/10 p-2"
            >
              <X size={20} />
            </button>
            <div className="mb-7 text-xl font-black">DSA FINCORP</div>

            {[
              "Dashboard",
              "Leads",
              "Applications",
              "Customers",
              "Commission",
              "Wallet",
              "Balance",
              "Transactions",
              "Statement",
              "My Payout",
              "Reports",
              "Help & Support",
              "Settings",
            ].map((x) => (
              <div
                key={x}
                className={`mb-1 rounded-lg px-4 py-3 text-sm ${
                  x === "Transactions" ? "bg-blue-600" : "text-slate-300"
                }`}
              >
                {x}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="min-h-screen lg:ml-[218px]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenu(true)}
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div className="hidden w-[390px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 sm:flex">
              <Search size={16} className="text-slate-400" />
              <span className="text-xs text-slate-400">
                Search anything...
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-slate-200 bg-white p-2.5">
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-black text-white">
                DS
              </div>
              <div>
                <div className="text-xs font-black">DSA Partner</div>
                <div className="text-[11px] text-slate-400">Active Account</div>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-6">
          {/* HEADER */}
          <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                Home
                <ChevronRight size={11} />
                Finance
                <ChevronRight size={11} />
                Wallet
                <ChevronRight size={11} />
                <b className="text-blue-600">Transactions</b>
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-[42px]">
                Wallet Transactions
              </h1>

              <p className="mt-2 text-base text-slate-500">
                View, track and manage all your wallet transactions in one
                place.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active Wallet
              </span>

              <span className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-[10px] text-slate-500 md:block">
                Last Updated
                <b className="ml-1 text-slate-700">
                  06 Oct 2026, 10:27 AM
                </b>
              </span>

              <button
                onClick={refresh}
                className="rounded-xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-500/20"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* HERO BANNER */}
          <section className="relative mb-5 min-h-[190px] overflow-hidden rounded-[25px] bg-gradient-to-r from-[#0758d9] via-[#154ddd] to-[#741eea] p-6 text-white shadow-[0_20px_60px_rgba(30,80,220,.25)] sm:p-8">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute right-[25%] bottom-[-150px] h-72 w-72 rounded-full bg-cyan-300/10" />

            <div className="relative z-10 grid items-center gap-5 lg:grid-cols-[1.15fr_.8fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                    <ReceiptText size={25} />
                  </div>

                  <div>
                    <div className="text-xs font-black uppercase tracking-[.25em] text-blue-100">
                      DSA WALLET
                    </div>
                    <div className="text-xs font-semibold text-white/75">
                      Transaction Management
                    </div>
                  </div>
                </div>

                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  Wallet Transactions
                </h2>

                <p className="mt-1 max-w-md text-sm text-white/75">
                  View, track and manage your complete wallet activity.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge icon={<ShieldCheck size={12} />} text="Secure & Encrypted" />
                  <Badge icon={<Zap size={12} />} text="Real-time Tracking" />
                  <Badge icon={<CheckCircle2 size={12} />} text="100% Safe" />
                </div>
              </div>

              <div className="relative hidden h-[130px] lg:block">
                <div className="absolute left-10 top-7 h-[82px] w-[125px] rotate-[-5deg] rounded-2xl border-2 border-white/40 bg-gradient-to-br from-cyan-300 to-blue-600 shadow-2xl">
                  <div className="absolute right-4 top-7 h-7 w-10 rounded-lg border-2 border-white/70" />
                  <div className="absolute bottom-4 left-5 h-2 w-12 rounded-full bg-white/30" />
                </div>

                <div className="absolute left-2 top-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-yellow-100 bg-gradient-to-br from-yellow-200 to-orange-500 text-lg font-black text-orange-800 shadow-xl">
                  ₹
                </div>

                <div className="absolute right-5 top-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-yellow-100 bg-gradient-to-br from-yellow-200 to-orange-500 text-lg font-black text-orange-800 shadow-xl">
                  ₹
                </div>

                <div className="absolute bottom-0 right-14 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-xl">
                  <ShieldCheck size={27} />
                </div>
              </div>

              <div className="lg:text-right">
                <div className="text-lg font-black">
                  “Simple • Secure • Always With You”
                </div>
                <div className="mt-1 text-xs text-blue-100">
                  Complete visibility of your financial activity.
                </div>

                <div className="mt-5 flex gap-2 lg:justify-end">
                  <button
                    onClick={refresh}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-blue-700"
                  >
                    <RefreshCw size={14} />
                    Refresh
                  </button>

                  <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-indigo-700">
                    <Download size={14} />
                    Download Statement
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SUMMARY */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Summary
              title="Available Balance"
              value="₹0.00"
              subtitle="Current wallet balance"
              icon={<Wallet />}
              tone="blue"
            />
            <Summary
              title="Total Credit"
              value={money(credit)}
              subtitle="Money received in wallet"
              icon={<ArrowDownLeft />}
              tone="green"
            />
            <Summary
              title="Total Debit"
              value={money(debit)}
              subtitle="Money spent or withdrawn"
              icon={<ArrowUpRight />}
              tone="red"
            />
            <Summary
              title="Total Transactions"
              value={String(transactions.length)}
              subtitle="All wallet transactions"
              icon={<ReceiptText />}
              tone="purple"
            />
          </div>

          {/* MAIN GRID */}
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.72fr]">
            {/* TRANSACTION HISTORY */}
            <section className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6 sm:p-7">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                      <ReceiptText size={19} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black">
                        Transaction History
                      </h2>
                      <p className="text-xs text-slate-400">
                        Your complete wallet activity
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search transactions..."
                        className="h-11 w-[220px] rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-semibold outline-none focus:border-blue-400 focus:bg-white"
                      />
                    </div>

                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black outline-none"
                    >
                      <option value="ALL">All Transactions</option>
                      <option value="CREDIT">Credit</option>
                      <option value="DEBIT">Debit</option>
                    </select>

                    <div className="relative">
                      <CalendarDays
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {["ALL", "CREDIT", "DEBIT"].map((x) => (
                    <button
                      key={x}
                      onClick={() => setType(x)}
                      className={`rounded-full px-5 py-2.5 text-[11px] font-black ${
                        type === x
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {x === "ALL"
                        ? "All Transactions"
                        : x === "CREDIT"
                          ? "Credit"
                          : "Debit"}
                    </button>
                  ))}

                  {["TODAY", "7 DAYS", "30 DAYS", "THIS MONTH", "THIS YEAR"].map(
                    (x) => (
                      <button
                        key={x}
                        onClick={() => setPeriod(x)}
                        className={`rounded-full px-5 py-2.5 text-[11px] font-black ${
                          period === x
                            ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                            : "border border-slate-200 text-slate-500"
                        }`}
                      >
                        {x}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => {
                      setSearch("");
                      setType("ALL");
                      setDate("");
                      setPeriod("ALL");
                    }}
                    className="ml-auto flex items-center gap-1 text-xs font-black text-blue-600"
                  >
                    <RefreshCw size={12} />
                    Reset Filters
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      {[
                        "#",
                        "Transaction ID",
                        "Type",
                        "Description",
                        "Amount",
                        "Payment Method",
                        "Status",
                        "Date",
                        "Action",
                      ].map((x) => (
                        <th
                          key={x}
                          className="px-4 py-3 text-left text-[8px] font-black uppercase tracking-wider text-slate-400"
                        >
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-5 py-24 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-300">
                              <ReceiptText size={38} />
                            </div>

                            <h3 className="mt-5 text-lg font-black">
                              No transactions yet
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-400">
                              Your wallet activity will appear here once you
                              make a transaction.
                            </p>

                            <div className="mt-5 flex gap-2">
                              <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-blue-200">
                                <Plus size={14} />
                                Add Money
                              </button>

                              <button className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-xs font-black text-blue-600">
                                <Wallet size={14} />
                                View Wallet Balance
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((tx, i) => (
                        <tr
                          key={tx.id}
                          className="border-b border-slate-100 hover:bg-blue-50/30"
                        >
                          <td className="px-4 py-4 text-[11px] text-slate-400">
                            {i + 1}
                          </td>
                          <td className="px-4 py-4 text-xs font-black">
                            {tx.transactionId}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1.5 text-[8px] font-black ${
                                tx.type === "CREDIT"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[11px] font-semibold">
                            {tx.description}
                          </td>
                          <td
                            className={`px-4 py-4 text-right text-xs font-black ${
                              tx.type === "CREDIT"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {tx.type === "CREDIT" ? "+" : "-"}
                            {money(tx.amount)}
                          </td>
                          <td className="px-4 py-4 text-[11px] text-slate-500">
                            {tx.paymentMethod}
                          </td>
                          <td className="px-4 py-4 text-[8px] font-black">
                            {tx.status}
                          </td>
                          <td className="px-4 py-4 text-[9px]">
                            {new Date(tx.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => setSelected(tx)}
                              className="rounded-lg bg-blue-50 px-3 py-2 text-[8px] font-black text-blue-600"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <span className="text-[11px] text-slate-400">
                  Showing <b className="text-slate-700">{filtered.length}</b>{" "}
                  transactions
                </span>

                <button className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-black text-blue-600">
                  <Download size={13} />
                  Download Statement
                </button>
              </div>
            </section>

            {/* RIGHT COLUMN */}
            <aside className="space-y-5">
              {/* ANALYTICS */}
              <section className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black">
                      Transaction Analytics
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Overview of your wallet activity
                    </p>
                  </div>

                  <select className="rounded-lg border border-slate-200 px-2 py-2 text-[9px]">
                    <option>This Month</option>
                    <option>Last Month</option>
                  </select>
                </div>

                <div className="mt-5 flex items-center gap-5">
                  <div
                    className="relative flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#1677ff 0 ${creditPercent}%, #ef4444 ${creditPercent}% ${
                        creditPercent + debitPercent
                      }%, #dbe4f0 ${creditPercent + debitPercent}% 100%)`,
                    }}
                  >
                    <div className="absolute inset-[16px] flex flex-col items-center justify-center rounded-full bg-white">
                      <b className="text-base">{money(totalVolume)}</b>
                      <span className="text-[10px] text-slate-400">
                        Total Volume
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Metric label="Credits" value={money(credit)} percent={`${creditPercent}%`} dot="bg-emerald-500" />
                    <Metric label="Debits" value={money(debit)} percent={`${debitPercent}%`} dot="bg-red-500" />
                    <Metric label="Others" value="₹0.00" percent="0%" dot="bg-violet-500" />
                  </div>
                </div>
              </section>

              {/* INSIGHTS */}
              <section className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-black">Wallet Insights</h2>
                    <p className="text-[11px] text-slate-400">
                      Key metrics about your wallet activity
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Insight title="Total Volume" value={money(totalVolume)} />
                  <Insight title="Average Transaction" value="₹0.00" />
                  <Insight title="Credit Transactions" value="0" />
                  <Insight title="Debit Transactions" value="0" />
                </div>

                <div className="mt-2 rounded-xl bg-violet-50 p-3">
                  <div className="flex justify-between text-xs font-black">
                    <span>Success Rate</span>
                    <span>0%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white">
                    <div className="h-full w-0 rounded-full bg-violet-500" />
                  </div>
                </div>
              </section>

              {/* QUICK ACTIONS */}
              <section className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-base font-black">Quick Actions</h2>
                <p className="text-[11px] text-slate-400">
                  Manage your wallet easily
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Quick icon={<Plus />} title="Add Money" sub="Add funds" color="green" />
                  <Quick icon={<ArrowUpRight />} title="Withdraw" sub="Transfer to bank" color="purple" />
                  <Quick icon={<Download />} title="Statement" sub="Download statement" color="blue" />
                  <Quick icon={<Wallet />} title="Balance" sub="Check balance" color="orange" />
                </div>
              </section>

              {/* GROW */}
              <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2449ef] via-[#3831df] to-[#7818e8] p-5 text-white shadow-xl">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />

                <div className="relative">
                  <Sparkles size={20} className="mb-3 text-yellow-300" />

                  <h2 className="text-xl font-black">
                    Grow Your Earnings
                  </h2>

                  <p className="mt-2 text-[10px] leading-4 text-blue-100">
                    Track commissions, manage your wallet and monitor your
                    financial activity from one place.
                  </p>

                  <button className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-blue-700">
                    Explore Wallet
                    <ArrowRight size={13} />
                  </button>
                </div>
              </section>
            </aside>
          </div>

          {/* SECURITY */}
          <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <LockKeyhole size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-800">
                  Your wallet information is securely protected.
                </h3>
                <p className="mt-1 text-[11px] text-emerald-600">
                  Industry-standard encryption keeps your wallet data safe.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-black text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secure Account
              </span>
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={14} className="text-emerald-500" />
                Protected Transactions
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-blue-600" />
                Verified Platform
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Bank-grade Security
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* TRANSACTION MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Transaction Details</h2>
                <p className="text-xs text-slate-400">
                  Complete transaction information
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-slate-100 p-2"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["Transaction ID", selected.transactionId],
                ["Reference ID", selected.referenceId || "—"],
                ["Type", selected.type],
                ["Amount", money(selected.amount)],
                ["Description", selected.description],
                ["Payment Method", selected.paymentMethod],
                ["Status", selected.status],
                [
                  "Date",
                  new Date(selected.createdAt).toLocaleString("en-IN"),
                ],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"
                >
                  <span className="text-[10px] font-semibold text-slate-400">
                    {a}
                  </span>
                  <span className="text-right text-[10px] font-black text-slate-700">
                    {b}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-[10px] font-bold text-emerald-700">
              <ShieldCheck size={15} />
              Transaction secured and verified.
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-black text-white">
              <Download size={15} />
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SideItem({
  icon,
  text,
  active,
  arrow,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  arrow?: boolean;
}) {
  return (
    <div
      className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold ${
        active ? "text-white" : "text-slate-300"
      }`}
    >
      {icon}
      <span className="flex-1">{text}</span>
      {arrow && <ChevronDown size={14} />}
    </div>
  );
}

function Sub({ text, active }: { text: string; active?: boolean }) {
  return (
    <div
      className={`mb-1 rounded-lg px-3 py-2.5 text-[10px] font-bold ${
        active ? "bg-white/15 text-white" : "text-slate-300"
      }`}
    >
      {text}
    </div>
  );
}

function Badge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[8px] font-black backdrop-blur">
      {icon}
      {text}
    </span>
  );
}

function Summary({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: "blue" | "green" | "red" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="group rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${colors[tone]}`}>{icon}</div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black text-emerald-600">
          ↑ +0%
        </span>
      </div>

      <div className="mt-5 text-[11px] font-black uppercase tracking-wider text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-2xl font-black">{value}</div>

      <div className="mt-1 text-[11px] text-slate-400">{subtitle}</div>
    </div>
  );
}

function Metric({
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
    <div>
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <b className="text-[10px]">{value}</b>
        <span className="text-[10px] text-slate-400">{percent}</span>
      </div>
    </div>
  );
}

function Insight({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-[10px] text-slate-400">{title}</div>
      <div className="mt-1 text-sm font-black">{value}</div>
    </div>
  );
}

function Quick({
  icon,
  title,
  sub,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  color: "green" | "purple" | "blue" | "orange";
}) {
  const c = {
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <button className={`rounded-2xl p-4 text-left ${c[color]}`}>
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-white/80 p-2">{icon}</span>
        <span>
          <span className="block text-xs font-black">{title}</span>
          <span className="block text-[10px] opacity-70">{sub}</span>
        </span>
      </div>
    </button>
  );
}

