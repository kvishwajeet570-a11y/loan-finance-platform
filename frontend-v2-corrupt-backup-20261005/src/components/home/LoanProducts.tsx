"use client";

import { useState } from "react";
import {
  UserRound,
  BriefcaseBusiness,
  House,
  Car,
  GraduationCap,
  ShoppingCart,
  X,
  ArrowRight,
  ShieldCheck,
  Phone,
} from "lucide-react";

type LoanType =
  | "PERSONAL_LOAN"
  | "BUSINESS_LOAN"
  | "HOME_LOAN"
  | "CAR_LOAN"
  | "EDUCATION_LOAN"
  | "CREDIT_CARD";

type Loan = {
  title: string;
  description: string;
  image: string;
  type: LoanType;
  icon: React.ElementType;
};

const loans: Loan[] = [
  {
    title: "Personal Loan",
    description: "Explore personal financing options",
    image: "/images/loans/personal-loan.png",
    type: "PERSONAL_LOAN",
    icon: UserRound,
  },
  {
    title: "Business Loan",
    description: "Finance your business requirements",
    image: "/images/loans/business-loan.png",
    type: "BUSINESS_LOAN",
    icon: BriefcaseBusiness,
  },
  {
    title: "Home Loan",
    description: "Explore home finance options",
    image: "/images/loans/home-loan.png",
    type: "HOME_LOAN",
    icon: House,
  },
  {
    title: "Car Loan",
    description: "Explore vehicle financing options",
    image: "/images/loans/car-loan.png",
    type: "CAR_LOAN",
    icon: Car,
  },
  {
    title: "Education Loan",
    description: "Support education-related needs",
    image: "/images/loans/education-loan.png",
    type: "EDUCATION_LOAN",
    icon: GraduationCap,
  },
  {
    title: "Consumer Finance",
    description: "Explore consumer financing",
    image: "/images/loans/consumer-loan.png",
    type: "CREDIT_CARD",
    icon: ShoppingCart,
  },
];

export default function LoanProducts() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const openApply = (loan: Loan) => {
    setSelectedLoan(loan);
    setName("");
    setPan("");
    setMobile("");
    setMessage("");
    setError("");
  };

  const closeApply = () => {
    if (!loading) {
      setSelectedLoan(null);
      setMessage("");
      setError("");
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanPan = pan.trim().toUpperCase();
    const cleanMobile = mobile.replace(/\D/g, "");

    if (cleanName.length < 3) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setError("Please enter a valid PAN number.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!selectedLoan) return;

    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${apiUrl}/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: cleanName,
          mobileNumber: cleanMobile,
          panNo: cleanPan,
          productType: selectedLoan.type,
          source: "WEBSITE",
          priority: "HIGH",
          remarks: `Apply Form - ${selectedLoan.title}`,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Application submission failed.");
      }

      setMessage(
        `${selectedLoan.title} application submitted successfully. Our team will contact you shortly.`
      );

      setName("");
      setPan("");
      setMobile("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="loans" className="relative overflow-hidden bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-[1450px] px-5 sm:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#06295c] sm:text-4xl">
              Our Loan Products
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Choose the right loan for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loans.map((loan) => {
              const Icon = loan.icon;

              return (
                <button
                  key={loan.type}
                  type="button"
                  onClick={() => openApply(loan)}
                  className="group relative h-[190px] overflow-hidden rounded-[20px] border border-blue-100 bg-white text-left shadow-[0_8px_30px_rgba(30,90,180,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_15px_40px_rgba(30,90,180,0.18)]"
                >
                  <img
                    src={loan.image}
                    alt={loan.title}
                    className="absolute inset-0 h-full w-full object-fill transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/45 via-[48%] to-transparent" />

                  <div className="relative z-10 flex h-full w-[62%] flex-col justify-between p-5">
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                        <Icon size={21} strokeWidth={2.2} />
                      </div>

                      <h3 className="text-[18px] font-extrabold text-[#06295c]">
                        {loan.title}
                      </h3>

                      <p className="mt-2 text-[11px] leading-5 text-slate-600">
                        {loan.description}
                      </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[11px] font-bold text-blue-600 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white">
                      Explore
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedLoan && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeApply();
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[26px] bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeApply}
              disabled={loading}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <selectedLoan.icon size={27} />
              </div>

              <h2 className="text-2xl font-extrabold text-[#06295c]">
                Apply for{" "}
                <span className="text-blue-600">{selectedLoan.title}</span>
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Just enter your basic details and our team will contact you.
              </p>
            </div>

            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#06295c]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="h-13 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-900 caret-blue-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" style={{ WebkitTextFillColor: "#0f172a" }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#06295c]">
                  PAN Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={pan}
                  onChange={(e) =>
                    setPan(e.target.value.toUpperCase().slice(0, 10))
                  }
                  placeholder="Enter PAN number (e.g. ABCDE1234F)"
                  maxLength={10}
                  autoComplete="off"
                  className="h-13 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium uppercase text-slate-900 caret-blue-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" style={{ WebkitTextFillColor: "#0f172a" }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#06295c]">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="Enter your 10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  className="h-13 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-900 caret-blue-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" style={{ WebkitTextFillColor: "#0f172a" }}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Apply Now"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={17} className="text-blue-600" />
                100% Secure
              </div>

              <div className="flex items-center justify-center gap-2">
                <Phone size={16} className="text-blue-600" />
                Quick Response
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



