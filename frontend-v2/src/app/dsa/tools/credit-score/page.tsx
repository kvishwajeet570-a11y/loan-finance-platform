"use client";

import { useState, type ReactNode } from "react";

type Product = {
  name: string;
  icon: string;
  amount: string;
  rate: string;
  tenure: string;
  box: string;
  button: string;
};

const products: Product[] = [
  {
    name: "Personal Loan",
    icon: "👤",
    amount: "₹50K - 25L",
    rate: "10.5% - 16%",
    tenure: "12 - 60 Months",
    box: "border-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "Business Loan",
    icon: "💼",
    amount: "₹1L - 1Cr",
    rate: "11% - 18%",
    tenure: "12 - 84 Months",
    box: "border-purple-200",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  {
    name: "Home Loan",
    icon: "🏠",
    amount: "₹10L - 5Cr",
    rate: "8.5% - 11%",
    tenure: "60 - 360 Months",
    box: "border-emerald-200",
    button: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    name: "Loan Against Property",
    icon: "🏢",
    amount: "₹10L - 10Cr",
    rate: "9% - 13%",
    tenure: "12 - 180 Months",
    box: "border-orange-200",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  {
    name: "Car Loan",
    icon: "🚗",
    amount: "₹1L - 50L",
    rate: "9% - 15%",
    tenure: "12 - 84 Months",
    box: "border-rose-200",
    button: "bg-rose-500 hover:bg-rose-600",
  },
  {
    name: "Education Loan",
    icon: "🎓",
    amount: "₹50K - 50L",
    rate: "9% - 14%",
    tenure: "12 - 180 Months",
    box: "border-violet-200",
    button: "bg-violet-600 hover:bg-violet-700",
  },
];

export default function CreditScorePage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const checkScore = async () => {
    if (!name.trim() || !dob || !pan.trim() || !mobile.trim()) {
      alert("Please fill all required details.");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(pan.trim())) {
      setApiError("Please enter a valid PAN number.");
      return;
    }
    if (!/^[6-9][0-9]{9}$/.test(mobile.trim())) {
      setApiError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setApiError("");
    setChecked(false);
    setScore(null);
    try {
      const token = localStorage.getItem("loan_finance_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${baseUrl}/credit-score/dsa-check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ panNo: pan.trim().toUpperCase() }),
      });
      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || `Request failed (${response.status})`);
      }
      const payload = result?.data ?? result?.result ?? result;
      const returnedScore = Number(payload?.score);
      if (!Number.isFinite(returnedScore) || returnedScore < 300 || returnedScore > 900) {
        throw new Error("API ne valid score return nahi kiya.");
      }
      setScore(returnedScore);
      setChecked(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Credit score request failed.");
    } finally {
      setLoading(false);
    }
  };

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
            Credit Score
          </span>
        </div>

        {/* HERO */}
        <section className="relative mb-5 min-h-[165px] overflow-hidden rounded-[16px] bg-gradient-to-r from-[#061d43] via-[#07376e] to-[#062b61] px-6 py-7 shadow-[0_8px_30px_rgba(5,38,85,0.14)] sm:px-8 lg:px-9">

          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 max-w-[780px]">
            <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-white sm:text-[42px] lg:text-[48px]">
              Check Your{" "}
              <span className="bg-gradient-to-r from-[#17b9ff] to-[#3bd5ff] bg-clip-text text-transparent">
                Credit Score
              </span>
            </h1>

            <p className="mt-2 text-base font-medium text-white/90 sm:text-lg">
              Know Your Financial Health in Just 2 Minutes
            </p>

            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
              <HeroFeature
                icon="▣"
                text="Instant Report"
              />

              <HeroFeature
                icon="▤"
                text="Detailed Analysis"
              />

              <HeroFeature
                icon="◇"
                text="Personalized Tips"
              />

              <HeroFeature
                icon="▣"
                text="100% Secure"
              />
            </div>
          </div>

          {/* HERO DECORATION */}
          <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="relative h-[135px] w-[390px]">

              <div className="absolute right-[105px] top-1 h-[130px] w-[105px] rounded-full bg-blue-400/20 blur-2xl" />

              <div className="absolute right-[85px] top-4 h-[110px] w-[90px] rounded-[45%] bg-gradient-to-b from-[#f4c39d] to-[#b76a44]" />

              <div className="absolute right-[-5px] top-8 rotate-[-6deg] rounded-xl border border-white/30 bg-white px-5 py-3 shadow-xl">
                <div className="text-[10px] font-bold text-slate-700">
                  CREDIT SCORE
                </div>

                <div className="mt-1 text-3xl font-extrabold text-[#079b63]">
                  780
                </div>

                <div className="text-xs font-bold text-emerald-600">
                  Excellent
                </div>
              </div>

              <div className="absolute bottom-0 right-0 flex items-end gap-2">
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

            <h2 className="text-[22px] font-extrabold">
              Get Your Credit Score
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your basic details to check your credit score instantly.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <InputField
                label="Full Name"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={setName}
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
                  className="w-full px-3 text-sm outline-none placeholder:text-slate-400"
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

            <label className="mt-5 flex cursor-pointer items-start gap-2 text-[11px] text-slate-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) =>
                  setAgreed(e.target.checked)
                }
                className="mt-0.5 h-4 w-4 accent-blue-600"
              />

              <span>
                I agree to the{" "}
                <span className="font-bold text-blue-600 underline">
                  Terms & Conditions
                </span>{" "}
                and authorize to fetch my credit report.
              </span>
            </label>

            <button
              type="button"
              onClick={checkScore}
              disabled={loading}
              className="mt-5 flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#0879ff] to-[#0865e8] text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:from-[#056de9] hover:to-[#055dcc]"
            >
              {loading ? "Checking..." : "Check Credit Score"}
              <span>→</span>
            </button>

            <div className="mt-3 text-center text-[11px] font-medium text-slate-400">
              🔒 Your information is 100% secure and encrypted
            </div>

            {apiError && (
              <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-bold text-red-700">{apiError}</div>
            )}
            {checked && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-700">
                API response received. This score is not verified by a credit bureau.
              </div>
            )}
          </div>

          {/* SCORE */}
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(30,60,100,0.06)] sm:p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-[20px] font-extrabold">
                Your Credit Score
              </h2>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                Latest Report
              </span>

            </div>

            {/* SCORE GAUGE */}
            <div className="relative mx-auto mt-5 h-[245px] max-w-[430px]">

              <div className="absolute left-1/2 top-4 h-[175px] w-[300px] -translate-x-1/2 overflow-hidden">

                <div className="absolute left-1/2 top-0 h-[285px] w-[285px] -translate-x-1/2 rounded-full border-[38px] border-red-500" />

                <div className="absolute left-1/2 top-0 h-[285px] w-[285px] -translate-x-1/2 rotate-[25deg] rounded-full border-[38px] border-orange-400" />

                <div className="absolute left-1/2 top-0 h-[285px] w-[285px] -translate-x-1/2 rotate-[52deg] rounded-full border-[38px] border-yellow-400" />

                <div className="absolute left-1/2 top-0 h-[285px] w-[285px] -translate-x-1/2 rotate-[82deg] rounded-full border-[38px] border-lime-400" />

                <div className="absolute left-1/2 top-0 h-[285px] w-[285px] -translate-x-1/2 rotate-[112deg] rounded-full border-[38px] border-emerald-500" />

              </div>

              <div className="absolute left-1/2 top-[115px] -translate-x-1/2 text-center">

                <div className="text-[48px] font-extrabold leading-none text-[#0c8d61]">
                  {score ?? "--"}
                </div>

                <div className="mt-1 text-lg font-extrabold text-emerald-600">
                  Good
                </div>

              </div>

              <div className="absolute left-1/2 top-[-2px] -translate-x-1/2 text-center">
                <div className="text-xs font-bold text-slate-700">
                  Good
                </div>
                <div className="text-[10px] text-slate-500">
                  670 - 739
                </div>
              </div>

              <div className="absolute left-0 top-[88px] text-center">
                <div className="text-xs font-bold">
                  Fair
                </div>
                <div className="text-[10px] text-slate-500">
                  580 - 669
                </div>
              </div>

              <div className="absolute left-1 top-[143px] text-center">
                <div className="text-xs font-bold">
                  Poor
                </div>
                <div className="text-[10px] text-slate-500">
                  300 - 579
                </div>
              </div>

              <div className="absolute right-0 top-[88px] text-center">
                <div className="text-xs font-bold">
                  Very Good
                </div>
                <div className="text-[10px] text-slate-500">
                  740 - 799
                </div>
              </div>

              <div className="absolute right-2 top-[143px] text-center">
                <div className="text-xs font-bold">
                  Excellent
                </div>
                <div className="text-[10px] text-slate-500">
                  800 - 900
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mt-1 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">

              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                ✓
              </div>

              <div>
                <div className="text-xs font-bold text-[#18365e]">
                  Great! Your credit score is in the{" "}
                  <span className="text-emerald-600">
                    Good
                  </span>{" "}
                  range.
                </div>

                <div className="mt-1 text-[11px] text-slate-500">
                  You have a high chance of loan approval with competitive interest rates.
                </div>
              </div>

            </div>

            {/* SCORE STATS */}
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

              <ScoreStat
                icon="▥"
                title="Score Range"
                value="740 - 799"
              />

              <ScoreStat
                icon="♥"
                title="Credit Health"
                value="Good"
                green
              />

              <ScoreStat
                icon="↗"
                title="Improvement Chance"
                value="High"
                orange
              />

              <ScoreStat
                icon="▣"
                title="Next Update"
                value="30 Days"
                purple
              />

            </div>
          </div>
        </section>

        {/* INFORMATION CARDS */}
        <section className="mt-5 grid gap-5 lg:grid-cols-3">

          <InfoCard
            icon="▥"
            title="What is Credit Score?"
          >
            <p className="text-[11px] leading-relaxed text-slate-600">
              A credit score is a 3-digit number (300-900)
              that represents your creditworthiness. It is
              based on your credit history, repayment behavior,
              and financial activities.
            </p>

            <button
              type="button"
              className="mt-3 rounded-lg bg-blue-50 px-4 py-2 text-[11px] font-bold text-blue-600"
            >
              Learn More →
            </button>
          </InfoCard>

          <InfoCard
            icon="▥"
            title="Benefits of a Good Credit Score"
          >
            <Bullet text="Higher loan approval chances" green />
            <Bullet text="Lower interest rates" green />
            <Bullet text="Higher loan amounts" green />
            <Bullet text="Better credit card offers" green />
            <Bullet text="Easier loan processing" green />
            <Bullet text="Builds financial credibility" green />
          </InfoCard>

          <InfoCard
            icon="💡"
            title="Tips to Improve Your Credit Score"
          >
            <Bullet text="Pay EMIs and bills on time" green />
            <Bullet text="Keep credit card utilization low" green />
            <Bullet text="Maintain a healthy credit mix" green />
            <Bullet text="Avoid multiple loan applications" green />
            <Bullet text="Check your credit report regularly" green />
            <Bullet text="Keep old credit accounts active" green />
          </InfoCard>

        </section>

        {/* PRODUCTS */}
        <section className="mt-5 rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_5px_24px_rgba(30,60,100,0.06)] sm:p-6">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <h2 className="text-[19px] font-extrabold">
                Recommended Loan Products For You
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Based on your credit score and profile
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600"
            >
              View All Lenders →
            </button>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">

            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
              />
            ))}

          </div>
        </section>

        {/* DISCLAIMER */}
        <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-800">
          <strong>Disclaimer:</strong> The displayed credit
          score is a UI demonstration. Actual credit score,
          credit report and lender decisions depend on the
          authorized credit bureau and applicable lender policies.
        </div>

      </div>
    </main>
  );
}

