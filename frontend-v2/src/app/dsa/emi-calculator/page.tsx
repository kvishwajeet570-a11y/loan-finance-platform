"use client";
import { UserRound, Building2, House, Landmark, CarFront, GraduationCap, Coins, Grid2X2 } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

type LoanType = {
  name: string;
  icon: string;
  iconBg: string;
};

const loanTypes: LoanType[] = [
  { name: "Personal Loan", icon: "UserRound", iconBg: "bg-blue-50" },
  { name: "Business Loan", icon: "Building2", iconBg: "bg-purple-50" },
  { name: "Home Loan", icon: "House", iconBg: "bg-emerald-50" },
  { name: "Loan Against Property", icon: "Landmark", iconBg: "bg-orange-50" },
  { name: "Car Loan", icon: "CarFront", iconBg: "bg-rose-50" },
  { name: "Education Loan", icon: "GraduationCap", iconBg: "bg-indigo-50" },
  { name: "Gold Loan", icon: "Coins", iconBg: "bg-amber-50" },
  { name: "Other Loan", icon: "Grid2X2", iconBg: "bg-slate-50" },
];

const comparisonTypes = [
  { name: "Personal Loan", icon: "PL" },
  { name: "Business Loan", icon: "BL" },
  { name: "Home Loan", icon: "HL" },
  { name: "LAP", icon: "PL" },
  { name: "Car Loan", icon: "CAR" },
  { name: "Education Loan", icon: "EDU" },
  { name: "Gold Loan", icon: "GOLD" },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const calculateEMI = (
  principal: number,
  annualRate: number,
  months: number
) => {
  if (principal <= 0 || months <= 0) return 0;

  if (annualRate === 0) {
    return principal / months;
  }

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);

  return (principal * monthlyRate * factor) / (factor - 1);
};

