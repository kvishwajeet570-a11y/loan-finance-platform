"use client";

import React from "react";
import Link from "next/link";
import {
  Wallet,
  IndianRupee,
  Coins,
  Clock3,
  BadgeCheck,
  Crown,
  TrendingUp,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Download,
  History,
  Settings,
  Zap,
  FileText,
  Banknote,
  CircleDollarSign,
  CalendarDays,
  ChevronRight,
  LockKeyhole,
  BarChart3,
  Sparkles,
} from "lucide-react";

const payouts = [
  {
    id: "PYO-10245",
    date: "06 Oct 2026",
    product: "Personal Loan",
    disbursed: "Ã¢â€šÂ¹3,00,000",
    gross: "Ã¢â€šÂ¹6,000",
    deduction: "Ã¢â€šÂ¹600",
    net: "Ã¢â€šÂ¹5,400",
    status: "Success",
    statusClass: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "PYO-10244",
    date: "05 Oct 2026",
    product: "Business Loan",
    disbursed: "Ã¢â€šÂ¹5,00,000",
    gross: "Ã¢â€šÂ¹7,500",
    deduction: "Ã¢â€šÂ¹750",
    net: "Ã¢â€šÂ¹6,750",
    status: "Processing",
    statusClass: "bg-blue-50 text-blue-700",
  },
  {
    id: "PYO-10243",
    date: "03 Oct 2026",
    product: "Home Loan",
    disbursed: "Ã¢â€šÂ¹8,00,000",
    gross: "Ã¢â€šÂ¹12,000",
    deduction: "Ã¢â€šÂ¹1,200",
    net: "Ã¢â€šÂ¹10,800",
    status: "Confirmation",
    statusClass: "bg-amber-50 text-amber-700",
  },
  {
    id: "PYO-10242",
    date: "25 Sep 2026",
    product: "Personal Loan",
    disbursed: "Ã¢â€šÂ¹2,50,000",
    gross: "Ã¢â€šÂ¹4,000",
    deduction: "Ã¢â€šÂ¹400",
    net: "Ã¢â€šÂ¹3,600",
    status: "Success",
    statusClass: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "PYO-10241",
    date: "20 Sep 2026",
    product: "Business Loan",
    disbursed: "Ã¢â€šÂ¹4,00,000",
    gross: "Ã¢â€šÂ¹6,500",
    deduction: "Ã¢â€šÂ¹650",
    net: "Ã¢â€šÂ¹5,850",
    status: "Recovery Hold",
    statusClass: "bg-red-50 text-red-700",
  },
];

const stats = [
  {
    title: "Available Payout",
    value: "Ã¢â€šÂ¹18,450.00",
    subtitle: "Eligible for payout",
    icon: Wallet,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Total Commission",
    value: "Ã¢â€šÂ¹85,400.00",
    subtitle: "Total earnings till date",
    icon: Coins,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    title: "Pending Payout",
    value: "Ã¢â€šÂ¹12,500.00",
    subtitle: "Under processing",
    icon: Clock3,
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    title: "Paid Payout",
    value: "Ã¢â€šÂ¹60,000.00",
    subtitle: "Total amount paid",
    icon: BadgeCheck,
    iconClass: "bg-purple-100 text-purple-600",
  },
  {
    title: "Life Time Earning",
    value: "Ã¢â€šÂ¹2,85,400.00",
    subtitle: "Total earning from all time",
    icon: Crown,
    iconClass: "bg-pink-100 text-pink-600",
  },
];