/* COMPONENTS */

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

      <div className="flex h-[46px] items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />

      </div>
    </div>
  );
}

function ScoreStat({
  icon,
  title,
  value,
  green,
  orange,
  purple,
}: {
  icon: string;
  title: string;
  value: string;
  green?: boolean;
  orange?: boolean;
  purple?: boolean;
}) {
  const iconClass = green
    ? "bg-emerald-50 text-emerald-600"
    : orange
      ? "bg-orange-50 text-orange-500"
      : purple
        ? "bg-purple-50 text-purple-600"
        : "bg-blue-50 text-blue-600";

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">

      <div className="flex items-center gap-2">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>

        <span className="text-[9px] font-semibold leading-tight text-slate-500">
          {title}
        </span>

      </div>

      <div className="mt-2 text-sm font-extrabold text-[#17365f]">
        {value}
      </div>

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

      <div className="mt-4">
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
    <div className="mb-2 flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">

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

function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div
      className={`flex min-h-[190px] flex-col rounded-xl border ${product.box} bg-white p-3 transition hover:-translate-y-1 hover:shadow-md`}
    >

      <div className="flex items-center gap-2">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg">
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

        <div className="text-[10px] font-bold text-[#18365e]">
          {product.rate}
        </div>
      </div>

      <div className="mt-2">
        <div className="text-[9px] text-slate-400">
          Tenure
        </div>

        <div className="text-[10px] font-bold text-[#18365e]">
          {product.tenure}
        </div>
      </div>

      <button
        type="button" onClick={() => { const loanType = product.name === "Car Loan" ? "Vehicle Loan" : product.name; const supported = ["Personal Loan", "Business Loan", "Home Loan", "Vehicle Loan"]; if (!supported.includes(loanType)) { window.alert(`${product.name} ke liye abhi lender offer configured nahi hai.`); return; } window.location.href = `/dsa/apply-loan?product=${encodeURIComponent(loanType)}`; }}
        className={`mt-auto flex h-8 items-center justify-center gap-1 rounded-md text-[10px] font-extrabold text-white ${product.button}`}
      >
        Apply Now →
      </button>

    </div>
  );
}


