"use client";

import { useState } from "react";
import Link from "next/link";

type EligibilityResult = {
  eligible: boolean;
  maxEligibleEMI: number;
  availableEMI: number;
  maxEligibleLoanAmount: number;
  foir: number;
  emi: number;
  approvalScore: number;
  remarks: string;
};

type ApiResponse = {
  success?: boolean;
  data?: EligibilityResult;
  message?: string;
  disclaimer?: string;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const BANK_LOGOS: Record<string, string> = {
  "HDFC Bank": "/lender-logos/hdfc.svg",
  "ICICI Bank": "/lender-logos/icici.svg",
  "Axis Bank": "/lender-logos/axis.svg",
};

const lenders = [
  { name: "HDFC Bank", type: "Personal Loan", color: "border-red-100", accent: "bg-red-50 text-red-700" },
  { name: "ICICI Bank", type: "Personal Loan", color: "border-orange-100", accent: "bg-orange-50 text-orange-700" },
  { name: "Axis Bank", type: "Personal Loan", color: "border-purple-100", accent: "bg-purple-50 text-purple-700" },
];

const money = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
    : "—";

function BankLogo({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const src = BANK_LOGOS[name];

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`${name} official logo`}
        className="h-11 w-11 shrink-0 object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700">
      {name.split(" ").map((s) => s[0]).join("")}
    </div>
  );
}