export default function DsaPayoutPage() {
  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#eef6ff] text-slate-900 lg:ml-[238px] lg:w-[calc(100%-238px)]">
      <div className="mx-auto w-full min-w-0 max-w-full p-3 md:p-4 lg:p-5">

        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#061d57] via-[#073b9d] to-[#0878ee] px-5 py-6 md:px-8 md:py-7 text-white shadow-xl">

          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-1/3 bottom-[-100px] h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative grid items-center gap-6 lg:grid-cols-[1.15fr_.85fr]">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <Wallet className="h-8 w-8 text-yellow-300" />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                    My <span className="text-yellow-300">Payout</span>
                  </h1>
                  <p className="mt-1 text-sm text-blue-100 md:text-base">
                    Your Hard Work, Our Support
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm font-medium text-blue-100 md:text-base">
                Get instant payout after Bank/NBFC disbursement confirmation.
                Track every earning with complete transparency.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
                  Ã°Å¸â€ºÂ¡ Transparent Process
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
                  Ã¢Å¡Â¡ On-Time Payout
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
                  Ã°Å¸â€Â Secure & Safe
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[150px] items-center justify-end lg:flex">
              <div className="absolute right-0 top-0 grid gap-3">
                <div className="rounded-2xl border border-yellow-300/40 bg-black/20 px-5 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-yellow-300" />
                    <div>
                      <p className="font-bold">Instant Payout</p>
                      <p className="text-xs text-blue-100">
                        After Disbursement Confirmation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-300/40 bg-black/20 px-5 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-cyan-300" />
                    <div>
                      <p className="font-bold">Higher Slab %</p>
                      <p className="text-xs text-blue-100">
                        Earn More Each Month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-yellow-200" />
                    <div>
                      <p className="font-bold">Track Every Earning</p>
                      <p className="text-xs text-blue-100">
                        Live & Transparent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="mt-5 grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="min-w-0 min-w-0 rounded-2xl border border-white bg-white p-3.5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {item.title === "Life Time Earning" && (
                    <span className="rounded-full bg-pink-50 px-2 py-1 text-[10px] font-bold text-pink-600">
                      LIFETIME
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  {item.title}
                </p>

                <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.subtitle}
                </p>

                {item.title === "Available Payout" && (
                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600">
                    Request Payout
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </section>

        {/* SLAB + ELIGIBILITY + BANK */}
        <section className="mt-5 grid w-full min-w-0 gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)]">

          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-black">Monthly Slab Progress</h2>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                <CalendarDays className="h-4 w-4" />
                OCTOBER 2026
              </div>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Net Disbursement (Current Month)
            </p>

            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-2xl font-black">Ã¢â€šÂ¹24,50,000 / Ã¢â€šÂ¹30,00,000</p>
              <span className="text-lg font-black text-blue-600">82%</span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
                <p className="mt-2 text-xs text-slate-500">Current Slab</p>
                <p className="font-black text-slate-900">Standard Payout</p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <Crown className="h-6 w-6 text-amber-500" />
                <p className="mt-2 text-xs text-slate-500">Next Slab</p>
                <p className="font-black text-slate-900">Higher Payout %</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              <CircleDollarSign className="h-5 w-5" />
              Ã¢â€šÂ¹5,50,000 more disbursement to reach next slab
            </div>
          </div>

          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-black">Payout Eligibility</h2>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["KYC Verified", "Completed"],
                ["PAN Verified", "Completed"],
                ["Bank Account Verified", "Completed"],
                ["Eligible Disbursements", "12 Cases"],
                ["No Recovery / Hold", "Clear"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-slate-100 pb-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-600">
                      {label}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-emerald-600">
                    Ã¢Å“â€œ {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="font-black text-emerald-700">
                    You are eligible for payout
                  </p>
                  <p className="text-xs text-emerald-700/80">
                    Request payout to withdraw your earnings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-black">Registered Bank Account</h2>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                Ã¢Å“â€œ Verified
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Building2 className="h-7 w-7 text-blue-600" />
                </div>

                <div>
                  <p className="font-black">HDFC Bank</p>
                  <p className="text-sm text-slate-500">
                    A/C No: **** **** 4582
                  </p>
                  <p className="text-sm text-slate-500">
                    IFSC: HDFC0001234
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                Account Holder: <b>DSA Partner</b>
              </p>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                <Settings className="h-4 w-4" />
                Change Account
              </button>
            </div>
          </div>
        </section>

        {/* PAYOUT PROCESS */}
        <section className="mt-5 w-full min-w-0 rounded-2xl border border-white bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Banknote className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-black">Payout Process Flow</h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-5">
            {[
              ["1", "Loan Disbursed", "From Bank/NBFC", "green"],
              ["2", "Banker Confirmation", "Verification in progress", "green"],
              ["3", "Payout Eligible", "As per slab & policy", "green"],
              ["4", "Deductions", "Recovery / Clawback etc.", "blue"],
              ["5", "Payout Release", "Bank Transfer (NEFT/IMPS)", "blue"],
            ].map(([number, title, subtitle, tone], index) => (
              <div key={title} className="relative flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                    tone === "green"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {number === "4" ? (
                    <span className="text-lg font-black">%</span>
                  ) : number === "5" ? (
                    <Wallet className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-black">{title}</p>
                  <p className="text-xs text-slate-500">{subtitle}</p>
                </div>

                {index < 4 && (
                  <ArrowRight className="absolute -right-4 hidden h-5 w-5 text-slate-300 lg:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* RECENT PAYOUTS + QUICK ACTIONS */}
        <section className="mt-5 grid w-full min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">

          <div className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <History className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-black">Recent Payouts</h2>
              </div>

              <Link
                href="/dsa/wallet/transactions"
                className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
              >
                View All Payouts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="w-full min-w-0 overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-blue-50/70 text-xs font-bold text-slate-600">
                  <tr>
                    <th className="px-5 py-3">Payout ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Disbursed Amount</th>
                    <th className="px-4 py-3">Gross Payout</th>
                    <th className="px-4 py-3">Deductions</th>
                    <th className="px-4 py-3">Net Payout</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payouts.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-bold text-blue-700">
                        {row.id}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{row.date}</td>
                      <td className="px-4 py-4 font-semibold">{row.product}</td>
                      <td className="px-4 py-4">{row.disbursed}</td>
                      <td className="px-4 py-4">{row.gross}</td>
                      <td className="px-4 py-4">{row.deduction}</td>
                      <td className="px-4 py-4 font-black">{row.net}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${row.statusClass}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <h2 className="text-lg font-black">Quick Actions</h2>
            </div>

            <div className="mt-5 space-y-3">
              <button className="flex w-full items-center justify-between rounded-xl bg-emerald-50 p-4 text-left transition hover:bg-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-emerald-700">
                      Request Payout
                    </p>
                    <p className="text-xs text-slate-500">
                      Withdraw your eligible earnings
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-600" />
              </button>

              <button className="flex w-full items-center justify-between rounded-xl bg-blue-50 p-4 text-left transition hover:bg-blue-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-blue-700">
                      Download Statement
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF / Excel
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </button>

              <button className="flex w-full items-center justify-between rounded-xl bg-purple-50 p-4 text-left transition hover:bg-purple-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-purple-700">
                      View Payout History
                    </p>
                    <p className="text-xs text-slate-500">
                      Check all transactions
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-purple-600" />
              </button>

              <button className="flex w-full items-center justify-between rounded-xl bg-amber-50 p-4 text-left transition hover:bg-amber-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-amber-700">
                      Payout Settings
                    </p>
                    <p className="text-xs text-slate-500">
                      Bank account, notifications
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-amber-600" />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-6 w-6" />
                <div>
                  <p className="text-sm font-black">Secure Payout</p>
                  <p className="text-xs text-blue-100">
                    Your payout data is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        <div className="mt-6 flex items-center justify-center gap-2 pb-3 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Secure Ã¢â‚¬Â¢ Transparent Ã¢â‚¬Â¢ Professional DSA Payout Management
        </div>

      </div>
    </main>
  );
}
