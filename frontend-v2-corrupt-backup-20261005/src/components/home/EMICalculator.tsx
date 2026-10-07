"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  IndianRupee,
  Percent,
  CalendarDays,
  RotateCcw,
  ArrowRight,
  WalletCards,
  TrendingUp,
  ReceiptText,
} from "lucide-react";

const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 10000000;
const MIN_RATE = 1;
const MAX_RATE = 30;
const MIN_MONTHS = 3;
const MAX_MONTHS = 84;

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatCompactINR(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }

  return `₹${formatINR(value)}`;
}

function calculateEMI(
  principal: number,
  annualRate: number,
  months: number
) {
  if (principal <= 0 || months <= 0) {
    return {
      emi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const monthlyRate = annualRate / 12 / 100;

  let emi = 0;

  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return {
    emi,
    totalInterest,
    totalPayment,
  };
}

export default function EMICalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(11.5);
  const [months, setMonths] = useState(36);

  const result = useMemo(
    () => calculateEMI(amount, rate, months),
    [amount, rate, months]
  );

  const principalPercentage =
    result.totalPayment > 0
      ? (amount / result.totalPayment) * 100
      : 0;

  const interestPercentage =
    result.totalPayment > 0
      ? (result.totalInterest / result.totalPayment) * 100
      : 0;

  const tenureYears = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const tenureLabel =
    tenureYears > 0
      ? `${tenureYears} Year${tenureYears > 1 ? "s" : ""}${
          remainingMonths > 0
            ? ` ${remainingMonths} Month${remainingMonths > 1 ? "s" : ""}`
            : ""
        }`
      : `${months} Months`;

  const resetCalculator = () => {
    setAmount(500000);
    setRate(11.5);
    setMonths(36);
  };

  return (
    <section
      id="emi-calculator"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 py-16 sm:py-20 lg:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* ================= HEADER ================= */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <Calculator size={17} />
            Smart EMI Calculator
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Calculate Your{" "}
            <span className="text-blue-600">Monthly EMI</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Plan your loan with confidence. Adjust the loan amount, interest
            rate and tenure to instantly see your estimated monthly EMI.
          </p>

        </div>

        {/* ================= CALCULATOR ================= */}
        <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)]">

          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">

            {/* ================= LEFT INPUT PANEL ================= */}
            <div className="p-6 sm:p-8 lg:p-10">

              <div className="mb-8 flex items-center justify-between">

                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                    Loan Details
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                    Configure your loan
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={resetCalculator}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>

              </div>

              {/* LOAN AMOUNT */}
              <div className="mb-8">

                <div className="mb-3 flex items-center justify-between gap-4">

                  <label
                    htmlFor="loan-amount"
                    className="flex items-center gap-2 text-sm font-bold text-slate-700"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <IndianRupee size={16} />
                    </span>
                    Loan Amount
                  </label>

                  <div className="relative w-44">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="loan-amount"
                      type="number"
                      min={MIN_AMOUNT}
                      max={MAX_AMOUNT}
                      step={10000}
                      value={amount}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (Number.isNaN(value)) return;

                        setAmount(
                          Math.min(
                            MAX_AMOUNT,
                            Math.max(MIN_AMOUNT, value)
                          )
                        );
                      }}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-right text-sm font-extrabold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                </div>

                <input
                  type="range"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={10000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-blue-600"
                />

                <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                  <span>₹10K</span>
                  <span>₹1 Cr</span>
                </div>

              </div>

              {/* INTEREST RATE */}
              <div className="mb-8">

                <div className="mb-3 flex items-center justify-between gap-4">

                  <label
                    htmlFor="interest-rate"
                    className="flex items-center gap-2 text-sm font-bold text-slate-700"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                      <Percent size={16} />
                    </span>
                    Interest Rate
                  </label>

                  <div className="relative w-36">
                    <input
                      id="interest-rate"
                      type="number"
                      min={MIN_RATE}
                      max={MAX_RATE}
                      step={0.1}
                      value={rate}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (Number.isNaN(value)) return;

                        setRate(
                          Math.min(
                            MAX_RATE,
                            Math.max(MIN_RATE, value)
                          )
                        );
                      }}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 text-right text-sm font-extrabold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                      %
                    </span>
                  </div>

                </div>

                <input
                  type="range"
                  min={MIN_RATE}
                  max={MAX_RATE}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-blue-600"
                />

                <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                  <span>1%</span>
                  <span>30%</span>
                </div>

              </div>

              {/* TENURE */}
              <div>

                <div className="mb-3 flex items-center justify-between gap-4">

                  <label
                    htmlFor="loan-tenure"
                    className="flex items-center gap-2 text-sm font-bold text-slate-700"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <CalendarDays size={16} />
                    </span>
                    Loan Tenure
                  </label>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-extrabold text-slate-900">
                    {tenureLabel}
                  </div>

                </div>

                <input
                  id="loan-tenure"
                  type="range"
                  min={MIN_MONTHS}
                  max={MAX_MONTHS}
                  step={1}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-blue-600"
                />

                <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                  <span>3 Months</span>
                  <span>7 Years</span>
                </div>

              </div>

              {/* NOTE */}
              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <p className="text-xs leading-5 text-blue-800">
                  <strong>Note:</strong> This calculator provides an
                  estimated EMI. Actual EMI may vary based on the final
                  interest rate, processing fees, loan terms and lender
                  approval.
                </p>
              </div>

            </div>

            {/* ================= RIGHT RESULT PANEL ================= */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#003b73] via-[#0059a8] to-[#0077c8] p-6 text-white sm:p-8 lg:p-10">

              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <WalletCards size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/65">
                      Your estimated EMI
                    </p>

                    <p className="text-sm font-semibold text-white/90">
                      Based on current inputs
                    </p>
                  </div>

                </div>

                {/* EMI */}
                <div className="mt-8">

                  <p className="text-sm font-medium text-white/70">
                    Monthly EMI
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">

                    <span className="text-4xl font-black tracking-tight sm:text-5xl">
                      ₹{formatINR(result.emi)}
                    </span>

                    <span className="text-sm font-semibold text-white/65">
                      / month
                    </span>

                  </div>

                </div>

                {/* SUMMARY */}
                <div className="mt-8 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white/65">
                      <TrendingUp size={16} />
                      <span className="text-xs font-semibold">
                        Total Interest
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-extrabold">
                      ₹{formatINR(result.totalInterest)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white/65">
                      <ReceiptText size={16} />
                      <span className="text-xs font-semibold">
                        Total Payable
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-extrabold">
                      ₹{formatINR(result.totalPayment)}
                    </p>
                  </div>

                </div>

                {/* BREAKDOWN */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">

                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold">
                      Payment Breakdown
                    </p>

                    <span className="text-xs font-semibold text-white/60">
                      {months} months
                    </span>
                  </div>

                  {/* Visual bar */}
                  <div className="flex h-4 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{
                        width: `${principalPercentage}%`,
                      }}
                    />

                    <div
                      className="h-full bg-cyan-300 transition-all duration-300"
                      style={{
                        width: `${interestPercentage}%`,
                      }}
                    />

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                        <span className="text-xs text-white/65">
                          Principal
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-bold">
                        {formatCompactINR(amount)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        <span className="text-xs text-white/65">
                          Interest
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-bold">
                        {formatCompactINR(result.totalInterest)}
                      </p>
                    </div>

                  </div>

                </div>

                {/* APPLY CTA */}
                <Link
                  href="/apply"
                  className="group mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 text-sm font-extrabold text-[#004b8d] shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Apply for This Loan
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-3 text-center text-[11px] font-medium text-white/55">
                  Quick application • Simple process • Secure
                </p>

              </div>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM INFO CARDS ================= */}
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Loan Amount
            </p>
            <p className="mt-2 text-xl font-extrabold text-slate-900">
              ₹{formatCompactINR(amount).replace("₹", "")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interest Rate
            </p>
            <p className="mt-2 text-xl font-extrabold text-slate-900">
              {rate.toFixed(1)}% p.a.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Loan Tenure
            </p>
            <p className="mt-2 text-xl font-extrabold text-slate-900">
              {tenureLabel}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