export default function EmiCalculatorPage() {
  const [loanType, setLoanType] = useState("Personal Loan");
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12.5);
  const [tenure, setTenure] = useState(36);

  const [serverResult, setServerResult] = useState<{
    monthlyEMI: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const response = await api.post("/emi/calculate", {
          principal: amount,
          interestRate: rate,
          tenureMonths: tenure,
        });

        if (!cancelled && response.data?.success && response.data?.data) {
          setServerResult(response.data.data);
        } else if (!cancelled) {
          setServerResult(null);
        }
      } catch (error) {
        console.error("EMI API request failed:", error);
        if (!cancelled) setServerResult(null);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [amount, rate, tenure]);

  const emi = serverResult?.monthlyEMI ?? calculateEMI(amount, rate, tenure);
  const totalPayment = serverResult?.totalPayment ?? emi * tenure;
  const totalInterest = Math.max(
    serverResult?.totalInterest ?? totalPayment - amount,
    0
  );

  const principalPercent =
    totalPayment > 0 ? (amount / totalPayment) * 100 : 0;

  const interestPercent =
    totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const resetCalculator = () => {
    setLoanType("Personal Loan");
    setAmount(500000);
    setRate(12.5);
    setTenure(36);
  };

  const comparisonAmounts = useMemo(
    () => [
      {
        name: "Personal Loan",
        icon: "PL",
        emi: calculateEMI(amount, rate, tenure),
      },
      {
        name: "Business Loan",
        icon: "BL",
        emi: calculateEMI(amount, rate, tenure),
      },
      {
        name: "Home Loan",
        icon: "HL",
        emi: calculateEMI(amount, rate, tenure),
      },
      {
        name: "LAP",
        icon: "LAP",
        emi: calculateEMI(amount, rate, tenure),
      },
      {
        name: "Car Loan",
        icon: "CAR",
        emi: calculateEMI(amount, rate, tenure),
      },
      {
        name: "Education Loan",
        icon: "EDU",
        emi: calculateEMI(amount, rate, tenure),
      },
      {
        name: "Gold Loan",
        icon: "GOLD",
        emi: calculateEMI(amount, rate, tenure),
      },
    ],
    [amount, rate, tenure]
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#10284d]">
      {/* Page content â€” existing DSA sidebar/header should remain outside this page */}

      <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-7">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-500">Dashboard</span>
          <span className="text-slate-300">â€º</span>
          <span className="font-semibold text-[#183d70]">
            EMI Calculator
          </span>
        </div>

        {/* HERO */}
        <section className="relative mb-5 overflow-hidden rounded-[16px] bg-gradient-to-r from-[#061d43] via-[#083875] to-[#06295b] px-6 py-7 shadow-[0_8px_30px_rgba(5,38,85,0.15)] sm:px-8 lg:px-9">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-2xl" />
          <div className="absolute right-[25%] bottom-[-100px] h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 max-w-[850px]">
            <h1 className="text-[34px] font-extrabold tracking-tight text-white sm:text-[42px] lg:text-[48px]">
              EMI{" "}
              <span className="bg-gradient-to-r from-[#15b9ff] to-[#48d5ff] bg-clip-text text-transparent">
                Calculator
              </span>
            </h1>

            <p className="mt-1 text-lg font-medium text-white/90 sm:text-xl">
              Plan Your Loan Better, Make Smarter Financial Decisions
            </p>

            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              {[
                ["OK", "Accurate Calculation"],
                ["LOAN", "Multiple Loan Types"],
                ["COMPARE", "Compare Options"],
                ["FREE", "100% Free Tool"],
              ].map(([icon, text]) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm font-semibold text-white"
                >
                  <span className="text-lg text-cyan-300">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* CSS calculator illustration */}
          <div className="absolute right-7 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="relative h-[150px] w-[300px]">
              <div className="absolute right-10 top-8 h-[95px] w-[80px] rotate-[8deg] rounded-xl border-4 border-slate-500 bg-slate-200 p-2 shadow-2xl">
                <div className="mb-2 rounded bg-slate-700 px-2 py-1 text-right text-[9px] text-green-300">
                  5,00,000
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-3 rounded bg-slate-400"
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-lg" />
              <div className="absolute bottom-2 right-16 h-12 w-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-lg" />

              <div className="absolute left-16 top-12 h-1 w-28 rotate-[-25deg] bg-cyan-300" />
              <div className="absolute left-[130px] top-[20px] h-3 w-3 rounded-full border-2 border-cyan-300" />
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
          {/* LEFT CALCULATOR */}
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_22px_rgba(30,60,100,0.06)] sm:p-6">
            <div>
              <h2 className="text-[23px] font-extrabold text-[#10284d]">
                Calculate Your EMI
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Adjust the loan amount, interest rate and tenure to see your
                EMI instantly.
              </p>
            </div>

            {/* Loan type */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-[#10284d]">
                Select Loan Type
              </h3>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {loanTypes.map((loan) => {
                  const active = loanType === loan.name;

                  return (
                    <button
                      key={loan.name}
                      type="button"
                      onClick={() => setLoanType(loan.name)}
                      className={`group relative min-h-[104px] overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-blue-50/70 px-3 py-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_12px_28px_rgba(8,121,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        active
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-[0_0_0_2px_rgba(8,121,255,0.25),0_12px_28px_rgba(8,121,255,0.14)]"
                          : "border-slate-200/80 bg-gradient-to-br from-white to-slate-50 hover:border-cyan-300 hover:from-cyan-50 hover:to-blue-50"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-xl ${loan.iconBg}`}
                      >
                        {(() => {
  const Icon = {
    UserRound, Building2, House, Landmark, CarFront, GraduationCap, Coins, Grid2X2
  }[loan.icon];
  return Icon ? <Icon size={22} strokeWidth={2.2} className="text-blue-700" /> : null;
})()}
                      </div>

                      <div
                        className={`mt-2 text-xs font-bold leading-tight ${
                          active ? "text-[#0879ff]" : "text-[#20395d]"
                        }`}
                      >
                        {loan.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <CalculatorField
              title="Loan Amount"
              value={
                <input
                  value={formatINR(amount)}
                  onChange={(e) => {
                    const numeric = Number(
                      e.target.value.replace(/,/g, "").replace(/[^\d]/g, "")
                    );
                    if (!Number.isNaN(numeric)) {
                      setAmount(Math.min(Math.max(numeric, 10000), 5000000));
                    }
                  }}
                  className="w-full bg-transparent text-sm font-semibold text-[#17365f] outline-none"
                  inputMode="numeric"
                />
              }
              quickOptions={["+50K", "+1L", "+5L", "+10L"]}
              onQuick={(option) => {
                const increments: Record<string, number> = {
                  "+50K": 50000,
                  "+1L": 100000,
                  "+5L": 500000,
                  "+10L": 1000000,
                };

                setAmount((current) =>
                  Math.min(current + increments[option], 5000000)
                );
              }}
            >
              <input
                type="range"
                min="10000"
                max="5000000"
                step="5000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="loan-range"
              />

              <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                <span>₹ 10,000</span>
                <span>₹ 50,00,000</span>
              </div>
            </CalculatorField>

            {/* Rate */}
            <CalculatorField
              title="Interest Rate (per annum)"
              value={
                <div className="flex items-center">
                  <input
                    value={rate}
                    onChange={(e) => {
                      const numeric = Number(e.target.value);
                      if (!Number.isNaN(numeric)) {
                        setRate(Math.min(Math.max(numeric, 0), 30));
                      }
                    }}
                    className="w-full bg-transparent text-sm font-semibold text-[#17365f] outline-none"
                    inputMode="decimal"
                  />
                  <span className="font-semibold text-slate-500">%</span>
                </div>
              }
              quickOptions={["8%", "10%", "12.5%", "15%", "18%"]}
              onQuick={(option) =>
                setRate(Number(option.replace("%", "")))
              }
            >
              <input
                type="range"
                min="5"
                max="30"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="loan-range"
              />

              <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                <span>5%</span>
                <span>30%</span>
              </div>
            </CalculatorField>

            {/* Tenure */}
            <CalculatorField
              title="Loan Tenure"
              value={
                <div className="flex items-center">
                  <input
                    value={tenure}
                    onChange={(e) => {
                      const numeric = Number(e.target.value);
                      if (!Number.isNaN(numeric)) {
                        setTenure(Math.min(Math.max(numeric, 6), 120));
                      }
                    }}
                    className="w-full bg-transparent text-sm font-semibold text-[#17365f] outline-none"
                    inputMode="numeric"
                  />
                  <span className="whitespace-nowrap font-semibold text-slate-500">
                    Months
                  </span>
                </div>
              }
              quickOptions={["12", "24", "36", "48", "60"]}
              onQuick={(option) => setTenure(Number(option))}
            >
              <input
                type="range"
                min="6"
                max="120"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="loan-range"
              />

              <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                <span>6 Months</span>
                <span>120 Months</span>
              </div>
            </CalculatorField>

            {/* Buttons */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={resetCalculator}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-100 text-sm font-bold text-[#17365f] transition hover:bg-slate-200"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => {
                  setAmount(amount);
                  setRate(rate);
                  setTenure(tenure);
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#086de8] text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#055dc7]"
              >
                Calculate EMI
              </button>
            </div>
          </div>

          {/* RESULTS */}
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_22px_rgba(30,60,100,0.06)] sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-extrabold text-[#10284d]">
                Your EMI Results
              </h2>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                Estimated Results
              </span>
            </div>

            {/* EMI */}
            <div className="py-6 text-center">
              <div className="text-sm font-medium text-slate-500">
                Monthly EMI
              </div>

              <div className="mt-1 text-[38px] font-extrabold tracking-tight text-[#0874e8]">
                ₹{formatINR(emi)}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <ResultStat
                icon="EMI"
                title="Loan Amount"
                value={`₹${formatINR(amount)}`}
              />

              <ResultStat
                icon="%"
                title="Total Interest"
                value={`₹${formatINR(totalInterest)}`}
              />

              <ResultStat
                icon="EMI"
                title="Total Payment"
                value={`₹${formatINR(totalPayment)}`}
              />
            </div>

            {/* Donut */}
            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <div
                className="relative flex h-[155px] w-[155px] shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#1681ed 0 ${principalPercent}%, #25bf80 ${principalPercent}% 100%)`,
                }}
              >
                <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-xs text-slate-400">Total</span>
                  <span className="text-base font-extrabold text-[#17365f]">
                    ₹{formatINR(totalPayment)}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <Legend
                  dot="bg-[#1681ed]"
                  title="Principal Amount"
                  value={`₹${formatINR(amount)} (${principalPercent.toFixed(
                    1
                  )}%)`}
                />

                <Legend
                  dot="bg-[#25bf80]"
                  title="Total Interest"
                  value={`₹${formatINR(
                    totalInterest
                  )} (${interestPercent.toFixed(1)}%)`}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-xl bg-[#f5f8fc] p-4">
              <h3 className="mb-4 text-sm font-extrabold text-[#10284d]">
                Amortization Summary
              </h3>

              <SummaryRow
                label="Monthly EMI"
                value={`₹${formatINR(emi)}`}
              />

              <SummaryRow
                label="Total Tenure"
                value={`${tenure} Months`}
              />

              <SummaryRow
                label="Total Interest Payable"
                value={`₹${formatINR(totalInterest)}`}
              />

              <SummaryRow
                label="Total Payment (Principal + Interest)"
                value={`₹${formatINR(totalPayment)}`}
              />
            </div>

            {/* Apply */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/dsa/apply-loan";
              }}
              className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#12b95c] to-[#10aa55] text-base font-extrabold text-white shadow-lg shadow-green-500/20 transition hover:from-[#0da950] hover:to-[#079649]"
            >
              <span>APPLY</span>
              Apply for This Loan
              <span>-&gt;</span>
            </button>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mt-5 rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_22px_rgba(30,60,100,0.06)] sm:p-6">
          <h2 className="text-lg font-extrabold text-[#10284d]">
            Estimated EMI at Selected Rate
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Get an idea of EMI for popular loan types at {rate}% for{" "}
            {tenure} months (₹{formatINR(amount)})
          </p>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {comparisonAmounts.map((item) => (
              <div
                key={item.name}
                className="min-w-[145px] flex-1 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-lg">
                    {item.icon}
                  </div>

                  <span className="text-xs font-bold text-[#0874e8]">
                    {item.name}
                  </span>
                </div>

                <div className="mt-3 text-base font-extrabold text-[#17365f]">
                  ₹{formatINR(item.emi)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .loan-range {
          width: 100%;
          height: 5px;
          appearance: none;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            #0879ff 0%,
            #0879ff 50%,
            #dce6f2 50%,
            #dce6f2 100%
          );
          cursor: pointer;
        }

        .loan-range::-webkit-slider-thumb {
          appearance: none;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #0879ff;
          border: 3px solid white;
          box-shadow: 0 1px 5px rgba(0, 70, 160, 0.25);
        }

        .loan-range::-moz-range-thumb {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #0879ff;
          border: 3px solid white;
          box-shadow: 0 1px 5px rgba(0, 70, 160, 0.25);
        }
      `}</style>
    </div>
  );
}

function CalculatorField({
  title,
  value,
  quickOptions,
  onQuick,
  children,
}: {
  title: string;
  value: React.ReactNode;
  quickOptions: string[];
  onQuick: (option: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[#10284d]">{title}</h3>

        <div className="flex flex-wrap gap-2">
          {quickOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onQuick(option)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#35506f] transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex h-10 max-w-[165px] items-center rounded-lg border border-slate-200 bg-white px-3">
        {value}
      </div>

      {children}
    </div>
  );
}

function ResultStat({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
        {icon}
      </div>

      <div className="mt-2 text-[10px] font-medium text-slate-500">
        {title}
      </div>

      <div className="mt-1 text-xs font-extrabold text-[#17365f] sm:text-sm">
        {value}
      </div>
    </div>
  );
}

function Legend({
  dot,
  title,
  value,
}: {
  dot: string;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-1.5 h-3.5 w-3.5 rounded-full ${dot}`} />

      <div>
        <div className="text-xs font-semibold text-slate-500">{title}</div>
        <div className="mt-0.5 text-sm font-extrabold text-[#17365f]">
          {value}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 py-2.5 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-extrabold text-[#17365f] sm:text-sm">
        {value}
      </span>
    </div>
  );
}
