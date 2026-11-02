"use client";

import { useMemo, useState, type ReactNode } from "react";
import api from "@/lib/api";

type LoanProduct = {
  name: string;
  icon: string;
  iconBg: string;
  border: string;
  button: string;
  amount: string;
  rate: string;
  tenure: string;
};

type EligibilityApiResult = {
  eligible: boolean;
  maxEligibleEMI: number;
  availableEMI: number;
  maxEligibleLoanAmount: number;
  foir: number;
  emi: number;
  approvalScore: number;
  remarks: string;
};
const products: LoanProduct[] = [
  {
    name: "Personal Loan",
    icon: "👤",
    iconBg: "bg-blue-50",
    border: "border-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
    amount: "₹50K - 25L",
    rate: "10.5% - 18%",
    tenure: "12 - 60 Months",
  },
  {
    name: "Business Loan",
    icon: "💼",
    iconBg: "bg-purple-50",
    border: "border-purple-200",
    button: "bg-purple-600 hover:bg-purple-700",
    amount: "₹1L - 1Cr",
    rate: "11% - 20%",
    tenure: "12 - 84 Months",
  },
  {
    name: "Home Loan",
    icon: "🏠",
    iconBg: "bg-emerald-50",
    border: "border-emerald-200",
    button: "bg-emerald-500 hover:bg-emerald-600",
    amount: "₹10L - 5Cr",
    rate: "8.5% - 12%",
    tenure: "60 - 360 Months",
  },
  {
    name: "Loan Against Property",
    icon: "🏢",
    iconBg: "bg-orange-50",
    border: "border-orange-200",
    button: "bg-orange-500 hover:bg-orange-600",
    amount: "₹10L - 10Cr",
    rate: "9% - 14%",
    tenure: "12 - 180 Months",
  },
  {
    name: "Car Loan",
    icon: "🚗",
    iconBg: "bg-rose-50",
    border: "border-rose-200",
    button: "bg-rose-500 hover:bg-rose-600",
    amount: "₹1L - 50L",
    rate: "9.5% - 16%",
    tenure: "12 - 84 Months",
  },
  {
    name: "Education Loan",
    icon: "🎓",
    iconBg: "bg-violet-50",
    border: "border-violet-200",
    button: "bg-violet-600 hover:bg-violet-700",
    amount: "₹50K - 50L",
    rate: "9% - 15%",
    tenure: "12 - 180 Months",
  },
  {
    name: "Gold Loan",
    icon: "🪙",
    iconBg: "bg-amber-50",
    border: "border-amber-200",
    button: "bg-amber-500 hover:bg-amber-600",
    amount: "₹10K - 5L",
    rate: "8% - 14%",
    tenure: "6 - 36 Months",
  },
];

const steps = [
  ["Personal", "Details"],
  ["Employment", "Details"],
  ["Financial", "Details"],
  ["Results", ""],
];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

