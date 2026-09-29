"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const steps = [
  "Basic Information",
  "Employment Details",
  "Income Details",
  "Loan Requirement",
  "Documents",
  "Final Submission",
];

export default function DsaApplyLoanPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    panNo: "",
    dob: "",
    city: "",
    employmentType: "",
    companyName: "",
    monthlyIncome: "",
    existingEmi: "",
    loanType: "Personal Loan",
    loanAmount: "",
    tenure: "",
    loanPurpose: "",
    document: null as File | null,
  });

  const update = (key: string, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    setError("");

    if (step === 0) {
      if (
        !form.fullName ||
        !form.mobile ||
        !form.email ||
        !form.panNo ||
        !form.dob ||
        !form.city
      ) {
        setError("Please complete all basic information.");
        return;
      }
    }

    if (step === 1 && !form.employmentType) {
      setError("Please select employment type.");
      return;
    }

    if (
      step === 2 &&
      (!form.monthlyIncome || !form.existingEmi)
    ) {
      setError("Please enter income details.");
      return;
    }

    if (
      step === 3 &&
      (!form.loanType ||
        !form.loanAmount ||
        !form.tenure ||
        !form.loanPurpose)
    ) {
      setError("Please complete loan requirement details.");
      return;
    }

    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userRaw = localStorage.getItem("loan_finance_user");
      const token = localStorage.getItem("loan_finance_token");
      const user = userRaw ? JSON.parse(userRaw) : null;

      const payload = {
        ...form,
        document: undefined,
        userId: user?.id || user?.userId || undefined,
        monthlyIncome: Number(form.monthlyIncome),
        existingEmi: Number(form.existingEmi),
        loanAmount: Number(form.loanAmount),
        tenure: Number(form.tenure),
      };

      const res = await fetch(`${API}/loan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || "Unable to submit loan application."
        );
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.message ||
          "Something went wrong while submitting the application."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-5xl">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#071a3d]">
            Application Submitted
          </h1>

          <p className="mt-3 text-slate-500">
            Your loan application has been submitted successfully.
            Our team will review the application and guide you through
            the next steps.
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/dsa/dashboard"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>

            <Link
              href="/dsa/loan-applications"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              View Applications
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-blue-600">
              DSA FinCorp
            </p>

            <h1 className="mt-1 text-3xl font-black text-[#071a3d]">
              Apply for New Loan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Complete the application to submit a new customer loan.
            </p>
          </div>

          <Link
            href="/dsa/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">

            {steps.map((item, index) => (
              <div
                key={item}
                className="flex min-w-[110px] flex-1 items-center"
              >
                <div className="flex flex-col items-center">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                      index <= step
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {index < step ? "✓" : index + 1}
                  </div>

                  <span
                    className={`mt-2 text-center text-[10px] font-bold ${
                      index <= step
                        ? "text-blue-600"
                        : "text-slate-400"
                    }`}
                  >
                    {item}
                  </span>

                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-1 flex-1 rounded-full ${
                      index < step
                        ? "bg-blue-600"
                        : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}

          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >

          {/* STEP 1 */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-black text-[#071a3d]">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the customer's basic details.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <Field
                  label="Full Name"
                  value={form.fullName}
                  onChange={(v) => update("fullName", v)}
                  placeholder="Enter full name"
                  required
                />

                <Field
                  label="Mobile Number"
                  value={form.mobile}
                  onChange={(v) => update("mobile", v)}
                  placeholder="Enter mobile number"
                  required
                />

                <Field
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="Enter email address"
                  required
                />

                <Field
                  label="PAN Number"
                  value={form.panNo}
                  onChange={(v) =>
                    update("panNo", v.toUpperCase())
                  }
                  placeholder="Enter PAN number"
                  required
                />

                <Field
                  label="Date of Birth"
                  type="date"
                  value={form.dob}
                  onChange={(v) => update("dob", v)}
                  required
                />

                <Field
                  label="City"
                  value={form.city}
                  onChange={(v) => update("city", v)}
                  placeholder="Enter city"
                  required
                />

              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black text-[#071a3d]">
                Employment Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the customer's employment profile.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <SelectField
                  label="Employment Type"
                  value={form.employmentType}
                  onChange={(v) =>
                    update("employmentType", v)
                  }
                  options={[
                    "Salaried",
                    "Self Employed",
                    "Business Owner",
                  ]}
                />

                <Field
                  label="Company / Business Name"
                  value={form.companyName}
                  onChange={(v) =>
                    update("companyName", v)
                  }
                  placeholder="Enter company or business name"
                />

              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-[#071a3d]">
                Income Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter income and existing EMI information.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <Field
                  label="Monthly Income"
                  type="number"
                  value={form.monthlyIncome}
                  onChange={(v) =>
                    update("monthlyIncome", v)
                  }
                  placeholder="Enter monthly income"
                  required
                />

                <Field
                  label="Existing EMI"
                  type="number"
                  value={form.existingEmi}
                  onChange={(v) =>
                    update("existingEmi", v)
                  }
                  placeholder="Enter existing EMI"
                  required
                />

              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-[#071a3d]">
                Loan Requirement
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the customer's loan requirement.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <SelectField
                  label="Loan Type"
                  value={form.loanType}
                  onChange={(v) =>
                    update("loanType", v)
                  }
                  options={[
                    "Personal Loan",
                    "Business Loan",
                    "Home Loan",
                    "Home Loan Balance Transfer",
                    "Loan Against Property",
                    "New Car Loan",
                    "Used Car Loan",
                    "Car Loan Balance Transfer",
                    "Two Wheeler Loan",
                    "Education Loan",
                    "Gold Loan",
                    "Consumer Durable Loan",
                    "Medical Loan",
                    "Wedding Loan",
                    "Debt Consolidation Loan",
                    "Salary Loan",
                    "MSME Loan",
                    "Working Capital Loan",
                    "Machinery & Equipment Loan",
                    "Credit Card",
                  ]}
                />

                <Field
                  label="Loan Amount"
                  type="number"
                  value={form.loanAmount}
                  onChange={(v) =>
                    update("loanAmount", v)
                  }
                  placeholder="Enter loan amount"
                  required
                />

                <SelectField
                  label="Tenure"
                  value={form.tenure}
                  onChange={(v) =>
                    update("tenure", v)
                  }
                  options={[
                    "12",
                    "24",
                    "36",
                    "48",
                    "60",
                  ]}
                />

                <Field
                  label="Loan Purpose"
                  value={form.loanPurpose}
                  onChange={(v) =>
                    update("loanPurpose", v)
                  }
                  placeholder="Enter loan purpose"
                  required
                />

              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-black text-[#071a3d]">
                Document Upload
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload supporting documents for verification.
              </p>

              <div className="mt-7 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">

                <div className="text-4xl">
                  📄
                </div>

                <h3 className="mt-3 font-black text-[#071a3d]">
                  Upload Document
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  PDF, JPG or PNG
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    update(
                      "document",
                      e.target.files?.[0] || null
                    )
                  }
                  className="mx-auto mt-5 block max-w-full text-sm"
                />

                {form.document && (
                  <p className="mt-3 text-sm font-bold text-blue-600">
                    {form.document.name}
                  </p>
                )}

              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-black text-[#071a3d]">
                Final Submission
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the application before submitting.
              </p>

              <div className="mt-7 grid gap-4 md:grid-cols-2">

                {[
                  ["Full Name", form.fullName],
                  ["Mobile", form.mobile],
                  ["Email", form.email],
                  ["PAN", form.panNo],
                  ["DOB", form.dob],
                  ["City", form.city],
                  ["Employment", form.employmentType],
                  ["Company", form.companyName || "-"],
                  ["Monthly Income", form.monthlyIncome],
                  ["Existing EMI", form.existingEmi],
                  ["Loan Type", form.loanType],
                  ["Loan Amount", form.loanAmount],
                  ["Tenure", `${form.tenure} Months`],
                  ["Purpose", form.loanPurpose],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                      {label}
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#071a3d]">
                      {value}
                    </p>
                  </div>
                ))}

              </div>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                Please verify all customer details before submitting
                the loan application.
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">

            <button
              type="button"
              onClick={() =>
                setStep((s) => Math.max(0, s - 1))
              }
              disabled={step === 0 || loading}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-700"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-500 px-7 py-3 text-sm font-black text-white shadow-sm hover:bg-emerald-600 disabled:opacity-60"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Loan Application ✓"}
              </button>
            )}

          </div>

        </form>
      </div>
    </main>
  );
}


function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-slate-600">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-[#071a3d] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </label>
  );
}


function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-slate-600">
        {label}
        <span className="ml-1 text-red-500">*</span>
      </span>

      <select
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-[#071a3d] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
            {label === "Tenure" ? " Months" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