export default function LoanEligibilityPage() {
  const [income, setIncome] = useState("50000");
  const [existingEMI, setExistingEMI] = useState("10000");
  const [loanType, setLoanType] = useState("Personal Loan");
  const [tenureYears, setTenureYears] = useState("5");
  const [rate, setRate] = useState("15");
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [disclaimer, setDisclaimer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    const monthlyIncome = Number(income);
    const emiNow = Number(existingEMI);
    const annualRate = Number(rate);
    const years = Number(tenureYears);
    const requestedLoanAmount = 300000;
    const tenureMonths = years * 12;

    if (
      !Number.isFinite(monthlyIncome) || monthlyIncome <= 0 ||
      !Number.isFinite(emiNow) || emiNow < 0 ||
      !Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100 ||
      !Number.isInteger(years) || years < 1 || years > 30
    ) {
      setError("Please enter valid income, EMI, tenure and interest rate.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/eligibility/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          monthlyIncome,
          existingEMI: emiNow,
          requestedLoanAmount,
          tenureMonths,
          annualInterestRate: annualRate,
        }),
      });

      const body: ApiResponse = await response.json().catch(() => ({}));
      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message || `Eligibility API failed (HTTP ${response.status}).`);
      }

      setResult(body.data);
      setDisclaimer(body.disclaimer || "Preliminary estimate only. This is not a lender approval or offer.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to calculate eligibility.");
    } finally {
      setLoading(false);
    }
  }

  const factors = [
    {
      title: "Credit Score",
      value: "Not connected",
      note: "Customer score is not fetched by this API.",
      icon: "▣",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Monthly Income",
      value: money(Number(income) || 0),
      note: "Income entered in this calculator.",
      icon: "₹",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Existing EMI",
      value: money(Number(existingEMI) || 0),
      note: "Current monthly commitments.",
      icon: "▤",
      color: "bg-violet-100 text-violet-700",
    },
    {
      title: "Loan Tenure",
      value: `${tenureYears} ${Number(tenureYears) === 1 ? "Year" : "Years"}`,
      note: "Selected repayment duration.",
      icon: "▦",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f8fd] px-4 py-5 text-[#10234b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-5">

        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <span>Customer Portal</span>
              <span className="text-slate-300">/</span>
              <Link href="/customer/credit-score" className="hover:underline">Credit Score</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Loan Eligibility</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#10234b]">
              Loan Eligibility
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Get an estimate of your loan eligibility based on your financial profile.
            </p>
          </div>
          <Link
            href="/customer/credit-score"
            className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ← Back to Credit Score
          </Link>
        </header>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <strong>Calculation error:</strong> {error}
          </div>
        )}

        <section className="grid items-stretch gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <form onSubmit={calculate} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 border-l-4 border-blue-600 pl-3">
              <h2 className="text-lg font-extrabold">Calculate Your Loan Eligibility</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your details to calculate an estimated loan amount.
              </p>
            </div>

            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Monthly Income (₹)
                <div className="mt-2 flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="pl-3 text-lg text-slate-500">₹</span>
                  <input
                    className="min-w-0 flex-1 rounded-lg px-3 py-3 outline-none"
                    type="number" min="1" step="any" required
                    value={income} onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Existing EMI (₹)
                <div className="mt-2 flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="pl-3 text-lg text-slate-500">₹</span>
                  <input
                    className="min-w-0 flex-1 rounded-lg px-3 py-3 outline-none"
                    type="number" min="0" step="any" required
                    value={existingEMI} onChange={(e) => setExistingEMI(e.target.value)}
                  />
                </div>
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Preferred Loan Type
                <select
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500"
                  value={loanType} onChange={(e) => setLoanType(e.target.value)}
                >
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Home Loan</option>
                  <option>Loan Against Property</option>
                  <option>Car Loan</option>
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Loan Tenure (Years)
                <select
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-blue-500"
                  value={tenureYears} onChange={(e) => setTenureYears(e.target.value)}
                >
                  {[1,2,3,4,5,7,10,15,20,25,30].map((year) => (
                    <option key={year} value={year}>{year} {year === 1 ? "Year" : "Years"}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Assumed Annual Interest Rate (%)
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500"
                  type="number" min="0" max="100" step="0.1" required
                  value={rate} onChange={(e) => setRate(e.target.value)}
                />
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  This is a user-selected estimate, not a confirmed lender rate.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Calculating..." : "▦  Calculate Eligibility"}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              Estimate only · No loan application is submitted
            </p>
          </form>

          <section className="flex flex-col rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-[#f7fff9] to-emerald-50 p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold ${
                  result?.eligible ? "bg-emerald-500 text-[#10234b]" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {result ? (result.eligible ? "✓" : "i") : "✓"}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold">Estimated Loan Eligibility</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {result ? "Calculated from your entered information" : "Your estimate will appear here"}
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                ◉ Preliminary Estimate
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-100 bg-white/80 p-5 sm:p-6">
              <p className="text-sm font-semibold text-emerald-800">
                {result ? "Estimated maximum loan amount" : "Estimated loan amount"}
              </p>
              <p className="mt-2 break-words text-3xl font-extrabold tracking-tight text-emerald-800 sm:text-4xl">
                {result ? money(result.maxEligibleLoanAmount) : "—"}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {result
                  ? `Requested product: ${loanType}. Model result: ${result.remarks}.`
                  : "Complete the form and calculate to see your estimate."}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-100 bg-white p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">₹</span>
                <p className="mt-3 text-xs text-slate-500">Monthly Income</p>
                <p className="mt-1 break-words text-base font-extrabold">{money(Number(income) || 0)}</p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-white p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700">▣</span>
                <p className="mt-3 text-xs text-slate-500">Existing EMI</p>
                <p className="mt-1 break-words text-base font-extrabold">{money(Number(existingEMI) || 0)}</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-white p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">▦</span>
                <p className="mt-3 text-xs text-slate-500">Estimated EMI</p>
                <p className="mt-1 break-words text-base font-extrabold">{result ? money(result.emi) : "—"}</p>
                <p className="mt-1 text-[11px] text-slate-400">For ₹3,00,000 requested amount</p>
              </div>
            </div>

            {result && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-700">Available EMI capacity</p>
                  <p className="mt-1 font-bold text-blue-900">{money(result.availableEMI)}</p>
                </div>
                <div className="rounded-lg bg-violet-50 p-3">
                  <p className="text-xs text-violet-700">FOIR assumption</p>
                  <p className="mt-1 font-bold text-violet-900">{result.foir}%</p>
                </div>
              </div>
            )}

            <p className="mt-auto pt-5 text-xs leading-5 text-slate-500">
              {disclaimer || "This is a preliminary estimate only. Actual approval, amount, interest rate and terms depend on lender policies and verification."}
            </p>
          </section>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="border-l-4 border-blue-600 pl-3">
            <h2 className="text-lg font-extrabold">Key Factors Affecting Eligibility</h2>
            <p className="mt-1 text-sm text-slate-500">
              Financial details shown below are not a bank approval decision.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {factors.map((factor) => (
              <div key={factor.title} className="rounded-xl border border-slate-100 bg-[#fafbfd] p-4 transition hover:border-blue-100 hover:bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${factor.color}`}>
                    {factor.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#10234b]">{factor.title}</p>
                    <p className="mt-1 break-words text-base font-extrabold">{factor.value}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">{factor.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="border-l-4 border-blue-600 pl-3">
              <h2 className="text-lg font-extrabold">Recommended Loan Options</h2>
              <p className="mt-1 text-sm text-slate-500">
                Lender directory shortcuts. Offers and rates have not been verified by this calculator.
              </p>
            </div>
            <Link href="/customer/credit-score" className="w-fit rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Back to Credit Score ↗
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {lenders.map((lender) => (
              <article key={lender.name} className={`rounded-xl border ${lender.color} bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md`}>
                <div className="flex items-center gap-3">
                  <BankLogo name={lender.name} />
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-[#10234b]">{lender.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{lender.type}</p>
                  </div>
                  <span className={`ml-auto rounded-full px-2 py-1 text-[10px] font-bold ${lender.accent}`}>
                    Directory
                  </span>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-xs leading-5 text-slate-500">
                    Check current product availability, eligibility rules and pricing through verified lender information before applying.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.alert(`${lender.name}: verified lender offers are not connected to this page yet.`)}
                  className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-[#10234b] transition hover:bg-blue-700"
                >
                  View Eligibility Requirements
                </button>
              </article>
            ))}
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-xs leading-5 text-blue-900">
          <span className="text-lg">ⓘ</span>
          <p>
            This is a preliminary estimate based on the information entered.
            Final approval, loan amount, interest rate and terms are subject to lender
            policies, documentation and verification. Lender cards are directory
            placeholders until verified lender product data is integrated.
          </p>
        </div>

      </div>
    </main>
  );
}