export default function LoanEligibilityPage() {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [employmentType, setEmploymentType] = useState("Salaried");
  const [income, setIncome] = useState(50000);
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("1-3 Years");

  const [existingEmi, setExistingEmi] = useState(0);
  const [creditScore, setCreditScore] = useState(780);
  const [expenses, setExpenses] = useState(15000);
  const [apiResult, setApiResult] = useState<EligibilityApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const eligibility = useMemo(() => {
    const disposable = Math.max(
      income - existingEmi - expenses,
      0
    );

    const creditMultiplier =
      creditScore >= 750
        ? 1
        : creditScore >= 700
          ? 0.85
          : creditScore >= 650
            ? 0.7
            : 0.5;

    const calculated = disposable * 48 * creditMultiplier;

    return {
      disposable,
      amount: Math.min(
        Math.max(
          Math.round(Math.max(calculated, 50000) / 50000) *
            50000,
          50000
        ),
        2500000
      ),
    };
  }, [income, existingEmi, expenses, creditScore]);

  const next = async () => {
    if (step !== 3) {
      setStep((s) => Math.min(s + 1, 4));
      return;
    }

    setLoading(true);
    setApiError("");
    setApiResult(null);

    try {
      const response = await api.post<{
        success: boolean;
        data: EligibilityApiResult;
        message?: string;
      }>("/eligibility/check", {
        monthlyIncome: income,
        existingEMI: existingEmi,
        requestedLoanAmount: eligibility.amount,
        tenureMonths: 60,
        annualInterestRate: 10.5,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Eligibility assessment failed.");
      }

      setApiResult(response.data.data);
      setStep(4);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setApiError(
        err.response?.data?.message ||
        err.message ||
        "Unable to calculate eligibility. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-3 py-4 text-[#10284d] sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1510px]">

        {/* BREADCRUMB */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-500">
            Dashboard
          </span>
          <span className="text-slate-300">›</span>
          <span className="font-bold text-[#183d70]">
            Loan Eligibility
          </span>
        </div>

        {/* HERO */}
        <section className="relative mb-5 min-h-[165px] overflow-hidden rounded-[16px] bg-gradient-to-r from-[#061d43] via-[#07376e] to-[#062b61] px-6 py-7 shadow-[0_8px_30px_rgba(5,38,85,0.14)] sm:px-8 lg:px-9">

          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 max-w-[780px]">
            <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-white sm:text-[42px] lg:text-[48px]">
              Loan{" "}
              <span className="bg-gradient-to-r from-[#17b9ff] to-[#3bd5ff] bg-clip-text text-transparent">
                Eligibility
              </span>
            </h1>

            <p className="mt-2 text-base font-medium text-white/90 sm:text-lg">
              Check Your Loan Eligibility Instantly
            </p>

            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
              <HeroFeature icon="▣" text="Quick Assessment" />
              <HeroFeature icon="◇" text="Multiple Lenders" />
              <HeroFeature icon="♨" text="100% Free" />
              <HeroFeature icon="▧" text="Higher Approval Chances" />
            </div>
          </div>

          <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="relative h-[135px] w-[350px]">

              <div className="absolute right-[100px] top-2 h-[125px] w-[100px] rounded-full bg-blue-400/20 blur-2xl" />

              <div className="absolute right-16 top-5 h-[110px] w-[85px] rounded-[45%] bg-gradient-to-b from-[#f6c59d] to-[#b96d45]" />

              <div className="absolute right-[-5px] top-10 rotate-[-6deg] rounded-xl bg-white px-5 py-3 shadow-xl">
                <div className="text-[10px] font-bold text-slate-700">
                  You May Be Eligible
                </div>

                <div className="text-lg font-extrabold text-blue-600">
                  up to
                </div>

                <div className="text-2xl font-extrabold text-blue-700">
                  ₹25 Lakh
                </div>
              </div>

              <div className="absolute bottom-0 right-1 flex gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-600" />
                <div className="h-10 w-10 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-600" />
                <div className="h-5 w-5 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-600" />
              </div>
            </div>
          </div>
        </section>

        {/* MAIN */}
        <section className="grid gap-5 xl:grid-cols-[1.06fr_0.94fr]">

          {/* FORM */}
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(30,60,100,0.06)] sm:p-6">

            {/* STEPS */}
            <div className="mb-6 flex items-start">
              {steps.map((item, index) => {
                const active = step >= index + 1;

                return (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div className="flex w-full items-center">

                      {index > 0 ? (
                        <div
                          className={`h-[2px] flex-1 ${
                            active
                              ? "bg-[#0879ff]"
                              : "bg-slate-200"
                          }`}
                        />
                      ) : (
                        <div className="flex-1" />
                      )}

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          active
                            ? "bg-[#0879ff] text-white shadow-md"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {index < steps.length - 1 ? (
                        <div
                          className={`h-[2px] flex-1 ${
                            step > index + 1
                              ? "bg-[#0879ff]"
                              : "bg-slate-200"
                          }`}
                        />
                      ) : (
                        <div className="flex-1" />
                      )}
                    </div>

                    <div className="mt-2 text-center text-[11px] font-bold leading-tight text-[#183d70]">
                      {item[0]}
                      <br />
                      {item[1]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2 className="text-[22px] font-extrabold text-[#10284d]">
                  Personal Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Please enter your basic details to check your loan
                  eligibility.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Full Name"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={setFullName}
                  />

                  <InputField
                    label="Date of Birth"
                    required
                    type="date"
                    placeholder="DD/MM/YYYY"
                    value={dob}
                    onChange={setDob}
                  />
                </div>

                <div className="mt-4">
                  <InputField
                    label="PAN Number"
                    required
                    placeholder="Enter PAN Number (e.g. ABCDE1234F)"
                    value={pan}
                    onChange={(value) =>
                      setPan(value.toUpperCase())
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-bold text-[#18365e]">
                    Mobile Number{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="flex h-[46px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="flex w-[82px] items-center justify-center border-r border-slate-200 bg-slate-50 text-sm font-bold">
                      🇮🇳 +91
                    </div>

                    <input
                      value={mobile}
                      onChange={(e) =>
                        setMobile(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10)
                        )
                      }
                      placeholder="Enter mobile number"
                      inputMode="numeric"
                      className="w-full px-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <InputField
                    label="Email Address (Optional)"
                    placeholder="Enter email address"
                    value={email}
                    onChange={setEmail}
                    type="email"
                  />
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 className="text-[22px] font-extrabold text-[#10284d]">
                  Employment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tell us about your employment and income.
                </p>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold">
                    Employment Type
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      "Salaried",
                      "Self Employed",
                      "Business",
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setEmploymentType(type)
                        }
                        className={`rounded-xl border p-4 text-sm font-bold ${
                          employmentType === type
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-slate-200 text-slate-600"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold">
                    Monthly Income
                  </label>

                  <input
                    value={income}
                    onChange={(e) =>
                      setIncome(
                        Number(
                          e.target.value.replace(/\D/g, "")
                        )
                      )
                    }
                    className="h-[46px] w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none"
                  />
                </div>

                <div className="mt-4">
                  <InputField
                    label="Company / Business Name"
                    placeholder="Enter company or business name"
                    value={company}
                    onChange={setCompany}
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-bold">
                    Work Experience
                  </label>

                  <select
                    value={experience}
                    onChange={(e) =>
                      setExperience(e.target.value)
                    }
                    className="h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option>Less than 1 Year</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5-8 Years</option>
                    <option>8+ Years</option>
                  </select>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <h2 className="text-[22px] font-extrabold text-[#10284d]">
                  Financial Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your existing financial obligations.
                </p>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold">
                    Existing Monthly EMI
                  </label>

                  <input
                    value={existingEmi}
                    onChange={(e) =>
                      setExistingEmi(
                        Number(
                          e.target.value.replace(/\D/g, "")
                        )
                      )
                    }
                    className="h-[46px] w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold">
                    Credit Score
                  </label>

                  <input
                    type="number"
                    min="300"
                    max="900"
                    value={creditScore}
                    onChange={(e) =>
                      setCreditScore(
                        Math.min(
                          Math.max(
                            Number(e.target.value),
                            300
                          ),
                          900
                        )
                      )
                    }
                    className="h-[46px] w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold">
                    Monthly Expenses
                  </label>

                  <input
                    value={expenses}
                    onChange={(e) =>
                      setExpenses(
                        Number(
                          e.target.value.replace(/\D/g, "")
                        )
                      )
                    }
                    className="h-[46px] w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold"
                  />
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                  <div className="text-xs font-bold text-blue-700">
                    Estimated Disposable Income
                  </div>

                  <div className="mt-1 text-2xl font-extrabold text-blue-700">
                    ₹{formatINR(eligibility.disposable)}
                  </div>
                </div>
              </>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-600">
                  ✓
                </div>

                <h2 className="mt-4 text-2xl font-extrabold">
                  Eligibility Assessment Complete
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Based on the information provided, we have
                  generated a preliminary eligibility estimate.
                </p>

                <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-emerald-50 p-5">
                  <div className="text-sm font-semibold text-emerald-700">
                    Estimated Eligible Amount
                  </div>

                  <div className="mt-1 text-3xl font-extrabold text-emerald-600">
                    ₹{formatINR(apiResult?.maxEligibleLoanAmount ?? eligibility.amount)}
                  </div>

                  {apiResult && (
                    <div className="mt-3 space-y-1 text-sm text-slate-700">
                      <p className="font-bold">
                        {apiResult.eligible ? "Eligible for requested amount" : "Requested amount is not eligible"}
                      </p>
                      <p>Estimated EMI: ₹{formatINR(apiResult.emi)} / month</p>
                      <p>Assessment score: {apiResult.approvalScore}/100</p>
                      <p>{apiResult.remarks}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {apiError && (
              <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {apiError}
              </div>
            )}
            {/* NAVIGATION */}
            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="h-11 rounded-lg bg-slate-100 px-6 text-sm font-bold"
                >
                  ← Back
                </button>
              )}

              {step < 4 && (
                <button
                  type="button"
                  onClick={next}
                  disabled={loading}
                  className="flex h-11 flex-1 items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#0879ff] to-[#0865e8] text-sm font-extrabold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Checking eligibility..." : "Next"}
                  {!loading && <span>→</span>}
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href =
                      "/dsa/apply-loan")
                  }
                  className="flex h-11 flex-1 items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#0db85a] to-[#08a34d] text-sm font-extrabold text-white"
                >
                  Apply for Loan
                  <span>→</span>
                </button>
              )}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(30,60,100,0.06)] sm:p-6">

            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-extrabold">
                Your Loan Eligibility Summary
              </h2>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                Preliminary Result
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-50 to-[#effcf6] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#16b86b] text-3xl font-bold text-white">
                  ✓
                </div>

                <div>
                  <div className="text-xs font-semibold">
                    You May Be Eligible For
                  </div>

                  <div className="text-[32px] font-extrabold text-[#10a95e]">
                    ₹{formatINR(apiResult?.maxEligibleLoanAmount ?? eligibility.amount)}
                  </div>

                  <div className="text-xs text-slate-500">
                    (₹ 5,00,000 - ₹ 25,00,000)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <SummaryStat
                icon="💰"
                title="Eligible Loan Amount"
                value={`₹${formatINR(apiResult?.maxEligibleLoanAmount ?? eligibility.amount)}`}
              />

              <SummaryStat
                icon="%"
                title="Estimated Interest Rate"
                value="10.5% - 18%"
              />

              <SummaryStat
                icon="▣"
                title="Preferred Tenure"
                value="12 - 60 Months"
              />

              <SummaryStat
                icon="⬟"
                title="Approval Chances"
                value={
                  creditScore >= 750
                    ? "High"
                    : creditScore >= 700
                      ? "Good"
                      : "Medium"
                }
                highlight
              />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-extrabold">
                Eligibility Score
                <span className="ml-1 text-slate-400">
                  ⓘ
                </span>
              </h3>

              <div className="mt-4 flex items-center gap-4">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500" />

                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-[#16b86b] text-white shadow-lg">
                  <div className="text-2xl font-extrabold">
                    {creditScore}
                  </div>

                  <div className="text-[10px] font-bold">
                    {creditScore >= 750
                      ? "Good"
                      : "Fair"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3 rounded-xl bg-emerald-50 p-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                ✓
              </div>

              <div className="text-xs leading-relaxed">
                <div className="font-bold">
                  Great! Based on the information provided,
                  you have a good chance of loan approval.
                </div>

                <div className="mt-1 text-slate-500">
                  Complete your application to get exact offers
                  from our partner lenders.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="mt-5 rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(30,60,100,0.06)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[19px] font-extrabold">
                Recommended Loan Products For You
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Based on your profile and eligibility
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600"
            >
              View All Lenders →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
              />
            ))}
          </div>
        </section>

        {/* INFO */}
        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <InfoCard
            icon="▤"
            title="Documents Required"
          >
            <Bullet text="PAN Card" />
            <Bullet text="Identity Proof (Voter ID / DL / Passport)" />
            <Bullet text="Address Proof (Utility Bill)" />
            <Bullet text="Income Proof (Salary Slip / ITR / Bank Statement)" />
            <Bullet text="Bank Statement (Last 3-6 months)" />
          </InfoCard>

          <InfoCard
            icon="▥"
            title="Factors Affecting Eligibility"
          >
            <Bullet text="Age & Employment Type" />
            <Bullet text="Monthly Income" />
            <Bullet text="Existing Loan Obligations" />
            <Bullet text="Credit Score" />
            <Bullet text="Company Profile" />
            <Bullet text="Repayment History" />
          </InfoCard>

          <InfoCard
            icon="💡"
            title="Why Check Eligibility?"
          >
            <Bullet text="Know your approximate loan amount" green />
            <Bullet text="Save time with pre-qualification" green />
            <Bullet text="Higher chances of approval" green />
            <Bullet text="Compare multiple offers" green />
            <Bullet text="Free preliminary assessment" green />
            <Bullet text="Get personalized lender recommendations" green />
          </InfoCard>
        </section>

        <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-800">
          <strong>Disclaimer:</strong> Eligibility shown is a
          preliminary estimate. Final approval, interest rate,
          tenure and loan amount are subject to lender policies,
          verification and credit assessment.
        </div>
      </div>
    </main>
  );
}

function HeroFeature({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-white sm:text-sm">
      <span className="text-lg text-cyan-300">
        {icon}
      </span>
      {text}
    </div>
  );
}

function InputField({
  label,
  required,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-[#18365e]">
        {label}{" "}
        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      <div className="flex h-[46px] items-center rounded-lg border border-slate-200 bg-white px-3">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function SummaryStat({
  icon,
  title,
  value,
  highlight = false,
}: {
  icon: string;
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            highlight
              ? "bg-purple-50 text-purple-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>

        <span className="text-[9px] font-semibold leading-tight text-slate-500">
          {title}
        </span>
      </div>

      <div
        className={`mt-2 text-sm font-extrabold ${
          highlight
            ? "text-purple-600"
            : "text-[#17365f]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ProductCard({
  product,
}: {
  product: LoanProduct;
}) {
  return (
    <div
      className={`flex min-h-[190px] flex-col rounded-xl border ${product.border} bg-white p-3 transition hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${product.iconBg} text-lg`}
        >
          {product.icon}
        </div>

        <div className="text-[10px] font-bold leading-tight text-[#0874e8]">
          {product.name}
        </div>
      </div>

      <div className="mt-4 text-xs font-extrabold text-[#17365f]">
        {product.amount}
      </div>

      <div className="mt-3">
        <div className="text-[9px] text-slate-400">
          Interest Rate
        </div>

        <div className="text-[10px] font-bold">
          {product.rate}
        </div>
      </div>

      <div className="mt-2">
        <div className="text-[9px] text-slate-400">
          Tenure
        </div>

        <div className="text-[10px] font-bold">
          {product.tenure}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams({
            product: product.name,
          });
          window.location.href = `/dsa/apply-loan/form?${params.toString()}`;
        }}
        className={`mt-auto flex h-8 items-center justify-center gap-1 rounded-md text-[10px] font-extrabold text-white transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${product.button}`}
      >
        Apply Now →
      </button>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(30,60,100,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-600">
          {icon}
        </div>

        <h3 className="text-sm font-extrabold text-[#10284d]">
          {title}
        </h3>
      </div>

      <div className="mt-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

function Bullet({
  text,
  green = false,
}: {
  text: string;
  green?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
          green
            ? "bg-emerald-100 text-emerald-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {green ? "✓" : "•"}
      </span>

      <span>{text}</span>
    </div>
  );
}



