"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  User,
} from "lucide-react";

type FormData = {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  pan: string;
  employment: string;
  monthlyIncome: string;
  city: string;
  pincode: string;
};

const offerDetails: Record<
  string,
  {
    company: string;
    loan: string;
    category: string;
    amount: string;
    rate: string;
    tenure: string;
    fee: string;
  }
> = {
  "poonawalla-personal": {
    company: "Poonawalla Fincorp",
    loan: "Personal Loan",
    category: "Personal",
    amount: "Up to ₹20 Lakh",
    rate: "From 10.99% p.a.",
    tenure: "Up to 7 Years",
    fee: "Up to 2%",
  },
  "bajaj-personal": {
    company: "Bajaj Finance",
    loan: "Personal Loan",
    category: "Personal",
    amount: "Up to ₹40 Lakh",
    rate: "From 11% p.a.",
    tenure: "Up to 8 Years",
    fee: "Up to 2%",
  },
  "tata-personal": {
    company: "Tata Capital",
    loan: "Personal Loan",
    category: "Personal",
    amount: "Up to ₹35 Lakh",
    rate: "From 10.99% p.a.",
    tenure: "Up to 7 Years",
    fee: "Up to 2%",
  },
};

function LoanApplicationFormContent() {
  const params = useSearchParams();

  const offerId = params.get("offer") || "";
  const companyParam = params.get("company") || "";
  const productParam = params.get("product") || "";

  const offer = useMemo(() => {
    if (offerId && offerDetails[offerId]) {
      return offerDetails[offerId];
    }

    return {
      company: companyParam || "Selected Lender",
      loan: productParam || "Loan Application",
      category: "Loan",
      amount: "As per eligibility",
      rate: "As per lender policy",
      tenure: "As per lender policy",
      fee: "As per lender policy",
    };
  }, [offerId, companyParam, productParam]);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    mobile: "",
    email: "",
    dob: "",
    pan: "",
    employment: "",
    monthlyIncome: "",
    city: "",
    pincode: "",
  });

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const submitApplication = () => {
    alert(
      `Application started for ${offer.company} - ${offer.loan}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">

        {/* TOP BAR */}
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/dsa/apply-loan"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Back to Offers
          </a>

          <div className="hidden items-center gap-2 text-xs font-bold text-slate-400 md:flex">
            <ShieldCheck size={16} />
            Secure Application
          </div>
        </div>

        {/* SELECTED OFFER */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-5 py-7 text-white md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-100">
                  <CheckCircle2 size={13} />
                  Selected Loan Offer
                </div>

                <h1 className="text-2xl font-black md:text-3xl">
                  {offer.loan}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-100">
                  <Building2 size={16} />
                  {offer.company}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  Offer Reference
                </div>
                <div className="mt-1 font-mono text-sm font-black">
                  {offerId || "CUSTOM"}
                </div>
              </div>

            </div>
          </div>

          {/* OFFER SUMMARY */}
          <div className="grid gap-px border-b border-slate-200 bg-slate-200 md:grid-cols-4">

            <div className="bg-white p-5">
              <div className="text-[10px] font-black uppercase text-slate-400">
                Loan Amount
              </div>
              <div className="mt-2 flex items-center gap-1 text-lg font-black text-slate-900">
                <IndianRupee size={17} />
                {offer.amount.replace("₹", "")}
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="text-[10px] font-black uppercase text-slate-400">
                Interest Rate
              </div>
              <div className="mt-2 text-lg font-black text-emerald-600">
                {offer.rate}
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="text-[10px] font-black uppercase text-slate-400">
                Tenure
              </div>
              <div className="mt-2 text-lg font-black text-slate-900">
                {offer.tenure}
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="text-[10px] font-black uppercase text-slate-400">
                Processing Fee
              </div>
              <div className="mt-2 text-lg font-black text-slate-900">
                {offer.fee}
              </div>
            </div>

          </div>

          {/* PROGRESS */}
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 md:px-8">
            <div className="flex items-center justify-between">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex flex-1 items-center"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                      step >= item
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {item}
                  </div>

                  {item < 3 && (
                    <div
                      className={`mx-2 h-1 flex-1 rounded-full ${
                        step > item
                          ? "bg-blue-600"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}

            </div>

            <div className="mt-3 grid grid-cols-3 text-[10px] font-black uppercase text-slate-400">
              <span>Basic Details</span>
              <span className="text-center">Profile</span>
              <span className="text-right">Review</span>
            </div>
          </div>

          {/* FORM */}
          <div className="p-5 md:p-8">

            {step === 1 && (
              <section>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xl font-black">
                    <User size={21} className="text-blue-600" />
                    Basic Details
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the applicant's basic information.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      Full Name *
                    </span>
                    <input
                      value={form.fullName}
                      onChange={(e) =>
                        update("fullName", e.target.value)
                      }
                      placeholder="Enter full name"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      Mobile Number *
                    </span>
                    <input
                      value={form.mobile}
                      onChange={(e) =>
                        update("mobile", e.target.value)
                      }
                      placeholder="10 digit mobile number"
                      maxLength={10}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      Email Address
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        update("email", e.target.value)
                      }
                      placeholder="name@example.com"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      Date of Birth *
                    </span>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) =>
                        update("dob", e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      PAN Number *
                    </span>
                    <input
                      value={form.pan}
                      onChange={(e) =>
                        update("pan", e.target.value.toUpperCase())
                      }
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold uppercase outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <div className="mb-6">
                  <div className="text-xl font-black">
                    Employment & Profile
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Provide information used for eligibility assessment.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <label>
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      Employment Type *
                    </span>
                    <select
                      value={form.employment}
                      onChange={(e) =>
                        update("employment", e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="">Select employment type</option>
                      <option value="Salaried">Salaried</option>
                      <option value="Self Employed">Self Employed</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      Monthly Income *
                    </span>
                    <input
                      value={form.monthlyIncome}
                      onChange={(e) =>
                        update("monthlyIncome", e.target.value)
                      }
                      placeholder="₹ Monthly income"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      City *
                    </span>
                    <input
                      value={form.city}
                      onChange={(e) =>
                        update("city", e.target.value)
                      }
                      placeholder="Enter city"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      PIN Code *
                    </span>
                    <input
                      value={form.pincode}
                      onChange={(e) =>
                        update("pincode", e.target.value)
                      }
                      placeholder="6 digit PIN code"
                      maxLength={6}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </label>

                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <div className="mb-6">
                  <div className="text-xl font-black">
                    Review Application
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Verify the information before continuing.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  {[
                    ["Lender", offer.company],
                    ["Loan", offer.loan],
                    ["Name", form.fullName || "Not provided"],
                    ["Mobile", form.mobile || "Not provided"],
                    ["Email", form.email || "Not provided"],
                    ["DOB", form.dob || "Not provided"],
                    ["PAN", form.pan || "Not provided"],
                    ["Employment", form.employment || "Not provided"],
                    ["Monthly Income", form.monthlyIncome || "Not provided"],
                    ["City", form.city || "Not provided"],
                    ["PIN Code", form.pincode || "Not provided"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="text-[10px] font-black uppercase text-slate-400">
                        {label}
                      </div>
                      <div className="mt-1 text-sm font-black text-slate-800">
                        {value}
                      </div>
                    </div>
                  ))}

                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-900">
                  By continuing, the application will be processed subject
                  to the selected lender's eligibility criteria, policies
                  and verification requirements.
                </div>
              </section>
            )}

            {/* ACTIONS */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={previousStep}
                disabled={step === 1}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-blue-200"
                >
                  Next
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitApplication}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200"
                >
                  Start Application
                  <CheckCircle2 size={17} />
                </button>
              )}

            </div>

          </div>
        </section>

        <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
          Loan approval, interest rate, amount, tenure and processing fee
          are subject to lender policies and applicant eligibility.
        </p>

      </div>
    </main>
  );
}
export default function LoanApplicationForm() {
  return (
    <Suspense fallback={<div>Loading loan application...</div>}>
      <LoanApplicationFormContent />
    </Suspense>
  );
}
